document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.getElementById('package-search-form');
    const searchInput = document.getElementById('package-search-input');
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
        // Borrando texto
        searchInput.placeholder = current.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50; // Más rápido al borrar
      } else {
        // Escribiendo texto
        searchInput.placeholder = current.substring(0, charIndex + 1);
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
    
    // Efecto de pulso al hacer focus
    searchInput.addEventListener('focus', function() {
      searchForm.classList.add('active');
    });
    
    searchInput.addEventListener('blur', function() {
      searchForm.classList.remove('active');
    });
    
    // Mostrar sugerencias al escribir
    searchInput.addEventListener('input', function() {
      const value = this.value.toLowerCase();
      
      if (value.length > 1) {
        const filteredKeywords = keywords.filter(keyword => 
          keyword.toLowerCase().includes(value)
        );
        
        if (filteredKeywords.length > 0) {
          showSuggestions(filteredKeywords);
        } else {
          searchSuggestions.innerHTML = '';
        }
      } else {
        searchSuggestions.innerHTML = '';
      }
    });
    
    function showSuggestions(suggestions) {
      searchSuggestions.innerHTML = '';
      
      suggestions.forEach(suggestion => {
        const div = document.createElement('div');
        div.className = 'suggestion-item';
        div.textContent = suggestion;
        div.addEventListener('click', function() {
          searchInput.value = suggestion;
          searchSuggestions.innerHTML = '';
          searchForm.submit();
        });
        searchSuggestions.appendChild(div);
      });
    }
    
    // Animación al enviar el formulario
    searchForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      if (searchInput.value.trim() !== '') {
        // Aquí puedes añadir la lógica para buscar realmente
        // Por ahora, solo animamos y redirigimos al área de paquetes
        searchForm.classList.add('submitted');
        
        setTimeout(function() {
          window.location.href = '#packages-section';
          
          // Resaltar los paquetes que coinciden con la búsqueda
          const searchTerm = searchInput.value.toLowerCase();
          const packageCards = document.querySelectorAll('.package-card');
          
          packageCards.forEach(card => {
            const tags = card.getAttribute('data-package-tags') || '';
            const title = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('.package-description').textContent.toLowerCase();
            
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