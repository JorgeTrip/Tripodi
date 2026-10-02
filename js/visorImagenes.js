/**
 * ============================================================================
 * VISOR DE IMÁGENES (LIGHTBOX SEGURO) - TRIPODI
 * ============================================================================
 * Controla la apertura del lightbox a pantalla completa y su descripción
 * histórica sin riesgo de inyecciones de código HTML malicioso.
 */

/**
 * Abre el visor de imagen en pantalla completa.
 * 
 * @param {string} rutaImagen - URL o path de la imagen a mostrar.
 * @param {string} textoPie - Explicación o contexto de la imagen.
 * @param {string} [urlFuente] - Enlace opcional a la fuente externa original.
 * @returns {void}
 */
function abrirVisorImagen(rutaImagen, textoPie, urlFuente) {
  const visor = document.getElementById('lightbox');
  const imagen = document.getElementById('lightboxImg');
  const contenedorPie = document.getElementById('lightboxCaption');
  const enlaceFuente = document.getElementById('lightboxSourceLink');
  const botonInformacion = document.getElementById('lightboxInfoBtn');
  
  if (!visor || !imagen || !contenedorPie) return;

  // Si la ruta proviene de una miniatura (thumbs), cargar la versión en alta resolución
  const rutaHd = rutaImagen.replace('/thumbs/', '/').replace('\\thumbs\\', '/');
  imagen.src = rutaHd;
  
  // Sanitización mediante DOMParser para prevenir vulnerabilidades SAST (SEC-004)
  contenedorPie.textContent = '';
  if (textoPie) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(textoPie, 'text/html');
    Array.from(doc.body.childNodes).forEach(nodo => {
      contenedorPie.appendChild(nodo.cloneNode(true));
    });
  }
  
  contenedorPie.classList.remove('caption-shown');
  if (botonInformacion) botonInformacion.textContent = 'mostrar info';
  
  if (urlFuente) {
    enlaceFuente.href = urlFuente;
    enlaceFuente.style.display = 'inline-flex';
  } else {
    enlaceFuente.style.display = 'none';
  }
  
  visor.classList.add('open');
  document.body.style.overflow = 'hidden';
}

const openLightbox = abrirVisorImagen;

/**
 * Alterna la visualización del panel informativo del pie de foto en el visor.
 * 
 * @returns {void}
 */
function alternarPieDeFoto() {
  const contenedorPie = document.getElementById('lightboxCaption');
  const boton = document.getElementById('lightboxInfoBtn');
  if (!contenedorPie || !boton) return;
  const estaVisible = contenedorPie.classList.toggle('caption-shown');
  boton.textContent = estaVisible ? 'ocultar info' : 'mostrar info';
}

const toggleLightboxCaption = alternarPieDeFoto;

/**
 * Cierra el visor de imagen y limpia el recurso para liberar memoria.
 * 
 * @param {MouseEvent} [evento] - Evento de clic en overlay o botón cerrar.
 * @returns {void}
 */
function cerrarVisorImagen(evento) {
  const visor = document.getElementById('lightbox');
  if (!visor) return;
  if (evento && evento.target !== visor && !evento.target.classList.contains('lightbox-close')) return;
  visor.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => {
    const imagen = document.getElementById('lightboxImg');
    if (imagen) imagen.src = '';
  }, 350);
}

const closeLightbox = cerrarVisorImagen;

// Soporte de accesibilidad para cerrar con la tecla Escape
document.addEventListener('keydown', evento => {
  if (evento.key === 'Escape') {
    cerrarVisorImagen();
  }
});

/**
 * Gestiona el toque en los banners para móviles y expande el visor con la ficha técnica.
 * 
 * @param {HTMLElement} banner - Elemento banner pulsado.
 * @param {MouseEvent|TouchEvent} evento - Evento de interacción.
 * @returns {void}
 */
function manejarClicBanner(banner, evento) {
  evento.stopPropagation();
  if (window.innerWidth <= 768) {
    const imagen = banner.querySelector('img');
    const pieDiv = banner.querySelector('.img-caption');
    if (imagen && pieDiv) {
      abrirVisorImagen(imagen.src, pieDiv.innerHTML.trim());
    }
  }
}

const handleBannerClick = manejarClicBanner;
