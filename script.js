/* ================================================================
   DiceVTT — Landing Page
   Lógica de troca dinâmica de paleta nos Sistemas Suportados
   ================================================================ */

(function () {
  "use strict";

  /* ---------- 1. Elementos ---------- */
  const systemsSection = document.querySelector(".systems");
  const tabs           = document.querySelectorAll(".tab");
  const panels         = document.querySelectorAll(".tab-panel");

  if (!systemsSection || !tabs.length) return;

  /* ---------- 2. Lógica das abas ---------- */
  function activateTab(targetId) {
    // Atualiza atributo data-system na seção -> aciona troca de paleta via CSS
    systemsSection.setAttribute("data-system", targetId);

    // Marca tab ativa (estado + a11y)
    tabs.forEach((tab) => {
      const isActive = tab.dataset.target === targetId;
      tab.setAttribute("aria-selected", String(isActive));
      tab.tabIndex = isActive ? 0 : -1;
    });

    // Mostra painel correspondente
    panels.forEach((panel) => {
      const isActive = panel.id === `panel-${targetId}`;
      panel.classList.toggle("is-active", isActive);
    });
  }

  /* ---------- 3. Eventos ---------- */
  tabs.forEach((tab) => {
    // Clique
    tab.addEventListener("click", () => {
      activateTab(tab.dataset.target);
    });

    // Navegação por teclado (setas, Home, End)
    tab.addEventListener("keydown", (e) => {
      const tabsArr = Array.from(tabs);
      const currentIndex = tabsArr.indexOf(tab);
      let nextIndex = null;

      switch (e.key) {
        case "ArrowRight":
          nextIndex = (currentIndex + 1) % tabsArr.length;
          break;
        case "ArrowLeft":
          nextIndex = (currentIndex - 1 + tabsArr.length) % tabsArr.length;
          break;
        case "Home":
          nextIndex = 0;
          break;
        case "End":
          nextIndex = tabsArr.length - 1;
          break;
        default:
          return; // outras teclas seguem comportamento normal
      }

      e.preventDefault();
      tabsArr[nextIndex].focus();
      activateTab(tabsArr[nextIndex].dataset.target);
    });
  });

  /* ---------- 4. Ano dinâmico no footer ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- 5. Highlight do link ativo na nav (scroll spy leve) ---------- */
  const navLinks = document.querySelectorAll(".site-nav a[href^='#']");
  const sections = Array.from(navLinks)
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            navLinks.forEach((link) => {
              const isMatch = link.getAttribute("href") === `#${entry.target.id}`;
              link.style.color = isMatch ? "var(--text)" : "";
            });
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach((s) => obs.observe(s));
  }
})();
