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
];