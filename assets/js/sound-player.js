document.addEventListener('DOMContentLoaded', function() {
    // Crear elemento de audio
    const backgroundSound = new Audio('../sonidos/calma.mp3');
    
    // Configurar propiedades
    backgroundSound.volume = 0.3; // Volumen al 50%
    backgroundSound.loop = true; // No repetir automáticamente
    
    // Función para reproducir el sonido
    function playBackgroundSound() {
        // Intentar reproducir el sonido
        backgroundSound.play().catch(error => {
            // Si falla la reproducción automática, intentamos de nuevo después de una interacción del usuario
            console.log('Reproducción automática bloqueada por el navegador:', error);
            
            // Añadir un listener de eventos para reproducir el sonido después de cualquier interacción
            const playAfterInteraction = function() {
                backgroundSound.play();
                // Eliminar todos los event listeners una vez que se reproduzca
                document.removeEventListener('click', playAfterInteraction);
                document.removeEventListener('touchstart', playAfterInteraction);
                document.removeEventListener('keydown', playAfterInteraction);
                document.removeEventListener('scroll', playAfterInteraction);
            };
            
            // Escuchar varios tipos de interacciones
            document.addEventListener('click', playAfterInteraction);
            document.addEventListener('touchstart', playAfterInteraction);
            document.addEventListener('keydown', playAfterInteraction);
            document.addEventListener('scroll', playAfterInteraction);
        });
    }
    
    // Reproducir sonido después de 3 segundos
    setTimeout(playBackgroundSound, 1000);
});