"""Servidor HTTP local do painel. Usa apenas a biblioteca padrão do Python."""
import json
import os
import secrets
from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path

from catalogo import Conflito, carregar_catalogo, executar_pedido

PASTA_PAINEL = Path(__file__).resolve().parent
RAIZ = PASTA_PAINEL.parent
PORTA = int(os.environ.get('PORTA_PAINEL', '3000'))
ORIGEM = f'http://127.0.0.1:{PORTA}'
# Código aleatório que o painel precisa enviar ao salvar ou excluir dados.
CODIGO_DE_ACESSO = secrets.token_hex(32)


class Painel(BaseHTTPRequestHandler):
    def responder(self, codigo, conteudo, tipo='application/json; charset=utf-8'):
        if tipo.startswith('application/json'):
            conteudo = json.dumps(conteudo, ensure_ascii=False).encode('utf-8')
        self.send_response(codigo)
        self.send_header('Content-Type', tipo)
        self.send_header('Content-Length', str(len(conteudo)))
        self.send_header('Cache-Control', 'no-store')
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.end_headers()
        self.wfile.write(conteudo)

    def host_valido(self):
        return self.headers.get('Host') == f'127.0.0.1:{PORTA}'

    def pedido_autorizado(self):
        # Confere se o pedido veio do endereço local e contém o código do painel.
        return (
            self.host_valido()
            and self.headers.get('Origin') == ORIGEM
            and self.headers.get('X-Painel-Token') == CODIGO_DE_ACESSO
            and self.headers.get('Content-Type', '').startswith('application/json')
        )

    def do_GET(self):
        try:
            if not self.host_valido():
                return self.responder(403, {'erro': 'Acesso negado.'})

            arquivos = {
                '/': (PASTA_PAINEL / 'index.html', 'text/html; charset=utf-8'),
                '/painel.js': (PASTA_PAINEL / 'painel.js', 'text/javascript; charset=utf-8'),
                '/painel.css': (PASTA_PAINEL / 'painel.css', 'text/css; charset=utf-8'),
                '/favicon.ico': (RAIZ / 'assets/img/favicon.svg', 'image/svg+xml'),
            }
            if self.path in arquivos:
                arquivo, tipo = arquivos[self.path]
                return self.responder(200, arquivo.read_bytes(), tipo)
            if self.path == '/api/materiais':
                dados = carregar_catalogo()
                dados['token'] = CODIGO_DE_ACESSO
                return self.responder(200, dados)
            self.responder(404, {'erro': 'Página não encontrada.'})
        except (ValueError, OSError) as erro:
            self.responder(400, {'erro': str(erro)})

    # GET e POST são nomes definidos pelo protocolo HTTP e pela biblioteca Python.
    def do_POST(self):
        try:
            if not self.pedido_autorizado():
                return self.responder(403, {'erro': 'Acesso negado.'})
            if self.path != '/api/materiais':
                return self.responder(404, {'erro': 'Página não encontrada.'})

            tamanho = int(self.headers.get('Content-Length', '0'))
            if tamanho <= 0 or tamanho > 100000:
                raise ValueError('Tamanho de pedido inválido.')
            pedido = json.loads(self.rfile.read(tamanho))
            executar_pedido(pedido)
            self.responder(200, {'ok': True})
        except Conflito as erro:
            self.responder(409, {'erro': str(erro)})
        except (ValueError, TypeError, KeyError, OSError) as erro:
            self.responder(400, {'erro': str(erro)})


if __name__ == '__main__':
    servidor = HTTPServer(('127.0.0.1', PORTA), Painel)
    print(f'Painel local: {ORIGEM}\nPressione Ctrl+C para encerrar.', flush=True)
    try:
        servidor.serve_forever()
    except KeyboardInterrupt:
        print('\nPainel encerrado.')
    finally:
        servidor.server_close()
