const fs = require('fs');
const path = require('path');

function compilar() {
  const partesDir = path.join(__dirname, 'src', 'partes');
  const salidaPath = path.join(__dirname, 'index.html');

  // Orden exacto de ensamblado del documento HTML
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

  console.log('Iniciando compilación modular de HTML...');
  let htmlConsolidado = '';

  for (const archivo of ordenPartes) {
    const filePath = path.join(partesDir, archivo);
    if (!fs.existsSync(filePath)) {
      console.error(`Error crítico: No se encontró el fragmento HTML: ${archivo} en la ruta ${filePath}`);
      process.exit(1);
    }
    
    try {
      console.log(`  Procesando fragmento: ${archivo}`);
      const contenido = fs.readFileSync(filePath, 'utf8');
      
      // Validar longitud del fragmento para cumplir las reglas de Jorge (< 200 líneas)
      const lineas = contenido.split('\n').length;
      if (lineas > 200) {
        console.warn(`[ADVERTENCIA] El archivo ${archivo} tiene ${lineas} líneas, superando el límite ideal de 200 líneas.`);
      }
      
      htmlConsolidado += contenido + '\n';
    } catch (err) {
      console.error(`Error al leer el archivo ${archivo}:`, err);
      process.exit(1);
    }
  }

  try {
    fs.writeFileSync(salidaPath, htmlConsolidado, 'utf8');
    console.log(`\n¡Compilación exitosa! index.html generado correctamente en: ${salidaPath}`);
  } catch (err) {
    console.error('Error al escribir el archivo index.html consolidado:', err);
    process.exit(1);
  }
}

compilar();
