/* =========================================================================
   BANCO DE PREGUNTAS — PREGUNTADOS ARCOR
   -------------------------------------------------------------------------
   Formato de cada pregunta:
     p : texto de la pregunta
     o : lista de opciones (el motor las mezcla automáticamente)
     r : respuesta correcta (debe coincidir EXACTO con una opción de "o")
     e : explicación breve que se muestra al responder
     cat: categoría (informativo)

   Los datos corporativos fueron verificados con fuentes públicas
   (Wikipedia / Grupo Arcor / prensa). Para agregar o editar preguntas,
   copiá el formato de cualquier bloque. No hace falta tocar el código.
   ========================================================================= */

const PREGUNTAS = [
  /* ---------- Historia y actividad de Arcor ---------- */
  {
    p: "¿En qué año se fundó Arcor?",
    o: ["1951", "1941", "1961", "1971"],
    r: "1951",
    e: "Arcor se fundó el 5 de julio de 1951.",
    cat: "Historia"
  },
  {
    p: "¿En qué ciudad nació Arcor?",
    o: ["Arroyito", "Rosario", "Córdoba Capital", "Villa María"],
    r: "Arroyito",
    e: "Nació en Arroyito, provincia de Córdoba, Argentina.",
    cat: "Historia"
  },
  {
    p: "El nombre ARCOR surge de combinar las primeras letras de…",
    o: ["Arroyito y Córdoba", "Argentina y Córdoba", "Arroyito y Cordón", "Arce y Córdoba"],
    r: "Arroyito y Córdoba",
    e: "ARCOR = ARroyito + CORdoba, su lugar de origen.",
    cat: "Historia"
  },
  {
    p: "¿Quién lideró al grupo de emprendedores que fundó Arcor?",
    o: ["Fulvio Salvador Pagani", "Luis Pagani", "Amos Noel", "Renzo Bagley"],
    r: "Fulvio Salvador Pagani",
    e: "Fulvio Salvador Pagani encabezó la fundación en 1951.",
    cat: "Historia"
  },
  {
    p: "¿Qué producto elaboraba Arcor en sus comienzos?",
    o: ["Caramelos", "Galletitas", "Helados", "Gaseosas"],
    r: "Caramelos",
    e: "Empezó como una pequeña fábrica de caramelos.",
    cat: "Historia"
  },
  {
    p: "Arcor es reconocida mundialmente como el mayor productor de…",
    o: ["Caramelos", "Harinas", "Yogures", "Café"],
    r: "Caramelos",
    e: "Es el primer productor mundial de caramelos.",
    cat: "Historia"
  },
  {
    p: "¿En qué provincia argentina está la planta original de Arcor?",
    o: ["Córdoba", "Santa Fe", "Buenos Aires", "Mendoza"],
    r: "Córdoba",
    e: "La planta madre está en Arroyito, Córdoba.",
    cat: "Historia"
  },
  {
    p: "¿En qué año Arcor exportó por primera vez a Estados Unidos?",
    o: ["1968", "1958", "1978", "1988"],
    r: "1968",
    e: "Su primera exportación a EE. UU. fue en 1968.",
    cat: "Historia"
  },
  {
    p: "¿Cómo se llama la fundación social de Arcor, creada en 1991?",
    o: ["Fundación Arcor", "Fundación Pagani", "Fundación Dulce", "Fundación Córdoba"],
    r: "Fundación Arcor",
    e: "La Fundación Arcor nació en 1991.",
    cat: "Historia"
  },

  /* ---------- Marcas y productos ---------- */
  {
    p: "¿Qué producto de Arcor es un bombón relleno con crema de maní?",
    o: ["Bon o Bon", "Rocklets", "Topline", "Mogul"],
    r: "Bon o Bon",
    e: "El Bon o Bon es el clásico bombón con relleno de maní.",
    cat: "Marcas"
  },
  {
    p: "Completá la frase icónica: «Un Bon o Bon por un ___».",
    o: ["beso", "abrazo", "chiste", "baile"],
    r: "beso",
    e: "«Un Bon o Bon por un beso» es su frase más recordada.",
    cat: "Marcas"
  },
  {
    p: "¿En qué año se lanzó el Bon o Bon al mercado?",
    o: ["1984", "1974", "1994", "2004"],
    r: "1984",
    e: "El Bon o Bon se lanzó en 1984.",
    cat: "Marcas"
  },
  {
    p: "Los Rocklets son…",
    o: ["Confites de chocolate", "Chicles", "Caramelos duros", "Galletitas"],
    r: "Confites de chocolate",
    e: "Rocklets son confites de chocolate con cubierta de colores.",
    cat: "Marcas"
  },
  {
    p: "Topline es una marca de Arcor de…",
    o: ["Chicles", "Chocolates", "Alfajores", "Helados"],
    r: "Chicles",
    e: "Topline es la marca de chicles de Arcor.",
    cat: "Marcas"
  },
  {
    p: "Las gomitas de Arcor se llaman…",
    o: ["Mogul", "Sapito", "Cofler", "Tofi"],
    r: "Mogul",
    e: "Mogul es la marca de gomitas de Arcor.",
    cat: "Marcas"
  },
  {
    p: "Menthoplus es una línea de Arcor de…",
    o: ["Caramelos", "Chocolates", "Galletitas", "Chicles"],
    r: "Caramelos",
    e: "Menthoplus son caramelos (muy asociados a lo refrescante).",
    cat: "Marcas"
  },
  {
    p: "Cofler es una marca de Arcor de…",
    o: ["Chocolate", "Caramelos", "Chicles", "Mermeladas"],
    r: "Chocolate",
    e: "Cofler es una de las marcas de chocolate de Arcor.",
    cat: "Marcas"
  },
  {
    p: "Sapito, de Arcor, es un…",
    o: ["Chupetín", "Chicle", "Alfajor", "Caramelo masticable"],
    r: "Chupetín",
    e: "Sapito es un chupetín de chocolate con forma de sapo.",
    cat: "Marcas"
  },
  {
    p: "¿Qué empresa de galletitas integra el grupo, en sociedad con Danone?",
    o: ["Bagley", "Noel", "Águila", "La Campagnola"],
    r: "Bagley",
    e: "Bagley produce las galletitas, en sociedad con Danone.",
    cat: "Marcas"
  },
  {
    p: "Arcor elabora productos de temporada para Halloween, Pascuas y…",
    o: ["Navidad", "Carnaval", "Año Nuevo Chino", "Día del Amigo"],
    r: "Navidad",
    e: "Fabrica productos estacionales para Pascuas, Halloween y Navidad.",
    cat: "Marcas"
  },

  /* ---------- Halloween (general y entretenido) ---------- */
  {
    p: "¿Qué vegetal se talla tradicionalmente en Halloween?",
    o: ["Calabaza", "Sandía", "Zapallito", "Melón"],
    r: "Calabaza",
    e: "La calabaza tallada (Jack-o'-lantern) es un clásico.",
    cat: "Halloween"
  },
  {
    p: "«Dulce o truco» se dice en inglés…",
    o: ["Trick or treat", "Sweet or trick", "Candy please", "Happy night"],
    r: "Trick or treat",
    e: "La frase tradicional es «Trick or treat».",
    cat: "Halloween"
  },
  {
    p: "¿En qué fecha se celebra Halloween?",
    o: ["31 de octubre", "1 de noviembre", "30 de octubre", "2 de noviembre"],
    r: "31 de octubre",
    e: "Halloween se celebra cada 31 de octubre.",
    cat: "Halloween"
  },
  {
    p: "¿Qué animal volador nocturno es un símbolo clásico de Halloween?",
    o: ["Murciélago", "Lechuza", "Colibrí", "Mariposa"],
    r: "Murciélago",
    e: "El murciélago es uno de los íconos de Halloween.",
    cat: "Halloween"
  }
];
