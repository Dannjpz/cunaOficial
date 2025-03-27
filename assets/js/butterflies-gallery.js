document.addEventListener('DOMContentLoaded', function() {
  // Importar dinámicamente el módulo de mariposas
  import('https://unpkg.com/threejs-toys@0.0.8/build/threejs-toys.module.cdn.min.js')
    .then(module => {
      const { butterfliesBackground } = module;
      
      // Verificar si el contenedor existe
      const container = document.getElementById('butterflies-container');
      if (!container) return;
      
      // Inicializar el efecto de mariposas
      const butterflies = butterfliesBackground({
        el: container,
        // Importante: NO usar eventsEl para evitar capturar eventos de scroll
        // eventsEl: document.getElementById('gallery-section'),
        gpgpuSize: 12, // Reducido para mejor rendimiento
        background: 0xf8f8f8, // Color de fondo que combina con tu galería
        material: 'phong',
        lights: [
          { type: 'ambient', params: [0xffffff, 0.6] },
          { type: 'directional', params: [0xffffff, 0.8], props: { position: [10, 0, 0] } }
        ],
        materialParams: { transparent: true, alphaTest: 0.5 },
        texture: 'https://assets.codepen.io/33787/butterflies.png',
        textureCount: 4,
        wingsScale: [1.5, 1.5, 1.5], // Tamaño reducido
        wingsWidthSegments: 8, // Reducido para mejor rendimiento
        wingsHeightSegments: 8, // Reducido para mejor rendimiento
        wingsSpeed: 0.75,
        wingsDisplacementScale: 1.25,
        noiseCoordScale: 0.01,
        noiseTimeCoef: 0.0005,
        noiseIntensity: 0.0025,
        attractionRadius1: 100,
        attractionRadius2: 150,
        maxVelocity: 0.1
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
      
      // Añadir un efecto de movimiento suave al hacer scroll
      window.addEventListener('scroll', function() {
        const scrollY = window.scrollY;
        const gallerySection = document.getElementById('gallery-section');
        
        if (!gallerySection) return;
        
        const sectionTop = gallerySection.offsetTop;
        const sectionHeight = gallerySection.offsetHeight;
        
        // Solo aplicar el efecto cuando estamos cerca de la sección de galería
        if (scrollY > sectionTop - window.innerHeight && scrollY < sectionTop + sectionHeight) {
          // Calcular un valor de desplazamiento basado en la posición de scroll
          const offset = (scrollY - (sectionTop - window.innerHeight)) * 0.05;
          
          // Mover ligeramente las mariposas según el scroll
          if (butterflies && butterflies.uniforms && butterflies.uniforms.uTime) {
            // Modificar el tiempo de animación basado en el scroll
            butterflies.uniforms.uTime.value += offset * 0.0001;
          }
        }
      });
      
      // Ajustar el tamaño cuando cambia el tamaño de la ventana
      window.addEventListener('resize', function() {
        if (butterflies && butterflies.resize) {
          butterflies.resize();
        }
      });
    })
    .catch(error => {
      console.error('Error al cargar el efecto de mariposas:', error);
    });
});