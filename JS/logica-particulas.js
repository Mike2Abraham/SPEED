class ParticlesAnimation {
  constructor() {
    this.particles = [];
    this.container = null;
    this.maxParticles = 30; // Más partículas
    this.animationId = null;
    this.scrollIntensity = 0;

    // Iniciar inmediatamente
    this.init();
    console.log("Animación de partículas INICIADA"); // Debug
  }

  init() {
    // Crear contenedor (¡verifica que el navbar exista!)
    const navbar = document.querySelector('.navbar');
    if (!navbar) {
      console.error("No se encontró .navbar en el DOM");
      return;
    }

    this.container = document.createElement('div');
    this.container.className = 'particles-container';
    navbar.appendChild(this.container);

    // Crear partículas VISIBLES
    for (let i = 0; i < this.maxParticles; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      // Posición aleatoria
      const x = Math.random() * 100;
      const y = Math.random() * 100;

      // Estilo INICIAL VISIBLE
      Object.assign(particle.style, {
        left: `${x}%`,
        top: `${y}%`,
        opacity: '1', // visible
        transform: 'translate(-50%, -50%)'
      });

      this.container.appendChild(particle);
      this.particles.push({
        element: particle,
        x: x,
        y: y,
        speedX: (Math.random() - 1) * 1.3,
        speedY: (Math.random() - 1) * 1.3
      });
    }

    // Iniciar animación
    this.animate();
    window.addEventListener('scroll', this.handleScroll.bind(this));
  }

  animate() {
    this.particles.forEach(particle => {
      // Movimiento aleatorio continuo
      particle.x += particle.speedX;
      particle.y += particle.speedY;

      // Rebotar en los bordes del header
      if (particle.x < 0 || particle.x > 100) particle.speedX *= -1;
      if (particle.y < 0 || particle.y > 100) particle.speedY *= -1;

      // Aplicar movimiento + vibración por scroll
      const translateX = particle.x + (Math.random() * this.scrollIntensity * 10);
      const translateY = particle.y + (Math.random() * this.scrollIntensity * 10);

      particle.element.style.transform = `translate(-50%, -50%) translate(${translateX}%, ${translateY}%)`;
    });

    this.animationId = requestAnimationFrame(this.animate.bind(this));
  }

  handleScroll() {
    // Aumentar intensidad al hacer scroll (0 a 1)
    this.scrollIntensity = Math.min(window.scrollY / 200, 0.1);
    console.log("Intensidad de scroll:", this.scrollIntensity); // Debug
  }
}

// Iniciar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  new ParticlesAnimation();
});