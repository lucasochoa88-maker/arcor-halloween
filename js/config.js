/* =========================================================================
   CONFIGURACIÓN CENTRAL — ARCOR HALLOWEEN CHALLENGE
   -------------------------------------------------------------------------
   Este archivo concentra TODO lo que se puede personalizar sin tocar la
   lógica de los juegos: textos, colores, imágenes, duraciones y puntajes.
   Editá solo los valores (lo que está a la derecha de los dos puntos).
   ========================================================================= */

const CONFIG = {

  /* ----- Marca / textos generales ------------------------------------- */
  marca: {
    nombre: "ARCOR",
    tituloApp: "ARCOR HALLOWEEN CHALLENGE",
    subtitulo: "De Fiesta Se Trata",
    logo: "assets/img/logo-arcor.png"
  },

  /* ----- Colores de la campaña (se inyectan como variables CSS) -------- */
  /* Tomados de la paleta oficial de la campaña Halloween de Arcor.        */
  colores: {
    naranja:        "#F7941D",  // naranja principal de la campaña
    naranjaClaro:   "#FDB813",  // amarillo-naranja de los degradados
    naranjaOscuro:  "#E8601C",  // naranja intenso
    rojo:           "#ED1C24",  // rojo del borde superior
    violeta:        "#5B2A86",  // violeta de lápidas / parlantes
    violetaClaro:   "#8E4FC0",
    azulArcor:      "#0A5BA8",  // azul del logo Arcor
    celesteArcor:   "#2F9BE0",
    textoClaro:     "#FFFFFF",
    textoOscuro:    "#3A1A5B",
    acierto:        "#36C06B",  // verde respuesta correcta
    error:          "#E8413A"   // rojo respuesta incorrecta
  },

  /* ----- Textos de pantallas ------------------------------------------ */
  textos: {
    bienvenidaTitulo:   "ARCOR HALLOWEEN CHALLENGE",
    bienvenidaSubtitulo:"Tocá COMENZAR y elegí tu juego",
    botonComenzar:      "COMENZAR",
    menuTitulo:         "ELEGÍ TU JUEGO",
    jugarOtraVez:       "JUGAR OTRA VEZ",
    volverMenu:         "VOLVER AL MENÚ"
  },

  /* ----- Tiempos de inactividad (en segundos) ------------------------- */
  inactividad: {
    resultadosAlMenu:   20,  // en pantalla de resultados vuelve al menú
    menuABienvenida:    60   // en el menú vuelve a la bienvenida
    // Durante una partida en curso NO se aplica inactividad.
  },

  /* ----- Juego 1: Preguntados ----------------------------------------- */
  preguntados: {
    preguntasPorPartida: 10,   // cuántas preguntas por ronda
    puntosPorAcierto:    10,
    msAntesDeAvanzar:    2600, // tiempo mostrando acierto/error + explicación
    icono:               "assets/img/personaje-bruja.jpg"
  },

  /* ----- Juego 2: Memotest -------------------------------------------- */
  memotest: {
    dificultadInicial: "facil",       // "facil" | "medio" | "dificil"
    pares: { facil: 4, medio: 6, dificil: 8 },
    msVueltaAtras: 900,               // pausa antes de ocultar un par fallido
    icono: "assets/img/personaje-franken.jpg",
    // Imágenes que se usan como caras de las tarjetas (campaña real).
    // El orden define cuáles entran primero en dificultades bajas.
    caras: [
      { src: "assets/img/personaje-vampiro.jpg",     alt: "Vampiro DJ" },
      { src: "assets/img/personaje-bruja.jpg",       alt: "Bruja" },
      { src: "assets/img/personaje-encapuchado.jpg", alt: "Encapuchado" },
      { src: "assets/img/personaje-catrina.jpg",     alt: "Catrina" },
      { src: "assets/img/personaje-franken.jpg",     alt: "Frankenstein" },
      { src: "assets/img/prop-lapida.jpg",           alt: "Lápida" },
      { src: "assets/img/prop-murcielago.jpg",       alt: "Murciélagos" },
      { src: "assets/img/prop-bandeja-dj.jpg",       alt: "Bandeja de DJ" }
    ],
    dorsoLogo: "assets/img/logo-arcor.png"
  },

  /* ----- Juego 3: Atrapa las Golosinas -------------------------------- */
  atrapa: {
    duracionSeg:        30,
    puntosGolosina:     10,
    puntosPenalizacion: 15,  // se resta este valor (nunca baja de 0)
    spawnInicialMs:     900, // cada cuánto aparece un elemento al inicio
    spawnMinimoMs:      420, // el mínimo al que acelera (moderado)
    aceleracionMs:      14,  // cuánto se reduce el intervalo por aparición
    vidaElementoMs:     1500,// cuánto permanece visible un elemento
    probabilidadPenal:  0.26,// proporción de elementos que penalizan
    icono:              "assets/img/personaje-encapuchado.jpg"
  },

  /* ----- Audio -------------------------------------------------------- */
  audio: {
    activoPorDefecto: true,
    volumenMusica: 0.22,
    volumenEfectos: 0.35,
    // Ruta OPCIONAL a una pista de música propia (mp3/ogg con derechos).
    // Si queda en null, la app genera un ambiente sintetizado sin archivos.
    // Para usar una pista propia: colocá el archivo en assets/audio/ y
    // escribí aquí su ruta, por ej: "assets/audio/ambiente.mp3"
    pistaMusica: null
  }
};
