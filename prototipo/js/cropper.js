// Editor simples de recorte/zoom (tipo o de foto de perfil de rede social),
// sem nenhuma biblioteca externa. Usado antes de salvar foto de produto,
// foto de passo do manual e logo de fabricante, pra a pessoa escolher
// exatamente o que fica dentro do quadro em vez de a foto ser cortada sem
// controle.
window.abrirRecorte = function abrirRecorte(file, aspecto, formatoSaida, onConfirmar) {
  const razao = aspecto === "1/1" ? 1 : 4 / 3;

  const overlay = document.createElement("div");
  overlay.className = "crop-overlay";
  overlay.innerHTML = `
    <div class="crop-card">
      <div class="crop-title">Ajustar foto</div>
      <div class="crop-viewport">
        <img class="crop-img" draggable="false" alt="Prévia da foto">
      </div>
      <p class="crop-hint">Arraste a foto pra posicionar e use o controle pra dar zoom.</p>
      <input type="range" class="crop-zoom" min="0" max="100" value="0">
      <div class="crop-actions">
        <button type="button" class="btn-secondary crop-cancelar">Cancelar</button>
        <button type="button" class="btn-primary crop-confirmar">Usar foto</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  const viewport = overlay.querySelector(".crop-viewport");
  const imgEl = overlay.querySelector(".crop-img");
  const zoomEl = overlay.querySelector(".crop-zoom");
  const btnCancelar = overlay.querySelector(".crop-cancelar");
  const btnConfirmar = overlay.querySelector(".crop-confirmar");

  let W, H, iw, ih, minScale, maxScale, scale, offsetX, offsetY;
  let arrastando = false;
  let inicioPointer = { x: 0, y: 0 };
  let inicioOffset = { x: 0, y: 0 };

  function aplicarTransform() {
    imgEl.style.width = `${iw * scale}px`;
    imgEl.style.height = `${ih * scale}px`;
    imgEl.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
  }

  function limitarOffset() {
    const minX = W - iw * scale;
    const minY = H - ih * scale;
    offsetX = Math.min(0, Math.max(minX, offsetX));
    offsetY = Math.min(0, Math.max(minY, offsetY));
  }

  function definirEscala(novaScale) {
    const centroImgX = (W / 2 - offsetX) / scale;
    const centroImgY = (H / 2 - offsetY) / scale;
    scale = novaScale;
    offsetX = W / 2 - centroImgX * scale;
    offsetY = H / 2 - centroImgY * scale;
    limitarOffset();
    aplicarTransform();
  }

  function onZoomInput() {
    const t = Number(zoomEl.value) / 100;
    definirEscala(minScale + t * (maxScale - minScale));
  }

  function posicaoPointer(e) {
    if (e.touches && e.touches[0]) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    return { x: e.clientX, y: e.clientY };
  }

  function onPointerDown(e) {
    arrastando = true;
    inicioPointer = posicaoPointer(e);
    inicioOffset = { x: offsetX, y: offsetY };
    if (e.cancelable) e.preventDefault();
  }

  function onPointerMove(e) {
    if (!arrastando) return;
    const p = posicaoPointer(e);
    offsetX = inicioOffset.x + (p.x - inicioPointer.x);
    offsetY = inicioOffset.y + (p.y - inicioPointer.y);
    limitarOffset();
    aplicarTransform();
    if (e.cancelable) e.preventDefault();
  }

  function onPointerUp() {
    arrastando = false;
  }

  function limparEventos() {
    window.removeEventListener("mousemove", onPointerMove);
    window.removeEventListener("mouseup", onPointerUp);
    window.removeEventListener("touchmove", onPointerMove);
    window.removeEventListener("touchend", onPointerUp);
  }

  function fechar() {
    limparEventos();
    overlay.remove();
  }

  function iniciar() {
    const largura = Math.min(300, window.innerWidth - 56);
    W = largura;
    H = largura / razao;
    viewport.style.width = `${W}px`;
    viewport.style.height = `${H}px`;

    iw = imgEl.naturalWidth;
    ih = imgEl.naturalHeight;
    minScale = Math.max(W / iw, H / ih);
    maxScale = minScale * 3;
    scale = minScale;
    offsetX = (W - iw * scale) / 2;
    offsetY = (H - ih * scale) / 2;
    zoomEl.value = 0;
    aplicarTransform();

    viewport.addEventListener("mousedown", onPointerDown);
    window.addEventListener("mousemove", onPointerMove);
    window.addEventListener("mouseup", onPointerUp);
    viewport.addEventListener("touchstart", onPointerDown, { passive: false });
    window.addEventListener("touchmove", onPointerMove, { passive: false });
    window.addEventListener("touchend", onPointerUp);
    zoomEl.addEventListener("input", onZoomInput);
  }

  btnCancelar.addEventListener("click", fechar);

  btnConfirmar.addEventListener("click", () => {
    const outW = razao >= 1 ? 640 : Math.round(640 * razao);
    const outH = razao >= 1 ? Math.round(640 / razao) : 640;
    const canvas = document.createElement("canvas");
    canvas.width = outW;
    canvas.height = outH;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(
      imgEl,
      -offsetX / scale, -offsetY / scale, W / scale, H / scale,
      0, 0, outW, outH
    );
    const mime = formatoSaida === "png" ? "image/png" : "image/jpeg";
    const dataUrl = formatoSaida === "png" ? canvas.toDataURL(mime) : canvas.toDataURL(mime, 0.85);
    fechar();
    onConfirmar(dataUrl);
  });

  const leitor = new FileReader();
  leitor.onload = () => {
    imgEl.onload = iniciar;
    imgEl.src = leitor.result;
  };
  leitor.readAsDataURL(file);
};
