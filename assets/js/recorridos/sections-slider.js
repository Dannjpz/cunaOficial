document.addEventListener('DOMContentLoaded', function () {
  var $cont = document.querySelector('.cont');
  var $elsArr = [].slice.call(document.querySelectorAll('.el'));
  var $closeBtnsArr = [].slice.call(document.querySelectorAll('.el__close-btn'));

  // Elementos de navegación
  var $prevBtn = document.querySelector('.nav-btn.prev-btn');
  var $nextBtn = document.querySelector('.nav-btn.next-btn');
  var $currentGroupSpan = document.getElementById('current-package-group');
  var $totalGroupsSpan = document.getElementById('total-package-groups');

  // Configuración de grupos
  var packagesPerGroup = 5;
  var totalPackages = $elsArr.length;
  var totalGroups = Math.ceil(totalPackages / packagesPerGroup);
  var currentGroup = 1;

  // Actualizar el contador de grupos
  if ($totalGroupsSpan) {
    $totalGroupsSpan.textContent = totalGroups;
  }

  // Función para mostrar un grupo específico de paquetes
  function showPackageGroup(groupIndex) {
    // Asegurarse de que el índice esté dentro de los límites
    if (groupIndex < 1) groupIndex = 1;
    if (groupIndex > totalGroups) groupIndex = totalGroups;

    currentGroup = groupIndex;

    // Actualizar el contador
    if ($currentGroupSpan) {
      $currentGroupSpan.textContent = currentGroup;
    }

    // Calcular los índices de inicio y fin para este grupo
    var startIndex = (groupIndex - 1) * packagesPerGroup;
    var endIndex = Math.min(startIndex + packagesPerGroup, totalPackages);

    // Reposicionar los elementos según el grupo actual
    if (groupIndex === 1) {
      // Primer grupo: posición original
      $elsArr.forEach(function ($el, index) {
        // Restaurar las clases originales para el primer grupo
        $el.classList.remove('repositioned');
        $el.style.transform = '';

        // Mostrar/ocultar según corresponda
        if (index >= startIndex && index < endIndex) {
          $el.style.opacity = '1';
          $el.style.pointerEvents = 'auto';
          $el.style.display = '';
        } else {
          $el.style.opacity = '0';
          $el.style.pointerEvents = 'none';
        }
      });
    } else {
      // Segundo grupo o posterior: reposicionar
      $elsArr.forEach(function ($el, index) {
        if (index >= startIndex && index < endIndex) {
          // Para el segundo grupo, mover los elementos a la posición del primer grupo
          var newPosition = index - startIndex;

          // Añadir clase para identificar elementos reposicionados
          $el.classList.add('repositioned');

          // Aplicar las transformaciones correspondientes al primer grupo
          // pero preservando la estructura original para las animaciones
          switch (newPosition) {
            case 0:
              $el.setAttribute('data-position', '1');
              $el.style.transform = 'translate3d(0%, 0, 0)';
              break;
            case 1:
              $el.setAttribute('data-position', '2');
              $el.style.transform = 'translate3d(105.2083333333%, 0, 0)';
              break;
            case 2:
              $el.setAttribute('data-position', '3');
              $el.style.transform = 'translate3d(210.4166666667%, 0, 0)';
              break;
            case 3:
              $el.setAttribute('data-position', '4');
              $el.style.transform = 'translate3d(315.625%, 0, 0)';
              break;
            case 4:
              $el.setAttribute('data-position', '5');
              $el.style.transform = 'translate3d(420.8333333333%, 0, 0)';
              break;
          }

          $el.style.opacity = '1';
          $el.style.pointerEvents = 'auto';
          $el.style.display = '';
        } else {
          // Si no está en el grupo actual, ocultar
          if (index < startIndex || index >= endIndex) {
            $el.style.opacity = '0';
            $el.style.pointerEvents = 'none';
          }
        }
      });
    }

    // Habilitar/deshabilitar botones de navegación según sea necesario
    if ($prevBtn) {
      $prevBtn.disabled = currentGroup === 1;
      $prevBtn.style.opacity = currentGroup === 1 ? '0.5' : '1';
    }

    if ($nextBtn) {
      $nextBtn.disabled = currentGroup === totalGroups;
      $nextBtn.style.opacity = currentGroup === totalGroups ? '0.5' : '1';
    }
  }

  // Configurar eventos de los botones de navegación
  if ($prevBtn) {
    $prevBtn.addEventListener('click', function () {
      showPackageGroup(currentGroup - 1);
    });
  }

  if ($nextBtn) {
    $nextBtn.addEventListener('click', function () {
      showPackageGroup(currentGroup + 1);
    });
  }

  // Inicializar el componente
  setTimeout(function () {
    $cont.classList.remove('s--inactive');
    // Mostrar el primer grupo de paquetes
    showPackageGroup(1);
  }, 200);

  $elsArr.forEach(function ($el) {
    $el.addEventListener('click', function () {
      if (this.classList.contains('s--active')) return;

      // Guardar la posición original antes de activar
      if (this.classList.contains('repositioned')) {
        this.setAttribute('data-original-transform', this.style.transform);
      }

      $cont.classList.add('s--el-active');
      this.classList.add('s--active');

      // Si es un elemento reposicionado, ajustar la transformación para la vista expandida
      if (this.classList.contains('repositioned')) {
        this.style.transform = 'translate3d(0, 0, 0)';
      }
    });
  });

  $closeBtnsArr.forEach(function ($btn) {
    $btn.addEventListener('click', function (e) {
      e.stopPropagation();

      // Obtener el elemento activo
      var $activeEl = document.querySelector('.el.s--active');

      // Restaurar la transformación original si es un elemento reposicionado
      if ($activeEl && $activeEl.classList.contains('repositioned')) {
        var originalTransform = $activeEl.getAttribute('data-original-transform');
        if (originalTransform) {
          setTimeout(function () {
            $activeEl.style.transform = originalTransform;
          }, 600); // Esperar a que termine la animación de cierre
        }
      }

      $cont.classList.remove('s--el-active');
      document.querySelector('.el.s--active').classList.remove('s--active');
    });
  });

  // Función para actualizar la visibilidad de las secciones (para el buscador)
  function updateSectionVisibility() {
    // Obtener todos los elementos de sección
    var sections = document.querySelectorAll('.el');
    var visibleSections = 0;

    // Verificar cada sección
    sections.forEach(function (section) {
      if (section.style.display !== 'none' && section.style.opacity !== '0') {
        visibleSections++;
      }
    });

    // Mostrar mensaje de no resultados si no hay secciones visibles
    var noResultsMessage = document.getElementById('no-results-message');
    if (noResultsMessage) {
      noResultsMessage.style.display = visibleSections === 0 ? 'block' : 'none';
    }
  }

  // Función para filtrar secciones basado en criterios de búsqueda
  window.filterSections = function (criteria) {
    var sections = document.querySelectorAll('.el');
    var visibleCount = 0;
    var visibleSections = [];

    console.log('Filtrando con criterios:', criteria);

    // Mostrar el botón de reset cuando se filtran por fecha
    if (criteria.dateFilterActive) {
      const resetBtn = document.querySelector('.reset-search-btn');
      if (resetBtn) resetBtn.style.display = 'block';
    }

    sections.forEach(function (section) {
      var tags = section.getAttribute('data-package-tags') || '';
      var description = section.querySelector('.el__text p') ?
        section.querySelector('.el__text p').textContent.toLowerCase() : '';
      var title = section.querySelector('.el__heading') ?
        section.querySelector('.el__heading').textContent.toLowerCase() : '';
      var departureDateStr = section.getAttribute('data-departure-dates') || '';

      // Verificar coincidencia con la consulta (en título, descripción o etiquetas)
      var matchesQuery = false;
      if (!criteria.query) {
        matchesQuery = true;
      } else {
        var query = criteria.query.toLowerCase();
        matchesQuery = tags.toLowerCase().includes(query) ||
          title.toLowerCase().includes(query) ||
          description.includes(query);
      }

      // Mejorar la verificación de fechas
      var matchesDate = true;
      if (criteria.dateFilterActive && criteria.startDate) {
          try {
              // Obtener todas las fechas de salida
              var departureDates = (departureDateStr || '').split(',').map(date => date.trim());
              var searchStartDate = new Date(criteria.startDate);
              var searchEndDate = criteria.endDate ? new Date(criteria.endDate) : null;

              // Verificar si al menos una fecha de salida está en el rango
              matchesDate = departureDates.some(dateStr => {
                  var departureDate = new Date(dateStr);
                  if (isNaN(departureDate.getTime())) return false;

                  if (searchEndDate) {
                      return departureDate >= searchStartDate && departureDate <= searchEndDate;
                  } else {
                      return departureDate >= searchStartDate;
                  }
              });
          } catch (e) {
              console.error('Error al procesar fechas:', e);
              matchesDate = false;
          }
      }

      // Actualizar visibilidad
      if (matchesQuery && matchesDate) {
          visibleCount++;
          visibleSections.push(section);
          section.style.display = '';
          section.style.opacity = '1';
      } else {
          section.style.display = 'none';
          section.style.opacity = '0';
      }
    });

    // Segunda pasada: reorganizar las secciones visibles
    if (visibleCount > 0 && visibleCount < 5) {
      console.log(`Reorganizando ${visibleCount} secciones visibles`);

      // Posiciones predefinidas para los primeros 5 elementos
      var positions = [
        'translate3d(0%, 0, 0)',       // Posición 1
        'translate3d(105.2083333333%, 0, 0)', // Posición 2
        'translate3d(210.4166666667%, 0, 0)', // Posición 3
        'translate3d(315.625%, 0, 0)',  // Posición 4
        'translate3d(420.8333333333%, 0, 0)'  // Posición 5
      ];

      // Reorganizar las secciones visibles
      visibleSections.forEach(function (section, index) {
        // Guardar la posición original para poder restaurarla después
        if (!section.hasAttribute('data-original-position')) {
          var originalPosition = section.style.transform || '';
          section.setAttribute('data-original-position', originalPosition);
        }

        // Aplicar la nueva posición
        section.classList.add('repositioned');
        section.style.transform = positions[index];
        section.style.opacity = '1';
        section.style.pointerEvents = 'auto';
        section.style.display = '';

        // Actualizar el atributo data-position para mantener la consistencia
        section.setAttribute('data-position', (index + 1).toString());
      });

      // Actualizar el contador para reflejar los resultados de búsqueda
      if ($currentGroupSpan && $totalGroupsSpan) {
        $currentGroupSpan.textContent = "Resultados";
        $totalGroupsSpan.textContent = visibleCount;
      }

      // Deshabilitar los botones de navegación durante la búsqueda
      if ($prevBtn && $nextBtn) {
        $prevBtn.disabled = true;
        $nextBtn.disabled = true;
        $prevBtn.style.opacity = '0.5';
        $nextBtn.style.opacity = '0.5';
      }

      // Ocultar la navegación de paquetes si hay pocos resultados
      var packagesNavigation = document.querySelector('.packages-navigation');
      if (packagesNavigation) {
        packagesNavigation.style.display = visibleCount > 5 ? 'flex' : 'none';
      }
    } else if (visibleCount >= 5) {
      // Si hay 5 o más resultados, usar la navegación normal por grupos
      console.log(`Mostrando ${visibleCount} secciones con navegación normal`);

      // Restaurar las posiciones originales
      visibleSections.forEach(function (section) {
        section.classList.remove('repositioned');
        section.style.transform = '';
        section.style.opacity = '1';
        section.style.pointerEvents = 'auto';
        section.style.display = '';
      });

      // Mostrar solo los primeros 5 resultados
      if (visibleCount > 5) {
        visibleSections.slice(5).forEach(function (section) {
          section.style.opacity = '0';
          section.style.pointerEvents = 'none';
          section.style.display = 'none';
        });
      }

      // Actualizar el contador para reflejar los resultados de búsqueda
      if ($currentGroupSpan && $totalGroupsSpan) {
        $currentGroupSpan.textContent = "1";
        $totalGroupsSpan.textContent = Math.ceil(visibleCount / 5);
      }

      // Habilitar/deshabilitar botones de navegación según sea necesario
      if ($prevBtn && $nextBtn) {
        $prevBtn.disabled = true;
        $prevBtn.style.opacity = '0.5';
        $nextBtn.disabled = visibleCount <= 5;
        $nextBtn.style.opacity = visibleCount <= 5 ? '0.5' : '1';
      }

      // Mostrar la navegación de paquetes
      var packagesNavigation = document.querySelector('.packages-navigation');
      if (packagesNavigation) {
        packagesNavigation.style.display = 'flex';
      }
    } else {
      // Si no hay resultados, mostrar mensaje y restaurar la navegación normal
      showPackageGroup(1);
    }

    updateSectionVisibility();
  };

  // Conectar con la función de búsqueda existente
  if (typeof window.performAdvancedSearch !== 'function') {
    window.performAdvancedSearch = function (formData) {
      window.filterSections(formData);
    };
  }

  // Añadir soporte para navegación con teclado
  document.addEventListener('keydown', function (e) {
    // Solo si no hay un elemento activo (para no interferir con la navegación del teclado en formularios)
    if (document.activeElement === document.body) {
      if (e.key === 'ArrowLeft') {
        showPackageGroup(currentGroup - 1);
      } else if (e.key === 'ArrowRight') {
        showPackageGroup(currentGroup + 1);
      }
    }
  });
});

window.resetPackageView = function () {
  console.log('Reseteando vista de paquetes');

  // Limpiar los campos de búsqueda
  document.querySelectorAll('.search-input').forEach(input => {
    input.value = '';
  });

  // Obtener la fecha actual para la fecha inicial
  const today = new Date();
  const formattedToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  // Obtener el 7 de diciembre del año en curso para la fecha final
  const endOfYear = new Date();
  endOfYear.setMonth(11); // Diciembre (0-indexed)
  endOfYear.setDate(7);   // Día 7
  const formattedEndOfYear = `${endOfYear.getFullYear()}-12-07`;

  // Resetear los campos de fecha con los valores correctos
  document.querySelectorAll('[id^="start-date"]').forEach(dateInput => {
    dateInput.value = formattedToday;
    dateInput.dataset.userInteracted = 'false';
  });

  document.querySelectorAll('[id^="end-date"]').forEach(dateInput => {
    dateInput.value = formattedEndOfYear;
    dateInput.dataset.userInteracted = 'false';
  });

  // Resetear el contador de huéspedes
  document.querySelectorAll('[id^="guests-count"]').forEach(guestsInput => {
    guestsInput.value = guestsInput.getAttribute('data-default-value') || '2';
    guestsInput.dataset.userInteracted = 'false';

    // Actualizar el texto mostrado en los dropdowns
    const dropdownText = guestsInput.closest('.dropdown')?.querySelector('.dropdown-text');
    if (dropdownText) {
      dropdownText.textContent = guestsInput.value + ' personas';
    }
  });

  // Restaurar la vista original de los paquetes
  var $elsArr = [].slice.call(document.querySelectorAll('.el'));
  $elsArr.forEach(function ($el) {
    // Restaurar la posición original si se guardó
    if ($el.hasAttribute('data-original-position')) {
      var originalPosition = $el.getAttribute('data-original-position');
      $el.style.transform = originalPosition;
      $el.removeAttribute('data-original-position');
    }

    // Quitar clases y estilos añadidos durante la búsqueda
    $el.classList.remove('repositioned');
    $el.style.opacity = '';
    $el.style.pointerEvents = '';
    $el.style.display = '';
  });

  // Restaurar los precios originales
  if (typeof window.updatePackagePrices === 'function') {
    window.updatePackagePrices(1);
  }

  // Ocultar mensaje de no resultados
  var noResultsMessage = document.getElementById('no-results-message');
  if (noResultsMessage) {
    noResultsMessage.style.display = 'none';
  }

  // Restaurar la navegación por grupos
  if (typeof showPackageGroup === 'function') {
    showPackageGroup(1);
  } else {
    // Fallback si la función no está disponible
    var currentGroup = 1;
    var packagesPerGroup = 5;
    var startIdx = (currentGroup - 1) * packagesPerGroup;
    var endIdx = startIdx + packagesPerGroup;

    $elsArr.forEach(function ($el, idx) {
      if (idx >= startIdx && idx < endIdx) {
        $el.style.display = '';
        $el.style.opacity = '1';
        $el.style.pointerEvents = 'auto';
      } else {
        $el.style.display = 'none';
      }
    });
  }

  // Habilitar los botones de navegación
  var $prevBtn = document.querySelector('.nav-btn.prev-btn');
  var $nextBtn = document.querySelector('.nav-btn.next-btn');
  if ($prevBtn) {
    $prevBtn.disabled = true;
    $prevBtn.style.opacity = '0.5';
  }
  if ($nextBtn) {
    $nextBtn.disabled = false;
    $nextBtn.style.opacity = '1';
  }

  // Actualizar el contador de grupos
  var $currentGroupSpan = document.getElementById('current-package-group');
  var $totalGroupsSpan = document.getElementById('total-package-groups');
  if ($currentGroupSpan) {
    $currentGroupSpan.textContent = '1';
  }
  if ($totalGroupsSpan) {
    $totalGroupsSpan.textContent = Math.ceil($elsArr.length / 5);
  }

  // Asegurarse de que la navegación de paquetes sea visible
  var packagesNavigation = document.querySelector('.packages-navigation');
  if (packagesNavigation) {
    packagesNavigation.style.display = 'flex';
  }
};
