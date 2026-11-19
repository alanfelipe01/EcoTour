"""Regras de cadastro e vínculos de materiais do painel local."""
import re
from datetime import date
from pathlib import Path
from urllib.parse import urlsplit

from arquivos import atualizar_texto, gravar_arquivo, ler_dados, versao

RAIZ = Path(__file__).resolve().parent.parent
ARQUIVO_MATERIAIS = RAIZ / 'assets/data/materiais.js'
ARQUIVO_PONTOS = RAIZ / 'assets/data/pontos-descarte.js'


class Conflito(Exception):
    """Os dados mudaram depois que o formulário foi aberto."""


def carregar_catalogo():
    """Retorna os dados e as versões que o painel precisa para editá-los."""
    materiais = ler_dados(ARQUIVO_MATERIAIS, 'materiais')
    pontos = ler_dados(ARQUIVO_PONTOS, 'pontosDescarte')
    return {
        'materiais': materiais,
        'pontos': pontos,
        'versoes': {material['id']: versao(material) for material in materiais},
        'versaoPontos': versao(pontos),
    }


def validar_material(material, existentes):
    """Valida os campos do formulário e preserva campos não editáveis."""
    if not isinstance(material, dict):
        raise ValueError('Material inválido.')

    campos_obrigatorios = ('id', 'nome', 'categoria', 'orientacao', 'coletor', 'cuidados')
    for campo in campos_obrigatorios:
        valor = material.get(campo)
        if not isinstance(valor, str) or not valor.strip() or len(valor) > 3000:
            raise ValueError(f'Preencha o campo {campo}.')
        material[campo] = valor.strip()

    if not re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*', material['id']):
        raise ValueError('Use letras minúsculas, números e hífens no identificador.')

    termos = material.get('termosBusca')
    if not isinstance(termos, list) or any(not isinstance(termo, str) or len(termo) > 150 for termo in termos):
        raise ValueError('Termos de busca inválidos.')

    cores = (None, 'azul', 'vermelho', 'amarelo', 'verde', 'marrom')
    if material.get('corColetor') not in cores:
        raise ValueError('Cor inválida.')

    fonte = material.get('fonte', '')
    if not isinstance(fonte, str):
        raise ValueError('Fonte inválida.')
    if fonte:
        endereco = urlsplit(fonte)
        if endereco.scheme not in ('http', 'https') or not endereco.netloc:
            raise ValueError('Informe uma fonte HTTP ou HTTPS válida.')

    revisao = material.get('revisadoEm', '')
    if not isinstance(revisao, str):
        raise ValueError('Data de revisão inválida.')
    if revisao:
        try:
            if not re.fullmatch(r'\d{4}-\d{2}-\d{2}', revisao) or date.fromisoformat(revisao).isoformat() != revisao:
                raise ValueError()
        except ValueError:
            raise ValueError('Data de revisão inválida.') from None

    anterior = {}
    for item in existentes:
        if item['id'] == material['id']:
            anterior = item
            break
    resultado = dict(anterior)
    for campo in (*campos_obrigatorios, 'corColetor'):
        resultado[campo] = material[campo]
    resultado['termosBusca'] = [termo.strip() for termo in termos if termo.strip()]
    resultado['pontosConfirmados'] = anterior.get('pontosConfirmados', [])
    resultado['fonte'] = fonte
    resultado['revisadoEm'] = revisao
    return resultado


def buscar_indice(lista, identificador):
    for indice, item in enumerate(lista):
        if item['id'] == identificador:
            return indice
    return None


def conferir_versao(versao_enviada, item, mensagem):
    if versao_enviada != versao(item):
        raise Conflito(mensagem)


def validar_pontos(pedido, pontos, pontos_anteriores):
    """Confere os vínculos informados e evita usar um inventário desatualizado."""
    selecionados = pedido.get('pontosConfirmados')
    if not isinstance(selecionados, list):
        raise ValueError('Lista de pontos inválida.')
    if any(not isinstance(ponto, str) for ponto in selecionados):
        raise ValueError('Lista de pontos inválida.')
    if len(set(selecionados)) != len(selecionados):
        raise ValueError('Lista de pontos inválida.')

    conferir_versao(
        pedido.get('versaoPontos'), pontos,
        'Os pontos mudaram desde que o formulário foi aberto. Copie suas alterações e recarregue a página.',
    )
    if not set(selecionados).issubset({ponto['id'] for ponto in pontos}):
        raise ValueError('Há um ponto desconhecido na seleção.')

    for ponto in pontos:
        novo_vinculo = ponto['id'] in selecionados and ponto['id'] not in pontos_anteriores
        disponivel = ponto.get('situacao') == 'confirmado' and ponto.get('disponibilidade') == 'disponível'
        if novo_vinculo and not disponivel:
            raise ValueError('Só é possível vincular novos pontos confirmados e disponíveis.')
    return selecionados


def atualizar_vinculos(id_material, selecionados, cadastro_pontos):
    """Atualiza o material dentro dos pontos, preservando os outros registros."""
    pontos, texto, itens, virgulas, fim_lista = cadastro_pontos
    # A edição começa pelo fim para não alterar as posições dos registros anteriores.
    for indice in range(len(pontos) - 1, -1, -1):
        ponto = pontos[indice]
        recebidos = ponto.get('materiaisConfirmados', [])
        if not isinstance(recebidos, list):
            raise ValueError('A lista de materiais de um ponto é inválida.')
        novos = [item for item in recebidos if item != id_material]
        if ponto['id'] in selecionados:
            novos.append(id_material)
        if set(novos) != set(recebidos):
            ponto_atualizado = dict(ponto, materiaisConfirmados=novos)
            texto = atualizar_texto(texto, itens, virgulas, fim_lista, indice, ponto_atualizado)
    return texto


def salvar_arquivos(texto_materiais, texto_pontos_original, texto_pontos_novo):
    """Restaura os pontos se a gravação dos materiais falhar."""
    if texto_pontos_novo is None or texto_pontos_novo == texto_pontos_original:
        gravar_arquivo(ARQUIVO_MATERIAIS, texto_materiais)
        return

    gravar_arquivo(ARQUIVO_PONTOS, texto_pontos_novo)
    try:
        gravar_arquivo(ARQUIVO_MATERIAIS, texto_materiais)
    except OSError:
        gravar_arquivo(ARQUIVO_PONTOS, texto_pontos_original)
        raise


def salvar_material(pedido, cadastro_materiais, cadastro_pontos):
    materiais, texto, itens, virgulas, fim_lista = cadastro_materiais
    pontos = cadastro_pontos[0]
    material = validar_material(pedido.get('material'), materiais)
    indice = buscar_indice(materiais, material['id'])

    if pedido.get('novo') and indice is not None:
        raise ValueError('Já existe um material com esse identificador.')
    if not pedido.get('novo') and indice is None:
        raise ValueError('Material não encontrado. Atualize a página.')
    if indice is not None:
        conferir_versao(
            pedido.get('versao'), materiais[indice],
            'Este material mudou desde que foi aberto. Copie suas alterações e recarregue a página antes de tentar novamente.',
        )

    pontos_anteriores = set()
    if indice is not None:
        pontos_anteriores = set(materiais[indice].get('pontosConfirmados', []))
    selecionados = validar_pontos(pedido, pontos, pontos_anteriores)
    material['pontosConfirmados'] = selecionados
    texto_pontos = atualizar_vinculos(material['id'], selecionados, cadastro_pontos)
    texto_materiais = atualizar_texto(texto, itens, virgulas, fim_lista, indice, material)
    salvar_arquivos(texto_materiais, cadastro_pontos[1], texto_pontos)


def excluir_material(pedido, cadastro_materiais, cadastro_pontos):
    materiais, texto, itens, virgulas, fim_lista = cadastro_materiais
    identificador = pedido.get('id')
    indice = buscar_indice(materiais, identificador)
    if indice is None:
        raise ValueError('Material não encontrado.')
    conferir_versao(
        pedido.get('versao'), materiais[indice],
        'Este material mudou desde que foi aberto. Recarregue a página antes de excluí-lo.',
    )
    if any(identificador in ponto.get('materiaisConfirmados', []) for ponto in cadastro_pontos[0]):
        raise ValueError('Este material está vinculado a pontos. Revise e remova os vínculos no inventário antes de excluí-lo.')
    conteudo = atualizar_texto(texto, itens, virgulas, fim_lista, indice)
    gravar_arquivo(ARQUIVO_MATERIAIS, conteudo)


def executar_pedido(pedido):
    if not isinstance(pedido, dict):
        raise ValueError('O pedido deve ser um objeto JSON.')
    materiais = ler_dados(ARQUIVO_MATERIAIS, 'materiais', com_posicoes=True)
    pontos = ler_dados(ARQUIVO_PONTOS, 'pontosDescarte', com_posicoes=True)
    if pedido.get('acao') == 'salvar':
        salvar_material(pedido, materiais, pontos)
    elif pedido.get('acao') == 'excluir':
        excluir_material(pedido, materiais, pontos)
    else:
        raise ValueError('Operação inválida.')
