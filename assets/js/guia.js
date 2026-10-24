// Executa apenas na tela do guia.
if (document.body.classList.contains("pagina-guia")) {
  iniciarGuia();
}

function iniciarGuia() {
  const guia = document.querySelector("#guia-material");
  const estadoErro = document.querySelector("#estado-erro");

  function mostrarErro(titulo, mensagem) {
    guia.hidden = true;
    estadoErro.hidden = false;

    document.querySelector("#titulo-erro").textContent = titulo;
    document.querySelector("#mensagem-erro").textContent = mensagem;

    document.title = `EcoTour | ${titulo}`;
  }

  // Exemplo de URL: guia.html?material=garrafa-pet
  const parametros = new URLSearchParams(window.location.search);
  const idMaterial = parametros.get("material")?.trim();

  if (!idMaterial) {
    mostrarErro(
      "Escolha um material",
      "Volte ao catálogo e selecione o material que deseja consultar."
    );
    return;
  }

  // Confere se o arquivo materiais.js foi carregado.
  if (typeof materiais === "undefined" || !Array.isArray(materiais)) {
    mostrarErro(
      "Não foi possível carregar o guia",
      "Atualize a página para tentar novamente."
    );
    return;
  }

  // Procura o material pelo identificador recebido na URL.
  const material = materiais.find((item) => item.id === idMaterial);

  if (!material) {
    mostrarErro(
      "Material não encontrado",
      "Este material não está no catálogo. Volte à página inicial e escolha uma das opções disponíveis."
    );
    return;
  }

  document.title = `EcoTour | ${material.nome}`;

  document.querySelector("#nome-material").textContent = material.nome;
  document.querySelector("#categoria-material").textContent =
    material.categoria;

  document.querySelector("#orientacao-material").textContent =
    material.orientacao;

  document.querySelector("#cuidados-material").textContent =
    material.cuidados;

  preencherDestino(material);
  preencherFonte(material.fonte);
  preencherData(material.revisadoEm);

  estadoErro.hidden = true;
  guia.hidden = false;
}

function preencherDestino(material) {
  const destinoConfirmado = document.querySelector("#destino-confirmado");
  const destinoNaoConfirmado =
    document.querySelector("#destino-nao-confirmado");

  // Confere o vínculo nos dois catálogos antes de anunciar um destino.
  const ids = Array.isArray(material.pontosConfirmados)
    ? [...new Set(material.pontosConfirmados.filter((id) => typeof id === "string" && id.trim()))]
    : [];
  const pontos = typeof pontosDescarte !== "undefined" && Array.isArray(pontosDescarte)
    ? pontosDescarte.filter((ponto) =>
        ids.includes(ponto.id) && ponto.situacao === "confirmado" &&
        ponto.disponibilidade === "disponível" &&
        Array.isArray(ponto.materiaisConfirmados) &&
        ponto.materiaisConfirmados.includes(material.id))
    : [];

  const quantidade = pontos.length;
  const possuiDestino = quantidade > 0;

  destinoConfirmado.hidden = !possuiDestino;
  destinoNaoConfirmado.hidden = possuiDestino;

  if (!possuiDestino) {
    return;
  }

  document.querySelector("#resumo-pontos").textContent =
    quantidade === 1
      ? "Há 1 ponto com recebimento confirmado para este material. Consulte a localização e as restrições antes de levar seu resíduo."
      : `Há ${quantidade} pontos com recebimento confirmado para este material. Consulte as localizações e as restrições antes de levar seu resíduo.`;

  // A tela de pontos deverá ler esse parâmetro para filtrar a lista.
  document.querySelector("#link-pontos-material").href =
    `pontos.html?material=${encodeURIComponent(material.id)}`;
}

function preencherFonte(fonte) {
  const link = document.querySelector("#fonte-material");
  const aviso = document.querySelector("#fonte-indisponivel");

  link.hidden = true;
  aviso.hidden = true;

  // Exibe somente endereços web válidos.
  try {
    const endereco = new URL(fonte);

    if (!["https:", "http:"].includes(endereco.protocol)) {
      throw new Error("Protocolo de fonte inválido.");
    }

    link.href = endereco.href;
    link.hidden = false;
  } catch {
    aviso.hidden = false;
  }
}

function preencherData(valor) {
  const revisao = document.querySelector("#revisao-material");
  const elementoData = document.querySelector("#data-revisao");

  revisao.hidden = true;

  if (typeof valor !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(valor)) {
    return;
  }

  // Usa UTC na leitura e na formatação para evitar mudança de dia.
  const data = new Date(`${valor}T00:00:00Z`);

  if (
    Number.isNaN(data.getTime()) ||
    data.toISOString().slice(0, 10) !== valor
  ) {
    return;
  }

  elementoData.dateTime = valor;
  elementoData.textContent = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC"
  }).format(data);

  revisao.hidden = false;
}
