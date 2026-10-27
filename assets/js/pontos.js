if (document.body.classList.contains("pagina-pontos")) iniciarPontos();

function iniciarPontos() {
  const listaArea = document.querySelector("#area-lista");
  const detalhe = document.querySelector("#detalhe-ponto");
  const erro = document.querySelector("#estado-erro");
  const parametros = new URLSearchParams(window.location.search);
  const idPonto = parametros.get("ponto")?.trim();
  const idMaterial = parametros.get("material")?.trim();

  function mostrarErro(titulo, mensagem) {
    listaArea.hidden = true;
    detalhe.hidden = true;
    erro.hidden = false;
    document.querySelector("#titulo-erro").textContent = titulo;
    document.querySelector("#mensagem-erro").textContent = mensagem;
    document.title = `EcoTour | ${titulo}`;
  }

  if (typeof pontosDescarte === "undefined" || !Array.isArray(pontosDescarte) ||
      !pontosDescarte.every((p) => p && typeof p.id === "string" && typeof p.nome === "string" &&
        typeof p.area === "string" && typeof p.localizacao === "string" &&
        typeof p.situacao === "string" && typeof p.foto === "string")) {
    mostrarErro("Não foi possível carregar os pontos", "Os dados estão indisponíveis. Atualize a página para tentar novamente.");
    return;
  }

  // P-04 e P-05 são dois conjuntos no mesmo local. Os registros e as evidências
  // continuam separados no inventário; a navegação apresenta a cantina uma vez.
  const conjuntoCantina = pontosDescarte.find((ponto) => ponto.id === "P-05");
  const locais = pontosDescarte
    .filter((ponto) => ponto.id !== "P-05" || !pontosDescarte.some((item) => item.id === "P-04"))
    .map((ponto) => ({
      ...ponto,
      registros: ponto.id === "P-04" && conjuntoCantina
        ? [ponto, conjuntoCantina]
        : [ponto]
    }));

  document.querySelector("#total-pontos").textContent =
    String(locais.length);
  document.querySelector("#total-registros").textContent =
    String(pontosDescarte.length);

  if (idPonto) {
    const ponto = locais.find((item) => item.registros.some((registro) => registro.id === idPonto));
    if (!ponto) {
      mostrarErro("Ponto não encontrado", "Este ponto não está no inventário. Consulte a lista de locais identificados.");
      const link = document.createElement("a");
      link.href = "pontos.html";
      link.textContent = "Ver todos os pontos";
      erro.append(link);
      return;
    }
    const materialDoDetalhe = typeof materiais !== "undefined" && Array.isArray(materiais)
      ? materiais.find((item) => item.id === idMaterial && pontoRecebeMaterial(ponto, item))
      : null;
    mostrarDetalhe(ponto, materialDoDetalhe);
    return;
  }

  if (typeof materiais === "undefined" || !Array.isArray(materiais)) {
    mostrarErro("Não foi possível carregar os materiais", "Atualize a página para tentar novamente.");
    return;
  }

  const materialInicial = idMaterial
    ? materiais.find((item) => item.id === idMaterial)
    : null;
  if (idMaterial && !materialInicial) {
    mostrarErro("Material não encontrado", "Este material não está no catálogo. Escolha um material na página inicial.");
    return;
  }

  montarLista(materialInicial);

  function montarLista(materialInicial) {
    const filtroArea = document.querySelector("#filtro-area");
    const filtroMaterial = document.querySelector("#filtro-material");
    const areas = [...new Set(locais.map((p) => p.area))]
      .sort((a, b) => a.localeCompare(b, "pt-BR"));
    areas.forEach((area) => filtroArea.add(new Option(area, area)));
    [...materiais].sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"))
      .forEach((material) => filtroMaterial.add(new Option(material.nome, material.id)));
    filtroMaterial.value = materialInicial?.id ?? "";
    filtroArea.addEventListener("change", renderizar);
    filtroMaterial.addEventListener("change", () => {
      const url = new URL(window.location.href);
      if (filtroMaterial.value) url.searchParams.set("material", filtroMaterial.value);
      else url.searchParams.delete("material");
      try {
        window.history.replaceState(null, "", url);
      } catch {
        // Alguns navegadores restringem alterações da URL ao abrir o HTML como arquivo local.
      }
      renderizar();
    });
    document.querySelector("#limpar-filtro").addEventListener("click", () => {
      filtroArea.value = "";
      renderizar();
      filtroArea.focus();
    });
    listaArea.hidden = false;
    renderizar();

    function renderizar() {
      const material = materiais.find((item) => item.id === filtroMaterial.value);
      const pontosMaterial = material
        ? locais.filter((ponto) => pontoRecebeMaterial(ponto, material))
        : locais;
      const visiveis = pontosMaterial.filter((ponto) =>
        !filtroArea.value || ponto.area === filtroArea.value);
      const aviso = document.querySelector("#aviso-material");
      aviso.hidden = !material;
      document.title = material
        ? `EcoTour | Pontos para ${material.nome}`
        : "EcoTour | Pontos de descarte";
      if (material) {
        document.querySelector("#titulo-aviso-material").textContent = pontosMaterial.length
          ? `Locais identificados para ${material.nome}`
          : `Sem local confirmado para ${material.nome}`;
        document.querySelector("#texto-aviso-material").textContent = pontosMaterial.length
          ? `${material.coletor} Confira a sinalização e a disponibilidade atual ao chegar.`
          : "Ainda não há um local com recebimento confirmado e disponível para este material no campus. Confirme com o setor responsável antes de levá-lo.";
      }
      const lista = document.querySelector("#lista-pontos");
      lista.replaceChildren(...visiveis.map((ponto) => criarCartao(ponto, material)));
      document.querySelector("#resumo-lista").textContent = `${visiveis.length} ${visiveis.length === 1 ? "local encontrado" : "locais encontrados"}`;
      document.querySelector("#estado-vazio").hidden =
        visiveis.length > 0 || !filtroArea.value || pontosMaterial.length === 0;
      document.querySelector("#texto-estado-vazio").textContent = material
        ? "Não há ponto identificado para este material nesta área. Escolha outra área ou veja todas."
        : "Escolha outra área ou veja todos os locais identificados.";
    }
  }

  function criarCartao(ponto, material) {
    const item = document.createElement("li");
    const link = document.createElement("a");
    link.className = "cartao-ponto";
    link.href = `pontos.html?ponto=${encodeURIComponent(ponto.id)}` +
      (material ? `&material=${encodeURIComponent(material.id)}` : "");
    const fotos = document.createElement("span");
    fotos.className = ponto.registros.length > 1 ? "cartao-fotos cartao-fotos-duplas" : "cartao-fotos";
    ponto.registros.forEach((registro) => {
      const imagem = document.createElement("img");
      imagem.src = fotoOtimizada(registro.foto);
      imagem.alt = "";
      imagem.loading = "lazy";
      imagem.width = 1200;
      imagem.height = 1600;
      fotos.append(imagem);
    });
    const conteudo = document.createElement("span");
    conteudo.className = "cartao-conteudo";
    const id = document.createElement("span");
    id.className = "identificador";
    id.textContent = `${ponto.registros.map((registro) => `Ponto ${Number(registro.id.slice(2))}`).join(" e ")}, ${ponto.area.toLowerCase()}`;
    const nome = document.createElement("strong");
    nome.textContent = ponto.nome;
    const local = document.createElement("span");
    local.className = "cartao-localizacao";
    local.textContent = ponto.registros.length > 1
      ? `${ponto.registros.length} conjuntos de coletores na cantina`
      : ponto.localizacao;
    local.hidden = local.textContent === ponto.nome;
    const descricao = document.createElement("span");
    descricao.className = "cartao-descricao";
    descricao.textContent = ponto.descricao ?? "";
    descricao.hidden = !ponto.descricao;
    const situacao = document.createElement("span");
    situacao.className = "etiqueta-situacao";
    situacao.textContent = rotuloSituacao(ponto);
    const materiaisPonto = document.createElement("span");
    materiaisPonto.className = "materiais-ponto";
    const categorias = typeof materiais !== "undefined" && Array.isArray(materiais)
      ? [...new Set(materiais.filter((material) =>
          pontoRecebeMaterial(ponto, material)).map((material) => material.categoria))]
      : [];
    materiaisPonto.textContent = categorias.length && ponto.situacao === "confirmado"
      ? `Recebe: ${categorias.join(", ")}`
      : "Materiais em verificação";
    const chamada = document.createElement("span");
    chamada.className = "chamada-ponto";
    chamada.textContent = "Ver detalhes";
    conteudo.append(id, nome, local, descricao, materiaisPonto, situacao, chamada);
    link.append(fotos, conteudo);
    item.append(link);
    return item;
  }

  function mostrarDetalhe(ponto, material) {
    document.title = `EcoTour | ${ponto.nome}`;
    document.querySelector(".detalhe-cabecalho").classList.toggle(
      "detalhe-com-galeria", ponto.registros.length > 1);
    document.querySelector("#id-ponto").textContent = `${ponto.registros.map((registro) => `Ponto ${Number(registro.id.slice(2))}`).join(" e ")}, ${ponto.area.toLowerCase()}`;
    document.querySelector("#nome-ponto").textContent = ponto.nome;
    const localizacao = document.querySelector("#localizacao-ponto");
    localizacao.textContent = ponto.registros.length > 1
      ? `${ponto.registros.length} conjuntos de coletores na cantina`
      : ponto.localizacao;
    localizacao.hidden = localizacao.textContent === ponto.nome;
    const descricao = document.querySelector("#descricao-ponto");
    descricao.textContent = ponto.descricao ?? "";
    descricao.hidden = !ponto.descricao;
    document.querySelector("#situacao-ponto").textContent = rotuloSituacao(ponto);
    const instrucao = document.querySelector("#instrucao-material");
    instrucao.hidden = !material;
    if (material) {
      document.querySelector("#titulo-instrucao-material").textContent = `Como descartar ${material.nome} aqui`;
      document.querySelector("#texto-instrucao-material").textContent = material.coletor;
      document.querySelector("#voltar-lista").href =
        `pontos.html?material=${encodeURIComponent(material.id)}`;
      document.querySelector("#voltar-lista").lastChild.textContent = " Ver pontos para este material";
    }
    document.querySelector("#coletores-ponto").textContent = ponto.registros.length > 1
      ? ponto.registros.map((registro) => `${registro.id}: ${registro.coletores}`).join(" ")
      : ponto.coletores;
    document.querySelector("#identificacao-ponto").textContent = ponto.registros.length > 1
      ? ponto.registros.map((registro) => `${registro.id}: ${registro.identificacao}`).join(" ")
      : ponto.identificacao;
    document.querySelector("#restricoes-ponto").textContent = ponto.registros.length > 1
      ? ponto.registros.map((registro) => `${registro.id}: ${registro.restricoes}`).join(" ")
      : ponto.restricoes;
    document.querySelector("#disponibilidade-ponto").textContent =
      ponto.registros.every((registro) => registro.disponibilidade === "disponível")
        ? ponto.registros.length > 1
          ? "Os dois conjuntos estavam acessíveis na data da observação; a disponibilidade atual não foi verificada."
          : "Estava acessível na data da observação; a disponibilidade atual não foi verificada."
        : ponto.registros.every((registro) => registro.disponibilidade === "indisponível")
          ? "Os conjuntos estão registrados como indisponíveis."
          : "Confira a disponibilidade de cada conjunto no local.";
    const galeria = document.querySelector("#galeria-ponto");
    galeria.replaceChildren(...ponto.registros.map((registro) => {
      const figura = document.createElement("figure");
      figura.className = "foto-detalhe";
      const imagem = document.createElement("img");
      imagem.src = fotoOtimizada(registro.foto);
      imagem.alt = `Conjunto de coletores ${registro.id} na ${ponto.nome}`;
      imagem.width = 1200;
      imagem.height = 1600;
      imagem.classList.toggle("foto-lixeiras", registro.id === "P-05");
      const legenda = document.createElement("figcaption");
      const link = document.createElement("a");
      link.href = registro.foto;
      link.textContent = `Ver foto original do ponto ${Number(registro.id.slice(2))}`;
      legenda.append(link);
      figura.append(imagem, legenda);
      return figura;
    }));
    const data = document.querySelector("#data-ponto");
    data.dateTime = ponto.verificadoEm;
    data.textContent = formatarData(ponto.verificadoEm);
    detalhe.hidden = false;
  }
}

function pontoRecebeMaterial(ponto, material) {
  return (ponto.registros ?? [ponto]).some((registro) =>
    registro.situacao === "confirmado" &&
    registro.disponibilidade === "disponível" &&
    Array.isArray(registro.materiaisConfirmados) &&
    registro.materiaisConfirmados.includes(material.id) &&
    Array.isArray(material.pontosConfirmados) &&
    material.pontosConfirmados.includes(registro.id));
}

function fotoOtimizada(original) {
  return original.replace(/\.jpg$/i, ".webp");
}

function rotuloSituacao(ponto) {
  if (ponto.registros?.length > 1 &&
      !ponto.registros.every((registro) => registro.situacao === ponto.situacao &&
        registro.disponibilidade === ponto.disponibilidade)) {
    return "Confira cada conjunto";
  }
  if (ponto.disponibilidade === "indisponível") return "Indisponível";
  return ponto.situacao === "confirmado" ? "Recebimento identificado" : "Recebimento a confirmar";
}

function formatarData(valor) {
  if (typeof valor !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(valor)) return "data não informada";
  const data = new Date(`${valor}T00:00:00Z`);
  return Number.isNaN(data.getTime()) ? "data não informada" :
    new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(data);
}
