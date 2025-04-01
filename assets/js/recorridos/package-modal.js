// Funcionalidad para el modal informativo de paquetes

// Datos de los paquetes (información detallada)
const packageDetails = {
    1: {
        title: "Experiencia Gastronómica",
        description: "Un recorrido sensorial por los sabores más auténticos de la cocina mexicana, guiado por expertos culinarios que te llevarán a descubrir los secretos de nuestra gastronomía.",
        includes: [
            "Degustación de 15 platillos tradicionales",
            "Visita a 3 restaurantes emblemáticos",
            "Taller de preparación de salsas mexicanas",
            "Recorrido por mercado local con chef",
            "Cena de gala con maridaje de mezcales",
            "Transporte entre locaciones",
            "Guía gastronómico especializado"
        ],
        itinerary: [
            "Día 1: Bienvenida y recorrido por mercado local. Taller de salsas y comida en restaurante tradicional.",
            "Día 2: Visita a productores locales. Degustación de platillos regionales y clase de cocina.",
            "Día 3: Recorrido por restaurantes de autor. Cena de gala con maridaje de mezcales."
        ],
        gallery: [
            "../images/paisaje_1.jpg",
            "../images/paisaje_1.jpg",
            "../images/paisaje_1.jpg"
        ]
    },
    2: {
        title: "Aventura en la Naturaleza",
        description: "Explora los paisajes más impresionantes de la región con actividades que te conectarán con la naturaleza mientras disfrutas de experiencias únicas y emocionantes.",
        includes: [
            "Senderismo guiado por bosques y cascadas",
            "Sesión de rappel en cañón natural",
            "Observación de flora y fauna endémica",
            "Campamento con fogata y astronomía",
            "Desayunos y comidas tipo picnic",
            "Equipo de seguridad completo",
            "Guía especializado en ecoturismo"
        ],
        itinerary: [
            "Día 1: Recepción y senderismo por bosque de pino-encino. Observación de aves y campamento.",
            "Día 2: Desayuno al amanecer. Rappel en cañón y exploración de cuevas. Regreso y despedida."
        ],
        gallery: [
            "../images/paisaje_2.jpg",
            "../images/paisaje_2.jpg",
            "../images/paisaje_2.jpg"
        ]
    },
    3: {
        title: "Ruta Cultural",
        description: "Un viaje a través del tiempo para conocer la rica herencia cultural de México, visitando museos, monumentos históricos y participando en talleres de artesanía tradicional.",
        includes: [
            "Visitas guiadas a 5 museos principales",
            "Recorrido por zonas arqueológicas",
            "Taller de artesanía tradicional",
            "Espectáculo de danza folclórica",
            "Transporte privado entre sitios",
            "Entradas a todos los recintos",
            "Guía cultural certificado"
        ],
        itinerary: [
            "Día 1: Visita a museo de antropología y recorrido por centro histórico.",
            "Día 2: Zona arqueológica y taller de artesanía local.",
            "Día 3: Museos de arte contemporáneo y tradicional.",
            "Día 4: Espectáculo cultural y cena de despedida."
        ],
        gallery: [
            "../images/paisaje_3.jpg",
            "../images/paisaje_3.jpg",
            "../images/paisaje_3.jpg"
        ]
    },
    4: {
        title: "Escapada Familiar",
        description: "Una experiencia diseñada para que toda la familia disfrute, con actividades adaptadas para todas las edades que combina diversión, aprendizaje y momentos de relajación.",
        includes: [
            "Actividades recreativas para niños y adultos",
            "Talleres educativos interactivos",
            "Visitas a parques temáticos",
            "Espectáculos familiares",
            "Tiempo de relajación en spa (adultos)",
            "Club infantil con supervisión",
            "Todas las comidas incluidas"
        ],
        itinerary: [
            "Día 1: Bienvenida con actividades de integración. Visita a parque temático.",
            "Día 2: Talleres educativos por la mañana. Tarde de piscina y juegos.",
            "Día 3: Excursión familiar y espectáculo de despedida."
        ],
        gallery: [
            "../images/paisaje_4.jpg",
            "../images/paisaje_4.jpg",
            "../images/paisaje_4.jpg"
        ]
    },
    5: {
        title: "Ruta de Viñedos",
        description: "Descubre el fascinante mundo del vino mexicano recorriendo los mejores viñedos de la región, aprendiendo sobre el proceso de elaboración y disfrutando de catas exclusivas.",
        includes: [
            "Visita a 4 viñedos premium",
            "Catas guiadas por sommelier",
            "Tour por bodegas y proceso de elaboración",
            "Comida maridaje en viñedo",
            "Taller de apreciación de vinos",
            "Transporte privado entre viñedos",
            "Kit de catador de regalo"
        ],
        itinerary: [
            "Día 1: Recepción y visita a dos viñedos con cata. Comida maridaje y taller de apreciación.",
            "Día 2: Visita a viñedos boutique. Experiencia de vendimia (en temporada) y cata de despedida."
        ],
        gallery: [
            "../images/paisaje_5.jpg",
            "../images/paisaje_5.jpg",
            "../images/paisaje_5.jpg"
        ]
    },
    6: {
        title: "Talleres Culinarios",
        description: "Aprende a preparar los platillos más emblemáticos de la cocina mexicana de la mano de chefs expertos, en una experiencia práctica e inmersiva.",
        includes: [
            "Taller práctico de cocina tradicional",
            "Todos los ingredientes y utensilios",
            "Recetario digital personalizado",
            "Degustación de lo preparado",
            "Certificado de participación",
            "Delantal de regalo",
            "Bebidas tradicionales incluidas"
        ],
        itinerary: [
            "Mañana: Bienvenida, introducción a ingredientes y técnicas básicas. Preparación de entradas y salsas.",
            "Tarde: Elaboración de plato principal y postre. Degustación y evaluación final."
        ],
        gallery: [
            "../images/paisaje_6.jpg",
            "../images/paisaje_6.jpg",
            "../images/paisaje_6.jpg"
        ]
    },
    7: {
        title: "Recorridos Históricos",
        description: "Un viaje a través del tiempo para conocer los momentos más importantes de la historia de México, visitando sitios arqueológicos, pueblos mágicos y centros históricos.",
        includes: [
            "Visitas guiadas a 3 zonas arqueológicas",
            "Recorrido por 4 pueblos mágicos",
            "Tour por centros históricos",
            "Experiencias culturales inmersivas",
            "Transporte en vehículo climatizado",
            "Hospedaje en hoteles boutique",
            "Guía historiador especializado"
        ],
        itinerary: [
            "Día 1: Llegada y visita a centro histórico principal.",
            "Día 2-3: Recorrido por zonas arqueológicas y museos históricos.",
            "Día 4-5: Visita a pueblos mágicos y experiencias culturales locales."
        ],
        gallery: [
            "../images/paisaje_7.jpg",
            "../images/paisaje_7.jpg",
            "../images/paisaje_7.jpg"
        ]
    },
    8: {
        title: "Gastronomía Regional",
        description: "Un fascinante recorrido por los sabores más representativos de las diferentes regiones de México, desde la cocina yucateca hasta la bajacaliforniana.",
        includes: [
            "Degustación de platillos de 6 regiones",
            "Maridaje con bebidas regionales",
            "Visita a mercados locales",
            "Clase de cocina regional",
            "Cena de gala multicultural",
            "Transporte entre locaciones",
            "Guía gastronómico especializado"
        ],
        itinerary: [
            "Día 1: Cocina del norte y noreste de México.",
            "Día 2: Gastronomía del Pacífico y Occidente.",
            "Día 3: Sabores del centro y Bajío.",
            "Día 4: Delicias del sur y sureste mexicano."
        ],
        gallery: [
            "../images/paisaje_8.jpg",
            "../images/paisaje_8.jpg",
            "../images/paisaje_8.jpg"
        ]
    },
    9: {
        title: "Mercados y Artesanías",
        description: "Descubre la riqueza artesanal de México a través de sus mercados tradicionales, donde podrás conocer a los artesanos y aprender sobre técnicas ancestrales.",
        includes: [
            "Visita a 5 mercados tradicionales",
            "Encuentro con maestros artesanos",
            "Taller práctico de artesanía",
            "Degustación de comida de mercado",
            "Transporte entre locaciones",
            "Guía especializado en arte popular",
            "Pieza artesanal de regalo"
        ],
        itinerary: [
            "Día 1: Mercados urbanos y encuentro con artesanos textiles.",
            "Día 2: Mercados rurales y taller de cerámica tradicional.",
            "Día 3: Mercado de artesanías y taller de técnica local."
        ],
        gallery: [
            "../images/paisaje_9.jpg",
            "../images/paisaje_9.jpg",
            "../images/paisaje_9.jpg"
        ]
    },

    10: {
        title: "Mercados y Artesanías",
        description: "Descubre la riqueza artesanal de México a través de sus mercados tradicionales, donde podrás conocer a los artesanos y aprender sobre técnicas ancestrales.",
        includes: [
            "Visita a 5 mercados tradicionales",
            "Encuentro con maestros artesanos",
            "Taller práctico de artesanía",
            "Degustación de comida de mercado",
            "Transporte entre locaciones",
            "Guía especializado en arte popular",
            "Pieza artesanal de regalo"
        ],
        itinerary: [
            "Día 1: Mercados urbanos y encuentro con artesanos textiles.",
            "Día 2: Mercados rurales y taller de cerámica tradicional.",
            "Día 3: Mercado de artesanías y taller de técnica local."
        ],
        gallery: [
            "../images/paisaje_10.jpg",
            "../images/paisaje_10.jpg",
            "../images/paisaje_10.jpg"
        ]
    }
};

document.addEventListener('DOMContentLoaded', function () {
    // Obtener elementos del DOM
    const modal = document.getElementById('package-info-modal');
    const modalTitle = document.getElementById('package-info-title');
    const modalBody = document.querySelector('.package-info-body');
    const closeBtn = document.querySelector('.package-info-close');
    const closeButton = document.querySelector('.package-info-btn');

    const infoIcons = document.querySelectorAll('.package-details-info i');
    infoIcons.forEach(icon => {
        icon.addEventListener('click', function (e) {
            e.preventDefault();
            // Obtener el ID del paquete desde el elemento padre
            const packageEl = this.closest('.el');
            const packageId = packageEl.getAttribute('data-package-id');
            openPackageInfoModal(packageId);
        });
    });

    // Cerrar modal con el botón X
    if (closeBtn) {
        closeBtn.addEventListener('click', closePackageInfoModal);
    }


    // Cerrar modal con el botón de cerrar
    if (closeButton) {
        closeButton.addEventListener('click', closePackageInfoModal);
    }

    // Cerrar modal al hacer clic fuera del contenido
    window.addEventListener('click', function (e) {
        if (e.target === modal) {
            closePackageInfoModal();
        }
    });

    // Función para abrir el modal con la información del paquete
    function openPackageInfoModal(packageId) {
        const packageInfo = packageDetails[packageId];

        if (!packageInfo) {
            console.error('No se encontró información para el paquete ID:', packageId);
            return;
        }

        // Actualizar título
        modalTitle.textContent = packageInfo.title;

        // Construir el contenido del modal
        let modalContent = `
      <div class="package-info-section">
        <h3>Descripción</h3>
        <p>${packageInfo.description}</p>
      </div>
      
      <div class="package-info-section">
        <h3>¿Qué incluye?</h3>
        <ul class="package-info-list">
          ${packageInfo.includes.map(item => `<li>${item}</li>`).join('')}
        </ul>
      </div>
      
      <div class="package-info-section">
        <h3>Itinerario</h3>
        <ul class="package-info-list">
          ${packageInfo.itinerary.map(item => `<li>${item}</li>`).join('')}
        </ul>
      </div>
    `;

        // Agregar galería si hay imágenes
        if (packageInfo.gallery && packageInfo.gallery.length > 0) {
            modalContent += `
        <div class="package-info-section">
          <h3>Galería</h3>
          <div class="package-gallery">
            ${packageInfo.gallery.map(img => `<img src="${img}" alt="${packageInfo.title}" loading="lazy">`).join('')}
          </div>
        </div>
      `;
        }

        // Actualizar el contenido del modal
        modalBody.innerHTML = modalContent;

        // Mostrar el modal
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Evitar scroll en el body
    }

    // Función para cerrar el modal
    function closePackageInfoModal() {
        modal.style.display = 'none';
        document.body.style.overflow = ''; // Restaurar scroll
    }
});