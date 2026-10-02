/**
 * ============================================================================
 * REPRODUCCIÓN DE AUDIO - TRIPODI
 * ============================================================================
 * Módulo encargado de gestionar la reproducción de archivos de audio nativos
 * en el navegador para ilustrar la pronunciación fonética griega y latina
 * de la raíz del apellido Tripodi.
 */

/**
 * Reproduce un archivo de audio a partir de su ruta relativa o absoluta.
 * Emplea la API HTML5 Audio para evitar dependencias externas pesadas y garantizar
 * compatibilidad instantánea en dispositivos de escritorio y móviles.
 * 
 * @param {string} rutaAudio - Ruta local o URI del recurso sonoro a reproducir.
 * @returns {void}
 */
function reproducirAudio(rutaAudio) {
  try {
    const audio = new Audio(rutaAudio);
    audio.play();
  } catch (error) {
    console.error("Error al reproducir el audio fonético:", error);
  }
}
