/**
 * Fio de leitura no topo: acompanha o quanto da página já foi rolado.
 */
(function () {
  "use strict";

  var fio = document.querySelector(".progresso span");
  if (!fio) return;

  var agendado = false;

  function medir() {
    agendado = false;
    var doc = document.documentElement;
    var rolavel = doc.scrollHeight - doc.clientHeight;
    var lido = rolavel > 0 ? doc.scrollTop / rolavel : 0;
    fio.style.transform = "scaleX(" + Math.min(1, Math.max(0, lido)) + ")";
  }

  // Uma medição por quadro. Sem isso o cálculo rodaria dezenas de vezes por
  // rolagem, e cada leitura de scrollHeight força o navegador a refazer contas.
  function aoRolar() {
    if (agendado) return;
    agendado = true;
    window.requestAnimationFrame(medir);
  }

  window.addEventListener("scroll", aoRolar, { passive: true });
  window.addEventListener("resize", aoRolar);
  medir();
})();

/**
 * Entrada suave dos blocos da carta.
 *
 * A classe `js-reveal` só é adicionada aqui: se o JS não carregar (ou o
 * usuário preferir menos animação), o conteúdo aparece normalmente.
 */
(function () {
  "use strict";

  var letter = document.querySelector(".letter");
  if (!letter) return;

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion || !("IntersectionObserver" in window)) return;

  var blocks = Array.prototype.slice.call(letter.children).filter(function (el) {
    return !el.classList.contains("glass-glow");
  });
  if (!blocks.length) return;

  // O que já está visível na primeira tela não anima (evita piscada).
  var alreadyVisible = blocks.filter(function (el) {
    return el.getBoundingClientRect().top < window.innerHeight;
  });

  document.documentElement.classList.add("js-reveal");
  alreadyVisible.forEach(function (el) {
    el.classList.add("is-visible");
  });

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });

  blocks.forEach(function (el) {
    if (!el.classList.contains("is-visible")) observer.observe(el);
  });

  // Rede de segurança: se algo der errado, mostra tudo depois de 3s.
  window.setTimeout(function () {
    blocks.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }, 3000);
})();
