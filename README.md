# ♻️ EcoTour

**Informação para descartar melhor no campus.**

Guia digital de descarte de resíduos em desenvolvimento para a comunidade da **UNINASSAU Aguanambi, em Fortaleza–CE**, no **Hackathon UNINASSAU 2026 — Desafio Sustentabilidade**.

O EcoTour conecta três perguntas do dia a dia: **qual material tenho, como devo prepará-lo e onde posso descartá-lo dentro do campus?**

> **Em desenvolvimento.** A pesquisa, o inventário inicial e o catálogo já foram organizados. A interface e o fluxo de consulta ainda serão implementados. Este README descreve o estado dos arquivos da branch `main` em **22/10/2026**.

## Por que o EcoTour existe

Encontrar uma lixeira não significa saber o que ela recebe. Dúvidas sobre separação, identificação dos coletores e destino de materiais específicos podem dificultar o descarte correto.

O projeto busca reunir orientações e informações de localização em uma consulta simples para estudantes, funcionários e visitantes. A proposta parte de uma pesquisa com o público e de um levantamento presencial dos pontos de descarte do campus.

### O que a pesquisa mostrou

Foram analisadas **52 respostas**, coletadas em **19 e 20 de outubro de 2026**.

| Achado | Respostas | Percentual |
|---|---:|---:|
| Apontaram falta de informação sobre o destino dos materiais | 25 | 48,1% |
| Indicaram dúvidas sobre pilhas e baterias | 32 | 61,5% |
| Indicaram dúvidas sobre eletrônicos | 29 | 55,8% |
| Selecionaram mapa dos pontos como recurso útil | 35 | 67,3% |
| Selecionaram instruções de separação como recurso útil | 27 | 51,9% |
| Responderam que usariam o guia digital | 30 | 57,7% |

Fonte: *EcoTour — Relatório de Pesquisa do Campus*, elaborado em 21/10/2026. Os percentuais usam 52 respostas como base. As perguntas sobre dificuldades, materiais e recursos permitiam múltiplas escolhas. Os resultados descrevem a amostra recebida e não representam necessariamente toda a comunidade do campus.

Esses achados orientam a prioridade do projeto: explicar o descarte e facilitar a identificação dos locais. O interesse em um mapa será considerado na evolução da interface; a primeira versão deve permitir a consulta completa por lista e referências de localização.

## A experiência proposta

1. **Consultar um material:** procurar pelo nome ou selecionar um item do catálogo.
2. **Entender o descarte:** ler uma orientação curta, os cuidados necessários e a fonte consultada.
3. **Encontrar um destino compatível:** visualizar somente os pontos internos confirmados para aquele material.
4. **Reconhecer o local:** consultar localização, referência, foto disponível e eventuais restrições.

Também está previsto o acesso direto à lista de pontos. Quando não houver destino interno confirmado, o guia deverá informar essa ausência e manter a orientação do material acessível.

## Escopo da primeira versão

O EcoTour será um site de consulta com **HTML, CSS e JavaScript**, sem necessidade de login. Os dados serão mantidos pela equipe nos arquivos do projeto.

Estão previstos:

- Catálogo com busca por nome, categoria e termos comuns.
- Orientações de descarte com cuidados, fontes e data de revisão.
- Lista de pontos internos e detalhes para localizar cada um.
- Relação entre materiais e destinos efetivamente confirmados.
- Mensagens para buscas sem resultado e materiais sem destino confirmado.
- Navegação acessível e adaptação para celular e computador.

Pontos externos ao campus ficam para uma etapa futura. Esta versão não contempla back-end, banco de dados, cadastro, painel administrativo, GPS ou cálculo de rotas.

## Conteúdo já preparado

### Catálogo de materiais

Os **sete itens iniciais** estão documentados em [catálogo de materiais](docs/catalogo-materiais.md) e registrados em [materiais.js](assets/data/materiais.js).

| Material | Identificador |
|---|---|
| Folha de papel limpa | `folha-papel` |
| Garrafa PET | `garrafa-pet` |
| Lata de alumínio | `lata-aluminio` |
| Garrafa de vidro inteira | `garrafa-vidro` |
| Medicamento vencido | `medicamento-vencido` |
| Eletrônicos | `eletronicos` |
| Restos de comida | `restos-comida` |

Pilhas e baterias foram a dúvida mais frequente da pesquisa, mas ainda precisam de uma entrada própria com orientação revisada. Elas não devem ser tratadas automaticamente como parte da entrada de eletrônicos.

### Levantamento dos pontos

O [inventário de pontos internos](docs/inventario-pontos.md) registra **nove pontos observados em 19/10/2026**: oito conjuntos de coletores e um descartômetro de medicamentos, distribuídos por locais como entrada, refeitório, cantina, secretaria, Bloco B e estacionamento.

Os registros possuem identificadores de `P-01` a `P-09`. No arquivo atual, todos permanecem com validação **“observado”**. Ainda há pendências sobre recebimento de materiais, horários, restrições e destino final dos resíduos.

**Observar um coletor não confirma automaticamente o que ele recebe.** A vinculação ao catálogo deve se apoiar em sinalização verificável ou confirmação do setor responsável, sem presumir aceitação apenas pela cor.

## Andamento

| Frente | Situação em 22/10/2026 |
|---|---|
| Pesquisa com o público | 52 respostas analisadas |
| Inventário de campo | Nove pontos documentados, com pendências registradas |
| Catálogo inicial | Sete materiais documentados e inseridos em JavaScript |
| Vínculos entre materiais e pontos | Listas `pontosConfirmados` ainda vazias |
| Dados dos pontos para a interface | `pontos-descarte.js` ainda vazio |
| Fotografias | Referenciadas no inventário; arquivos ainda não presentes na `main` consultada |
| Páginas, estilos e interações | Arquivos criados, ainda sem implementação |
| Demonstração navegável e testes com usuários | Pendentes |

O planejamento e os critérios de aceite estão nas [issues do projeto](https://github.com/alanfelipe01/EcoTour/issues). O encerramento de uma issue deve ser acompanhado da conferência dos arquivos e das evidências correspondentes.

## Organização dos arquivos

| Caminho | Responsabilidade |
|---|---|
| `index.html` | Página inicial e entrada da consulta |
| `guia.html` | Consulta às orientações dos materiais |
| `pontos.html` | Consulta aos pontos de descarte |
| `assets/css/style.css` | Estilos e adaptação das telas |
| `assets/js/main.js` | Interações da página inicial |
| `assets/js/guia.js` | Interações do guia de materiais |
| `assets/js/pontos.js` | Interações da consulta aos pontos |
| `assets/data/materiais.js` | Catálogo e vínculos com pontos confirmados |
| `assets/data/pontos-descarte.js` | Arquivo reservado para os dados dos pontos |
| `assets/img/` | Recursos visuais do projeto |
| `docs/catalogo-materiais.md` | Orientações, justificativas e fontes do catálogo |
| `docs/inventario-pontos.md` | Levantamento dos pontos e pendências de validação |

As responsabilidades das páginas e dos scripts representam a organização prevista. Os dados ficam separados da lógica de interface para facilitar a revisão e a manutenção.

## Como consultar o projeto localmente

Por enquanto, o conteúdo disponível para análise está nos arquivos de documentação e de dados. **As páginas HTML estão vazias; abri-las ainda não apresenta uma demonstração funcional.**

Para obter os arquivos, use **Code → Download ZIP** no GitHub e extraia a pasta, ou clone o repositório:

```bash
git clone https://github.com/alanfelipe01/EcoTour.git
cd EcoTour
```

Em seguida, abra a pasta em um editor e consulte `docs/` e `assets/data/materiais.js`. Enquanto o repositório estiver privado, é necessário ter permissão de acesso.

O link da demonstração e as instruções de execução da interface serão acrescentados após a implementação e a verificação do fluxo principal.

## Como manter os dados

1. **Materiais:** atualize `assets/data/materiais.js`, preservando os identificadores e preenchendo nome, termos de busca, categoria, orientação, cuidados, fonte e data de revisão.
2. **Pontos:** registre as evidências e pendências em `docs/inventario-pontos.md`. Após definir a estrutura dos dados, preencha `assets/data/pontos-descarte.js` com informações conferidas.
3. **Vínculos:** adicione um ID em `pontosConfirmados` somente após verificar que o ponto correspondente recebe aquele material. Uma lista vazia significa que ainda não existe destino interno confirmado no catálogo.
4. **Consistência:** mantenha documentação e dados alinhados. Confira IDs, restrições, referências às fotos e datas antes de publicar.
5. **Validação da interface:** quando implementada, teste a consulta do material, seus destinos e os casos sem resultados ou sem ponto confirmado.

As fontes das orientações estão registradas por material no catálogo. As respostas individuais do formulário não devem ser publicadas; a documentação utiliza resultados agregados.

## Próximas etapas

- Concluir a conferência dos pontos e incorporar as fotografias.
- Preencher os dados dos pontos e validar os vínculos com os materiais.
- Construir as telas e implementar busca, orientações e consulta aos destinos.
- Verificar acessibilidade, uso no celular e consistência do conteúdo.
- Testar o guia com pessoas do campus e registrar os resultados.
- Publicar uma demonstração acessível e finalizar os materiais de apresentação.

O benefício esperado é facilitar decisões de descarte e apoiar a educação ambiental no campus. Ainda não foram medidos redução de resíduos, volume reciclado ou economia financeira decorrentes do projeto.

## Equipe, autoria e referências

O EcoTour é um projeto acadêmico desenvolvido em equipe. As contribuições podem ser acompanhadas pelo histórico de commits, pelas issues e pelos pull requests. A relação completa de integrantes, cursos, responsabilidades e eventuais mentores será consolidada antes da entrega.

**Apoio de IA:** o ChatGPT foi utilizado no apoio ao planejamento, à organização da documentação, à análise descritiva da pesquisa e à redação deste README. A equipe é responsável por revisar esses materiais, validar as informações de campo e compreender, adaptar e testar o que incorporar ao projeto. A declaração final deverá incluir outras ferramentas e referências efetivamente utilizadas.

Bases desta documentação:

- Regulamento *HackathonNassau.pdf* — contexto e requisitos da entrega.
- *EcoTour-Relatorio-Pesquisa-Campus.pdf* — análise das 52 respostas de 19 e 20/10/2026.
- [Inventário dos pontos](docs/inventario-pontos.md) — observações e pendências do levantamento presencial.
- [Catálogo de materiais](docs/catalogo-materiais.md) — seleção dos itens e fontes das orientações.
- [Backlog no GitHub](https://github.com/alanfelipe01/EcoTour/issues) — planejamento e critérios de aceite.

---

**EcoTour · UNINASSAU Aguanambi · Fortaleza–CE**
