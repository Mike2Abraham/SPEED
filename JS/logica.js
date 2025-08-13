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
  const contenedorLunas = document.querySelector('.LUNAs');
  if (!contenedorLunas) return;

  let lluviaActiva = false;
  let gotas = [];
  let intervalo;

  // Función para crear una gota
  function crearGota() {
    const gota = document.createElement('div');
    gota.classList.add('gota');
    gota.style.left = `${Math.random() * 100}vw`;
    gota.style.animationDuration = `${1 + Math.random() * 2}s`;
    contenedorLunas.appendChild(gota);
    
    // Eliminar la gota después de que termine su animación
    gota.addEventListener('animationend', () => {
      gota.remove();
    });

    gotas.push(gota);
    return gota;
  }

  // Activar lluvia
  function activarLluvia() {
    if (lluviaActiva) return;
    lluviaActiva = true;
    
    intervalo = setInterval(() => {
      if (gotas.length < 50) { // Máximo 50 gotas simultáneas
        crearGota();
      }
    }, 100); // Nueva gota cada 100ms
  }

  // Detener lluvia
  function detenerLluvia() {
    if (!lluviaActiva) return;
    clearInterval(intervalo);
    lluviaActiva = false;
    
    // Forzar eliminación de todas las gotas
    gotas.forEach(gota => {
      if (gota.parentNode) {
        gota.style.animation = 'none'; // Detiene la animación
        gota.remove();
      }
    });
    gotas = [];
  }

  // Control por scroll
  window.addEventListener('scroll', () => {
    const seccionLluvia = document.querySelector('.aparece'); // Ajusta según tu estructura
    if (!seccionLluvia) return;

    const rect = seccionLluvia.getBoundingClientRect();
    const enSeccion = rect.top <= window.innerHeight && rect.bottom >= 0;

    if (enSeccion && !lluviaActiva) {
      activarLluvia();
    } else if (!enSeccion && lluviaActiva) {
      detenerLluvia();
    }
  });
});

// 📁 JS/efectoNubes.js
document.addEventListener('DOMContentLoaded', () => {
  const nubesL = document.querySelector('.nubesL');
  const nubesR = document.querySelector('.nubesR');
  const matarNubesDiv = document.querySelector('.matar_nubes'); // Nuevo div "asesino"
  const tiposNube = ['nube1.png', 'nube2.png', 'nube3.png'];
  let nubesActivas = false;
  let intervaloNubes;

  // Crear una nube (con opción de desvanecimiento)
  function crearNube(contenedor, direccion) {
    const nube = document.createElement('img');
    const tipo = tiposNube[Math.floor(Math.random() * tiposNube.length)];
    nube.src = `./recursos/iconitos/${tipo}`;
    nube.classList.add('nube');

    // Estilos aleatorios (como antes)
    const tamaño = 80 + Math.random() * 120;
    nube.style.width = `${tamaño}px`;
    nube.style.top = `${10 + Math.random() * 60}%`;
    const duracion = 20 + Math.random() * 40;
    nube.style.animationDuration = `${duracion}s`;

    contenedor.appendChild(nube);

    // Eliminar al terminar animación (original)
    nube.addEventListener('animationend', () => {
      nube.remove();
    });

    return nube; // Devolvemos la nube para control externo
  }

  // Activar nubes (igual que antes)
  function activarNubes() {
    if (nubesActivas) return;
    nubesActivas = true;

    intervaloNubes = setInterval(() => {
      const cantidad = Math.floor(1 + Math.random() * 3);
      for (let i = 0; i < cantidad; i++) {
        crearNube(nubesL, 'LtoR');
        crearNube(nubesR, 'RtoL');
      }
    }, 2000);
  }

  // ----- NUEVO: Sistema de "matar nubes" -----
  if (matarNubesDiv) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Desvanecer todas las nubes suavemente
          document.querySelectorAll('.nube').forEach(nube => {
            nube.style.opacity = '0'; // Inicia transición CSS
            setTimeout(() => nube.remove(), 1500); // Elimina después de 1.5s
          });
        }
      });
    }, { threshold: 0.1 });

    observer.observe(matarNubesDiv);
  }

  // Control por scroll original (sin cambios)
  window.addEventListener('scroll', () => {
    const seccionNubes = document.querySelector('.aparece');
    if (!seccionNubes) return;

    const rect = seccionNubes.getBoundingClientRect();
    const enSeccion = rect.top <= window.innerHeight && rect.bottom >= 0;

    if (enSeccion && !nubesActivas) {
      activarNubes();
    } else if (!enSeccion && nubesActivas) {
      // ¡No detenemos las nubes aquí! Solo al pasar por .matar_nubes
    }
  });
});

// Función para destruir todas las nubes y detener el sistema
function destruirNubes() {
  // 1. Detener la generación de nuevas nubes
  clearInterval(intervaloNubes);
  nubesActivas = false;
  setTimeout(() => nube.remove(), 500);
  // 2. Eliminar todas las nubes existentes con transición
  document.querySelectorAll('.nube').forEach(nube => {
    nube.style.opacity = '0';
    setTimeout(() => nube.remove(), 500); // Elimina después de 0.5s
  });

  // 3. Deshabilitar el botón (opcional)
  const btn = document.getElementById('btn-matar-nubes');
  if (btn) {
    btn.textContent = '☠️ Nubes Eliminadas';
    btn.style.background = '#666';
    btn.disabled = true;
  }

}

// Asignar evento al botón
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('btn-matar-nubes');
  if (btn) {
    btn.addEventListener('click', destruirNubes);
  }
});