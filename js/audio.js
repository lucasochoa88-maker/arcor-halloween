/* =========================================================================
   GESTOR DE AUDIO — ARCOR HALLOWEEN CHALLENGE
   -------------------------------------------------------------------------
   - Música ambiente y efectos 100% SINTETIZADOS con Web Audio API.
     No usa archivos ni canciones comerciales: no hay riesgo de derechos.
   - Si la app no puede reproducir audio (navegador/dispositivo), el juego
     sigue funcionando perfecto: cada llamada está protegida con try/catch.
   - Si preferís una pista propia (con derechos), definí CONFIG.audio.pistaMusica
     con la ruta del archivo y se usará esa en lugar del ambiente sintetizado.
   - No se reproduce nada hasta la primera interacción del usuario (COMENZAR).
   ========================================================================= */

const Audio_ = {
  ctx: null,
  masterMusica: null,
  masterEfectos: null,
  silenciado: !CONFIG.audio.activoPorDefecto,
  musicaSonando: false,
  schedulerId: null,
  nextNoteTime: 0,
  paso: 0,
  htmlPista: null,

  /* Secuencia de notas (Hz) para el ambiente, tono menor "spooky" suave */
  secuencia: [220.00, 261.63, 329.63, 261.63, 293.66, 349.23, 293.66, 220.00],

  /* Crea el contexto solo cuando hay interacción del usuario */
  iniciar() {
    if (this.ctx) return true;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return false;
      this.ctx = new AC();
      this.masterMusica = this.ctx.createGain();
      this.masterMusica.gain.value = this.silenciado ? 0 : CONFIG.audio.volumenMusica;
      this.masterMusica.connect(this.ctx.destination);
      this.masterEfectos = this.ctx.createGain();
      this.masterEfectos.gain.value = this.silenciado ? 0 : CONFIG.audio.volumenEfectos;
      this.masterEfectos.connect(this.ctx.destination);
      return true;
    } catch (e) { return false; }
  },

  /* Debe llamarse en el primer toque (los navegadores exigen gesto previo) */
  desbloquear() {
    if (!this.iniciar()) return;
    try { if (this.ctx.state === "suspended") this.ctx.resume(); } catch (e) {}
  },

  silenciar(valor) {
    this.silenciado = valor;
    try {
      if (this.masterMusica) this.masterMusica.gain.value = valor ? 0 : CONFIG.audio.volumenMusica;
      if (this.masterEfectos) this.masterEfectos.gain.value = valor ? 0 : CONFIG.audio.volumenEfectos;
      if (this.htmlPista) this.htmlPista.muted = valor;
    } catch (e) {}
    return this.silenciado;
  },

  alternarSilencio() { return this.silenciar(!this.silenciado); },

  /* ---- Efectos de sonido sintetizados ---- */
  _tono(freq, dur, tipo, ganancia, slideTo) {
    if (!this.ctx || this.silenciado) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = tipo || "sine";
      osc.frequency.setValueAtTime(freq, t);
      if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(ganancia || 0.4, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      osc.connect(g); g.connect(this.masterEfectos);
      osc.start(t); osc.stop(t + dur + 0.02);
    } catch (e) {}
  },

  efecto(nombre) {
    if (!this.ctx) return;
    switch (nombre) {
      case "toque":    this._tono(520, 0.08, "triangle", 0.3); break;
      case "acierto":  this._tono(660, 0.12, "sine", 0.4); setTimeout(() => this._tono(880, 0.16, "sine", 0.4), 90); break;
      case "error":    this._tono(200, 0.25, "sawtooth", 0.3, 120); break;
      case "match":    this._tono(700, 0.1, "sine", 0.4); setTimeout(() => this._tono(1040, 0.14, "sine", 0.4), 90); break;
      case "fallo":    this._tono(240, 0.18, "triangle", 0.25); break;
      case "atrapar":  this._tono(760, 0.07, "square", 0.25, 1100); break;
      case "penal":    this._tono(170, 0.22, "sawtooth", 0.3, 90); break;
      case "ganar":
        [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => this._tono(f, 0.22, "sine", 0.4), i * 120));
        break;
      case "tic":      this._tono(900, 0.04, "square", 0.15); break;
    }
  },

  /* ---- Música ambiente ---- */
  iniciarMusica() {
    if (this.musicaSonando) return;
    // Pista propia opcional
    if (CONFIG.audio.pistaMusica) {
      try {
        if (!this.htmlPista) {
          this.htmlPista = new Audio(CONFIG.audio.pistaMusica);
          this.htmlPista.loop = true;
          this.htmlPista.volume = CONFIG.audio.volumenMusica;
        }
        this.htmlPista.muted = this.silenciado;
        this.htmlPista.play().catch(() => {});
        this.musicaSonando = true;
        return;
      } catch (e) { /* si falla, cae al ambiente sintetizado */ }
    }
    // Ambiente sintetizado
    if (!this.ctx) return;
    this.musicaSonando = true;
    this.paso = 0;
    this.nextNoteTime = this.ctx.currentTime + 0.1;
    const lookahead = () => {
      if (!this.musicaSonando) return;
      try {
        while (this.nextNoteTime < this.ctx.currentTime + 0.2) {
          this._notaAmbiente(this.secuencia[this.paso % this.secuencia.length], this.nextNoteTime);
          this.nextNoteTime += 0.5;
          this.paso++;
        }
      } catch (e) {}
      this.schedulerId = setTimeout(lookahead, 90);
    };
    lookahead();
  },

  _notaAmbiente(freq, cuando) {
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      const filtro = this.ctx.createBiquadFilter();
      filtro.type = "lowpass"; filtro.frequency.value = 900;
      osc.type = "triangle";
      osc.frequency.value = freq;
      g.gain.setValueAtTime(0.0001, cuando);
      g.gain.exponentialRampToValueAtTime(0.5, cuando + 0.05);
      g.gain.exponentialRampToValueAtTime(0.0001, cuando + 0.45);
      osc.connect(filtro); filtro.connect(g); g.connect(this.masterMusica);
      osc.start(cuando); osc.stop(cuando + 0.5);
    } catch (e) {}
  },

  detenerMusica() {
    this.musicaSonando = false;
    if (this.schedulerId) { clearTimeout(this.schedulerId); this.schedulerId = null; }
    if (this.htmlPista) { try { this.htmlPista.pause(); } catch (e) {} }
  }
};
