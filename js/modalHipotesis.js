/**
 * ============================================================================
 * MODAL DE HIPÓTESIS HISTÓRICAS - TRIPODI
 * ============================================================================
 * Gestiona el modal interactivo de escritorio y el acordeón en móviles para
 * las 3 hipótesis del origen del apellido (Ocupacional, Topográfica, Votiva).
 */

const datosHipotesis = {
  '01': {
    icono: '🏺',
    titulo: 'El artesano del trípode',
    subtitulo: 'Hipótesis ocupacional · La más probable',
    porcentaje: '60%',
    anchoBarra: '60%',
    cuerpo: 'En la Magna Grecia de los siglos VI–IV a.C., el herrero o broncista que fabricaba trípodes era un artesano de alto estatus social. El trípode no era un utensilio doméstico ordinario: era un objeto ritual y de prestigio, premio en juegos atléticos, ofrenda en los grandes santuarios y símbolo de poder.',
    detalle: 'Los documentos medievales del Reino de Nápoles registran a artesanos y mercaderes del hierro y el bronce con el apodo "de tripodi" (del trípode), que con el tiempo se fosilizó como apellido hereditario. Esta hipótesis es la más respaldada por la evidencia histórica y la paralela formación de otros apellidos italianos de oficio: Ferrari (herrero), Fabbri (artesano), Calzolaio (zapatero).',
    imagen: 'imagenes/Imagen_3.webp'
  },
  '02': {
    icono: '⛰️',
    titulo: 'La formación rocosa',
    subtitulo: 'Hipótesis topográfica · Posible',
    porcentaje: '25%',
    anchoBarra: '25%',
    cuerpo: 'Calabria y Sicilia tienen una geografía volcánica y costera singular, con formaciones rocosas que emergen del mar o de la tierra firme en grupos de tres. En el dialecto calabrés tardío, una formación "a tre piedi" (de tres pies) pudo dar nombre a un lugar, y de allí a la familia que lo habitaba.',
    detalle: 'Los apellidos topográficos son la segunda categoría más frecuente en la onomástica italiana meridional. Apellidos como Rocca, Montagna, Fiumara o Costa siguen el mismo patrón. Sin embargo, no se ha localizado ningún topónimo "Tripodi" documentado en fuentes medievales de Calabria o Sicilia, lo que limita el peso de esta hipótesis.',
    imagen: 'imagenes/Imagen_2.webp'
  },
  '03': {
    icono: '🔮',
    titulo: 'El vínculo con Apolo',
    subtitulo: 'Hipótesis votiva o cultual · Evocadora',
    porcentaje: '15%',
    anchoBarra: '15%',
    cuerpo: 'Las colonias griegas del sur de Italia —Locri, Regio, Crotona— mantenían un lazo espiritual intenso con el Oráculo de Delfos, cuyo símbolo central era el trípode sagrado de la Pitia. Un nombre de devoción apolínea, adoptado como señal de protección divina, pudo cristalizar en apellido.',
    detalle: 'Esta hipótesis es la más difícil de documentar pero la más rica en resonancias culturales. El antropónimo griego "Tripodios" (del trípode) aparece en inscripciones de época helenística, lo que prueba que el trípode ya funcionaba como nombre propio en el mundo griego antes de que el apellido se estabilizara en la Calabria medieval.',
    imagen: 'imagenes/Imagen_4.webp'
  }
};

// Alias de retrocompatibilidad
const hypoData = datosHipotesis;

/**
 * Abre el modal de hipótesis en escritorio o expande el acordeón en móviles.
 * 
 * @param {HTMLElement} tarjetaElemento - Tarjeta DOM de la hipótesis pulsada.
 * @returns {void}
 */
function abrirModalHipotesis(tarjetaElemento) {
  if (window.innerWidth <= 768) {
    alternarTarjetaHipotesis(tarjetaElemento);
    return;
  }

  const numero = tarjetaElemento.querySelector('.hypo-num')?.textContent?.trim();
  if (!numero || !datosHipotesis[numero]) return;
  
  const datos = datosHipotesis[numero];
  const modal = document.getElementById('hypoModal');
  if (!modal) return;

  document.getElementById('hypoModalNum').textContent = numero;
  document.getElementById('hypoModalIcon').textContent = datos.icono;
  document.getElementById('hypoModalTitle').textContent = datos.titulo;
  document.getElementById('hypoModalSubtitle').textContent = datos.subtitulo;
  document.getElementById('hypoModalPct').textContent = datos.porcentaje;
  document.getElementById('hypoModalBody').textContent = datos.cuerpo;
  document.getElementById('hypoModalDetail').textContent = datos.detalle;
  
  const imagenElemento = document.getElementById('hypoModalImg');
  if (imagenElemento) {
    imagenElemento.src = datos.imagen;
    imagenElemento.alt = datos.titulo;
  }
  
  const barraProgreso = document.getElementById('hypoModalBarFill');
  if (barraProgreso) {
    barraProgreso.style.width = '0';
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => { barraProgreso.style.width = datos.anchoBarra; });
  }
}

const openHypoModal = abrirModalHipotesis;

/**
 * Cierra la ventana modal de hipótesis al hacer clic en el overlay o botón 'X'.
 * 
 * @param {MouseEvent} [evento] - Evento de clic disparador.
 * @returns {void}
 */
function cerrarModalHipotesis(evento) {
  const modal = document.getElementById('hypoModal');
  if (!modal) return;
  if (evento && evento.target !== modal && !evento.target.classList.contains('hypo-modal-close')) return;
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

const closeHypoModal = cerrarModalHipotesis;

/**
 * Conmuta la tarjeta activa en modo móvil.
 * 
 * @param {HTMLElement} tarjeta - Elemento tarjeta interactuado.
 * @returns {void}
 */
function alternarTarjetaHipotesis(tarjeta) {
  const estabaActiva = tarjeta.classList.contains('active');
  document.querySelectorAll('.hypo-card').forEach(c => c.classList.remove('active'));
  if (!estabaActiva) tarjeta.classList.add('active');
}

const toggleHypo = alternarTarjetaHipotesis;
