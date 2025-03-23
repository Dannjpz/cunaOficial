document.addEventListener('DOMContentLoaded', function () {
    // Elementos del DOM
    const searchForm = document.getElementById('package-search-form');
    const searchInput = document.getElementById('package-search-input');
    const packagesSection = document.getElementById('packages-section');
    const packageCards = document.querySelectorAll('.package-card');

    // Función para filtrar paquetes
    function filterPackages(searchTerm) {
        searchTerm = searchTerm.toLowerCase().trim();

        // Si no hay término de búsqueda, mostrar todos los paquetes
        if (searchTerm === '') {
            packageCards.forEach(card => {
                card.style.display = 'block';
            });
            return;
        }

        // Filtrar paquetes según el término de búsqueda
        packageCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('.package-description').textContent.toLowerCase();
            const tags = card.dataset.packageTags ? card.dataset.packageTags.toLowerCase() : '';

            // Verificar si el término de búsqueda está en el título, descripción o etiquetas
            if (title.includes(searchTerm) || description.includes(searchTerm) || tags.includes(searchTerm)) {
                card.style.display = 'block';
                // Resaltar coincidencias (opcional)
                highlightMatches(card, searchTerm);
            } else {
                card.style.display = 'none';
            }
        });

        // Desplazarse hasta la sección de paquetes
        packagesSection.scrollIntoView({ behavior: 'smooth' });
    }

    // Función para resaltar coincidencias (opcional)
    function highlightMatches(card, searchTerm) {
        // Esta función podría implementarse para resaltar el texto que coincide con la búsqueda
        // Por simplicidad, no la implementamos completamente aquí
    }

    // Evento de envío del formulario de búsqueda
    searchForm.addEventListener('submit', function (event) {
        event.preventDefault();
        filterPackages(searchInput.value);
    });

    // Evento de entrada en el campo de búsqueda (búsqueda en tiempo real)
    searchInput.addEventListener('input', function () {
        filterPackages(this.value);
    });
});