// Verifica se há uma versão mais nova publicada no GitHub Releases do
// projeto e mostra um aviso DISPENSÁVEL na tela pra baixar/instalar.
// App continua 100% offline: isso só roda se houver internet no momento
// de abrir o app; se falhar (sem rede, GitHub fora do ar), não mostra
// nada e segue normal. Só verifica na tela Início (abertura do app).
(function () {
  const REPO = "Gabrieldsss/ACESSORIOS_MANUAL_APP";

  function compararVersoes(a, b) {
    const pa = a.replace(/^v/i, "").split(".").map(Number);
    const pb = b.replace(/^v/i, "").split(".").map(Number);
    for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
      const na = pa[i] || 0;
      const nb = pb[i] || 0;
      if (na !== nb) return na - nb;
    }
    return 0;
  }

  function abrirLinkExterno(url) {
    // Dentro do app empacotado (Capacitor), window.open com "_system"
    // abre no navegador do celular, que cuida do download + instalação.
    // Num navegador normal (testando o protótipo), so abre uma aba.
    window.open(url, "_system");
  }

  function mostrarAviso(versaoNova, urlApk) {
    if (document.getElementById("aviso-atualizacao")) return;
    const phone = document.querySelector(".phone");
    if (!phone) return;

    const aviso = document.createElement("div");
    aviso.id = "aviso-atualizacao";
    aviso.className = "update-banner";
    aviso.innerHTML = `
      <div class="update-banner-texto">
        <strong>Nova versão disponível</strong>
        <span>Versão ${versaoNova} (atual: ${VERSAO_APP})</span>
      </div>
      <div class="update-banner-acoes">
        <button type="button" class="update-banner-atualizar">Atualizar</button>
        <button type="button" class="update-banner-fechar" aria-label="Fechar aviso">✕</button>
      </div>
    `;
    phone.insertBefore(aviso, phone.firstChild);

    aviso.querySelector(".update-banner-atualizar").addEventListener("click", () => {
      abrirLinkExterno(urlApk);
    });
    aviso.querySelector(".update-banner-fechar").addEventListener("click", () => {
      localStorage.setItem("atualizacaoDispensada", versaoNova);
      aviso.remove();
    });
  }

  async function verificarAtualizacao() {
    try {
      const resp = await fetch(`https://api.github.com/repos/${REPO}/releases/latest`);
      if (!resp.ok) return;
      const dados = await resp.json();
      const versaoRemota = (dados.tag_name || "").replace(/^v/i, "");
      if (!versaoRemota) return;
      if (compararVersoes(versaoRemota, VERSAO_APP) <= 0) return;

      const dispensada = localStorage.getItem("atualizacaoDispensada");
      if (dispensada === versaoRemota) return;

      const apkAsset = (dados.assets || []).find((a) => a.name.endsWith(".apk"));
      const urlApk = apkAsset ? apkAsset.browser_download_url : dados.html_url;

      mostrarAviso(versaoRemota, urlApk);
    } catch (e) {
      // sem internet ou GitHub fora do ar - o app segue offline normalmente
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", verificarAtualizacao);
  } else {
    verificarAtualizacao();
  }
})();
