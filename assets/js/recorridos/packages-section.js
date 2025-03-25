document.addEventListener('DOMContentLoaded', function() {
    var packagesContainer = document.querySelector('.packages-container');
    var packagesArr = [].slice.call(document.querySelectorAll('.package'));
    var closeBtnsArr = [].slice.call(document.querySelectorAll('.package__close-btn'));
  
    // Inicializar la animación después de un breve retraso
    setTimeout(function() {
      packagesContainer.classList.remove('s--inactive');
    }, 200);
  
    // Añadir evento de clic a cada paquete
    packagesArr.forEach(function(package) {
      package.addEventListener('click', function() {
        // Si ya está activo, no hacer nada
        if (this.classList.contains('s--active')) return;
        
        // Activar el contenedor y el paquete actual
        packagesContainer.classList.add('s--package-active');
        this.classList.add('s--active');
      });
    });
  
    // Añadir evento de clic a los botones de cierre
    closeBtnsArr.forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        
        // Desactivar el contenedor y el paquete activo
        packagesContainer.classList.remove('s--package-active');
        document.querySelector('.package.s--active').classList.remove('s--active');
      });
    });
  });