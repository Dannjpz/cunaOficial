document.addEventListener('DOMContentLoaded', function() {
  // Obtener referencias a ambos buscadores
  const headerSearchInput = document.querySelector('.header-container .search-input');
  const welcomeSearchInput = document.querySelector('#welcome-section .search-input');
  const headerSearchForm = document.querySelector('.header-container .search-form');
  const welcomeSearchForm = document.querySelector('#welcome-section .search-form');
  
  // Obtener referencias a los botones de búsqueda/reset
  const headerSearchButton = headerSearchForm?.querySelector('.search-button');
  const welcomeSearchButton = welcomeSearchForm?.querySelector('.search-button');
  
  // Función para sincronizar los valores de los inputs
  function syncSearchInputs(source, target) {
    source.addEventListener('input', function() {
      target.value = this.value;
      
      // Actualizar estado de los botones según si hay texto o no
      updateButtonStates(this.value);
    });
  }
  
  // Función para actualizar el estado de los botones (búsqueda/reset)
  function updateButtonStates(value) {
    if (!headerSearchButton || !welcomeSearchButton) return;
    
    if (value && value.trim() !== '' && value !== 'filter-active') {
      // Si hay texto, cambiar a modo reset
      headerSearchButton.classList.add('reset-mode');
      welcomeSearchButton.classList.add('reset-mode');
      headerSearchButton.setAttribute('title', 'Limpiar filtros');
      welcomeSearchButton.setAttribute('title', 'Limpiar filtros');
      
      // Actualizar el contenido SVG para mostrar una X
      updateButtonToResetIcon(headerSearchButton);
      updateButtonToResetIcon(welcomeSearchButton);
    } else {
      // Si no hay texto, cambiar a modo búsqueda
      headerSearchButton.classList.remove('reset-mode');
      welcomeSearchButton.classList.remove('reset-mode');
      headerSearchButton.setAttribute('title', 'Buscar');
      welcomeSearchButton.setAttribute('title', 'Buscar');
      
      // Actualizar el contenido SVG para mostrar una lupa
      updateButtonToSearchIcon(headerSearchButton);
      updateButtonToSearchIcon(welcomeSearchButton);
    }
  }
  
  // Función para actualizar el botón a icono de reset (X)
  function updateButtonToResetIcon(button) {
    button.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" 
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    `;
  }
  
  // Función para actualizar el botón a icono de búsqueda (lupa)
  function updateButtonToSearchIcon(button) {
    button.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
    `;
  }
  
  // Sincronizar en ambas direcciones
  if (headerSearchInput && welcomeSearchInput) {
    syncSearchInputs(headerSearchInput, welcomeSearchInput);
    syncSearchInputs(welcomeSearchInput, headerSearchInput);
    
    // Manejar el envío de formularios
    headerSearchForm.addEventListener('submit', function(e) {
      e.preventDefault(); // Prevenir el comportamiento predeterminado
      
      if (headerSearchButton.classList.contains('reset-mode')) {
        // Si está en modo reset, limpiar los campos
        headerSearchInput.value = '';
        welcomeSearchInput.value = '';
        updateButtonStates('');
        // Restablecer los filtros
        filterSections({ query: '', dateFilterActive: false });
      } else {
        // Actualizar el otro input antes de enviar
        welcomeSearchInput.value = headerSearchInput.value;
        // Realizar la búsqueda sin redirigir
        performSearch(headerSearchInput.value);
      }
    });
    
    welcomeSearchForm.addEventListener('submit', function(e) {
      e.preventDefault(); // Prevenir el comportamiento predeterminado
      
      if (welcomeSearchButton.classList.contains('reset-mode')) {
        // Si está en modo reset, limpiar los campos
        headerSearchInput.value = '';
        welcomeSearchInput.value = '';
        updateButtonStates('');
        // Restablecer los filtros
        filterSections({ query: '', dateFilterActive: false });
      } else {
        // Actualizar el otro input antes de enviar
        headerSearchInput.value = welcomeSearchInput.value;
        // Realizar la búsqueda sin redirigir
        performSearch(welcomeSearchInput.value);
      }
    });
    
    // Sincronizar fechas
    const headerStartDate = document.getElementById('start-date-header');
    const welcomeStartDate = document.getElementById('start-date-welcome');
    const headerEndDate = document.getElementById('end-date-header');
    const welcomeEndDate = document.getElementById('end-date-welcome');
    
    if (headerStartDate && welcomeStartDate) {
      headerStartDate.addEventListener('change', function() {
        welcomeStartDate.value = this.value;
        updateFiltersFromDates();
      });
      
      welcomeStartDate.addEventListener('change', function() {
        headerStartDate.value = this.value;
        updateFiltersFromDates();
      });
    }
    
    if (headerEndDate && welcomeEndDate) {
      headerEndDate.addEventListener('change', function() {
        welcomeEndDate.value = this.value;
        updateFiltersFromDates();
      });
      
      welcomeEndDate.addEventListener('change', function() {
        headerEndDate.value = this.value;
        updateFiltersFromDates();
      });
    }
    
    // Función para actualizar filtros basados en fechas
    function updateFiltersFromDates() {
      const startDate = headerStartDate?.value || welcomeStartDate?.value;
      const endDate = headerEndDate?.value || welcomeEndDate?.value;
      
      if (startDate) {
        filterSections({
          query: headerSearchInput.value || welcomeSearchInput.value,
          dateFilterActive: true,
          startDate: startDate,
          endDate: endDate
        });
        
        // Actualizar botones a modo reset si hay fechas seleccionadas
        if (headerSearchInput.value || welcomeSearchInput.value) {
          updateButtonStates(headerSearchInput.value || welcomeSearchInput.value);
        }
      }
    }
  }
  
  // Función para realizar la búsqueda
  function performSearch(query) {
    console.log('Realizando búsqueda con: ' + query);
    
    // Opcional: desplazarse a la sección de paquetes sin cambiar la URL
    const heroSection = document.getElementById('hero-section');
    if (heroSection) {
      heroSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Filtrar las secciones según la consulta
    filterSections({ query: query });
  }
  
  // Asegurar que los botones muestren el icono de búsqueda al cargar la página
  // Colocamos esto al final para asegurarnos de que se ejecute después de cualquier otra inicialización
  setTimeout(() => {
    if (headerSearchButton && welcomeSearchButton) {
      // Verificar si hay texto en los campos de búsqueda
      const hasSearchText = (headerSearchInput && headerSearchInput.value && headerSearchInput.value.trim() !== '') || 
                           (welcomeSearchInput && welcomeSearchInput.value && welcomeSearchInput.value.trim() !== '');
      
      if (!hasSearchText) {
        // Solo cambiar a icono de búsqueda si no hay texto
        headerSearchButton.classList.remove('reset-mode');
        welcomeSearchButton.classList.remove('reset-mode');
        headerSearchButton.setAttribute('title', 'Buscar');
        welcomeSearchButton.setAttribute('title', 'Buscar');
        updateButtonToSearchIcon(headerSearchButton);
        updateButtonToSearchIcon(welcomeSearchButton);
      }
    }
  }, 100); // Pequeño retraso para asegurar que se ejecute después de otras inicializaciones
});