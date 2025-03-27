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
  
  // Replace the existing smoothScroll function
  function smoothScroll(event) {
      requestAnimationFrame(() => {
          const currentTime = new Date().getTime();
          
          if (currentTime - lastTime < 16) {
              event.preventDefault();
              return;
          }
          
          lastTime = currentTime;
      });
  }
  
  // Aplicar smooth scroll a la rueda del mouse
  window.addEventListener('wheel', smoothScroll, { passive: false });
  
  // Animación de aparición al hacer scroll
  // Replace existing animateOnScroll function
  const animateOnScroll = function() {
      const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
              if (entry.isIntersecting) {
                  entry.target.classList.add('active');
              }
          });
      }, {
          threshold: 0.1,
          rootMargin: '50px'
      });
  
      document.querySelectorAll('.fade-in, .slide-in, .zoom-in').forEach(element => {
          observer.observe(element);
      });
  };
  
  // Ejecutar la animación al cargar y al hacer scroll
  window.addEventListener('scroll', animateOnScroll);
  window.addEventListener('load', animateOnScroll);
});