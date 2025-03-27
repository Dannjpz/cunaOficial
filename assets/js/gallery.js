document.addEventListener('DOMContentLoaded', function() {
  // Referencias a elementos del DOM
  const galleryItems = document.querySelectorAll('.gallery-item');
  const modal = document.getElementById('gallery-modal');
  const modalImg = document.getElementById('modal-img');
  const modalCaption = document.querySelector('.modal-caption');
  const closeBtn = document.querySelector('.modal-close');
  const prevBtn = document.querySelector('.prev-img');
  const nextBtn = document.querySelector('.next-img');
  
  // Check if gallery elements exist before proceeding
  if (!galleryItems.length || !modal || !modalImg || !modalCaption || !closeBtn || !prevBtn || !nextBtn) {
    console.log('Gallery elements not found on this page');
    return;
  }
  
  let currentIndex = 0;
  
  // Función para abrir el modal con la imagen seleccionada
  function openModal(index) {
    currentIndex = index;
    const img = galleryItems[index].querySelector('img');
    const caption = galleryItems[index].querySelector('.gallery-info h3').textContent;
    const description = galleryItems[index].querySelector('.gallery-info p').textContent;
    
    modal.style.display = 'block';
    setTimeout(() => {
      modal.classList.add('show');
    }, 10);
    
    modalImg.src = img.src;
    modalImg.alt = img.alt;
    modalCaption.innerHTML = `<strong>${caption}</strong><br><span>${description}</span>`;
    
    setTimeout(() => {
      modalImg.classList.add('show');
      modalCaption.classList.add('show');
    }, 50);
    
    // Deshabilitar scroll en el body
    document.body.style.overflow = 'hidden';
  }
  
  // Función para cerrar el modal
  function closeModal() {
    modalImg.classList.remove('show');
    modalCaption.classList.remove('show');
    
    setTimeout(() => {
      modal.classList.remove('show');
      setTimeout(() => {
        modal.style.display = 'none';
        // Habilitar scroll en el body
        document.body.style.overflow = '';
      }, 300);
    }, 200);
  }
  
  // Función para mostrar la imagen anterior
  function showPrevImage() {
    modalImg.classList.remove('show');
    modalCaption.classList.remove('show');
    
    setTimeout(() => {
      currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
      const img = galleryItems[currentIndex].querySelector('img');
      const caption = galleryItems[currentIndex].querySelector('.gallery-info h3').textContent;
      const description = galleryItems[currentIndex].querySelector('.gallery-info p').textContent;
      
      modalImg.src = img.src;
      modalImg.alt = img.alt;
      modalCaption.innerHTML = `<strong>${caption}</strong><br><span>${description}</span>`;
      
      setTimeout(() => {
        modalImg.classList.add('show');
        modalCaption.classList.add('show');
      }, 50);
    }, 200);
  }
  
  // Función para mostrar la siguiente imagen
  function showNextImage() {
    modalImg.classList.remove('show');
    modalCaption.classList.remove('show');
    
    setTimeout(() => {
      currentIndex = (currentIndex + 1) % galleryItems.length;
      const img = galleryItems[currentIndex].querySelector('img');
      const caption = galleryItems[currentIndex].querySelector('.gallery-info h3').textContent;
      const description = galleryItems[currentIndex].querySelector('.gallery-info p').textContent;
      
      modalImg.src = img.src;
      modalImg.alt = img.alt;
      modalCaption.innerHTML = `<strong>${caption}</strong><br><span>${description}</span>`;
      
      setTimeout(() => {
        modalImg.classList.add('show');
        modalCaption.classList.add('show');
      }, 50);
    }, 200);
  }
  
  // Event listeners
  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => openModal(index));
    
    // Efecto de inclinación 3D al mover el ratón
    item.addEventListener('mousemove', function(e) {
      const { left, top, width, height } = this.getBoundingClientRect();
      const x = (e.clientX - left) / width - 0.5;
      const y = (e.clientY - top) / height - 0.5;
      
      // Efecto de inclinación 3D
      this.style.transform = `perspective(1000px) rotateX(${y * -5}deg) rotateY(${x * 5}deg) scale3d(1.02, 1.02, 1.02)`;
      
      // Efecto parallax en la imagen
      const img = this.querySelector('img');
      img.style.transform = `translateX(${x * -10}px) translateY(${y * -10}px) scale(1.1)`;
      
      // Efecto de luz
      const overlay = this.querySelector('.gallery-overlay');
      overlay.style.background = `radial-gradient(
        circle at ${x * 100 + 50}% ${y * 100 + 50}%, 
        rgba(255, 255, 255, 0.2) 0%, 
        rgba(0, 0, 0, 0.5) 60%
      ), linear-gradient(
        to top, 
        rgba(0, 0, 0, 0.8) 0%, 
        rgba(0, 0, 0, 0.4) 30%,
        rgba(0, 0, 0, 0) 60%
      )`;
    });
    
    // Restaurar al salir del elemento
    item.addEventListener('mouseleave', function() {
      this.style.transform = '';
      const img = this.querySelector('img');
      img.style.transform = '';
      const overlay = this.querySelector('.gallery-overlay');
      overlay.style.background = '';
    });
  });
  
  closeBtn.addEventListener('click', closeModal);
  
  prevBtn.addEventListener('click', showPrevImage);
  nextBtn.addEventListener('click', showNextImage);
  
  // Cerrar modal al hacer clic fuera de la imagen
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      closeModal();
    }
  });
  
  // Navegación con teclado
  document.addEventListener('keydown', function(e) {
    if (modal.style.display === 'block') {
      if (e.key === 'Escape') {
        closeModal();
      } else if (e.key === 'ArrowLeft') {
        showPrevImage();
      } else if (e.key === 'ArrowRight') {
        showNextImage();
      }
    }
  });
  
  // Animación de aparición al hacer scroll
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Añadir clase para activar animación
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  galleryItems.forEach(item => {
    observer.observe(item);
  });
  
  // Efecto de filtro aleatorio para las imágenes
  galleryItems.forEach(item => {
    const img = item.querySelector('img');
    const randomHue = Math.floor(Math.random() * 20) - 10; // -10 a 10
    const randomSaturation = Math.floor(Math.random() * 20) - 10; // -10 a 10
    
    img.style.filter = `saturate(${0.9 + randomSaturation/100}) 
                        brightness(${1 + randomHue/100}) 
                        contrast(${1 + randomHue/100})`;
  });
  
  // Añadir efecto de desplazamiento suave para la galería
  const gallerySection = document.getElementById('gallery-section');
  
  window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;
    const galleryPosition = gallerySection.offsetTop;
    const windowHeight = window.innerHeight;
    
    if (scrollPosition > galleryPosition - windowHeight && 
        scrollPosition < galleryPosition + gallerySection.offsetHeight) {
      const parallaxValue = (scrollPosition - (galleryPosition - windowHeight)) * 0.1;
      
      // Efecto parallax sutil en las imágenes
      galleryItems.forEach((item, index) => {
        const direction = index % 2 === 0 ? 1 : -1;
        item.style.transform = `translateY(${parallaxValue * direction * 0.2}px)`;
      });
    }
  });
});

// Añadir al final del archivo gallery.js existente

// Función para activar la animación del título cuando sea visible
function handleGalleryTitleAnimation() {
  const galleryTitle = document.querySelector('.gallery-title.slide-in-right');
  
  if (!galleryTitle) {
    console.log('Gallery title not found on this page');
    return;
  }
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        galleryTitle.classList.add('active');
      } else {
        galleryTitle.classList.remove('active');
      }
    });
  }, { threshold: 0.1 });
  
  observer.observe(galleryTitle);
}

// Initialize only if we're on a page with gallery elements
document.addEventListener('DOMContentLoaded', function() {
  if (document.querySelector('.gallery-item')) {
    handleGalleryTitleAnimation();
  }
});