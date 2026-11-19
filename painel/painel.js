// O painel consulta o servidor local e mantém a versão aberta de cada registro.
const formulario = document.querySelector('#form');
const listaMateriais = document.querySelector('#lista');
const aviso = document.querySelector('#status');

let materiais = [];
let pontos = [];
let versoes = {};
let versaoPontos;
// Código gerado pelo servidor para identificar os pedidos do painel local.
let codigoDeAcesso;
let materialAberto;
let versaoAberta;
let versaoPontosAberta;
let novoMaterial = false;

function mostrarMensagem(texto, erro = false) {
  aviso.textContent = texto;
  aviso.classList.toggle('erro', erro);
}

async function carregarCatalogo() {
  const resposta = await fetch('/api/materiais');
  if (!resposta.ok) throw Error('Não foi possível carregar o catálogo.');

  const resultado = await resposta.json();
  materiais = resultado.materiais;
  pontos = resultado.pontos;
  versoes = resultado.versoes;
  versaoPontos = resultado.versaoPontos;
  codigoDeAcesso = resultado.token;

  const itens = materiais.map((material) => {
    const item = document.createElement('li');
    const botao = document.createElement('button');
    botao.type = 'button';
    botao.textContent = material.nome;
    botao.addEventListener('click', () => abrirFormulario(material));
    item.append(botao);
    return item;
  });
  listaMateriais.replaceChildren(...itens);
}

function mostrarPontos(material) {
  const lista = document.querySelector('#lista-vinculos');
  const opcoes = pontos.map((ponto) => {
    const rotulo = document.createElement('label');
    const caixaSelecao = document.createElement('input');
    caixaSelecao.type = 'checkbox';
    caixaSelecao.name = 'pontosConfirmados';
    caixaSelecao.value = ponto.id;
    caixaSelecao.checked = material?.pontosConfirmados?.includes(ponto.id) || false;

    const disponivel = ponto.situacao === 'confirmado' && ponto.disponibilidade === 'disponível';
    caixaSelecao.disabled = !caixaSelecao.checked && !disponivel;
    caixaSelecao.style.cssText = 'display:inline;width:auto;margin-right:8px';
    rotulo.style.fontWeight = '400';

    const situacao = caixaSelecao.disabled ? ' — indisponível ou não confirmado' : '';
    rotulo.append(caixaSelecao, `${ponto.id} — ${ponto.nome} (${ponto.localizacao})${situacao}`);
    return rotulo;
  });
  lista.replaceChildren(...opcoes);
}

function abrirFormulario(material) {
  novoMaterial = !material;
  materialAberto = material ? structuredClone(material) : null;
  versaoAberta = material ? versoes[material.id] : null;
  versaoPontosAberta = versaoPontos;

  formulario.reset();
  formulario.hidden = false;
  document.querySelector('#vazio').hidden = true;
  document.querySelector('#titulo').textContent = novoMaterial ? 'Novo material' : 'Editar material';
  document.querySelector('#excluir').hidden = novoMaterial;
  formulario.elements.id.readOnly = !novoMaterial;

  const campos = ['id', 'nome', 'categoria', 'orientacao', 'coletor', 'cuidados', 'fonte', 'revisadoEm'];
  for (const campo of campos) {
    formulario.elements[campo].value = material?.[campo] || '';
  }
  formulario.elements.termosBusca.value = material?.termosBusca?.join(', ') || '';
  formulario.elements.corColetor.value = material?.corColetor || '';
  mostrarPontos(material);
  mostrarMensagem('');
  formulario.elements.nome.focus();
}

async function enviarPedido(pedido) {
  const resposta = await fetch('/api/materiais', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Painel-Token': codigoDeAcesso },
    body: JSON.stringify(pedido)
  });
  const resultado = await resposta.json();
  if (!resposta.ok) throw Error(resultado.erro || 'Não foi possível salvar.');
}

function lerFormulario() {
  const dados = new FormData(formulario);
  const pontosConfirmados = dados.getAll('pontosConfirmados');
  const material = Object.fromEntries(dados);
  delete material.pontosConfirmados;
  material.termosBusca = material.termosBusca.split(',').map((termo) => termo.trim()).filter(Boolean);
  material.corColetor ||= null;
  return { material, pontosConfirmados };
}

function confirmarAlteracoes(material, pontosConfirmados) {
  const campos = ['nome', 'categoria', 'termosBusca', 'corColetor', 'orientacao', 'coletor', 'cuidados', 'fonte'];
  const mudouConteudo = materialAberto && campos.some((campo) => {
    const anterior = materialAberto[campo] ?? (campo === 'fonte' ? '' : null);
    return JSON.stringify(material[campo]) !== JSON.stringify(anterior);
  });
  const mesmaData = material.revisadoEm === (materialAberto?.revisadoEm || '');
  if (mudouConteudo && mesmaData) {
    const mensagem = 'O conteúdo mudou, mas a data de revisão continua igual. Confirme a data antes de salvar. Deseja salvar mesmo assim?';
    if (!confirm(mensagem)) return false;
  }

  const novoVinculo = pontosConfirmados.some((id) => !materialAberto?.pontosConfirmados?.includes(id));
  if (novoVinculo) {
    const mensagem = 'Você confirmou que os pontos selecionados recebem este material? Essa informação aparecerá no site após a publicação.';
    if (!confirm(mensagem)) return false;
  }
  return true;
}

async function salvarMaterial(evento) {
  evento.preventDefault();
  const { material, pontosConfirmados } = lerFormulario();
  if (!confirmarAlteracoes(material, pontosConfirmados)) return;

  try {
    await enviarPedido({
      acao: 'salvar',
      novo: novoMaterial,
      material,
      versao: versaoAberta,
      versaoPontos: versaoPontosAberta,
      pontosConfirmados
    });
    await carregarCatalogo();
    abrirFormulario(materiais.find((item) => item.id === material.id));
    mostrarMensagem('Material salvo no projeto.');
  } catch (erro) {
    mostrarMensagem(erro.message, true);
  }
}

async function excluirMaterial() {
  if (!confirm(`Excluir “${formulario.elements.nome.value}” do catálogo?`)) return;
  try {
    await enviarPedido({
      acao: 'excluir',
      id: formulario.elements.id.value,
      versao: versaoAberta
    });
    await carregarCatalogo();
    formulario.hidden = true;
    document.querySelector('#vazio').hidden = false;
    document.querySelector('#titulo').textContent = 'Selecione um material';
    mostrarMensagem('Material excluído do projeto.');
  } catch (erro) {
    mostrarMensagem(erro.message, true);
  }
}

document.querySelector('#novo').addEventListener('click', () => abrirFormulario(null));
document.querySelector('#excluir').addEventListener('click', excluirMaterial);
formulario.addEventListener('submit', salvarMaterial);
carregarCatalogo().catch((erro) => mostrarMensagem(erro.message, true));
