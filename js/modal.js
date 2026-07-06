/**
 * LIGHTBOX, MODALES Y DIÁLOGOS INTERACTIVOS - TRIPODI
 * Controla la visualización de modales de hipótesis, galerías de imágenes y tooltips.
 */

// Datos de las hipótesis para visualización en modal de escritorio
const hypoData = {
  '01': {
    icon: '🏺', title: 'El artesano del trípode', subtitle: 'Hipótesis ocupacional · La más probable',
    pct: '60%', barWidth: '60%',
    body: 'En la Magna Grecia de los siglos VI–IV a.C., el herrero o broncista que fabricaba trípodes era un artesano de alto estatus social. El trípode no era un utensilio doméstico ordinario: era un objeto ritual y de prestigio, premio en juegos atléticos, ofrenda en los grandes santuarios y símbolo de poder.',
    detail: 'Los documentos medievales del Reino de Nápoles registran a artesanos y mercaderes del hierro y el bronce con el apodo "de tripodi" (del trípode), que con el tiempo se fosilizó como apellido hereditario. Esta hipótesis es la más respaldada por la evidencia histórica y la paralela formación de otros apellidos italianos de oficio: Ferrari (herrero), Fabbri (artesano), Calzolaio (zapatero).',
    img: 'imagenes/Imagen_3.webp'
  },
  '02': {
    icon: '⛰️', title: 'La formación rocosa', subtitle: 'Hipótesis topográfica · Posible',
    pct: '25%', barWidth: '25%',
    body: 'Calabria y Sicilia tienen una geografía volcánica y costera singular, con formaciones rocosas que emergen del mar o de la tierra firme en grupos de tres. En el dialecto calabrés tardío, una formación "a tre piedi" (de tres pies) pudo dar nombre a un lugar, y de allí a la familia que lo habitaba.',
    detail: 'Los apellidos topográficos son la segunda categoría más frecuente en la onomástica italiana meridional. Apellidos como Rocca, Montagna, Fiumara o Costa siguen el mismo patrón. Sin embargo, no se ha localizado ningún topónimo "Tripodi" documentado en fuentes medievales de Calabria o Sicilia, lo que limita el peso de esta hipótesis.',
    img: 'imagenes/Imagen_2.webp'
  },
  '03': {
    icon: '🔮', title: 'El vínculo con Apolo', subtitle: 'Hipótesis votiva o cultual · Evocadora',
    pct: '15%', barWidth: '15%',
    body: 'Las colonias griegas del sur de Italia —Locri, Regio, Crotona— mantenían un lazo espiritual intenso con el Oráculo de Delfos, cuyo símbolo central era el trípode sagrado de la Pitia. Un nombre de devoción apolínea, adoptado como señal de protección divina, pudo cristalizar en apellido.',
    detail: 'Esta hipótesis es la más difícil de documentar pero la más rica en resonancias culturales. El antropónimo griego "Tripodios" (del trípode) aparece en inscripciones de época helenística, lo que prueba que el trípode ya funcionaba como nombre propio en el mundo griego antes de que el apellido se estabilizara en la Calabria medieval.',
    img: 'imagenes/Imagen_4.webp'
  }
};

// Función para abrir el modal de hipótesis (en escritorio) o expandir acordeón (en móvil)
function openHypoModal(cardEl) {
  if (window.innerWidth <= 768) {
    toggleHypo(cardEl);
    return;
  }

  const num = cardEl.querySelector('.hypo-num')?.textContent?.trim();
  if (!num || !hypoData[num]) return;
  
  const d = hypoData[num];
  const modal = document.getElementById('hypoModal');
  if (!modal) return;

  document.getElementById('hypoModalNum').textContent = num;
  document.getElementById('hypoModalIcon').textContent = d.icon;
  document.getElementById('hypoModalTitle').textContent = d.title;
  document.getElementById('hypoModalSubtitle').textContent = d.subtitle;
  document.getElementById('hypoModalPct').textContent = d.pct;
  document.getElementById('hypoModalBody').textContent = d.body;
  document.getElementById('hypoModalDetail').textContent = d.detail;
  
  const img = document.getElementById('hypoModalImg');
  if (img) { img.src = d.img; img.alt = d.title; }
  
  const fill = document.getElementById('hypoModalBarFill');
  if (fill) {
    fill.style.width = '0';
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => { fill.style.width = d.barWidth; });
  }
}

function closeHypoModal(e) {
  if (e && e.target !== document.getElementById('hypoModal') && !e.target.classList.contains('hypo-modal-close')) return;
  const modal = document.getElementById('hypoModal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

function toggleHypo(card) {
  const wasActive = card.classList.contains('active');
  document.querySelectorAll('.hypo-card').forEach(c => c.classList.remove('active'));
  if (!wasActive) card.classList.add('active');
}

// Lógica de Lightbox de Imágenes
function openLightbox(src, caption, sourceUrl) {
  const lb = document.getElementById('lightbox');
  const img = document.getElementById('lightboxImg');
  const cap = document.getElementById('lightboxCaption');
  const srcLink = document.getElementById('lightboxSourceLink');
  const infoBtn = document.getElementById('lightboxInfoBtn');
  
  if (!lb || !img || !cap) return;

  img.src = src;
  cap.innerHTML = caption || '';
  cap.classList.remove('caption-shown');
  if (infoBtn) infoBtn.textContent = 'mostrar info';
  
  if (sourceUrl) {
    srcLink.href = sourceUrl;
    srcLink.style.display = 'inline-flex';
  } else {
    srcLink.style.display = 'none';
  }
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function toggleLightboxCaption() {
  const cap = document.getElementById('lightboxCaption');
  const btn = document.getElementById('lightboxInfoBtn');
  if (!cap || !btn) return;
  const shown = cap.classList.toggle('caption-shown');
  btn.textContent = shown ? 'ocultar info' : 'mostrar info';
}

function closeLightbox(e) {
  if (e && e.target !== document.getElementById('lightbox') && !e.target.classList.contains('lightbox-close')) return;
  const lb = document.getElementById('lightbox');
  if (lb) {
    lb.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { document.getElementById('lightboxImg').src = ''; }, 350);
  }
}

// Cerrar lightbox con tecla Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    const lb = document.getElementById('lightbox');
    if (lb) {
      lb.classList.remove('open');
      document.body.style.overflow = '';
    }
  }
});

// Manejo del clic en los banners para móviles (abrir lightbox con información extendida)
function handleBannerClick(banner, event) {
  event.stopPropagation();
  if (window.innerWidth <= 768) {
    const img = banner.querySelector('img');
    const captionDiv = banner.querySelector('.img-caption');
    if (img && captionDiv) {
      openLightbox(img.src, captionDiv.innerHTML.trim());
    }
  }
}
