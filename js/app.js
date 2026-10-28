/* =========================================================================
   CONTROLADOR PRINCIPAL — ARCOR HALLOWEEN CHALLENGE
   ========================================================================= */
const App = {
  raiz: null,
  juegoActual: null,
  modo: "bienvenida",     // "bienvenida" | "menu" | "jugando" | "resultado"
  idleId: null,

  JUEGOS: {
    preguntados: { nombre: "PREGUNTADOS ARCOR", desc: "Preguntas y respuestas", icono: CONFIG.preguntados.icono, modulo: () => JuegoPreguntados },
    memotest:    { nombre: "MEMOTEST ARCOR",    desc: "Encontrá los pares",     icono: CONFIG.memotest.icono,    modulo: () => JuegoMemotest },
    atrapa:      { nombre: "ATRAPA LAS GOLOSINAS", desc: "Tocá y sumá puntos",   icono: CONFIG.atrapa.icono,      modulo: () => JuegoAtrapa }
  },

  init() {
    Utils.aplicarColores(CONFIG.colores);
    this.raiz = document.getElementById("app");

    // Botón de audio (visible en todas las pantallas)
    this.btnAudio = Utils.crear("button", "btn-audio", { type: "button", "aria-label": "Audio" });
    this._pintarIconoAudio();
    this.btnAudio.addEventListener("click", () => {
      const silenciado = Audio_.alternarSilencio();
      this._pintarIconoAudio();
      if (!silenciado) { Audio_.desbloquear(); Audio_.iniciarMusica(); }
    });
    document.body.appendChild(this.btnAudio);

    // Reinicio del temporizador de inactividad ante cualquier toque
    ["pointerdown", "touchstart"].forEach((ev) =>
      document.addEventListener(ev, () => this._reiniciarIdle(), { passive: true }));

    // Reajuste ante cambios de tamaño/orientación: no rompe la partida,
    // solo se asegura de mantener el layout (CSS hace el trabajo principal).
    window.addEventListener("resize", () => {});

    this.mostrarBienvenida();
  },

  _pintarIconoAudio() {
    this.btnAudio.textContent = Audio_.silenciado ? "🔇" : "🔊";
    this.btnAudio.classList.toggle("off", Audio_.silenciado);
  },

  /* ----------------- Gestión de inactividad ----------------- */
  _reiniciarIdle() {
    if (this.idleId) { clearTimeout(this.idleId); this.idleId = null; }
    let seg = 0, destino = null;
    if (this.modo === "menu") { seg = CONFIG.inactividad.menuABienvenida; destino = () => this.mostrarBienvenida(); }
    else if (this.modo === "resultado") { seg = CONFIG.inactividad.resultadosAlMenu; destino = () => this.mostrarMenu(); }
    // Durante "jugando" o "bienvenida" no hay retorno automático.
    if (seg > 0 && destino) this.idleId = setTimeout(destino, seg * 1000);
  },

  _limpiarJuego() {
    if (this.juegoActual && this.juegoActual.detener) {
      try { this.juegoActual.detener(); } catch (e) {}
    }
    this.juegoActual = null;
  },

  /* ----------------- Pantalla de BIENVENIDA ----------------- */
  mostrarBienvenida() {
    this._limpiarJuego();
    this.modo = "bienvenida";
    this.raiz.className = "pantalla pantalla-bienvenida";
    this.raiz.innerHTML = `
      <div class="hero-overlay"></div>
      <div class="bienvenida-contenido">
        <img class="logo-top flotante" src="${CONFIG.marca.logo}" alt="Arcor">
        <h1 class="titulo-principal aparece">${CONFIG.textos.bienvenidaTitulo}</h1>
        <p class="subtitulo aparece-2">${CONFIG.textos.bienvenidaSubtitulo}</p>
        <button class="btn-grande btn-comenzar pulso" type="button">${CONFIG.textos.botonComenzar}</button>
        <p class="firma">${CONFIG.marca.subtitulo}</p>
      </div>`;
    this.raiz.querySelector(".btn-comenzar").addEventListener("click", () => {
      // Primera interacción: recién acá se habilita el audio
      Audio_.desbloquear();
      if (!Audio_.silenciado) Audio_.iniciarMusica();
      Audio_.efecto("toque");
      this.mostrarMenu();
    });
    this._reiniciarIdle();
  },

  /* ----------------- MENÚ principal ----------------- */
  mostrarMenu() {
    this._limpiarJuego();
    this.modo = "menu";
    this.raiz.className = "pantalla pantalla-menu";
    const cards = Object.keys(this.JUEGOS).map((key) => {
      const j = this.JUEGOS[key];
      return `
        <button class="menu-card" type="button" data-juego="${key}">
          <div class="menu-card-img" style="background-image:url('${j.icono}')"></div>
          <div class="menu-card-info">
            <span class="menu-card-nombre">${j.nombre}</span>
            <span class="menu-card-desc">${j.desc}</span>
          </div>
          <span class="menu-card-jugar">JUGAR ▸</span>
        </button>`;
    }).join("");

    this.raiz.innerHTML = `
      <div class="menu-fondo"></div>
      <header class="menu-header">
        <img class="logo-menu" src="${CONFIG.marca.logo}" alt="Arcor">
        <h1 class="menu-titulo">${CONFIG.textos.menuTitulo}</h1>
      </header>
      <div class="menu-cards">${cards}</div>
      <p class="firma firma-menu">${CONFIG.marca.subtitulo}</p>`;

    this.raiz.querySelectorAll(".menu-card").forEach((btn) => {
      btn.addEventListener("click", () => {
        Audio_.efecto("toque");
        this.abrirJuego(btn.dataset.juego);
      });
    });
    this._reiniciarIdle();
  },

  /* ----------------- Abrir un JUEGO ----------------- */
  abrirJuego(key) {
    this._limpiarJuego();
    this.modo = "jugando";
    this.raiz.className = "pantalla pantalla-juego juego-" + key;
    this.raiz.innerHTML = `
      <header class="juego-barra">
        <button class="btn-volver" type="button">◂ MENÚ</button>
        <span class="juego-titulo">${this.JUEGOS[key].nombre}</span>
        <span class="juego-sp"></span>
      </header>
      <main class="juego-contenedor" id="juego-contenedor"></main>`;

    this.raiz.querySelector(".btn-volver").addEventListener("click", () => {
      Audio_.efecto("toque");
      this.mostrarMenu();
    });

    const cont = this.raiz.querySelector("#juego-contenedor");
    const modulo = this.JUEGOS[key].modulo();
    this.juegoActual = modulo;
    const api = { volverMenu: () => this.mostrarMenu() };
    // Mientras se juega no hay inactividad automática
    if (this.idleId) { clearTimeout(this.idleId); this.idleId = null; }
    modulo.iniciar(cont, api);
  },

  /* ----------------- Pantalla de RESULTADO (reutilizable) ----------------- */
  /* La invocan los juegos al terminar. Activa el modo "resultado" (idle 20s). */
  pantallaResultado(contenedor, opts) {
    this.modo = "resultado";
    const lineas = opts.lineas.map((l) =>
      `<div class="res-linea"><span>${l.etiqueta}</span><b>${l.valor}</b></div>`).join("");
    contenedor.innerHTML = `
      <div class="resultado aparece">
        <div class="res-emoji">🎃</div>
        <h2 class="res-titulo">${opts.titulo}</h2>
        <div class="res-datos">${lineas}</div>
        <p class="res-mensaje">${opts.mensaje}</p>
        <div class="res-botones">
          <button class="btn-grande btn-reintentar" type="button">${CONFIG.textos.jugarOtraVez}</button>
          <button class="btn-grande btn-secundario btn-menu" type="button">${CONFIG.textos.volverMenu}</button>
        </div>
      </div>`;
    contenedor.querySelector(".btn-reintentar").addEventListener("click", () => {
      Audio_.efecto("toque");
      this.modo = "jugando";
      if (this.idleId) { clearTimeout(this.idleId); this.idleId = null; }
      opts.onReintentar();
    });
    contenedor.querySelector(".btn-menu").addEventListener("click", () => {
      Audio_.efecto("toque");
      this.mostrarMenu();
    });
    this._reiniciarIdle();
  }
};

window.addEventListener("DOMContentLoaded", () => App.init());
