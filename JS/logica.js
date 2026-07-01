// ============================================
// SISTEMA DE LIMPIEZA DE MEMORIA
// ============================================
const MemoryManager = {
    intervals: [],
    timeouts: [],
    observers: [],
    animations: [],
    eventListeners: [],
    
    // Registrar elementos para limpieza
    register(type, item) {
        if (!this[type]) this[type] = [];
        this[type].push(item);
        return item;
    },
    
    // Limpiar todo
    clean() {
        // Limpiar intervals
        this.intervals.forEach(interval => clearInterval(interval));
        this.intervals = [];
        
        // Limpiar timeouts
        this.timeouts.forEach(timeout => clearTimeout(timeout));
        this.timeouts = [];
        
        // Limpiar observers
        this.observers.forEach(observer => observer.disconnect());
        this.observers = [];
        
        // Limpiar animaciones
        this.animations.forEach(anim => {
            if (anim.cancel) anim.cancel();
        });
        this.animations = [];
        
        // Limpiar event listeners (solo los registrados)
        this.eventListeners.forEach(({element, event, handler}) => {
            element.removeEventListener(event, handler);
        });
        this.eventListeners = [];
        
        // Limpiar elementos del DOM que puedan quedar
        document.querySelectorAll('.gota, .lluvia-container, .particula, .chispa').forEach(el => el.remove());
        
        console.log('🧹 Memoria limpiada');
    },
    
    // Clean parcial cada cierto tiempo
    startAutoClean(interval = 30000) {
        const cleanInterval = setInterval(() => {
            // Limpiar elementos visuales temporales
            document.querySelectorAll('.gota, .particula, .chispa, .confetti-piece').forEach(el => {
                if (el && el.parentNode) el.remove();
            });
            
            // Limpiar elementos de confetti que puedan quedar
            document.querySelectorAll('.confetti-container, .confetti-piece').forEach(el => {
                if (el && el.parentNode) el.remove();
            });
            
            console.log('🧹 Limpieza automática de elementos visuales');
        }, interval);
        
        this.register('intervals', cleanInterval);
    }
};

// ============================================
// LOGICA SCROLL OPTIMIZADA
// ============================================
(function() {
    const navbar = document.querySelector('.navbar');
    const cartelon = document.getElementById('cartelon');
    const animados = document.querySelectorAll('.aparece');
    
    if (!navbar) return;
    
    const maxHeight = 590;
    const minHeight = 70;
    const limiteContraccion = 400;
    let scrollTimeout = null;
    let lastScrollY = 0;
    
    function ajustarNavbar() {
        const scrollY = window.scrollY;
        let nuevaAltura = maxHeight - (scrollY * ((maxHeight - minHeight) / limiteContraccion));
        nuevaAltura = Math.max(minHeight, Math.min(maxHeight, nuevaAltura));
        
        navbar.style.height = `${nuevaAltura}px`;
        
        // Control de cartelón con throttling
        if (cartelon) {
            if (scrollY > 150) {
                cartelon.classList.add('oculto');
            } else if (scrollY < 100) {
                cartelon.classList.remove('oculto');
            }
        }
        
        const contraido = nuevaAltura <= minHeight + 10;
        navbar.classList.toggle('contraido', contraido);
        
        // Control del contador
        const contador = document.querySelector('.contador-visitas');
        if (contador) {
            contador.style.display = contraido ? 'none' : 'block';
        }
    }
    
    // Throttle para scroll
    function handleScroll() {
        if (scrollTimeout) return;
        scrollTimeout = requestAnimationFrame(() => {
            ajustarNavbar();
            animarContenidoVisible();
            scrollTimeout = null;
        });
    }
    
    function animarContenidoVisible() {
        const trigger = window.innerHeight * 0.85;
        animados.forEach(el => {
            const rect = el.getBoundingClientRect();
            el.classList.toggle('visible', rect.top < trigger);
        });
    }
    
    // Registrar eventos con limpieza
    const scrollHandler = handleScroll;
    const loadHandler = () => {
        ajustarNavbar();
        animarContenidoVisible();
    };
    
    window.addEventListener('scroll', scrollHandler, { passive: true });
    window.addEventListener('load', loadHandler);
    
    MemoryManager.register('eventListeners', { element: window, event: 'scroll', handler: scrollHandler });
    MemoryManager.register('eventListeners', { element: window, event: 'load', handler: loadHandler });
    
    // Limpieza en beforeunload
    window.addEventListener('beforeunload', () => {
        MemoryManager.clean();
    }, { once: true });
})();

// ============================================
// HINT MODAL LIMPIO
// ============================================
(function() {
    const hintModal = document.querySelector('.hint-modal');
    if (!hintModal) return;
    
    if (!sessionStorage.getItem('hintShown')) {
        const scrollHandler = () => {
            if (window.scrollY > 50) {
                hintModal.classList.add('hidden');
                sessionStorage.setItem('hintShown', 'true');
                window.removeEventListener('scroll', scrollHandler);
            }
        };
        window.addEventListener('scroll', scrollHandler, { passive: true });
        MemoryManager.register('eventListeners', { element: window, event: 'scroll', handler: scrollHandler });
    } else {
        hintModal.classList.add('hidden');
    }
})();

// ============================================
// CURSOR DE LUZ OPTIMIZADO
// ============================================
(function() {
    const navbar = document.querySelector('.navbar');
    const cursorLight = document.querySelector('.cursor-light');
    
    if (!navbar || !cursorLight) return;
    
    let isInsideNavbar = false;
    let rafId = null;
    let lastX = 0;
    let lastY = 0;
    
    function moveLight(e) {
        if (rafId) return;
        rafId = requestAnimationFrame(() => {
            const rect = navbar.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const isInside = x >= 0 && x <= rect.width && y >= 0 && y <= rect.height;
            
            if (isInside) {
                cursorLight.style.opacity = '1';
                cursorLight.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
                isInsideNavbar = true;
            } else if (isInsideNavbar) {
                cursorLight.style.opacity = '0';
                isInsideNavbar = false;
            }
            
            rafId = null;
        });
    }
    
    const mouseHandler = moveLight;
    document.addEventListener('mousemove', mouseHandler);
    MemoryManager.register('eventListeners', { element: document, event: 'mousemove', handler: mouseHandler });
})();

// ============================================
// EFECTO LLUVIA OPTIMIZADO CON LIMPIEZA
// ============================================
(function() {
    const contenedor = document.querySelector('.LUNAs');
    if (!contenedor) return;
    
    let lluviaActiva = false;
    let intervaloGotas = null;
    let ciclo = null;
    let rafViento = null;
    let vientoActual = 0;
    let vientoObjetivo = 0;
    const suavizado = 0.05;
    const MAX_GOTAS = 60;
    
    function crearGota() {
        if (contenedor.childElementCount >= MAX_GOTAS) return;
        
        const gota = document.createElement('div');
        gota.className = 'gota';
        gota.style.left = `${Math.random() * 100}vw`;
        gota.style.setProperty('--viento', vientoActual + 'px');
        gota.style.animationDuration = (0.6 + Math.random() * 0.4) + 's';
        contenedor.appendChild(gota);
        
        // Limpieza automática de gotas viejas
        gota.addEventListener('animationend', () => {
            if (gota.parentNode) gota.remove();
        }, { once: true });
    }
    
    function activarLluvia() {
        if (lluviaActiva) return;
        lluviaActiva = true;
        intervaloGotas = setInterval(() => {
            if (contenedor.childElementCount < MAX_GOTAS) crearGota();
        }, 40);
        MemoryManager.register('intervals', intervaloGotas);
    }
    
    function detenerLluvia() {
        if (!lluviaActiva) return;
        clearInterval(intervaloGotas);
        lluviaActiva = false;
        contenedor.innerHTML = '';
    }
    
    function iniciarCiclo() {
        activarLluvia();
        ciclo = setInterval(() => {
            if (lluviaActiva) detenerLluvia();
            else activarLluvia();
        }, 80000);
        MemoryManager.register('intervals', ciclo);
    }
    
    function animarViento() {
        vientoActual += (vientoObjetivo - vientoActual) * suavizado;
        document.documentElement.style.setProperty('--viento', vientoActual.toFixed(2) + 'px');
        rafViento = requestAnimationFrame(animarViento);
    }
    MemoryManager.register('animations', { cancel: () => cancelAnimationFrame(rafViento) });
    animarViento();
    
    // Control PC y Móvil con limpieza
    const mouseHandler = (e) => {
        const centroX = window.innerWidth / 2;
        const deltaX = e.clientX - centroX;
        vientoObjetivo = (deltaX / centroX) * 200;
    };
    document.addEventListener('mousemove', mouseHandler);
    MemoryManager.register('eventListeners', { element: document, event: 'mousemove', handler: mouseHandler });
    
    const orientationHandler = (e) => {
        if (e.gamma !== null) {
            vientoObjetivo = (e.gamma / 45) * 200;
        }
    };
    window.addEventListener('deviceorientation', orientationHandler);
    MemoryManager.register('eventListeners', { element: window, event: 'deviceorientation', handler: orientationHandler });
    
    iniciarCiclo();
    
    // Limpieza al salir
    window.addEventListener('beforeunload', () => {
        detenerLluvia();
        clearInterval(ciclo);
        if (rafViento) cancelAnimationFrame(rafViento);
    }, { once: true });
})();

// ============================================
// MARQUEE DE EXTENSIONES CON LIMPIEZA
// ============================================
(function() {
    let marqueeInitialized = false;
    let animationId = null;
    let marqueeTrack = null;
    let isPaused = false;
    
    function crearMarqueeExtensiones() {
        const container = document.getElementById('extenciones-container');
        if (!container || container.innerHTML.trim() !== '') return;
        
        const totalImagenes = 28;
        let marqueeHTML = '';
        
        for (let i = 1; i <= totalImagenes; i++) {
            marqueeHTML += `
                <div class="extencion-item">
                    <img src="./recursos/Extent/sp-${i}.png" 
                         alt="Extensión ${i}" 
                         class="extencion-img"
                         loading="lazy"
                         decoding="async">
                </div>
            `;
        }
        
        const contenidoDuplicado = marqueeHTML + marqueeHTML;
        
        container.innerHTML = `
            <div class="marquee-track" id="marquee-track">
                ${contenidoDuplicado}
            </div>
        `;
        
        marqueeTrack = document.getElementById('marquee-track');
        
        // Control de pausa para optimizar rendimiento
        const containerParent = container.closest('.extenciones');
        if (containerParent) {
            const pauseHandler = () => {
                if (marqueeTrack) {
                    isPaused = true;
                    marqueeTrack.style.animationPlayState = 'paused';
                }
            };
            const resumeHandler = () => {
                if (marqueeTrack) {
                    isPaused = false;
                    marqueeTrack.style.animationPlayState = 'running';
                }
            };
            
            containerParent.addEventListener('mouseenter', pauseHandler);
            containerParent.addEventListener('mouseleave', resumeHandler);
            
            MemoryManager.register('eventListeners', { element: containerParent, event: 'mouseenter', handler: pauseHandler });
            MemoryManager.register('eventListeners', { element: containerParent, event: 'mouseleave', handler: resumeHandler });
        }
    }
    
    function injectMarqueeStyles() {
        if (document.getElementById('marquee-styles')) return;
        
        const styles = `
            <style id="marquee-styles">
                .extenciones { width: 100%; overflow: hidden; position: relative; padding: 40px 0; background: transparent; }
                .marquee-track { display: flex; gap: 25px; animation: marquee-scroll 60s linear infinite; width: max-content; will-change: transform; }
                .extenciones:hover .marquee-track { animation-play-state: paused; }
                .extencion-item { flex-shrink: 0; transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94); border-radius: 12px; padding: 8px; background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); }
                .extencion-item:hover { transform: scale(1.15) translateY(-5px); background: rgba(139,92,246,0.2); box-shadow: 0 10px 25px rgba(139,92,246,0.3); z-index: 10; }
                .extencion-img { width: 80px; height: 80px; object-fit: contain; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.1)); transition: all 0.3s ease; }
                .extencion-item:hover .extencion-img { filter: drop-shadow(0 8px 16px rgba(139,92,246,0.4)); transform: scale(1.1); }
                @keyframes marquee-scroll { 0% { transform: translateX(0); } 100% { transform: translateX(calc(-50% - 12.5px)); } }
                @media (max-width: 768px) { .extencion-img { width: 60px; height: 60px; } .marquee-track { gap: 20px; animation-duration: 40s; } }
            </style>
        `;
        document.head.insertAdjacentHTML('beforeend', styles);
    }
    
    function initExtensionesMarquee() {
        if (marqueeInitialized) return;
        injectMarqueeStyles();
        crearMarqueeExtensiones();
        marqueeInitialized = true;
    }
    
    document.addEventListener('DOMContentLoaded', initExtensionesMarquee);
    
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.classList && node.classList.contains('extenciones')) {
                    initExtensionesMarquee();
                }
            });
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });
    MemoryManager.register('observers', observer);
})();

// ============================================
// BOTÓN TO TOP OPTIMIZADO
// ============================================
(function() {
    const toTopBtn = document.querySelector('.to-top-btn');
    if (!toTopBtn) return;
    
    let rafId = null;
    
    function toggleToTopButton() {
        if (rafId) return;
        rafId = requestAnimationFrame(() => {
            const scrollHeight = document.documentElement.scrollHeight;
            const scrollPosition = window.innerHeight + window.scrollY;
            toTopBtn.classList.toggle('hidden', scrollPosition < scrollHeight - 100);
            rafId = null;
        });
    }
    
    const scrollHandler = toggleToTopButton;
    const resizeHandler = toggleToTopButton;
    
    window.addEventListener('scroll', scrollHandler, { passive: true });
    window.addEventListener('resize', resizeHandler, { passive: true });
    
    MemoryManager.register('eventListeners', { element: window, event: 'scroll', handler: scrollHandler });
    MemoryManager.register('eventListeners', { element: window, event: 'resize', handler: resizeHandler });
    
    toTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
})();

// ============================================
// MENÚ MÓVIL OPTIMIZADO
// ============================================
(function() {
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const closeBtn = document.querySelector('.close-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const overlay = document.querySelector('.mobile-menu-overlay');
    
    if (!hamburgerBtn || !mobileMenu || !closeBtn || !overlay) return;
    
    function closeMobileMenu() {
        mobileMenu.classList.remove('active');
        overlay.classList.remove('active');
        overlay.style.display = 'none';
        document.body.style.overflow = '';
        hamburgerBtn.classList.remove('active');
    }
    
    function openMobileMenu() {
        mobileMenu.classList.add('active');
        overlay.classList.add('active');
        overlay.style.display = 'block';
        document.body.style.overflow = 'hidden';
        hamburgerBtn.classList.add('active');
    }
    
    const toggleHandler = () => {
        if (mobileMenu.classList.contains('active')) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    };
    
    hamburgerBtn.addEventListener('click', toggleHandler);
    closeBtn.addEventListener('click', closeMobileMenu);
    overlay.addEventListener('click', closeMobileMenu);
    
    MemoryManager.register('eventListeners', { element: hamburgerBtn, event: 'click', handler: toggleHandler });
    MemoryManager.register('eventListeners', { element: closeBtn, event: 'click', handler: closeMobileMenu });
    MemoryManager.register('eventListeners', { element: overlay, event: 'click', handler: closeMobileMenu });
    
    // Limpieza en resize
    const resizeHandler = () => {
        if (window.innerWidth > 768 && mobileMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    };
    window.addEventListener('resize', resizeHandler);
    MemoryManager.register('eventListeners', { element: window, event: 'resize', handler: resizeHandler });
})();

// ============================================
// MODAL DONACIONES OPTIMIZADO
// ============================================
(function() {
    const modalDonacion = document.getElementById('donacion-modal');
    const btnDonacion = document.getElementById('modal-donacion');
    const cerrarModal = document.querySelector('.cerrar-modal');
    
    if (!modalDonacion || !btnDonacion) return;
    
    function showModal() {
        modalDonacion.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
    
    function hideModal() {
        modalDonacion.style.display = 'none';
        document.body.style.overflow = '';
    }
    
    btnDonacion.addEventListener('click', showModal);
    
    if (cerrarModal) {
        cerrarModal.addEventListener('click', () => {
            // Confeti con limpieza automática
            const confettiContainer = document.createElement('div');
            confettiContainer.className = 'confetti-container';
            document.body.appendChild(confettiContainer);
            
            for (let i = 0; i < 50; i++) {
                const piece = document.createElement('div');
                piece.className = 'confetti-piece';
                piece.style.cssText = `
                    position: fixed; left: ${Math.random() * 100}vw; 
                    top: -20px; width: 10px; height: 10px; 
                    background: ${['#ff0000','#9400ff','#00ff00','#ffff00','#00ffff'][Math.floor(Math.random()*5)]}; 
                    border-radius: 2px; z-index: 99999;
                    animation: confettiFall ${1 + Math.random() * 2}s linear forwards;
                `;
                confettiContainer.appendChild(piece);
            }
            
            // Limpieza automática del confeti
            setTimeout(() => {
                if (confettiContainer.parentNode) confettiContainer.remove();
            }, 3000);
            
            hideModal();
        });
    }
    
    modalDonacion.addEventListener('click', (e) => {
        if (e.target === modalDonacion) hideModal();
    });
})();

// ============================================
// MODAL COMPARTIR OPTIMIZADO
// ============================================
(function() {
    const MODAL_KEY = 'modal_compartir_visto';
    const modal = document.getElementById('modal-compartir-donar');
    if (!modal) return;
    
    let timeoutId = null;
    let isShown = false;
    
    if (!localStorage.getItem(MODAL_KEY)) {
        timeoutId = setTimeout(() => {
            if (!isShown) {
                modal.style.display = 'flex';
                isShown = true;
                localStorage.setItem(MODAL_KEY, 'true');
            }
        }, 4000);
        MemoryManager.register('timeouts', timeoutId);
    }
    
    const cerrarModal = document.querySelector('.cerrar-modal-compartir');
    if (cerrarModal) {
        const closeHandler = () => {
            modal.style.display = 'none';
            isShown = false;
            // Confeti con limpieza
            for (let i = 0; i < 30; i++) {
                const piece = document.createElement('div');
                piece.className = 'confetti-piece';
                piece.style.cssText = `
                    position: fixed; left: ${Math.random() * 100}vw; 
                    top: -20px; width: 8px; height: 8px; 
                    background: ${['#ff0000','#9400ff','#00ff00','#ffff00','#00ffff'][Math.floor(Math.random()*5)]}; 
                    border-radius: 2px; z-index: 99999;
                    animation: confettiFall ${1 + Math.random() * 2}s linear forwards;
                `;
                document.body.appendChild(piece);
                setTimeout(() => { if (piece.parentNode) piece.remove(); }, 3000);
            }
        };
        cerrarModal.addEventListener('click', closeHandler);
        MemoryManager.register('eventListeners', { element: cerrarModal, event: 'click', handler: closeHandler });
    }
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            isShown = false;
        }
    });
})();

// ============================================
// CONFIGURACIÓN INICIAL DE LIMPIEZA
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // Iniciar limpieza automática cada 30 segundos
    MemoryManager.startAutoClean(30000);
    
    // Limpiar al cerrar la página
    window.addEventListener('beforeunload', function() {
        MemoryManager.clean();
    }, { once: true });
    
    // Limpiar al recargar (para evitar acumulación)
    const originalClean = MemoryManager.clean.bind(MemoryManager);
    MemoryManager.clean = function() {
        // Limpiar elementos visuales adicionales
        document.querySelectorAll('.confetti-container, .confetti-piece, .particula').forEach(el => el.remove());
        originalClean();
    };
});

// ============================================
// CONFETTI ANIMATION KEYFRAMES (agregar al CSS)
// ============================================
(function() {
    if (!document.getElementById('confetti-styles')) {
        const style = document.createElement('style');
        style.id = 'confetti-styles';
        style.textContent = `
            @keyframes confettiFall {
                0% { transform: translateY(0) rotate(0deg); opacity: 1; }
                100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
})();

// ============================================
// PLAYER OPTIMIZADO (MODIFICACIONES MÍNIMAS)
// ============================================
// NOTA: El player ya tiene buena gestión de memoria con revocación de URLs
// Solo agregamos limpieza adicional para los intervalos internos

(function() {
    // Extender el player existente con limpieza de eventos internos
    const originalInit = window.initPlayer || function() {};
    
    // Si existe el player, agregar limpieza al cerrar
    const player = document.querySelector('.bottom-player');
    if (player) {
        window.addEventListener('beforeunload', function() {
            // Limpiar URLs blob del player
            const audio = document.querySelector('.bottom-player audio');
            if (audio && audio.src && audio.src.startsWith('blob:')) {
                URL.revokeObjectURL(audio.src);
            }
        }, { once: true });
    }
})();

console.log('🚀 Optimización de memoria aplicada correctamente');