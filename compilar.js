const fs = require('fs');
const path = require('path');

function compilarCss() {
  const cssDir = path.join(__dirname, 'css');
  const cssSalida = path.join(cssDir, 'estilos.min.css');
  const ordenCss = [
    'variables.css',
    'layout.css',
    'nav-desktop.css',
    'nav-mobile.css',
    'secciones-1.css',
    'secciones-hipotesis.css',
    'secciones-oracle.css',
    'secciones-2.css',
    'secciones-linguis.css',
    'secciones-3.css',
    'secciones-notables.css',
    'heraldica.css',
    'footer.css',
    'componentes.css',
    'interacciones.css',
    'modales.css',
    'comentarios.css'
  ];

  console.log('Concatenando archivos CSS...');
  let cssConsolidado = '';

  for (const archivo of ordenCss) {
    const filePath = path.join(cssDir, archivo);
    if (fs.existsSync(filePath)) {
      const contenido = fs.readFileSync(filePath, 'utf8');
      cssConsolidado += `/* --- ${archivo} --- */\n` + contenido + '\n';
    }
  }

  fs.writeFileSync(cssSalida, cssConsolidado, 'utf8');
  console.log(`  CSS compilado correctamente en: ${cssSalida}`);
  return cssConsolidado;
}

function compilar() {
  const css = compilarCss();

  const partesDir = path.join(__dirname, 'src', 'partes');
  const salidaPath = path.join(__dirname, 'index.html');

  const ordenPartes = [
    'head.html',
    'nav.html',
    'hero.html',
    'etimologia.html',
    'timeline.html',
    'hipotesis.html',
    'oracle.html',
    'geo.html',
    'diaspora.html',
    'linguistics.html',
    'heraldica.html',
    'notables.html',
    'variants.html',
    'closing.html',
    'sources.html',
    'footer.html'
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
      if (archivo === 'head.html') {
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

compilar();

