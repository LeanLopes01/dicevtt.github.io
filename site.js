/* =========================================================================
   DICEVTT — SCRIPT COMPARTILHADO
   Monta o header e o footer, resolve os links do config.js, controla as
   páginas em manutenção, a paleta de navegação (Ctrl+K), as animações de
   entrada, o modal de download e o leitor das notas de atualização.
   ========================================================================= */
(function () {
  "use strict";

  var CFG = window.DICEVTT || {};

  /* ---------------------------------------------------------------------
     GOOGLE ANALYTICS (carregado de um lugar só)
     --------------------------------------------------------------------- */
  var GA_ID = "G-ESC6YVRTCP";
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  (function () {
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
    document.head.appendChild(s);
  })();
  gtag("js", new Date());
  gtag("config", GA_ID);

  /* Nunca quebra a página se o gtag estiver bloqueado */
  window.track = function (evento, params) {
    try { if (typeof gtag === "function") gtag("event", evento, params || {}); } catch (e) {}
  };

  /* ---------------------------------------------------------------------
     UTILITÁRIOS
     --------------------------------------------------------------------- */
  function get(caminho) {
    if (!caminho) return undefined;
    return caminho.split(".").reduce(function (obj, chave) {
      return (obj && obj[chave] !== undefined) ? obj[chave] : undefined;
    }, CFG);
  }
  window.dvGet = get;

  function el(tag, attrs, html) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) { n.setAttribute(k, attrs[k]); });
    if (html !== undefined) n.innerHTML = html;
    return n;
  }

  var ICONES = {
    discord: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.317 4.369A19.79 19.79 0 0 0 16.558 3c-.211.375-.444.87-.608 1.262a18.27 18.27 0 0 0-5.902 0A12.64 12.64 0 0 0 9.44 3a19.74 19.74 0 0 0-3.76 1.369C2.633 8.086 1.803 11.69 2.218 15.24a19.9 19.9 0 0 0 5.993 3.03c.483-.657.914-1.354 1.285-2.087a12.9 12.9 0 0 1-2.023-.968c.17-.123.336-.252.497-.384a14.19 14.19 0 0 0 12.06 0c.163.132.33.261.497.384-.641.38-1.317.702-2.023.968.371.733.802 1.43 1.285 2.087a19.83 19.83 0 0 0 6.002-3.03c.487-4.117-.545-7.685-2.474-10.871ZM9.677 13.021c-.85 0-1.542-.79-1.542-1.762 0-.973.678-1.763 1.542-1.763.87 0 1.556.797 1.542 1.763 0 .973-.678 1.762-1.542 1.762Zm5.335 0c-.85 0-1.542-.79-1.542-1.762 0-.973.678-1.763 1.542-1.763.87 0 1.557.797 1.542 1.763 0 .973-.671 1.762-1.542 1.762Z"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>',
    github: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.167 6.839 9.49.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.34-3.369-1.34-.454-1.154-1.11-1.462-1.11-1.462-.907-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.088 2.91.832.091-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.03-2.682-.103-.253-.446-1.27.098-2.647 0 0 .84-.268 2.75 1.026A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.026 2.747-1.026.546 1.377.202 2.394.1 2.647.641.698 1.028 1.591 1.028 2.682 0 3.841-2.337 4.687-4.565 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>',
    download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="square" aria-hidden="true"><path d="M12 3v12m0 0l-5-5m5 5l5-5M5 21h14"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="square" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    seta: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="square" aria-hidden="true"><path d="M5 12h14m-6-6l6 6-6 6"/></svg>',
    topo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="square" aria-hidden="true"><path d="M12 20V6m0 0l-6 6m6-6l6 6"/></svg>'
  };
  window.dvIcones = ICONES;

  /* =====================================================================
     1. RESOLUÇÃO DE LINKS, IMAGENS, TEXTOS E VÍDEOS VINDOS DO CONFIG
     ===================================================================== */
  function aplicarConfigNoDom(raiz) {
    raiz = raiz || document;

    raiz.querySelectorAll("[data-href]").forEach(function (n) {
      var url = get(n.dataset.href);
      if (url) {
        n.setAttribute("href", url);
        if (/^https?:/.test(url) && !n.hasAttribute("target")) {
          n.setAttribute("target", "_blank");
          n.setAttribute("rel", "noopener");
        }
      } else {
        n.removeAttribute("href");
        n.classList.add("is-disabled");
        n.setAttribute("role", "button");
        n.setAttribute("aria-disabled", "true");
        if (n.dataset.vazioTexto) n.textContent = n.dataset.vazioTexto;
        n.addEventListener("click", function (e) {
          e.preventDefault();
          abrirAviso("Link ainda não publicado",
            "Esse endereço ainda não foi configurado. Assim que estiver no ar, o botão passa a funcionar sozinho.");
        });
      }
    });

    raiz.querySelectorAll("[data-src]").forEach(function (n) {
      var src = get(n.dataset.src);
      if (src) n.setAttribute("src", src);
    });

    raiz.querySelectorAll("[data-texto]").forEach(function (n) {
      var txt = get(n.dataset.texto);
      if (txt) n.textContent = txt;
    });

    raiz.querySelectorAll("[data-video]").forEach(function (n) {
      var id = get(n.dataset.video);
      n.innerHTML = montarVideo(id, n.dataset.videoTitulo || "Vídeo do DiceVTT");
    });
  }
  window.dvAplicarConfig = aplicarConfigNoDom;

  function montarVideo(id, titulo) {
    if (!id) {
      return '<div class="video-embed"><div class="video-soon"><strong>Gravação em produção</strong>' +
             '<span>Esse vídeo entra aqui assim que for publicado.</span></div></div>';
    }
    return '<div class="video-embed"><iframe loading="lazy" src="https://www.youtube-nocookie.com/embed/' + id +
           '?rel=0" title="' + titulo + '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>';
  }
  window.dvVideo = montarVideo;

  /* =====================================================================
     2. HEADER + FOOTER
     ===================================================================== */
  function paginaAtual() {
    var arq = window.location.pathname.split("/").pop();
    return arq === "" ? "index.html" : arq;
  }

  function linkPagina(chave, classes) {
    var p = (CFG.paginas || {})[chave];
    if (!p) return "";
    var atual = paginaAtual() === p.url ? " is-current" : "";
    if (p.ativo === false) {
      return '<button type="button" class="nav-link is-offline' + (classes || "") + '" data-pagina="' + chave + '">' + p.nome + '</button>';
    }
    return '<a href="' + p.url + '" class="' + (classes || "") + atual + '" data-pagina="' + chave + '">' + p.nome + '</a>';
  }

  function montarHeader() {
    var alvo = document.getElementById("site-header");
    if (!alvo) return;

    var itens = Object.keys(CFG.paginas || {})
      .filter(function (k) { return CFG.paginas[k].menu !== false; })
      .map(function (k) { return linkPagina(k); })
      .join("");

    alvo.outerHTML =
      '<header class="site-header">' +
        '<div class="container nav-container">' +
          '<a href="index.html" class="brand" aria-label="DiceVTT — página inicial">' +
            '<svg class="brand-icon" viewBox="0 0 64 64" aria-hidden="true">' +
              '<polygon points="32,4 58,20 58,46 32,62 6,46 6,20" fill="none" stroke="currentColor" stroke-width="3"/>' +
              '<polygon points="32,16 48,25 48,42 32,52 16,42 16,25" fill="none" stroke="currentColor" stroke-width="2"/>' +
              '<text x="32" y="38" text-anchor="middle" font-family="Cinzel,serif" font-weight="900" font-size="14" fill="currentColor">20</text>' +
            '</svg>' +
            '<span class="brand-text">Dice<span class="brand-accent">VTT</span></span>' +
          '</a>' +
          '<nav class="site-nav" aria-label="Navegação principal">' + itens + '</nav>' +
          '<div class="nav-side">' +
            '<a class="icon-link" data-href="links.discord" aria-label="Discord do DiceVTT" data-cta="discord" data-cta-label="header">' + ICONES.discord + '</a>' +
            '<a class="icon-link" data-href="links.instagram" aria-label="Instagram do DiceVTT" data-cta="instagram" data-cta-label="header">' + ICONES.instagram + '</a>' +
            '<a href="index.html#download" class="nav-cta">Baixar</a>' +
            '<button type="button" class="nav-toggle" aria-label="Abrir menu" aria-expanded="false">' + ICONES.menu + '</button>' +
          '</div>' +
        '</div>' +
      '</header>';

    var toggle = document.querySelector(".nav-toggle");
    var nav = document.querySelector(".site-nav");
    if (toggle && nav) {
      toggle.addEventListener("click", function () {
        var aberto = nav.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", String(aberto));
      });
    }
  }

  function montarFooter() {
    var alvo = document.getElementById("site-footer");
    if (!alvo) return;
    var ano = new Date().getFullYear();

    alvo.outerHTML =
      '<footer class="site-footer">' +
        '<div class="container">' +
          '<div class="footer-inner">' +
            '<div class="footer-brand">' +
              '<span class="brand-text">Dice<span class="brand-accent">VTT</span></span>' +
              '<p class="footer-tag">Virtual Tabletop sem barreiras.<span class="cursor"></span></p>' +
              '<div class="footer-social">' +
                '<a class="icon-link" data-href="links.discord" aria-label="Discord">' + ICONES.discord + '</a>' +
                '<a class="icon-link" data-href="links.instagram" aria-label="Instagram">' + ICONES.instagram + '</a>' +
                '<a class="icon-link" data-href="links.github" aria-label="GitHub">' + ICONES.github + '</a>' +
              '</div>' +
            '</div>' +
            '<nav class="footer-links" aria-label="Links do rodapé">' +
              '<div class="footer-col"><h4>Projeto</h4>' +
                linkPagina("inicio") + linkPagina("futuro") + linkPagina("notas") + linkPagina("srds") +
              '</div>' +
              '<div class="footer-col"><h4>Aprender</h4>' +
                linkPagina("tutoriais") + linkPagina("tutorial") +
                '<a data-href="links.github">Código no GitHub</a>' +
              '</div>' +
              '<div class="footer-col"><h4>Comunidade</h4>' +
                linkPagina("apoie") + linkPagina("parceiros") +
                '<a data-href="links.formPesquisa" data-vazio-texto="Pesquisa (em breve)">Pesquisa</a>' +
                '<a href="mailto:' + (get("links.emailContato") || "") + '" data-texto="links.emailContato"></a>' +
              '</div>' +
            '</nav>' +
          '</div>' +
          '<div class="footer-bottom">' +
            '<p>© ' + ano + ' DiceVTT — Todos os direitos reservados.</p>' +
            '<p class="footer-usp">Desenvolvido na <strong>USP</strong> 🎲</p>' +
          '</div>' +
        '</div>' +
      '</footer>';
  }

  /* =====================================================================
     3. AVISO DE MANUTENÇÃO / PÁGINAS DESATIVADAS
     ===================================================================== */
  function abrirAviso(titulo, texto) {
    var overlay = document.getElementById("aviso-overlay");
    if (!overlay) return;
    overlay.querySelector("#aviso-titulo").textContent = titulo;
    overlay.querySelector("#aviso-texto").textContent = texto;
    overlay.hidden = false;
    var btn = overlay.querySelector(".js-fechar-aviso");
    if (btn) btn.focus();
  }
  window.dvAviso = abrirAviso;

  function criarModalAviso() {
    if (document.getElementById("aviso-overlay")) return;
    var overlay = el("div", { id: "aviso-overlay", class: "modal-overlay", hidden: "" });
    overlay.innerHTML =
      '<div class="modal-box" role="dialog" aria-modal="true" aria-labelledby="aviso-titulo">' +
        '<div class="titlebar">' +
          '<span class="tb-btn"></span><span class="tb-btn"></span><span class="tb-btn"></span>' +
          '<span class="tb-title">AVISO_DO_SISTEMA</span>' +
          '<button type="button" class="modal-close js-fechar-aviso" aria-label="Fechar">✕</button>' +
        '</div>' +
        '<div class="modal-content">' +
          '<h3 id="aviso-titulo" class="modal-title"></h3>' +
          '<p id="aviso-texto" class="modal-text"></p>' +
          '<div class="modal-actions">' +
            '<button type="button" class="btn btn-ghost btn-small js-fechar-aviso">Entendi</button>' +
            '<a class="btn btn-discord btn-small" data-href="links.discord">Avisar no Discord</a>' +
          '</div>' +
        '</div>' +
      '</div>';
    document.body.appendChild(overlay);

    overlay.addEventListener("click", function (e) {
      if (e.target === overlay || e.target.closest(".js-fechar-aviso")) overlay.hidden = true;
    });
    aplicarConfigNoDom(overlay);
  }

  function ligarBotoesDePagina() {
    document.querySelectorAll("[data-pagina]").forEach(function (n) {
      var chave = n.dataset.pagina;
      var p = (CFG.paginas || {})[chave];
      if (!p) return;

      if (p.ativo === false) {
        if (n.tagName === "A") { n.removeAttribute("href"); n.setAttribute("role", "button"); }
        n.classList.add("is-offline");
        n.addEventListener("click", function (e) {
          e.preventDefault();
          track("pagina_em_manutencao", { pagina: chave });
          abrirAviso(p.nome + " está em manutenção",
            p.aviso || "Essa parte do site está sendo ajustada e volta em breve. Enquanto isso, o Discord tem as novidades em primeira mão.");
        });
      } else if (n.tagName === "A" && !n.getAttribute("href")) {
        n.setAttribute("href", p.url);
      }
    });
  }

  /* =====================================================================
     4. PALETA DE NAVEGAÇÃO RÁPIDA (Ctrl+K ou "/")
     ===================================================================== */
  function criarPaleta() {
    var destinos = [];
    Object.keys(CFG.paginas || {}).forEach(function (k) {
      var p = CFG.paginas[k];
      destinos.push({ nome: p.nome, tipo: p.ativo === false ? "manutenção" : "página", url: p.url, chave: k, ativo: p.ativo !== false });
    });
    destinos.push({ nome: "Baixar o DiceVTT", tipo: "ação", url: "index.html#download", ativo: true });
    destinos.push({ nome: "Discord", tipo: "externo", url: get("links.discord"), ativo: !!get("links.discord") });
    destinos.push({ nome: "Instagram", tipo: "externo", url: get("links.instagram"), ativo: !!get("links.instagram") });
    destinos.push({ nome: "SRDs no GitHub", tipo: "externo", url: get("links.githubSrds"), ativo: !!get("links.githubSrds") });

    var overlay = el("div", { id: "palette-overlay", class: "palette-overlay", hidden: "" });
    overlay.innerHTML =
      '<div class="palette" role="dialog" aria-modal="true" aria-label="Ir para">' +
        '<input type="text" id="palette-input" placeholder="Ir para…" autocomplete="off" spellcheck="false">' +
        '<div class="palette-list" id="palette-list" role="listbox"></div>' +
        '<div class="palette-foot"><span><kbd>↑</kbd><kbd>↓</kbd> navegar</span><span><kbd>Enter</kbd> abrir</span><span><kbd>Esc</kbd> fechar</span></div>' +
      '</div>';
    document.body.appendChild(overlay);

    var input = overlay.querySelector("#palette-input");
    var lista = overlay.querySelector("#palette-list");
    var filtrados = destinos.slice();
    var indice = 0;

    function desenhar() {
      lista.innerHTML = filtrados.map(function (d, i) {
        return '<button type="button" class="palette-item' + (i === indice ? " is-active" : "") + '" data-i="' + i + '">' +
               '<span class="p-nome">' + d.nome + '</span><span class="p-tipo">' + d.tipo + '</span></button>';
      }).join("") || '<div class="status-msg">Nada encontrado.</div>';
    }

    function abrir() {
      overlay.hidden = false;
      input.value = ""; filtrados = destinos.slice(); indice = 0; desenhar();
      input.focus();
      track("palette_open", {});
    }
    function fechar() { overlay.hidden = true; }
    window.dvPaleta = abrir;

    function escolher(d) {
      if (!d) return;
      if (!d.ativo) {
        fechar();
        abrirAviso(d.nome + " está indisponível",
          "Essa seção está em manutenção ou ainda não foi publicada. Volta em breve.");
        return;
      }
      fechar();
      if (/^https?:/.test(d.url)) window.open(d.url, "_blank", "noopener");
      else window.location.href = d.url;
    }

    input.addEventListener("input", function () {
      var q = input.value.toLowerCase().trim();
      filtrados = destinos.filter(function (d) { return d.nome.toLowerCase().indexOf(q) !== -1; });
      indice = 0; desenhar();
    });
    lista.addEventListener("click", function (e) {
      var item = e.target.closest(".palette-item");
      if (item) escolher(filtrados[Number(item.dataset.i)]);
    });
    overlay.addEventListener("click", function (e) { if (e.target === overlay) fechar(); });

    document.addEventListener("keydown", function (e) {
      var digitando = /^(INPUT|TEXTAREA|SELECT)$/.test((e.target.tagName || "")) || e.target.isContentEditable;

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); abrir(); return; }
      if (e.key === "/" && !digitando && overlay.hidden) { e.preventDefault(); abrir(); return; }

      if (overlay.hidden) return;
      if (e.key === "Escape") { fechar(); }
      else if (e.key === "ArrowDown") { e.preventDefault(); indice = Math.min(indice + 1, filtrados.length - 1); desenhar(); }
      else if (e.key === "ArrowUp") { e.preventDefault(); indice = Math.max(indice - 1, 0); desenhar(); }
      else if (e.key === "Enter") { e.preventDefault(); escolher(filtrados[indice]); }
    });
  }

  /* =====================================================================
     5. ANIMAÇÕES DE ENTRADA + BOTÃO VOLTAR AO TOPO
     ===================================================================== */
  function ligarReveal() {
    var alvos = document.querySelectorAll("[data-reveal]");
    if (!alvos.length) return;
    if (!("IntersectionObserver" in window)) {
      alvos.forEach(function (n) { n.classList.add("is-visible"); });
      return;
    }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (!entry.isIntersecting) return;
        var atraso = Number(entry.target.dataset.reveal) || 0;
        setTimeout(function () { entry.target.classList.add("is-visible"); }, atraso);
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    alvos.forEach(function (n) { obs.observe(n); });
  }

  function criarVoltarAoTopo() {
    var btn = el("button", { type: "button", class: "to-top", "aria-label": "Voltar ao topo" }, ICONES.topo);
    document.body.appendChild(btn);
    btn.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
    var esperando = false;
    window.addEventListener("scroll", function () {
      if (esperando) return;
      esperando = true;
      requestAnimationFrame(function () {
        btn.classList.toggle("is-visible", window.scrollY > 700);
        esperando = false;
      });
    }, { passive: true });
  }

  /* =====================================================================
     6. VERSÃO DO APP (version.json)
     ===================================================================== */
  function atualizarVersao() {
    var conf = CFG.versao || {};
    if (!document.querySelector(".app-version") && !document.querySelector('[data-download-platform="windows"]')) return;

    fetch(conf.json || "version.json", { cache: "no-store" })
      .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
      .then(function (data) {
        setVersaoTexto(data.version);
        if (data.versionSetup) {
          document.querySelectorAll('[data-download-platform="windows"]').forEach(function (el2) {
            var url = (conf.padraoInstalador || "").replace(/\{v\}/g, data.versionSetup);
            el2.dataset.downloadUrl = url;
            el2.dataset.downloadName = "dicevtt-" + data.versionSetup + ".exe";
          });
        }
        if (typeof gtag === "function") gtag("set", "user_properties", { app_version: data.version });
      })
      .catch(function (erro) {
        setVersaoTexto(conf.fallback || "1.0.0");
        track("version_load_error", { error_message: String(erro && erro.message || erro) });
      });
  }
  function setVersaoTexto(txt) {
    document.querySelectorAll(".app-version").forEach(function (n) { n.textContent = txt; });
  }

  /* =====================================================================
     7. MODAL DE DOWNLOAD (aviso de privacidade)
     ===================================================================== */
  var pendente = null;

  function criarModalDownload() {
    if (document.getElementById("download-modal-overlay")) return;
    var overlay = el("div", { id: "download-modal-overlay", class: "modal-overlay", hidden: "" });
    overlay.innerHTML =
      '<div class="modal-box" role="dialog" aria-modal="true" aria-labelledby="download-modal-title">' +
        '<div class="titlebar">' +
          '<span class="tb-btn"></span><span class="tb-btn"></span><span class="tb-btn"></span>' +
          '<span class="tb-title">AVISO_DE_PRIVACIDADE.TXT</span>' +
          '<button type="button" class="modal-close js-dl-cancelar" aria-label="Fechar">✕</button>' +
        '</div>' +
        '<div class="modal-content">' +
          '<h3 id="download-modal-title" class="modal-title">Antes de baixar</h3>' +
          '<p class="modal-text">Para melhorar a experiência de uso e corrigir problemas mais rápido, o DiceVTT coleta <em>de forma anônima</em> dados de log, erros e uso através do <strong>Sentry</strong> (rastreamento de erros) e do <strong>PostHog</strong> (análise de uso).</p>' +
          '<ul class="modal-list">' +
            '<li>Nenhum dado pessoal identificável é coletado ou vendido</li>' +
            '<li>As informações servem só para encontrar bugs e melhorar o produto</li>' +
            '<li>O programa funciona normalmente com a coleta ativa</li>' +
          '</ul>' +
          '<p class="aviso-box"><strong>⚠ Atenção:</strong> é necessário estar com a <strong>Steam aberta</strong> para que o DiceVTT funcione.</p>' +
          '<label class="modal-checkbox" style="margin-top:18px">' +
            '<input type="checkbox" id="download-terms-checkbox">' +
            '<span>Li e concordo com a coleta anônima de dados descrita acima</span>' +
          '</label>' +
          '<div class="modal-actions">' +
            '<button type="button" class="btn btn-ghost btn-small js-dl-cancelar">Cancelar</button>' +
            '<button type="button" id="download-confirm-btn" class="btn btn-primary btn-small" disabled>' + ICONES.download + ' Baixar agora</button>' +
          '</div>' +
        '</div>' +
      '</div>';
    document.body.appendChild(overlay);

    var check = overlay.querySelector("#download-terms-checkbox");
    var confirmar = overlay.querySelector("#download-confirm-btn");

    check.addEventListener("change", function () {
      confirmar.disabled = !check.checked;
      if (check.checked && pendente) {
        track("privacy_terms_accept", { file_name: pendente.name, platform: pendente.platform });
      }
    });
    confirmar.addEventListener("click", confirmarDownload);
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay || e.target.closest(".js-dl-cancelar")) fecharDownload();
    });
  }

  function abrirDownload(btn) {
    pendente = {
      url: btn.dataset.downloadUrl || get("links.downloadWindows"),
      name: btn.dataset.downloadName || "dicevtt.exe",
      platform: btn.dataset.downloadPlatform || "desconhecido",
      source: btn.dataset.downloadSource || "desconhecido"
    };
    track("download_intent", { file_name: pendente.name, platform: pendente.platform, download_source: pendente.source });
    var overlay = document.getElementById("download-modal-overlay");
    var check = overlay.querySelector("#download-terms-checkbox");
    check.checked = false;
    overlay.querySelector("#download-confirm-btn").disabled = true;
    overlay.hidden = false;
    check.focus();
  }
  window.dvDownload = abrirDownload;

  function fecharDownload() {
    if (pendente) {
      track("download_abandon", { file_name: pendente.name, platform: pendente.platform, download_source: pendente.source });
    }
    pendente = null;
    var o = document.getElementById("download-modal-overlay");
    if (o) o.hidden = true;
  }

  function confirmarDownload() {
    if (!pendente) return;
    var dl = pendente;
    track("file_download", {
      file_name: dl.name, file_extension: dl.name.split(".").pop(),
      platform: dl.platform, download_source: dl.source, link_url: dl.url
    });
    pendente = null;
    var a = el("a"); a.href = dl.url; a.download = dl.name;
    document.body.appendChild(a); a.click(); a.remove();
    document.getElementById("download-modal-overlay").hidden = true;
  }

  function ligarBotoesDownload() {
    document.querySelectorAll("[data-download-platform]").forEach(function (btn) {
      if (!btn.dataset.downloadUrl) {
        btn.dataset.downloadUrl = btn.dataset.downloadPlatform === "linux"
          ? (get("links.downloadLinux") || "")
          : (get("links.downloadWindows") || "");
      }
      btn.addEventListener("click", function () { abrirDownload(btn); });
    });
  }

  /* =====================================================================
     8. MARKDOWN MINIMALISTA (notas de atualização)
     ===================================================================== */
  var COMENTARIO_RE = new RegExp("<" + "!--[\\s\\S]*?--" + ">", "g");

  function escapeHtml(t) {
    return t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function inlineMd(t) {
    return escapeHtml(t)
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/`([^`]+?)`/g, "<code>$1</code>");
  }

  window.dvMarkdown = function (md) {
    var linhas = md.replace(COMENTARIO_RE, "").split("\n");
    var html = "", dentroLista = false, bloco = null;

    function fecharBloco() {
      if (!bloco) return;
      var texto = inlineMd(bloco.partes.join(" ").trim());
      if (texto) {
        html += bloco.tag === "li" ? "<li>" + texto + "</li>"
                                   : "<" + bloco.tag + ">" + texto + "</" + bloco.tag + ">";
      }
      bloco = null;
    }
    function fecharLista() { if (dentroLista) { html += "</ul>"; dentroLista = false; } }

    for (var i = 0; i < linhas.length; i++) {
      var l = linhas[i].trim();
      if (l === "") { fecharBloco(); continue; }
      if (l === "---" || l === "***") { fecharBloco(); fecharLista(); html += "<hr>"; continue; }
      if (/^#{1,2}\s+/.test(l)) {
        fecharBloco(); fecharLista();
        html += "<h3>" + inlineMd(l.replace(/^#{1,2}\s+/, "")) + "</h3>";
        continue;
      }
      if (/^#{3,}\s+/.test(l)) {
        fecharBloco(); fecharLista();
        html += "<h3>" + inlineMd(l.replace(/^#+\s+/, "")) + "</h3>";
        continue;
      }
      if (/^>\s?/.test(l)) {
        if (!bloco || bloco.tag !== "blockquote") { fecharBloco(); fecharLista(); bloco = { tag: "blockquote", partes: [] }; }
        bloco.partes.push(l.replace(/^>\s?/, ""));
        continue;
      }
      if (/^[-*]\s+/.test(l)) {
        fecharBloco();
        if (!dentroLista) { html += "<ul>"; dentroLista = true; }
        bloco = { tag: "li", partes: [l.replace(/^[-*]\s+/, "")] };
        continue;
      }
      if (bloco) bloco.partes.push(l);
      else { fecharLista(); bloco = { tag: "p", partes: [l] }; }
    }
    fecharBloco(); fecharLista();
    return html;
  };

  /* Lista de versões: tenta o manifesto, cai para a lista do config */
  window.dvListarNotas = function () {
    var conf = CFG.notas || {};
    return fetch(conf.manifesto || "notas/index.json", { cache: "no-store" })
      .then(function (r) { if (!r.ok) throw new Error("sem manifesto"); return r.json(); })
      .then(function (dados) {
        var lista = Array.isArray(dados) ? dados : (dados.versoes || []);
        return lista.map(function (item) {
          return typeof item === "string" ? { versao: item } : item;
        });
      })
      .catch(function () {
        return (conf.versoes || []).map(function (v) { return { versao: v }; });
      });
  };

  window.dvCarregarNota = function (item) {
    var conf = CFG.notas || {};
    var arquivo = item.arquivo || (conf.pasta + item.versao + (conf.extensao || ".md"));
    return fetch(arquivo, { cache: "no-store" }).then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.text();
    });
  };

  /* =====================================================================
     9. EVENTOS DE ANALYTICS PADRÃO
     ===================================================================== */
  function ligarAnalytics() {
    document.querySelectorAll('a[href^="http"]').forEach(function (link) {
      if (link.hostname === window.location.hostname) return;
      link.addEventListener("click", function () {
        track("click_outbound", {
          link_url: link.href, link_domain: link.hostname,
          link_text: (link.textContent || "").trim().slice(0, 100),
          cta_name: link.dataset.cta || "sem-rotulo",
          cta_location: link.dataset.ctaLabel || "sem-rotulo"
        });
      });
    });

    if ("IntersectionObserver" in window) {
      var vistas = {};
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          var id = e.target.id;
          if (!id || vistas[id]) return;
          vistas[id] = true;
          track("section_view", { section_id: id });
        });
      }, { threshold: 0.25 });
      document.querySelectorAll("section[id]").forEach(function (s) { obs.observe(s); });
    }

    var marcos = [25, 50, 75, 90], disparados = {}, esperando = false;
    window.addEventListener("scroll", function () {
      if (esperando) return;
      esperando = true;
      requestAnimationFrame(function () {
        var altura = document.documentElement.scrollHeight - window.innerHeight;
        if (altura > 0) {
          var pct = Math.round((window.scrollY / altura) * 100);
          marcos.forEach(function (m) {
            if (pct >= m && !disparados[m]) { disparados[m] = true; track("scroll_depth", { percent_scrolled: m }); }
          });
        }
        esperando = false;
      });
    }, { passive: true });
  }

  /* =====================================================================
     INICIALIZAÇÃO
     ===================================================================== */
  function iniciar() {
    montarHeader();
    montarFooter();
    criarModalAviso();
    criarModalDownload();
    aplicarConfigNoDom(document);
    ligarBotoesDePagina();
    ligarBotoesDownload();
    criarPaleta();
    criarVoltarAoTopo();
    ligarReveal();
    atualizarVersao();
    ligarAnalytics();

    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      document.querySelectorAll(".modal-overlay:not([hidden])").forEach(function (o) { o.hidden = true; });
    });

    document.dispatchEvent(new CustomEvent("dicevtt:pronto"));
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar);
  else iniciar();
})();
