document.addEventListener('DOMContentLoaded', function() {
    console.log("Inicializando navegación de secciones de búsqueda");
    
    // Seleccionar todos los formularios de búsqueda
    const searchForms = document.querySelectorAll('.search-form');
    console.log(`Formularios encontrados: ${searchForms.length}`);
    
    searchForms.forEach((form, formIndex) => {
      const sections = form.querySelectorAll('.search-section');
      const indicators = form.querySelectorAll('.indicator');
      const prevBtn = form.querySelector('.section-nav.prev');
      const nextBtn = form.querySelector('.section-nav.next');
      
      console.log(`Formulario ${formIndex+1}: ${sections.length} secciones, ${indicators.length} indicadores`);
      
      let currentSection = 0;
      
      // Función para mostrar una sección específica
      function showSection(index) {
        console.log(`Mostrando sección ${index+1} en formulario ${formIndex+1}`);
        
        // Ocultar todas las secciones
        sections.forEach(section => {
          section.classList.remove('active');
        });
        
        // Desactivar todos los indicadores
        indicators.forEach(indicator => {
          indicator.classList.remove('active');
        });
        
        // Mostrar la sección actual
        sections[index].classList.add('active');
        indicators[index].classList.add('active');
        
        // Actualizar el estado de los botones de navegación
        prevBtn.style.visibility = index === 0 ? 'hidden' : 'visible';
        nextBtn.style.visibility = index === sections.length - 1 ? 'hidden' : 'visible';
        
        currentSection = index;
      }
      
      // Evento para el botón anterior
      if (prevBtn) {
        prevBtn.addEventListener('click', function(e) {
          e.preventDefault();
          console.log(`Botón anterior clickeado en formulario ${formIndex+1}`);
          if (currentSection > 0) {
            showSection(currentSection - 1);
          }
        });
      }
      
      // Evento para el botón siguiente
      if (nextBtn) {
        nextBtn.addEventListener('click', function(e) {
          e.preventDefault();
          console.log(`Botón siguiente clickeado en formulario ${formIndex+1}`);
          if (currentSection < sections.length - 1) {
            showSection(currentSection + 1);
          }
        });
      }
      
      // Eventos para los indicadores
      indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', function(e) {
          e.preventDefault();
          console.log(`Indicador ${index+1} clickeado en formulario ${formIndex+1}`);
          showSection(index);
        });
      });
      
      // Inicializar la primera sección
      showSection(0);
    });
    
    // Sincronizar los valores entre los formularios
    const headerForm = document.getElementById('package-search-form-header');
    const welcomeForm = document.getElementById('package-search-form-welcome');
    
    if (headerForm && welcomeForm) {
      // Sincronizar inputs de texto
      syncInputs('package-search-input-header', 'package-search-input-welcome');
      
      // Sincronizar fechas
      syncInputs('start-date-header', 'start-date-welcome');
      syncInputs('end-date-header', 'end-date-welcome');
      
      // Sincronizar número de invitados
      syncInputs('guests-count-header', 'guests-count-welcome');
    }
    
    function syncInputs(id1, id2) {
      const input1 = document.getElementById(id1);
      const input2 = document.getElementById(id2);
      
      if (input1 && input2) {
        input1.addEventListener('input', function() {
          input2.value = this.value;
        });
        
        input2.addEventListener('input', function() {
          input1.value = this.value;
        });
      }
    }
    
    // Manejar el envío de los formularios
    document.querySelectorAll('.search-form').forEach(form => {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Recopilar datos de todas las secciones
        const formData = {
          query: form.querySelector('.search-input').value,
          startDate: form.querySelector('[id^="start-date"]').value,
          endDate: form.querySelector('[id^="end-date"]').value,
          guests: form.querySelector('[id^="guests-count"]').value
        };
        
        console.log('Búsqueda avanzada:', formData);
        
        // Realizar la búsqueda con los datos completos
        performAdvancedSearch(formData);
      });
    });
    
    // Función para realizar la búsqueda avanzada
    function performAdvancedSearch(data) {
      // Desplazarse a la sección de paquetes
      const packagesSection = document.getElementById('packages-section');
      if (packagesSection) {
        packagesSection.scrollIntoView({ behavior: 'smooth' });
      }
      
      // Filtrar paquetes según los criterios
      const packageCards = document.querySelectorAll('.package-card');
      
      packageCards.forEach(card => {
        // Obtener datos del paquete
        const cardText = card.textContent.toLowerCase();
        const cardTags = card.getAttribute('data-package-tags') || '';
        
        // Verificar si coincide con la búsqueda de texto
        const matchesText = data.query ? 
          (cardText.includes(data.query.toLowerCase()) || 
           cardTags.toLowerCase().includes(data.query.toLowerCase())) : true;
        
        // Verificar fechas (esto requeriría que los paquetes tengan atributos de fecha)
        // Por ahora, asumimos que todos coinciden con las fechas
        const matchesDates = true;
        
        // Verificar número de invitados (esto requeriría que los paquetes tengan capacidad)
        // Por ahora, asumimos que todos coinciden con el número de invitados
        const matchesGuests = true;
        
        // Mostrar u ocultar según coincidencias
        if (matchesText && matchesDates && matchesGuests) {
          card.style.display = 'block';
          card.classList.add('highlight');
        } else {
          card.style.display = 'none';
          card.classList.remove('highlight');
        }
      });
    }
  });