/* =========================================================================
   CONTROLADOR PRINCIPAL — ARCOR HALLOWEEN CHALLENGE
   ========================================================================= */
const App = {
  raiz: null,
  juegoActual: null,
  modo: "bienvenida",     // "bienvenida" | "nombre" | "menu" | "jugando" | "resultado" | "ranking"
  idleId: null,
  jugador: "",            // nombre del jugador actual
  _rankingFiltro: "general",

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

    // OPCIÓN 1 — Pantalla completa: al primer toque entra en fullscreen y se
    // oculta la barra de URL. El navegador exige un gesto del usuario, por eso
    // no se puede hacer solo al cargar.
    document.addEventListener("pointerdown", () => this._pantallaCompleta(), { once: true });

    window.addEventListener("resize", () => {});

    this.mostrarBienvenida();
  },

  /* ----------------- Pantalla completa (ocultar URL) ----------------- */
  _pantallaCompleta() {
    try {
      if (document.fullscreenElement) return;
      const el = document.documentElement;
      const req = el.requestFullscreen || el.webkitRequestFullscreen ||
                  el.mozRequestFullScreen || el.msRequestFullscreen;
      if (req) {
        const p = req.call(el);
        if (p && p.catch) p.catch(() => {}); // si el navegador lo rechaza, no pasa nada
      }
    } catch (e) {}
  },

  _pintarIconoAudio() {
    this.btnAudio.textContent = Audio_.silenciado ? "🔇" : "🔊";
    this.btnAudio.classList.toggle("off", Audio_.silenciado);
  },

  /* Escapa texto para insertarlo seguro en innerHTML (nombres de jugadores) */
  _escapar(s) {
    return String(s).replace(/[&<>"']/g, (m) => (
      { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]
    ));
  },

  /* ----------------- Gestión de inactividad ----------------- */
  _reiniciarIdle() {
    if (this.idleId) { clearTimeout(this.idleId); this.idleId = null; }
    let seg = 0, destino = null;
    if (this.modo === "menu") { seg = CONFIG.inactividad.menuABienvenida; destino = () => this.mostrarBienvenida(); }
    else if (this.modo === "nombre") { seg = CONFIG.inactividad.menuABienvenida; destino = () => this.mostrarBienvenida(); }
    else if (this.modo === "resultado") { seg = CONFIG.inactividad.resultadosAlMenu; destino = () => this.mostrarMenu(); }
    else if (this.modo === "ranking") { seg = CONFIG.inactividad.resultadosAlMenu; destino = () => this.mostrarMenu(); }
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
    this.jugador = ""; // se limpia para el próximo jugador
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
      // Primera interacción: audio + pantalla completa
      this._pantallaCompleta();
      Audio_.desbloquear();
      if (!Audio_.silenciado) Audio_.iniciarMusica();
      Audio_.efecto("toque");
      this.pantallaNombre();
    });
    this._reiniciarIdle();
  },

  /* ----------------- Pantalla de NOMBRE ----------------- */
  pantallaNombre() {
    this._limpiarJuego();
    this.modo = "nombre";
    this.raiz.className = "pantalla pantalla-nombre";
    this.raiz.innerHTML = `
      <div class="nombre-panel aparece">
        <img class="logo-top" src="${CONFIG.marca.logo}" alt="Arcor">
        <h2 class="nombre-titulo">¿QUIÉN JUEGA?</h2>
        <p class="nombre-sub">Escribí tu nombre para guardar tu puntaje</p>
        <input id="inputNombre" class="nombre-input" type="text" maxlength="20"
               placeholder="Tu nombre" autocomplete="off" autocapitalize="characters"
               autocorrect="off" spellcheck="false" enterkeyhint="go" inputmode="text">
        <button class="btn-grande btn-empezar pulso" type="button">EMPEZAR ▸</button>
        <button class="nombre-link btn-ver-ranking" type="button">🏆 Ver ranking</button>
      </div>`;

    const input = this.raiz.querySelector("#inputNombre");
    const empezar = () => {
      const val = (input.value || "").trim();
      this.jugador = val || "Invitado";
      Audio_.efecto("toque");
      this.mostrarMenu();
    };
    this.raiz.querySelector(".btn-empezar").addEventListener("click", empezar);
    input.addEventListener("keydown", (e) => { if (e.key === "Enter") empezar(); });
    this.raiz.querySelector(".btn-ver-ranking").addEventListener("click", () => {
      Audio_.efecto("toque");
      this.pantallaRanking();
    });
    // Enfoca el campo para abrir el teclado del tótem
    setTimeout(() => { try { input.focus(); } catch (e) {} }, 300);

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
        ${this.jugador ? `<p class="menu-jugador">Jugás: <b>${this._escapar(this.jugador)}</b></p>` : ""}
      </header>
      <div class="menu-cards">${cards}</div>
      <button class="btn-ranking" type="button">🏆 RANKING</button>
      <p class="firma firma-menu">${CONFIG.marca.subtitulo}</p>`;

    this.raiz.querySelectorAll(".menu-card").forEach((btn) => {
      btn.addEventListener("click", () => {
        Audio_.efecto("toque");
        this.abrirJuego(btn.dataset.juego);
      });
    });
    this.raiz.querySelector(".btn-ranking").addEventListener("click", () => {
      Audio_.efecto("toque");
      this.pantallaRanking();
    });
    this._reiniciarIdle();
  },

  /* ----------------- Pantalla de RANKING ----------------- */
  pantallaRanking() {
    this._limpiarJuego();
    this.modo = "ranking";
    this.raiz.className = "pantalla pantalla-ranking";

    const tabs = [
      ["general", "General"], ["preguntados", "Preguntados"],
      ["memotest", "Memotest"], ["atrapa", "Atrapa"]
    ];
    this.raiz.innerHTML = `
      <header class="ranking-header">
        <img class="logo-menu" src="${CONFIG.marca.logo}" alt="Arcor">
        <h1 class="menu-titulo">🏆 RANKING</h1>
      </header>
      <div class="ranking-chips">
        ${tabs.map(([k, l]) =>
          `<button class="chip ${k === this._rankingFiltro ? "activo" : ""}" data-f="${k}" type="button">${l}</button>`
        ).join("")}
      </div>
      <div class="ranking-lista" id="rankingLista"></div>
      <button class="btn-grande btn-secundario btn-volver-ranking" type="button">VOLVER</button>`;

    const pintarLista = () => {
      const juego = this._rankingFiltro === "general" ? null : this._rankingFiltro;
      const lista = (window.Ranking ? Ranking.top(10, juego) : []);
      const cont = this.raiz.querySelector("#rankingLista");
      if (!lista.length) {
        cont.innerHTML = `<p class="ranking-vacio">Todavía no hay puntajes.<br>¡Sé el primero! 🎃</p>`;
        return;
      }
      const medalla = ["🥇", "🥈", "🥉"];
      cont.innerHTML = lista.map((r, i) => `
        <div class="ranking-fila ${i < 3 ? "top" : ""}">
          <span class="ranking-pos">${medalla[i] || (i + 1)}</span>
          <span class="ranking-nombre">${this._escapar(r.nombre)}</span>
          <span class="ranking-pts">${r.puntaje}</span>
        </div>`).join("");
    };

    this.raiz.querySelectorAll(".ranking-chips .chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        Audio_.efecto("toque");
        this._rankingFiltro = chip.dataset.f;
        this.raiz.querySelectorAll(".ranking-chips .chip")
          .forEach((x) => x.classList.toggle("activo", x === chip));
        pintarLista();
      });
    });
    this.raiz.querySelector(".btn-volver-ranking").addEventListener("click", () => {
      Audio_.efecto("toque");
      this.mostrarMenu();
    });

    pintarLista();
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
  /* La invocan los juegos al terminar. Si el juego informa "puntaje" y "juego",
     se guarda automáticamente en el ranking a nombre del jugador actual. */
  pantallaResultado(contenedor, opts) {
    this.modo = "resultado";

    // Guardar en el ranking (si el juego lo informa)
    if (window.Ranking && opts.juego && typeof opts.puntaje === "number") {
      try { Ranking.guardar(this.jugador || "Invitado", opts.puntaje, opts.juego); } catch (e) {}
    }

    const lineas = opts.lineas.map((l) =>
      `<div class="res-linea"><span>${l.etiqueta}</span><b>${l.valor}</b></div>`).join("");
    contenedor.innerHTML = `
      <div class="resultado aparece">
        <div class="res-emoji">🎃</div>
        <h2 class="res-titulo">${opts.titulo}</h2>
        ${this.jugador ? `<p class="res-jugador">${this._escapar(this.jugador)}</p>` : ""}
        <div class="res-datos">${lineas}</div>
        <p class="res-mensaje">${opts.mensaje}</p>
        <div class="res-botones">
          <button class="btn-grande btn-reintentar" type="button">${CONFIG.textos.jugarOtraVez}</button>
          <button class="btn-grande btn-secundario btn-ranking-res" type="button">🏆 VER RANKING</button>
          <button class="btn-grande btn-secundario btn-menu" type="button">${CONFIG.textos.volverMenu}</button>
        </div>
      </div>`;
    contenedor.querySelector(".btn-reintentar").addEventListener("click", () => {
      Audio_.efecto("toque");
      this.modo = "jugando";
      if (this.idleId) { clearTimeout(this.idleId); this.idleId = null; }
      opts.onReintentar();
    });
    contenedor.querySelector(".btn-ranking-res").addEventListener("click", () => {
      Audio_.efecto("toque");
      this.pantallaRanking();
    });
    contenedor.querySelector(".btn-menu").addEventListener("click", () => {
      Audio_.efecto("toque");
      this.mostrarMenu();
    });
    this._reiniciarIdle();
  }
};

window.addEventListener("DOMContentLoaded", () => App.init());
