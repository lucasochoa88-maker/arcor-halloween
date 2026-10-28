/* =========================================================================
   JUEGO 1 — PREGUNTADOS ARCOR
   ========================================================================= */
const JuegoPreguntados = {
  api: null,
  cont: null,
  preguntas: [],
  indice: 0,
  puntaje: 0,
  bloqueado: false,
  timeout: null,

  iniciar(contenedor, api) {
    this.api = api;
    this.cont = contenedor;
    const cfg = CONFIG.preguntados;
    const cantidad = Math.min(cfg.preguntasPorPartida, PREGUNTAS.length);
    this.preguntas = Utils.mezclar(PREGUNTAS).slice(0, cantidad);
    this.indice = 0;
    this.puntaje = 0;
    this.bloqueado = false;
    this._pintarPregunta();
  },

  _pintarPregunta() {
    this.bloqueado = false;
    const q = this.preguntas[this.indice];
    const total = this.preguntas.length;
    const opciones = Utils.mezclar(q.o);

    this.cont.innerHTML = "";
    const wrap = Utils.crear("div", "preg-wrap");

    // Barra superior: progreso + puntaje
    const top = Utils.crear("div", "preg-top");
    top.appendChild(Utils.crear("div", "preg-progreso", { text: `Pregunta ${this.indice + 1}/${total}` }));
    top.appendChild(Utils.crear("div", "preg-puntaje", { html: `★ <b>${this.puntaje}</b>` }));
    wrap.appendChild(top);

    // Barra de avance
    const barra = Utils.crear("div", "preg-barra");
    const relleno = Utils.crear("div", "preg-barra-relleno");
    relleno.style.width = `${(this.indice / total) * 100}%`;
    barra.appendChild(relleno);
    wrap.appendChild(barra);

    // Pregunta
    const card = Utils.crear("div", "preg-card");
    card.appendChild(Utils.crear("div", "preg-categoria", { text: q.cat }));
    card.appendChild(Utils.crear("h2", "preg-texto", { text: q.p }));
    wrap.appendChild(card);

    // Opciones
    const grid = Utils.crear("div", "preg-opciones");
    opciones.forEach((op) => {
      const btn = Utils.crear("button", "btn-opcion", { text: op, type: "button" });
      btn.addEventListener("click", () => this._responder(btn, op, q));
      grid.appendChild(btn);
    });
    wrap.appendChild(grid);

    // Zona de explicación (vacía al inicio)
    this.zonaExpl = Utils.crear("div", "preg-explicacion");
    wrap.appendChild(this.zonaExpl);

    this.cont.appendChild(wrap);
  },

  _responder(btn, elegida, q) {
    if (this.bloqueado) return;
    this.bloqueado = true;
    const correcta = elegida === q.r;

    const botones = this.cont.querySelectorAll(".btn-opcion");
    botones.forEach((b) => {
      b.disabled = true;
      if (b.textContent === q.r) b.classList.add("correcta");
    });
    if (!correcta) btn.classList.add("incorrecta");

    if (correcta) {
      this.puntaje += CONFIG.preguntados.puntosPorAcierto;
      Audio_.efecto("acierto");
    } else {
      Audio_.efecto("error");
    }

    // Explicación
    this.zonaExpl.innerHTML =
      `<span class="expl-${correcta ? "ok" : "mal"}">${correcta ? "¡Correcto!" : "¡Casi!"}</span> ${q.e}`;
    this.zonaExpl.classList.add("visible");

    this.timeout = setTimeout(() => {
      this.indice++;
      if (this.indice < this.preguntas.length) this._pintarPregunta();
      else this._resultado();
    }, CONFIG.preguntados.msAntesDeAvanzar);
  },

  _resultado() {
    const total = this.preguntas.length;
    const aciertos = this.puntaje / CONFIG.preguntados.puntosPorAcierto;
    const ratio = aciertos / total;
    let msg;
    if (ratio === 1) msg = "¡Genio total! Nivel maestro candy 🍬";
    else if (ratio >= 0.7) msg = "¡Excelente! Sabés un montón de Arcor 👏";
    else if (ratio >= 0.4) msg = "¡Muy bien! Vas por buen camino 🎃";
    else msg = "¡Seguí jugando y te hacés experto! 👻";

    this.cont.innerHTML = "";
    App.pantallaResultado(this.cont, {
      titulo: "PREGUNTADOS ARCOR",
      lineas: [
        { etiqueta: "Puntaje", valor: this.puntaje },
        { etiqueta: "Aciertos", valor: `${aciertos}/${total}` }
      ],
      mensaje: msg,
      onReintentar: () => this.iniciar(this.cont, this.api)
    });
    Audio_.efecto("ganar");
  },

  detener() {
    if (this.timeout) { clearTimeout(this.timeout); this.timeout = null; }
  }
};
