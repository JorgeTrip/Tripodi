/**
 * ============================================================================
 * CONTROLADOR DE PERSONAJES NOTABLES - TRIPODI
 * ============================================================================
 * Renderiza el catálogo de personalidades históricas agrupadas por disciplinas.
 * Seguridad SAST SEC-004: Todo el árbol DOM se construye con nodos nativos
 * seguros (createElement, textContent, createElementNS) sin innerHTML.
 */

/**
 * Genera el elemento SVG del ícono de flecha desplegable (chevron).
 * @returns {SVGElement} Nodo SVG configurado.
 */
function crearIconoChevron() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '10');
  svg.setAttribute('height', '6');
  svg.setAttribute('viewBox', '0 0 10 6');
  svg.setAttribute('fill', 'none');

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', 'M1 1l4 4 4-4');
  path.setAttribute('stroke', 'currentColor');
  path.setAttribute('stroke-width', '1.8');
  path.setAttribute('stroke-linecap', 'round');
  path.setAttribute('stroke-linejoin', 'round');
  svg.appendChild(path);
  return svg;
}

/**
 * Genera el ícono SVG de enlace externo para los botones de fuentes.
 * @returns {SVGElement} Nodo SVG con pictograma de enlace saliente.
 */
function crearIconoEnlaceExterno() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '10');
  svg.setAttribute('height', '10');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '2');

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', 'M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6');
  const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
  polyline.setAttribute('points', '15 3 21 3 21 9');
  const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  line.setAttribute('x1', '10');
  line.setAttribute('y1', '14');
  line.setAttribute('x2', '21');
  line.setAttribute('y2', '3');

  svg.appendChild(path);
  svg.appendChild(polyline);
  svg.appendChild(line);
  return svg;
}

/**
 * Construye el elemento DOM para un personaje y su panel biográfico.
 * @param {Object} persona - Datos de la figura notable.
 * @param {HTMLElement} contenedorAcordeon - Contenedor padre de la disciplina.
 * @returns {HTMLDivElement} Nodo listo para incorporarse al DOM.
 */
function crearElementoPersona(persona, contenedorAcordeon) {
  const itemPersona = document.createElement('div');
  itemPersona.className = 'person-accordion-item';

  // Cabecera interactiva
  const cabecera = document.createElement('div');
  cabecera.className = 'person-accordion-header';

  const metaIzquierda = document.createElement('div');
  metaIzquierda.className = 'person-meta-left';

  const spanNombre = document.createElement('span');
  spanNombre.className = 'person-accordion-name';
  spanNombre.textContent = persona.nombre;

  const spanRol = document.createElement('span');
  spanRol.className = 'person-accordion-role';
  spanRol.textContent = `${persona.subdisciplina} · ${persona.pais} · ${persona.fechas}`;

  metaIzquierda.appendChild(spanNombre);
  metaIzquierda.appendChild(spanRol);

  const contenedorChevron = document.createElement('div');
  contenedorChevron.className = 'person-accordion-chevron';
  contenedorChevron.appendChild(crearIconoChevron());

  cabecera.appendChild(metaIzquierda);
  cabecera.appendChild(contenedorChevron);

  // Cuerpo desplegable
  const cuerpo = document.createElement('div');
  cuerpo.className = 'person-accordion-body';

  const contenido = document.createElement('div');
  contenido.className = 'person-accordion-content';

  const descripcion = document.createElement('p');
  descripcion.className = 'person-desc';
  descripcion.textContent = persona.contribucion;
  contenido.appendChild(descripcion);

  if (persona.fuentes && persona.fuentes.length > 0) {
    const contenedorFuentes = document.createElement('div');
    contenedorFuentes.className = 'person-sources';

    const etiquetaFuentes = document.createElement('span');
    etiquetaFuentes.className = 'sources-label';
    etiquetaFuentes.textContent = 'Fuentes:';
    contenedorFuentes.appendChild(etiquetaFuentes);

    persona.fuentes.forEach(fuente => {
      const enlace = document.createElement('a');
      enlace.href = fuente.url;
      enlace.target = '_blank';
      enlace.rel = 'noopener';
      enlace.className = 'source-link-pill';
      enlace.appendChild(crearIconoEnlaceExterno());
      enlace.appendChild(document.createTextNode(' ' + fuente.nombre));
      contenedorFuentes.appendChild(enlace);
    });
    contenido.appendChild(contenedorFuentes);
  }

  cuerpo.appendChild(contenido);

  cabecera.addEventListener('click', () => {
    const estabaActiva = itemPersona.classList.contains('active');
    contenedorAcordeon.querySelectorAll('.person-accordion-item').forEach(item => {
      item.classList.remove('active');
    });
    if (!estabaActiva) itemPersona.classList.add('active');
  });

  itemPersona.appendChild(cabecera);
  itemPersona.appendChild(cuerpo);
  return itemPersona;
}

/**
 * Inicializa y renderiza en '#notables-container' las disciplinas y figuras notables.
 * @returns {void}
 */
function renderizarPersonajesNotables() {
  const contenedor = document.getElementById('notables-container');
  if (!contenedor) return;

  const catalogo1 = typeof datosNotables1 !== 'undefined' ? datosNotables1 : [];
  const catalogo2 = typeof datosNotables2 !== 'undefined' ? datosNotables2 : [];
  const catalogo3 = typeof datosNotables3 !== 'undefined' ? datosNotables3 : [];
  const todasLasDisciplinas = [...catalogo1, ...catalogo2, ...catalogo3];

  todasLasDisciplinas.forEach(disciplina => {
    const tarjeta = document.createElement('div');
    tarjeta.className = 'notable-card fade-up';

    const emojiDiv = document.createElement('div');
    emojiDiv.className = 'notable-emoji';
    emojiDiv.textContent = disciplina.emoji;

    const titulo = document.createElement('h3');
    titulo.className = 'notable-name';
    titulo.textContent = disciplina.disciplina;

    const acordeon = document.createElement('div');
    acordeon.className = 'notable-people-accordion';

    disciplina.personas.forEach(persona => {
      acordeon.appendChild(crearElementoPersona(persona, acordeon));
    });

    tarjeta.appendChild(emojiDiv);
    tarjeta.appendChild(titulo);
    tarjeta.appendChild(acordeon);
    contenedor.appendChild(tarjeta);
  });
}

document.addEventListener('DOMContentLoaded', renderizarPersonajesNotables);
