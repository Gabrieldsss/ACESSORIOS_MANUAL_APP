// Roda cedo (antes do CSS terminar de aplicar), pra marcar quando o app
// está rodando de verdade dentro do Capacitor num aparelho (celular OU
// tablet) - diferente de só abrir o prototipo num navegador de
// computador durante o desenvolvimento. Ver css/style.css > ".app-nativo"
// - é o que faz a "moldura de celular" virar tela cheia de verdade em
// QUALQUER tamanho de aparelho, em vez de depender só da largura da tela
// (que não pega tablet, só celular).
if (window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform()) {
  document.documentElement.classList.add("app-nativo");
}
