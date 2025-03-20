document.addEventListener('DOMContentLoaded', function() {
    const sectionBoxes = document.querySelectorAll('.section-box');
    
    sectionBoxes.forEach(box => {
        let returnTimeouts = []; // Array to store timeout IDs
        
        // When mouse enters, clear any pending animations
        box.addEventListener('mouseenter', function() {
            // Clear all pending timeouts
            returnTimeouts.forEach(timeoutId => clearTimeout(timeoutId));
            returnTimeouts = [];
            
            // Remove returning classes if they exist
            box.classList.remove('returning-position');
            box.classList.remove('returning-cradle');
            box.classList.remove('returning-cradle-inverse');
            
            // Remove any inline styles that might be preventing expansion
            box.style.transform = '';
        });
        
        box.addEventListener('mouseleave', function() {
            // Primero, aplicamos la transición de regreso con la misma trayectoria
            box.classList.add('returning-position');
            
            // Después de un retraso, añadimos la animación de péndulo
            const cradleTimeout = setTimeout(() => {
                // Eliminamos la clase de posición para evitar conflictos
                box.classList.remove('returning-position');
                
                // Aplicamos la animación de péndulo (inversa)
                box.classList.add('returning-cradle-inverse');
                
                // Eliminamos la clase después de que termine la animación
                const cleanupTimeout = setTimeout(() => {
                    box.classList.remove('returning-cradle-inverse');
                    
                    // Restauramos la posición original después de la animación
                    // pero sin usar inline styles para permitir futuras expansiones
                    if (box.classList.contains('left-section')) {
                        box.classList.add('reset-left');
                    } else if (box.classList.contains('right-section')) {
                        box.classList.add('reset-right');
                    }
                    
                    // Eliminamos las clases de reset después de un breve momento
                    const resetTimeout = setTimeout(() => {
                        box.classList.remove('reset-left');
                        box.classList.remove('reset-right');
                    }, 100);
                    
                    returnTimeouts.push(resetTimeout);
                }, 2500); // Duración de la animación de péndulo
                
                returnTimeouts.push(cleanupTimeout);
            }, 3000); // Retraso antes de iniciar la animación de péndulo
            
            returnTimeouts.push(cradleTimeout);
        });
    });
});