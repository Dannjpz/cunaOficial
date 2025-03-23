document.addEventListener('DOMContentLoaded', function() {
  // Seleccionar los elementos relevantes
  const headerSearchContainer = document.querySelector('.header-container .search-container');
  const welcomeSection = document.getElementById('welcome-section');
  const welcomeSearchContainer = document.querySelector('#welcome-section .search-container');
  
  // Ocultar inicialmente el buscador del header
  if (headerSearchContainer) {
    headerSearchContainer.style.opacity = '0';
    headerSearchContainer.style.visibility = 'hidden';
    headerSearchContainer.style.transition = 'opacity 0.3s ease, visibility 0.3s ease';
  }
  
  // Función para verificar la visibilidad del buscador de welcome section
  function checkSearchVisibility() {
    if (!welcomeSearchContainer || !headerSearchContainer) return;
    
    const welcomeSearchRect = welcomeSearchContainer.getBoundingClientRect();
    const isWelcomeSearchVisible = (
      welcomeSearchRect.top < window.innerHeight &&
      welcomeSearchRect.bottom > 0
    );
    
    // Mostrar u ocultar el buscador del header según la visibilidad del welcome search
    if (isWelcomeSearchVisible) {
      headerSearchContainer.style.opacity = '0';
      headerSearchContainer.style.visibility = 'hidden';
    } else {
      headerSearchContainer.style.opacity = '1';
      headerSearchContainer.style.visibility = 'visible';
    }
  }
  
  // Verificar al cargar la página
  checkSearchVisibility();
  
  // Verificar al hacer scroll
  window.addEventListener('scroll', checkSearchVisibility);
  
  // Verificar al cambiar el tamaño de la ventana
  window.addEventListener('resize', checkSearchVisibility);
});