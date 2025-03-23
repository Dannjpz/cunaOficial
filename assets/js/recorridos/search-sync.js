document.addEventListener('DOMContentLoaded', function() {
  // Obtener referencias a ambos buscadores
  const headerSearchInput = document.querySelector('.header-container .search-input');
  const welcomeSearchInput = document.querySelector('#welcome-section .search-input');
  const headerSearchForm = document.querySelector('.header-container .search-form');
  const welcomeSearchForm = document.querySelector('#welcome-section .search-form');
  
  // Función para sincronizar los valores de los inputs
  function syncSearchInputs(source, target) {
    source.addEventListener('input', function() {
      target.value = this.value;
    });
  }
  
  // Sincronizar en ambas direcciones
  if (headerSearchInput && welcomeSearchInput) {
    syncSearchInputs(headerSearchInput, welcomeSearchInput);
    syncSearchInputs(welcomeSearchInput, headerSearchInput);
    
    // Manejar el envío de formularios
    headerSearchForm.addEventListener('submit', function(e) {
      e.preventDefault(); // Prevenir el comportamiento predeterminado
      // Actualizar el otro input antes de enviar
      welcomeSearchInput.value = headerSearchInput.value;
      // Realizar la búsqueda sin redirigir
      performSearch(headerSearchInput.value);
    });
    
    welcomeSearchForm.addEventListener('submit', function(e) {
      e.preventDefault(); // Prevenir el comportamiento predeterminado
      // Actualizar el otro input antes de enviar
      headerSearchInput.value = welcomeSearchInput.value;
      // Realizar la búsqueda sin redirigir
      performSearch(welcomeSearchInput.value);
    });
  }
  
  // Función para realizar la búsqueda
  function performSearch(query) {
    console.log('Realizando búsqueda con: ' + query);
    
    // Opcional: desplazarse a la sección de paquetes sin cambiar la URL
    const packagesSection = document.getElementById('packages-section');
    if (packagesSection) {
      packagesSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Filtrar las tarjetas de paquetes según la consulta
    filterPackages(query);
    
    // Importante: No redirigir ni cambiar la URL
  }
  
  function filterPackages(query) {
    if (!query) {
      // Si no hay consulta, mostrar todos los paquetes
      document.querySelectorAll('.package-card').forEach(card => {
        card.style.display = 'block';
        card.classList.remove('highlight');
      });
      return;
    }
    
    query = query.toLowerCase();
    
    // Filtrar las tarjetas según el texto o etiquetas
    document.querySelectorAll('.package-card').forEach(card => {
      const cardText = card.textContent.toLowerCase();
      const cardTags = card.getAttribute('data-package-tags') || '';
      
      if (cardText.includes(query) || cardTags.toLowerCase().includes(query)) {
        card.style.display = 'block';
        // Opcional: resaltar la tarjeta que coincide
        card.classList.add('highlight');
      } else {
        card.style.display = 'none';
        card.classList.remove('highlight');
      }
    });
  }
});