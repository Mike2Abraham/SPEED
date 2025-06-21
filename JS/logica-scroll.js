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