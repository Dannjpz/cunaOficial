document.addEventListener('DOMContentLoaded', function () {
  // Seleccionar todos los formularios de búsqueda y sus inputs
  const searchForms = document.querySelectorAll('.search-form');
  const searchInputs = document.querySelectorAll('.search-input');
  const searchSuggestions = document.getElementById('search-suggestions');

  // Palabras clave para sugerencias
  const keywords = [
    'Experiencia Gastronómica',
    'Aventura en la Naturaleza',
    'Ruta Cultural',
    'Escapada Familiar',
    'Viñedos',
    'Gastronomía Mexicana',
    'Talleres Culinarios',
    'Recorridos Históricos'
  ];

  // Efecto de escritura automática para el placeholder
  let placeholders = [
    'Descubre tu próxima aventura...',
    'Busca experiencias gastronómicas...',
    'Encuentra recorridos culturales...',
    'Explora paquetes familiares...'
  ];
  let currentPlaceholder = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function typeEffect() {
    const current = placeholders[currentPlaceholder];

    if (isDeleting) {
      // Borrando texto - aplicar a todos los inputs
      searchInputs.forEach(input => {
        if (input.value === '') { // Solo cambiar placeholder si el input está vacío
          input.placeholder = current.substring(0, charIndex - 1);
        }
      });
      charIndex--;
      typingSpeed = 50; // Más rápido al borrar
    } else {
      // Escribiendo texto - aplicar a todos los inputs
      searchInputs.forEach(input => {
        if (input.value === '') { // Solo cambiar placeholder si el input está vacío
          input.placeholder = current.substring(0, charIndex + 1);
        }
      });
      charIndex++;
      typingSpeed = 150; // Más lento al escribir
    }

    // Cambiar dirección o pasar al siguiente placeholder
    if (!isDeleting && charIndex === current.length) {
      // Pausa al final de la escritura
      typingSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      currentPlaceholder = (currentPlaceholder + 1) % placeholders.length;
      typingSpeed = 500; // Pausa antes de empezar a escribir
    }

    setTimeout(typeEffect, typingSpeed);
  }

  // Iniciar efecto de escritura
  setTimeout(typeEffect, 1500);

  // Aplicar eventos a todos los inputs de búsqueda
  searchInputs.forEach((input, index) => {
    const form = searchForms[index];

    // Efecto de pulso al hacer focus
    input.addEventListener('focus', function () {
      form.classList.add('active');
    });

    input.addEventListener('blur', function () {
      form.classList.remove('active');
    });

    // Mostrar sugerencias al escribir
    input.addEventListener('input', function () {
      const value = this.value.toLowerCase();

      if (value.length > 1) {
        const filteredKeywords = keywords.filter(keyword =>
          keyword.toLowerCase().includes(value)
        );

        if (filteredKeywords.length > 0 && searchSuggestions) {
          showSuggestions(filteredKeywords, input);
        } else if (searchSuggestions) {
          searchSuggestions.innerHTML = '';
        }
      } else if (searchSuggestions) {
        searchSuggestions.innerHTML = '';
      }
    });
  });

  function showSuggestions(suggestions, currentInput) {
    if (!searchSuggestions) return;

    searchSuggestions.innerHTML = '';

    suggestions.forEach(suggestion => {
      const div = document.createElement('div');
      div.className = 'suggestion-item';
      div.textContent = suggestion;
      div.addEventListener('click', function () {
        // Actualizar todos los inputs con el mismo valor
        searchInputs.forEach(input => {
          input.value = suggestion;
        });

        searchSuggestions.innerHTML = '';

        // Enviar el formulario asociado al input actual sin recargar la página
        const form = currentInput.closest('form');
        const event = new Event('submit', { cancelable: true });
        form.dispatchEvent(event);
      });
      searchSuggestions.appendChild(div);
    });
  }

  // Animación al enviar el formulario - aplicar a todos los formularios
  searchForms.forEach(form => {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Obtener el input asociado a este formulario
      const input = form.querySelector('.search-input');

      if (input && input.value.trim() !== '') {
        // Aquí puedes añadir la lógica para buscar realmente
        // Añadir clase para la animación pero sin redirigir
        form.classList.add('submitted');

        setTimeout(function () {
          // Quitar la clase después de la animación
          form.classList.remove('submitted');

          // Desplazarse al área de paquetes sin cambiar la URL
          const packagesSection = document.getElementById('packages-section');
          if (packagesSection) {
            packagesSection.scrollIntoView({ behavior: 'smooth' });
          }

          // Resaltar los paquetes que coinciden con la búsqueda
          const searchTerm = input.value.toLowerCase();
          const packageCards = document.querySelectorAll('.package-card');

          packageCards.forEach(card => {
            const tags = card.getAttribute('data-package-tags') || '';
            const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
            const description = card.querySelector('.package-description')?.textContent.toLowerCase() || '';

            if (tags.toLowerCase().includes(searchTerm) ||
              title.includes(searchTerm) ||
              description.includes(searchTerm)) {
              card.classList.add('highlight');
            } else {
              card.classList.remove('highlight');
            }
          });
        }, 800);
      }
    });
  });
});