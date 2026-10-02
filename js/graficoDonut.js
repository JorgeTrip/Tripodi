/**
 * ============================================================================
 * GRÁFICO CIRCULAR DE HIPÓTESIS (CANVAS DONUT) - TRIPODI
 * ============================================================================
 * Genera el gráfico tipo Donut en un elemento <canvas> nativo para representar
 * la distribución porcentual de probabilidad entre las 3 hipótesis de origen:
 * Ocupacional (45%), Topográfica (35%) y Votiva / Apolínea (20%).
 */

/**
 * Obtiene la paleta de colores cromática adecuada al tema visual activo (oscuro o claro).
 * 
 * @param {string} nombre - Clave del color deseado ('texto', 'atenuado', 'rejilla', 'fondo').
 * @returns {string} Código de color hexadecimal o rgba adaptado al contraste.
 */
function obtenerColorDonut(nombre) {
  const esOscuro = document.documentElement.getAttribute('data-theme') === 'dark';
  const mapaColores = {
    texto: esOscuro ? '#EDE8DF' : '#1C1710',
    atenuado: esOscuro ? '#9A9180' : '#6B5E4A',
    rejilla: esOscuro ? 'rgba(201,168,76,0.15)' : 'rgba(100,70,30,0.12)',
    fondo: esOscuro ? 'rgba(33,30,24,0.92)' : 'rgba(255,255,255,0.95)'
  };
  return mapaColores[nombre];
}

/**
 * Dibuja los arcos proporcionales y el núcleo central del gráfico circular.
 * 
 * @returns {void}
 */
function dibujarGraficoDonut() {
  const canvas = document.getElementById('donutCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, 200, 200);
  
  const datosPorcentuales = [45, 35, 20];
  const coloresTeorias = ['#C9A84C', '#B85C2A', '#2A5B7A'];
  const total = 100;
  const centroX = 100;
  const centroY = 100;
  const radioExterior = 85;
  const radioInterior = 52;
  
  let anguloInicial = -Math.PI / 2;
  datosPorcentuales.forEach((valor, indice) => {
    const anguloPorcion = (valor / total) * 2 * Math.PI;
    ctx.beginPath();
    ctx.moveTo(centroX, centroY);
    ctx.arc(centroX, centroY, radioExterior, anguloInicial, anguloInicial + anguloPorcion);
    ctx.closePath();
    ctx.fillStyle = coloresTeorias[indice];
    ctx.fill();
    anguloInicial += anguloPorcion;
  });
  
  // Dibujar el orificio central para crear el estilo Donut
  ctx.beginPath();
  ctx.arc(centroX, centroY, radioInterior, 0, 2 * Math.PI);
  ctx.fillStyle = obtenerColorDonut('fondo');
  ctx.fill();
  
  // Tipografía y valor central
  ctx.fillStyle = '#C9A84C';
  ctx.font = 'bold 18px Cinzel, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('3', centroX, centroY - 8);
  
  ctx.fillStyle = obtenerColorDonut('atenuado');
  ctx.font = '10px Inter, sans-serif';
  ctx.fillText('TEORÍAS', centroX, centroY + 10);
}

// Alias de retrocompatibilidad
const drawDonut = dibujarGraficoDonut;
