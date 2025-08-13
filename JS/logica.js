// Modal Donaciones
const modalDonacion = document.getElementById('donacion-modal');
const btnDonacion = document.getElementById('modal-donacion');
const cerrarModal = document.querySelector('.cerrar-modal');

if (btnDonacion) {
  btnDonacion.addEventListener('click', () => {
    modalDonacion.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Bloquear scroll
  });
  
  cerrarModal.addEventListener('click', () => {
    modalDonacion.style.display = 'none';
    document.body.style.overflow = 'auto'; // Restaurar scroll
    // Efecto confeti antes de cerrar
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff0000', '#9400ff', '#00ff00', '#ffff00', '#00ffff']
    });
    
    // Cierra el modal después del confeti
    setTimeout(() => {
      modalDonacion.style.display = 'none';
      document.body.style.overflow = 'auto';
    }, 800); // 0.8 segundos de confeti
  });
  
  // Cerrar al hacer clic fuera del modal
  modalDonacion.addEventListener('click', (e) => {
    if (e.target === modalDonacion) {
      modalDonacion.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  });
}

function abrirModalDonaciones() {
  const modal = document.getElementById('donacion-modal');
  if (modal) {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    // Opcional: Confeti al abrir desde aquí
    confetti({ particleCount: 50, spread: 70 });
  }
}

//quitas menu das click afuera
document.addEventListener('click', (e) => {
  if (!e.target.closest('.menu-item-contextual')) {
    document.querySelector('.menu-contextual').style.display = 'none';
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const MODAL_KEY = 'modal_compartir_visto';
  const modal = document.getElementById('modal-compartir-donar');

  // Mostrar modal solo si es la primera visita (después de 4 segundos)
  if (!localStorage.getItem(MODAL_KEY)) {
    setTimeout(() => {
      modal.style.display = 'flex';
      localStorage.setItem(MODAL_KEY, 'true');
    }, 4000);
  }

  // Cerrar modal + confeti
  const cerrarModal = document.querySelector('.cerrar-modal-compartir');
  cerrarModal.addEventListener('click', () => {
    modal.style.display = 'none';
    confetti(); // Efecto de confeti (ya incluido en inits.html)
  });

  // Cerrar al hacer clic fuera del contenido
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
      confetti();
    }
  });
});

// 🪟 Modales (donaciones, compartir)
function initModals() {
  // Ejemplo: Modal de donaciones
  const donationModal = document.getElementById('donacion-modal');
  const openDonationBtn = document.querySelector('[onclick*="ModalDonaciones.open()"]');
  const closeDonationBtn = document.querySelector('.cerrar-modal');

  if (openDonationBtn) {
    openDonationBtn.addEventListener('click', () => {
      donationModal.style.display = 'block';
    });
  }

  if (closeDonationBtn) {
    closeDonationBtn.addEventListener('click', () => {
      donationModal.style.display = 'none';
    });
  }
}


// 📁 JS/efectoLuna.js
// 📁 JS/efectoLuna.js
document.addEventListener('DOMContentLoaded', () => {
  const contenedor = document.querySelector('.LUNAs');
  if (!contenedor) return;

  let lluviaActiva = false;
  let intervaloGotas;
  let ciclo;
  
  // Dirección del viento
  let vientoActual = 0;    // desplazamiento lateral en px
  let vientoObjetivo = 0;  // hacia dónde se mueve
  const suavizado = 0.05;  // cuanto más pequeño, más suave

  // Crear gota
  function crearGota() {
    const gota = document.createElement('div');
    gota.className = 'gota';
    gota.style.left = `${Math.random() * 100}vw`;
    gota.style.setProperty('--viento', vientoActual + 'px');
    gota.style.animationDuration = (0.6 + Math.random() * 0.4) + 's'; // rápido como lluvia
    contenedor.appendChild(gota);

    gota.addEventListener('animationend', () => gota.remove());
  }

  // Activar lluvia
  function activarLluvia() {
    if (lluviaActiva) return;
    lluviaActiva = true;
    intervaloGotas = setInterval(() => {
      if (contenedor.childElementCount < 80) crearGota();
    }, 40); // más frecuencia = más densidad
  }

  // Detener lluvia
  function detenerLluvia() {
    if (!lluviaActiva) return;
    clearInterval(intervaloGotas);
    lluviaActiva = false;
    contenedor.innerHTML = ''; // limpiar gotas
  }

  // Ciclo 10s ON / 10s OFF
  function iniciarCiclo() {
    activarLluvia();
    ciclo = setInterval(() => {
      if (lluviaActiva) detenerLluvia();
      else activarLluvia();
    }, 80000);
  }

  // Actualizar viento suavemente
  function animarViento() {
    vientoActual += (vientoObjetivo - vientoActual) * suavizado;
    document.documentElement.style.setProperty('--viento', vientoActual.toFixed(2) + 'px');
    requestAnimationFrame(animarViento);
  }
  animarViento();

  // Control PC: dirección con el cursor
  window.addEventListener('mousemove', e => {
    const centroX = window.innerWidth / 2;
    const deltaX = e.clientX - centroX;
    vientoObjetivo = (deltaX / centroX) * 200; // máx ±200px de desplazamiento lateral
  });

  // Control móvil: dirección con sensor
  window.addEventListener('deviceorientation', e => {
    if (e.gamma !== null) {
      vientoObjetivo = (e.gamma / 45) * 200;
    }
  });

  // Iniciar ciclo
  iniciarCiclo();
});



















// lOGICA-SCROLL
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

// Modal de "Desliza hacia abajo"
const hintModal = document.querySelector('.hint-modal');

// Mostrar solo si es la primera visita o recarga
if (!sessionStorage.getItem('hintShown')) {
  // Ocultar al hacer scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      hintModal.classList.add('hidden');
      sessionStorage.setItem('hintShown', 'true');
    }
  });
} else {
  hintModal.classList.add('hidden');
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

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    const container = document.querySelector('.explisito');

    // Arrays de capturas
    const tiposCaptura = ['captura1.png', 'captura2.png', 'captura3.png', 'captura5.png', 'captura6.png', 'captura7.png', 'captura8.png', 'captura9.png'];

    // Crear modal
    const modal = document.createElement('div');
    modal.className = 'modal-explisito';
    modal.innerHTML = `
      <button class="close-modal" styles="font-size: 40px; margin-top: -10px;">&times;</button>
      <div class="carousel-buttons">
      <button class="prev-btn">&#8592; Prev</button>
        <img src="" alt="captura" class="carousel-image">
        <div class="fondito-txt">
          <div class="explisito-txt">Te Precento a SPM en su primera versión! con el para reproducir tus multimedias dirctamente desde Windows (Como un reproductor de audio y Video Normal), Pruebalo no querras despegarte de el!!</div>
        </div>
        <button class="next-btn">Next &#8594;</button>
      </div>
      <a href="https://github.com/Mike2Abraham/SPEED-ELECTRONIC-AUDIO-2.0/releases/download/SPM-subv1.0/Instalador.SPM.1.0.7z" class="download-btn">Descargar Ya</a>
      <a href="./Dominios/index.html" class="download-btn2"><img class="download-btn2-img" src="./recursos/iconitos/extortar-list.png"></a>
    `;
    container.appendChild(modal);

    // Crear lengüeta
    const tab = document.createElement('div');
    tab.className = 'modal-tab';
    tab.textContent = "Descargar SPM";
    tab.style.backgroundImage = "url('./recursos/iconitos/iconodVideo.png')";
    tab.style.backgroundSize = 'contain';
    tab.style.backgroundRepeat = 'no-repeat';
    tab.style.backgroundPosition = 'center right';
    document.body.appendChild(tab);

    const carouselImage = modal.querySelector('.carousel-image');
    let index = 0;

    function actualizarImagen() {
      carouselImage.style.opacity = 0; // comienza transparente
      setTimeout(() => {
        const tipo = tiposCaptura[index];
        carouselImage.src = `./recursos/iconitos/${tipo}`;
        carouselImage.style.opacity = 1; // vuelve a visible
      }, 200); // tiempo corto para dar efecto fade
    }

    actualizarImagen();

    // Carrusel automático
    let interval = setInterval(() => {
      index = (index + 1) % tiposCaptura.length;
      actualizarImagen();
    }, 7000); // tiempo de cambio

    // Botones manuales
    modal.querySelector('.prev-btn').addEventListener('click', () => {
      index = (index - 1 + tiposCaptura.length) % tiposCaptura.length;
      actualizarImagen();
    });
    modal.querySelector('.next-btn').addEventListener('click', () => {
      index = (index + 1) % tiposCaptura.length;
      actualizarImagen();
    });

    // Botón cerrar
    modal.querySelector('.close-modal').addEventListener('click', () => {
      modal.style.display = 'none';
      tab.style.display = 'block';
    });

    // Lengüeta abrir
    tab.addEventListener('click', () => {
      modal.style.display = 'flex';
      tab.style.display = 'none';
    });

  }, 5000); // Espera 5 segundos después de cargar la página
});