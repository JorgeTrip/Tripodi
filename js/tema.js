/**
 * ============================================================================
 * GESTIÓN DE TEMAS VISUALES - TRIPODI
 * ============================================================================
 * Controla la conmutación entre el tema oscuro (predeterminado por diseño)
 * y el tema claro, persistiendo los atributos en el nodo raíz del documento
 * y notificando a los motores de renderizado Canvas para sincronizar colores.
 */

/**
 * Conmuta el tema visual del documento HTML entre 'dark' y 'light'.
 * Actualiza los íconos de la interfaz (navbar de escritorio y menú burbuja móvil)
 * y dispara el redibujado de los gráficos Canvas si se encuentran presentes.
 * 
 * @returns {void}
 */
function alternarTema() {
  const elementoHtml = document.documentElement;
  const esOscuro = elementoHtml.getAttribute('data-theme') === 'dark';
  const nuevoTema = esOscuro ? 'light' : 'dark';
  
  elementoHtml.setAttribute('data-theme', nuevoTema);
  
  const icono = esOscuro ? '🌙' : '☀️';
  const etiqueta = esOscuro ? 'Modo oscuro' : 'Modo claro';
  
  // Sincronizar íconos en la barra de escritorio y en la botonera flotante móvil
  const identificadoresIconos = ['themeIcon', 'themeIconBubble'];
  identificadoresIconos.forEach(id => {
    const elemento = document.getElementById(id);
    if (elemento) elemento.textContent = icono;
  });
  
  // Sincronizar etiquetas de texto accesibles
  const identificadoresEtiquetas = ['themeLabel', 'themeLabelBubble'];
  identificadoresEtiquetas.forEach(id => {
    const elemento = document.getElementById(id);
    if (elemento) elemento.textContent = etiqueta;
  });
  
  // Re-renderizar los gráficos interactivos Canvas con la nueva paleta de contraste
  if (typeof redibujarGraficos === 'function') {
    redibujarGraficos();
  }
}
