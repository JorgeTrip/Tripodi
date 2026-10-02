/**
 * ============================================================================
 * FORMULARIO DE COMENTARIOS Y CALIFICACIÓN HÍBRIDO - TRIPODI
 * ============================================================================
 * Permite al visitante enviar su mensaje de forma confidencial al autor
 * (Formspree) o postularlo al muro público de testimonios (Cloud Firestore).
 */

import { guardarComentarioFirestore } from './configuracionFirebase.js';

document.addEventListener('DOMContentLoaded', () => {
  const formulario = document.querySelector('.comentarios-form');
  const mensajeFeedback = document.getElementById('formFeedback');
  const botonEnvio = document.querySelector('.form-submit');
  const botonesEstrella = document.querySelectorAll('.star-btn');
  const entradaCalificacion = document.getElementById('calificacionSeleccionada');
  const selectorDestino = document.querySelectorAll('input[name="tipoDestino"]');

  if (!formulario || !mensajeFeedback || !botonEnvio) return;

  // 1. Lógica de selección de estrellas (1 a 5)
  botonesEstrella.forEach(boton => {
    boton.addEventListener('click', () => {
      const calificacion = parseInt(boton.getAttribute('data-rating'), 10);
      if (entradaCalificacion) entradaCalificacion.value = String(calificacion);

      botonesEstrella.forEach(btn => {
        const val = parseInt(btn.getAttribute('data-rating'), 10);
        btn.classList.toggle('active', val <= calificacion);
      });
    });
  });

  // 2. Manejo de envío híbrido (Privado vs. Público)
  formulario.addEventListener('submit', async (evento) => {
    evento.preventDefault();

    const campoNombre = document.getElementById('nombre');
    const campoPais = document.getElementById('pais');
    const campoEmail = document.getElementById('email');
    const campoMensaje = document.getElementById('comentario');

    const nombre = campoNombre ? campoNombre.value.trim() : '';
    const pais = campoPais ? campoPais.value.trim() : '';
    const email = campoEmail ? campoEmail.value.trim() : '';
    const mensaje = campoMensaje ? campoMensaje.value.trim() : '';
    const calificacion = entradaCalificacion ? parseInt(entradaCalificacion.value, 10) || 5 : 5;

    let esPublico = false;
    selectorDestino.forEach(radio => {
      if (radio.checked && radio.value === 'publico') esPublico = true;
    });

    if (!nombre || !mensaje) {
      mensajeFeedback.textContent = 'Por favor completa los campos obligatorios (nombre y mensaje).';
      mensajeFeedback.className = 'form-feedback error';
      return;
    }

    botonEnvio.disabled = true;
    botonEnvio.textContent = 'Enviando...';

    try {
      if (esPublico) {
        // 1. Guardar en Cloud Firestore con estado de aprobación pendiente
        await guardarComentarioFirestore({
          nombre: nombre,
          pais: pais || 'Familia Tripodi',
          mensaje: mensaje,
          calificacion: calificacion,
          tipo: 'publico'
        });

        // 2. Notificación inmediata por correo al autor informando el nuevo testimonio pendiente
        const formDataPublico = new FormData(formulario);
        formDataPublico.append('tipo_mensaje', 'PUBLICACIÓN EN MURO (Requiere Aprobación)');
        formDataPublico.append('calificacion_estrellas', `${calificacion} de 5 estrellas`);
        formDataPublico.append('enlace_para_aprobar_directo', 'https://tripodi.netlify.app/?moderar=true#comentarios');
        formDataPublico.append('estado_firestore', 'Guardado en Firestore como PENDIENTE. Entra al enlace superior para aprobarlo.');

        await fetch(formulario.action || 'https://formspree.io/f/xbjnodgq', {
          method: 'POST',
          body: formDataPublico,
          headers: { 'Accept': 'application/json' }
        });

        mensajeFeedback.textContent = '¡Gracias! Tu testimonio fue enviado con éxito y se publicará tras la revisión del autor.';
        mensajeFeedback.className = 'form-feedback success';
      } else {
        // Enviar confidencialmente por Formspree al correo del autor
        const formDataPrivado = new FormData(formulario);
        formDataPrivado.append('tipo_mensaje', 'MENSAJE PRIVADO CONFIDENCIAL (No publicar)');
        formDataPrivado.append('calificacion_estrellas', `${calificacion} de 5 estrellas`);

        const respuesta = await fetch(formulario.action || 'https://formspree.io/f/xbjnodgq', {
          method: 'POST',
          body: formDataPrivado,
          headers: { 'Accept': 'application/json' }
        });

        if (!respuesta.ok) throw new Error('Error al enviar correo.');

        mensajeFeedback.textContent = '¡Gracias por tu mensaje privado! Llegó correctamente al buzón del autor.';
        mensajeFeedback.className = 'form-feedback success';
      }

      botonEnvio.textContent = 'Enviado ✓';

      // Reseteo suave tras 3.5 segundos
      setTimeout(() => {
        formulario.reset();
        if (entradaCalificacion) entradaCalificacion.value = '5';
        botonesEstrella.forEach(btn => btn.classList.add('active'));
        mensajeFeedback.textContent = '';
        mensajeFeedback.className = 'form-feedback';
        botonEnvio.disabled = false;
        botonEnvio.textContent = 'Enviar';
      }, 3500);

    } catch (error) {
      console.error('Error al procesar el comentario:', error);
      mensajeFeedback.textContent = 'Hubo un inconveniente al enviar. Por favor intenta nuevamente.';
      mensajeFeedback.className = 'form-feedback error';
      botonEnvio.disabled = false;
      botonEnvio.textContent = 'Enviar';
    }
  });
});
