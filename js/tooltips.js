/**
 * CONTROL DE TOOLTIPS - TRIPODI
 * Lógica para inicializar y posicionar dinámicamente los tooltips definidos en el HTML (.tt).
 */

(function() {
  const bubble = document.createElement('div');
  bubble.id = 'ttBubble';
  document.body.appendChild(bubble);

  let hideTimer = null;

  function showTt(el) {
    clearTimeout(hideTimer);
    const def = el.getAttribute('data-tt');
    if (!def) return;
    bubble.textContent = def;
    bubble.classList.add('tt-visible');
    positionTt(el);
  }

  function hideTt() {
    hideTimer = setTimeout(() => bubble.classList.remove('tt-visible'), 120);
  }

  function positionTt(el) {
    const r = el.getBoundingClientRect();
    const bw = 260, margin = 8;
    let left = r.left + r.width / 2 - bw / 2;
    left = Math.max(margin, Math.min(left, window.innerWidth - bw - margin));
    const top = r.top - 8;
    bubble.style.cssText = `left:${left}px;top:${top}px;transform:translateY(-100%);max-width:${bw}px;`;
  }

  function initTt() {
    document.querySelectorAll('.tt').forEach(el => {
      el.addEventListener('mouseenter', () => showTt(el));
      el.addEventListener('mouseleave', hideTt);
      el.addEventListener('focus', () => showTt(el));
      el.addEventListener('blur', hideTt);
      
      // En dispositivos táctiles, hacer click/tap para mostrar
      el.addEventListener('click', e => {
        e.stopPropagation();
        if (bubble.classList.contains('tt-visible') && bubble._lastEl === el) {
          hideTt();
        } else {
          bubble._lastEl = el;
          showTt(el);
        }
      });
      el.setAttribute('tabindex', '0');
      el.setAttribute('role', 'note');
    });
    
    document.addEventListener('click', () => bubble.classList.remove('tt-visible'));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTt);
  } else {
    initTt();
  }
})();
