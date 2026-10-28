# ARCOR HALLOWEEN CHALLENGE

Aplicación web interactiva para un **tótem táctil vertical (Android)**, pensada
para una activación corporativa de Halloween de Arcor — *De Fiesta Se Trata*.

Incluye tres juegos funcionando de principio a fin, con puntajes, animaciones,
sonido sintetizado, navegación y pantallas de resultados:

1. **Preguntados Arcor** — trivia de 4 opciones (datos corporativos verificados).
2. **Memotest Arcor** — memoria visual con 3 niveles (Fácil / Medio / Difícil).
3. **Atrapa las Golosinas** — minijuego táctil de reflejos de 30 segundos.

Es un sitio **100% estático**: HTML + CSS + JavaScript puro, sin framework, sin
base de datos, sin APIs externas y sin dependencias de servicios pagos.

---

## 1. Estructura del proyecto

```
arcor-halloween-challenge/
├── index.html                 Punto de entrada
├── css/
│   └── estilos.css            Todos los estilos
├── js/
│   ├── config.js              ← CONFIGURACIÓN CENTRAL (editá esto)
│   ├── preguntas.js           ← Banco de preguntas (editá esto)
│   ├── utils.js               Utilidades compartidas
│   ├── audio.js               Música y efectos (Web Audio API)
│   ├── juego-preguntados.js   Juego 1
│   ├── juego-memotest.js      Juego 2
│   ├── juego-atrapa.js        Juego 3
│   └── app.js                 Navegación, pantallas e inactividad
├── assets/
│   ├── img/                   Logo, personajes y props de campaña
│   ├── fonts/                 Tipografías locales (.woff2, offline)
│   └── audio/                 (vacío — ver sección Audio)
├── README.md                  Este archivo
└── PRUEBAS.md                 Lista de pruebas y resultados
```

---

## 2. ¿Por qué sin framework?

Se eligió **JavaScript puro** a propósito:

- El tótem solo necesita un sitio estático liviano; un framework (React, Vue,
  etc.) agregaría peso, build y complejidad sin ningún beneficio real aquí.
- Al no haber proceso de compilación, **cualquiera puede editar y publicar** los
  archivos tal cual, sin instalar herramientas.
- Carga más rápido y consume menos memoria en el navegador Android del tótem.

Todo el peso de recursos (imágenes + fuentes) es de **~340 KB**.

---

## 3. Ejecutar la aplicación localmente

La app necesita servirse por **HTTP** (no abrir `index.html` con doble clic como
`file://`, porque los navegadores bloquean la carga de las fuentes `.woff2` y de
algunos recursos bajo ese esquema).

### Opción A — Python (ya viene en Mac/Linux y en muchos Windows)
```bash
cd arcor-halloween-challenge
python3 -m http.server 8080
```
Luego abrir en el navegador: `http://localhost:8080`

### Opción B — Node.js
```bash
cd arcor-halloween-challenge
npx serve .
```

### Opción C — Extensión "Live Server" de VS Code
Clic derecho sobre `index.html` → *Open with Live Server*.

---

## 4. Publicar en un servidor

Al ser un sitio estático, **se publica copiando la carpeta completa** a cualquier
hosting de archivos estáticos. No requiere servidor de aplicaciones, Node, PHP,
ni base de datos.

**Pasos para el responsable del servidor:**

1. Copiar **todo el contenido** de la carpeta `arcor-halloween-challenge/` a la
   raíz del sitio (o a un subdirectorio, por ej. `/halloween/`).
2. Asegurarse de **mantener la estructura de carpetas** (`css/`, `js/`,
   `assets/`), ya que las rutas son relativas.
3. Verificar que el servidor sirva los tipos MIME correctos (la mayoría ya lo
   hace). Si las fuentes no cargaran, agregar:
   `.woff2 → font/woff2`
4. Entrar a la URL pública y confirmar que aparece la pantalla de bienvenida.

**Opciones de hosting válidas:** Nginx/Apache sobre cualquier VPS, Amazon S3 +
CloudFront, Netlify, Vercel, GitHub Pages, Cloudflare Pages, Firebase Hosting,
o cualquier carpeta pública de un servidor web.

**Requisitos de alojamiento (mínimos):**
- Servir archivos estáticos por HTTP/HTTPS.
- ~1 MB de espacio en disco.
- No requiere backend, dominio especial, ni certificados particulares
  (aunque se recomienda HTTPS; el audio por Web Audio funciona en ambos).

---

## 5. Probar que funciona desde Android (en el tótem)

1. Conectar el tótem a internet (o a la red donde esté publicada la app).
2. Abrir el navegador (Chrome para Android recomendado) e ir a la URL.
3. Tocar **COMENZAR** (el audio se habilita recién con ese primer toque; es un
   requisito de los navegadores, no un error).
4. Recorrer los tres juegos, jugar una partida de cada uno y volver al menú.
5. Comprobar que los botones son grandes y cómodos de tocar, que no hay zoom al
   tocar dos veces, y que la pantalla no se desplaza.

> La lista completa de verificaciones está en **PRUEBAS.md**.

### Modo pantalla completa / quiosco (opcional, recomendado para el evento)

Esto depende del **dispositivo**, no de la app. La aplicación **no puede** por sí
sola impedir que alguien salga del navegador: eso requiere configurar el tótem.

Opciones habituales en Android:
- **Chrome "Agregar a pantalla de inicio":** abre la app a pantalla casi completa
  sin barra de direcciones.
- **Apps de modo quiosco** (por ej. *Fully Kiosk Browser*, *Scalefusion*,
  *SureLock*): permiten abrir la URL a pantalla completa, bloquear la salida,
  ocultar la barra de estado y reiniciar ante inactividad.
- **Fijar pantalla (Screen Pinning)** de Android: *Ajustes → Seguridad → Fijar
  pantalla*, para que no se pueda salir sin PIN.

Configurá la que prefiera el responsable del dispositivo apuntando a la URL donde
quedó publicada la app.

---

## 6. Personalización (sin tocar la lógica)

Casi todo se cambia desde **dos archivos**:

### `js/config.js`
- **Colores** de la campaña (se aplican a toda la interfaz).
- **Textos** de bienvenida, menú y botones.
- **Tiempos de inactividad** (volver al menú / a la bienvenida).
- **Duración, puntajes y dificultad** de cada juego.
- **Imágenes** (logo, íconos de los juegos, caras del memotest).
- **Audio** (volumen, y ruta a una pista propia si se quisiera).

### `js/preguntas.js`
- Agregar, quitar o editar preguntas copiando el formato de cualquier bloque.
  Cada pregunta define: texto, opciones, respuesta correcta y explicación.

Para **reemplazar imágenes**, dejá el archivo nuevo en `assets/img/` con el mismo
nombre, o actualizá la ruta en `config.js`.

> La idea es poder reutilizar esta base para futuras acciones de *De Fiesta Se
> Trata* cambiando config + imágenes, sin reconstruir los juegos.

---

## 7. Audio

La música ambiente y los efectos están **sintetizados en vivo con la Web Audio
API**: no se usan archivos ni canciones comerciales, así que **no hay riesgo de
derechos** y no hace falta cargar nada.

- No se reproduce nada antes del primer toque (COMENZAR).
- Hay un **botón de audio** visible en todas las pantallas para activar/silenciar.
- Si el navegador bloquea el sonido, **el juego sigue funcionando igual**.

**¿Querés usar una pista de música propia (con derechos)?**
1. Colocá el archivo (mp3/ogg) en `assets/audio/`, por ej. `ambiente.mp3`.
2. En `js/config.js`, dentro de `audio`, escribí:
   `pistaMusica: "assets/audio/ambiente.mp3"`
3. Esa pista reemplazará al ambiente sintetizado.

---

## 8. Recursos oficiales pendientes de incorporar

El proyecto usa los recursos reales de campaña que se proporcionaron. Queda **un
único recurso recomendado** para reemplazar por su versión oficial:

- **Logo Arcor en alta (PNG/SVG con fondo transparente).** El logo actual
  (`assets/img/logo-arcor.png`) fue recortado de las imágenes de campaña. Si se
  dispone del archivo oficial del logo, reemplazarlo por esa versión mejora la
  nitidez. **No modificar el logo**; solo sustituir el archivo.

Opcionales (no imprescindibles):
- Imágenes de producto oficiales en alta, si se quisieran sumar a futuras
  versiones del memotest (hoy se usan personajes de campaña, no envases).
- Una pista de música propia, si se prefiere en lugar del ambiente sintetizado.

---

## 9. Notas técnicas

- Compatible con navegadores modernos de Android (Chrome, y navegadores basados
  en Chromium/WebView actuales).
- Diseño adaptable a resolución vertical; se reacomoda ante cambios de tamaño y
  orientación sin recargar la página.
- No recarga la página entre partidas; limpia temporizadores, sonidos y
  animaciones al cambiar de pantalla.
- Evita scroll, zoom por doble toque y selección de texto accidental.
- Respeta la preferencia de "movimiento reducido" del sistema.
