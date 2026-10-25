// Catálogo de materiais do EcoTour.
// Vínculos respaldados por rótulos fotografados ou pelo mapeamento de cores
// confirmado para o campus em 24/10/2026.
const materiais = [
  {
    id: "folha-papel",
    nome: "Folha de papel limpa",
    termosBusca: ["papel", "folha", "folha A4", "papel de escritório"],
    categoria: "Papel",
    orientacao: "Separe as folhas limpas e secas dos demais resíduos.",
    coletor: "Coloque no coletor identificado como papel. Nos pontos identificados por cor, use o coletor azul.",
    cuidados: "Papel engordurado, guardanapos usados e papel higiênico não entram neste item.",
    pontosConfirmados: ["P-01", "P-02", "P-03", "P-04", "P-05", "P-06", "P-08", "P-09"],
    fonte: "https://www.gov.br/mma/pt-br/assuntos/educacao-ambiental/glossario-ea/o-que-e-reciclagem",
    revisadoEm: "2026-10-22"},
 {
    id: "garrafa-pet",
    nome: "Garrafa PET",
    termosBusca: ["pet", "garrafa plástica", "garrafa de água", "garrafa de refrigerante"],
    categoria: "Plástico",
    orientacao: "Esvazie a garrafa e retire os resíduos de bebida antes do descarte.",
    coletor: "Coloque no coletor identificado como plástico. Nos pontos identificados por cor, use o coletor vermelho.",
    cuidados: "Se estiver suja, enxágue para não contaminar outros recicláveis. Esta entrada não inclui embalagens de produtos químicos.",
    pontosConfirmados: ["P-01", "P-02", "P-03", "P-04", "P-05", "P-06", "P-08", "P-09"],
    fonte: "https://www.gov.br/mma/pt-br/assuntos/educacao-ambiental/glossario-ea/o-que-e-reciclagem",
    revisadoEm: "2026-10-22"
  },
   {
    id: "lata-aluminio",
    nome: "Lata de alumínio",
    termosBusca: ["lata", "latinha", "alumínio", "lata de refrigerante"],
    categoria: "Metal",
    orientacao: "Esvazie a lata e retire os resíduos de bebida antes do descarte.",
    coletor: "Coloque no coletor identificado como metal. Nos pontos identificados por cor, use o coletor amarelo.",
    cuidados: "Se necessário, enxágue a embalagem. Não misture com restos de comida.",
    pontosConfirmados: ["P-01", "P-02", "P-03", "P-04", "P-05", "P-06", "P-08", "P-09"],
    fonte: "https://www.gov.br/mma/pt-br/assuntos/educacao-ambiental/glossario-ea/o-que-e-reciclagem",
    revisadoEm: "2026-10-22"
  }, 
   {
    id: "garrafa-vidro",
    nome: "Garrafa de vidro inteira",
    termosBusca: ["vidro", "garrafa de vidro", "garrafa de bebida"],
    categoria: "Vidro",
    orientacao: "Esvazie a garrafa e retire os resíduos antes do descarte.",
    coletor: "Coloque a garrafa inteira no coletor identificado como vidro. Nos pontos identificados por cor, use o coletor verde.",
    cuidados: "Não inclua vidro quebrado, lâmpadas, espelhos ou cerâmica nesta entrada.",
    pontosConfirmados: ["P-01", "P-02", "P-03", "P-04", "P-05", "P-06", "P-08", "P-09"],
    fonte: "https://www.gov.br/mma/pt-br/assuntos/educacao-ambiental/glossario-ea/o-que-e-reciclagem",
    revisadoEm: "2026-10-22"
  },
    {
    id: "medicamento-vencido",
    nome: "Medicamento vencido",
    termosBusca: ["medicamento", "remédio", "remédio vencido", "comprimido"],
    categoria: "Medicamentos",
    orientacao: "Separe o medicamento vencido para entrega em um ponto que receba esse resíduo.",
    coletor: "Entregue o medicamento vencido no descartômetro dentro da secretaria. Confira a sinalização antes de depositá-lo.",
    cuidados: "Não descarte no lixo comum, pia ou vaso sanitário. O descartômetro do campus não aceita agulhas, seringas ou perfurocortantes.",
    pontosConfirmados: ["P-07"],
    fonte: "https://sinir.gov.br/perfis/logistica-reversa/logistica-reversa/medicamentos-seus-residuos-e-embalagens/",
    revisadoEm: "2026-10-22"
  },
    {
    id: "eletronicos",
    nome: "Eletrônicos",
    termosBusca: ["eletrônico", "lixo eletrônico", "celular", "carregador", "fone de ouvido"],
    categoria: "Eletroeletrônicos",
    orientacao: "Guarde o equipamento para entrega em um ponto de recebimento de eletroeletrônicos.",
    coletor: "Ainda não há coletor de eletrônicos confirmado no campus. Não coloque o equipamento nos coletores comuns.",
    cuidados: "Não coloque nos coletores comuns. Pilhas, baterias e lâmpadas exigem orientação específica.",
    pontosConfirmados: [],
    fonte: "https://sema.rs.gov.br/logistica-reversa",
    revisadoEm: "2026-10-22"
  },
   {
    id: "restos-comida",
    nome: "Restos de comida",
    termosBusca: ["comida", "resto de comida", "sobra de alimento", "resíduo orgânico"],
    categoria: "Orgânicos",
    orientacao: "Separe os restos de comida das embalagens e dos materiais recicláveis.",
    coletor: "Na entrada, perto do elevador (P-01), coloque os restos de comida no coletor marrom para orgânicos.",
    cuidados: "Não coloque alimentos nos coletores de recicláveis.",
    pontosConfirmados: ["P-01"],
    fonte: "https://www.gov.br/mma/pt-br/assuntos/educacao-ambiental/glossario-ea/o-que-e-compostagem",
    revisadoEm: "2026-10-24"
  }
];
