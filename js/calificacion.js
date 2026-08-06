/* ============================================================================
   SISTEMA DE CALIFICACIÓN CON ESTRELLAS - TRIPODI
   ============================================================================
   Maneja la interacción con el sistema de calificación de 5 estrellas
*/

document.addEventListener('DOMContentLoaded', function() {
  const starButtons = document.querySelectorAll('.star-btn');
  const ratingInput = document.getElementById('ratingInput');
  const ratingFeedback = document.getElementById('ratingFeedback');
  const ratingSubmit = document.getElementById('ratingSubmit');
  const ratingForm = document.querySelector('.rating-form');

  // Mapeo de calificaciones a texto
  const ratingTexts = {
    1: 'Necesita mejoras',
    2: 'Regular',
    3: 'Buena',
    4: 'Muy buena',
    5: 'Excelente'
  };

  // Manejar clic en estrellas
  starButtons.forEach(button => {
    button.addEventListener('click', function() {
      const rating = this.getAttribute('data-rating');
      
      // Actualizar input oculto
      ratingInput.value = rating;
      
      // Actualizar estado visual de estrellas
      starButtons.forEach(btn => {
        const btnRating = btn.getAttribute('data-rating');
        if (btnRating <= rating) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
      
      // Mostrar feedback
      ratingFeedback.textContent = ratingTexts[rating];
      ratingFeedback.classList.add('success');
      
      // Habilitar botón de envío
      ratingSubmit.disabled = false;
    });

    // Efecto hover
    button.addEventListener('mouseenter', function() {
      const rating = this.getAttribute('data-rating');
      starButtons.forEach(btn => {
        const btnRating = btn.getAttribute('data-rating');
        if (btnRating <= rating) {
          btn.style.color = 'var(--gold-lt)';
        }
      });
    });

    button.addEventListener('mouseleave', function() {
      const currentRating = ratingInput.value;
      starButtons.forEach(btn => {
        const btnRating = btn.getAttribute('data-rating');
        if (!currentRating || btnRating > currentRating) {
          btn.style.color = '';
        }
      });
    });
  });

  // Manejar envío del formulario
  ratingForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const rating = ratingInput.value;
    if (!rating) {
      ratingFeedback.textContent = 'Por favor selecciona una calificación';
      ratingFeedback.classList.remove('success');
      return;
    }

    // Mostrar mensaje de éxito
    ratingFeedback.textContent = '¡Gracias por tu calificación!';
    ratingFeedback.classList.add('success');
    ratingSubmit.textContent = 'Enviado ✓';
    ratingSubmit.disabled = true;

    // Enviar formulario a Netlify
    const formData = new FormData(this);
    fetch('/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams(formData).toString()
    }).then(() => {
      // Resetear formulario después de 2 segundos
      setTimeout(() => {
        ratingForm.reset();
        ratingInput.value = '';
        starButtons.forEach(btn => {
          btn.classList.remove('active');
          btn.style.color = '';
        });
        ratingFeedback.textContent = '';
        ratingSubmit.textContent = 'Enviar calificación';
      }, 2000);
    }).catch(error => {
      console.error('Error al enviar calificación:', error);
      ratingFeedback.textContent = 'Error al enviar. Intenta nuevamente.';
      ratingFeedback.classList.remove('success');
      ratingSubmit.disabled = false;
      ratingSubmit.textContent = 'Enviar calificación';
    });
  });
});
