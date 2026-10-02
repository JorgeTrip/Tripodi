/**
 * ============================================================================
 * MÓDULO DE MODERACIÓN DE TESTIMONIOS - TRIPODI
 * ============================================================================
 * Administra la aprobación de nuevos mensajes y la eliminación de comentarios
 * ya publicados en Cloud Firestore mediante autenticación por clave de acceso.
 * Diseño desacoplado sin dependencias circulares mediante eventos CustomEvent.
 */

import { URL_FIRESTORE, configuracionFirebase } from './configuracionFirebase.js';

/**
 * Elimina un documento específico en Firestore.
 * 
 * @param {string} rutaDocumento - Identificador o path relativo en Firestore.
 * @returns {Promise<boolean>} Estado de la eliminación.
 */
async function eliminarDocumentoFirestore(rutaDocumento) {
  const respuesta = await fetch(`https://firestore.googleapis.com/v1/${rutaDocumento}?key=${configuracionFirebase.apiKey}`, {
    method: 'DELETE'
  });
  return respuesta.ok;
}

/**
 * Aprueba un testimonio pendiente en Firestore.
 * 
 * @param {string} rutaDocumento - Ruta del documento en Firestore.
 * @returns {Promise<boolean>} Estado de la actualización.
 */
async function aprobarDocumentoFirestore(rutaDocumento) {
  const respuesta = await fetch(`https://firestore.googleapis.com/v1/${rutaDocumento}?updateMask.fieldPaths=aprobado&key=${configuracionFirebase.apiKey}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields: { aprobado: { booleanValue: true } } })
  });
  return respuesta.ok;
}

/**
 * Modera los comentarios que aún no han sido aprobados.
 * 
 * @param {Array} documentos - Lista de documentos sin aprobación.
 * @returns {Promise<void>}
 */
async function moderarPendientes(documentos) {
  if (documentos.length === 0) {
    alert('No hay comentarios pendientes de aprobación.');
    return;
  }

  for (const item of documentos) {
    const f = item.fields;
    const autor = f.nombre?.stringValue || 'Anónimo';
    const ubicacion = f.pais?.stringValue || 'Sin ubicación';
    const estrellas = f.calificacion?.integerValue || '5';
    const texto = f.mensaje?.stringValue || '';

    const pregunta = `TESTIMONIO PENDIENTE:\nAutor: ${autor} (${ubicacion})\nCalificación: ${estrellas}★\n\n"${texto}"\n\n¿Deseas APROBAR este comentario para su publicación?`;
    if (confirm(pregunta)) {
      await aprobarDocumentoFirestore(item.pathName);
      alert('✓ Comentario aprobado y publicado con éxito.');
    } else {
      if (confirm('¿Deseas ELIMINAR definitivamente este mensaje?')) {
        await eliminarDocumentoFirestore(item.pathName);
        alert('✕ Comentario eliminado.');
      }
    }
  }
}

/**
 * Permite seleccionar y eliminar testimonios que ya se encuentran publicados.
 * 
 * @param {Array} documentos - Lista de documentos actualmente publicados.
 * @returns {Promise<void>}
 */
async function gestionarPublicados(documentos) {
  if (documentos.length === 0) {
    alert('No hay comentarios de usuarios publicados en Firestore para eliminar.');
    return;
  }

  for (const item of documentos) {
    const f = item.fields;
    const autor = f.nombre?.stringValue || 'Anónimo';
    const ubicacion = f.pais?.stringValue || 'Sin ubicación';
    const texto = f.mensaje?.stringValue || '';

    const pregunta = `COMENTARIO PUBLICADO:\nAutor: ${autor} (${ubicacion})\n\n"${texto}"\n\n¿Deseas ELIMINAR este comentario del muro público?`;
    if (confirm(pregunta)) {
      await eliminarDocumentoFirestore(item.pathName);
      alert(`✓ El comentario de ${autor} ha sido eliminado del muro.`);
    }
  }
}

/**
 * Apertura del panel de moderación con selector de acción (pendientes o publicados).
 * 
 * @returns {Promise<void>}
 */
export async function abrirModeracionAdmin() {
  const clave = prompt('Introduce la clave de administración para moderar:');
  if (clave !== 'tripodi2026' && clave !== 'admin') {
    alert('Clave no válida.');
    return;
  }

  try {
    const res = await fetch(`${URL_FIRESTORE}?key=${configuracionFirebase.apiKey}`);
    const data = await res.json();
    if (!data.documents) {
      alert('No se encontraron comentarios registrados en la base de datos.');
      return;
    }

    const todos = data.documents.map(d => ({
      id: d.name.split('/').pop(),
      pathName: d.name,
      fields: d.fields || {}
    }));

    const pendientes = todos.filter(d => d.fields.aprobado?.booleanValue === false);
    const publicados = todos.filter(d => d.fields.aprobado?.booleanValue === true);

    const opcion = prompt(
      `PANEL DE CONTROL TRIPODI\n\n` +
      `Pendientes por revisar: ${pendientes.length}\n` +
      `Publicados en el muro: ${publicados.length}\n\n` +
      `Elige una opción:\n` +
      `1 = Revisar comentarios pendientes\n` +
      `2 = Eliminar comentarios ya publicados`,
      pendientes.length > 0 ? '1' : '2'
    );

    if (opcion === '1') {
      await moderarPendientes(pendientes);
    } else if (opcion === '2') {
      await gestionarPublicados(publicados);
    }

    // Notificar actualización al muro mediante evento global desacoplado
    window.dispatchEvent(new CustomEvent('comentariosActualizados'));

  } catch (error) {
    console.error('Error durante la moderación:', error);
    alert('Error al conectar con Firestore. Verifica la conexión a internet.');
  }
}
