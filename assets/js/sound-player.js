document.addEventListener('DOMContentLoaded', function() {
    // Crear elemento de audio
    const backgroundSound = new Audio('sonidos/calma.mp3');
    
    // Configurar propiedades
    backgroundSound.volume = 0.1; // Reducir volumen al 10%
    backgroundSound.loop = true; // Repetir automáticamente
    
    // Variable para controlar si el sonido ya se ha iniciado
    let soundStarted = false;
    
    // Función para reproducir el sonido
    function playBackgroundSound() {
        if (soundStarted) return;
        
        // Intentar reproducir el sonido
        backgroundSound.play()
            .then(() => {
                soundStarted = true;
                console.log('Sonido de fondo reproducido correctamente');
            })
            .catch(error => {
                console.log('Reproducción automática bloqueada por el navegador:', error);
                
                // No intentamos reproducir automáticamente, esperamos interacción del usuario
                createSoundButton();
            });
    }
    
    // Crear un botón para reproducir sonido después de interacción
    function createSoundButton() {
        const soundButton = document.createElement('button');
        soundButton.innerHTML = '<i class="fas fa-volume-up"></i>';
        soundButton.className = 'sound-control-btn';
        soundButton.title = 'Reproducir música de fondo';
        soundButton.style.position = 'fixed';
        soundButton.style.bottom = '20px';
        soundButton.style.left = '50px';  
        soundButton.style.zIndex = '1000';
        soundButton.style.background = 'rgba(255, 255, 255, 0.7)';
        soundButton.style.border = 'none';
        soundButton.style.borderRadius = '50%';
        soundButton.style.width = '50px';
        soundButton.style.height = '50px';
        soundButton.style.cursor = 'pointer';
        soundButton.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        
        soundButton.addEventListener('click', function() {
            if (!soundStarted) {
                backgroundSound.play()
                    .then(() => {
                        soundStarted = true;
                        this.innerHTML = '<i class="fas fa-volume-mute"></i>';
                        this.title = 'Pausar música de fondo';
                    })
                    .catch(error => {
                        console.error('Error al reproducir sonido:', error);
                    });
            } else {
                if (backgroundSound.paused) {
                    backgroundSound.play();
                    this.innerHTML = '<i class="fas fa-volume-mute"></i>';
                    this.title = 'Pausar música de fondo';
                } else {
                    backgroundSound.pause();
                    this.innerHTML = '<i class="fas fa-volume-up"></i>';
                    this.title = 'Reproducir música de fondo';
                }
            }
        });
        
        document.body.appendChild(soundButton);
    }
    
    // Esperar a que el usuario interactúe con la página
    const handleUserInteraction = function() {
        playBackgroundSound();
        // Eliminar los event listeners una vez que se intente reproducir
        document.removeEventListener('click', handleUserInteraction);
        document.removeEventListener('touchstart', handleUserInteraction);
        document.removeEventListener('keydown', handleUserInteraction);
        document.removeEventListener('scroll', handleUserInteraction);
    };
    
    // Escuchar varios tipos de interacciones
    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('touchstart', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);
    document.addEventListener('scroll', handleUserInteraction);
    
    // También intentamos reproducir después de 3 segundos por si acaso
    setTimeout(playBackgroundSound, 3000);
});