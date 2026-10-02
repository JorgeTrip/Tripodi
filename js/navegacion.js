/**
 * ============================================================================
 * CONTROL DE NAVEGACIÓN Y COMPORTAMIENTO INTERACTIVO - TRIPODI
 * ============================================================================
 * Gestiona el menú superior de escritorio, el menú burbuja flotante para móviles,
 * el botón flotante de retorno al inicio (FAB) y los observadores de intersección
 * para animaciones suaves (fade-up) y resaltado activo de la sección visible (scroll spy).
 */

/**
 * Desplaza suavemente la ventana hacia la parte superior del documento.
 * Utiliza comportamiento nativo 'smooth' para una experiencia fluida sin dependencias.
 * 
 * @returns {void}
 */
function desplazarAlInicio() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Alias de retrocompatibilidad
const scrollToTop = desplazarAlInicio;

/**
 * Conmuta el estado abierto/cerrado del menú burbuja responsivo en pantallas móviles.
 * Sincroniza el atributo de accesibilidad 'aria-expanded' y establece un listener
 * para permitir cerrar el menú pulsando fuera de su contenedor.
 * 
 * @returns {void}
 */
function alternarMenuBurbuja() {
  const burbuja = document.getElementById('navBubble');
  if (!burbuja) return;
  const estaAbierto = burbuja.classList.toggle('open');
  burbuja.setAttribute('aria-expanded', String(estaAbierto));
  if (estaAbierto) {
    setTimeout(() => {
      document.addEventListener('click', cerrarBurbujaAfuera, { once: true });
    }, 0);
  }
}

const toggleNavBubble = alternarMenuBurbuja;

/**
 * Evalúa si el clic ocurrió fuera del menú burbuja y ejecuta su cierre si corresponde.
 * 
 * @param {MouseEvent} evento - Evento de clic capturado en el documento.
 * @returns {void}
 */
function cerrarBurbujaAfuera(evento) {
  const burbuja = document.getElementById('navBubble');
  if (burbuja && !burbuja.contains(evento.target)) {
    cerrarMenuBurbuja();
  }
}

/**
 * Fuerza el repliegue del menú burbuja y actualiza el estado ARIA a inactivo.
 * 
 * @returns {void}
 */
function cerrarMenuBurbuja() {
  const burbuja = document.getElementById('navBubble');
  if (burbuja) {
    burbuja.classList.remove('open');
    burbuja.setAttribute('aria-expanded', 'false');
  }
}

(function() {
  const barraNavegacion = document.getElementById('mainNav');
  const burbuja = document.getElementById('navBubble');
  const botonSubir = document.getElementById('backToTopFab');
  if (!barraNavegacion || !burbuja || !botonSubir) return;

  const consultaMovil = window.matchMedia('(max-width: 768px)');
  let sincronizacionPendiente = false;

  /**
   * Actualiza las clases visuales de los menús según la posición vertical de scroll.
   * Evita reflows forzados coordinando cambios de clase en un solo ciclo de renderizado.
   * 
   * @returns {void}
   */
  function actualizarNavegacion() {
    const desplazamientoVertical = window.scrollY;
    const enCabecera = desplazamientoVertical < 80;

    // Dispositivos móviles: siempre menú burbuja y botón flotante tras superar 300px
    if (consultaMovil.matches) {
      barraNavegacion.classList.add('nav-hidden');
      burbuja.classList.add('visible');
      if (desplazamientoVertical > 300) {
        botonSubir.classList.add('visible');
      } else {
        botonSubir.classList.remove('visible');
      }
      sincronizacionPendiente = false;
      return;
    }

    // Pantallas de escritorio
    if (enCabecera) {
      barraNavegacion.classList.remove('nav-hidden');
      burbuja.classList.remove('visible');
      burbuja.classList.remove('open');
      botonSubir.classList.remove('visible');
    } else {
      barraNavegacion.classList.add('nav-hidden');
      burbuja.classList.add('visible');
      botonSubir.classList.add('visible');
    }

    sincronizacionPendiente = false;
  }

  // IntersectionObserver para detectar qué sección está en el viewport (Scroll Spy eficiente)
  document.addEventListener('DOMContentLoaded', () => {
    const enlacesNavegacion = document.querySelectorAll('.nav-link');
    const observadorSecciones = new IntersectionObserver((entradas) => {
      entradas.forEach(entrada => {
        if (entrada.isIntersecting) {
          const id = entrada.target.getAttribute('id');
          enlacesNavegacion.forEach(enlace => {
            enlace.classList.toggle('active-section', enlace.getAttribute('href') === '#' + id);
          });
        }
      });
    }, { rootMargin: '-20% 0px -60% 0px' });

    document.querySelectorAll('section[id]').forEach(seccion => observadorSecciones.observe(seccion));
  });

  // Listener pasivo con requestAnimationFrame para garantizar 60fps en desplazamientos rápidos
  window.addEventListener('scroll', () => {
    if (!sincronizacionPendiente) {
      requestAnimationFrame(actualizarNavegacion);
      sincronizacionPendiente = true;
    }
  }, { passive: true });
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', actualizarNavegacion);
  } else {
    actualizarNavegacion();
  }

  // Desplazamiento suave para enlaces ancla
  document.querySelectorAll('.nav-link, .bubble-link').forEach(enlace => {
    enlace.addEventListener('click', evento => {
      evento.stopPropagation();
      const destino = enlace.getAttribute('href');
      if (destino && destino.startsWith('#')) {
        evento.preventDefault();
        const elementoDestino = document.querySelector(destino);
        if (elementoDestino) {
          elementoDestino.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
      cerrarMenuBurbuja();
    });
  });
})();

// IntersectionObserver para animaciones de entrada progresiva (fade-up y barras de progreso)
document.addEventListener('DOMContentLoaded', () => {
  const observadorAnimaciones = new IntersectionObserver(entradas => {
    entradas.forEach(entrada => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.fade-up, .tl-item, .flow-stage, .hypo-card').forEach(elemento => {
    observadorAnimaciones.observe(elemento);
  });

  // Observador para activar la animación de las barras geográficas una sola vez
  const observadorGeografia = new IntersectionObserver(entradas => {
    entradas.forEach(entrada => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add('visible');
        observadorGeografia.unobserve(entrada.target);
      }
    });
  }, { threshold: 0.2 });

  const seccionGeografia = document.getElementById('geo') || document.getElementById('geoSection');
  if (seccionGeografia) {
    observadorGeografia.observe(seccionGeografia);
  }
});
