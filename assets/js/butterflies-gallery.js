document.addEventListener('DOMContentLoaded', function() {
  // Importar dinámicamente el módulo de mariposas
  import('https://unpkg.com/threejs-toys@0.0.8/build/threejs-toys.module.cdn.min.js')
    .then(module => {
      const { butterfliesBackground } = module;
      
      // Verificar si el contenedor existe
      const container = document.getElementById('butterflies-container');
      if (!container) return;
      
      // Inicializar el efecto de mariposas con parámetros optimizados
      const butterflies = butterfliesBackground({
        el: container,
        // Importante: NO usar eventsEl para evitar capturar eventos de scroll
        gpgpuSize: 8, // Reducido de 12 a 8 para mejor rendimiento
        background: 0xf8f8f8,
        material: 'basic', // Cambiado de 'phong' a 'basic' para mejor rendimiento
        lights: [
          { type: 'ambient', params: [0xffffff, 0.6] }
          // Eliminada la luz direccional para mejorar rendimiento
        ],
        materialParams: { 
          transparent: true, 
          alphaTest: 0.5,
          depthWrite: false // Mejora rendimiento
        },
        texture: 'https://assets.codepen.io/33787/butterflies.png',
        textureCount: 4,
        wingsScale: [1.2, 1.2, 1.2], // Reducido de 1.5 a 1.2
        wingsWidthSegments: 4, // Reducido de 8 a 4
        wingsHeightSegments: 4, // Reducido de 8 a 4
        wingsSpeed: 0.5, // Reducido de 0.75 a 0.5
        wingsDisplacementScale: 1.0, // Reducido de 1.25 a 1.0
        noiseCoordScale: 0.01,
        noiseTimeCoef: 0.0004, // Reducido para movimientos más suaves
        noiseIntensity: 0.002, // Reducido para movimientos más suaves
        attractionRadius1: 100,
        attractionRadius2: 150,
        maxVelocity: 0.08 // Reducido de 0.1 a 0.08
      });
      
      // Asegurarse de que el contenedor no capture eventos de scroll
      if (container) {
        container.style.pointerEvents = 'none';
      }
      
      // Asegurarse de que el canvas no interfiera con el scroll
      const canvas = container.querySelector('canvas');
      if (canvas) {
        canvas.style.pointerEvents = 'none';
      }
      
      // Optimización del evento de scroll con throttling
      let lastScrollTime = 0;
      const scrollThrottle = 16; // ~60fps
      
      window.addEventListener('scroll', function() {
        const now = Date.now();
        if (now - lastScrollTime < scrollThrottle) return;
        lastScrollTime = now;
        
        const scrollY = window.scrollY;
        const gallerySection = document.getElementById('gallery-section');
        
        if (!gallerySection) return;
        
        const sectionTop = gallerySection.offsetTop;
        const sectionHeight = gallerySection.offsetHeight;
        
        // Solo aplicar el efecto cuando estamos cerca de la sección de galería
        if (scrollY > sectionTop - window.innerHeight && scrollY < sectionTop + sectionHeight) {
          // Calcular un valor de desplazamiento basado en la posición de scroll
          const offset = (scrollY - (sectionTop - window.innerHeight)) * 0.03; // Reducido de 0.05 a 0.03
          
          // Mover ligeramente las mariposas según el scroll
          if (butterflies && butterflies.uniforms && butterflies.uniforms.uTime) {
            // Modificar el tiempo de animación basado en el scroll
            butterflies.uniforms.uTime.value += offset * 0.00005; // Reducido para movimiento más suave
          }
        }
      }, { passive: true }); // Añadir passive: true para mejor rendimiento
      
      // Optimización del evento resize con debounce
      let resizeTimeout;
      window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
          if (butterflies && butterflies.resize) {
            butterflies.resize();
          }
        }, 200); // Esperar 200ms después del último evento de resize
      }, { passive: true });
      
      // Pausar animación cuando no es visible
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (butterflies && butterflies.renderer) {
            if (entry.isIntersecting) {
              // Reanudar animación cuando es visible
              butterflies.renderer.setAnimationLoop(butterflies.render);
            } else {
              // Pausar animación cuando no es visible
              butterflies.renderer.setAnimationLoop(null);
            }
          }
        });
      }, { threshold: 0.1 });
      
      if (container) {
        observer.observe(container);
      }
    })
    .catch(error => {
      console.error('Error al cargar el efecto de mariposas:', error);
    });
});