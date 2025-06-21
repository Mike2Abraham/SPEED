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

