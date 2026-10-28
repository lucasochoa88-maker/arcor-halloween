/* =========================================================================
   JUEGO 2 — MEMOTEST ARCOR
   ========================================================================= */
const JuegoMemotest = {
  api: null,
  cont: null,
  dificultad: CONFIG.memotest.dificultadInicial,
  primera: null,
  segunda: null,
  bloqueado: false,
  encontrados: 0,
  movimientos: 0,
  tiempoInicio: 0,
  intervalo: null,
  timeout: null,

  iniciar(contenedor, api) {
    this.api = api;
    this.cont = contenedor;
    this._pintar();
  },

  _pintar() {
    const cfg = CONFIG.memotest;
    const pares = cfg.pares[this.dificultad];
    const columnas = pares / 2; // asegura 4 filas en todas las dificultades

    this.primera = null; this.segunda = null;
    this.bloqueado = false; this.encontrados = 0; this.movimientos = 0;
    this._pararReloj();

    // Mazo: tomo las primeras N caras, duplico y mezclo
    const caras = cfg.caras.slice(0, pares);
    let mazo = [];
    caras.forEach((c, i) => { mazo.push({ id: i, ...c }); mazo.push({ id: i, ...c }); });
    mazo = Utils.mezclar(mazo);

    this.cont.innerHTML = "";
    const wrap = Utils.crear("div", "memo-wrap");

    // Top: selector de dificultad + stats
    const top = Utils.crear("div", "memo-top");
    const selector = Utils.crear("div", "memo-dificultad");
    [["facil", "Fácil"], ["medio", "Medio"], ["dificil", "Difícil"]].forEach(([k, label]) => {
      const b = Utils.crear("button", "chip" + (k === this.dificultad ? " activo" : ""), { text: label, type: "button" });
      b.addEventListener("click", () => { Audio_.efecto("toque"); this.dificultad = k; this._pintar(); });
      selector.appendChild(b);
    });
    top.appendChild(selector);

    const stats = Utils.crear("div", "memo-stats");
    this.elMov = Utils.crear("span", "memo-stat", { html: "Movimientos: <b>0</b>" });
    this.elTiempo = Utils.crear("span", "memo-stat", { html: "Tiempo: <b>0s</b>" });
    stats.appendChild(this.elMov); stats.appendChild(this.elTiempo);
    top.appendChild(stats);
    wrap.appendChild(top);

    // Tablero
    const tablero = Utils.crear("div", "memo-tablero");
    tablero.style.gridTemplateColumns = `repeat(${columnas}, 1fr)`;
    mazo.forEach((carta) => {
      const el = Utils.crear("button", "memo-carta", { type: "button" });
      el.innerHTML = `
        <div class="memo-cara memo-dorso"><img src="${cfg.dorsoLogo}" alt="Arcor"></div>
        <div class="memo-cara memo-frente"><img src="${carta.src}" alt="${carta.alt}"></div>`;
      el.dataset.id = carta.id;
      el.addEventListener("click", () => this._voltear(el));
      tablero.appendChild(el);
    });
    wrap.appendChild(tablero);
    this.cont.appendChild(wrap);
    this.totalPares = pares;
  },

  _voltear(el) {
    if (this.bloqueado) return;
    if (el.classList.contains("abierta") || el.classList.contains("hecha")) return;

    el.classList.add("abierta");
    Audio_.efecto("toque");

    // Inicia el reloj en el primer movimiento
    if (!this.intervalo && !this.tiempoInicio) this._arrancarReloj();

    if (!this.primera) { this.primera = el; return; }

    this.segunda = el;
    this.bloqueado = true;
    this.movimientos++;
    this.elMov.innerHTML = `Movimientos: <b>${this.movimientos}</b>`;

    if (this.primera.dataset.id === this.segunda.dataset.id) {
      // Par encontrado
      this.timeout = setTimeout(() => {
        this.primera.classList.add("hecha");
        this.segunda.classList.add("hecha");
        Audio_.efecto("match");
        this.encontrados++;
        this._reset();
        if (this.encontrados === this.totalPares) this._ganar();
      }, 350);
    } else {
      // No coinciden: ocultar tras pausa
      Audio_.efecto("fallo");
      this.timeout = setTimeout(() => {
        this.primera.classList.remove("abierta");
        this.segunda.classList.remove("abierta");
        this._reset();
      }, CONFIG.memotest.msVueltaAtras);
    }
  },

  _reset() { this.primera = null; this.segunda = null; this.bloqueado = false; },

  _arrancarReloj() {
    this.tiempoInicio = Date.now();
    this.intervalo = setInterval(() => {
      const ms = Date.now() - this.tiempoInicio;
      this.elTiempo.innerHTML = `Tiempo: <b>${Utils.formatearTiempo(ms)}</b>`;
    }, 500);
  },

  _pararReloj() {
    if (this.intervalo) { clearInterval(this.intervalo); this.intervalo = null; }
    this.tiempoInicio = 0;
  },

  _ganar() {
    const ms = Date.now() - (this.tiempoInicio || Date.now());
    this._pararReloj();
    Audio_.efecto("ganar");

    // Puntaje para el ranking: base por dificultad, menos movimientos de más
    // (más allá del mínimo posible) y menos tiempo. Nunca baja de 10.
    const pares = this.totalPares || 0;
    const seg = Math.floor(ms / 1000);
    const movDeMas = Math.max(0, this.movimientos - pares);
    const puntaje = Math.max(10, pares * 100 - movDeMas * 10 - seg * 2);

    App.pantallaResultado(this.cont, {
      titulo: "MEMOTEST ARCOR",
      juego: "memotest",
      puntaje: puntaje,
      lineas: [
        { etiqueta: "Puntaje", valor: puntaje },
        { etiqueta: "Movimientos", valor: this.movimientos },
        { etiqueta: "Tiempo", valor: Utils.formatearTiempo(ms) }
      ],
      mensaje: "¡Encontraste todos los pares! 🎉",
      onReintentar: () => this._pintar()
    });
  },

  detener() {
    this._pararReloj();
    if (this.timeout) { clearTimeout(this.timeout); this.timeout = null; }
  }
};
