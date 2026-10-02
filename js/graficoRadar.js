/**
 * ============================================================================
 * GRÁFICO POLIGONAL DE RADAR (CANVAS RADAR) - TRIPODI
 * ============================================================================
 * Renderiza el gráfico de tela de araña / radar para visualizar los cinco ejes
 * de la huella lingüística y cultural del apellido Tripodi, e implementa la
 * interacción de resaltado bidireccional al interactuar con las tarjetas del DOM.
 */

/**
 * Traza el gráfico de radar poligonal en el lienzo canvas `#radarCanvas`.
 * 
 * @param {number} [indiceResaltado] - Índice opcional del eje a enfatizar visualmente.
 * @returns {void}
 */
function dibujarGraficoRadar(indiceResaltado) {
  const canvas = document.getElementById('radarCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  const ancho = canvas.width;
  const alto = canvas.height;
  const centroX = ancho / 2;
  const centroY = alto / 2;
  const etiquetas = ['Raíz\ngriega pura', 'Resiliencia\nhistórica', 'Influencia\nbizantina', 'Fonética\ndialectal', 'Latinización'];
  const valores = [0.95, 0.90, 0.70, 0.65, 0.20];
  const cantidadEjes = etiquetas.length;
  const radioMaximo = ancho * 0.36;
  
  const esOscuro = document.documentElement.getAttribute('data-theme') !== 'light';
  const colorOro = '#C9A84C';
  const colorRejilla = esOscuro ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.1)';
  const colorRelleno = esOscuro ? 'rgba(201,168,76,.18)' : 'rgba(201,168,76,.22)';
  const colorEtiquetas = esOscuro ? 'rgba(255,255,255,.7)' : 'rgba(0,0,0,.6)';

  function calcularPunto(angulo, radio) {
    return { x: centroX + radio * Math.sin(angulo), y: centroY - radio * Math.cos(angulo) };
  }

  ctx.clearRect(0, 0, ancho, alto);

  // 1. Anillos concéntricos
  for (let anillo = 1; anillo <= 4; anillo++) {
    ctx.beginPath();
    for (let i = 0; i < cantidadEjes; i++) {
      const p = calcularPunto(2 * Math.PI * i / cantidadEjes, radioMaximo * anillo / 4);
      i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
    }
    ctx.closePath();
    ctx.strokeStyle = colorRejilla;
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // 2. Ejes radiales
  for (let i = 0; i < cantidadEjes; i++) {
    const p = calcularPunto(2 * Math.PI * i / cantidadEjes, radioMaximo);
    ctx.beginPath();
    ctx.moveTo(centroX, centroY);
    ctx.lineTo(p.x, p.y);
    ctx.strokeStyle = colorRejilla;
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // 3. Polígono de datos
  ctx.beginPath();
  for (let i = 0; i < cantidadEjes; i++) {
    const p = calcularPunto(2 * Math.PI * i / cantidadEjes, radioMaximo * valores[i]);
    i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
  }
  ctx.closePath();
  ctx.fillStyle = colorRelleno;
  ctx.fill();
  ctx.strokeStyle = colorOro;
  ctx.lineWidth = 2;
  ctx.stroke();

  // 4. Nodos de datos en cada vértice
  for (let i = 0; i < cantidadEjes; i++) {
    const p = calcularPunto(2 * Math.PI * i / cantidadEjes, radioMaximo * valores[i]);
    const estaResaltado = i === indiceResaltado;
    ctx.beginPath();
    ctx.arc(p.x, p.y, estaResaltado ? 7 : 4, 0, 2 * Math.PI);
    ctx.fillStyle = estaResaltado ? colorOro : (esOscuro ? '#1a1a10' : '#fff');
    ctx.fill();
    ctx.strokeStyle = colorOro;
    ctx.lineWidth = estaResaltado ? 3 : 2;
    ctx.stroke();

    if (estaResaltado) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 14, 0, 2 * Math.PI);
      ctx.strokeStyle = 'rgba(201,168,76,.4)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }

  // 5. Etiquetas de texto perimetrales
  const rellenoEtiquetas = [18, 18, 18, 18, 18];
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  etiquetas.forEach((etiqueta, i) => {
    const angulo = 2 * Math.PI * i / cantidadEjes;
    const p = calcularPunto(angulo, radioMaximo + rellenoEtiquetas[i]);
    ctx.font = `${i === indiceResaltado ? 'bold ' : ''}11px Inter, sans-serif`;
    ctx.fillStyle = i === indiceResaltado ? colorOro : colorEtiquetas;
    const partes = etiqueta.split('\n');
    partes.forEach((parte, j) => {
      ctx.fillText(parte, p.x, p.y + (j - (partes.length - 1) / 2) * 13);
    });
  });
}

const drawRadar = dibujarGraficoRadar;

// Sincronización del gráfico de radar con la interacción de las tarjetas lingüísticas
(function() {
  document.addEventListener('DOMContentLoaded', () => {
    const tarjetas = document.querySelectorAll('.lang-attr[data-radar-idx]');
    if (!tarjetas.length) return;
    let temporizadorRestablecer = null;

    tarjetas.forEach(tarjeta => {
      const indice = parseInt(tarjeta.getAttribute('data-radar-idx'), 10);
      if (Number.isNaN(indice)) return;

      const resaltar = () => { tarjeta.classList.add('radar-highlight'); dibujarGraficoRadar(indice); };
      const restablecer = () => { tarjeta.classList.remove('radar-highlight'); dibujarGraficoRadar(); };
      const resaltarMovil = () => {
        if (window.innerWidth > 768) return;
        resaltar();
        clearTimeout(temporizadorRestablecer);
        temporizadorRestablecer = setTimeout(restablecer, 900);
      };

      tarjeta.addEventListener('mouseenter', resaltar);
      tarjeta.addEventListener('mouseleave', restablecer);
      tarjeta.addEventListener('focus', resaltar);
      tarjeta.addEventListener('blur', restablecer);
      tarjeta.addEventListener('click', resaltarMovil);
    });
  });
})();
