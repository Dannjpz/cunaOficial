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
// Modificar la función createGuestsSelectorHTML para un diseño más moderno
function createGuestsSelectorHTML(packageId, minGuests, maxGuests) {
    return `
        <div class="package-guests-selector" id="guests-selector-${packageId}">
            <label for="guests-input-${packageId}">Personas:</label>
            <div class="guests-input-container">
                <button class="guests-control-btn decrease-guests" data-package-id="${packageId}">
                    <i class="fas fa-minus"></i>
                </button>
                <div class="guests-display" id="guests-display-${packageId}">${minGuests}</div>
                <input type="hidden" id="guests-input-${packageId}" class="package-guests-input" 
                       min="${minGuests}" max="${maxGuests}" value="${minGuests}">
                <button class="guests-control-btn increase-guests" data-package-id="${packageId}">
                    <i class="fas fa-plus"></i>
                </button>
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
            <label for="custom-date-input-${packageId}">Selecciona tu fecha:</label>
            <div class="date-picker-container package-date-picker">
                <input type="date" id="custom-date-input-${packageId}" class="search-date package-date" min="${getTodayDate()}">
            </div>
        </div>
    `;
}

// Actualizar la función initGuestsSelector para manejar el nuevo diseño
function initGuestsSelector(packageId, basePrice, dateEl) {
    const guestsInput = document.getElementById(`guests-input-${packageId}`);
    const guestsDisplay = document.getElementById(`guests-display-${packageId}`);
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
        
        // Actualizar el display de personas
        if (guestsDisplay) {
            guestsDisplay.textContent = guestsCount;
        }
        
        // Actualizar el precio en el botón de agregar al carrito
        const addToCartBtn = document.querySelector(`.add-to-cart-btn[data-package-id="${packageId}"]`);
        if (addToCartBtn) {
            addToCartBtn.setAttribute('data-package-price', totalPrice);
            addToCartBtn.innerHTML = `<i class="fas fa-shopping-cart"></i> Agregar al carrito`;
        }
        
        // Actualizar el precio mostrado en la tarjeta del paquete
        const priceElement = document.querySelector(`.el[data-package-id="${packageId}"] .package-price`);
        if (priceElement) {
            // Formatear el precio con separadores de miles
            const formattedPrice = new Intl.NumberFormat('es-MX', {
                style: 'currency',
                currency: 'MXN',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(totalPrice);
            
            // Actualizar el texto del elemento de precio
            priceElement.innerHTML = `<i class="fas fa-tag"></i> ${formattedPrice}`;
        }
        
        // Mostrar promoción si hay 10 o más personas
        if (guestsCount >= 10 && datePromotion) {
            datePromotion.style.display = 'flex';
        }
    }
    
    // Event listeners para los botones de control de huéspedes
    if (decreaseBtn) {
        decreaseBtn.addEventListener('click', function() {
            const currentValue = parseInt(guestsInput.value);
            const minValue = parseInt(guestsInput.min);
            if (currentValue > minValue) {
                guestsInput.value = currentValue - 1;
                updatePrice();
                
                // Ocultar promoción si hay menos de 10 personas
                if (parseInt(guestsInput.value) < 10 && datePromotion) {
                    datePromotion.style.display = 'none';
                    
                    // También ocultar el selector de fecha personalizada
                    if (customDateContainer) {
                        customDateContainer.style.display = 'none';
                    }
                }
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
                
                // Mostrar promoción si hay 10 o más personas
                if (parseInt(guestsInput.value) >= 10 && datePromotion) {
                    datePromotion.style.display = 'flex';
                }
            }
        });
    }
    
    // Event listeners para los botones de promoción
    if (acceptBtn) {
        acceptBtn.addEventListener('click', function() {
            if (datePromotion) {
                datePromotion.style.display = 'none';
            }
            
            if (customDateContainer) {
                customDateContainer.style.display = 'block';
                
                // Establecer la fecha actual como valor predeterminado si no tiene valor
                if (!customDateInput.value) {
                    customDateInput.value = getTodayDate();
                }
                
                // Inicializar el calendario personalizado
                setupPackageDatePicker(customDateInput);
                
                // Forzar la apertura del calendario después de un breve retraso
                setTimeout(() => {
                    // Simular un clic en el input para abrir el calendario
                    const calendarDropdown = customDateContainer.querySelector('.calendar-dropdown');
                    if (calendarDropdown) {
                        calendarDropdown.classList.add('show');
                        renderCalendar(customDateInput, calendarDropdown);
                    }
                }, 300);
            }
            
            document.body.style.overflow = ''; // Restaurar scroll
        });
    }
    
    if (rejectBtn) {
        rejectBtn.addEventListener('click', function() {
            if (datePromotion) {
                datePromotion.style.display = 'none';
            }
            document.body.style.overflow = ''; // Restaurar scroll
        });
    }
    
    // Inicializar el precio
    updatePrice();
}

// Función para inicializar el calendario personalizado
function setupPackageDatePicker(dateInput) {
    if (!dateInput) return;
    
    // Establecer límites de fecha
    const today = new Date();
    const maxDate = new Date(today.getFullYear() + 1, 11, 31); // Último día del año siguiente
    
    dateInput.min = today.toISOString().split('T')[0];
    dateInput.max = maxDate.toISOString().split('T')[0];
    
    // Crear contenedor para el calendario si no existe
    let container = dateInput.closest('.date-picker-container');
    
    if (!container) {
        container = document.createElement('div');
        container.className = 'date-picker-container package-date-picker';
        dateInput.parentNode.insertBefore(container, dateInput);
        container.appendChild(dateInput);
    }
    
    // Crear el dropdown del calendario si no existe
    let calendarDropdown = container.querySelector('.calendar-dropdown');
    
    if (!calendarDropdown) {
        calendarDropdown = document.createElement('div');
        calendarDropdown.className = 'calendar-dropdown';
        container.appendChild(calendarDropdown);
    }
    
    // Eliminar eventos anteriores para evitar duplicados
    const newDateInput = dateInput.cloneNode(true);
    dateInput.parentNode.replaceChild(newDateInput, dateInput);
    dateInput = newDateInput;
    
    // Mostrar el calendario al hacer clic en el input
    dateInput.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Cerrar otros calendarios abiertos
        document.querySelectorAll('.calendar-dropdown.show').forEach(dropdown => {
            if (dropdown !== calendarDropdown) {
                dropdown.classList.remove('show');
            }
        });
        
        // Mostrar el calendario
        calendarDropdown.classList.add('show');
        renderCalendar(dateInput, calendarDropdown);
        
        // Asegurarse de que el calendario sea visible
        calendarDropdown.style.display = 'block';
        calendarDropdown.style.zIndex = '9999';
    });
    
    // Cerrar el calendario al hacer clic fuera
    document.addEventListener('click', function(e) {
        if (!container.contains(e.target)) {
            calendarDropdown.classList.remove('show');
        }
    });
    
    return dateInput; // Devolver el nuevo input para referencias
}

// 4. Finalmente, agreguemos la función `renderCalendar` para mostrar el calendario:
// Función para renderizar el calendario
function renderCalendar(dateInput, calendarDropdown) {
    const date = dateInput.value ? new Date(dateInput.value) : new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const minDate = dateInput.min ? new Date(dateInput.min) : null;
    minDate?.setHours(0, 0, 0, 0);
    
    const maxDate = dateInput.max ? new Date(dateInput.max) : null;
    maxDate?.setHours(0, 0, 0, 0);
    
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const weekdays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    
    let html = `
        <div class="calendar-header">
            <button class="calendar-nav prev-month"><i class="fas fa-chevron-left"></i></button>
            <div class="calendar-title">${monthNames[month]} ${year}</div>
            <button class="calendar-nav next-month"><i class="fas fa-chevron-right"></i></button>
        </div>
        <div class="calendar-weekdays">
    `;
    
    // Agregar días de la semana
    weekdays.forEach(day => {
        html += `<div class="weekday">${day}</div>`;
    });
    
    html += `</div><div class="calendar-days">`;
    
    // Agregar días vacíos al principio
    for (let i = 0; i < firstDay.getDay(); i++) {
        html += `<div class="calendar-day empty"></div>`;
    }
    
    // Agregar días del mes
    for (let i = 1; i <= lastDay.getDate(); i++) {
        const currentDate = new Date(year, month, i);
        currentDate.setHours(0, 0, 0, 0);
        
        let classes = 'calendar-day';
        
        if (currentDate.getTime() === today.getTime()) {
            classes += ' today';
        }
        
        if (dateInput.value && currentDate.getTime() === new Date(dateInput.value).setHours(0, 0, 0, 0)) {
            classes += ' selected';
        }
        
        // Deshabilitar fechas fuera del rango permitido
        if ((minDate && currentDate < minDate) || (maxDate && currentDate > maxDate)) {
            classes += ' disabled';
        }
        
        html += `<div class="${classes}" data-date="${currentDate.toISOString().split('T')[0]}">${i}</div>`;
    }
    
    html += `</div>`;
    
    calendarDropdown.innerHTML = html;
    
    // Event listeners para navegación del calendario
    calendarDropdown.querySelector('.prev-month').addEventListener('click', function(e) {
        e.stopPropagation();
        date.setMonth(date.getMonth() - 1);
        renderCalendar(dateInput, calendarDropdown);
    });
    
    calendarDropdown.querySelector('.next-month').addEventListener('click', function(e) {
        e.stopPropagation();
        date.setMonth(date.getMonth() + 1);
        renderCalendar(dateInput, calendarDropdown);
    });
    
    // Event listeners para selección de día
    calendarDropdown.querySelectorAll('.calendar-day:not(.empty):not(.disabled)').forEach(day => {
        day.addEventListener('click', function(e) {
            e.stopPropagation();
            const selectedDate = this.getAttribute('data-date');
            dateInput.value = selectedDate;
            
            // Marcar como seleccionado
            calendarDropdown.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
            this.classList.add('selected');
            
            // Cerrar el calendario
            calendarDropdown.classList.remove('show');
            
            // Disparar evento change
            dateInput.dispatchEvent(new Event('change'));
        });
    });
}

// 3. Let's add a helper function to get today's date in the correct format:
function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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
    const guestsDisplay = document.getElementById(`guests-display-${packageId}`);
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
        
        // Actualizar el display de personas
        if (guestsDisplay) {
            guestsDisplay.textContent = guestsCount;
        }
        
        // Actualizar el precio en el botón de agregar al carrito
        const addToCartBtn = document.querySelector(`.add-to-cart-btn[data-package-id="${packageId}"]`);
        if (addToCartBtn) {
            addToCartBtn.setAttribute('data-package-price', totalPrice);
            addToCartBtn.innerHTML = `<i class="fas fa-shopping-cart"></i> Agregar al carrito`;
        }
        
        // Actualizar el precio mostrado en la tarjeta del paquete
        const priceElement = document.querySelector(`.el[data-package-id="${packageId}"] .package-price`);
        if (priceElement) {
            // Formatear el precio con separadores de miles
            const formattedPrice = new Intl.NumberFormat('es-MX', {
                style: 'currency',
                currency: 'MXN',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(totalPrice);
            
            // Actualizar el texto del elemento de precio
            priceElement.innerHTML = `<i class="fas fa-tag"></i> ${formattedPrice}`;
        }
        
        // Mostrar promoción si hay 10 o más personas
        if (guestsCount >= 10 && datePromotion) {
            datePromotion.style.display = 'flex';
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

// Función para agregar al carrito
function addToCart(packageId, packageName, packagePrice) {
    // Obtener el número de personas
    const guestsInput = document.getElementById(`guests-input-${packageId}`);
    if (!guestsInput) {
        console.error('No se encontró el input de personas');
        return;
    }
    
    const guests = parseInt(guestsInput.value);
    
    // Obtener la fecha si está disponible
    let date = null;
    const customDateInput = document.getElementById(`custom-date-input-${packageId}`);
    
    if (customDateInput && customDateInput.value && customDateInput.style.display !== 'none') {
        // Si hay una fecha personalizada seleccionada
        const selectedDate = new Date(customDateInput.value);
        date = formatDateCorrectly(selectedDate);
    } else {
        // Usar la fecha predeterminada del paquete si está disponible
        const dateEl = document.querySelector(`.el[data-package-id="${packageId}"] .package-next-date`);
        if (dateEl) {
            date = dateEl.textContent.trim();
        }
    }
    
    // Crear el objeto del item
    const item = {
        id: packageId,
        name: packageName,
        price: packagePrice,
        guests: guests,
        date: date
    };
    
    // Verificar si ya existe un carrito en localStorage
    let cart = [];
    try {
        const savedCart = localStorage.getItem('shoppingCart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
        }
    } catch (e) {
        console.error('Error al cargar el carrito:', e);
        cart = [];
    }
    
    // Agregar el item al carrito
    cart.push(item);
    
    // Guardar el carrito actualizado
    localStorage.setItem('shoppingCart', JSON.stringify(cart));
    
    // Iniciar el temporizador del carrito si no existe
    if (!localStorage.getItem('cartTimerStart')) {
        localStorage.setItem('cartTimerStart', Date.now());
    }
    
    // Mostrar mensaje de confirmación
    showAddToCartConfirmation(packageName, guests);
    
    // Actualizar el contador del carrito
    updateCartCounter();
}

// Función para formatear la fecha correctamente
function formatDateCorrectly(date) {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('es-ES', options).replace('.', '').replace(',', '');
}

function createCustomDateHTML(packageId) {
    return `
        <div class="custom-date-container" id="custom-date-${packageId}" style="display: none;">
            <label for="custom-date-input-${packageId}">Selecciona tu fecha preferida:</label>
            <div class="date-picker-container package-date-picker">
                <input type="date" id="custom-date-input-${packageId}" class="search-date package-date">
                <div class="calendar-dropdown"></div>
            </div>
        </div>
    `;
}