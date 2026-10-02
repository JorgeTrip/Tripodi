/**
 * ============================================================================
 * COMPILADOR MODULAR ESTÁTICO - TRIPODI
 * ============================================================================
 * Orquesta la concatenación automatizada de las hojas de estilo modulares (CSS)
 * y los fragmentos semánticos HTML (src/partes/) para producir los artefactos
 * unificados y optimizados de distribución ('index.html' y 'estilos.min.css').
 * 
 * ARQUITECTURA:
 * El desarrollo se mantiene desacoplado en archivos pequeños (<200 líneas),
 * mientras que en compilación se genera una sola entrega para optimizar métricas
 * de rendimiento web (Core Web Vitals, 0 peticiones HTTP críticas bloqueantes).
 */

const fs = require('fs');
const path = require('path');

/**
 * Concatena y empaqueta los submódulos CSS en un único archivo consolidado.
 * 
 * @returns {string} Código CSS completo compilado.
 */
function compilarCss() {
  const cssDir = path.join(__dirname, 'css');
  const cssSalida = path.join(cssDir, 'estilos.min.css');
  
  const ordenCss = [
    'variables.css',
    'maquetacion.css',
    'navegacionEscritorio.css',
    'navegacionMovil.css',
    'secciones1.css',
    'seccionHipotesis.css',
    'seccionOraculo.css',
    'secciones2.css',
    'seccionLinguistica.css',
    'secciones3.css',
    'seccionNotables.css',
    'heraldica.css',
    'piePagina.css',
    'componentes.css',
    'interacciones.css',
    'modales.css',
    'muroTestimonios.css',
    'comentarios.css'
  ];

  console.log('Concatenando módulos CSS...');
  let cssConsolidado = '';

  for (const archivo of ordenCss) {
    const filePath = path.join(cssDir, archivo);
    if (fs.existsSync(filePath)) {
      const contenido = fs.readFileSync(filePath, 'utf8');
      cssConsolidado += `/* --- ${archivo} --- */\n` + contenido + '\n';
    } else {
      console.warn(`[ADVERTENCIA] No se encontró el archivo CSS: ${archivo}`);
    }
  }

  fs.writeFileSync(cssSalida, cssConsolidado, 'utf8');
  console.log(`  CSS compilado correctamente en: ${cssSalida}`);
  return cssConsolidado;
}

/**
 * Une secuencialmente los fragmentos HTML inyectando el CSS compilado inline
 * en la cabecera para máxima velocidad de entrega inicial.
 * 
 * @returns {void}
 */
function compilarHtml() {
  const css = compilarCss();

  const partesDir = path.join(__dirname, 'src', 'partes');
  const salidaPath = path.join(__dirname, 'index.html');

  const ordenPartes = [
    'cabecera.html',
    'navegacion.html',
    'portada.html',
    'etimologia.html',
    'cronologia.html',
    'hipotesis.html',
    'oraculo.html',
    'geografia.html',
    'diaspora.html',
    'linguistica.html',
    'heraldica.html',
    'notables.html',
    'variantes.html',
    'cierre.html',
    'comentarios.html',
    'fuentes.html',
    'piePagina.html'
  ];

  console.log('\nIniciando compilación modular de HTML...');
  let htmlConsolidado = '';

  for (const archivo of ordenPartes) {
    const filePath = path.join(partesDir, archivo);
    if (!fs.existsSync(filePath)) {
      console.error(`Error crítico: No se encontró el fragmento HTML: ${archivo}`);
      process.exit(1);
    }
    
    try {
      console.log(`  Procesando fragmento: ${archivo}`);
      const contenidoOriginal = fs.readFileSync(filePath, 'utf8');
      const lineas = contenidoOriginal.split('\n').length;
      if (lineas > 200) {
        console.warn(`[ADVERTENCIA] El archivo ${archivo} tiene ${lineas} líneas, superando el límite de 200 líneas.`);
      }

      let contenido = contenidoOriginal;
      if (archivo === 'cabecera.html') {
        contenido = contenido.replace('<!-- CSS_INLINE_PLACEHOLDER -->', `<style>\n${css}\n</style>`);
      }
      
      htmlConsolidado += contenido + '\n';
    } catch (err) {
      console.error(`Error al leer el archivo ${archivo}:`, err);
      process.exit(1);
    }
  }

  try {
    fs.writeFileSync(salidaPath, htmlConsolidado, 'utf8');
    console.log(`\n¡Compilación exitosa! index.html generado en: ${salidaPath}`);
  } catch (err) {
    console.error('Error al escribir index.html:', err);
    process.exit(1);
  }
}

compilarHtml();
