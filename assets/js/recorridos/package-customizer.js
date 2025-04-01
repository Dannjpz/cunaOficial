// Funcionalidad para personalizar paquetes

document.addEventListener('DOMContentLoaded', function () {
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

            proceedBtn.addEventListener('click', function () {
                proceedToPayment(packageId);
            });

            adviceBtn.addEventListener('click', function () {
                requestCustomAdvice(packageId);
            });
        }
    });
}

function createGuestsSelectorHTML(packageId, minGuests, maxGuests) {
    const today = new Date();
    const formattedDisplayDate = formatDateCorrectly(today);

    return `
        <div class="package-guests-selector" id="guests-selector-${packageId}">
            <label for="guests-input-${packageId}">Personas:</label>
            <div class="guests-input-container">
                <button class="guests-control-btn decrease-guests" data-package-id="${packageId}">
                    <i class="fas fa-minus" style="position: relative; right: -3px;"></i>
                </button>
                <div class="guests-display" id="guests-display-${packageId}">${minGuests}</div>
                <input type="hidden" id="guests-input-${packageId}" class="package-guests-input" 
                       min="${minGuests}" max="${maxGuests}" value="${minGuests}">
                <button class="guests-control-btn increase-guests" data-package-id="${packageId}">
                    <i class="fas fa-plus" style="position: relative; right: -3px;"></i>
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
            <div class="date-picker-container">
                <input type="date" id="custom-date-input-${packageId}" class="search-date" 
                       min="${getTodayDate()}" value="${getTodayDate()}" 
                       data-placeholder="${formattedDisplayDate}">
            </div>
        </div>
    `;
}

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

    // Variable para rastrear si la promoción ya fue mostrada y la respuesta del usuario
    let promotionShown = false;
    let promotionAccepted = false;

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
            // Preservar la etiqueta label al actualizar el precio
            const labelElement = priceElement.querySelector('label');
            if (labelElement) {
                priceElement.innerHTML = '';
                priceElement.appendChild(labelElement);
                priceElement.innerHTML += `$${totalPrice.toLocaleString()} MXN`;
            } else {
                // Si no hay label, crear uno nuevo
                priceElement.innerHTML = `<label>Precio:</label> $${totalPrice.toLocaleString()} MXN`;
            }
        }

        // Mostrar promoción solo cuando hay exactamente 10 personas y no se ha mostrado antes
        if (guestsCount === 10 && !promotionShown && datePromotion) {
            datePromotion.style.display = 'flex';
            promotionShown = true;

            // Ocultar la fecha original del paquete
            if (dateEl) {
                dateEl.style.display = 'none';
            }
        } else if (guestsCount < 10) {
            // Reiniciar el estado si bajan de 10 personas
            promotionShown = false;
            promotionAccepted = false;

            if (datePromotion) {
                datePromotion.style.display = 'none';
            }

            // Mostrar la fecha original del paquete
            if (dateEl) {
                dateEl.style.display = 'inline-block';
            }

            // Ocultar el selector de fecha personalizada
            if (customDateContainer) {
                customDateContainer.style.display = 'none';
            }
        } else if (guestsCount > 10) {
            // Para más de 10 personas, mantener el estado según la elección previa
            if (datePromotion) {
                datePromotion.style.display = 'none';
            }

            if (promotionAccepted) {
                // Si aceptaron la promoción, mostrar el selector de fecha personalizada
                if (customDateContainer) {
                    customDateContainer.style.display = 'block';
                }
                // Mantener oculta la fecha original
                if (dateEl) {
                    dateEl.style.display = 'none';
                }
            } else {
                // Si rechazaron o no han visto la promoción, mostrar la fecha original
                if (dateEl) {
                    dateEl.style.display = 'inline-block';
                }
                if (customDateContainer) {
                    customDateContainer.style.display = 'none';
                }
            }
        }
    }

    // Configurar botones de incremento/decremento
    if (decreaseBtn) {
        decreaseBtn.addEventListener('click', function () {
            const currentValue = parseInt(guestsInput.value);
            const minValue = parseInt(guestsInput.getAttribute('min'));
            if (currentValue > minValue) {
                guestsInput.value = currentValue - 1;
                updatePrice();
            }
        });
    }

    if (increaseBtn) {
        increaseBtn.addEventListener('click', function () {
            const currentValue = parseInt(guestsInput.value);
            const maxValue = parseInt(guestsInput.getAttribute('max'));
            if (currentValue < maxValue) {
                guestsInput.value = currentValue + 1;
                updatePrice();
            }
        });
    }

    // Configurar botones de promoción
    if (acceptBtn) {
        acceptBtn.addEventListener('click', function () {
            promotionAccepted = true;

            if (datePromotion) {
                datePromotion.style.display = 'none';
            }
            if (customDateContainer) {
                customDateContainer.style.display = 'block';

                // Mantener oculta la fecha original cuando se acepta la promoción
                if (dateEl) {
                    dateEl.style.display = 'none';
                }

                // Configurar el selector de fecha
                setupPackageDatePicker(customDateInput, packageId);
            }
        });
    }

    if (rejectBtn) {
        rejectBtn.addEventListener('click', function () {
            promotionAccepted = false;

            if (datePromotion) {
                datePromotion.style.display = 'none';
            }

            // Mostrar la fecha original del paquete cuando se rechaza la promoción
            if (dateEl) {
                dateEl.style.display = 'inline-block';
            }

            // Ocultar el selector de fecha personalizada
            if (customDateContainer) {
                customDateContainer.style.display = 'none';
            }
        });
    }

    // Inicializar precio
    updatePrice();
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

function setupPackageDatePicker(dateInput, packageId) {
    // Crear contenedor para el calendario si no existe
    let container = dateInput.closest('.date-picker-container');

    // Crear el dropdown del calendario si no existe
    let calendarDropdown = container.querySelector('.calendar-dropdown');

    if (!calendarDropdown) {
        calendarDropdown = document.createElement('div');
        calendarDropdown.className = 'calendar-dropdown';
        container.appendChild(calendarDropdown);
    }

    // Configurar evento click para mostrar/ocultar el calendario
    dateInput.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();

        // Cerrar cualquier otro calendario abierto
        document.querySelectorAll('.calendar-dropdown.active').forEach(dropdown => {
            if (dropdown !== calendarDropdown) {
                dropdown.classList.remove('active');
            }
        });

        // Alternar visibilidad
        calendarDropdown.classList.toggle('active');

        if (calendarDropdown.classList.contains('active')) {
            // Limpiar contenido existente
            calendarDropdown.innerHTML = '';

            // Obtener fechas relevantes
            const today = new Date();
            const selectedDate = dateInput.value ? new Date(dateInput.value) : today;
            const currentMonth = selectedDate.getMonth();
            const currentYear = selectedDate.getFullYear();

            // Renderizar calendario
            renderPackageCalendar(calendarDropdown, currentMonth, currentYear, dateInput, today);
        }
    });

    // Cerrar el calendario al hacer clic fuera
    document.addEventListener('click', function (e) {
        if (!container.contains(e.target) && calendarDropdown.classList.contains('active')) {
            calendarDropdown.classList.remove('active');
        }
    });
}

function renderPackageCalendar(dropdown, month, year, input, today) {
    // Crear header del calendario
    const header = document.createElement('div');
    header.className = 'calendar-header';

    const title = document.createElement('div');
    title.className = 'calendar-title';

    // Formatear el nombre del mes y año
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    title.textContent = `${monthNames[month]} ${year}`;

    const nav = document.createElement('div');
    nav.className = 'calendar-nav';

    const prevBtn = document.createElement('button');
    prevBtn.className = 'calendar-nav-btn prev';
    prevBtn.innerHTML = '&larr;';
    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        let newMonth = month - 1;
        let newYear = year;
        if (newMonth < 0) {
            newMonth = 11;
            newYear--;
        }

        // No permitir navegar a fechas anteriores a hoy
        if (newYear < today.getFullYear()) {
            return;
        }
        if (newYear === today.getFullYear() && newMonth < today.getMonth()) {
            return;
        }

        // Actualizar el calendario
        dropdown.innerHTML = '';
        renderPackageCalendar(dropdown, newMonth, newYear, input, today);
    });

    const nextBtn = document.createElement('button');
    nextBtn.className = 'calendar-nav-btn next';
    nextBtn.innerHTML = '&rarr;';
    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        let newMonth = month + 1;
        let newYear = year;
        if (newMonth > 11) {
            newMonth = 0;
            newYear++;
        }

        // Limitar navegación a 2 años en el futuro
        const maxDate = new Date();
        maxDate.setFullYear(maxDate.getFullYear() + 2);

        if (new Date(newYear, newMonth) <= maxDate) {
            dropdown.innerHTML = '';
            renderPackageCalendar(dropdown, newMonth, newYear, input, today);
        }
    });

    nav.appendChild(prevBtn);
    nav.appendChild(nextBtn);
    header.appendChild(title);
    header.appendChild(nav);
    dropdown.appendChild(header);

    // Crear días de la semana
    const weekdays = document.createElement('div');
    weekdays.className = 'calendar-weekdays';

    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    days.forEach(day => {
        const dayElem = document.createElement('div');
        dayElem.className = 'weekday';
        dayElem.textContent = day;
        weekdays.appendChild(dayElem);
    });

    dropdown.appendChild(weekdays);

    // Crear grid de días
    const daysGrid = document.createElement('div');
    daysGrid.className = 'calendar-days';

    // Obtener el primer día del mes
    const firstDay = new Date(year, month, 1);
    const startingDay = firstDay.getDay(); // 0 = Domingo, 1 = Lunes, etc.

    // Obtener el número de días en el mes
    const lastDay = new Date(year, month + 1, 0);
    const totalDays = lastDay.getDate();

    // Obtener la fecha seleccionada
    const selectedDate = input.value ? new Date(input.value) : null;

    // Crear celdas vacías para los días anteriores al primer día del mes
    for (let i = 0; i < startingDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day empty';
        daysGrid.appendChild(emptyDay);
    }

    // Crear celdas para cada día del mes
    for (let i = 1; i <= totalDays; i++) {
        const dayElem = document.createElement('div');
        dayElem.className = 'calendar-day';
        dayElem.textContent = i;

        // Verificar si es hoy
        const currentDate = new Date(year, month, i);
        if (currentDate.toDateString() === today.toDateString()) {
            dayElem.classList.add('today');
        }

        // Verificar si es la fecha seleccionada
        if (selectedDate &&
            selectedDate.getDate() === i &&
            selectedDate.getMonth() === month &&
            selectedDate.getFullYear() === year) {
            dayElem.classList.add('selected');
        }

        // Deshabilitar fechas pasadas
        if (currentDate < today) {
            dayElem.classList.add('disabled');
        } else {
            // Añadir evento click para seleccionar fecha
            dayElem.addEventListener('click', () => {
                // Formatear la fecha para el input
                const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
                input.value = formattedDate;

                // Actualizar el atributo data-placeholder con la fecha formateada
                const newDate = new Date(formattedDate);
                input.setAttribute('data-placeholder', formatDateCorrectly(newDate));

                // Disparar evento change
                const event = new Event('change', { bubbles: true });
                input.dispatchEvent(event);

                // Cerrar el calendario
                dropdown.classList.remove('active');
            });
        }

        daysGrid.appendChild(dayElem);
    }

    dropdown.appendChild(daysGrid);
}