function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function assetImg(path, label) {
  const safeLabel = (label || path).replace(/"/g, "&quot;");
  return `<div class="asset-slot">
    <img src="${path}" alt="${safeLabel}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
    <div class="asset-fallback"><span>🖼️</span><small>${path}</small></div>
  </div>`;
}

function logoImg(fabricante) {
  if (fabricante.logoBase64) {
    return `<div class="logo-slot"><img src="${fabricante.logoBase64}" alt="Logo ${fabricante.nome}"></div>`;
  }
  if (!fabricante.logo) {
    return `<div class="logo-slot"><div class="logo-fallback" style="display:flex;color:${fabricante.cor}">${fabricante.nome}</div></div>`;
  }
  return `<div class="logo-slot">
    <img src="${fabricante.logo}" alt="Logo ${fabricante.nome}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
    <div class="logo-fallback" style="color:${fabricante.cor}">${fabricante.nome}</div>
  </div>`;
}

function thumbHtml(acessorio) {
  if (acessorio.imagemBase64) {
    return `<img src="${acessorio.imagemBase64}" alt="${acessorio.nome}">`;
  }
  if (acessorio.imagem) {
    return assetImg(acessorio.imagem, acessorio.nome);
  }
  return `<span>🖼️</span>`;
}

function stepImageHtml(passo) {
  if (passo.imagemBase64) {
    return `<img src="${passo.imagemBase64}" alt="Imagem do passo">`;
  }
  if (passo.imagem) {
    return assetImg(passo.imagem, "Imagem do passo");
  }
  return `<span>🖼️</span>`;
}

function stepVideoHtml(passo) {
  if (!passo.videoBase64) return "";
  return `<video class="step-video" src="${passo.videoBase64}" controls preload="none"></video>`;
}

function categoriaIcone(categoria) {
  const c = (categoria || "").toLowerCase();
  if (c.includes("dobradiç") || c.includes("dobradic")) return "🚪";
  if (c.includes("gaveta")) return "🗄️";
  if (c.includes("corrediç") || c.includes("corredic") || c.includes("trilho")) return "📏";
  if (c.includes("pé") || c.includes("nivelamento")) return "🦶";
  if (c.includes("elevaç") || c.includes("elevac")) return "⬆️";
  return "🔧";
}

// Compartilha um manual como link público (GET /manual/:id no backend,
// funciona pra quem não tem o app instalado). Usa o share nativo do
// aparelho quando disponível; senão abre o WhatsApp com o texto pronto.
function compartilharManual(acessorio) {
  const url = `${API_BASE_URL}/manual/${acessorio.id}`;
  const texto = `Manual: ${acessorio.nome}\n${url}`;
  if (navigator.share) {
    navigator.share({ title: acessorio.nome, text: texto, url }).catch(() => {});
  } else {
    window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, "_blank");
  }
}

// Mostra a imagem inteira, sem corte, numa tela cheia por cima do resto -
// as fotos do manual (capa do acessório, foto do passo) aparecem
// recortadas (object-fit:cover) pra caber num quadrado/retângulo fixo no
// layout; isso deixa ver a foto original completa quando ela não bate
// exatamente com essa proporção. Toque em qualquer lugar pra fechar.
function abrirImagemCheia(src, alt) {
  let overlay = document.getElementById("lightbox-imagem");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "lightbox-imagem";
    overlay.className = "lightbox-imagem";
    overlay.innerHTML = `<img>`;
    overlay.addEventListener("click", () => overlay.classList.remove("aberto"));
    document.body.appendChild(overlay);
  }
  overlay.querySelector("img").src = src;
  overlay.querySelector("img").alt = alt || "";
  overlay.classList.add("aberto");
}

document.addEventListener("click", (e) => {
  const img = e.target.closest(".cover img, .step-image img");
  if (!img) return;
  abrirImagemCheia(img.currentSrc || img.src, img.alt);
});

function emptyState(icone, texto) {
  return `<div class="empty"><div class="empty-icon">${icone}</div><div>${texto}</div></div>`;
}

function favoritoBtn(id, classeExtra) {
  const ativo = isFavorito(id);
  const rotulo = ativo ? "Remover dos favoritos" : "Adicionar aos favoritos";
  return `<button type="button" class="fav-btn ${classeExtra || ""} ${ativo ? "ativo" : ""}" data-fav-id="${id}" title="${rotulo}" aria-label="${rotulo}">${ativo ? "★" : "☆"}</button>`;
}

document.addEventListener("click", (e) => {
  const btn = e.target.closest(".fav-btn");
  if (!btn) return;
  e.preventDefault();
  e.stopPropagation();
  const id = btn.dataset.favId;
  const ativo = alternarFavorito(id);
  const rotulo = ativo ? "Remover dos favoritos" : "Adicionar aos favoritos";
  document.querySelectorAll(`.fav-btn[data-fav-id="${id}"]`).forEach((b) => {
    b.classList.toggle("ativo", ativo);
    b.textContent = ativo ? "★" : "☆";
    b.title = rotulo;
    b.setAttribute("aria-label", rotulo);
  });
  document.dispatchEvent(new CustomEvent("favoritos:mudou", { detail: { id, ativo } }));
});
