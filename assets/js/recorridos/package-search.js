document.addEventListener('DOMContentLoaded', function () {
    // Elementos del DOM - Actualizados para coincidir con los IDs en el HTML
    const headerSearchForm = document.getElementById('package-search-form-header');
    const welcomeSearchForm = document.getElementById('package-search-form-welcome');
    const headerSearchInput = document.getElementById('package-search-input-header');
    const welcomeSearchInput = document.getElementById('package-search-input-welcome');
    const packagesSection = document.getElementById('packages-section');
    const packageCards = document.querySelectorAll('.package-card');

    // Función para filtrar paquetes
    function filterPackages(searchTerm) {
        searchTerm = searchTerm.toLowerCase().trim();

        // Si no hay término de búsqueda, mostrar todos los paquetes
        if (searchTerm === '') {
            packageCards.forEach(card => {
                card.style.display = 'block';
                card.classList.remove('highlight');
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
                card.classList.add('highlight');
            } else {
                card.style.display = 'none';
                card.classList.remove('highlight');
            }
        });

        // Desplazarse hasta la sección de paquetes solo si existe
        if (packagesSection) {
            packagesSection.scrollIntoView({ behavior: 'smooth' });
        } else {
            console.warn('Packages section not found on this page');
        }
    }

    // Eventos de envío de los formularios de búsqueda
    if (headerSearchForm) {
        headerSearchForm.addEventListener('submit', function (event) {
            event.preventDefault();
            filterPackages(headerSearchInput.value);
        });
    }

    if (welcomeSearchForm) {
        welcomeSearchForm.addEventListener('submit', function (event) {
            event.preventDefault();
            filterPackages(welcomeSearchInput.value);
        });
    }

    // Eventos de entrada en los campos de búsqueda (búsqueda en tiempo real)
    if (headerSearchInput) {
        headerSearchInput.addEventListener('input', function () {
            filterPackages(this.value);
        });
    }

    if (welcomeSearchInput) {
        welcomeSearchInput.addEventListener('input', function () {
            filterPackages(this.value);
        });
    }
});