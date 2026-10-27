# ♻️ EcoTour

**Informação para descartar melhor no campus.**

Guia digital de descarte de resíduos para a comunidade da **UNINASSAU Aguanambi, em Fortaleza–CE**, desenvolvido no **Hackathon UNINASSAU 2026 — Desafio Sustentabilidade**.

O EcoTour ajuda a descobrir **como preparar um material, qual coletor utilizar e onde encontrá-lo dentro do campus**.

**HTML · CSS · JavaScript** — site estático, sem instalação de dependências ou back-end.

[Funcionalidades](#funcionalidades) · [Como executar](#como-executar) · [Documentação](#documentação-e-manutenção) · [Backlog](https://github.com/alanfelipe01/EcoTour/issues)

## Funcionalidades

- **Busca de materiais:** consulta por nome, categoria e termos alternativos, sem diferenciar acentos ou maiúsculas.
- **Orientação por etapas:** preparo, coletor indicado e cuidados, com fonte e data de revisão.
- **Consulta aos pontos:** filtros por material e área, fotos, referências de localização e restrições.
- **Destinos compatíveis:** vínculos entre materiais e pontos, com aviso quando não existe destino interno confirmado.
- **Interface responsiva:** adaptações para celular, navegação por teclado, foco visível e campos identificados.

**Fluxo:** buscar material → consultar orientação → escolher um local compatível → visualizar os detalhes.

| Catálogo | Levantamento | Interface |
|---|---|---|
| 7 materiais | 9 pontos registrados em 8 locais | 3 páginas: consulta, guia e pontos |

Os dois conjuntos de coletores da cantina aparecem agrupados em um único local, preservando seus registros e fotos.

## Da pesquisa ao sistema

O projeto reúne pesquisa com a comunidade, levantamento de campo, registro fotográfico e organização das orientações de descarte. A análise de **52 respostas**, coletadas em 19 e 20/10/2026, identificou dúvidas sobre pilhas e baterias em **32 respostas** e eletrônicos em **29**. Os resultados descrevem os participantes, sem representar necessariamente todo o campus.

As páginas, a busca, os filtros e os detalhes estão implementados. A equipe registrou como concluídas as verificações de uso no celular e acessibilidade ([ECO-10](https://github.com/alanfelipe01/EcoTour/issues/10)) e de funcionamento e consistência dos dados ([ECO-11](https://github.com/alanfelipe01/EcoTour/issues/11)).

## Como executar

```bash
git clone https://github.com/alanfelipe01/EcoTour.git
cd EcoTour
```

Abra `index.html` no navegador, com JavaScript habilitado. Também é possível abrir a pasta no VS Code e iniciar a página com a extensão Live Server.

## Documentação e manutenção

| Arquivo ou pasta | Responsabilidade |
|---|---|
| `index.html`, `guia.html`, `pontos.html` | Consulta, orientações e pontos de descarte |
| `assets/css/` | Base compartilhada em `comum.css`; estilos de cada página em `style.css`, `guia.css` e `pontos.css` |
| `assets/js/` | Interações: `main.js`, `guia.js` e `pontos.js` |
| `assets/data/materiais.js` | Materiais, orientações, fontes e vínculos com pontos |
| `assets/data/pontos-descarte.js` | Localização, situação, restrições e materiais recebidos |
| `assets/img/` | Fotografias, versões WebP e identidade visual |
| `docs/` | [Inventário dos pontos](docs/inventario-pontos.md) e [catálogo de materiais](docs/catalogo-materiais.md) |

Ao atualizar dados, preserve os IDs e confira os vínculos nos dois arquivos: `pontosConfirmados` e `materiaisConfirmados`. Revise fontes, datas, restrições e imagens; depois percorra o fluxo de consulta. Novas fotos devem ter suas versões JPG e WebP correspondentes.

## Publicar na Vercel

O projeto é estático: não precisa instalar dependências, executar build nem cadastrar variáveis de ambiente. O arquivo `vercel.json` configura a publicação da pasta atual e mantém as URLs `.html` usadas na navegação e nos filtros.

1. Envie os arquivos atualizados, incluindo `vercel.json`, para o repositório no GitHub.
2. Na Vercel, crie um projeto e importe o repositório `alanfelipe01/EcoTour`.
3. Confira as opções abaixo e clique em **Deploy**.

| Opção | Valor |
|---|---|
| Framework Preset | `Other` |
| Root Directory | Raiz do repositório (`./`), onde está `index.html` |
| Build Command | Vazio |
| Output Directory | `.` |
| Install Command | Vazio |
| Environment Variables | Nenhuma |

**Atenção à pasta:** neste computador, o repositório está em `EcoTour/EcoTour`. No GitHub, os arquivos `index.html` e `vercel.json` já estão na raiz do repositório; não selecione uma subpasta `EcoTour` na Vercel ao importar esse repositório.

Depois da publicação, confira a página inicial, uma busca por `garrafa`, o guia em `/guia.html?material=garrafa-pet`, a lista em `/pontos.html?material=garrafa-pet` e o detalhe em `/pontos.html?ponto=P-01&material=garrafa-pet`. Atualize a página do detalhe para conferir o acesso direto e abra a foto original.

Os arquivos de documentação são excluídos do envio pela `.vercelignore`; as fotos JPG permanecem disponíveis porque são usadas nos detalhes dos pontos. A pasta local `.vercel/` e arquivos `.env` são ignorados pelo Git.

Referências: [configuração do projeto](https://vercel.com/docs/project-configuration/vercel-json) e [arquivos excluídos do envio](https://vercel.com/docs/deployments/vercel-ignore).

## Limitações e próximos passos

- A cobertura é interna ao campus, sem mapa, GPS ou rotas.
- Horários e restrições adicionais ainda dependem de confirmação; a disponibilidade não é atualizada em tempo real.
- Eletrônicos têm orientação, mas ainda não possuem destino interno confirmado.
- Próximas entregas: testes com pessoas do campus, consolidação da autoria, resumo, pitch e conferência dos links de apresentação.

Facilitar o descarte e apoiar a educação ambiental são benefícios esperados. Volume reciclado e impacto ambiental ainda não foram medidos.

## Autoria e referências

Projeto acadêmico desenvolvido em equipe, com contribuições registradas nos [commits](https://github.com/alanfelipe01/EcoTour/commits/main/) e nas issues. A relação nominal de integrantes, cursos e responsabilidades será consolidada para a entrega.

**Apoio de IA:** ChatGPT utilizado no planejamento, documentação, análise descritiva da pesquisa e redação deste README. A declaração final deve incluir os demais usos efetivamente realizados pela equipe.

**Referências:** relatório de pesquisa do campus (21/10/2026), levantamento de campo e fontes ambientais indicadas no catálogo. A documentação apresenta resultados agregados, sem respostas individuais do formulário.
