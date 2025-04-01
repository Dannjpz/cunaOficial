
// Funcionalidad del carrito de compras
// Inicializar el carrito desde localStorage o crear uno nuevo
let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
let cartTimerStart = localStorage.getItem('cartTimerStart') || null;
let editPromotionShown = false;
let editPromotionAccepted = false;
let originalPackageDate = '';
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
        const timeLimit = 180 * 60; // 3 horas en segundos (cambiado de 30 minutos)
        const remaining = timeLimit - elapsed;

        // Si el tiempo ha expirado, vaciar el carrito
        if (remaining <= 0) {
            clearCart();
            timerElement.innerHTML = '<i class="fas fa-hourglass-end"></i> Tiempo expirado';
            return;
        }

        // Formatear el tiempo restante
        const hours = Math.floor(remaining / 3600);
        const minutes = Math.floor((remaining % 3600) / 60);
        const seconds = remaining % 60;
        const formattedTime = `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

        // Actualizar el contenido del temporizador
        timerElement.innerHTML = `<i class="fas fa-hourglass-half"></i> Reserva por: ${formattedTime}`;

        // Añadir clase de advertencia si queda poco tiempo
        if (remaining < 900) { // Menos de 15 minutos (cambiado de 5 minutos)
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
    const cartTotal = document.getElementById('cart-total');
    const cartTotalPrice = document.getElementById('cart-total-price');
    let totalPrice = 0;

    if (!cartItemsContainer) {
        console.error('Error: No se encontró el contenedor de items del carrito (#cart-items)');
        return;
    }

    // Limpiar el contenedor
    cartItemsContainer.innerHTML = '';
    // Si el carrito está vacío, mostrar mensaje
    if (cart.length === 0) {
        console.log('Carrito vacío, mostrando mensaje');
        cartItemsContainer.innerHTML = `
            <div class="empty-cart-message">
                <i class="fas fa-shopping-cart"></i>
                <p>Tu carrito está vacío</p>
                <p class="empty-cart-subtext">Agrega paquetes para comenzar tu aventura</p>
            </div>
        `;

        // Actualizar el total
        if (cartTotalPrice) {
            cartTotalPrice.textContent = '$0.00 MXN';
        }

        // Ocultar botones de checkout y clear si están presentes
        const checkoutBtn = document.getElementById('checkout-button-1');
        const clearCartBtn = document.getElementById('checkout-button-2');

        if (checkoutBtn) {
            checkoutBtn.style.display = 'none';
        }

        if (clearCartBtn) {
            clearCartBtn.style.display = 'none';
        }

        return;
    } else {
        // Mostrar botones si el carrito tiene items
        const checkoutBtn = document.getElementById('checkout-button-1');
        const clearCartBtn = document.getElementById('checkout-button-2');

        if (checkoutBtn) {
            checkoutBtn.style.display = 'block';
        }

        if (clearCartBtn) {
            clearCartBtn.style.display = 'block';
        }
    }
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
                <p>Precio: $${item.price.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN</p>
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
        totalElement.textContent = `$${total.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN`;
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
            removeCartItem(index); // Eliminamos el confirm
        });
    });
}
// Función para abrir el modal de edición
function openEditModal(index) {
    const item = cart[index];
    if (!item) return;
    // Guardar la fecha original del paquete
    originalPackageDate = item.date;
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
    // Reiniciar el estado de la promoción
    editPromotionShown = false;
    editPromotionAccepted = false;
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
                <div class="edit-form-group" id="edit-date-container">
                    <label for="edit-date">Fecha personalizada:</label>
                    <input type="date" id="edit-date" value="${currentDate}" min="${getTodayDate()}">
                </div>
                <div class="edit-form-group" id="original-date-container">
                    <label>Fecha del paquete:</label>
                    <div id="original-date-display" class="original-date">${item.date}</div>
                </div>
            </div>
            <div class="edit-modal-footer">
                <button class="edit-cancel-btn">Cancelar</button>
                <button class="edit-save-btn">Guardar cambios</button>
            </div>
        </div>
    `;
    // Crear el modal de promoción con el mismo estilo que el de los paquetes
    const promotionModal = document.createElement('div');
    promotionModal.id = 'edit-date-promotion';
    promotionModal.className = 'date-promotion';
    promotionModal.innerHTML = `
        <div class="date-promotion-content">
            <div class="date-promotion-title">¡Promoción Especial!</div>
            <div class="date-promotion-text">
                Para grupos de 10 o más personas, puedes elegir tu propia fecha de viaje.
                <br>Esta promoción te permite personalizar tu experiencia según tus necesidades.
            </div>
            <div class="date-promotion-buttons">
                <button type="button" class="promotion-btn accept-promotion accept-edit-promotion">Aceptar promoción</button>
                <button type="button" class="promotion-btn reject-promotion reject-edit-promotion">Rechazar promoción</button>
            </div>
        </div>
    `;
    // Agregar los modales al DOM
    document.body.appendChild(editModal);
    document.body.appendChild(promotionModal);
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
    const dateContainer = editModal.querySelector('#edit-date-container');
    const originalDateContainer = editModal.querySelector('#original-date-container');
    const promotionContainer = document.getElementById('edit-date-promotion');
    const acceptPromotionBtn = promotionContainer.querySelector('.accept-promotion');
    const rejectPromotionBtn = promotionContainer.querySelector('.reject-promotion');
    updateEditDateVisibilityInModal(item.guests, dateContainer, originalDateContainer, promotionContainer, dateInput);
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
            updateEditDateVisibilityInModal(parseInt(guestsInput.value), dateContainer, originalDateContainer, promotionContainer, dateInput);
        }
    });
    increaseBtn.addEventListener('click', function () {
        const currentValue = parseInt(guestsInput.value);
        if (currentValue < 25) {
            guestsInput.value = currentValue + 1;
            updateEditDateVisibilityInModal(parseInt(guestsInput.value), dateContainer, originalDateContainer, promotionContainer, dateInput);
        }
    });
    // Event listener para cambios directos en el input
    guestsInput.addEventListener('change', function () {
        updateEditDateVisibilityInModal(parseInt(this.value), dateContainer, originalDateContainer, promotionContainer, dateInput);
    });
    // Event listeners para los botones de promoción
    if (acceptPromotionBtn) {
        acceptPromotionBtn.addEventListener('click', function () {
            editPromotionAccepted = true;
            editPromotionShown = true;
            promotionContainer.style.display = 'none';
            dateContainer.style.display = 'block';
            originalDateContainer.style.display = 'none';
            dateInput.disabled = false;
            // Establecer la fecha actual como valor predeterminado si no hay una fecha seleccionada
            if (!dateInput.value) {
                dateInput.value = getTodayDate();
            }
        });
    }
    if (rejectPromotionBtn) {
        rejectPromotionBtn.addEventListener('click', function () {
            editPromotionAccepted = false;
            editPromotionShown = true;
            promotionContainer.style.display = 'none';
            dateContainer.style.display = 'none';
            originalDateContainer.style.display = 'block';
            dateInput.disabled = true;
        });
    }
    // Event listeners para cerrar el modal
    closeBtn.addEventListener('click', function () {
        editModal.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(editModal);
            if (document.body.contains(promotionContainer)) {
                document.body.removeChild(promotionContainer);
            }
        }, 300);
    });
    cancelBtn.addEventListener('click', function () {
        editModal.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(editModal);
            if (document.body.contains(promotionContainer)) {
                document.body.removeChild(promotionContainer);
            }
        }, 300);
    });
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
        item.price = basePrice * newGuests; // Actualizar el precio total basado en el número de personas
        // Actualizar la fecha solo si se aceptó la promoción y hay 10 o más personas
        if ((newGuests >= 10 && editPromotionAccepted) && newDateValue) {
            const newDate = new Date(newDateValue);
            item.date = formatDateCorrectly(newDate);
        } else {
            // Mantener la fecha original
            item.date = originalPackageDate;
        }
        // Guardar cambios y actualizar vista
        saveCart();
        renderCartItems();
        // Cerrar el modal
        editModal.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(editModal);
            if (document.body.contains(promotionContainer)) {
                document.body.removeChild(promotionContainer);
            }
        }, 300);
    });
}
// Función para actualizar la visibilidad del selector de fecha en el modal de edición
function updateEditDateVisibilityInModal(guestsCount, dateContainer, originalDateContainer, promotionContainer, dateInput) {
    if (guestsCount < 10) {
        // Reiniciar el estado si bajan de 10 personas
        editPromotionShown = false;
        editPromotionAccepted = false;
        // Mostrar la fecha original y ocultar el selector de fecha
        dateContainer.style.display = 'none';
        originalDateContainer.style.display = 'block';
        promotionContainer.style.display = 'none';
        // Deshabilitar el input de fecha
        dateInput.disabled = true;
    } else if (guestsCount === 10 && !editPromotionShown) {
        // Mostrar promoción para 10 personas
        promotionContainer.style.display = 'flex'; // Cambiado a flex para centrar el contenido
        editPromotionShown = true;
        // Ocultar tanto el selector como la fecha original hasta que decidan
        dateContainer.style.display = 'none';
        originalDateContainer.style.display = 'none';
    } else if (guestsCount > 10) {
        // Para más de 10 personas, depende de si aceptaron la promoción
        promotionContainer.style.display = 'none';
        if (editPromotionAccepted) {
            // Si aceptaron, mostrar el selector de fecha
            dateContainer.style.display = 'block';
            originalDateContainer.style.display = 'none';
            dateInput.disabled = false;
        } else {
            // Si rechazaron, mostrar la fecha original
            dateContainer.style.display = 'none';
            originalDateContainer.style.display = 'block';
            dateInput.disabled = true;
        }
    }
}
function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
function saveEditedItem(event) {
    event.preventDefault();
    const form = document.getElementById('edit-item-form');
    const itemIndex = parseInt(form.getAttribute('data-item-index'));
    const editGuests = document.getElementById('edit-guests');
    const editDate = document.getElementById('edit-date');
    // Obtener los valores actualizados
    const newGuests = parseInt(editGuests.value);
    // Actualizar el número de personas
    cart[itemIndex].guests = newGuests;
    // Actualizar la fecha solo si se aceptó la promoción y hay 10 o más personas
    if ((newGuests >= 10 && editPromotionAccepted) && editDate.value) {
        // Convertir la fecha del formato "YYYY-MM-DD" a "DD de MMM del YYYY"
        const dateObj = new Date(editDate.value);
        const formattedDate = formatDateCorrectly(dateObj);
        cart[itemIndex].guests = newGuests;
        cart[itemIndex].date = formattedDate;
    } else {
        // Mantener la fecha original
        cart[itemIndex].date = originalPackageDate;
    }
    // Actualizar el precio total basado en el número de personas
    const basePrice = cart[itemIndex].price / (cart[itemIndex].guests - newGuests || 1);
    cart[itemIndex].price = basePrice * newGuests;
    // Guardar el carrito actualizado
    saveCart();
    // Cerrar el modal y actualizar la vista
    closeEditModal();
    renderCartItems();
}
// Función para renderizar el modal de edición (si no existe ya en el HTML)
function createEditModal() {
    // Verificar si el modal ya existe
    if (document.getElementById('edit-item-modal')) {
        return;
    }
    const modalHTML = `
        <div id="edit-item-modal" class="cart-modal">
            <div class="cart-modal-content edit-modal-content">
                <div class="cart-modal-header">
                    <h2>Editar Paquete</h2>
                    <span class="edit-close">&times;</span>
                </div>
                <div class="cart-modal-body">
                    <form id="edit-item-form" data-item-index="">
                        <div class="edit-form-group">
                            <label for="edit-guests">Número de personas:</label>
                            <div class="edit-guests-container">
                                <button type="button" class="edit-guests-btn decrease-edit-guests">-</button>
                                <input type="number" id="edit-guests" min="1" max="25" value="1">
                                <button type="button" class="edit-guests-btn increase-edit-guests">+</button>
                            </div>
                        </div>
                        
                        <div class="edit-form-group" id="edit-date-container">
                            <label for="edit-date">Fecha personalizada:</label>
                            <input type="date" id="edit-date" value="" min="${getTodayDate()}">
                        </div>
                        
                        <div class="edit-form-group" id="original-date-container">
                            <label>Fecha del paquete:</label>
                            <div id="original-date-display" class="original-date"></div>
                        </div>
                        
                        <button type="submit" class="edit-save-btn">Guardar cambios</button>
                    </form>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    // Agregar event listeners
    const closeBtn = document.querySelector('.edit-close');
    const form = document.getElementById('edit-item-form');
    const decreaseBtn = document.querySelector('.decrease-edit-guests');
    const increaseBtn = document.querySelector('.increase-edit-guests');
    const guestsInput = document.getElementById('edit-guests');
    closeBtn.addEventListener('click', closeEditModal);
    form.addEventListener('submit', saveEditedItem);
    // Botones para aumentar/disminuir personas
    decreaseBtn.addEventListener('click', function () {
        if (guestsInput.value > 1) {
            guestsInput.value = parseInt(guestsInput.value) - 1;
            // Disparar evento change para actualizar la visibilidad de la fecha
            guestsInput.dispatchEvent(new Event('change'));
        }
    });
    increaseBtn.addEventListener('click', function () {
        if (guestsInput.value < 25) {
            guestsInput.value = parseInt(guestsInput.value) + 1;
            // Disparar evento change para actualizar la visibilidad de la fecha
            guestsInput.dispatchEvent(new Event('change'));
        }
    });
}
// Función para eliminar un item del carrito
function removeCartItem(index) {
    // Crear el modal de confirmación
    const confirmModal = document.createElement('div');
    confirmModal.className = 'confirm-delete-modal';
    confirmModal.innerHTML = `
        <div class="date-promotion-content">
            <div class="date-promotion-title">¿Estás seguro de perderte esta experiencia?</div>
            <div class="date-promotion-text">
                Al eliminar este paquete, perderás la oportunidad de disfrutar de esta increíble aventura.
            </div>
            <div class="date-promotion-buttons">
                <button class="promotion-btn reject-promotion confirm-no">No, conservar</button>
                <button class="promotion-btn accept-promotion confirm-yes">Sí, eliminar</button>
            </div>
        </div>
    `;

    // Agregar al DOM
    document.body.appendChild(confirmModal);

    // Mostrar con animación
    setTimeout(() => {
        confirmModal.classList.add('show');
    }, 10);

    // Event listeners para los botones
    const confirmYesBtn = confirmModal.querySelector('.confirm-yes');
    const confirmNoBtn = confirmModal.querySelector('.confirm-no');

    confirmYesBtn.addEventListener('click', function () {
        // Eliminar el item
        cart.splice(index, 1);
        saveCart();
        updateCartCounter();
        renderCartItems();

        // Cerrar el modal
        confirmModal.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(confirmModal);
        }, 300);
    });

    confirmNoBtn.addEventListener('click', function () {
        // Solo cerrar el modal
        confirmModal.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(confirmModal);
        }, 300);
    });
}

// Función para vaciar el carrito
function clearCart() {
    // Crear el modal de confirmación
    const confirmModal = document.createElement('div');
    confirmModal.className = 'confirm-delete-modal';
    confirmModal.innerHTML = `
        <div class="date-promotion-content">
            <div class="date-promotion-title">¿Estás seguro de borrar tu carrito?</div>
            <div class="date-promotion-text">
                Al eliminar tu carrito, perderás la oportunidad de disfrutar de esta increíble aventura.
            </div>
            <div class="date-promotion-buttons">
                <button class="promotion-btn reject-promotion confirm-no">No, conservar</button>
                <button class="promotion-btn accept-promotion confirm-yes">Sí, eliminar</button>
            </div>
        </div>
    `;

    // Agregar al DOM
    document.body.appendChild(confirmModal);

    // Mostrar con animación
    setTimeout(() => {
        confirmModal.classList.add('show');
    }, 10);

    // Event listeners para los botones
    const confirmYesBtn = confirmModal.querySelector('.confirm-yes');
    const confirmNoBtn = confirmModal.querySelector('.confirm-no');

    confirmYesBtn.addEventListener('click', function () {
        // Vaciar el carrito
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

        // Cerrar el modal
        confirmModal.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(confirmModal);
        }, 300);
    });

    confirmNoBtn.addEventListener('click', function () {
        // Solo cerrar el modal
        confirmModal.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(confirmModal);
        }, 300);
    });
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
