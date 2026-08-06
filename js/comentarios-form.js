/* ============================================================================
   FORMULARIO DE COMENTARIOS - TRIPODI
   ============================================================================
   Maneja el envío del formulario de comentarios con Formspree
*/

document.addEventListener('DOMContentLoaded', function() {
  const comentariosForm = document.querySelector('.comentarios-form');
  const formFeedback = document.getElementById('formFeedback');
  const formSubmit = document.querySelector('.form-submit');

  if (!comentariosForm) return;

  comentariosForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Validar campos obligatorios
    const nombre = document.getElementById('nombre').value.trim();
    const comentario = document.getElementById('comentario').value.trim();
    
    if (!nombre || !comentario) {
      formFeedback.textContent = 'Por favor completa los campos obligatorios (nombre y comentario)';
      formFeedback.classList.add('error');
      formFeedback.classList.remove('success');
      return;
    }

    // Deshabilitar botón durante envío
    formSubmit.disabled = true;
    formSubmit.textContent = 'Enviando...';

    // Enviar formulario a Formspree
    const formData = new FormData(this);
    const formAction = this.action;

    fetch(formAction, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    }).then(response => {
      if (response.ok) {
        // Mostrar mensaje de éxito
        formFeedback.textContent = '¡Gracias por tu comentario! Lo revisaremos pronto.';
        formFeedback.classList.add('success');
        formFeedback.classList.remove('error');
        formSubmit.textContent = 'Enviado ✓';
        
        // Resetear formulario después de 3 segundos
        setTimeout(() => {
          comentariosForm.reset();
          formFeedback.textContent = '';
          formSubmit.disabled = false;
          formSubmit.textContent = 'Enviar comentario';
        }, 3000);
      } else {
        throw new Error('Error en el envío');
      }
    }).catch(error => {
      console.error('Error al enviar comentario:', error);
      formFeedback.textContent = 'Error al enviar. Intenta nuevamente.';
      formFeedback.classList.add('error');
      formFeedback.classList.remove('success');
      formSubmit.disabled = false;
      formSubmit.textContent = 'Enviar comentario';
    });
  });
});
