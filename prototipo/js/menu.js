// Menu lateral (aba deslizante), com link pra Favoritos e informações do
// app (versão). Injetado dentro de ".phone" em toda página que incluir
// este script e tiver um botão com id="btn-menu".
(function () {
  const VERSAO_APP = "1.0.0";

  function montarMenu() {
    if (document.getElementById("menu-lateral")) return;
    const phone = document.querySelector(".phone");
    if (!phone) return;

    const holder = document.createElement("div");
    holder.innerHTML = `
      <div class="menu-backdrop" id="menu-backdrop"></div>
      <div class="menu-lateral" id="menu-lateral">
        <div class="menu-header">
          <div class="menu-logo">🛠️</div>
          <div class="menu-header-texto">
            <strong>Manual do Montador</strong>
            <span>Madeirol</span>
          </div>
        </div>
        <nav class="menu-nav">
          <a href="favoritos.html">⭐ <span>Favoritos</span></a>
        </nav>
        <div class="menu-info">
          <div class="menu-info-versao">Versão ${VERSAO_APP}</div>
          <div class="menu-info-sub">Protótipo — sem backend</div>
        </div>
      </div>
    `;
    while (holder.firstChild) {
      phone.appendChild(holder.firstChild);
    }

    const backdrop = document.getElementById("menu-backdrop");
    const lateral = document.getElementById("menu-lateral");

    function abrir() {
      backdrop.classList.add("aberto");
      lateral.classList.add("aberto");
    }
    function fechar() {
      backdrop.classList.remove("aberto");
      lateral.classList.remove("aberto");
    }

    backdrop.addEventListener("click", fechar);
    document.addEventListener("click", (e) => {
      if (e.target.closest("#btn-menu")) abrir();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") fechar();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", montarMenu);
  } else {
    montarMenu();
  }
})();
