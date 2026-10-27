// Executa apenas na página inicial.
if (document.body.classList.contains("pagina-inicial")) {
  const formulario = document.querySelector("#formulario-busca");
  const campoBusca = document.querySelector("#busca-material");
  const lista = document.querySelector("#lista-materiais");
  const mensagem = document.querySelector("#mensagem-busca");
  const estadoVazio = document.querySelector("#estado-vazio");
  const botaoLimpar = document.querySelector("#limpar-busca");
  const secaoMateriais = document.querySelector(".materiais");

  // Leva a pessoa até os resultados e fecha o teclado no celular.
  function irParaResultados() {
    const reduzirMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    campoBusca.blur();
    secaoMateriais.scrollIntoView({
      behavior: reduzirMovimento ? "auto" : "smooth",
      block: "start"
    });
  }

  document.querySelectorAll("[data-busca]").forEach((botao) => {
    botao.addEventListener("click", () => {
      campoBusca.value = botao.dataset.busca;
      atualizarMateriais();
      irParaResultados();
    });
  });

  // Permite encontrar "remédio" mesmo digitando "remedio".
  function normalizar(texto) {
    return texto
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  }

function criarIconeMaterial(id) {
  // Desenhos associados aos identificadores do catálogo.
  const desenhos = {
    "folha-papel": `
      <path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8z"/>
      <path d="M14 3v5h5M8 12h8M8 16h6"/>
    `,

    "garrafa-pet": `
      <path d="M10 3h4v4l2 3v9a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-9l2-3z"/>
      <path d="M10 6h4M8 12h8M8 16h8"/>
    `,

    "lata-aluminio": `
      <ellipse cx="12" cy="4.5" rx="4.5" ry="1.8"/>
      <ellipse cx="12" cy="4.4" rx="1.4" ry=".65" stroke-width="1.1"/>
      <path d="M7.5 4.5v2L6 9v10.5C6 21 8.7 22 12 22s6-1 6-2.5V9l-1.5-2.5v-2"/>
      <path d="M6 18.8c0 1.2 2.7 2.2 6 2.2s6-1 6-2.2"/>
      <path d="M9 15.5c0-3 6-1 6-4"/>
    `,

    "garrafa-vidro": `
      <path d="M10 3h4M10 3v6l-3 4v6a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-6l-3-4V3"/>
      <path d="M10 7h4M7 15h10"/>
    `,

    "medicamento-vencido": `
      <path d="M9.5 4.5a5 5 0 0 1 7.1 7.1l-5 5a5 5 0 0 1-7.1-7.1z"/>
      <path d="m7 7 7 7"/>
    `,

    "eletronicos": `
      <rect x="6" y="2" width="12" height="20" rx="2"/>
      <path d="M10 5h4M10 18h4"/>
    `,

    "restos-comida": `
      <path d="M4 13h16a8 8 0 0 1-16 0Z"/>
      <path d="M12 13V9"/>
      <path d="M12 9C8 9 6 7 6 4c4 0 6 2 6 5Z"/>
      <path d="M12 10c0-4 2-6 6-6 0 4-2 6-6 6Z"/>
    `
  };

  const iconePadrao = `
    <rect x="4" y="4" width="16" height="16" rx="4"/>
    <path d="M8 12h8M12 8v8"/>
  `;

  const icone = document.createElement("span");
  icone.className = "icone-material";
  icone.setAttribute("aria-hidden", "true");

  // Apenas desenhos definidos aqui entram no SVG.
  icone.innerHTML = `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="38"
      height="38"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.6"
      stroke-linecap="round"
      stroke-linejoin="round"
      focusable="false"
    >
      ${desenhos[id] ?? iconePadrao}
    </svg>
  `;

  return icone;
}

function criarCartao(material) {
  const item = document.createElement("li");
  const link = document.createElement("a");
  const conteudo = document.createElement("div");
  const categoria = document.createElement("span");
  const nome = document.createElement("strong");
  const chamada = document.createElement("span");

  link.className = `cartao-material cartao-${material.id}`;
  link.href = `guia.html?material=${encodeURIComponent(material.id)}`;

  conteudo.className = "conteudo-material";

  categoria.className = "categoria-material";
  categoria.textContent = material.corColetor
    ? `${material.categoria}, coletor ${material.corColetor}`
    : material.pontosConfirmados.length
      ? "Entrega em ponto específico"
      : "Sem ponto confirmado no campus";

  nome.className = "nome-material";
  nome.textContent = material.nome;


  chamada.className = "chamada-material";
  chamada.textContent = "Ver orientação";

  conteudo.append(nome, categoria, chamada);
  link.append(criarIconeMaterial(material.id), conteudo);
  item.append(link);

  return item;
}

  function atualizarMateriais() {
    const termoDigitado = campoBusca.value.trim();
    const termoNormalizado = normalizar(termoDigitado);

    const resultados = materiais.filter((material) => {
      const textoPesquisavel = [
        material.nome,
        material.categoria,
        ...material.termosBusca
      ].join(" ");

      return normalizar(textoPesquisavel).includes(termoNormalizado);
    });

    lista.replaceChildren(...resultados.map(criarCartao));

    const quantidade = resultados.length;

    estadoVazio.hidden = quantidade > 0;
    botaoLimpar.hidden = termoDigitado.length === 0;

    if (!termoDigitado) {
      mensagem.textContent = "Selecione um material para consultar as orientações.";
    } else if (quantidade === 0) {
      mensagem.textContent = `Não encontramos resultados para “${termoDigitado}”.`;
    } else {
      const descricao = quantidade === 1
        ? "material encontrado"
        : "materiais encontrados";

      mensagem.textContent =
        `${quantidade} ${descricao} para “${termoDigitado}”.`;
    }

    return resultados;
  }

  // A busca é atualizada enquanto a pessoa digita.
  campoBusca.addEventListener("input", atualizarMateriais);

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const resultados = atualizarMateriais();

    // Com um único material encontrado, abre direto a orientação dele.
    if (campoBusca.value.trim() && resultados.length === 1) {
      window.location.href = `guia.html?material=${encodeURIComponent(resultados[0].id)}`;
      return;
    }

    irParaResultados();
  });

  botaoLimpar.addEventListener("click", () => {
    campoBusca.value = "";
    atualizarMateriais();
    campoBusca.focus();
  });

  // Mostra uma mensagem caso o arquivo de dados não carregue.
  if (typeof materiais !== "undefined" && Array.isArray(materiais)) {
    atualizarMateriais();
  } else {
    mensagem.textContent =
      "Não foi possível carregar os materiais. Atualize a página para tentar novamente.";

    campoBusca.disabled = true;
    formulario.querySelector("button").disabled = true;
  }
}
