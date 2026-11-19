"""Leitura e gravação dos arquivos JavaScript usados pelo site.

O leitor aceita listas e objetos literais, sem executar o JavaScript. Guardamos
as posições dos registros para alterar apenas o trecho necessário no arquivo.
"""
import ast
import hashlib
import json
import os
import re
import tempfile


def ler_dados(arquivo, nome, com_posicoes=False):
    """Lê o subconjunto de objetos JavaScript usado pelos catálogos do projeto."""
    texto = arquivo.read_bytes().decode('utf-8')
    # Reconhece espaços, comentários, textos, nomes, números e sinais do cadastro.
    padrao = re.compile(
        r'''\s+|//[^\n]*|/\*[\s\S]*?\*/'''
        r"""|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'"""
        r'''|[A-Za-z_$][\w$]*|-?\d+(?:\.\d+)?|[][{}:;,=]'''
    )
    partes = []
    posicoes = []
    posicao = 0
    while posicao < len(texto):
        trecho = padrao.match(texto, posicao)
        if not trecho:
            raise ValueError(f'Formato inesperado em {arquivo.name}, posição {posicao}.')
        parte = trecho.group()
        if not parte.isspace() and not parte.startswith(('//', '/*')):
            partes.append(parte)
            posicoes.append((trecho.start(), trecho.end()))
        posicao = trecho.end()
    if partes[:3] != ['const', nome, '=']:
        raise ValueError(f'Cadastro inválido em {arquivo.name}.')
    indice = 3
    itens = []
    virgulas = []
    fim_lista = None

    def ler_valor():
        # Uma lista ou objeto pode conter outros valores; por isso a função
        # chama a si mesma até chegar aos textos, números ou valores simples.
        nonlocal indice, fim_lista
        if indice >= len(partes):
            raise ValueError('Cadastro incompleto.')
        atual = partes[indice]
        indice += 1
        if atual in ('[', '{'):
            lista_principal = indice == 4
            e_objeto = atual == '{'
            fim = '}' if e_objeto else ']'
            resultado = {} if e_objeto else []
            while indice < len(partes) and partes[indice] != fim:
                if e_objeto:
                    chave = partes[indice]
                    indice += 1
                    if chave.startswith(('"', "'")):
                        chave = json.loads(chave) if chave.startswith('"') else ast.literal_eval(chave)
                    if indice >= len(partes) or partes[indice] != ':':
                        raise ValueError('Campo inválido no cadastro.')
                    indice += 1
                    resultado[chave] = ler_valor()
                else:
                    inicio_item = posicoes[indice][0]
                    resultado.append(ler_valor())
                    if lista_principal:
                        itens.append((inicio_item, posicoes[indice - 1][1]))
                if indice < len(partes) and partes[indice] == ',':
                    if lista_principal:
                        virgulas.append(posicoes[indice][0])
                    indice += 1
                elif indice >= len(partes) or partes[indice] != fim:
                    raise ValueError('Separador inválido no cadastro.')
            if indice >= len(partes):
                raise ValueError('Cadastro incompleto.')
            if lista_principal:
                fim_lista = posicoes[indice][0]
            indice += 1
            return resultado
        if atual.startswith('"') or atual in ('null', 'true', 'false') or re.fullmatch(r'-?\d+(?:\.\d+)?', atual):
            return json.loads(atual)
        if atual.startswith("'"):
            return ast.literal_eval(atual)
        raise ValueError('Valor inválido no cadastro.')

    resultado = ler_valor()
    if partes[indice:] not in ([], [';']) or not isinstance(resultado, list):
        raise ValueError('Conteúdo inesperado após o cadastro.')
    return (resultado, texto, itens, virgulas, fim_lista) if com_posicoes else resultado


def gravar_arquivo(destino, conteudo):
    # Primeiro escreve em um arquivo temporário; depois substitui o original.
    nome_temp = None
    try:
        with tempfile.NamedTemporaryFile(mode='w', encoding='utf-8', newline='', dir=destino.parent, delete=False) as arquivo:
            nome_temp = arquivo.name
            arquivo.write(conteudo)
        os.replace(nome_temp, destino)
    finally:
        if nome_temp and os.path.exists(nome_temp):
            os.unlink(nome_temp)


def versao(material):
    # Cria uma identificação do conteúdo para detectar alterações em outra aba.
    dados = json.dumps(material, ensure_ascii=False, sort_keys=True, separators=(',', ':'))
    return hashlib.sha256(dados.encode('utf-8')).hexdigest()


def atualizar_texto(texto, itens, virgulas, fim_lista, indice, material=None):
    """Altera apenas o registro escolhido e a pontuação necessária da lista."""
    if material is not None:
        registro = json.dumps(material, ensure_ascii=False, indent=2).replace('\n', '\n  ')
        if indice is not None:
            inicio, fim = itens[indice]
            return texto[:inicio] + registro + texto[fim:]
        if itens and len(virgulas) < len(itens):
            fim_ultimo = itens[-1][1]
            texto = texto[:fim_ultimo] + ',' + texto[fim_ultimo:]
            fim_lista += 1
        prefixo = '' if texto[:fim_lista].endswith(('\n', '\r')) else '\n'
        return texto[:fim_lista] + prefixo + '  ' + registro + '\n' + texto[fim_lista:]
    inicio, fim = itens[indice]
    if indice < len(virgulas):
        return texto[:inicio] + texto[fim:virgulas[indice]] + texto[virgulas[indice] + 1:]
    if indice > 0:
        virgula = virgulas[indice - 1]
        return texto[:virgula] + texto[virgula + 1:inicio] + texto[fim:]
    return texto[:inicio] + texto[fim:]


