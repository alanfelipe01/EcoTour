# ♻️ EcoTour

**Informação para descartar melhor no campus.**

O EcoTour é um guia digital de descarte de resíduos para a comunidade da **UNINASSAU Aguanambi, em Fortaleza–CE**, desenvolvido para o **Hackathon UNINASSAU 2026 — Desafio Sustentabilidade**.

🔗  [Acessar o EcoTour](https://ecotour-nassau.vercel.app/)

## Sobre o projeto

Você já ficou em dúvida sobre onde descartar uma garrafa, uma pilha ou um medicamento no campus? O EcoTour foi criado para ajudar a responder a perguntas como essas.

A plataforma reúne orientações sobre a separação e o preparo dos resíduos e apresenta os pontos de descarte identificados dentro da unidade. Ao consultar um material, a pessoa pode verificar os cuidados necessários, o tipo de coletor indicado e os locais compatíveis disponíveis.

O projeto foi desenvolvido a partir de uma pesquisa com a comunidade acadêmica e de um levantamento dos pontos existentes no campus. A pesquisa recebeu **52 respostas**, coletadas em 19 e 20 de outubro de 2026.

## Funcionalidades

- **Busca de materiais:** pesquisa por nome, categoria ou termos alternativos.
- **Orientações de descarte:** informações sobre preparo, coletor indicado e cuidados necessários.
- **Pontos de descarte:** consulta aos locais do campus, com fotos, referências de localização e informações sobre os materiais recebidos.
- **Filtros:** busca de pontos por material e área.
- **Destinos compatíveis:** indicação dos pontos vinculados a cada material, com aviso quando não há destino interno confirmado.
- **Interface responsiva:** adaptação para diferentes tamanhos de tela, incluindo celulares.

O fluxo principal é: **buscar um material → consultar a orientação → encontrar um ponto compatível → visualizar os detalhes do local**.

Atualmente, o projeto reúne **7 materiais** e **9 registros de pontos de descarte em 8 locais** do campus.

## Páginas do site

- **Página inicial:** busca e seleção de materiais.
- **Guia de descarte:** orientações e cuidados para cada material.
- **Pontos de descarte:** consulta aos locais, fotos e materiais recebidos.

## Tecnologias

- HTML5
- CSS3
- JavaScript
- Python

O EcoTour é um site estático e não utiliza back-end nem exige instalação de dependências para funcionar.

### Painel local de materiais

Para editar o catálogo no computador, instale o Python 3 e execute na pasta do projeto:

```sh
python painel/servidor.py
```

Acesse **http://127.0.0.1:3000** e mantenha o terminal aberto enquanto usa o painel. Para encerrar, pressione `Ctrl+C`. Não é necessário instalar pacotes: o servidor usa apenas a biblioteca padrão do Python. O painel só aceita conexões locais e não é publicado na Vercel.

É possível cadastrar, editar e excluir materiais e gerenciar os pontos vinculados. As alterações são gravadas em `assets/data/materiais.js` e, quando os vínculos mudam, também em `assets/data/pontos-descarte.js`; revise-as e publique o projeto normalmente para disponibilizá-las no site. Confirme o recebimento antes de vincular um ponto. O identificador de um material existente não pode ser alterado, pois é usado nos links. Materiais vinculados não podem ser excluídos até que os vínculos sejam removidos pelo painel. A data de revisão deve ser preenchida somente após uma revisão efetiva.

O painel detecta quando outra aba já alterou o material aberto e pede que você recarregue antes de salvá-lo. Copie suas alterações antes de recarregar. Ele preserva os demais registros e comentários ao atualizar o arquivo. Os dados devem continuar como uma lista literal JavaScript (com aspas simples ou duplas), sem expressões ou funções. Reinicie o servidor após alterar o código do painel.

Para executar os testes do painel em cópias temporárias dos dados, rode `python painel/testes.py`.

Os arquivos do painel estão separados por função: `servidor.py` recebe os pedidos do navegador; `catalogo.py` reúne as regras de materiais e vínculos; `arquivos.py` lê e atualiza os arquivos de dados; `index.html`, `painel.css` e `painel.js` formam a interface. O leitor em `arquivos.py` mantém a compatibilidade com as listas JavaScript existentes sem executá-las.

## Estrutura do projeto

```text
EcoTour/
├── index.html              # Página inicial e busca de materiais
├── guia.html               # Orientações de descarte
├── pontos.html             # Pontos de descarte e seus detalhes
├── assets/
│   ├── css/                # Estilos das páginas
│   ├── js/                 # Interações e funcionalidades
│   ├── data/               # Dados dos materiais e pontos
│   └── img/                # Imagens e identidade visual
├── docs/                   # Catálogo e inventário do projeto
└── vercel.json             # Configuração de publicação
```

## Escopo e próximos passos

Nesta versão, o EcoTour apresenta pontos de descarte **internos da UNINASSAU Aguanambi**. As informações são mantidas pela equipe e não são atualizadas em tempo real.

Alguns materiais possuem orientações de descarte, mas ainda não têm um destino interno confirmado — como os eletrônicos. Horários e possíveis restrições dos pontos também dependem de confirmação.

Como evolução, o projeto poderá passar por testes com mais pessoas do campus e ampliar suas informações e funcionalidades.

## Equipe

Projeto desenvolvido em equipe para o **Hackathon UNINASSAU 2026**.

- [Alan Felipe](https://github.com/alanfelipe01) — Análise e Desenvolvimento de Sistemas
- [Andrew Felipe](https://github.com/andrewfelipao2002-gif) — Análise e Desenvolvimento de Sistemas
- [Gustavo Horta](https://github.com/hortafront) — Análise e Desenvolvimento de Sistemas

## Créditos e apoio

O EcoTour foi desenvolvido a partir de pesquisa com a comunidade acadêmica, levantamento de campo, registro fotográfico e consulta a fontes ambientais.

O **ChatGPT** foi utilizado como apoio no planejamento, na documentação, na análise descritiva da pesquisa e na redação do README.
