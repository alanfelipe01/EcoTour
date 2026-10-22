// Catálogo de materiais do EcoTour.
// IDs em pontosConfirmados só entram após a conferência do ECO-03.
const materiais = [
  {
    id: "folha-papel",
    nome: "Folha de papel limpa",
    termosBusca: ["papel", "folha", "folha A4", "papel de escritório"],
    categoria: "Papel",
    orientacao: "Separe as folhas limpas e secas dos demais resíduos.",
    cuidados: "Papel engordurado, guardanapos usados e papel higiênico não entram neste item.",
    pontosConfirmados: [],
    fonte: "https://www.gov.br/mma/pt-br/assuntos/educacao-ambiental/glossario-ea/o-que-e-reciclagem",
    revisadoEm: "2026-10-22"},
 {
    id: "garrafa-pet",
    nome: "Garrafa PET",
    termosBusca: ["pet", "garrafa plástica", "garrafa de água", "garrafa de refrigerante"],
    categoria: "Plástico",
    orientacao: "Esvazie a garrafa e retire os resíduos de bebida antes do descarte.",
    cuidados: "Se estiver suja, enxágue para não contaminar outros recicláveis. Esta entrada não inclui embalagens de produtos químicos.",
    pontosConfirmados: [],
    fonte: "https://www.gov.br/mma/pt-br/assuntos/educacao-ambiental/glossario-ea/o-que-e-reciclagem",
    revisadoEm: "2026-10-22"
  },
   {
    id: "lata-aluminio",
    nome: "Lata de alumínio",
    termosBusca: ["lata", "latinha", "alumínio", "lata de refrigerante"],
    categoria: "Metal",
    orientacao: "Esvazie a lata e retire os resíduos de bebida antes do descarte.",
    cuidados: "Se necessário, enxágue a embalagem. Não misture com restos de comida.",
    pontosConfirmados: [],
    fonte: "https://www.gov.br/mma/pt-br/assuntos/educacao-ambiental/glossario-ea/o-que-e-reciclagem",
    revisadoEm: "2026-10-22"
  }, 
   {
    id: "garrafa-vidro",
    nome: "Garrafa de vidro inteira",
    termosBusca: ["vidro", "garrafa de vidro", "garrafa de bebida"],
    categoria: "Vidro",
    orientacao: "Esvazie a garrafa e retire os resíduos antes do descarte.",
    cuidados: "Não inclua vidro quebrado, lâmpadas, espelhos ou cerâmica nesta entrada.",
    pontosConfirmados: [],
    fonte: "https://www.gov.br/mma/pt-br/assuntos/educacao-ambiental/glossario-ea/o-que-e-reciclagem",
    revisadoEm: "2026-10-22"
  },
    {
    id: "medicamento-vencido",
    nome: "Medicamento vencido",
    termosBusca: ["medicamento", "remédio", "remédio vencido", "comprimido"],
    categoria: "Medicamentos",
    orientacao: "Separe o medicamento vencido para entrega em um ponto que receba esse resíduo.",
    cuidados: "Não descarte no lixo comum, pia ou vaso sanitário. O descartômetro do campus não aceita agulhas, seringas ou perfurocortantes.",
    pontosConfirmados: [],
    fonte: "https://sinir.gov.br/perfis/logistica-reversa/logistica-reversa/medicamentos-seus-residuos-e-embalagens/",
    revisadoEm: "2026-10-22"
  },
];