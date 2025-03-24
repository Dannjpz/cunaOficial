document.addEventListener('DOMContentLoaded', function() {
  // Configuración
  const maxGuests = 20; // Número máximo de invitados
  const defaultGuests = 2; // Valor predeterminado
  
  // Referencias a los elementos
  const headerGuestsInput = document.getElementById('guests-count-header');
  const welcomeGuestsInput = document.getElementById('guests-count-welcome');
  const headerGuestsDropdown = document.getElementById('guests-dropdown-header');
  const welcomeGuestsDropdown = document.getElementById('guests-dropdown-welcome');
  
  // Función para generar opciones de invitados dinámicamente
  function generateGuestOptions(dropdownElement, selectedValue = defaultGuests) {
    // Limpiar el dropdown
    dropdownElement.innerHTML = '';
    
    // Generar opciones del 1 al maxGuests
    for (let i = 1; i <= maxGuests; i++) {
      const option = document.createElement('div');
      option.className = 'guest-option';
      option.dataset.value = i;
      option.textContent = i;
      
      // Marcar la opción seleccionada
      if (i === parseInt(selectedValue)) {
        option.classList.add('selected');
      }
      
      // Añadir efecto de animación
      option.style.animationDelay = `${i * 0.03}s`;
      
      dropdownElement.appendChild(option);
    }
  }
  
  // Inicializar los dropdowns
  if (headerGuestsDropdown) {
    generateGuestOptions(headerGuestsDropdown, headerGuestsInput?.value || defaultGuests);
  }
  
  if (welcomeGuestsDropdown) {
    generateGuestOptions(welcomeGuestsDropdown, welcomeGuestsInput?.value || defaultGuests);
  }
  
  // Función para manejar los dropdowns de invitados
  function setupGuestsDropdown(inputId, dropdownId) {
    const guestsInput = document.getElementById(inputId);
    const guestsDropdown = document.getElementById(dropdownId);
    
    if (!guestsInput || !guestsDropdown) return;
    
    // Mostrar/ocultar dropdown al hacer clic en el input
    guestsInput.addEventListener('click', function(e) {
      e.stopPropagation();
      
      // Cerrar otros dropdowns abiertos
      document.querySelectorAll('.guests-dropdown.active').forEach(dropdown => {
        if (dropdown.id !== dropdownId) {
          dropdown.classList.remove('active');
        }
      });
      
      // Cerrar cualquier calendario abierto
      document.querySelectorAll('.calendar-dropdown.active').forEach(calendar => {
        calendar.classList.remove('active');
      });
      
      // Alternar este dropdown
      guestsDropdown.classList.toggle('active');
      
      // Efecto de animación al abrir
      if (guestsDropdown.classList.contains('active')) {
        const options = guestsDropdown.querySelectorAll('.guest-option');
        options.forEach((option, index) => {
          option.style.opacity = '0';
          option.style.transform = 'translateY(10px)';
          
          // Animación con retraso para cada opción
          setTimeout(() => {
            option.style.transition = 'all 0.3s ease';
            option.style.opacity = '1';
            option.style.transform = 'translateY(0)';
          }, index * 30);
        });
      }
    });
    
    // Seleccionar opción del dropdown
    guestsDropdown.addEventListener('click', function(e) {
      const option = e.target.closest('.guest-option');
      if (!option) return;
      
      const selectedValue = option.textContent;
      
      // Actualizar el valor del input actual
      guestsInput.value = selectedValue;
      
      // Sincronizar con el otro input
      if (inputId === 'guests-count-header' && welcomeGuestsInput) {
        welcomeGuestsInput.value = selectedValue;
      } else if (inputId === 'guests-count-welcome' && headerGuestsInput) {
        headerGuestsInput.value = selectedValue;
      }
      
      // Marcar esta opción como seleccionada en ambos dropdowns
      document.querySelectorAll('.guests-dropdown').forEach(dropdown => {
        dropdown.querySelectorAll('.guest-option').forEach(opt => {
          if (opt.textContent === selectedValue) {
            opt.classList.add('selected');
          } else {
            opt.classList.remove('selected');
          }
        });
      });
      
      // Efecto visual al seleccionar
      option.style.transform = 'scale(1.1)';
      setTimeout(() => {
        option.style.transform = 'scale(1)';
        
        // Cerrar el dropdown con un pequeño retraso para ver el efecto
        setTimeout(() => {
          guestsDropdown.classList.remove('active');
        }, 150);
      }, 150);
    });
  }
  
  // Cerrar dropdown al hacer clic fuera
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.search-guests') && !e.target.closest('.guests-dropdown')) {
      document.querySelectorAll('.guests-dropdown').forEach(dropdown => {
        dropdown.classList.remove('active');
      });
    }
  });
  
  // Configurar ambos dropdowns
  setupGuestsDropdown('guests-count-header', 'guests-dropdown-header');
  setupGuestsDropdown('guests-count-welcome', 'guests-dropdown-welcome');
});