/* =========================================================================
   DICEVTT — CONTA (módulo ES, carregado pelo site.js)
   Login com Google pelo Firebase Authentication, menu do avatar no topo e
   chamadas à API com o ID token. Este arquivo NÃO acessa banco nenhum: tudo
   que envolve permissões, perfil e pagamento passa pela API.

   Páginas usam:
     dvAoMudarConta(function (estado) { ... })   estado = { carregado, disponivel, usuario }
     dvConta.api("/v1/me")                       -> Promise com o JSON ou erro { code, message }
     dvConta.entrar() / dvConta.sair()
   ========================================================================= */
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import {
  getAuth, GoogleAuthProvider, onAuthStateChanged,
  signInWithPopup, reauthenticateWithPopup, signOut
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

const CFG = window.DICEVTT || {};
const CONTA = CFG.conta || {};
const LOCAL = /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
const API = String((LOCAL ? CONTA.api?.local : CONTA.api?.producao) || "").replace(/\/+$/, "");

const app = initializeApp(CONTA.firebase);
const auth = getAuth(app);
auth.languageCode = "pt";

const estado = { carregado: false, disponivel: true, usuario: null };
const ouvintes = [];
let mePromessa = null;

function provedor() {
  const p = new GoogleAuthProvider();
  p.setCustomParameters({ prompt: "select_account" });
  return p;
}

/* ---------------------------------------------------------------------
   API
   --------------------------------------------------------------------- */
function erroApi(code, message, status, extra) {
  return Object.assign(new Error(message), { code, status: status || 0 }, extra || {});
}

async function api(caminho, { metodo = "GET", corpo, auth: modo = "opcional", _repetida = false } = {}) {
  if (!API) throw erroApi("API_OFFLINE", "O servidor do DiceVTT ainda não está disponível.");
  const usuario = auth.currentUser;
  if (modo === true && !usuario) throw erroApi("UNAUTHENTICATED", "Entre com sua conta para continuar.", 401);

  const headers = { Accept: "application/json" };
  if (corpo !== undefined) headers["Content-Type"] = "application/json";
  if (usuario && modo !== false) headers.Authorization = "Bearer " + await usuario.getIdToken(_repetida);

  let r;
  try {
    r = await fetch(API + caminho, {
      method: metodo,
      headers,
      body: corpo !== undefined ? JSON.stringify(corpo) : undefined,
      cache: "no-store"
    });
  } catch {
    throw erroApi("API_OFFLINE", "Não foi possível falar com o servidor do DiceVTT. Tente de novo em instantes.");
  }

  let json = null;
  try { json = await r.json(); } catch { /* sem corpo */ }

  // Token expirado entre o getIdToken e a chamada: renova uma vez
  if (r.status === 401 && json?.error?.code === "INVALID_TOKEN" && usuario && !_repetida) {
    return api(caminho, { metodo, corpo, auth: modo, _repetida: true });
  }
  if (!r.ok) {
    const e = json?.error || {};
    throw erroApi(e.code || "HTTP_" + r.status, e.message || "Erro inesperado (" + r.status + ").", r.status,
      { requestId: json?.requestId, url: e.url, field: e.field, retryable: e.retryable });
  }
  return json;
}

/* Perfil + resumo da conta. Também cria o perfil no primeiro login. */
function me(forcar) {
  if (!auth.currentUser) return Promise.resolve(null);
  if (!mePromessa || forcar) {
    mePromessa = api("/v1/me", { auth: true }).then((dados) => {
      atualizarMenu(dados);
      return dados;
    }).catch((e) => { mePromessa = null; throw e; });
  }
  return mePromessa;
}

/* ---------------------------------------------------------------------
   LOGIN / LOGOUT
   --------------------------------------------------------------------- */
async function entrar() {
  try {
    const r = await signInWithPopup(auth, provedor());
    if (typeof window.track === "function") window.track("login", { method: "google" });
    return r.user;
  } catch (e) {
    if (e.code === "auth/popup-closed-by-user" || e.code === "auth/cancelled-popup-request") return null;
    if (e.code === "auth/popup-blocked") {
      window.dvAviso?.("Pop-up bloqueado", "O navegador bloqueou a janela do Google. Libere pop-ups para este site e tente de novo.");
    } else if (e.code === "auth/unauthorized-domain") {
      window.dvAviso?.("Domínio não autorizado", "Este endereço não está liberado no Firebase Authentication (Configurações → Domínios autorizados).");
    } else if (e.code === "auth/network-request-failed") {
      window.dvAviso?.("Sem conexão", "Não foi possível falar com o Google. Confira sua internet e tente de novo.");
    } else {
      console.error("[conta] login:", e);
      window.dvAviso?.("Não foi possível entrar", "Algo deu errado no login com o Google. Tente de novo em instantes.");
    }
    return null;
  }
}

/* Login recente exigido para ações sensíveis (ex.: excluir conta) */
async function reautenticar() {
  if (!auth.currentUser) return false;
  try {
    await reauthenticateWithPopup(auth.currentUser, provedor());
    await auth.currentUser.getIdToken(true);
    return true;
  } catch (e) {
    if (e.code !== "auth/popup-closed-by-user" && e.code !== "auth/cancelled-popup-request") {
      window.dvAviso?.("Não foi possível confirmar", e.code === "auth/user-mismatch"
        ? "Escolha a mesma conta Google com que você entrou."
        : "A confirmação com o Google falhou. Tente de novo.");
    }
    return false;
  }
}

async function sair() {
  await signOut(auth);
  if (typeof window.track === "function") window.track("logout", {});
}

/* ---------------------------------------------------------------------
   MENU DO AVATAR NO TOPO
   --------------------------------------------------------------------- */
const esc = (t) => window.dvEsc(t);

function iniciais(nome) {
  return String(nome || "?").trim().split(/\s+/).slice(0, 2).map((p) => p[0] || "").join("").toUpperCase() || "?";
}

function avatarHtml(foto, nome) {
  const url = window.dvUrlSegura(foto);
  return url
    ? `<img src="${esc(url)}" alt="" referrerpolicy="no-referrer">`
    : `<span>${esc(iniciais(nome))}</span>`;
}

function linksConta() {
  const paginas = CFG.paginas || {};
  return ['<a role="menuitem" href="index.html#conta">Visão geral</a>']
    .concat(Object.keys(paginas)
      .filter((k) => paginas[k].grupo === "conta" && paginas[k].ativo !== false)
      .map((k) => `<a role="menuitem" href="${esc(paginas[k].url)}">${esc(paginas[k].nome)}</a>`))
    .join("");
}

function desenharMenu() {
  const alvo = document.getElementById("nav-conta");
  if (!alvo) return;
  const u = estado.usuario;

  if (!u) {
    alvo.innerHTML = '<button type="button" class="nav-entrar">Entrar</button>';
    alvo.querySelector("button").addEventListener("click", entrar);
    return;
  }

  alvo.innerHTML =
    '<div class="conta-menu-wrap">' +
      `<button type="button" class="avatar-btn" aria-haspopup="menu" aria-expanded="false" aria-label="Minha conta" title="${esc(u.nome || u.email)}">` +
        avatarHtml(u.foto, u.nome) +
      '</button>' +
      '<div class="conta-menu" role="menu" hidden>' +
        `<div class="conta-menu-head"><strong class="js-menu-nome">${esc(u.nome || "Minha conta")}</strong><span>${esc(u.email)}</span></div>` +
        linksConta() +
        '<button type="button" role="menuitem" class="conta-sair">Sair</button>' +
      '</div>' +
    '</div>';

  const botao = alvo.querySelector(".avatar-btn");
  const menu = alvo.querySelector(".conta-menu");
  const fechar = () => { menu.hidden = true; botao.setAttribute("aria-expanded", "false"); };

  botao.addEventListener("click", (e) => {
    e.stopPropagation();
    const abrir = menu.hidden;
    menu.hidden = !abrir;
    botao.setAttribute("aria-expanded", String(abrir));
    if (abrir) menu.querySelector("a")?.focus();
  });
  menu.querySelector(".conta-sair").addEventListener("click", () => { fechar(); sair(); });
  alvo.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !menu.hidden) { fechar(); botao.focus(); }
  });
}

/* Clique fora fecha o menu (registrado uma vez só) */
document.addEventListener("click", (e) => {
  const alvo = document.getElementById("nav-conta");
  const menu = alvo?.querySelector(".conta-menu");
  if (!menu || menu.hidden || alvo.contains(e.target)) return;
  menu.hidden = true;
  alvo.querySelector(".avatar-btn")?.setAttribute("aria-expanded", "false");
});

/* Quando o perfil chega da API, o nome de exibição escolhido substitui o do Google */
function atualizarMenu(dados) {
  const nome = dados?.perfil?.display_name;
  const alvo = document.querySelector("#nav-conta .js-menu-nome");
  if (nome && alvo) alvo.textContent = nome;
  if (nome && estado.usuario) estado.usuario.nome = nome;
}

/* ---------------------------------------------------------------------
   ESTADO + OUVINTES
   --------------------------------------------------------------------- */
function avisar() {
  ouvintes.slice().forEach((cb) => {
    try { cb(estado); } catch (e) { console.error("[conta] ouvinte:", e); }
  });
}

function aoMudar(cb) {
  ouvintes.push(cb);
  if (estado.carregado) queueMicrotask(() => cb(estado));
}

onAuthStateChanged(auth, (user) => {
  const anterior = estado.usuario?.uid;
  estado.carregado = true;
  estado.usuario = user
    ? { uid: user.uid, nome: user.displayName || "", email: user.email || "", foto: user.photoURL || "" }
    : null;
  if (anterior !== estado.usuario?.uid) mePromessa = null;

  desenharMenu();
  if (user) me().catch((e) => console.warn("[conta] /v1/me:", e.code, e.message));
  avisar();
});

window.dvConta = { disponivel: true, api, me, entrar, sair, reautenticar, aoMudar, estado: () => estado };
window.dvAoMudarConta = aoMudar;
(window.__dvContaFila || []).splice(0).forEach(aoMudar);
