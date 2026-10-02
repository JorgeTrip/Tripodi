/**
 * ============================================================================
 * GESTOR DE TESTIMONIOS Y MURO DE COMENTARIOS - TRIPODI
 * ============================================================================
 * Renderiza el muro de comentarios aprobados con los 2 testimonios históricos
 * iniciales y los comentarios dinámicos validados en Cloud Firestore.
 * Conforme a SAST SEC-004: Todo el renderizado es seguro y libre de innerHTML.
 */

import { obtenerComentariosAprobadosFirestore, formatearFecha } from './configuracionFirebase.js';
import { abrirModeracionAdmin } from './moderacionComentarios.js';

// Testimonios predeterminados de alta fidelidad genealógica
const testimoniosIniciales = [
  {
    nombre: 'Marcelo Díaz',
    pais: 'Buenos Aires, Argentina',
    calificacion: 5,
    mensaje: 'Mi mamá, de soltera Tripodi, siempre me contaba sobre el origen griego de su apellido... ver toda la historia y los documentos compilados acá es emocionante.',
    fecha: '15-03-2026'
  },
  {
    nombre: 'María Laura Trípodi',
    pais: 'Rosario, Argentina',
    calificacion: 5,
    mensaje: 'Mi bisabuelo llegó a Argentina en 1912 desde Calabria y se radicó en Rosario. ¡Felicitaciones por el proyecto!',
    fecha: '20-01-2026'
  }
];

/**
 * Genera el elemento contenedor de estrellas de calificación doradas.
 * 
 * @param {number} cantidad - Número de estrellas activas (1 a 5).
 * @returns {HTMLDivElement} Contenedor con las estrellas formateadas.
 */
function crearEstrellasTestimonio(cantidad) {
  const contenedor = document.createElement('div');
  contenedor.className = 'testimonio-estrellas';
  contenedor.setAttribute('aria-label', `${cantidad} de 5 estrellas`);

  for (let i = 1; i <= 5; i++) {
    const estrella = document.createElement('span');
    estrella.className = i <= cantidad ? 'estrella-activa' : 'estrella-inactiva';
    estrella.textContent = '★';
    contenedor.appendChild(estrella);
  }
  return contenedor;
}

/**
 * Construye una tarjeta visual de testimonio con estilo Apple / Magna Grecia.
 * 
 * @param {Object} testimonio - Datos del comentario (nombre, pais, mensaje, etc.).
 * @returns {HTMLDivElement} Tarjeta DOM estilizada.
 */
function crearTarjetaTestimonio(testimonio) {
  const tarjeta = document.createElement('div');
  tarjeta.className = 'testimonio-card fade-up';

  // Cabecera de la tarjeta con avatar e información
  const cabecera = document.createElement('div');
  cabecera.className = 'testimonio-header';

  const avatar = document.createElement('div');
  avatar.className = 'testimonio-avatar';
  avatar.textContent = (testimonio.nombre || 'T').charAt(0).toUpperCase();

  const meta = document.createElement('div');
  meta.className = 'testimonio-meta';

  const nombre = document.createElement('div');
  nombre.className = 'testimonio-nombre';
  nombre.textContent = testimonio.nombre;

  const pais = document.createElement('div');
  pais.className = 'testimonio-pais';
  pais.textContent = testimonio.pais;

  meta.appendChild(nombre);
  meta.appendChild(pais);
  cabecera.appendChild(avatar);
  cabecera.appendChild(meta);

  const estrellas = crearEstrellasTestimonio(testimonio.calificacion || 5);

  const cuerpo = document.createElement('p');
  cuerpo.className = 'testimonio-cuerpo';
  cuerpo.textContent = `“${testimonio.mensaje}”`;

  const pie = document.createElement('div');
  pie.className = 'testimonio-pie';
  pie.textContent = formatearFecha(testimonio.fecha);

  tarjeta.appendChild(cabecera);
  tarjeta.appendChild(estrellas);
  tarjeta.appendChild(cuerpo);
  tarjeta.appendChild(pie);

  return tarjeta;
}

/**
 * Carga e inserta los testimonios iniciales y los aprobados de Firestore en el muro.
 * 
 * @returns {Promise<void>}
 */
export async function cargarMuroTestimonios() {
  const contenedor = document.getElementById('muroTestimonios');
  if (!contenedor) return;

  contenedor.textContent = '';

  // 1. Cargar testimonios de base (dummies)
  testimoniosIniciales.forEach(t => {
    contenedor.appendChild(crearTarjetaTestimonio(t));
  });

  // 2. Cargar testimonios dinámicos aprobados en Firestore
  const dinamicos = await obtenerComentariosAprobadosFirestore();
  dinamicos.forEach(t => {
    contenedor.appendChild(crearTarjetaTestimonio(t));
  });
}

// Sincronización reactiva del muro ante eventos del panel de moderación
window.addEventListener('comentariosActualizados', cargarMuroTestimonios);

// Inicialización automática y detección de enlace de moderación directa
document.addEventListener('DOMContentLoaded', () => {
  cargarMuroTestimonios();

  const botonModerar = document.getElementById('botonModerarComentarios');
  if (botonModerar) botonModerar.addEventListener('click', abrirModeracionAdmin);

  // Apertura automática al ingresar desde el enlace del correo electrónico
  const params = new URLSearchParams(window.location.search);
  if (params.get('moderar') === 'true' || window.location.hash.includes('moderar')) {
    setTimeout(abrirModeracionAdmin, 600);
  }
});
