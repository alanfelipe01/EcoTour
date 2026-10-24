# ♻️ EcoTour

**Informação para descartar melhor no campus.**

Guia digital de descarte de resíduos para a comunidade da **UNINASSAU Aguanambi (Fortaleza–CE)**, desenvolvido no **Hackathon UNINASSAU 2026 — Desafio Sustentabilidade**. Ele responde três perguntas: **qual material tenho, como preparo e onde descarto dentro do campus?**

> **Em desenvolvimento · atualizado em 24/10/2026.** A consulta de materiais, o guia e a página de pontos estão implementados. A confirmação de recebimento no campus ainda depende da equipe responsável.

## Problema e pesquisa

Encontrar uma lixeira não significa saber o que ela recebe. Para entender as dúvidas do campus, analisamos **52 respostas** a um formulário aplicado em 19 e 20/10/2026:

| Achado | Respostas | % |
|---|---:|---:|
| Dúvidas sobre pilhas e baterias | 32 | 61,5% |
| Dúvidas sobre eletrônicos | 29 | 55,8% |
| Mapa dos pontos seria útil | 35 | 67,3% |
| Usariam o guia digital | 30 | 57,7% |

As perguntas aceitavam múltiplas respostas, e os resultados descrevem só quem respondeu. Fonte: *EcoTour — Relatório de Pesquisa do Campus* (21/10/2026).

## Como o guia vai funcionar

O fluxo e o padrão visual foram definidos na ECO-05 (*EcoTour-ECO-05-Telas-e-Padrao-Visual.pdf*, 23/10/2026).

**Fluxo principal:** consultar (`index.html`) → orientação do material (`guia.html?material=id`) → pontos compatíveis (`pontos.html?material=id`) → detalhes do ponto (`pontos.html?ponto=P-xx`). A navegação no cabeçalho leva à lista de todos os pontos, que pode ser filtrada por área.

**Estados previstos:** busca sem resultado, material sem destino confirmado (hoje, todos), filtro sem pontos e ponto indisponível. Cada um tem uma mensagem e um caminho de volta.

**Padrão visual:**

- Layout responsivo, com controles principais de pelo menos 48px e conteúdo de até 1040px.
- Tipografia Arial, verde `#1E5A3C` sobre fundo `#F7F5EC`. A verificação completa de contraste e acessibilidade ainda está pendente.
- Ícones SVG próprios e etiquetas de situação sempre com ícone + texto: *Confirmado*, *Observado · recebimento a confirmar*, *Indisponível*.

O design é uma proposta de aparência. Os itens marcados como *Exemplo ilustrativo* não existem no levantamento, e o conteúdo final virá dos arquivos de dados validados.

## Escopo da primeira versão

Site estático em **HTML, CSS e JavaScript**, sem login, com catálogo pesquisável, orientações com fontes e data de revisão, lista de pontos internos e vínculos somente com destinos confirmados.

**Fora do escopo:** pontos externos ao campus, back-end, banco de dados, cadastro, painel administrativo, GPS, rotas e mapa.

## Andamento

| Frente | Situação em 23/10/2026 |
|---|---|
| Pesquisa (ECO-02) | ✅ 52 respostas analisadas |
| Inventário de pontos (ECO-03) | ✅ 9 pontos documentados, todos ainda como "observado" |
| Catálogo (ECO-04) | 🟡 7 materiais em `materiais.js`; `pontosConfirmados` ainda vazios |
| Telas e padrão visual (ECO-05) | ✅ 9 telas e padrão visual definidos |
| Dados dos pontos | ✅ 9 pontos observados em `pontos-descarte.js`, organizados por área; nenhum recebimento confirmado |
| Fotos dos pontos | ✅ 9 fotos em `assets/img/`, vinculadas ao inventário |
| Páginas e interações (ECO-06 a 09) | ✅ Consulta, guia, lista, filtro e detalhe implementados; validação em navegador ainda pendente |

O planejamento e os critérios de aceite estão nas [issues do projeto](https://github.com/alanfelipe01/EcoTour/issues).

## Arquivos

| Caminho | Conteúdo |
|---|---|
| `index.html`, `guia.html`, `pontos.html` | Consulta, orientação do material e pontos |
| `assets/css/style.css` | Estilos e adaptação das telas |
| `assets/js/` | `main.js`, `guia.js` e `pontos.js`: interações de cada página |
| `assets/data/materiais.js` | Catálogo e vínculos com pontos confirmados |
| `assets/data/pontos-descarte.js` | Dados dos 9 pontos observados |
| `docs/catalogo-materiais.md` | Orientações, justificativas e fontes dos [7 materiais](docs/catalogo-materiais.md) |
| `docs/inventario-pontos.md` | [Levantamento dos pontos](docs/inventario-pontos.md) e pendências |

## Como abrir e manter

Abra `index.html` no navegador para iniciar a consulta. A página `pontos.html` também pode ser aberta diretamente. Um servidor HTTP local ajuda a testar em condições próximas da publicação.

```bash
git clone https://github.com/alanfelipe01/EcoTour.git
```

Para atualizar os dados:

1. **Materiais:** edite `assets/data/materiais.js` sem mudar os IDs. Cada item precisa de nome, termos de busca, categoria, orientação, cuidados, fonte e data de revisão. Cada material novo precisa de um ícone próprio.
2. **Pontos:** registre as evidências em `docs/inventario-pontos.md` e só depois leve os dados conferidos para `pontos-descarte.js`.
3. **Vínculos:** só adicione um ID em `pontosConfirmados` quando o ponto estiver **confirmado** por sinalização ou pelo setor responsável. A cor do coletor não confirma nada. Uma lista vazia significa que ainda não há destino interno confirmado.
4. **Antes de publicar:** confira se documentação e dados estão alinhados (IDs, restrições, fotos e datas).

As respostas individuais do formulário não são publicadas. A documentação usa apenas resultados agregados.

## Próximas etapas

- Confirmar o recebimento e os horários dos pontos com o setor responsável; atualizar os vínculos de materiais somente com evidência.
- Construir as telas e implementar busca, orientações e consulta aos pontos (ECO-06 a ECO-09).
- Verificar acessibilidade, uso no celular e consistência dos dados (ECO-10 e ECO-11).
- Testar com pessoas do campus e publicar a demonstração (ECO-12 a ECO-16).
- Criar a entrada de pilhas e baterias, a dúvida mais frequente na pesquisa.

O impacto esperado é facilitar decisões de descarte e apoiar a educação ambiental. Redução de resíduos e volume reciclado ainda não foram medidos.

## Equipe, IA e referências

Projeto acadêmico desenvolvido em equipe. As contribuições aparecem no histórico de commits, nas issues e nos pull requests. A lista de integrantes, cursos e responsabilidades será consolidada antes da entrega.

**Apoio de IA:** o ChatGPT foi usado para apoiar o planejamento, a organização da documentação, a análise descritiva da pesquisa e a redação deste README. A equipe revisa esses materiais, valida as informações de campo e testa o que incorpora ao projeto. A declaração final vai listar todas as ferramentas usadas.

**Bases:** regulamento *HackathonNassau.pdf* · *EcoTour-Relatorio-Pesquisa-Campus.pdf* · *EcoTour-ECO-05-Telas-e-Padrao-Visual.pdf* · [inventário dos pontos](docs/inventario-pontos.md) · [catálogo de materiais](docs/catalogo-materiais.md) · [backlog no GitHub](https://github.com/alanfelipe01/EcoTour/issues).

---

**EcoTour · UNINASSAU Aguanambi · Fortaleza–CE**
