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

  document.querySelector("#total-pontos").textContent =
    String(pontosDescarte.length).padStart(2, "0");

  if (idPonto) {
    const ponto = pontosDescarte.find((item) => item.id === idPonto);
    if (!ponto) {
      mostrarErro("Ponto não encontrado", "Este ponto não está no inventário. Consulte a lista de locais identificados.");
      const link = document.createElement("a");
      link.href = "pontos.html";
      link.textContent = "Ver todos os pontos";
      erro.append(link);
      return;
    }
    mostrarDetalhe(ponto);
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
    const areas = [...new Set(pontosDescarte.map((p) => p.area))]
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
        ? pontosDescarte.filter((ponto) => pontoRecebeMaterial(ponto, material))
        : pontosDescarte;
      const visiveis = pontosMaterial.filter((ponto) =>
        !filtroArea.value || ponto.area === filtroArea.value);
      const aviso = document.querySelector("#aviso-material");
      aviso.hidden = !material;
      document.title = material
        ? `EcoTour | Pontos para ${material.nome}`
        : "EcoTour | Pontos de descarte";
      if (material) {
        document.querySelector("#titulo-aviso-material").textContent = pontosMaterial.length
          ? `Pontos identificados para ${material.nome}`
          : `Sem ponto confirmado para ${material.nome}`;
        document.querySelector("#texto-aviso-material").textContent = pontosMaterial.length
          ? "Confira localização, restrições e disponibilidade atual antes de levar o material."
          : "Ainda não há um local com recebimento confirmado e disponível para este material no campus. Confirme com o setor responsável antes de levá-lo.";
      }
      const lista = document.querySelector("#lista-pontos");
      lista.replaceChildren(...visiveis.map(criarCartao));
      document.querySelector("#resumo-lista").textContent = `${visiveis.length} ${visiveis.length === 1 ? "ponto encontrado" : "pontos encontrados"}`;
      document.querySelector("#estado-vazio").hidden =
        visiveis.length > 0 || !filtroArea.value || pontosMaterial.length === 0;
      document.querySelector("#texto-estado-vazio").textContent = material
        ? "Não há ponto identificado para este material nesta área. Escolha outra área ou veja todas."
        : "Escolha outra área ou veja todos os locais identificados.";
    }
  }

  function criarCartao(ponto) {
    const item = document.createElement("li");
    const link = document.createElement("a");
    link.className = "cartao-ponto";
    link.href = `pontos.html?ponto=${encodeURIComponent(ponto.id)}`;
    const imagem = document.createElement("img");
    imagem.src = fotoOtimizada(ponto.foto);
    imagem.alt = "";
    imagem.loading = "lazy";
    imagem.width = 1200;
    imagem.height = 1600;
    const conteudo = document.createElement("span");
    conteudo.className = "cartao-conteudo";
    const id = document.createElement("span");
    id.className = "identificador";
    id.textContent = `${ponto.id} · ${ponto.area}`;
    const nome = document.createElement("strong");
    nome.textContent = ponto.nome;
    const local = document.createElement("span");
    local.className = "cartao-localizacao";
    local.textContent = ponto.localizacao;
    const situacao = document.createElement("span");
    situacao.className = "etiqueta-situacao";
    situacao.textContent = rotuloSituacao(ponto);
    const materiaisPonto = document.createElement("span");
    materiaisPonto.className = "materiais-ponto";
    const categorias = typeof materiais !== "undefined" && Array.isArray(materiais)
      ? [...new Set(materiais.filter((material) =>
          Array.isArray(ponto.materiaisConfirmados) &&
          ponto.materiaisConfirmados.includes(material.id)).map((material) => material.categoria))]
      : [];
    materiaisPonto.textContent = categorias.length && ponto.situacao === "confirmado"
      ? `Recebe: ${categorias.join(", ")}`
      : "Materiais em verificação";
    const chamada = document.createElement("span");
    chamada.className = "chamada-ponto";
    chamada.textContent = "Ver detalhes →";
    conteudo.append(id, nome, local, materiaisPonto, situacao, chamada);
    link.append(imagem, conteudo);
    item.append(link);
    return item;
  }

  function mostrarDetalhe(ponto) {
    document.title = `EcoTour | ${ponto.nome}`;
    document.querySelector("#id-ponto").textContent = `${ponto.id} · ${ponto.area}`;
    document.querySelector("#nome-ponto").textContent = ponto.nome;
    document.querySelector("#localizacao-ponto").textContent = ponto.localizacao;
    document.querySelector("#situacao-ponto").textContent = rotuloSituacao(ponto);
    document.querySelector("#coletores-ponto").textContent = ponto.coletores;
    document.querySelector("#identificacao-ponto").textContent = ponto.identificacao;
    document.querySelector("#restricoes-ponto").textContent = ponto.restricoes;
    document.querySelector("#disponibilidade-ponto").textContent =
      ponto.disponibilidade === "disponível"
        ? "Estava acessível na data da observação; a disponibilidade atual não foi verificada."
        : ponto.disponibilidade === "indisponível"
          ? "Ponto registrado como indisponível."
          : "Disponibilidade atual desconhecida.";
    const imagem = document.querySelector("#foto-ponto");
    imagem.src = fotoOtimizada(ponto.foto);
    imagem.alt = `Registro fotográfico de ${ponto.nome}`;
    imagem.classList.toggle("foto-lixeiras", ponto.id === "P-05");
    document.querySelector("#link-foto-original").href = ponto.foto;
    const data = document.querySelector("#data-ponto");
    data.dateTime = ponto.verificadoEm;
    data.textContent = formatarData(ponto.verificadoEm);
    detalhe.hidden = false;
  }
}

function pontoRecebeMaterial(ponto, material) {
  return ponto.situacao === "confirmado" &&
    ponto.disponibilidade === "disponível" &&
    Array.isArray(ponto.materiaisConfirmados) &&
    ponto.materiaisConfirmados.includes(material.id) &&
    Array.isArray(material.pontosConfirmados) &&
    material.pontosConfirmados.includes(ponto.id);
}

function fotoOtimizada(original) {
  return original.replace(/\.jpg$/i, ".webp");
}

function rotuloSituacao(ponto) {
  if (ponto.disponibilidade === "indisponível") return "Indisponível";
  return ponto.situacao === "confirmado" ? "Recebimento identificado" : "Observado · recebimento a confirmar";
}

function formatarData(valor) {
  if (typeof valor !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(valor)) return "data não informada";
  const data = new Date(`${valor}T00:00:00Z`);
  return Number.isNaN(data.getTime()) ? "data não informada" :
    new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(data);
}
