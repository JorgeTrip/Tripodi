/**
 * REPRODUCCIÓN DE AUDIO - TRIPODI
 * Lógica para reproducir audios correspondientes a pronunciaciones de la etimología.
 */

/**
 * Reproduce un archivo de audio a partir de su URI de origen.
 * @param {string} src - Ruta del archivo de audio.
 */
function playAudio(src) {
  try {
    const audio = new Audio(src);
    audio.play();
  } catch (error) {
    console.error("Error al reproducir el audio:", error);
  }
}
