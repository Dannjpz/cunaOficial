document.addEventListener('DOMContentLoaded', function () {
    // Referencias a los elementos del DOM
    const startDateInputs = document.querySelectorAll('#start-date-header, #start-date-welcome');
    const endDateInputs = document.querySelectorAll('#end-date-header, #end-date-welcome');

    // Mantener registro de los calendarios activos
    let activeCalendar = null;

    // Configurar cada input de fecha
    startDateInputs.forEach(input => {
        setupDatePicker(input, true);
    });

    endDateInputs.forEach(input => {
        setupDatePicker(input, false);
    });

    function setupDatePicker(dateInput, isStartDate) {
        // Crear contenedor para el calendario si no existe
        let container = dateInput.closest('.date-picker-container');

        if (!container) {
            container = document.createElement('div');
            container.className = 'date-picker-container';
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

        // Configurar evento click para mostrar/ocultar el calendario
        dateInput.addEventListener('click', function (e) {
            e.preventDefault();

            // Cerrar cualquier calendario activo
            if (activeCalendar && activeCalendar !== calendarDropdown) {
                activeCalendar.classList.remove('active');
            }

            // Cerrar cualquier dropdown de invitados que esté abierto
            document.querySelectorAll('.guests-dropdown.active').forEach(dropdown => {
                dropdown.classList.remove('active');
            });

            toggleCalendar(calendarDropdown, dateInput, isStartDate);

            // Actualizar referencia al calendario activo
            if (calendarDropdown.classList.contains('active')) {
                activeCalendar = calendarDropdown;
            } else {
                activeCalendar = null;
            }
        });

        // Cerrar el calendario al hacer clic fuera
        document.addEventListener('click', function (e) {
            if (!container.contains(e.target) && calendarDropdown.classList.contains('active')) {
                calendarDropdown.classList.remove('active');
                activeCalendar = null;
            }
        });
    }

    function toggleCalendar(dropdown, input, isStartDate) {
        // Alternar visibilidad
        dropdown.classList.toggle('active');

        if (dropdown.classList.contains('active')) {
            // Limpiar contenido existente
            dropdown.innerHTML = '';

            // Obtener fechas relevantes
            const today = new Date();
            const selectedDate = input.value ? new Date(input.value) : null;
            const currentMonth = selectedDate ? selectedDate.getMonth() : today.getMonth();
            const currentYear = selectedDate ? selectedDate.getFullYear() : today.getFullYear();

            // Obtener la otra fecha (inicio o fin) para validación de rango
            const otherInputId = isStartDate ?
                input.id.replace('start-date', 'end-date') :
                input.id.replace('end-date', 'start-date');
            const otherInput = document.getElementById(otherInputId);
            const otherDate = otherInput && otherInput.value ? new Date(otherInput.value) : null;

            // Renderizar calendario
            renderCalendar(dropdown, currentMonth, currentYear, input, isStartDate, today, otherDate);
        }
    }

    function renderCalendar(dropdown, month, year, input, isStartDate, today, otherDate) {
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
            e.stopPropagation(); // Evitar que el clic cierre el calendario
            let newMonth = month - 1;
            let newYear = year;
            if (newMonth < 0) {
                newMonth = 11;
                newYear--;
            }

            // No permitir navegar a fechas anteriores a hoy para fecha de inicio
            if (isStartDate && newYear < today.getFullYear()) {
                return;
            }
            if (isStartDate && newYear === today.getFullYear() && newMonth < today.getMonth()) {
                return;
            }

            // Actualizar el calendario
            dropdown.innerHTML = '';
            renderCalendar(dropdown, newMonth, newYear, input, isStartDate, today, otherDate);
        });

        const nextBtn = document.createElement('button');
        nextBtn.className = 'calendar-nav-btn next';
        nextBtn.innerHTML = '&rarr;';
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Evitar que el clic cierre el calendario
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
                renderCalendar(dropdown, newMonth, newYear, input, isStartDate, today, otherDate);
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
        const firstDay = new Date(year, month, 1).getDay();

        // Obtener el número de días en el mes
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Calcular fechas límite
        const minDate = new Date();
        minDate.setHours(0, 0, 0, 0);

        const maxDate = new Date();
        maxDate.setFullYear(maxDate.getFullYear() + 2);

        // Añadir espacios en blanco para los días anteriores al primer día del mes
        for (let i = 0; i < firstDay; i++) {
            const emptyDay = document.createElement('div');
            daysGrid.appendChild(emptyDay);
        }

        // Añadir los días del mes
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElem = document.createElement('div');
            dayElem.className = 'calendar-day';
            dayElem.textContent = day;

            const currentDate = new Date(year, month, day);

            // Marcar el día actual
            if (currentDate.toDateString() === today.toDateString()) {
                dayElem.classList.add('today');
            }

            // Marcar el día seleccionado
            if (input.value && currentDate.toDateString() === new Date(input.value).toDateString()) {
                dayElem.classList.add('selected');
            }

            // Deshabilitar fechas pasadas para fecha de inicio
            if (isStartDate && currentDate < minDate) {
                dayElem.classList.add('disabled');
            }

            // Deshabilitar fechas anteriores a la fecha de inicio para fecha final
            if (!isStartDate && otherDate && currentDate < otherDate) {
                dayElem.classList.add('disabled');
            }

            // ELIMINAR ESTA VALIDACIÓN que estaba deshabilitando fechas posteriores
            // if (isStartDate && otherDate && currentDate > otherDate) {
            //   dayElem.classList.add('disabled');
            // }

            // Deshabilitar fechas posteriores a 2 años desde hoy
            if (currentDate > maxDate) {
                dayElem.classList.add('disabled');
            }

            // Marcar rango entre fechas seleccionadas
            if (otherDate && input.value) {
                const selectedDate = new Date(input.value);
                if (
                    (isStartDate && currentDate > selectedDate && currentDate < otherDate) ||
                    (!isStartDate && currentDate < selectedDate && currentDate > otherDate)
                ) {
                    dayElem.classList.add('range');
                }
            }

            // Evento click para seleccionar fecha
            dayElem.addEventListener('click', (e) => {
                e.stopPropagation(); // Evitar que el clic cierre el calendario

                if (!dayElem.classList.contains('disabled')) {
                    // Formatear fecha para el input
                    const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    input.value = formattedDate;

                    // Cerrar el calendario
                    dropdown.classList.remove('active');
                    activeCalendar = null;

                    // Disparar evento change para actualizar cualquier listener
                    const event = new Event('change', { bubbles: true });
                    input.dispatchEvent(event);
                }
            });

            daysGrid.appendChild(dayElem);
        }

        dropdown.appendChild(daysGrid);
    }

    // Validar fechas cuando cambien
    function validateDates() {
        startDateInputs.forEach(startInput => {
            const formId = startInput.closest('form').id;
            const endInputId = startInput.id.replace('start-date', 'end-date');
            const endInput = document.getElementById(endInputId);

            if (startInput.value && endInput && endInput.value) {
                const startDate = new Date(startInput.value);
                const endDate = new Date(endInput.value);

                if (startDate > endDate) {
                    endInput.value = startInput.value;
                    // Disparar evento change para actualizar cualquier listener
                    const event = new Event('change', { bubbles: true });
                    endInput.dispatchEvent(event);
                }
            }
        });
    }

    // Añadir listeners para validación
    startDateInputs.forEach(input => {
        input.addEventListener('change', validateDates);
    });

    endDateInputs.forEach(input => {
        input.addEventListener('change', validateDates);
    });

    // Inicializar con la fecha actual para los campos vacíos
    function initializeWithCurrentDate() {
        const today = new Date();
        const formattedToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

        startDateInputs.forEach(input => {
            if (!input.value) {
                input.value = formattedToday;
            }
        });

        // Para la fecha final, usar el 7 de diciembre del año actual
        const endOfYear = new Date();
        endOfYear.setMonth(11); // Diciembre (0-indexed)
        endOfYear.setDate(7);   // Día 7
        const formattedEndOfYear = `${endOfYear.getFullYear()}-12-07`;

        endDateInputs.forEach(input => {
            if (!input.value) {
                input.value = formattedEndOfYear;
            }
        });
    }

    // Inicializar fechas
    initializeWithCurrentDate();
});