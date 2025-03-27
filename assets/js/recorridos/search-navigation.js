// Script para manejar la navegación automática a la sección de paquetes
document.addEventListener('DOMContentLoaded', function() {
  // Obtener los formularios de búsqueda
  const headerSearchForm = document.getElementById('package-search-form-header');
  const welcomeSearchForm = document.getElementById('package-search-form-welcome');
  
  // Función para manejar el envío del formulario
  function handleSearchSubmit(event) {
    event.preventDefault(); // Prevenir el envío normal del formulario
    
    // Obtener la sección de paquetes - intentar diferentes selectores
    let packagesSection = document.querySelector('.cont.s--inactive');
    
    // Si no se encuentra con el primer selector, intentar con alternativas
    if (!packagesSection) {
      packagesSection = document.querySelector('.cont');
      
      // Si aún no se encuentra, buscar por ID
      if (!packagesSection) {
        packagesSection = document.querySelector('#hero-section');
        
        // Si estamos en una página diferente, verificar si debemos redirigir
        if (!packagesSection) {
          // Verificar si estamos en la página principal
          const isHomePage = window.location.pathname === '/' || 
                            window.location.pathname === '/index.html' ||
                            window.location.pathname.endsWith('/index.html');
          
          if (!isHomePage) {
            // Redirigir a la página principal con un hash para la sección de paquetes
            window.location.href = '/index.html#hero-section';
            return;
          } else {
            console.log('Packages section not found on this page');
            return;
          }
        }
      }
    }
    
    // Desplazarse suavemente a la sección de paquetes
    if (packagesSection) {
      // Calcular la posición de la sección
      const packagesSectionPosition = packagesSection.getBoundingClientRect().top + window.pageYOffset;
      
      // Desplazarse a la sección con animación suave
      window.scrollTo({
        top: packagesSectionPosition - 100, // Ajustar para dejar espacio para el header
        behavior: 'smooth'
      });
      
      // Opcional: activar la sección de paquetes si está inactiva
      if (packagesSection.classList.contains('s--inactive')) {
        setTimeout(() => {
          packagesSection.classList.remove('s--inactive');
        }, 800); // Esperar a que termine el desplazamiento
      }
    }
    
    // Realizar la búsqueda (aquí puedes agregar la lógica de filtrado de paquetes)
    const searchInput = event.target.querySelector('.search-input').value.toLowerCase();
    filterPackages(searchInput);
  }
  
  // Función para filtrar paquetes según el término de búsqueda
  function filterPackages(searchTerm) {
    const packages = document.querySelectorAll('.el');
    
    // Si no hay paquetes para filtrar, salir de la función
    if (packages.length === 0) {
      console.log('No package elements found to filter');
      return;
    }
    
    let foundPackages = false;
    
    packages.forEach(pkg => {
      const tags = pkg.getAttribute('data-package-tags') || '';
      const title = pkg.querySelector('.el__heading');
      const description = pkg.querySelector('.el__text p');
      
      const titleText = title ? title.textContent.toLowerCase() : '';
      const descriptionText = description ? description.textContent.toLowerCase() : '';
      
      if (tags.toLowerCase().includes(searchTerm) || 
          titleText.includes(searchTerm) || 
          descriptionText.includes(searchTerm)) {
        pkg.style.display = '';
        foundPackages = true;
      } else {
        pkg.style.display = 'none';
      }
    });
    
    // Mostrar mensaje si no se encontraron paquetes
    const noResultsMessage = document.getElementById('no-results-message');
    if (noResultsMessage) {
      noResultsMessage.style.display = foundPackages ? 'none' : 'block';
    }
  }
  
  // Agregar event listeners a los formularios
  if (headerSearchForm) {
    headerSearchForm.addEventListener('submit', handleSearchSubmit);
  }
  
  if (welcomeSearchForm) {
    welcomeSearchForm.addEventListener('submit', handleSearchSubmit);
  }
});