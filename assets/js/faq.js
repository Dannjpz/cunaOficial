document.addEventListener('DOMContentLoaded', function() {
  // Referencias a elementos del DOM
  const faqItems = document.querySelectorAll('.faq-item');
  const faqQuestions = document.querySelectorAll('.faq-question');
  const categoryButtons = document.querySelectorAll('.faq-category-btn');
  const searchInput = document.getElementById('faq-search-input');
  const searchButton = document.getElementById('faq-search-btn');
  const noResultsMessage = document.getElementById('faq-no-results');
  
  // Inicializar la animación del título
  initFaqTitleAnimation();
  
  // Manejar clics en las preguntas para expandir/contraer respuestas
  faqQuestions.forEach(question => {
    question.addEventListener('click', function() {
      const faqItem = this.parentElement;
      
      // Si ya está activo, desactivarlo
      if (faqItem.classList.contains('active')) {
        faqItem.classList.remove('active');
        return;
      }
      
      // Opcional: cerrar otras preguntas abiertas
      // faqItems.forEach(item => item.classList.remove('active'));
      
      // Activar la pregunta actual
      faqItem.classList.add('active');
      
      // Efecto de desplazamiento suave hacia la pregunta
      setTimeout(() => {
        faqItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    });
  });
  
  // Filtrar por categoría
  categoryButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Remover clase activa de todos los botones
      categoryButtons.forEach(btn => btn.classList.remove('active'));
      
      // Añadir clase activa al botón seleccionado
      this.classList.add('active');
      
      const category = this.getAttribute('data-category');
      filterFaqItems(category, searchInput.value);
    });
  });
  
  // Buscar preguntas
  searchButton.addEventListener('click', function() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const activeCategory = document.querySelector('.faq-category-btn.active').getAttribute('data-category');
    filterFaqItems(activeCategory, searchTerm);
  });
  
  // Buscar al presionar Enter
  searchInput.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
      const searchTerm = this.value.trim().toLowerCase();
      const activeCategory = document.querySelector('.faq-category-btn.active').getAttribute('data-category');
      filterFaqItems(activeCategory, searchTerm);
    }
  });
  
  // Función para filtrar elementos FAQ por categoría y término de búsqueda
  function filterFaqItems(category, searchTerm = '') {
    let visibleItems = 0;
    
    faqItems.forEach(item => {
      const itemCategory = item.getAttribute('data-category');
      const questionText = item.querySelector('.faq-question h3').textContent.toLowerCase();
      const answerText = item.querySelector('.faq-answer p').textContent.toLowerCase();
      
      // Verificar si coincide con la categoría y el término de búsqueda
      const matchesCategory = category === 'all' || itemCategory === category;
      const matchesSearch = searchTerm === '' || 
                           questionText.includes(searchTerm) || 
                           answerText.includes(searchTerm);
      
      // Aplicar filtro con animación
      if (matchesCategory && matchesSearch) {
        item.classList.remove('filtered-out');
        item.classList.remove('hidden');
        visibleItems++;
        
        // Retrasar la aparición para crear un efecto escalonado
        setTimeout(() => {
          item.style.opacity = '1';
          item.style.transform = 'translateY(0)';
        }, 50);
      } else {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        
        // Ocultar completamente después de la animación
        setTimeout(() => {
          item.classList.add('hidden');
        }, 300);
      }
    });
    
    // Mostrar mensaje de no resultados si no hay elementos visibles
    if (visibleItems === 0) {
      noResultsMessage.style.display = 'block';
    } else {
      noResultsMessage.style.display = 'none';
    }
  }
  
  // Inicializar animación del título
  function initFaqTitleAnimation() {
    const faqTitle = document.querySelector('.faq-title.slide-in-right');
    
    if (!faqTitle) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          faqTitle.classList.add('active');
        } else {
          faqTitle.classList.remove('active');
        }
      });
    }, { threshold: 0.1 });
    
    observer.observe(faqTitle);
  }
  
});