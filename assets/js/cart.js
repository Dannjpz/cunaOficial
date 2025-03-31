// Funcionalidad del carrito de compras

// Inicializar el carrito desde localStorage o crear uno nuevo
let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
let cartTimerStart = localStorage.getItem('cartTimerStart') || null;
updateCartCounter();
initCartTimer();

// Event listeners
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM cargado, inicializando carrito...');

    // Botones de agregar al carrito
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', addToCart);
    });

    // Icono del carrito para abrir modal (original)
    const cartIcon = document.getElementById('cart-icon');
    if (cartIcon) {
        cartIcon.addEventListener('click', function (event) {
            event.preventDefault(); // Prevenir el comportamiento predeterminado
            openCartModal(event);
        });
    } else {
        console.log('Nota: No se encontró el elemento #cart-icon');
    }

    // Icono del carrito en la navegación (añadido)
    const cartIconNav = document.getElementById('cart-icon-nav');
    if (cartIconNav) {
        cartIconNav.addEventListener('click', function (event) {
            event.preventDefault(); // Prevenir el comportamiento predeterminado
            openCartModal(event);
        });
    } else {
        console.log('Nota: No se encontró el elemento #cart-icon-nav');
    }

    // Cerrar modal
    const closeBtn = document.querySelector('.cart-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeCartModal);
    } else {
        console.log('Nota: No se encontró el elemento .cart-close');
    }

    // Cerrar modal al hacer clic fuera
    window.addEventListener('click', function (event) {
        const modal = document.getElementById('cart-modal');
        if (event.target === modal) {
            closeCartModal();
        }
    });

    // Botón para vaciar carrito
    const clearCartBtn = document.getElementById('checkout-button-2');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', clearCart);
    } else {
        console.log('Nota: No se encontró el elemento #checkout-button-2');
    }

    // Botón para proceder al pago
    const checkoutBtn = document.getElementById('checkout-button-1');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', proceedToCheckout);
    } else {
        console.log('Nota: No se encontró el elemento #checkout-button-1');
    }

    // Renderizar carrito inicial
    try {
        renderCartItems();
    } catch (error) {
        console.error('Error al renderizar el carrito inicial:', error);
    }
});

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

// Función para agregar un producto al carrito
function addToCart(event) {
    const button = event.currentTarget;
    const packageId = button.getAttribute('data-package-id');
    const packageName = button.getAttribute('data-package-name');
    const packagePrice = parseFloat(button.getAttribute('data-package-price'));

    // Obtener el número de personas seleccionado
    const guestsInput = document.getElementById(`guests-input-${packageId}`);
    let guestsCount = 1;

    if (guestsInput && guestsInput.value) {
        guestsCount = parseInt(guestsInput.value);
    }

    // Obtener la fecha seleccionada
    let selectedDate = '';
    const customDateInput = document.getElementById(`custom-date-input-${packageId}`);
    const customDateContainer = document.getElementById(`custom-date-${packageId}`);
    const dateEl = document.querySelector(`.el[data-package-id="${packageId}"] .package-next-date`);

    if (customDateInput && customDateContainer &&
        customDateContainer.style.display !== 'none' &&
        customDateInput.value) {
        // Usar la fecha personalizada
        const selectedDateObj = new Date(customDateInput.value);
        selectedDate = formatDateCorrectly(selectedDateObj);
    } else if (dateEl) {
        // Usar la fecha predeterminada
        const dateText = dateEl.textContent;
        selectedDate = dateText.replace('Próxima salida: ', '');
    }

    // Verificar si el carrito estaba vacío antes de agregar
    const wasEmpty = cart.length === 0;

    // Verificar si el paquete ya está en el carrito
    const existingItemIndex = cart.findIndex(item => item.id === packageId);

    if (existingItemIndex !== -1) {
        // Si ya existe, actualizar la cantidad y fecha
        cart[existingItemIndex].guests = guestsCount;
        cart[existingItemIndex].date = selectedDate;
        cart[existingItemIndex].price = packagePrice;
    } else {
        // Si no existe, agregar nuevo item
        cart.push({
            id: packageId,
            name: packageName,
            price: packagePrice,
            guests: guestsCount,
            date: selectedDate
        });
    }

    // Guardar en localStorage
    saveCart();

    // Si el carrito estaba vacío y ahora tiene items, iniciar el temporizador
    if (wasEmpty && cart.length > 0) {
        console.log('Carrito pasó de vacío a tener items, iniciando temporizador');
        cartTimerStart = null; // Forzar reinicio del temporizador
        startCartTimer();
    }

    // Actualizar contador y animar
    updateCartCounter(true);

    // Mostrar mensaje de confirmación
    showAddedToCartMessage(packageName);
}

// Función para guardar el carrito en localStorage
function saveCart() {
    localStorage.setItem('shoppingCart', JSON.stringify(cart));
}

// Función para actualizar el contador del carrito
function updateCartCounter(animate = false) {
    // Actualizar ambos contadores
    const counters = [
        document.getElementById('cart-counter'),
        document.getElementById('cart-counter-nav')
    ];

    counters.forEach(counter => {
        if (counter) {
            counter.textContent = cart.length;

            if (animate) {
                counter.classList.add('cart-animation');
                setTimeout(() => {
                    counter.classList.remove('cart-animation');
                }, 500);
            }
        }
    });
}

// Función para mostrar mensaje de confirmación
function showAddedToCartMessage(packageName) {
    // Crear elemento para el mensaje
    const messageElement = document.createElement('div');
    messageElement.className = 'cart-message';
    messageElement.innerHTML = `
        <div class="cart-message-content">
            <i class="fas fa-check-circle"></i>
            <p>${packageName} agregado al carrito</p>
        </div>
    `;

    // Agregar al DOM
    document.body.appendChild(messageElement);

    // Mostrar con animación
    setTimeout(() => {
        messageElement.classList.add('show');
    }, 10);

    // Remover después de 3 segundos
    setTimeout(() => {
        messageElement.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(messageElement);
        }, 300);
    }, 3000);
}

// Iniciar el temporizador del carrito
function startCartTimer() {
    const now = new Date().getTime();
    cartTimerStart = now.toString(); // Guardar como string para evitar problemas
    localStorage.setItem('cartTimerStart', cartTimerStart);
    console.log('Temporizador iniciado:', new Date(now).toLocaleTimeString(), 'valor guardado:', cartTimerStart);

    // Asegurarse de que el intervalo esté configurado
    if (window.cartTimerInterval) {
        clearInterval(window.cartTimerInterval);
    }
    window.cartTimerInterval = setInterval(function () {
        console.log('Tick del temporizador');
        updateCartTimer();
    }, 1000);

    // Actualizar inmediatamente
    updateCartTimer();
}

// Función para inicializar el temporizador del carrito
function initCartTimer() {
    // Si no hay tiempo de inicio, establecerlo ahora
    if (!cartTimerStart) {
        cartTimerStart = Date.now();
        localStorage.setItem('cartTimerStart', cartTimerStart);
    }

    // Actualizar el temporizador inmediatamente
    updateCartTimer();

    // Configurar intervalo para actualizar el temporizador cada segundo
    setInterval(updateCartTimer, 1000);
}

// Función para actualizar el temporizador del carrito
function updateCartTimer() {
    try {
        // Buscar el elemento del temporizador
        const timerElement = document.getElementById('cart-timer');

        if (!timerElement) {
            console.log('Elemento del temporizador no encontrado');
            return;
        }

        // Si el carrito está vacío, ocultar el temporizador
        if (cart.length === 0) {
            timerElement.style.display = 'none';
            return;
        }

        // Mostrar el temporizador
        timerElement.style.display = 'inline-block';

        // Calcular tiempo transcurrido
        const now = Date.now();
        const elapsed = Math.floor((now - cartTimerStart) / 1000);
        const timeLimit = 30 * 60; // 30 minutos en segundos
        const remaining = timeLimit - elapsed;

        // Si el tiempo ha expirado, vaciar el carrito
        if (remaining <= 0) {
            clearCart();
            timerElement.innerHTML = '<i class="fas fa-hourglass-end"></i> Tiempo expirado';
            return;
        }

        // Formatear el tiempo restante
        const minutes = Math.floor(remaining / 60);
        const seconds = remaining % 60;
        const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

        // Actualizar el contenido del temporizador
        timerElement.innerHTML = `<i class="fas fa-hourglass-half"></i> Reserva por: ${formattedTime}`;

        // Añadir clase de advertencia si queda poco tiempo
        if (remaining < 300) { // Menos de 5 minutos
            timerElement.classList.add('cart-timer-warning');
        } else {
            timerElement.classList.remove('cart-timer-warning');
        }
    } catch (error) {
        console.error('Error al actualizar el temporizador:', error);
    }
}

// Función para abrir el modal del carrito
function openCartModal(event) {
    if (event) {
        event.preventDefault();
    }

    console.log('Abriendo modal del carrito');

    const modal = document.getElementById('cart-modal');
    if (!modal) {
        console.error('Error: No se encontró el modal del carrito (#cart-modal)');
        return;
    }

    try {
        // Renderizar los items del carrito
        renderCartItems();

        // Asegurarse de que existe el contenedor del temporizador
        let timerContainer = modal.querySelector('.cart-timer-container');
        if (!timerContainer) {
            timerContainer = document.createElement('div');
            timerContainer.className = 'cart-timer-container';

            // Insertar después del encabezado
            const headerEl = modal.querySelector('.cart-header');
            if (headerEl && headerEl.nextSibling) {
                headerEl.parentNode.insertBefore(timerContainer, headerEl.nextSibling);
            } else {
                // Si no hay encabezado, insertar al principio del contenido
                const contentEl = modal.querySelector('.cart-content');
                if (contentEl) {
                    contentEl.insertBefore(timerContainer, contentEl.firstChild);
                }
            }
        }

        // Crear o actualizar el elemento del temporizador
        let timerElement = document.getElementById('cart-timer');
        if (!timerElement) {
            timerElement = document.createElement('div');
            timerElement.id = 'cart-timer';
            timerElement.className = 'cart-timer';
            timerContainer.appendChild(timerElement);
        }

        // Actualizar el temporizador
        updateCartTimer();

        // Mostrar el modal
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevenir scroll

        // Añadir clase show para animación
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
    } catch (error) {
        console.error('Error al abrir el modal del carrito:', error);
        alert('Hubo un error al abrir el carrito. Por favor, intenta de nuevo.');
    }
}

// Función para cerrar la modal del carrito
function closeCartModal() {
    const modal = document.getElementById('cart-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = ''; // Restaurar scroll
    }
}

// Función para renderizar los items del carrito
function renderCartItems() {
    console.log('Renderizando items del carrito');

    // Obtener el contenedor de items
    const cartItemsContainer = document.getElementById('cart-items');
    if (!cartItemsContainer) {
        console.error('Error: No se encontró el contenedor de items del carrito (#cart-items)');
        return;
    }

    // Limpiar el contenedor
    cartItemsContainer.innerHTML = '';

    // Si el carrito está vacío, mostrar mensaje
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Tu carrito está vacío</p>
            </div>
        `;

        // Actualizar el total
        const totalElement = document.getElementById('cart-total-price');
        if (totalElement) {
            totalElement.textContent = '$0.00';
        }

        return;
    }

    // Calcular el total
    let total = 0;

    // Renderizar cada item
    cart.forEach((item, index) => {
        total += item.price * item.guests;

        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <div class="cart-item-info">
                <h3>${item.name}</h3>
                <p>Fecha: ${item.date || 'No especificada'}</p>
                <p>Personas: ${item.guests}</p>
                <p>Precio: $${item.price.toFixed(2)} MXN</p>
            </div>
            <div class="cart-item-actions">
                <button class="edit-item-btn" data-index="${index}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="remove-item-btn" data-index="${index}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;

        cartItemsContainer.appendChild(itemElement);
    });

    // Actualizar el total
    const totalElement = document.getElementById('cart-total-price');
    if (totalElement) {
        totalElement.textContent = `$${total.toFixed(2)} MXN`;
    } else {
        console.error('Error: No se encontró el elemento del total (#cart-total-price)');
    }

    // Agregar event listeners a los botones de editar y eliminar
    const editButtons = document.querySelectorAll('.edit-item-btn');
    const removeButtons = document.querySelectorAll('.remove-item-btn');

    editButtons.forEach(button => {
        button.addEventListener('click', function () {
            const index = parseInt(this.getAttribute('data-index'));
            openEditModal(index);
        });
    });

    removeButtons.forEach(button => {
        button.addEventListener('click', function () {
            const index = parseInt(this.getAttribute('data-index'));
            if (confirm('¿Estás seguro de que deseas eliminar este item?')) {
                removeCartItem(index);
            }
        });
    });
}

// Función para abrir el modal de edición
function openEditModal(index) {
    const item = cart[index];
    if (!item) return;

    // Crear el modal de edición
    const editModal = document.createElement('div');
    editModal.className = 'edit-modal';
    editModal.id = 'edit-modal';

    // Convertir la fecha actual a formato YYYY-MM-DD si es posible
    let currentDate = '';
    try {
        if (item.date) {
            // Intentar extraer la fecha del formato "día de mes del año"
            const dateRegex = /(\d+)\s+de\s+(\w+)\s+del\s+(\d+)/;
            const match = item.date.match(dateRegex);

            if (match) {
                const day = parseInt(match[1]);
                const monthAbbr = match[2].toLowerCase();
                const year = parseInt(match[3]);

                // Mapeo de abreviaturas de mes a números
                const monthMap = {
                    'ene': 0, 'feb': 1, 'mar': 2, 'abr': 3, 'may': 4, 'jun': 5,
                    'jul': 6, 'ago': 7, 'sep': 8, 'oct': 9, 'nov': 10, 'dic': 11
                };

                if (day && monthMap[monthAbbr] !== undefined && year) {
                    const date = new Date(year, monthMap[monthAbbr], day);
                    currentDate = date.toISOString().split('T')[0];
                }
            }
        }
    } catch (e) {
        console.error('Error al parsear la fecha:', e);
        currentDate = '';
    }

    // Contenido del modal
    editModal.innerHTML = `
        <div class="edit-modal-content">
            <div class="edit-modal-header">
                <h3>Editar Paquete: ${item.name}</h3>
                <span class="edit-modal-close">&times;</span>
            </div>
            <div class="edit-modal-body">
                <div class="edit-form-group">
                    <label for="edit-guests">Número de personas:</label>
                    <div class="edit-guests-control">
                        <button class="edit-guests-btn decrease">-</button>
                        <input type="number" id="edit-guests" min="1" value="${item.guests}">
                        <button class="edit-guests-btn increase">+</button>
                    </div>
                </div>
                <div class="edit-form-group">
                    <label for="edit-date">Fecha del viaje:</label>
                    <input type="date" id="edit-date" value="${currentDate}" min="${getTodayDate()}">
                </div>
            </div>
            <div class="edit-modal-footer">
                <button class="edit-cancel-btn">Cancelar</button>
                <button class="edit-save-btn">Guardar cambios</button>
            </div>
        </div>
    `;

    // Agregar el modal al DOM
    document.body.appendChild(editModal);

    // Mostrar el modal con animación
    setTimeout(() => {
        editModal.classList.add('show');
    }, 10);

    // Event listeners para el modal
    const closeBtn = editModal.querySelector('.edit-modal-close');
    const cancelBtn = editModal.querySelector('.edit-cancel-btn');
    const saveBtn = editModal.querySelector('.edit-save-btn');
    const decreaseBtn = editModal.querySelector('.edit-guests-btn.decrease');
    const increaseBtn = editModal.querySelector('.edit-guests-btn.increase');
    const guestsInput = editModal.querySelector('#edit-guests');
    const dateInput = editModal.querySelector('#edit-date');

    // Función para cerrar el modal
    function closeEditModal() {
        editModal.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(editModal);
        }, 300);
    }

    // Event listeners para los botones de control de huéspedes
    decreaseBtn.addEventListener('click', function () {
        const currentValue = parseInt(guestsInput.value);
        if (currentValue > 1) {
            guestsInput.value = currentValue - 1;
        }
    });

    increaseBtn.addEventListener('click', function () {
        const currentValue = parseInt(guestsInput.value);
        guestsInput.value = currentValue + 1;
    });

    // Event listeners para cerrar el modal
    closeBtn.addEventListener('click', closeEditModal);
    cancelBtn.addEventListener('click', closeEditModal);

    // Event listener para guardar cambios
    saveBtn.addEventListener('click', function () {
        const newGuests = parseInt(guestsInput.value);
        const newDateValue = dateInput.value;

        if (isNaN(newGuests) || newGuests < 1) {
            alert('Por favor ingrese un número válido de personas (mínimo 1).');
            return;
        }

        // Actualizar el número de personas
        const basePrice = item.price / item.guests; // Precio por persona
        item.guests = newGuests;
        item.price = basePrice * newGuests;

        // Actualizar la fecha si se seleccionó una nueva
        if (newDateValue) {
            const newDate = new Date(newDateValue);
            item.date = formatDateCorrectly(newDate);
        }

        // Guardar cambios y actualizar vista
        saveCart();
        renderCartItems();
        closeEditModal();
    });
}

// Función para eliminar un item del carrito
function removeCartItem(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartCounter();
    renderCartItems();
}

// Función para vaciar el carrito
function clearCart() {
    cart = [];
    saveCart();
    updateCartCounter();
    renderCartItems();

    // Reiniciar el temporizador
    cartTimerStart = null;
    localStorage.removeItem('cartTimerStart');

    // Limpiar el intervalo si existe
    if (window.cartTimerInterval) {
        clearInterval(window.cartTimerInterval);
        window.cartTimerInterval = null;
    }

    // Actualizar la visualización del temporizador
    const timerElement = document.getElementById('cart-timer');
    if (timerElement) {
        timerElement.innerHTML = '<i class="fas fa-clock"></i> 03:00:00';
    }
}

// Función para proceder al pago
function proceedToCheckout() {
    if (cart.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }

    // Mostrar estado de carga en el botón
    const checkoutButton = document.getElementById('checkout-button-1');
    if (!checkoutButton) {
        console.error('No se encontró el botón de checkout');
        return;
    }

    const originalText = checkoutButton.innerHTML;
    checkoutButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
    checkoutButton.disabled = true;

    try {
        // Calcular el total del carrito
        const cartTotal = cart.reduce((total, item) => total + (item.price * item.guests), 0);
        console.log('Total del carrito a cobrar:', cartTotal);

        // Usar la misma URL del servidor que en stripe.js
        const serverUrl = "http://localhost:3000";
        console.log(`Enviando solicitud de pago a ${serverUrl}/crear-sesion-pago`);

        // Crear un resumen de los items del carrito para la descripción
        const itemsSummary = cart.map(item =>
            `${item.name} (${item.guests} personas)`
        ).join(', ');

        // Hacer la solicitud para crear una sesión de pago
        fetch(`${serverUrl}/crear-sesion-pago`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                productName: "Paquetes Cuna de Sabores",
                description: itemsSummary,
                amount: Math.round(cartTotal * 100), // Convertir a centavos para Stripe
                quantity: 1,
                successUrl: `${window.location.origin}/components/success.html`,
                cancelUrl: `${window.location.origin}/components/cancel.html`
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error en la respuesta del servidor: ${response.status} - ${response.statusText}`);
                }
                return response.json();
            })
            .then(session => {
                console.log("Sesión de pago creada:", session);
                // Redirigir a la página de pago de Stripe
                return stripe.redirectToCheckout({ sessionId: session.id });
            })
            .then(result => {
                if (result.error) {
                    throw new Error(result.error.message);
                }
            })
            .catch(error => {
                console.error("Error al procesar el pago:", error);
                alert("Hubo un error al procesar tu pago. Por favor, intenta de nuevo.");
                // Restaurar el botón
                checkoutButton.innerHTML = originalText;
                checkoutButton.disabled = false;
            });
    } catch (error) {
        console.error("Error al preparar el pago:", error);
        alert("Hubo un error al preparar tu pago. Por favor, intenta de nuevo.");
        // Restaurar el botón
        checkoutButton.innerHTML = originalText;
        checkoutButton.disabled = false;
    }
}

function redirectToWhatsApp() {
    // Número de teléfono (incluir código de país sin el +)
    const phoneNumber = "5217971314809"; // Reemplaza con el número correcto (797-131-4809 con código de México)

    // Mensaje predefinido (debe estar codificado para URL)
    const message = encodeURIComponent("Me gustaría recibir orientación para hacer la reservación de mi paquete de viaje");

    // Crear la URL de WhatsApp
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${message}`;

    // Abrir WhatsApp en una nueva pestaña
    window.open(whatsappURL, '_blank');
}

// Inicializar Stripe (asegúrate de que el script de Stripe esté cargado)
document.addEventListener('DOMContentLoaded', function () {
    // Verificar si Stripe ya está definido globalmente
    if (typeof stripe === 'undefined' && typeof Stripe !== 'undefined') {
        // Solo definir stripe si no existe ya
        window.stripe = Stripe("pk_test_51R7T02BgNkeedNhqYOkFSgPQScP44f2vXamBXFcBdaybvR8rngwdW5lQoXFDEWzwr0rKmgEDFZhoSt0Gg5CMpWYs00XHLgs4Zo");
    } else if (typeof stripe === 'undefined' && typeof Stripe === 'undefined') {
        console.error("Stripe no está definido. Asegúrate de incluir el script de Stripe.");
    }

    // Agregar event listener para el botón de pago en el carrito
    const checkoutCartBtn = document.getElementById('checkout-button-1');
    if (checkoutCartBtn) {
        checkoutCartBtn.addEventListener('click', proceedToCheckout);
    } else {
        console.log('Nota: No se encontró el elemento #checkout-button-1');
    }

    // Agregar event listener para el botón de WhatsApp
    const whatsappBtn = document.getElementById('checkout-button-3');
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', function () {
            const phoneNumber = '5217971314809';
            const message = 'Hola, me gustaría recibir asesoría sobre los paquetes de Cuna de Sabores.';
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        });
    } else {
        console.log('Nota: No se encontró el elemento #checkout-button-3');
    }
});