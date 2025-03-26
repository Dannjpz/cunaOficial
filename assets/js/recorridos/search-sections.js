document.addEventListener('DOMContentLoaded', function () {
  console.log("Inicializando navegación de secciones de búsqueda");

  // Seleccionar todos los formularios de búsqueda
  const searchForms = document.querySelectorAll('.search-form');
  console.log(`Formularios encontrados: ${searchForms.length}`);

  searchForms.forEach((form, formIndex) => {
    const sections = form.querySelectorAll('.search-section');
    const indicators = form.querySelectorAll('.indicator');
    const prevBtn = form.querySelector('.section-nav.prev');
    const nextBtn = form.querySelector('.section-nav.next');

    console.log(`Formulario ${formIndex + 1}: ${sections.length} secciones, ${indicators.length} indicadores`);

    // Obtener el input de búsqueda
    const searchInput = form.querySelector('.search-input');
    if (searchInput) {
      // Añadir evento de input para búsqueda en tiempo real
      searchInput.addEventListener('input', function() {
        const query = this.value.trim();
        
        // Recopilar datos del formulario
        const formData = {
          query: query,
          dateFilterActive: false,
          guestsFilterActive: false
        };
        
        // Verificar si hay fechas seleccionadas
        const startDateInput = form.querySelector('[id^="start-date"]');
        const endDateInput = form.querySelector('[id^="end-date"]');
        if (startDateInput && startDateInput.dataset.userInteracted === 'true' && 
            endDateInput && endDateInput.dataset.userInteracted === 'true') {
          formData.dateFilterActive = true;
          formData.startDate = startDateInput.value;
          formData.endDate = endDateInput.value;
        }
        
        // Verificar si hay huéspedes seleccionados
        const guestsInput = form.querySelector('[id^="guests-count"]');
        if (guestsInput && guestsInput.dataset.userInteracted === 'true') {
          formData.guestsFilterActive = true;
          formData.guests = guestsInput.value;
        }
        
        // Realizar la búsqueda en tiempo real
        if (typeof window.performAdvancedSearch === 'function') {
          window.performAdvancedSearch(formData);
        }
        
        // Mientras se está escribiendo, mantener el botón en modo búsqueda
        const searchButton = form.querySelector('.search-button');
        if (searchButton) {
          // Siempre mostrar como botón de búsqueda mientras se escribe
          searchButton.classList.remove('reset-mode');
          searchButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          `;
          searchButton.setAttribute('title', 'Buscar');
        }
      });
      
      // Añadir evento de blur (cuando el usuario quita el foco del campo)
      searchInput.addEventListener('blur', function() {
        const query = this.value.trim();
        const searchButton = form.querySelector('.search-button');
        
        if (searchButton && query.length > 0) {
          // Si hay texto en el campo cuando se quita el foco, cambiar a modo reset
          searchButton.classList.add('reset-mode');
          searchButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          `;
          searchButton.setAttribute('title', 'Limpiar filtros');
        }
      });
    }

    let currentSection = 0;

    // Función para mostrar una sección específica
    function showSection(index) {
      console.log(`Mostrando sección ${index + 1} en formulario ${formIndex + 1}`);

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
      prevBtn.addEventListener('click', function (e) {
        e.preventDefault();
        console.log(`Botón anterior clickeado en formulario ${formIndex + 1}`);
        if (currentSection > 0) {
          showSection(currentSection - 1);
        }
      });
    }

    // Evento para el botón siguiente
    if (nextBtn) {
      nextBtn.addEventListener('click', function (e) {
        e.preventDefault();
        console.log(`Botón siguiente clickeado en formulario ${formIndex + 1}`);
        if (currentSection < sections.length - 1) {
          showSection(currentSection + 1);
        }
      });
    }

    // Eventos para los indicadores
    indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', function (e) {
        e.preventDefault();
        console.log(`Indicador ${index + 1} clickeado en formulario ${formIndex + 1}`);
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
      input1.addEventListener('input', function () {
        input2.value = this.value;
      });

      input2.addEventListener('input', function () {
        input1.value = this.value;
      });
    }
  }

  // Manejar el envío de los formularios
  document.querySelectorAll('.search-form').forEach(form => {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Recopilar datos de todas las secciones
      const formData = {
        query: form.querySelector('.search-input').value,
        startDate: form.querySelector('[id^="start-date"]').value,
        endDate: form.querySelector('[id^="end-date"]').value,
        guests: form.querySelector('[id^="guests-count"]').value,
        // Añadir flags para saber si el usuario interactuó con estos campos
        dateFilterActive: form.querySelector('[id^="start-date"]').dataset.userInteracted === 'true' ||
          form.querySelector('[id^="end-date"]').dataset.userInteracted === 'true',
        guestsFilterActive: form.querySelector('[id^="guests-count"]').dataset.userInteracted === 'true'
      };

      console.log('Búsqueda avanzada:', formData);

      // Realizar la búsqueda con los datos completos
      performAdvancedSearch(formData);

      // Quitar el foco del input para activar el evento blur
      const searchInput = form.querySelector('.search-input');
      if (searchInput) {
        searchInput.blur();
      }
    });
  });

  // Añadir evento de clic para el botón de reset
  document.querySelectorAll('.search-form').forEach(form => {
    const searchButton = form.querySelector('.search-button');
    if (searchButton) {
      searchButton.addEventListener('click', function (e) {
        // Solo actuar como reset si está en modo reset
        if (this.classList.contains('reset-mode')) {
          e.preventDefault(); // Prevenir el envío del formulario

          // Restablecer todos los campos del formulario
          const searchInput = form.querySelector('.search-input');
          const startDateInput = form.querySelector('[id^="start-date"]');
          const endDateInput = form.querySelector('[id^="end-date"]');
          const guestsInput = form.querySelector('[id^="guests-count"]');

          if (searchInput) searchInput.value = '';

          // Obtener la fecha actual para la fecha inicial
          const today = new Date();
          const formattedToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
          
          // Obtener el 7 de diciembre del año en curso para la fecha final
          const endOfYear = new Date();
          endOfYear.setMonth(11); // Diciembre (0-indexed)
          endOfYear.setDate(7);   // Día 7
          const formattedEndOfYear = `${endOfYear.getFullYear()}-12-07`;

          // Restaurar fechas a los valores correctos
          if (startDateInput) {
            startDateInput.value = formattedToday;
            startDateInput.dataset.userInteracted = 'false';
          }

          if (endDateInput) {
            endDateInput.value = formattedEndOfYear;
            endDateInput.dataset.userInteracted = 'false';
          }

          if (guestsInput) {
            guestsInput.value = guestsInput.getAttribute('data-default-value') || '2'; // Valor por defecto
            guestsInput.dataset.userInteracted = 'false';
          }

          // Sincronizar los campos entre formularios
          if (form.id === 'package-search-form-header') {
            const welcomeForm = document.getElementById('package-search-form-welcome');
            if (welcomeForm) {
              const welcomeSearchInput = welcomeForm.querySelector('.search-input');
              const welcomeStartDateInput = welcomeForm.querySelector('[id^="start-date"]');
              const welcomeEndDateInput = welcomeForm.querySelector('[id^="end-date"]');
              const welcomeGuestsInput = welcomeForm.querySelector('[id^="guests-count"]');

              if (welcomeSearchInput) welcomeSearchInput.value = '';
              if (welcomeStartDateInput) {
                welcomeStartDateInput.value = formattedToday;
                welcomeStartDateInput.dataset.userInteracted = 'false';
              }
              if (welcomeEndDateInput) {
                welcomeEndDateInput.value = formattedEndOfYear;
                welcomeEndDateInput.dataset.userInteracted = 'false';
              }
              if (welcomeGuestsInput) {
                welcomeGuestsInput.value = guestsInput.value;
                welcomeGuestsInput.dataset.userInteracted = 'false';
              }
            }
          } else if (form.id === 'package-search-form-welcome') {
            const headerForm = document.getElementById('package-search-form-header');
            if (headerForm) {
              const headerSearchInput = headerForm.querySelector('.search-input');
              const headerStartDateInput = headerForm.querySelector('[id^="start-date"]');
              const headerEndDateInput = headerForm.querySelector('[id^="end-date"]');
              const headerGuestsInput = headerForm.querySelector('[id^="guests-count"]');

              if (headerSearchInput) headerSearchInput.value = '';
              if (headerStartDateInput) {
                headerStartDateInput.value = formattedToday;
                headerStartDateInput.dataset.userInteracted = 'false';
              }
              if (headerEndDateInput) {
                headerEndDateInput.value = formattedEndOfYear;
                headerEndDateInput.dataset.userInteracted = 'false';
              }
              if (headerGuestsInput) {
                headerGuestsInput.value = guestsInput.value;
                headerGuestsInput.dataset.userInteracted = 'false';
              }
            }
          }

          // Cambiar el botón de vuelta a modo búsqueda
          this.classList.remove('reset-mode');
          this.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          `;
          this.setAttribute('title', 'Buscar');

          // Importante: Ejecutar la búsqueda con criterios vacíos para mostrar todos los paquetes
          if (typeof window.performAdvancedSearch === 'function') {
            const emptyFormData = {
              query: '',
              startDate: formattedToday,
              endDate: formattedEndOfYear,
              guests: '2',
              dateFilterActive: false,
              guestsFilterActive: false
            };
            window.performAdvancedSearch(emptyFormData);
          } else if (typeof window.resetPackageView === 'function') {
            // Alternativa: usar la función global de reset si está disponible
            window.resetPackageView();
          }
        }
      });
    }
  });

  // Añadir evento de clic para el botón de reset
  document.querySelectorAll('.search-form').forEach(form => {
    const searchButton = form.querySelector('.search-button');
    if (searchButton) {
      searchButton.addEventListener('click', function (e) {
        // Solo actuar como reset si está en modo reset
        if (this.classList.contains('reset-mode')) {
          e.preventDefault(); // Prevenir el envío del formulario

          // Restablecer todos los campos del formulario
          const searchInput = form.querySelector('.search-input');
          const startDateInput = form.querySelector('[id^="start-date"]');
          const endDateInput = form.querySelector('[id^="end-date"]');
          const guestsInput = form.querySelector('[id^="guests-count"]');

          if (searchInput) searchInput.value = '';

          // Restaurar fechas a sus valores iniciales o formato predeterminado
          if (startDateInput) {
            // Usar el valor por defecto o el placeholder como valor inicial
            startDateInput.value = startDateInput.getAttribute('data-default-value') || '';
            startDateInput.dataset.userInteracted = 'false';
          }

          if (endDateInput) {
            // Usar el valor por defecto o el placeholder como valor inicial
            endDateInput.value = endDateInput.getAttribute('data-default-value') || '';
            endDateInput.dataset.userInteracted = 'false';
          }

          if (guestsInput) {
            guestsInput.value = guestsInput.getAttribute('data-default-value') || '2'; // Valor por defecto
            guestsInput.dataset.userInteracted = 'false';
          }

          // Sincronizar los campos entre formularios
          if (form.id === 'package-search-form-header') {
            const welcomeForm = document.getElementById('package-search-form-welcome');
            if (welcomeForm) {
              const welcomeSearchInput = welcomeForm.querySelector('.search-input');
              const welcomeStartDateInput = welcomeForm.querySelector('[id^="start-date"]');
              const welcomeEndDateInput = welcomeForm.querySelector('[id^="end-date"]');
              const welcomeGuestsInput = welcomeForm.querySelector('[id^="guests-count"]');

              if (welcomeSearchInput) welcomeSearchInput.value = '';
              if (welcomeStartDateInput) {
                welcomeStartDateInput.value = startDateInput.value;
                welcomeStartDateInput.dataset.userInteracted = 'false';
              }
              if (welcomeEndDateInput) {
                welcomeEndDateInput.value = endDateInput.value;
                welcomeEndDateInput.dataset.userInteracted = 'false';
              }
              if (welcomeGuestsInput) {
                welcomeGuestsInput.value = guestsInput.value;
                welcomeGuestsInput.dataset.userInteracted = 'false';
              }
            }
          } else if (form.id === 'package-search-form-welcome') {
            const headerForm = document.getElementById('package-search-form-header');
            if (headerForm) {
              const headerSearchInput = headerForm.querySelector('.search-input');
              const headerStartDateInput = headerForm.querySelector('[id^="start-date"]');
              const headerEndDateInput = headerForm.querySelector('[id^="end-date"]');
              const headerGuestsInput = headerForm.querySelector('[id^="guests-count"]');

              if (headerSearchInput) headerSearchInput.value = '';
              if (headerStartDateInput) {
                headerStartDateInput.value = startDateInput.value;
                headerStartDateInput.dataset.userInteracted = 'false';
              }
              if (headerEndDateInput) {
                headerEndDateInput.value = endDateInput.value;
                headerEndDateInput.dataset.userInteracted = 'false';
              }
              if (headerGuestsInput) {
                headerGuestsInput.value = guestsInput.value;
                headerGuestsInput.dataset.userInteracted = 'false';
              }
            }
          }

          // Cambiar el botón de vuelta a modo búsqueda
          this.classList.remove('reset-mode');
          this.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          `;
          this.setAttribute('title', 'Buscar');

          // Importante: Ejecutar la búsqueda con criterios vacíos para mostrar todos los paquetes
          if (typeof window.performAdvancedSearch === 'function') {
            const emptyFormData = {
              query: '',
              startDate: '',
              endDate: '',
              guests: '',
              dateFilterActive: false,
              guestsFilterActive: false
            };
            window.performAdvancedSearch(emptyFormData);
          } else if (typeof window.resetPackageView === 'function') {
            // Alternativa: usar la función global de reset si está disponible
            window.resetPackageView();
          }
        }
      });
    }
  });

  // También marcar como interactuado cuando se selecciona un valor del dropdown
  const dropdown = document.querySelector(`#guests-dropdown-${guestsInput.id.includes('header') ? 'header' : 'welcome'}`);
  if (dropdown) {
    dropdown.addEventListener('click', function (e) {
      if (e.target.classList.contains('guest-option')) {
        guestsInput.dataset.userInteracted = 'true';
        // Sincronizar con el otro formulario
        const isHeader = guestsInput.id.includes('header');
        const correspondingId = isHeader ?
          guestsInput.id.replace('header', 'welcome') :
          guestsInput.id.replace('welcome', 'header');

        const correspondingInput = document.getElementById(correspondingId);
        if (correspondingInput) {
          correspondingInput.dataset.userInteracted = 'true';
        }
      }
    });
  }
});
