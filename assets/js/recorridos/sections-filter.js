// Implementación básica de la función filterSections
window.filterSections = function(criteria) {
    console.log('Filtering sections with criteria:', criteria);
    
    // Obtener todas las secciones (elementos con clase 'el')
    const sections = document.querySelectorAll('.el');
    if (!sections.length) {
        console.warn('No sections found to filter');
        return;
    }
    
    // Contador para secciones visibles
    let visibleCount = 0;
    
    // Filtrar secciones basado en criterios
    sections.forEach(function(section) {
        let visible = true;
        
        // Filtrar por consulta de texto
        if (criteria.query) {
            const tags = section.getAttribute('data-package-tags') || '';
            const title = section.querySelector('.el__heading') ? 
                section.querySelector('.el__heading').textContent.toLowerCase() : '';
            const description = section.querySelector('.el__text p') ?
                section.querySelector('.el__text p').textContent.toLowerCase() : '';
                
            const query = criteria.query.toLowerCase();
            if (!tags.toLowerCase().includes(query) && 
                !title.includes(query) && 
                !description.includes(query)) {
                visible = false;
            }
        }
        
        // Filtrar por fecha si está activo el filtro de fechas
        if (visible && criteria.dateFilterActive && criteria.startDate) {
            const departureDates = section.getAttribute('data-departure-dates');
            if (departureDates) {
                const dates = departureDates.split(',').map(date => date.trim());
                const startDate = new Date(criteria.startDate);
                const endDate = criteria.endDate ? new Date(criteria.endDate) : null;
                
                // Verificar si alguna fecha de salida está en el rango
                const inRange = dates.some(dateStr => {
                    const date = new Date(dateStr);
                    if (isNaN(date.getTime())) return false;
                    
                    if (endDate) {
                        return date >= startDate && date <= endDate;
                    } else {
                        return date >= startDate;
                    }
                });
                
                if (!inRange) {
                    visible = false;
                }
            } else {
                // Si no tiene fechas de salida, no cumple el filtro
                visible = false;
            }
        }
        
        // Aplicar visibilidad
        if (visible) {
            section.style.display = '';
            section.style.opacity = '1';
            section.style.pointerEvents = 'auto';
            visibleCount++;
        } else {
            section.style.display = 'none';
            section.style.opacity = '0';
            section.style.pointerEvents = 'none';
        }
    });
    
    // Mostrar mensaje si no hay resultados
    const noResultsMessage = document.getElementById('no-results-message');
    if (noResultsMessage) {
        noResultsMessage.style.display = visibleCount === 0 ? 'block' : 'none';
    }
    
    // Actualizar contador de resultados
    const currentGroupSpan = document.getElementById('current-package-group');
    const totalGroupsSpan = document.getElementById('total-package-groups');
    
    if (currentGroupSpan && totalGroupsSpan) {
        if (visibleCount === 0) {
            currentGroupSpan.textContent = '0';
            totalGroupsSpan.textContent = '0';
        } else {
            currentGroupSpan.textContent = '1';
            totalGroupsSpan.textContent = Math.ceil(visibleCount / 5);
        }
    }
    
    console.log(`Found ${visibleCount} matching sections`);
};