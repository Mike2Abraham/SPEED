const navbar = document.querySelector('.navbar');
const cartelon = document.getElementById('cartelon');
const animados = document.querySelectorAll('.aparece');

let lastScrollY = window.scrollY;

// CONFIGURACIÓN
const maxHeight = 590; // Altura máxima del header
const minHeight = 70;  // Altura mínima contraído
const limiteContraccion = 300; // scrollY hasta dónde se contrae

function ajustarNavbar() {
  const scrollY = window.scrollY;

  // Cálculo progresivo de altura
  let nuevaAltura = maxHeight - (scrollY * ((maxHeight - minHeight) / limiteContraccion));
  nuevaAltura = Math.max(minHeight, Math.min(maxHeight, nuevaAltura));
  navbar.style.height = `${nuevaAltura}px`;

  // Mostrar u ocultar cartelón (solo si header está expandido)
  if (scrollY > 150 && cartelon) {
    cartelon.classList.add('oculto');
  } else if (scrollY < 100 && cartelon) {
    cartelon.classList.remove('oculto');
  }

  // Mostrar/ocultar menú según el estado
  if (nuevaAltura <= minHeight + 10) {
    navbar.classList.add('contraido');
  } else {
    navbar.classList.remove('contraido');
  }

  if (navbar) {
    navbar.style.height = `${nuevaAltura}px`;
  
    // Mostrar logo y título solo si el header está contraído
    if (nuevaAltura <= minHeight + 10) {
      navbar.classList.add('contraido');
    } else {
      navbar.classList.remove('contraido');
    }
  }
}

function animarContenidoVisible() {
  const trigger = window.innerHeight * 0.85;

  animados.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < trigger) {
      el.classList.add('visible');
    } else {
      el.classList.remove('visible');
    }
  });
}

// Eventos
window.addEventListener('scroll', () => {
  ajustarNavbar();
  animarContenidoVisible();
});

window.addEventListener('load', () => {
  ajustarNavbar();
  animarContenidoVisible();
});


//js para el cursor de luz
document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.querySelector('.navbar');
  const cursorLight = document.querySelector('.cursor-light');
  
  if (!navbar || !cursorLight) return;

  // Configuración inicial
  let isInsideNavbar = false;

  // Mueve la luz con el cursor
  document.addEventListener('mousemove', (e) => {
    const rect = navbar.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Verifica si el cursor está dentro del header
    const isInside = (
      x >= 0 && x <= rect.width &&
      y >= 0 && y <= rect.height
    );

    if (isInside) {
      cursorLight.style.opacity = '1';
      cursorLight.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      isInsideNavbar = true;
    } else if (isInsideNavbar) {
      cursorLight.style.opacity = '0';
      isInsideNavbar = false;
    }
  });

  

  // Opcional: Suavizar entrada/salida
  navbar.addEventListener('mouseenter', () => {
    cursorLight.style.transition = 'opacity 0.3s ease';
  });
});

//logica para el boton de subida usando Sempou!
const toTopBtn = document.querySelector('.to-top-btn');

function toggleToTopButton() {
  const scrollHeight = document.documentElement.scrollHeight;
  const scrollPosition = window.innerHeight + window.scrollY;
  
  if (scrollPosition >= scrollHeight - 100) {
    toTopBtn.classList.remove('hidden');
  } else {
    toTopBtn.classList.add('hidden');
  }
}

toTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

window.addEventListener('scroll', toggleToTopButton);
window.addEventListener('resize', toggleToTopButton); // Para responsiveness

// Función para alternar el menú (solo en móvil)
function toggleMenu() {
  const menu = document.querySelector('.menu');
  if (window.innerWidth <= 768) { // Solo si es móvil
    menu.classList.toggle('active');
  }
}

// Abrir/cerrar menú móvil
// Menú móvil
const hamburgerBtn = document.querySelector('.hamburger-btn');
const closeBtn = document.querySelector('.close-btn');
const mobileMenu = document.querySelector('.mobile-menu');
const overlay = document.querySelector('.mobile-menu-overlay');

if(hamburgerBtn && mobileMenu) {
  hamburgerBtn.addEventListener('click', () => {
    mobileMenu.classList.add('active');
    overlay.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Bloquear scroll
  });

  closeBtn.addEventListener('click', closeMobileMenu);
  overlay.addEventListener('click', closeMobileMenu);

  function closeMobileMenu() {
    mobileMenu.classList.remove('active');
    overlay.style.display = 'none';
    document.body.style.overflow = ''; // Restaurar scroll
  }
}


/**
 * Generador dinámico de modales de donaciones
 * Uso: 
 * 1. Incluir este script en tu HTML
 * 2. Llamar a initModalDonaciones() donde necesites el modal
 * 3. Configuración centralizada en la función createDonationModal()
 */

// Configuración centralizada
const modalConfig = {
  titulo: "🎉 ¡Si puedes, un tantico! 🎉",
  subtitulo: "Tus donaciones contribuyen al proyecto",
  textoQR: "🔍 Escanea aquí para donar <small>(¡Un café cuenta!)</small>",
  rutaQR: "../recursos/qr.jpg",
  agradecimiento: "💖 ¡Muchas gracias por estar aquí!",
  mensajeCompartir: "📢 ¡También nos ayudas si compartes el enlace de esta Web!",
  fraseCompartir: "No te quedes solo con el botín... ¡Compártelo con tus amistades! 👇",
  enlaces: {
    telegram: {
      url: "https://t.me/share/url?url=https://tudominio.com",
      icono: "../recursos/telegram-icono.png"
    },
    whatsapp: {
      url: "https://wa.me/?text=Mira%20esta%20app%20%C2%A1Super%C3%B3%20https://tudominio.com",
      icono: "../recursos/whasapp-icono.png"
    },
    correo: {
      url: "mailto:?subject=Te%20comparto%20SPEED%20Multimedia&body=Descarga%20aqu%C3%AD:%20https://tudominio.com",
      icono: "../recursos/correo-icono.png"
    }
  }
};

// Crea el HTML del modal
function createDonationModal() {
  return `
    <div id="donacion-modal" class="modal">
      <div class="modal-contenido">
        <button class="cerrar-modal">&times;</button>
        
        <h2>${modalConfig.titulo}</h2>
        <p class="subtitulo-modal">${modalConfig.subtitulo}</p>
        
        <h3>${modalConfig.textoQR}</h3>
        <img src="${modalConfig.rutaQR}" alt="QR Donación" class="qr-modal">
        
        <h4>${modalConfig.agradecimiento}</h4>
        
        <div class="compartir-section">
          <p>${modalConfig.mensajeCompartir}</p>
          <p class="frase-compartir">${modalConfig.fraseCompartir}</p>
          
          <div class="botones-compartir">
            ${Object.values(modalConfig.enlaces).map(enlace => `
              <a href="${enlace.url}" class="btn-compartir" target="_blank">
                <img src="${enlace.icono}" alt="${Object.keys(modalConfig.enlaces).find(key => modalConfig.enlaces[key] === enlace)}">
              </a>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}

// Inicializa el modal y su funcionalidad
function initModalDonaciones() {
  // Solo crear el modal si no existe
  if (!document.getElementById('donacion-modal')) {
    document.body.insertAdjacentHTML('beforeend', createDonationModal());
    
    // Configurar eventos
    const modal = document.getElementById('donacion-modal');
    const cerrarBtn = document.querySelector('.cerrar-modal');
    
    cerrarBtn.addEventListener('click', () => {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    });
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
      }
    });
  }
}

// Función para abrir el modal desde cualquier lugar
function abrirModalDonaciones() {
  initModalDonaciones(); // Asegura que el modal exista
  const modal = document.getElementById('donacion-modal');
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

// Exportar funciones para uso global
window.ModalDonaciones = {
  init: initModalDonaciones,
  open: abrirModalDonaciones,
  config: (nuevaConfig) => Object.assign(modalConfig, nuevaConfig)
};

// Inicializar el modal (solo una vez)
ModalDonaciones.init();

// Configuración personalizada (opcional)
ModalDonaciones.config({
  rutaQR: "../recursos/qr.jpg",
  titulo: "🎉 ¡Apoya nuestro proyecto! 🎉"
});


//JS para targetas de descargas
// este es el js q controla el contador de descargas
// tambien controla los link coneciones entre gihbut y google sheet
// se uso google sheet para registrar las cantidad de descargas

// Configuración
const GITHUB_RAW_URL = "https://raw.githubusercontent.com/Mike2Abraham/SPEED-ELECTRONIC-AUDIO-2.0/refs/heads/main/versions.txt";
const SHEET_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx-rNyzyNBs4IMx0QuGoZ827Uw9C1fYTdfffk7bfRINTsN3mExf8XgztaR6N_wDiYPG3g/exec";

// DOM Elements
const contenedor = document.querySelector('.contenedor-descargas');

async function cargarTarjetas() {
  const loader = document.getElementById('loader-tarjetas');
  loader.style.display = 'flex'; // mostrar el loader
  try {
    // 1. Obtener datos del TXT en GitHub
    const response = await fetch(`${GITHUB_RAW_URL}?t=${Date.now()}`);
    const data = await response.text();
    
    // 2. Procesar el TXT
    const versiones = data.split('####').slice(1); // Ignorar primer split vacío
    
    // 3. Generar HTML dinámico
    let html = '<h1>Descargas para Windows</h1>';
    
    versiones.forEach(version => {
      if (!version.trim()) return;
      
      const lines = version.split('\n').filter(line => line.trim());
      const nombre = lines[0] || 'Versión sin nombre';
      const fecha = lines.find(l => l.includes('Subido el:'))?.replace('Subido el:', '').trim() || 'Fecha no disponible';
      const tamaño = lines.find(l => l.includes('Tamaño:'))?.replace('Tamaño:', '').trim() || 'Tamaño no disponible';
      const soporte = lines.find(l => l.includes('Soporte:'))?.replace('Soporte:', '').trim() || 'Windows';
      const descripcion = lines.filter(l => !l.includes('link:') && !l.includes('Subido el:') && !l.includes('Tamaño:') && !l.includes('Soporte:') && l !== nombre);
      const link = lines.find(l => l.includes('link:'))?.replace('link:', '').trim() || '#';
      
      // Generar HTML de las targetas
      html += `
        <div class="version-card">
          <div class="icono-flotante">
            <img src="../recursos/icon.png" alt="icono">
            <h2>${nombre}</h2>
          </div>
          
          <p class="version-meta">${fecha} | ${tamaño} | Descargas: <span class="contador" data-app="${nombre.trim()}">0</span></p>

          <p class="soporte">Soporte: ${soporte}</p>
         
          <button class="toggle-info">➕ Ver más Datos</button>

          <div class="extra-info oculto">
            <ul class="features">
              ${descripcion.map(item => `<li>✔ ${item}</li>`).join('')}
            </ul>
          </div>

          <div class="fila-boton">          
            <a href="${link}" class="boton-descarga" data-app="${nombre.trim()}">Descargar</a>
          </div>
        </div>
      `;
    });
    
    contenedor.innerHTML = html;
    await loadInitialCounters();
  } catch (error) {
    contenedor.innerHTML = `<p class="error">⚠ Error al cargar las versiones. Intenta más tarde.</p>`;
    console.error("Error al cargar versiones:", error);
  } finally {
    loader.style.display = 'none'; // ocultar el loader ya cargadas las targetas
  }
}



// Google Sheets Integration código actual)
async function updateDownloadCount(appName) {
  try {
    const url = `${SHEET_SCRIPT_URL}?app=${encodeURIComponent(appName)}&mode=inc`;
    await fetch(url);

    // 🔄 Volver a obtener el nuevo valor actualizado
    const nuevoValor = await getDownloadCount(appName);
    document.querySelectorAll(`.contador[data-app="${appName}"]`).forEach(el => {
      el.textContent = nuevoValor;
    });

  } catch (error) {
    console.error("Error al actualizar contador:", error);
  }
}


async function getDownloadCount(appName) {
  try {
    const url = `${SHEET_SCRIPT_URL}?app=${encodeURIComponent(appName)}&mode=get&t=${Date.now()}`;
    const response = await fetch(url);

    if (!response.ok) throw new Error("Error en la respuesta HTTP");
    return await response.text();
  } catch (error) {
    console.error("Error al obtener contador:", error);
    return "0";
  }
}


async function loadInitialCounters() {
  const counters = document.querySelectorAll('.contador');
  for (const counter of counters) {
    const appName = counter.getAttribute('data-app');
    counter.textContent = await getDownloadCount(appName);
  }
}

// Event Delegation para botones de descarga
document.addEventListener('click', async (e) => {
  if (e.target.classList.contains('boton-descarga')) {
    e.preventDefault();
    const appName = e.target.getAttribute('data-app');
    
    // Mostrar modal/pantalla de carga
    mostrarModalDescarga(appName);
    
    // Actualizar contador
    await updateDownloadCount(appName);
    
    // Redirigir después de 1 segundos
    setTimeout(() => {
      window.location.href = e.target.href;
    }, 1000);
  }
});

function mostrarModalDescarga(appName) {
  const modalHTML = `
    <div class="modal-descarga">
      <div class="modal-contenido">
        <span class="cerrar-modal">&times;</span>
        <h2>Preparando descarga de ${appName}...</h2>
        <div class="loader"></div>
        <p>La descarga comenzará automáticamente en <span id="cuenta-regresiva">4</span> segundos</p>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHTML);

  const modal = document.querySelector('.modal-descarga');
  const cerrar = modal.querySelector('.cerrar-modal');
  const counterEl = modal.querySelector('#cuenta-regresiva');

  let count = 6; // Tiempo para contar
  const interval = setInterval(() => {
    count--;
    if (counterEl) counterEl.textContent = count;
    if (count <= 0) {
      clearInterval(interval);
      modal.remove();
    }
  }, 1000);

  cerrar.addEventListener('click', () => {
    clearInterval(interval);
    modal.remove();
  });
}


// JS de Contrarer y ocultar
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('toggle-info')) {
    const tarjeta = e.target.closest('.version-card');
    const info = tarjeta.querySelector('.extra-info');

    info.classList.toggle('activo');

    e.target.textContent = info.classList.contains('activo')
      ? '➖ Ver menos Datos'
      : '➕ Ver más Datos';
  }
});








window.onload = async () => {
  setTimeout(() => {
    cargarTarjetas(); // Cargar tarjetas luego de 3 segundos
    setTimeout(() => {
      loadInitialCounters(); // Cargar contadores justo después
    }, 600); // pequeña pausa para asegurar que las tarjetas ya existen
  }, 5000); // 3 segundos de espera total
};


