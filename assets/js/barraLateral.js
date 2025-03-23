/**
 * Inicializa la funcionalidad del menú móvil
 * Este script maneja la apertura y cierre del menú lateral
 */
function initializeMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const sideMenu = document.querySelector('.side-menu');
    const closeBtn = document.querySelector('.side-menu-close');
    const body = document.body;

    // Aseguramos que el icono de hamburguesa se muestre correctamente
    if (menuToggle && !menuToggle.querySelector('.fa-bars')) {
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    }

    // Aseguramos que el icono de cierre se muestre correctamente
    if (closeBtn && !closeBtn.querySelector('.fa-times')) {
        closeBtn.innerHTML = '<i class="fas fa-times"></i>';
    }

    // Crear overlay si no existe
    let overlay = document.querySelector('.menu-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'menu-overlay';
        body.appendChild(overlay);
    }

    // Abrir menú
    menuToggle.addEventListener('click', function () {
        sideMenu.classList.add('active');
        overlay.classList.add('active');
        body.style.overflow = 'hidden'; // Prevenir scroll
    });

    // Cerrar menú
    function closeMenu() {
        sideMenu.classList.remove('active');
        overlay.classList.remove('active');
        body.style.overflow = '';
    }

    closeBtn.addEventListener('click', closeMenu);
    overlay.addEventListener('click', closeMenu);
}

/**
 * Carga el componente de barra lateral en el contenedor especificado
 * @param {string} containerId - ID del elemento donde se cargará la barra lateral
 */
function loadSidebarComponent(containerId = 'barraLateral-container') {
    fetch('barraLateral.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById(containerId).innerHTML = data;
            // Inicializar el menú después de cargar el componente
            setTimeout(initializeMobileMenu, 100); // Pequeño retraso para asegurar que el DOM está actualizado
        })
        .catch(error => console.error('Error cargando el componente de barra lateral:', error));
}

// Exportar las funciones para uso global
window.initializeMobileMenu = initializeMobileMenu;
window.loadSidebarComponent = loadSidebarComponent;

// Auto-inicialización cuando se incluye el script
document.addEventListener('DOMContentLoaded', function () {
    // Si existe un contenedor para la barra lateral, cargamos el componente
    if (document.getElementById('barraLateral-container')) {
        loadSidebarComponent();
    }
});