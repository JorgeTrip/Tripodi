/**
 * GESTIÓN DE TEMAS - TRIPODI
 * Controla el cambio de tema claro/oscuro del sitio web.
 */

function toggleTheme() {
  const html = document.documentElement;
  const isDark = html.getAttribute('data-theme') === 'dark';
  const newTheme = isDark ? 'light' : 'dark';
  
  html.setAttribute('data-theme', newTheme);
  
  const icon = isDark ? '🌙' : '☀️';
  const label = isDark ? 'Modo oscuro' : 'Modo claro';
  
  // Actualizar íconos y textos en navbar normal y burbuja de móviles
  const ids = ['themeIcon', 'themeIconBubble'];
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = icon;
  });
  
  const labels = ['themeLabel', 'themeLabelBubble'];
  labels.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = label;
  });
  
  // Volver a dibujar los gráficos Canvas con los colores del nuevo tema
  if (typeof redrawCharts === 'function') {
    redrawCharts();
  }
}
