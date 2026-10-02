/**
 * Servidor Web Local y de Red de Área Local (LAN) para Tripodi Web.
 * Desarrollado con módulos nativos de Node.js sin dependencias externas.
 * Soporta Range requests para reproducción fluida de audio y protección de rutas.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PUERTO = process.env.PORT || 8080;
const DIRECTORIO_RAIZ = path.resolve(__dirname, '..');

const TIPOS_MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp3': 'audio/mpeg',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8'
};

/**
 * Detecta y devuelve las direcciones IPv4 de la red local.
 * Prioriza adaptadores de red físicos sobre virtuales.
 * @returns {Array<{ip: string, nombre: string, esVirtual: boolean}>}
 */
function obtenerIpsRedLocal() {
  const interfaces = os.networkInterfaces();
  const ips = [];

  for (const [nombre, detalles] of Object.entries(interfaces)) {
    if (!detalles) continue;
    for (const det of detalles) {
      if ((det.family === 'IPv4' || det.family === 4) && !det.internal) {
        const esVirtual = /vethernet|virtual|vbox|vmware/i.test(nombre);
        ips.push({ ip: det.address, nombre, esVirtual });
      }
    }
  }

  // Se priorizan conexiones físicas (Wi-Fi, Ethernet) al inicio
  ips.sort((a, b) => (a.esVirtual === b.esVirtual ? 0 : a.esVirtual ? 1 : -1));
  return ips;
}

/**
 * Sirve un archivo estático con cabeceras MIME y soporte para audio streaming.
 * @param {string} rutaArchivo - Ruta absoluta del archivo.
 * @param {http.ServerResponse} res - Objeto de respuesta HTTP.
 * @param {http.IncomingMessage} req - Objeto de petición HTTP.
 */
function servirArchivo(rutaArchivo, res, req) {
  fs.stat(rutaArchivo, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 No Encontrado');
      return;
    }

    const ext = path.extname(rutaArchivo).toLowerCase();
    const tipoMime = TIPOS_MIME[ext] || 'application/octet-stream';
    const rango = req.headers.range;

    // Soporte para Range requests en audio para permitir adelantar/retrasar
    if (rango && ext === '.mp3') {
      const partes = rango.replace(/bytes=/, '').split('-');
      const inicio = parseInt(partes[0], 10);
      const fin = partes[1] ? parseInt(partes[1], 10) : stats.size - 1;
      const longitudChunk = fin - inicio + 1;

      res.writeHead(206, {
        'Content-Range': `bytes ${inicio}-${fin}/${stats.size}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': longitudChunk,
        'Content-Type': tipoMime
      });
      fs.createReadStream(rutaArchivo, { start: inicio, end: fin }).pipe(res);
      return;
    }

    res.writeHead(200, {
      'Content-Length': stats.size,
      'Content-Type': tipoMime,
      'Accept-Ranges': 'bytes'
    });
    fs.createReadStream(rutaArchivo).pipe(res);
  });
}

const servidor = http.createServer((req, res) => {
  const urlLimpia = decodeURIComponent(req.url.split('?')[0]);
  const rutaRelativa = urlLimpia === '/' ? 'index.html' : urlLimpia.replace(/^\/+/, '');
  const rutaAbsoluta = path.resolve(DIRECTORIO_RAIZ, rutaRelativa);

  // Prevención de ataques de Directory Traversal
  if (!rutaAbsoluta.startsWith(DIRECTORIO_RAIZ)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('403 Prohibido');
    return;
  }

  fs.stat(rutaAbsoluta, (err, stats) => {
    if (!err && stats.isDirectory()) {
      servirArchivo(path.join(rutaAbsoluta, 'index.html'), res, req);
    } else {
      servirArchivo(rutaAbsoluta, res, req);
    }
  });
});

servidor.listen(PUERTO, '0.0.0.0', () => {
  const ips = obtenerIpsRedLocal();
  console.log('\n=======================================================');
  console.log('  🏛️  Tripodi Web - Servidor de Desarrollo Activo');
  console.log('=======================================================');
  console.log(`\n  💻 Acceso Local:      http://localhost:${PUERTO}/`);

  if (ips.length > 0) {
    console.log(`  📱 Acceso Red (LAN):  http://${ips[0].ip}:${PUERTO}/`);
    if (ips.length > 1) {
      console.log('\n     Otras interfaces detectadas:');
      for (let i = 1; i < ips.length; i++) {
        console.log(`     - http://${ips[i].ip}:${PUERTO}/ (${ips[i].nombre})`);
      }
    }
  }
  console.log('\n  💡 Tip: Puedes ingresar desde dispositivos conectados al mismo Wi-Fi.');
  console.log('  🛑 Para detener el servidor presiona Ctrl + C.\n');
  console.log('-------------------------------------------------------');
});
