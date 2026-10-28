/* =========================================================================
   UTILIDADES COMPARTIDAS
   ========================================================================= */
const Utils = {
  /* Mezcla una copia del array (Fisher-Yates) sin modificar el original */
  mezclar(array) {
    const a = array.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  },

  /* Entero aleatorio entre min y max (inclusive) */
  entero(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  /* Crea un elemento con clase, atributos y contenido */
  crear(tag, clase, attrs) {
    const el = document.createElement(tag);
    if (clase) el.className = clase;
    if (attrs) for (const k in attrs) {
      if (k === "text") el.textContent = attrs[k];
      else if (k === "html") el.innerHTML = attrs[k];
      else el.setAttribute(k, attrs[k]);
    }
    return el;
  },

  /* Formatea segundos a mm:ss o s según convenga */
  formatearTiempo(ms) {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    const r = s % 60;
    return m > 0 ? `${m}:${String(r).padStart(2, "0")}` : `${r}s`;
  },

  /* Inyecta los colores de CONFIG como variables CSS en :root */
  aplicarColores(colores) {
    const root = document.documentElement;
    const map = {
      naranja: "--c-naranja", naranjaClaro: "--c-naranja-claro",
      naranjaOscuro: "--c-naranja-oscuro", rojo: "--c-rojo",
      violeta: "--c-violeta", violetaClaro: "--c-violeta-claro",
      azulArcor: "--c-azul", celesteArcor: "--c-celeste",
      textoClaro: "--c-texto-claro", textoOscuro: "--c-texto-oscuro",
      acierto: "--c-acierto", error: "--c-error"
    };
    for (const k in map) if (colores[k]) root.style.setProperty(map[k], colores[k]);
  }
};
