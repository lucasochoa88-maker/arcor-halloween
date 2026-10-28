/* ============================================================
   ranking.js  —  Ranking de jugadores (Arcor Halloween Challenge)
   Guarda los puntajes en el propio dispositivo (localStorage).
   Pensado para UN tótem. No necesita internet ni servidor.
   ============================================================ */
(function (global) {
  'use strict';

  var CLAVE = 'arcor_halloween_ranking';
  var MAX_GUARDADOS = 200; // cuántos registros conservamos como máximo

  function leerTodo() {
    try {
      var raw = localStorage.getItem(CLAVE);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function escribirTodo(lista) {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(lista));
      return true;
    } catch (e) {
      return false; // por ej. almacenamiento lleno o bloqueado
    }
  }

  /* Guarda un puntaje.
     nombre  : texto del jugador
     puntaje : número
     juego   : 'preguntados' | 'memotest' | 'atrapa' | 'general' (opcional) */
  function guardar(nombre, puntaje, juego) {
    nombre = (nombre || 'Invitado').toString().trim().slice(0, 20) || 'Invitado';
    puntaje = Number(puntaje) || 0;

    var lista = leerTodo();
    lista.push({
      nombre: nombre,
      puntaje: puntaje,
      juego: juego || 'general',
      fecha: Date.now()
    });

    lista.sort(function (a, b) { return b.puntaje - a.puntaje; });
    lista = lista.slice(0, MAX_GUARDADOS);
    escribirTodo(lista);
    return lista;
  }

  /* Devuelve el top N (opcionalmente filtrado por juego).
     Ej: Ranking.top(10)  |  Ranking.top(5, 'memotest') */
  function top(n, juego) {
    n = n || 10;
    var lista = leerTodo();
    if (juego) {
      lista = lista.filter(function (r) { return r.juego === juego; });
    }
    lista.sort(function (a, b) { return b.puntaje - a.puntaje; });
    return lista.slice(0, n);
  }

  /* Borra todo el ranking (útil para un botón oculto de "reiniciar evento"). */
  function limpiar() {
    try { localStorage.removeItem(CLAVE); } catch (e) {}
  }

  // Disponible como window.Ranking para usarlo desde app.js
  global.Ranking = {
    guardar: guardar,
    top: top,
    limpiar: limpiar,
    leerTodo: leerTodo
  };
})(window);
