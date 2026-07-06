/**
 * GRÁFICOS INTERACTIVOS (CANVAS) - TRIPODI
 * Lógica para dibujar el gráfico de Donut (Hipótesis) y Radar (Perfil lingüístico) en Canvas.
 */

function getColor(name) {
  const dark = document.documentElement.getAttribute('data-theme') === 'dark';
  return {
    text: dark ? '#EDE8DF' : '#1C1710',
    muted: dark ? '#9A9180' : '#6B5E4A',
    grid: dark ? 'rgba(201,168,76,0.15)' : 'rgba(100,70,30,0.12)',
    bg: dark ? 'rgba(33,30,24,0.92)' : 'rgba(255,255,255,0.95)'
  }[name];
}

// 1. Gráfico circular (Donut)
function drawDonut() {
  const c = document.getElementById('donutCanvas');
  if (!c) return;
  const ctx = c.getContext('2d');
  ctx.clearRect(0, 0, 200, 200);
  
  const data = [45, 35, 20];
  const colors = ['#C9A84C', '#B85C2A', '#2A5B7A'];
  const total = 100;
  const cx = 100, cy = 100, outerR = 85, innerR = 52;
  
  let startAngle = -Math.PI / 2;
  data.forEach((val, i) => {
    const angle = (val / total) * 2 * Math.PI;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, outerR, startAngle, startAngle + angle);
    ctx.closePath();
    ctx.fillStyle = colors[i];
    ctx.fill();
    startAngle += angle;
  });
  
  ctx.beginPath();
  ctx.arc(cx, cy, innerR, 0, 2 * Math.PI);
  ctx.fillStyle = getColor('bg');
  ctx.fill();
  
  ctx.fillStyle = '#C9A84C';
  ctx.font = 'bold 18px Cinzel, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('3', cx, cy - 8);
  
  ctx.fillStyle = getColor('muted');
  ctx.font = '10px Inter, sans-serif';
  ctx.fillText('TEORÍAS', cx, cy + 10);
}

// 2. Gráfico de Radar
function drawRadar(highlightIdx) {
  const c = document.getElementById('radarCanvas');
  if (!c) return;
  const ctx = c.getContext('2d');
  
  const W = c.width, H = c.height, cx = W / 2, cy = H / 2;
  const labels = ['Raíz\ngriega pura', 'Resiliencia\nhistórica', 'Influencia\nbizantina', 'Fonética\ndialectal', 'Latinización'];
  const values = [0.95, 0.90, 0.70, 0.65, 0.20];
  const n = labels.length, r = W * 0.36;
  
  const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
  const gold = '#C9A84C';
  const gridC = isDark ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.1)';
  const fillC = isDark ? 'rgba(201,168,76,.18)' : 'rgba(201,168,76,.22)';
  const labelC = isDark ? 'rgba(255,255,255,.7)' : 'rgba(0,0,0,.6)';

  function pt(angle, radius) {
    return { x: cx + radius * Math.sin(angle), y: cy - radius * Math.cos(angle) };
  }

  ctx.clearRect(0, 0, W, H);

  // Dibujar anillos concéntricos
  for (let ring = 1; ring <= 4; ring++) {
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const p = pt(2 * Math.PI * i / n, r * ring / 4);
      i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
    }
    ctx.closePath();
    ctx.strokeStyle = gridC;
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // Dibujar ejes radiales
  for (let i = 0; i < n; i++) {
    const p = pt(2 * Math.PI * i / n, r);
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(p.x, p.y);
    ctx.strokeStyle = gridC;
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // Dibujar polígono de datos
  ctx.beginPath();
  for (let i = 0; i < n; i++) {
    const p = pt(2 * Math.PI * i / n, r * values[i]);
    i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
  }
  ctx.closePath();
  ctx.fillStyle = fillC;
  ctx.fill();
  ctx.strokeStyle = gold;
  ctx.lineWidth = 2;
  ctx.stroke();

  // Dibujar puntos de datos
  for (let i = 0; i < n; i++) {
    const p = pt(2 * Math.PI * i / n, r * values[i]);
    const isHighlighted = i === highlightIdx;
    ctx.beginPath();
    ctx.arc(p.x, p.y, isHighlighted ? 7 : 4, 0, 2 * Math.PI);
    ctx.fillStyle = isHighlighted ? gold : (isDark ? '#1a1a10' : '#fff');
    ctx.fill();
    ctx.strokeStyle = gold;
    ctx.lineWidth = isHighlighted ? 3 : 2;
    ctx.stroke();

    if (isHighlighted) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 14, 0, 2 * Math.PI);
      ctx.strokeStyle = 'rgba(201,168,76,.4)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }

  // Dibujar etiquetas
  const labelPadding = [18, 18, 18, 18, 18];
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  labels.forEach((label, i) => {
    const angle = 2 * Math.PI * i / n;
    const p = pt(angle, r + labelPadding[i]);
    ctx.font = `${i === highlightIdx ? 'bold ' : ''}11px Inter, sans-serif`;
    ctx.fillStyle = i === highlightIdx ? gold : labelC;
    const parts = label.split('\n');
    parts.forEach((part, j) => {
      ctx.fillText(part, p.x, p.y + (j - (parts.length - 1) / 2) * 13);
    });
  });
}

function redrawCharts() {
  drawDonut();
  drawRadar();
}

// Inicialización de los gráficos
window.addEventListener('load', redrawCharts);

// Redibujar radar cuando se hace scroll y entra en pantalla (corrige problemas de fade-up)
document.addEventListener('DOMContentLoaded', () => {
  const radarObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        drawRadar();
        radarObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  
  const radarWrap = document.getElementById('radarWrap');
  if (radarWrap) {
    radarObs.observe(radarWrap);
  }
});

// Resaltado de radar interactivo al pasar el cursor sobre las tarjetas de perfil lingüístico
(function() {
  const cards = document.querySelectorAll('.lang-attr[data-radar-idx]');
  if (!cards.length) return;
  let unhighlightTimer = null;

  cards.forEach(card => {
    const idx = parseInt(card.getAttribute('data-radar-idx'), 10);
    if (Number.isNaN(idx)) return;

    function highlight() {
      card.classList.add('radar-highlight');
      drawRadar(idx);
    }
    function unhighlight() {
      card.classList.remove('radar-highlight');
      drawRadar();
    }
    function tapHighlight() {
      if (window.innerWidth > 768) return;
      highlight();
      clearTimeout(unhighlightTimer);
      unhighlightTimer = setTimeout(unhighlight, 900);
    }

    card.addEventListener('mouseenter', highlight);
    card.addEventListener('mouseleave', unhighlight);
    card.addEventListener('focus', highlight);
    card.addEventListener('blur', unhighlight);
    card.addEventListener('click', tapHighlight);
  });
})();
