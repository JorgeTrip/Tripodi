/**
 * ============================================================================
 * CONTROL CENTRALIZADO DE TOOLTIPS - TRIPODI
 * ============================================================================
 * Implementa un mecanismo singleton de tooltips interactivos mediante un único
 * elemento flotante en el body. Esta decisión técnica previene la creación de
 * decenas de nodos redundantes en el árbol DOM, reduciendo el consumo de memoria
 * y acelerando el cálculo del layout en dispositivos móviles y de escritorio.
 */

(function() {
  // Elemento flotante único para desplegar el contenido de cualquier tooltip activo
  const burbujaTooltip = document.createElement('div');
  burbujaTooltip.id = 'ttBubble';
  document.body.appendChild(burbujaTooltip);

  let temporizadorOcultar = null;

  /**
   * Muestra la burbuja de tooltip asociada al elemento interactivo recibido.
   * Cancela temporizadores de ocultamiento pendientes para evitar parpadeos visuales.
   * 
   * @param {HTMLElement} elemento - Elemento DOM disparador con atributo 'data-tt'.
   * @returns {void}
   */
  function mostrarTooltip(elemento) {
    clearTimeout(temporizadorOcultar);
    const definicion = elemento.getAttribute('data-tt');
    if (!definicion) return;
    
    burbujaTooltip.textContent = definicion;
    burbujaTooltip.classList.add('tt-visible');
    posicionarTooltip(elemento);
  }

  /**
   * Programa el ocultamiento suave de la burbuja con un pequeño retraso de 120ms
   * para permitir transiciones fluidas de cursor o toques sin cierres abruptos.
   * 
   * @returns {void}
   */
  function ocultarTooltip() {
    temporizadorOcultar = setTimeout(() => burbujaTooltip.classList.remove('tt-visible'), 120);
  }

  /**
   * Calcula las coordenadas absolutas de la burbuja respecto al viewport,
   * aplicando límites de margen para impedir que el contenido se desborde fuera de la pantalla.
   * 
   * @param {HTMLElement} elemento - Elemento de referencia posicional.
   * @returns {void}
   */
  function posicionarTooltip(elemento) {
    const rectangulo = elemento.getBoundingClientRect();
    const anchoBurbuja = 260;
    const margenSeguridad = 8;
    
    let posicionIzquierda = rectangulo.left + rectangulo.width / 2 - anchoBurbuja / 2;
    posicionIzquierda = Math.max(margenSeguridad, Math.min(posicionIzquierda, window.innerWidth - anchoBurbuja - margenSeguridad));
    const posicionSuperior = rectangulo.top - 8;
    
    burbujaTooltip.style.cssText = `left:${posicionIzquierda}px;top:${posicionSuperior}px;transform:translateY(-100%);max-width:${anchoBurbuja}px;`;
  }

  /**
   * Vincula los oyentes de eventos táctiles, teclado y puntero a todos los elementos con clase '.tt'.
   * Incorpora atributos de accesibilidad ARIA (role='note' y tabindex='0') para lectores de pantalla.
   * 
   * @returns {void}
   */
  function inicializarTooltips() {
    document.querySelectorAll('.tt').forEach(elemento => {
      elemento.addEventListener('mouseenter', () => mostrarTooltip(elemento));
      elemento.addEventListener('mouseleave', ocultarTooltip);
      elemento.addEventListener('focus', () => mostrarTooltip(elemento));
      elemento.addEventListener('blur', ocultarTooltip);
      
      // Soporte para interacción táctil en pantallas móviles
      elemento.addEventListener('click', evento => {
        evento.stopPropagation();
        if (burbujaTooltip.classList.contains('tt-visible') && burbujaTooltip._ultimoElemento === elemento) {
          ocultarTooltip();
        } else {
          burbujaTooltip._ultimoElemento = elemento;
          mostrarTooltip(elemento);
        }
      });
      elemento.setAttribute('tabindex', '0');
      elemento.setAttribute('role', 'note');
    });
    
    // Cierre al pulsar en cualquier otra área neutra del documento
    document.addEventListener('click', () => burbujaTooltip.classList.remove('tt-visible'));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarTooltips);
  } else {
    inicializarTooltips();
  }
})();
