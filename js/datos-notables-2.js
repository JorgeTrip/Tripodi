/* ============================================================================
   PERSONAJES NOTABLES - PARTE 2
   ============================================================================
   Datos de portadores notables del apellido para las disciplinas:
   Deporte y Ciencia (que integra Medicina y Ciencia y Academia).
*/

const datosNotables2 = [
  {
    disciplina: "Deporte",
    emoji: "⚽",
    personas: [
      {
        nombre: "Emanuel Trípodi",
        subdisciplina: "Fútbol (Arquero)",
        fechas: "n. 08/01/1981",
        pais: "Argentina",
        contribucion: "Arquero y Director Técnico de fútbol profesional. Jugó más de 15 años en el fútbol argentino, logrando dos ascensos a Primera División. Actualmente dirige a Guillermo Brown.",
        fuentes: [
          { nombre: "Wikipedia ES", url: "https://es.wikipedia.org/wiki/Emanuel_Tr%C3%ADpodi" },
          { nombre: "Transfermarkt Ficha", url: "https://www.transfermarkt.com/" }
        ]
      },
      {
        nombre: "Mariano Trípodi",
        subdisciplina: "Fútbol (Delantero)",
        fechas: "n. 03/07/1987",
        pais: "Argentina/Italia",
        contribucion: "Futbolista profesional (delantero). Surgido en Boca Juniors, jugó en clubes de Alemania (1. FC Colonia), Brasil (Atlético Mineiro) y Liechtenstein (FC Vaduz).",
        fuentes: [
          { nombre: "Wikipedia ES", url: "https://es.wikipedia.org/wiki/Mariano_Tr%C3%ADpodi" },
          { nombre: "Transfermarkt Ficha", url: "https://www.transfermarkt.com/" }
        ]
      },
      {
        nombre: "Carmelo Trípodi Calá",
        subdisciplina: "Básquetbol",
        fechas: "15/04/1913 – 1998",
        pais: "Argentina",
        contribucion: "Fundador del Club Atenas de Patagones y figura clave en el básquetbol de la región. El estadio de Atenas lleva su nombre.",
        fuentes: [
          { nombre: "Club Atenas", url: "http://www.clubatenas.com.ar/" },
          { nombre: "DATA Basquet", url: "http://www.databasquet.com.ar/" }
        ]
      },
      {
        nombre: "Tony Tripodina",
        subdisciplina: "Lucha Libre",
        fechas: "N/D",
        pais: "Australia",
        contribucion: "Luchador profesional con combates televisados.",
        fuentes: [{ nombre: "Beyond the Bell", url: "https://www.youtube.com/" }]
      },
      {
        nombre: "Andreas Tripodina",
        subdisciplina: "MMA (Artes Marciales Mixtas)",
        fechas: "N/D",
        pais: "N/D",
        contribucion: "Luchador de artes marciales mixtas, ha participado en eventos de las ligas PFL y UFC.",
        fuentes: [{ nombre: "Oktagon MMA", url: "https://www.facebook.com/" }]
      }
    ]
  },
  {
    disciplina: "Ciencia",
    emoji: "🔬",
    personas: [
      {
        nombre: "Dra. María Rosa Tripodi",
        subdisciplina: "Medicina (Pediatría)",
        fechas: "N/D",
        pais: "Argentina",
        contribucion: "Médica pediatra argentina. Publicó investigación en Archivos Argentinos de Pediatría (SciELO, 2007), indexada en Medline.",
        fuentes: [{ nombre: "SciELO Argentina", url: "https://www.scielo.org.ar/" }]
      },
      {
        nombre: "Dra. Lidia Tripodi",
        subdisciplina: "Medicina (Clínica y Geriatría)",
        fechas: "N/D",
        pais: "Argentina",
        contribucion: "Médica especialista en Clínica Médica, Geriatría, Perito y Médica Legista en Argentina.",
        fuentes: [{ nombre: "LinkedIn Perfil", url: "https://www.linkedin.com/" }]
      },
      {
        nombre: "Prof. Armando Tripodi",
        subdisciplina: "Bioquímica y Coagulación",
        fechas: "n. 13/04/1959",
        pais: "Italia",
        contribucion: "Profesor Ordinario de Bioquímica Clínica y Biología Molecular Clínica en la Facultad de Medicina de la Universidad Humanitas de Milán. Investigador líder en el campo de la coagulación y hemostasia, con numerosas publicaciones científicas.",
        fuentes: [
          { nombre: "ScienceDirect Pubs", url: "https://www.sciencedirect.com/" },
          { nombre: "ResearchGate Bio", url: "https://www.researchgate.net/" },
          { nombre: "PubMed Thrombin", url: "https://pubmed.ncbi.nlm.nih.gov/" }
        ]
      },
      {
        nombre: "Prof. Claudio Tripodo",
        subdisciplina: "Inmunología Tumoral",
        fechas: "n. 1978",
        pais: "Italia",
        contribucion: "Patólogo especializado en inmunología tumoral, con un fuerte enfoque en el estudio del microambiente tumoral. Profesor Titular de Patología en la Universidad de Milán y líder de laboratorio en IFOM.",
        fuentes: [
          { nombre: "IFOM Lab Portal", url: "https://www.ifom.eu/" },
          { nombre: "Google Scholar", url: "https://scholar.google.com/" },
          { nombre: "NIBIT Perfil", url: "https://www.nibit.org/" }
        ]
      },
      {
        nombre: "Dra. Vilma Tripodoro",
        subdisciplina: "Medicina (Cuidados Paliativos)",
        fechas: "N/D",
        pais: "Argentina",
        contribucion: "Especialista en Medicina Interna y Medicina Paliativa. Investigadora Senior de ATLANTES Global Observatory of Palliative Care - Centro Colaborador de la Organización Mundial de la Salud. Jefa del Departamento de Cuidados Paliativos en el Hospital Británico de Buenos Aires.",
        fuentes: [
          { nombre: "ResearchGate Bio", url: "https://www.researchgate.net/" },
          { nombre: "The Conversation", url: "https://theconversation.com/" },
          { nombre: "ehospice Art", url: "https://ehospice.com/" }
        ]
      },
      {
        nombre: "Dr. Domenico Tripodi",
        subdisciplina: "Odontología Pediátrica",
        fechas: "n. 04/10/1984",
        pais: "Italia",
        contribucion: "Médico cirujano, con numerosas publicaciones en odontología pediátrica y biomateriales. Profesor Ordinario en la Università degli Studi 'G. d'Annunzio' Chieti.",
        fuentes: [
          { nombre: "ResearchGate Pubs", url: "https://www.researchgate.net/" },
          { nombre: "UniCamillus Portal", url: "https://www.unicamillus.org/" },
          { nombre: "SciProfiles Perfil", url: "https://sciprofiles.com/" }
        ]
      },
      {
        nombre: "Prof. Marco Tripodi",
        subdisciplina: "Neurociencias",
        fechas: "N/D",
        pais: "Italia/Reino Unido",
        contribucion: "Líder de grupo en el prestigioso MRC Laboratory of Molecular Biology de la Universidad de Cambridge. Su investigación de vanguardia se centra en los circuitos neuronales que rigen las acciones motoras y perceptivas.",
        fuentes: [
          { nombre: "MRC Laboratory", url: "https://www2.mrc-lmb.cam.ac.uk/" },
          { nombre: "ResearchGate Bio", url: "https://www.researchgate.net/" },
          { nombre: "Google Scholar", url: "https://scholar.google.com/" }
        ]
      },
      {
        nombre: "Prof. Francesca Tripodi",
        subdisciplina: "Sociología y Academia de Medios",
        fechas: "N/D",
        pais: "Estados Unidos",
        contribucion: "Socióloga, académica de medios y Profesora Asociada en la SILS. Investigadora Principal en el Centro de Tecnología de la Información y Vida Pública (CITAP) de la Universidad de Carolina del Norte en Chapel Hill. Estudia la confianza pública, la desinformación y las redes sociales.",
        fuentes: [
          { nombre: "UNC School Info", url: "https://sils.unc.edu/" },
          { nombre: "Data & Society", url: "https://datasociety.net/" },
          { nombre: "Stats + Stories", url: "https://statsandstories.net/" }
        ]
      },
      {
        nombre: "Giuseppina Tripodi",
        subdisciplina: "Divulgación Científica",
        fechas: "N/D",
        pais: "Italia",
        contribucion: "Colaboradora científica directa y cercana de la Premio Nobel de Medicina Rita Levi-Montalcini durante más de 40 años. Coautora de importantes obras históricas como el libro 'Las Pioneras: Las mujeres que cambiaron la sociedad y la ciencia'.",
        fuentes: [
          { nombre: "PlanetadeLibros Bio", url: "https://www.planetadelibros.com/" },
          { nombre: "Mujeres con Ciencia", url: "https://mujeresconciencia.com/" },
          { nombre: "Nobel Prize Record", url: "https://www.nobelprize.org/" }
        ]
      },
      {
        nombre: "Prof. Egon Tripodi",
        subdisciplina: "Economía Política",
        fechas: "N/D",
        pais: "Alemania",
        contribucion: "Profesor Asistente de Economía en la Hertie School de Berlín. Su campo de investigación incluye la economía del comportamiento, economía pública y diseño de incentivos políticos.",
        fuentes: [
          { nombre: "Hertie Economics", url: "https://www.hertie-school.org/" },
          { nombre: "CEPR Research", url: "https://cepr.org/" },
          { nombre: "Google Scholar", url: "https://scholar.google.com/" }
        ]
      },
      {
        nombre: "Dr. Vincenzo Tripodi",
        subdisciplina: "Geología Estructural",
        fechas: "N/D",
        pais: "Italia",
        contribucion: "Investigador Senior en el Consiglio Nazionale delle Ricerche (CNR) de Italia. Experto especializado en geología estructural y tectónica activa.",
        fuentes: [
          { nombre: "CNR Perfil", url: "https://www.cnr.it/" },
          { nombre: "ResearchGate Bio", url: "https://www.researchgate.net/" }
        ]
      }
    ]
  }
];
