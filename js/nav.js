/**
 * NAVEGACIÓN Y COMPORTAMIENTO INTERACTIVO - TRIPODI
 * Maneja el navbar, el botón burbuja, el back-to-top FAB y los Intersection Observers para las animaciones.
 */

// Función para volver al inicio de la página de forma suave
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Control del menú burbuja responsivo
function toggleNavBubble() {
  const bubble = document.getElementById('navBubble');
  if (!bubble) return;
  const isOpen = bubble.classList.toggle('open');
  bubble.setAttribute('aria-expanded', isOpen);
  if (isOpen) {
    // Cerrar al hacer clic fuera del menú
    setTimeout(() => {
      document.addEventListener('click', closeBubbleOutside, { once: true });
    }, 0);
  }
}

function closeBubbleOutside(e) {
  const bubble = document.getElementById('navBubble');
  if (bubble && !bubble.contains(e.target)) {
    closeBubbleMenu();
  }
}

function closeBubbleMenu() {
  const bubble = document.getElementById('navBubble');
  if (bubble) {
    bubble.classList.remove('open');
    bubble.setAttribute('aria-expanded', 'false');
  }
}

// Inicialización de la lógica de navegación
(function() {
  const nav = document.getElementById('mainNav');
  const bubble = document.getElementById('navBubble');
  const backToTopFab = document.getElementById('backToTopFab');
  if (!nav || !bubble || !backToTopFab) return;

  let ticking = false;

  function updateNav() {
    const y = window.scrollY;
    const atTop = y < 80;

    // Dispositivos móviles (ancho de pantalla <= 768px)
    if (window.innerWidth <= 768) {
      nav.classList.add('nav-hidden');
      bubble.classList.add('visible');
      if (y > 300) {
        backToTopFab.classList.add('visible');
      } else {
        backToTopFab.classList.remove('visible');
      }
      ticking = false;
      return;
    }

    // Pantallas de escritorio
    if (atTop) {
      nav.classList.remove('nav-hidden');
      bubble.classList.remove('visible');
      bubble.classList.remove('open');
      backToTopFab.classList.remove('visible');
    } else {
      nav.classList.add('nav-hidden');
      bubble.classList.add('visible');
      backToTopFab.classList.add('visible');
    }

    // Resaltar sección activa en el menú de navegación
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) {
        current = s.id;
      }
    });
    
    document.querySelectorAll('.nav-link').forEach(a => {
      a.classList.toggle('active-section', a.getAttribute('href') === '#' + current);
    });

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateNav);
      ticking = true;
    }
  }, { passive: true });
  
  function initNav() {
    updateNav();
    setTimeout(updateNav, 100);
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNav);
  } else {
    initNav();
  }

  // Desplazamiento suave para enlaces
  document.querySelectorAll('.nav-link, .bubble-link').forEach(a => {
    a.addEventListener('click', e => {
      e.stopPropagation();
      const href = a.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
      closeBubbleMenu();
    });
  });
})();

// Intersection Observers para las animaciones y carga reactiva de barras
document.addEventListener('DOMContentLoaded', () => {
  const animObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.fade-up, .tl-item, .flow-stage, .hypo-card').forEach(el => {
    animObserver.observe(el);
  });

  // Observer específico para la sección geográfica (cargar las barras animadas)
  const geoObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        geoObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });

  const geoSectionEl = document.getElementById('geo') || document.getElementById('geoSection');
  if (geoSectionEl) {
    geoObs.observe(geoSectionEl);
  }
});
