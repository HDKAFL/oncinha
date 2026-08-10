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
