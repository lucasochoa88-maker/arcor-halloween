/* =========================================================================
   JUEGO 3 — ATRAPA LAS GOLOSINAS
   -------------------------------------------------------------------------
   Las golosinas son ilustraciones GENÉRICAS (SVG propio), no reproducen
   envases ni marcas reales de Arcor, para no confundir con productos
   oficiales. Los penalizadores son elementos de Halloween.
   ========================================================================= */
const JuegoAtrapa = {
  api: null, cont: null, area: null,
  puntaje: 0, tiempoRestante: 0, spawnMs: 0,
  spawnId: null, relojId: null, activos: new Set(), jugando: false,

  // Golosinas genéricas (suman)
  golosinas: [
    // caramelo envuelto
    `<svg viewBox="0 0 100 100"><g><path d="M20 50 L2 38 L8 50 L2 62 Z" fill="#8E4FC0"/><path d="M80 50 L98 38 L92 50 L98 62 Z" fill="#8E4FC0"/><ellipse cx="50" cy="50" rx="30" ry="24" fill="#F7941D"/><ellipse cx="50" cy="50" rx="30" ry="24" fill="none" stroke="#E8601C" stroke-width="3"/><path d="M38 40 Q50 50 62 40 M38 60 Q50 50 62 60" stroke="#fff" stroke-width="3" fill="none" opacity=".8"/></g></svg>`,
    // chupetín
    `<svg viewBox="0 0 100 100"><rect x="47" y="50" width="6" height="42" rx="3" fill="#eee"/><circle cx="50" cy="38" r="26" fill="#ED1C24"/><path d="M50 38 m-20 0 a20 20 0 0 1 40 0" fill="none" stroke="#fff" stroke-width="4" opacity=".7"/><path d="M38 28 Q50 20 62 30" stroke="#fff" stroke-width="3" fill="none" opacity=".6"/></svg>`,
    // bombón
    `<svg viewBox="0 0 100 100"><path d="M22 70 L50 24 L78 70 Z" fill="#7a3a12"/><path d="M22 70 L50 24 L50 70 Z" fill="#5c2a0c"/><ellipse cx="50" cy="70" rx="28" ry="8" fill="#8a4518"/><circle cx="50" cy="40" r="6" fill="#F7941D"/></svg>`,
    // gomita
    `<svg viewBox="0 0 100 100"><path d="M30 78 Q22 40 50 22 Q78 40 70 78 Q50 70 30 78Z" fill="#36C06B"/><circle cx="42" cy="46" r="4" fill="#fff" opacity=".8"/><path d="M38 70 Q50 64 62 70" stroke="#1e8f4c" stroke-width="3" fill="none"/></svg>`
  ],

  // Penalizadores (restan)
  penalizadores: [
    // murciélago
    `<svg viewBox="0 0 100 100"><path d="M50 40 C40 25 25 30 20 45 C30 42 34 50 38 58 C42 50 46 52 50 60 C54 52 58 50 62 58 C66 50 70 42 80 45 C75 30 60 25 50 40Z" fill="#3A1A5B"/><circle cx="45" cy="46" r="2.5" fill="#ED1C24"/><circle cx="55" cy="46" r="2.5" fill="#ED1C24"/></svg>`,
    // araña
    `<svg viewBox="0 0 100 100"><g stroke="#2b1240" stroke-width="4" fill="none"><path d="M50 50 L26 34 M50 50 L22 50 M50 50 L26 66 M50 50 L74 34 M50 50 L78 50 M50 50 L74 66"/></g><circle cx="50" cy="52" r="14" fill="#2b1240"/><circle cx="50" cy="40" r="8" fill="#2b1240"/><circle cx="46" cy="38" r="2" fill="#ED1C24"/><circle cx="54" cy="38" r="2" fill="#ED1C24"/></svg>`,
    // calavera
    `<svg viewBox="0 0 100 100"><path d="M30 44 a20 20 0 0 1 40 0 v14 q0 10 -10 12 l0 6 h-20 l0 -6 q-10 -2 -10 -12Z" fill="#ece9e0"/><circle cx="41" cy="48" r="6" fill="#2b1240"/><circle cx="59" cy="48" r="6" fill="#2b1240"/><path d="M50 56 l-4 8 h8Z" fill="#2b1240"/></svg>`
  ],

  iniciar(contenedor, api) {
    this.api = api; this.cont = contenedor;
    const c = CONFIG.atrapa;
    this.puntaje = 0;
    this.tiempoRestante = c.duracionSeg;
    this.spawnMs = c.spawnInicialMs;
    this.activos = new Set();
    this.jugando = true;

    this.cont.innerHTML = "";
    const wrap = Utils.crear("div", "atrapa-wrap");

    const hud = Utils.crear("div", "atrapa-hud");
    this.elTiempo = Utils.crear("div", "atrapa-tiempo", { html: `⏱ <b>${this.tiempoRestante}</b>` });
    this.elPuntaje = Utils.crear("div", "atrapa-puntaje", { html: `★ <b>0</b>` });
    hud.appendChild(this.elTiempo); hud.appendChild(this.elPuntaje);
    wrap.appendChild(hud);

    this.area = Utils.crear("div", "atrapa-area");
    wrap.appendChild(this.area);
    this.cont.appendChild(wrap);

    // Pequeña cuenta regresiva antes de arrancar para que la vista se estabilice
    this._reloj();
    this._programarSpawn();
  },

  _programarSpawn() {
    if (!this.jugando) return;
    this._spawn();
    const c = CONFIG.atrapa;
    this.spawnMs = Math.max(c.spawnMinimoMs, this.spawnMs - c.aceleracionMs);
    this.spawnId = setTimeout(() => this._programarSpawn(), this.spawnMs);
  },

  _spawn() {
    if (!this.jugando || !this.area) return;
    const c = CONFIG.atrapa;
    const esPenal = Math.random() < c.probabilidadPenal;
    const tam = Utils.entero(66, 92);

    const w = this.area.clientWidth, h = this.area.clientHeight;
    if (w < 40 || h < 40) return;
    const x = Utils.entero(6, Math.max(6, w - tam - 6));
    const y = Utils.entero(6, Math.max(6, h - tam - 6));

    const el = Utils.crear("button", "atrapa-item" + (esPenal ? " penal" : ""), { type: "button" });
    el.style.width = el.style.height = tam + "px";
    el.style.left = x + "px"; el.style.top = y + "px";
    const set = esPenal ? this.penalizadores : this.golosinas;
    el.innerHTML = set[Utils.entero(0, set.length - 1)];

    let contado = false;
    const quitar = () => {
      if (el._vida) { clearTimeout(el._vida); el._vida = null; }
      el.remove(); this.activos.delete(el);
    };
    el.addEventListener("click", (ev) => {
      ev.stopPropagation();
      if (contado || !this.jugando) return;
      contado = true;
      if (esPenal) {
        this.puntaje = Math.max(0, this.puntaje - c.puntosPenalizacion);
        Audio_.efecto("penal");
        this._popup(x + tam / 2, y, `-${c.puntosPenalizacion}`, false);
      } else {
        this.puntaje += c.puntosGolosina;
        Audio_.efecto("atrapar");
        this._popup(x + tam / 2, y, `+${c.puntosGolosina}`, true);
      }
      this.elPuntaje.innerHTML = `★ <b>${this.puntaje}</b>`;
      el.classList.add("tocado");
      setTimeout(quitar, 160);
    });

    el._vida = setTimeout(quitar, c.vidaElementoMs);
    this.activos.add(el);
    this.area.appendChild(el);
  },

  _popup(x, y, texto, positivo) {
    if (!this.area) return;
    const p = Utils.crear("div", "atrapa-pop " + (positivo ? "pos" : "neg"), { text: texto });
    p.style.left = x + "px"; p.style.top = y + "px";
    this.area.appendChild(p);
    setTimeout(() => p.remove(), 700);
  },

  _reloj() {
    this.relojId = setInterval(() => {
      this.tiempoRestante--;
      this.elTiempo.innerHTML = `⏱ <b>${Math.max(0, this.tiempoRestante)}</b>`;
      if (this.tiempoRestante <= 5 && this.tiempoRestante > 0) Audio_.efecto("tic");
      if (this.tiempoRestante <= 0) this._finalizar();
    }, 1000);
  },

  _finalizar() {
    this.jugando = false;
    this._limpiarMoviles();
    if (this.relojId) { clearInterval(this.relojId); this.relojId = null; }
    if (this.spawnId) { clearTimeout(this.spawnId); this.spawnId = null; }
    Audio_.efecto("ganar");

    let msg;
    if (this.puntaje >= 200) msg = "¡Reflejos de otro mundo! 👻";
    else if (this.puntaje >= 120) msg = "¡Muy buena cosecha de golosinas! 🍬";
    else if (this.puntaje >= 50) msg = "¡Bien! La próxima, más rápido 🎃";
    else msg = "¡Seguí practicando, se viene lo bueno! 🦇";

    App.pantallaResultado(this.cont, {
      titulo: "ATRAPA LAS GOLOSINAS",
      lineas: [{ etiqueta: "Puntaje", valor: this.puntaje }],
      mensaje: msg,
      onReintentar: () => this.iniciar(this.cont, this.api)
    });
  },

  _limpiarMoviles() {
    this.activos.forEach((el) => { if (el._vida) clearTimeout(el._vida); el.remove(); });
    this.activos.clear();
  },

  detener() {
    this.jugando = false;
    this._limpiarMoviles();
    if (this.relojId) { clearInterval(this.relojId); this.relojId = null; }
    if (this.spawnId) { clearTimeout(this.spawnId); this.spawnId = null; }
  }
};
