// Funcionalidad del carrito de compras

// Inicializar el carrito desde localStorage o crear uno nuevo
let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
let cartTimerStart = localStorage.getItem('cartTimerStart') || null;
updateCartCounter();
initCartTimer();

// Event listeners
document.addEventListener('DOMContentLoaded', function () {
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
    }

    // Icono del carrito en la navegación (añadido)
    const cartIconNav = document.getElementById('cart-icon-nav');
    if (cartIconNav) {
        cartIconNav.addEventListener('click', function (event) {
            event.preventDefault(); // Prevenir el comportamiento predeterminado
            openCartModal(event);
        });
    }

    // Cerrar modal
    const closeBtn = document.querySelector('.cart-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeCartModal);
    }

    // Cerrar modal al hacer clic fuera
    window.addEventListener('click', function (event) {
        const modal = document.getElementById('cart-modal');
        if (event.target === modal) {
            closeCartModal();
        }
    });

    // Botón para vaciar carrito
    const clearCartBtn = document.getElementById('clear-cart-btn');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', clearCart);
    }

    // Botón para proceder al pago
    const checkoutBtn = document.getElementById('checkout-cart-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', proceedToCheckout);
    }

    // Renderizar carrito inicial
    renderCartItems();
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

// Inicializar el temporizador del carrito
// Inicializar el temporizador del carrito
function initCartTimer() {
    console.log('Inicializando temporizador del carrito');
    console.log('Estado actual: cart.length =', cart.length, 'cartTimerStart =', cartTimerStart);

    // Si hay items en el carrito pero no hay temporizador, iniciarlo
    if (cart.length > 0 && !cartTimerStart) {
        console.log('Hay items pero no hay temporizador, iniciando...');
        startCartTimer();
    }
    // Si hay temporizador, configurar el intervalo
    else if (cartTimerStart) {
        console.log('Hay temporizador existente, configurando intervalo...');

        // Verificar si el temporizador es válido
        const now = new Date().getTime();
        const startTime = parseInt(cartTimerStart);

        if (isNaN(startTime)) {
            console.log('Error: startTime no es un número válido, reiniciando temporizador');
            cartTimerStart = now.toString();
            localStorage.setItem('cartTimerStart', cartTimerStart);
        }

        // Verificar si el temporizador ha expirado
        const elapsed = now - startTime;
        const timeLimit = 3 * 60 * 60 * 1000; // 3 horas en milisegundos

        if (elapsed >= timeLimit) {
            console.log('Temporizador expirado, vaciando carrito');
            clearCart();
            return;
        }

        if (window.cartTimerInterval) {
            clearInterval(window.cartTimerInterval);
        }
        window.cartTimerInterval = setInterval(function () {
            updateCartTimer();
        }, 1000);

        // Forzar una actualización inmediata
        const timerElement = document.getElementById('cart-timer');
        if (timerElement) {
            const remaining = timeLimit - elapsed;
            const hours = Math.floor(remaining / (60 * 60 * 1000));
            const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
            const seconds = Math.floor((remaining % (60 * 1000)) / 1000);

            const formattedHours = String(hours).padStart(2, '0');
            const formattedMinutes = String(minutes).padStart(2, '0');
            const formattedSeconds = String(seconds).padStart(2, '0');

            timerElement.innerHTML = `<i class="fas fa-clock"></i> ${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
            console.log('Temporizador inicializado con:', `${formattedHours}:${formattedMinutes}:${formattedSeconds}`);
        }

        updateCartTimer();
    }
    // Si no hay items, reiniciar el temporizador
    else if (cart.length === 0) {
        console.log('No hay items, reiniciando temporizador');
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
}

// Actualizar el temporizador del carrito
function updateCartTimer() {
    // Buscar el elemento del temporizador cada vez que se actualiza
    // para asegurarnos de que estamos usando el elemento actual
    const timerElement = document.getElementById('cart-timer');
    
    if (!timerElement) {
        console.log('Elemento del temporizador no encontrado');
        return;
    }

    // Si no hay tiempo de inicio, mostrar 3 horas
    if (!cartTimerStart) {
        console.log('No hay tiempo de inicio');
        timerElement.innerHTML = '<i class="fas fa-clock"></i> 03:00:00';
        return;
    }

    const now = new Date().getTime();
    const startTime = parseInt(cartTimerStart);

    if (isNaN(startTime)) {
        console.log('Error: startTime no es un número válido:', cartTimerStart);
        return;
    }

    const elapsed = now - startTime;
    const timeLimit = 3 * 60 * 60 * 1000; // 3 horas en milisegundos
    const remaining = timeLimit - elapsed;

    console.log('Tiempo transcurrido:', Math.floor(elapsed / 1000), 'segundos, Tiempo restante:', Math.floor(remaining / 1000), 'segundos');

    if (remaining <= 0) {
        // Tiempo expirado, vaciar carrito
        console.log('Tiempo expirado, vaciando carrito');
        clearCart();
        timerElement.innerHTML = '<i class="fas fa-clock"></i> Tiempo expirado';
        return;
    }

    // Calcular horas, minutos y segundos restantes
    const hours = Math.floor(remaining / (60 * 60 * 1000));
    const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((remaining % (60 * 1000)) / 1000);

    // Formatear con ceros a la izquierda
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    // Actualizar el elemento del temporizador
    // Usar textContent en lugar de innerHTML para evitar problemas de renderizado
    const timerContent = `<i class="fas fa-clock"></i> ${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    
    // Verificar si el contenido ha cambiado antes de actualizar
    if (timerElement.innerHTML !== timerContent) {
        timerElement.innerHTML = timerContent;
        console.log('Temporizador actualizado:', `${formattedHours}:${formattedMinutes}:${formattedSeconds}`);
    }

    // Añadir clase de advertencia cuando quede poco tiempo
    if (remaining < 10 * 60 * 1000) { // menos de 10 minutos
        timerElement.classList.add('cart-timer-warning');
    } else {
        timerElement.classList.remove('cart-timer-warning');
    }
}

// Función para obtener la fecha actual en formato YYYY-MM-DD
function getTodayDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

// Función para formatear fecha para mostrar
function formatDate(date) {
    const day = date.getDate();
    const month = date.toLocaleString('es', { month: 'short' });
    return `${day} ${month}`;
}

function openCartModal(event) {
    if (event) {
        event.preventDefault(); // Asegurarse de prevenir el comportamiento predeterminado
    }
    const modal = document.getElementById('cart-modal');
    if (modal) {
        renderCartItems();

        // Primero, eliminar cualquier temporizador existente para evitar duplicados
        const existingTimer = document.getElementById('cart-timer');
        if (existingTimer) {
            existingTimer.remove();
        }

        // Buscar el lugar adecuado para insertar el temporizador
        let insertLocation = null;
        
        // Buscar el encabezado del modal o el título
        const modalHeader = modal.querySelector('.cart-modal-header');
        const modalTitle = modal.querySelector('.cart-modal-title, h2');
        
        if (modalHeader) {
            insertLocation = modalHeader;
            console.log('Insertando temporizador en el encabezado del modal');
        } else if (modalTitle) {
            // Crear un contenedor después del título
            const timerContainer = document.createElement('div');
            timerContainer.className = 'cart-timer-container';
            modalTitle.parentNode.insertBefore(timerContainer, modalTitle.nextSibling);
            insertLocation = timerContainer;
            console.log('Insertando temporizador después del título');
        } else {
            // Si no hay encabezado ni título, insertar al principio del modal
            const timerContainer = document.createElement('div');
            timerContainer.className = 'cart-timer-container';
            modal.insertBefore(timerContainer, modal.firstChild);
            insertLocation = timerContainer;
            console.log('Insertando temporizador al principio del modal');
        }
        
        // Crear el elemento del temporizador
        const timerElement = document.createElement('div');
        timerElement.id = 'cart-timer';
        timerElement.className = 'cart-timer';
        
        // Establecer el valor inicial del temporizador
        if (cart.length > 0 && cartTimerStart) {
            const now = new Date().getTime();
            const startTime = parseInt(cartTimerStart);
            
            if (!isNaN(startTime)) {
                const elapsed = now - startTime;
                const timeLimit = 3 * 60 * 60 * 1000; // 3 horas en milisegundos
                const remaining = timeLimit - elapsed;
                
                if (remaining > 0) {
                    // Calcular horas, minutos y segundos restantes
                    const hours = Math.floor(remaining / (60 * 60 * 1000));
                    const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
                    const seconds = Math.floor((remaining % (60 * 1000)) / 1000);
                    
                    // Formatear con ceros a la izquierda
                    const formattedHours = String(hours).padStart(2, '0');
                    const formattedMinutes = String(minutes).padStart(2, '0');
                    const formattedSeconds = String(seconds).padStart(2, '0');
                    
                    timerElement.innerHTML = `<i class="fas fa-clock"></i> ${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
                    console.log('Temporizador creado con tiempo restante:', `${formattedHours}:${formattedMinutes}:${formattedSeconds}`);
                    
                    // Añadir clase de advertencia cuando quede poco tiempo
                    if (remaining < 10 * 60 * 1000) { // menos de 10 minutos
                        timerElement.classList.add('cart-timer-warning');
                    }
                } else {
                    timerElement.innerHTML = '<i class="fas fa-clock"></i> Tiempo expirado';
                }
            } else {
                timerElement.innerHTML = '<i class="fas fa-clock"></i> 03:00:00';
            }
        } else {
            timerElement.innerHTML = '<i class="fas fa-clock"></i> 03:00:00';
        }
        
        // Insertar el temporizador en la ubicación determinada
        insertLocation.appendChild(timerElement);
        
        // Asegurarse de que el temporizador se actualice
        if (cart.length > 0) {
            if (!cartTimerStart) {
                startCartTimer();
            } else if (!window.cartTimerInterval) {
                window.cartTimerInterval = setInterval(function () {
                    updateCartTimer();
                }, 1000);
            }
            
            // Forzar una actualización inmediata del temporizador
            updateCartTimer();
        }

        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevenir scroll

        // Añadir clase show para animación
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
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
    const cartItemsContainer = document.getElementById('cart-items');
    if (!cartItemsContainer) return;

    // Limpiar contenedor
    cartItemsContainer.innerHTML = '';

    // Si el carrito está vacío
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart-message">
                <i class="fas fa-shopping-cart"></i>
                <p>Tu carrito está vacío</p>
            </div>
        `;
        document.getElementById('cart-total-amount').textContent = '$0 MXN';

        // Ocultar botones de acción si el carrito está vacío
        const cartActionButtons = document.querySelector('.cart-action-buttons');
        if (cartActionButtons) {
            cartActionButtons.style.display = 'none';
        }
        return;
    }

    // Calcular total
    let total = 0;

    // Renderizar cada item
    cart.forEach((item, index) => {
        const itemTotal = item.price;
        total += itemTotal;

        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">$${itemTotal.toFixed(2)} MXN</div>
                <div class="cart-item-guests">${item.guests} personas</div>
                ${item.date ? `<div class="cart-item-date">Fecha: ${item.date}</div>` : ''}
            </div>
            <div class="cart-item-actions">
                <button class="cart-item-edit-btn" data-index="${index}">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="cart-item-remove-btn" data-index="${index}">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        `;

        cartItemsContainer.appendChild(itemElement);

        // Agregar evento para eliminar item
        const removeBtn = itemElement.querySelector('.cart-item-remove-btn');
        removeBtn.addEventListener('click', function () {
            removeCartItem(index);
        });

        // Agregar evento para editar item
        const editBtn = itemElement.querySelector('.cart-item-edit-btn');
        if (editBtn) {
            editBtn.addEventListener('click', function () {
                openEditModal(index);
            });
        }
    });

    // Actualizar total
    document.getElementById('cart-total-amount').textContent = `$${total.toFixed(2)} MXN`;

    // Mostrar botones de acción si hay items en el carrito
    const cartActionButtons = document.querySelector('.cart-action-buttons');
    if (cartActionButtons) {
        cartActionButtons.style.display = 'flex';
    }
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

    // Aquí puedes redirigir a la página de pago o mostrar otra modal
    window.location.href = '/components/payment.html';
}

// Agregar estilos para el mensaje de confirmación y el temporizador
const style = document.createElement('style');
style.textContent = `
.cart-message {
    position: fixed;
    bottom: 30px;
    right: 30px;
    z-index: 1000;
    transform: translateY(100px);
    opacity: 0;
    transition: transform 0.3s ease, opacity 0.3s ease;
}

.cart-message.show {
    transform: translateY(0);
    opacity: 1;
}

.cart-message-content {
    background-color: #4caf50;
    color: white;
    padding: 15px 25px;
    border-radius: 5px;
    display: flex;
    align-items: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.cart-message-content i {
    margin-right: 10px;
    font-size: 1.2rem;
}

.cart-message-content p {
    margin: 0;
}

.cart-timer-container {
    display: flex;
    justify-content: center;
    margin: 15px 0;
    width: 100%;
}

.cart-timer {
    display: inline-block;
    padding: 10px 20px;
    background-color: #f8f9fa;
    border-radius: 4px;
    font-weight: bold;
    font-size: 1.2rem;
    color: #333;
    text-align: center;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    border: 1px solid #ddd;
    min-width: 150px;
    position: relative;
    z-index: 1000;
}

.cart-timer i {
    margin-right: 8px;
    color: #666;
}

.cart-timer-warning {
    color: #dc3545;
    animation: pulse 1s infinite;
    background-color: #fff3f3;
    border-color: #ffcccb;
}

@keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
}
`;
document.head.appendChild(style);
