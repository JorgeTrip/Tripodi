/**
 * ============================================================================
 * ORQUESTADOR DE GRÁFICOS CANVAS - TRIPODI
 * ============================================================================
 * Coordina la inicialización diferida y reactiva de los gráficos Canvas
 * (Donut de Teorías y Radar Lingüístico), sincronizando su ciclo de vida
 * con la visibilidad del viewport mediante IntersectionObserver.
 */

/**
 * Redibuja simultáneamente todos los lienzos de datos activos.
 * Invocado ante cambios de tema de color (modo oscuro/claro) o redimensionamiento.
 * 
 * @returns {void}
 */
function redibujarGraficos() {
  if (typeof dibujarGraficoDonut === 'function') dibujarGraficoDonut();
  if (typeof dibujarGraficoRadar === 'function') dibujarGraficoRadar();
}

// Alias de retrocompatibilidad
const redrawCharts = redibujarGraficos;

window.addEventListener('load', redibujarGraficos);

// Observador para activar la renderización del radar cuando entra al viewport
document.addEventListener('DOMContentLoaded', () => {
  const observadorRadar = new IntersectionObserver(entradas => {
    entradas.forEach(entrada => {
      if (entrada.isIntersecting) {
        if (typeof dibujarGraficoRadar === 'function') dibujarGraficoRadar();
        observadorRadar.unobserve(entrada.target);
      }
    });
  }, { threshold: 0.1 });
  
  const contenedorRadar = document.getElementById('radarWrap');
  if (contenedorRadar) observadorRadar.observe(contenedorRadar);
});
