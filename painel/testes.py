"""Testes de integração do painel, sempre em uma cópia temporária do catálogo."""
import copy
import json
import os
from pathlib import Path
import shutil
import socket
import subprocess
import sys
import tempfile
import unittest
from urllib.error import HTTPError
from urllib.request import Request, urlopen

RAIZ = Path(__file__).resolve().parent.parent


class PainelTeste(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix='ecotour-testes-')
        self.raiz = Path(self.temp.name)
        shutil.copytree(RAIZ / 'painel', self.raiz / 'painel', ignore=shutil.ignore_patterns('__pycache__'))
        shutil.copytree(RAIZ / 'assets/data', self.raiz / 'assets/data')
        (self.raiz / 'assets/img').mkdir(parents=True)
        shutil.copy(RAIZ / 'assets/img/favicon.svg', self.raiz / 'assets/img/favicon.svg')
        with socket.socket() as sock:
            sock.bind(('127.0.0.1', 0))
            porta = sock.getsockname()[1]
        self.origem = f'http://127.0.0.1:{porta}'
        self.processo = subprocess.Popen([sys.executable, '-B', str(self.raiz / 'painel/servidor.py')], env={**os.environ, 'PORTA_PAINEL': str(porta)}, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL)
        self.assertIn(str(porta).encode(), self.processo.stdout.readline())
        self.estado = self.get()[1]

    def tearDown(self):
        self.processo.terminate()
        self.processo.wait(timeout=5)
        self.processo.stdout.close()
        self.temp.cleanup()

    def request(self, caminho, dados=None, headers=None):
        req = Request(self.origem + caminho, data=dados, headers=headers or {})
        try:
            with urlopen(req, timeout=5) as res:
                return res.status, res.read()
        except HTTPError as erro:
            return erro.code, erro.read()

    def get(self):
        status, corpo = self.request('/api/materiais')
        return status, json.loads(corpo)

    def post(self, pedido, **alterar_headers):
        if isinstance(pedido, dict) and pedido.get('acao') == 'salvar':
            pedido = dict(pedido)
            pedido.setdefault('versaoPontos', self.estado['versaoPontos'])
            pedido.setdefault('pontosConfirmados', pedido.get('material', {}).get('pontosConfirmados', []))
        headers = {'Origin': self.origem, 'Content-Type': 'application/json', 'X-Painel-Token': self.estado['token']}
        headers.update(alterar_headers)
        status, corpo = self.request('/api/materiais', json.dumps(pedido, ensure_ascii=False).encode('utf-8'), headers)
        return status, json.loads(corpo)

    def novo(self):
        return {'id': 'teste-novo', 'nome': 'Teste', 'categoria': 'Teste', 'termosBusca': ['ação'], 'corColetor': None, 'orientacao': 'Orientação', 'coletor': 'Coletor', 'cuidados': 'Cuidados', 'fonte': 'https://example.com', 'revisadoEm': '2026-11-19'}

    def test_crud_e_preservacao(self):
        arquivo = self.raiz / 'assets/data/materiais.js'
        original = arquivo.read_text(encoding='utf-8')
        novo = self.novo()
        self.assertEqual(self.post({'acao': 'salvar', 'novo': True, 'material': novo})[0], 200)
        self.assertTrue(arquivo.read_text(encoding='utf-8').startswith(original[:original.rfind('}') + 1]))
        estado = self.get()[1]
        self.assertEqual(estado['materiais'][-1]['pontosConfirmados'], [])
        novo['nome'] = 'Alterado'
        self.assertEqual(self.post({'acao': 'salvar', 'novo': False, 'material': novo, 'versao': estado['versoes']['teste-novo']})[0], 200)
        estado = self.get()[1]
        self.assertEqual(estado['materiais'][-1]['nome'], 'Alterado')
        self.assertEqual(self.post({'acao': 'excluir', 'id': novo['id'], 'versao': estado['versoes'][novo['id']]})[0], 200)
        self.assertEqual(self.get()[1]['materiais'], self.estado['materiais'])

    def test_duas_abas_e_vinculo(self):
        material = copy.deepcopy(self.estado['materiais'][0])
        versao = self.estado['versoes'][material['id']]
        original = copy.deepcopy(material)
        material['nome'] = 'Editado na primeira aba'
        self.assertEqual(self.post({'acao': 'salvar', 'novo': False, 'material': material, 'versao': versao})[0], 200)
        original['cuidados'] = 'Editado na segunda aba'
        self.assertEqual(self.post({'acao': 'salvar', 'novo': False, 'material': original, 'versao': versao})[0], 409)
        self.assertEqual(self.post({'acao': 'excluir', 'id': material['id'], 'versao': versao})[0], 409)
        atual = self.get()[1]
        self.assertEqual(atual['materiais'][0]['nome'], material['nome'])
        self.assertEqual(self.post({'acao': 'excluir', 'id': material['id'], 'versao': atual['versoes'][material['id']]})[0], 400)

    def test_requisicoes_e_validacao(self):
        self.assertEqual(self.post([])[0], 400)
        self.assertEqual(self.post({}, Origin='http://example.com')[0], 403)
        self.assertEqual(self.request('/favicon.ico')[0], 200)
        self.assertEqual(self.request('/painel.css')[0], 200)
        for campo, valor in [('id', 'ID inválido'), ('nome', ' '), ('corColetor', 'roxo'), ('fonte', 'javascript:alert(1)'), ('revisadoEm', '2026-02-30'), ('termosBusca', None)]:
            material = self.novo()
            material[campo] = valor
            with self.subTest(campo=campo):
                self.assertEqual(self.post({'acao': 'salvar', 'novo': True, 'material': material})[0], 400)

    def test_aspas_simples_e_comentarios(self):
        arquivo = self.raiz / 'assets/data/materiais.js'
        texto = arquivo.read_text(encoding='utf-8').replace('"nome":', "'nome':", 1)
        texto = '// comentário preservado\n' + texto
        arquivo.write_text(texto, encoding='utf-8')
        status, estado = self.get()
        self.assertEqual(status, 200)
        material = copy.deepcopy(estado['materiais'][1])
        material['nome'] = 'Alterado'
        self.assertEqual(self.post({'acao': 'salvar', 'novo': False, 'material': material, 'versao': estado['versoes'][material['id']]})[0], 200)
        depois = arquivo.read_text(encoding='utf-8')
        self.assertIn('// comentário preservado', depois)
        self.assertIn("'nome':", depois)

    def test_lista_vazia_e_virgula_final(self):
        arquivo = self.raiz / 'assets/data/materiais.js'
        for conteudo in ('const materiais = [];\n', 'const materiais = [\n' + json.dumps(self.novo(), ensure_ascii=False) + ',\n];\n'):
            with self.subTest(conteudo=conteudo):
                arquivo.write_text(conteudo, encoding='utf-8')
                material = self.novo()
                material['id'] = 'outro'
                self.assertEqual(self.post({'acao': 'salvar', 'novo': True, 'material': material})[0], 200)
                estado = self.get()[1]
                self.assertEqual(estado['materiais'][-1]['id'], 'outro')
                self.assertEqual(self.post({'acao': 'excluir', 'id': 'outro', 'versao': estado['versoes']['outro']})[0], 200)
                self.assertEqual(len(self.get()[1]['materiais']), 0 if '[]' in conteudo else 1)

    def test_vincular_e_desvincular_ponto(self):
        material = self.novo()
        pedido = {'acao': 'salvar', 'novo': True, 'material': material, 'pontosConfirmados': ['P-01', 'P-02']}
        self.assertEqual(self.post(pedido)[0], 200)
        estado = self.get()[1]
        self.assertEqual(estado['materiais'][-1]['pontosConfirmados'], ['P-01', 'P-02'])
        for ponto in estado['pontos'][:2]:
            self.assertIn(material['id'], ponto['materiaisConfirmados'])
        pedido = {'acao': 'salvar', 'novo': False, 'material': material, 'versao': estado['versoes'][material['id']], 'pontosConfirmados': ['P-02'], 'versaoPontos': estado['versaoPontos']}
        self.assertEqual(self.post(pedido)[0], 200)
        atualizado = self.get()[1]
        self.assertEqual(atualizado['materiais'][-1]['pontosConfirmados'], ['P-02'])
        self.assertNotIn(material['id'], atualizado['pontos'][0]['materiaisConfirmados'])
        self.assertIn(material['id'], atualizado['pontos'][1]['materiaisConfirmados'])
        self.assertEqual(self.post(pedido)[0], 409)

    def test_ponto_desconhecido_e_conflito_no_inventario(self):
        material = self.novo()
        pedido = {'acao': 'salvar', 'novo': True, 'material': material, 'pontosConfirmados': ['P-99']}
        self.assertEqual(self.post(pedido)[0], 400)
        arquivo = self.raiz / 'assets/data/pontos-descarte.js'
        original = arquivo.read_text(encoding='utf-8')
        arquivo.write_text(original.replace('"P-01"', '"P-01-ALTERADO"', 1), encoding='utf-8')
        pedido['pontosConfirmados'] = []
        self.assertEqual(self.post(pedido)[0], 409)
        self.assertFalse(any(m['id'] == material['id'] for m in self.get()[1]['materiais']))


if __name__ == '__main__':
    unittest.main()
