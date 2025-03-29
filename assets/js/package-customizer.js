// Funcionalidad para personalizar paquetes

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar todos los paquetes
    initializePackages();
});

// Función para inicializar todos los paquetes
function initializePackages() {
    const packages = document.querySelectorAll('.el');
    
    packages.forEach(packageEl => {
        const contentEl = packageEl.querySelector('.el__text');
        if (!contentEl) return;
        
        // Obtener datos del paquete
        const packageId = packageEl.querySelector('.add-to-cart-btn').getAttribute('data-package-id');
        const packagePrice = parseFloat(packageEl.querySelector('.add-to-cart-btn').getAttribute('data-package-price'));
        const minGuests = parseInt(packageEl.getAttribute('data-min-guests') || 1);
        const maxGuests = parseInt(packageEl.getAttribute('data-max-guests') || 10);
        
        // Encontrar el elemento de disponibilidad y fecha
        const availabilityEl = packageEl.querySelector('.package-availability');
        const dateEl = packageEl.querySelector('.package-next-date');
        
        if (availabilityEl) {
            // Reemplazar el elemento de disponibilidad con el selector de personas
            const guestsSelectorHTML = createGuestsSelectorHTML(packageId, minGuests, maxGuests);
            availabilityEl.outerHTML = guestsSelectorHTML;
            
            // Inicializar el selector de personas
            initGuestsSelector(packageId, packagePrice, dateEl);
        }
        
        // Agregar los nuevos botones de acción
        const buttonsContainer = packageEl.querySelector('.package-buttons');
        if (buttonsContainer) {
            // Mantener el botón de agregar al carrito
            const cartButton = buttonsContainer.querySelector('.add-to-cart-btn');
            const reserveButton = buttonsContainer.querySelector('.package-button');
            
            // Crear nuevos botones
            const newButtonsHTML = `
                <div class="package-action-buttons">
                    <button class="proceed-payment-btn" data-package-id="${packageId}">
                        Proceder al pago
                    </button>
                    <button class="custom-advice-btn" data-package-id="${packageId}">
                        ¿Requieres asesoría personalizada?
                    </button>
                </div>
            `;
            
            // Reemplazar los botones existentes
            buttonsContainer.innerHTML = '';
            buttonsContainer.appendChild(cartButton);
            if (reserveButton) {
                buttonsContainer.appendChild(reserveButton);
            }
            buttonsContainer.insertAdjacentHTML('beforeend', newButtonsHTML);
            
            // Agregar event listeners para los nuevos botones
            const proceedBtn = buttonsContainer.querySelector('.proceed-payment-btn');
            const adviceBtn = buttonsContainer.querySelector('.custom-advice-btn');
            
            proceedBtn.addEventListener('click', function() {
                proceedToPayment(packageId);
            });
            
            adviceBtn.addEventListener('click', function() {
                requestCustomAdvice(packageId);
            });
        }
    });
}

// Crear HTML para el selector de personas
function createGuestsSelectorHTML(packageId, minGuests, maxGuests) {
    return `
        <div class="package-guests-selector" id="guests-selector-${packageId}">
            <label for="guests-input-${packageId}">Personas:</label>
            <input type="number" id="guests-input-${packageId}" class="package-guests-input" 
                   min="${minGuests}" max="${maxGuests}" value="${minGuests}">
            <div class="guests-controls">
                <button class="guests-control-btn decrease-guests" data-package-id="${packageId}">-</button>
                <button class="guests-control-btn increase-guests" data-package-id="${packageId}">+</button>
            </div>
        </div>
        <div class="date-promotion" id="date-promotion-${packageId}">
            <div class="date-promotion-content">
                <div class="date-promotion-title">¡Promoción Especial!</div>
                <div class="date-promotion-text">
                    Para grupos de 10 o más personas, puedes elegir tu propia fecha de viaje.
                    <br>Esta promoción te permite personalizar tu experiencia según tus necesidades.
                </div>
                <div class="date-promotion-buttons">
                    <button class="promotion-btn accept-promotion" data-package-id="${packageId}">Aceptar promoción</button>
                    <button class="promotion-btn reject-promotion" data-package-id="${packageId}">Rechazar promoción</button>
                </div>
            </div>
        </div>
        <div class="custom-date-container" id="custom-date-${packageId}">
            <label for="custom-date-input-${packageId}">Selecciona tu fecha preferida:</label>
            <input type="date" id="custom-date-input-${packageId}" class="custom-date-input" min="${getTodayDate()}">
        </div>
    `;
}

// Obtener la fecha actual en formato YYYY-MM-DD
function getTodayDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

// Función para formatear fecha correctamente
function formatDateCorrectly(date) {
    // Asegurarse de que date es un objeto Date válido
    if (!(date instanceof Date) || isNaN(date)) {
        return '';
    }
    
    // Crear una nueva fecha para evitar problemas de zona horaria
    const localDate = new Date(date.getTime());
    // Ajustar para evitar el problema de día anterior
    localDate.setMinutes(localDate.getMinutes() + localDate.getTimezoneOffset());
    
    const day = localDate.getDate();
    const monthNames = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    const month = monthNames[localDate.getMonth()];
    const year = localDate.getFullYear();
    
    return `${day} de ${month} del ${year}`;
}

// Inicializar el selector de personas
function initGuestsSelector(packageId, basePrice, dateEl) {
    const guestsInput = document.getElementById(`guests-input-${packageId}`);
    const decreaseBtn = document.querySelector(`.decrease-guests[data-package-id="${packageId}"]`);
    const increaseBtn = document.querySelector(`.increase-guests[data-package-id="${packageId}"]`);
    const datePromotion = document.getElementById(`date-promotion-${packageId}`);
    const acceptBtn = document.querySelector(`.accept-promotion[data-package-id="${packageId}"]`);
    const rejectBtn = document.querySelector(`.reject-promotion[data-package-id="${packageId}"]`);
    const customDateContainer = document.getElementById(`custom-date-${packageId}`);
    const customDateInput = document.getElementById(`custom-date-input-${packageId}`);
    
    // Asegurarse de que la promoción esté oculta inicialmente
    if (datePromotion) {
        datePromotion.style.display = 'none';
    }
    
    // Asegurarse de que el contenedor de fecha personalizada esté oculto inicialmente
    if (customDateContainer) {
        customDateContainer.style.display = 'none';
    }
    
    // Actualizar precio basado en número de personas
    function updatePrice() {
        const guestsCount = parseInt(guestsInput.value);
        const totalPrice = basePrice * guestsCount;
        
        // Actualizar el precio en el botón de agregar al carrito
        const addToCartBtn = document.querySelector(`.add-to-cart-btn[data-package-id="${packageId}"]`);
        if (addToCartBtn) {
            addToCartBtn.setAttribute('data-package-price', totalPrice);
            
            // Actualizar el texto del precio mostrado
            const priceEl = document.querySelector(`.el[data-package-id="${packageId}"] .package-price`);
            if (priceEl) {
                priceEl.innerHTML = `<i class="fas fa-tag"></i> $${totalPrice.toFixed(2)} MXN (${guestsCount} personas)`;
            }
        }
        
        // Mostrar promoción si hay 10 o más personas
        if (guestsCount >= 10 && datePromotion) {
            datePromotion.style.display = 'flex';
            document.body.style.overflow = 'hidden'; // Prevenir scroll
        } else if (datePromotion && datePromotion.style.display === 'flex') {
            // Si ya no hay 10 o más personas, ocultar la promoción
            datePromotion.style.display = 'none';
            document.body.style.overflow = ''; // Restaurar scroll
        }
    }
    
    // Event listeners para los botones de control
    if (decreaseBtn) {
        decreaseBtn.addEventListener('click', function() {
            const currentValue = parseInt(guestsInput.value);
            const minValue = parseInt(guestsInput.min);
            if (currentValue > minValue) {
                guestsInput.value = currentValue - 1;
                updatePrice();
            }
        });
    }
    
    if (increaseBtn) {
        increaseBtn.addEventListener('click', function() {
            const currentValue = parseInt(guestsInput.value);
            const maxValue = parseInt(guestsInput.max);
            if (currentValue < maxValue) {
                guestsInput.value = currentValue + 1;
                updatePrice();
            }
        });
    }
    
    if (guestsInput) {
        guestsInput.addEventListener('change', updatePrice);
    }
    
    // Event listeners para los botones de promoción
    if (acceptBtn) {
        acceptBtn.addEventListener('click', function() {
            if (dateEl) {
                dateEl.style.display = 'none';
            }
            customDateContainer.style.display = 'block';
            datePromotion.style.display = 'none';
            document.body.style.overflow = ''; // Restaurar scroll
            
            // Establecer la fecha actual como valor predeterminado
            const today = new Date();
            customDateInput.value = today.toISOString().split('T')[0];
        });
    }
    
    if (rejectBtn) {
        rejectBtn.addEventListener('click', function() {
            datePromotion.style.display = 'none';
            document.body.style.overflow = ''; // Restaurar scroll
        });
    }
    
    // Inicializar precio
    updatePrice();
}

// Función para proceder al pago
function proceedToPayment(packageId) {
    // Primero agregar al carrito
    const addToCartBtn = document.querySelector(`.add-to-cart-btn[data-package-id="${packageId}"]`);
    if (addToCartBtn) {
        // Simular clic en el botón
        const event = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
        });
        addToCartBtn.dispatchEvent(event);
    }
    
    // Redirigir a la página de pago
    window.location.href = '/components/payment.html';
}

// Función para solicitar asesoría personalizada
function requestCustomAdvice(packageId) {
    // Aquí puedes implementar la lógica para mostrar un formulario de contacto
    // o redirigir a una página de contacto
    alert('Un asesor se pondrá en contacto contigo pronto para brindarte asesoría personalizada.');
    
    // También podrías redirigir a una página de contacto
    // window.location.href = '/components/contacto.html';
}