document.addEventListener('DOMContentLoaded', function() {
  // Opciones para el smooth scroll
  const scrollOptions = {
      behavior: 'smooth',
      block: 'start'
  };

  // Manejar todos los enlaces internos para smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
          e.preventDefault();
          
          // Obtener el destino del enlace
          const targetId = this.getAttribute('href');
          
          // Si es solo "#", scroll al inicio
          if (targetId === '#') {
              window.scrollTo({
                  top: 0,
                  behavior: 'smooth'
              });
              return;
          }
          
          const targetElement = document.querySelector(targetId);
          
          if (targetElement) {
              // Calcular la posición considerando el header fijo
              const headerHeight = document.querySelector('.main-header')?.offsetHeight || 0;
              const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
              
              // Realizar el scroll
              window.scrollTo({
                  top: targetPosition,
                  behavior: 'smooth'
              });
          }
      });
  });

  // Smooth scroll para toda la página
  let lastTime = 0;
  
  function smoothScroll(event) {
      const currentTime = new Date().getTime();
      
      // Limitar la frecuencia de actualización para mejor rendimiento
      if (currentTime - lastTime < 16) {
          event.preventDefault();
          return;
      }
      
      lastTime = currentTime;
  }
  
  // Aplicar smooth scroll a la rueda del mouse
  window.addEventListener('wheel', smoothScroll, { passive: false });
  
  // Animación de aparición al hacer scroll
  const animateOnScroll = function() {
      const elements = document.querySelectorAll('.fade-in, .slide-in, .zoom-in');
      
      elements.forEach(element => {
          const elementTop = element.getBoundingClientRect().top;
          const elementVisible = 150;
          
          if (elementTop < window.innerHeight - elementVisible) {
              element.classList.add('active');
          } else {
              element.classList.remove('active');
          }
      });
  };
  
  // Ejecutar la animación al cargar y al hacer scroll
  window.addEventListener('scroll', animateOnScroll);
  window.addEventListener('load', animateOnScroll);
});