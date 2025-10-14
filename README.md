## SPEED Multimedia

SPEED Multimedia es la web de presentación y descarga del reproductor "SPEED" — una aplicación ligera para Windows diseñada para organizar y reproducir audio, vídeo, imágenes y documentos desde una interfaz sencilla y moderna.

Este repositorio contiene la web promocional, algunos recursos y la lógica del reproductor web incluido en la página.

### Qué hay aquí

- `index.html` – Página principal de la web (entrada). Contiene el reproductor en el pie de página, menús, modal de donaciones y secciones informativas.
- `JS/` – Lógica en JavaScript del sitio y del reproductor:
	- `logica.js` – Scripts generales: modales, efectos visuales, menú móvil, animaciones y UI.
	- `logica-player.js` – Lógica del reproductor (lista de reproducción, controles, arrastrar modal, manejo de archivos locales).
	- `contador-descargas.js` – (Contador de descargas u otros pequeños scripts).
- `estilos/` y `Dominios/` – Hojas de estilo CSS y recursos visuales para diferentes secciones y responsividad.
- `recursos/` – Imágenes, iconos, fondos, QR y activos multimedia usados por la web.

### Tecnologías

- HTML5, CSS3 y JavaScript (vanilla).
- Uso de APIs Web: `Audio`, `URL.createObjectURL`, `localStorage`, eventos DOM.
- Pequeñas dependencias externas incluidas vía CDN (p. ej. `canvas-confetti`).

### Cómo usar (desarrollo local / vista previa)

1. Clona o descarga el repositorio a tu equipo.
2. Abre `index.html` en tu navegador (Chrome/Edge/Firefox). No requiere servidor para la vista básica.

Nota: para sonido y acceso a archivos locales, el reproductor web usa `input[type=file]` y objetos `blob:` — funciona abriendo la página en el navegador desde disco. Si prefieres, puedes ejecutar un servidor estático local (por ejemplo `python -m http.server 8000`) y navegar a `http://localhost:8000`.

### Características principales

- Reproductor en la parte inferior con controles: play/pause, siguiente/anterior, mute, volumen, progreso y lista de reproducción.
- Arrastrado y manejo de la lista de reproducción (añade archivos desde el disco, se crean URLs `blob:` para reproducirlos).
- Modales interactivos: donaciones, compartir, lista de reproducción, y un carrusel promocional.
- Efectos visuales: confeti, animaciones de header, efecto de luz en el cursor, lluvia/partículas.

### Estructura de archivos (resumen)

Raíz:
- `index.html` — Página principal.
- `README.md` — Este archivo.
- `versions.txt` — Historial de versiones (si existe).

Carpetas:
- `JS/` — Scripts principales.
- `estilos/` — CSS del sitio y del reproductor.
- `recursos/` — Imágenes y activos.
- `Dominios/` — Páginas secundarias (descargas, guía, quejas, etc.).

### Buenas prácticas y notas técnicas

- El reproductor usa `URL.createObjectURL` para reproducir archivos locales; recuerda liberar URLs con `URL.revokeObjectURL` cuando ya no se necesiten (el código ya hace esto en varios puntos).
- Algunos paths de iconos en `logica-player.js` apuntan a `./JS/*` para imágenes (ej. `./JS/play.png`) — verifica que las rutas a `player/` o a `recursos/player/` concuerden con la estructura real.
- Para evitar problemas de CORS al probar assets remotos, sirve la carpeta con un servidor local en vez de abrir directamente como archivo si añades peticiones externas.

### Cómo contribuir

- Abrir un issue para describir bugs o sugerencias.
- Proponer cambios mediante pull requests en GitHub.
- Si vas a modificar el reproductor, añade pruebas manuales mínimas: reproducir, añadir/eliminar pistas y revisar revocación de blobs.

### Posibles mejoras (priorizadas)

1. Mover assets del reproductor a `recursos/player/` y unificar rutas en `logica-player.js` para evitar referencias rotas.
2. Añadir persistencia opcional de las pistas en `localStorage` (actualmente se almacenan a veces, revisar coherencia).
3. Extraer estilos y scripts a módulos más pequeños y añadir minificación/empacamiento para producción.
4. Soporte de subtítulos y metadatos (ID3) para archivos MP3.

### Licencia

El proyecto incluye un aviso en la web que indica derechos reservados; si quieres publicar este repositorio en GitHub con una licencia abierta añade un archivo `LICENSE` y decide la licencia apropiada (MIT, Apache-2.0, etc.).

---