# Análise técnica do EcoTour

Data: 24/10/2026. Escopo: todos os 23 arquivos versionados da cópia local, incluindo as nove fotografias. O repositório está na subpasta `EcoTour`, e estava sem alterações locais no início da análise.

## Diagnóstico

O projeto já entrega consulta e orientação de materiais, mas ainda não entrega a localização dos pontos de descarte. A prioridade é completar esse fluxo e garantir a confiabilidade dos dados. HTML, CSS e JavaScript sem framework são suficientes para o escopo descrito; não há justificativa identificada para introduzir banco de dados, login ou migração de arquitetura.

Há quatro arquivos vazios: `pontos.html`, `assets/js/pontos.js`, `assets/data/pontos-descarte.js` e `assets/img/logo.svg`. Os sete materiais têm `pontosConfirmados: []`, coerentemente com o inventário, que mantém os nove pontos como observados. Não preencher esses vínculos por dedução de cores ou apenas para fazer a interface parecer completa.

## Achados por prioridade

### 1. Alta — navegação leva a uma página vazia

Evidência: `pontos.html` tem zero bytes. `index.html:25` e `index.html:89`, além de `guia.html:31` e `guia.html:118`, levam a esse arquivo. O script e os dados correspondentes também estão vazios.

Impacto: tanto a entrada direta quanto o próximo passo após ler uma orientação encerram a experiência em uma tela sem conteúdo. A existência do arquivo evita um arquivo ausente, mas não resolve o fluxo.

Modificar:

- Modelar os nove pontos a partir do inventário, preservando validação, disponibilidade e data histórica separadamente.
- Definir `area`, localização, foto, restrições, horários conhecidos, materiais confirmados e evidência de confirmação. Horário desconhecido deve continuar explícito.
- Implementar lista geral, filtro por área, filtro `?material=id` e detalhe `?ponto=P-xx`.
- Tratar parâmetro inválido, material sem destino, filtro vazio, dados indisponíveis e ponto indisponível.
- Na lista geral, permitir consultar pontos observados com aviso claro; no fluxo de descarte confirmado, não apresentá-los como destinos validados.

Aceite: todos os links têm destino útil e nenhum ponto observado aparece como confirmado sem evidência.

### 2. Alta — confirmação depende apenas de uma string no catálogo

Evidência: `assets/js/guia.js:72–103`. `preencherDestino` remove duplicatas e strings vazias, mas não verifica existência, situação ou compatibilidade do ponto. `guia.html` nem carrega os dados dos pontos.

Reprodução em execução isolada: substituir temporariamente, em memória, os vínculos da Garrafa PET por `["P-INEXISTENTE"]` faz a função exibir “Há 1 ponto com recebimento confirmado”.

É um defeito latente: os dados atuais estão vazios e não provocam uma indicação falsa hoje. Passará a importar assim que os vínculos forem preenchidos.

Modificar: resolver os IDs contra o cadastro, verificar confirmação para aquele material e tratar disponibilidade separadamente. Um ponto confirmado, porém temporariamente indisponível, deve ter essa condição explícita e não ser apresentado como opção utilizável. Adicionar validação automática dos vínculos para impedir dados inconsistentes na publicação.

### 3. Alta para a cobertura do produto — pilhas e baterias ausentes

Evidência: `docs/catalogo-materiais.md:20` e README registram 32 de 52 respostas com essa dúvida. Nenhuma das sete entradas atende a ela. Testes de busca por `pilha` e `bateria` retornaram zero resultados.

Modificar: preparar uma entrada própria, com orientação revisada, fonte adequada, sinônimos e ícone. A falta de destino interno confirmado não impede uma orientação educativa com aviso de ausência de destino — o guia já oferece esse estado para os outros materiais. A orientação específica ainda precisa ser validada; não derivá-la automaticamente da entrada de eletrônicos.

### 4. Média — documentação não representa a implementação

Evidência: `README.md:7`, `:53` e `:72` afirmam que as páginas não foram implementadas e que as fotos estão fora do repositório. A página inicial, o guia e as nove fotos já existem.

Modificar: atualizar andamento por funcionalidade, instruções de abertura, estrutura de arquivos e próximos passos. Explicar que o site é estático, que pode ser aberto localmente e que um servidor HTTP local é útil para testar condições próximas da publicação. Documentar a URL publicada quando ela existir.

As referências aos relatórios de pesquisa, design e regulamento são apenas nomes de PDFs ausentes desta cópia. Adicionar links para versões acessíveis à equipe ou documentar onde encontrá-las. Os números da pesquisa foram avaliados quanto à coerência interna, não auditados contra respostas individuais ou PDFs ausentes.

### 5. Média — evidências fotográficas têm caminhos divergentes

Evidência: `docs/inventario-pontos.md:19–27` cita arquivos como `entrada_da_universidade.jpeg`; os arquivos reais são `assets/img/P-01.jpg` a `P-09.jpg`.

Modificar: fazer o inventário apontar para os caminhos reais, com links relativos clicáveis, e usar os mesmos caminhos no cadastro dos pontos. Preservar a relação explícita entre ID, foto e observação. A inspeção visual das nove imagens encontrou os conjuntos de coletores e o descartômetro; ela não confirma operação atual, horários ou destinação final.

### 6. Média antes de implementar a galeria — fotografias pesadas

As nove imagens somam **26.748.304 bytes (26,75 MB decimais / 25,51 MiB)**. Seis têm resolução 3024 × 4032 e três têm 1086 × 1448. Hoje elas não são carregadas pelas páginas implementadas, portanto este é um risco da futura tela de pontos, não uma lentidão comprovada da página inicial.

| Foto | Tamanho aproximado | Dimensões |
|---|---:|---|
| P-01 | 3,87 MB | 3024 × 4032 |
| P-02 | 3,04 MB | 3024 × 4032 |
| P-03 | 0,53 MB | 1086 × 1448 |
| P-04 | 0,60 MB | 1086 × 1448 |
| P-05 | 0,61 MB | 1086 × 1448 |
| P-06 | 4,32 MB | 3024 × 4032 |
| P-07 | 5,28 MB | 3024 × 4032 |
| P-08 | 4,01 MB | 3024 × 4032 |
| P-09 | 4,48 MB | 3024 × 4032 |

Modificar: produzir versões dimensionadas para os cartões e detalhes, avaliar WebP, carregar imagens fora da primeira tela sob demanda e declarar dimensões para estabilizar o layout. Preservar legibilidade dos rótulos e manter os originais como evidência. Revisar metadados antes de publicar; metadados não foram inspecionados nesta análise.

### 7. Média — falta validação estrutural dos registros

Evidência: `assets/js/main.js:125–130` espalha `material.termosBusca` sem validar seu tipo. O carregamento verifica apenas se `materiais` é um array. Um registro com `termosBusca: null`, simulado em memória, interrompe a renderização com `material.termosBusca is not iterable`.

Os sete registros atuais não apresentam esse erro. O risco está na manutenção manual documentada no README.

Modificar: validar IDs únicos, campos obrigatórios, listas de termos, datas reais, URLs e vínculos antes da publicação. Na interface, oferecer estado de erro compreensível para dados inválidos, evitando interromper toda a listagem por um item defeituoso. Aplicar regras equivalentes aos pontos.

### 8. Média — padrão visual documentado e código divergem

Evidência: README prevê Nunito, conteúdo até 720px e navegação inferior Materiais/Pontos. Os dois CSS usam Arial, contêiner de até 1040px e os HTML têm navegação no cabeçalho, sem barra inferior.

Isso é uma divergência de especificação, não prova de que o layout implementado é ruim. Decidir qual proposta será adotada e sincronizar documentação e código. O PDF de design não está disponível localmente para comparação integral.

Há duplicação de cores, base, contêiner, cabeçalho, marca, foco, link de salto e rodapé entre `style.css` e `guia.css`. Extrair a base comum antes de adicionar uma terceira folha com as mesmas regras. Manter estilos específicos por página e evitar uma refatoração de framework sem necessidade.

### 9. Baixa — busca pouco tolerante a variações

A busca normaliza acentos, maiúsculas e espaços nas extremidades, mas compara uma sequência literal dentro do texto concatenado. `garrafa   pet`, com espaços internos repetidos, retorna zero, enquanto `garrafa` retorna duas entradas.

Modificar: normalizar espaços internos. Avaliar pesquisa por palavras em qualquer ordem, com testes para evitar correspondências enganosas. Ampliar sinônimos a partir de tentativas reais dos usuários. Acentos e limpeza da busca já funcionam e devem ser preservados.

### 10. Baixa — logo vazio e pequenos pontos de acabamento

`assets/img/logo.svg` tem zero bytes e não é usado pelas páginas. Não quebra o logotipo atual, que é textual. Criar um SVG válido caso esse ativo faça parte da identidade ou remover o placeholder. Favicon e metadados de compartilhamento podem ser acrescentados depois dos fluxos essenciais.

Padronizar a indentação de `main.js` e `materiais.js` facilitará manutenção, mas não tem prioridade sobre as funcionalidades ausentes.

## Cobertura por arquivo

| Arquivo | Avaliação e ação |
|---|---|
| `index.html` | Estrutura semântica, label, região de status e noscript presentes. Corrigir destino da navegação e alinhar padrão visual. |
| `guia.html` | Estados de material ausente e destino não confirmado presentes. Integrar cadastro de pontos e alinhar navegação. |
| `pontos.html` | Vazio; implementar fluxo completo. |
| `assets/js/main.js` | Busca funcional; validar registros e normalizar espaços internos. |
| `assets/js/guia.js` | Boa validação de fonte e data; corrigir validação de destinos. |
| `assets/js/pontos.js` | Vazio; implementar filtros, detalhe e estados. |
| `assets/data/materiais.js` | Sete entradas, sem destinos confirmados; ampliar cobertura e validar esquema. |
| `assets/data/pontos-descarte.js` | Vazio; estruturar inventário sem inventar confirmações. |
| `assets/css/style.css` | Responsividade prevista no código; compartilhar base e validar visualmente. |
| `assets/css/guia.css` | Mesma duplicação; preservar regras de hidden e foco. |
| `assets/img/logo.svg` | Vazio e não referenciado. |
| `assets/img/P-01.jpg` a `P-09.jpg` | Todas decodificaram e foram inspecionadas em painel; otimizar versões de exibição. |
| `docs/inventario-pontos.md` | Boa separação de observação e confirmação; corrigir referências das fotos e completar verificações em campo. |
| `docs/catalogo-materiais.md` | Coerente nos IDs e na ausência de destinos; incluir pilhas/baterias e manter textos sincronizados. |
| `README.md` | Atualizar implementação, fotos, instruções e decisões visuais. |

## Fontes e confiabilidade editorial

As quatro URLs distintas do catálogo retornaram conteúdo na consulta web desta análise:

- [MMA — O que é reciclagem](https://www.gov.br/mma/pt-br/assuntos/educacao-ambiental/glossario-ea/o-que-e-reciclagem).
- [MMA — O que é compostagem](https://www.gov.br/mma/pt-br/assuntos/educacao-ambiental/glossario-ea/o-que-e-compostagem).
- [SINIR — Medicamentos, seus resíduos e embalagens](https://sinir.gov.br/perfis/logistica-reversa/logistica-reversa/medicamentos-seus-residuos-e-embalagens/).
- [SEMA/RS — Logística reversa](https://sema.rs.gov.br/logistica-reversa).

Disponibilidade de uma URL não certifica que ela sustenta cada instrução específica. A página da SEMA/RS contém contexto do Rio Grande do Sul; revisar sua adequação como referência de orientação para Fortaleza e preferir referência nacional ou local quando aplicável. Nenhuma dessas páginas confirma recebimento no campus.

Separar fonte da orientação geral de evidência local do ponto. Registrar título/órgão da fonte tornará a referência mais informativa que o link genérico atual. A restrição do descartômetro e a finalidade pendente do P-01 devem continuar vinculadas ao inventário local. Não atualizar `revisadoEm` sem revisão efetiva do conteúdo.

## Verificações realizadas e limites

- Leitura integral de HTML, CSS, JavaScript, dados e Markdown; levantamento de arquivos versionados e arquivos vazios.
- `node --check` nos três arquivos JavaScript não vazios: sem erros de sintaxe.
- Execução dos scripts reais em Node com DOM mínimo simulado: sete cartões iniciais; busca `remedio` e `ALUMINIO`; busca `garrafa`; resultado vazio; limpeza; guia com material válido, ausente e inválido; falta do arquivo de dados.
- Simulações adicionais: destino inexistente anunciado como confirmado; falha com `termosBusca: null`; fonte `javascript:` rejeitada; data impossível rejeitada.
- Cálculo das combinações principais da paleta: texto suave sobre fundo claro 5,59:1; texto suave sobre verde claro 5,14:1; branco sobre verde principal 8,13:1; verde principal sobre verde claro 6,84:1. Essas combinações superam 4,5:1, mas não constituem auditoria completa de acessibilidade.
- Decodificação das nove imagens, dimensões, tamanhos e inspeção visual em painel.

Não foram executados testes em navegador real, leitor de tela, teclado/zoom, celular físico, Lighthouse ou ambiente publicado. O DOM simulado verifica lógica, não renderização, foco real ou árvore de acessibilidade. Antes da entrega, testar larguras de 320, 375, 768 e 1280px, zoom ampliado, ordem de foco, anúncios de resultados, legibilidade das fotos e navegação completa.

Não há manifesto de dependências ou ferramentas de build nos arquivos versionados. Não há pacotes declarados a atualizar nesta cópia. Também não foram encontradas configuração de CI ou suíte de testes versionadas. A ausência de framework ou build não é defeito para um site estático desse porte.

## Ordem de execução recomendada

1. Definir o contrato dos pontos e transportar o inventário com estados fiéis às evidências.
2. Implementar a página de pontos e integrar a validação dos vínculos no guia.
3. Atualizar documentação, referências das fotos e conteúdo de pilhas/baterias após revisão.
4. Preparar fotos para exibição e consolidar CSS comum conforme a decisão visual.
5. Automatizar invariantes dos dados e cenários essenciais de navegação; executar validação real em navegador antes de publicar.

As correções técnicas podem avançar sem esperar confirmações de campo, usando os estados observado e desconhecido. Confirmações de recebimento, horários, restrições e destino final dependem de evidência da equipe do campus.

Esta análise não altera a aplicação. O único arquivo acrescentado ao repositório é este relatório.
