/* ============================================================================
   CONTROLADOR DE ACORDEÓN DE PERSONAJES NOTABLES - TRIPODI
   ============================================================================
   Manejador de renderizado dinámico de figuras notables y comportamiento
   interactivo de las subtarjetas de biografía.
*/

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('notables-container');
  if (!container) return;

  // Unificación de todas las disciplinas cargadas por módulos
  const todosLosNotables = [...datosNotables1, ...datosNotables2, ...datosNotables3];

  todosLosNotables.forEach(disciplina => {
    // Se construye la tarjeta contenedora de la disciplina
    const card = document.createElement('div');
    card.className = 'notable-card fade-up';
    
    card.innerHTML = `
      <div class="notable-emoji">${disciplina.emoji}</div>
      <h3 class="notable-name">${disciplina.disciplina}</h3>
      <div class="notable-people-accordion"></div>
    `;

    const accordion = card.querySelector('.notable-people-accordion');

    disciplina.personas.forEach(persona => {
      const personDiv = document.createElement('div');
      personDiv.className = 'person-accordion-item';

      // Cabecera (subtarjeta visible con información básica)
      const header = document.createElement('div');
      header.className = 'person-accordion-header';
      header.innerHTML = `
        <div class="person-meta-left">
          <span class="person-accordion-name">${persona.nombre}</span>
          <span class="person-accordion-role">${persona.subdisciplina} · ${persona.pais} · ${persona.fechas}</span>
        </div>
        <div class="person-accordion-chevron">
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
      `;

      // Cuerpo Desplegable (contribución y botones independientes de fuentes)
      const body = document.createElement('div');
      body.className = 'person-accordion-body';
      
      let fuentesHTML = '';
      if (persona.fuentes && persona.fuentes.length > 0) {
        fuentesHTML = `
          <div class="person-sources">
            <span class="sources-label">Fuentes:</span>
            ${persona.fuentes.map(f => `
              <a href="${f.url}" target="_blank" rel="noopener" class="source-link-pill">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                ${f.nombre}
              </a>
            `).join('')}
          </div>
        `;
      }

      body.innerHTML = `
        <div class="person-accordion-content">
          <p class="person-desc">${persona.contribucion}</p>
          ${fuentesHTML}
        </div>
      `;

      // Evento de apertura/cierre de la subtarjeta
      header.addEventListener('click', (e) => {
        const wasActive = personDiv.classList.contains('active');
        // Se cierran el resto de subtarjetas de esta misma disciplina
        accordion.querySelectorAll('.person-accordion-item').forEach(item => {
          item.classList.remove('active');
        });
        // Si no estaba activa, se expande
        if (!wasActive) {
          personDiv.classList.add('active');
        }
      });

      personDiv.appendChild(header);
      personDiv.appendChild(body);
      accordion.appendChild(personDiv);
    });

    container.appendChild(card);
  });
});
