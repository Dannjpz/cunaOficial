document.addEventListener('DOMContentLoaded', function() {
  console.log('Inicializando mejoras de búsqueda');
  
  // Asegurarse de que los botones de reset funcionen correctamente
  document.querySelectorAll('.reset-search-btn').forEach(resetBtn => {
    if (!resetBtn.hasEventListener) {
      resetBtn.hasEventListener = true;
      resetBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Reset button clicked');
        
        if (typeof window.resetPackageView === 'function') {
          window.resetPackageView();
        } else {
          console.error('resetPackageView function not available');
        }
        
        return false;
      });
    }
  });
  
  // Asegurarse de que la búsqueda en tiempo real funcione
  document.querySelectorAll('.search-input').forEach(input => {
    if (!input.hasRealTimeSearch) {
      input.hasRealTimeSearch = true;
      input.addEventListener('input', function() {
        const query = this.value.trim();
        const form = this.closest('form');
        
        if (!form) return;
        
        // Recopilar datos del formulario
        const formData = {
          query: query,
          dateFilterActive: false,
          guestsFilterActive: false
        };
        
        // Verificar si hay fechas seleccionadas
        const startDateInput = form.querySelector('[id^="start-date"]');
        const endDateInput = form.querySelector('[id^="end-date"]');
        if (startDateInput && startDateInput.value && 
            endDateInput && endDateInput.value) {
          formData.dateFilterActive = true;
          formData.startDate = startDateInput.value;
          formData.endDate = endDateInput.value;
        }
        
        // Verificar si hay huéspedes seleccionados
        const guestsInput = form.querySelector('[id^="guests-count"]');
        if (guestsInput && guestsInput.value) {
          formData.guestsFilterActive = true;
          formData.guests = guestsInput.value;
        }
        
        // Realizar la búsqueda en tiempo real
        if (typeof window.performAdvancedSearch === 'function') {
          window.performAdvancedSearch(formData);
        }
      });
    }
  });
});