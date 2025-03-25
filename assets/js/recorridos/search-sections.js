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

      // Cambiar el botón de búsqueda a botón de reset
      const searchButton = form.querySelector('.search-button');
      if (searchButton) {
        searchButton.classList.add('reset-mode');
        // Cambiar el ícono de lupa por un ícono de X
        searchButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          `;
        // Cambiar el título del botón
        searchButton.setAttribute('title', 'Limpiar filtros');
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
                welcomeStartDateInput.value = welcomeStartDateInput.getAttribute('data-default-value') || '';
                welcomeStartDateInput.dataset.userInteracted = 'false';
              }
              if (welcomeEndDateInput) {
                welcomeEndDateInput.value = welcomeEndDateInput.getAttribute('data-default-value') || '';
                welcomeEndDateInput.dataset.userInteracted = 'false';
              }
              if (welcomeGuestsInput) {
                welcomeGuestsInput.value = welcomeGuestsInput.getAttribute('data-default-value') || '2';
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
                headerStartDateInput.value = headerStartDateInput.getAttribute('data-default-value') || '';
                headerStartDateInput.dataset.userInteracted = 'false';
              }
              if (headerEndDateInput) {
                headerEndDateInput.value = headerEndDateInput.getAttribute('data-default-value') || '';
                headerEndDateInput.dataset.userInteracted = 'false';
              }
              if (headerGuestsInput) {
                headerGuestsInput.value = headerGuestsInput.getAttribute('data-default-value') || '2';
                headerGuestsInput.dataset.userInteracted = 'false';
              }
            }
          }

          // Mostrar todos los paquetes
          document.querySelectorAll('.package-card').forEach(card => {
            card.style.display = 'block';
            card.classList.remove('highlight');
          });

          // Ocultar mensaje de no resultados
          const noResultsMessage = document.getElementById('no-results-message');
          if (noResultsMessage) {
            noResultsMessage.style.display = 'none';
          }

          // Volver a cambiar el botón a modo búsqueda
          this.classList.remove('reset-mode');
          this.innerHTML = `
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            `;
          this.setAttribute('title', 'Buscar');

          // Desplazarse a la sección de paquetes
          const packagesSection = document.getElementById('packages-section');
          if (packagesSection) {
            packagesSection.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    }
  });

  // Función para realizar la búsqueda avanzada
  function performAdvancedSearch(data) {
    // Desplazarse a la sección de paquetes
    const packagesSection = document.getElementById('packages-section');
    if (packagesSection) {
      packagesSection.scrollIntoView({ behavior: 'smooth' });
    }

    console.log('Realizando búsqueda avanzada con datos:', data);

    // Filtrar paquetes según los criterios
    const packageCards = document.querySelectorAll('.package-card');
    let matchCount = 0;

    packageCards.forEach(card => {
      // Obtener datos del paquete
      const cardText = card.textContent.toLowerCase();
      const cardTags = card.getAttribute('data-package-tags') || '';

      // Verificar si coincide con la búsqueda de texto
      const matchesText = data.query ?
        (cardText.includes(data.query.toLowerCase()) ||
          cardTags.toLowerCase().includes(data.query.toLowerCase())) : true;

      // Verificar fechas solo si el filtro de fechas está activo
      let matchesDates = true;
      if (data.dateFilterActive && data.startDate && data.endDate) {
        try {
          // Convertir strings a objetos Date
          const startDate = new Date(data.startDate);
          const endDate = new Date(data.endDate);

          // Verificar que las fechas sean válidas
          if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            console.error('Fechas inválidas:', data.startDate, data.endDate);
            matchesDates = false;
          } else {
            // Obtener las fechas de salida del paquete
            const departureDatesStr = card.getAttribute('data-departure-dates') || '';
            if (!departureDatesStr) {
              matchesDates = false;
            } else {
              const departureDates = departureDatesStr.split(',').map(dateStr => {
                return new Date(dateStr.trim());
              });

              // Verificar si alguna fecha de salida coincide con el rango seleccionado
              matchesDates = departureDates.some(date => {
                // Verificar que la fecha sea válida
                if (isNaN(date.getTime())) {
                  console.error('Fecha de salida inválida:', date);
                  return false;
                }

                // Comparar fechas completas
                return date >= startDate && date <= endDate;
              });

              console.log(`Paquete ${card.querySelector('h3').textContent}:`, {
                fechasSalida: departureDatesStr,
                dentroDelRango: matchesDates,
                rangoSeleccionado: `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`
              });
            }
          }
        } catch (error) {
          console.error('Error al procesar fechas:', error);
          matchesDates = false;
        }
      }

      // Verificar número de invitados solo si el filtro de invitados está activo
      let matchesGuests = true;
      if (data.guestsFilterActive && data.guests) {
        const minGuests = parseInt(card.getAttribute('data-min-guests') || '0');
        const maxGuests = parseInt(card.getAttribute('data-max-guests') || '999');
        matchesGuests = parseInt(data.guests) >= minGuests && parseInt(data.guests) <= maxGuests;
      }

      // Mostrar u ocultar el paquete según los criterios combinados
      if (matchesText && matchesDates && matchesGuests) {
        card.style.display = 'block';
        card.classList.add('highlight');
        matchCount++;
      } else {
        card.style.display = 'none';
        card.classList.remove('highlight');
      }
    });

    console.log(`Se encontraron ${matchCount} paquetes que coinciden con los criterios.`);

    // Mostrar mensaje si no hay resultados
    const noResultsMessage = document.getElementById('no-results-message');
    if (noResultsMessage) {
      if (matchCount === 0) {
        noResultsMessage.style.display = 'block';
      } else {
        noResultsMessage.style.display = 'none';
      }
    }
  }
});

// Añadir detectores de interacción para los campos de fecha y huéspedes
document.querySelectorAll('[id^="start-date"], [id^="end-date"]').forEach(dateInput => {
  // Guardar el valor inicial como valor por defecto
  dateInput.setAttribute('data-default-value', dateInput.value);

  // Inicializar el atributo de datos
  dateInput.dataset.userInteracted = 'false';

  // Detectar cuando el usuario interactúa con el campo
  dateInput.addEventListener('change', function () {
    this.dataset.userInteracted = 'true';
    // Sincronizar el estado de interacción con el campo correspondiente en el otro formulario
    const isHeader = this.id.includes('header');
    const correspondingId = isHeader ?
      this.id.replace('header', 'welcome') :
      this.id.replace('welcome', 'header');

    const correspondingInput = document.getElementById(correspondingId);
    if (correspondingInput) {
      correspondingInput.dataset.userInteracted = 'true';
    }

    // Si es el campo de fecha final, y también hay una fecha inicial, ejecutar la búsqueda automáticamente
    if (this.id.includes('end-date')) {
      const formId = isHeader ? 'package-search-form-header' : 'package-search-form-welcome';
      const form = document.getElementById(formId);
      const startDateInput = form.querySelector('[id^="start-date"]');

      if (form && startDateInput && startDateInput.value && this.value) {
        console.log('Ejecutando búsqueda automática después de seleccionar fecha final');
        // Simular el envío del formulario
        const submitEvent = new Event('submit', { cancelable: true });
        form.dispatchEvent(submitEvent);
      }
    }
  });
});

document.querySelectorAll('[id^="guests-count"]').forEach(guestsInput => {
  // Guardar el valor inicial como valor por defecto
  guestsInput.setAttribute('data-default-value', guestsInput.value || '2');

  // Inicializar el atributo de datos
  guestsInput.dataset.userInteracted = 'false';

  // Detectar cuando el usuario interactúa con el campo
  guestsInput.addEventListener('change', function () {
    this.dataset.userInteracted = 'true';
    // Sincronizar el estado de interacción con el campo correspondiente en el otro formulario
    const isHeader = this.id.includes('header');
    const correspondingId = isHeader ?
      this.id.replace('header', 'welcome') :
      this.id.replace('welcome', 'header');

    const correspondingInput = document.getElementById(correspondingId);
    if (correspondingInput) {
      correspondingInput.dataset.userInteracted = 'true';
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