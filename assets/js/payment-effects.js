document.addEventListener('DOMContentLoaded', function() {
    // Referencia a todos los botones de checkout
    const checkoutButtons = document.querySelectorAll('.checkout-btn');
    const paymentCards = document.querySelectorAll('.payment-card');
    
    if (!paymentCards.length) return;
    
    // Aplicar efectos a todos los botones
    checkoutButtons.forEach(button => {
        // Efecto de pulsación al hacer clic en el botón
        button.addEventListener('mousedown', function() {
            this.style.transform = 'scale(0.98)';
        });
        
        button.addEventListener('mouseup', function() {
            this.style.transform = 'scale(1)';
        });
        
        // Si el botón tiene la clase open-cart-btn, añadir evento para abrir el carrito
        if (button.classList.contains('open-cart-btn')) {
            button.addEventListener('click', function(event) {
                event.preventDefault();
                // Verificar si la función openCartModal está disponible
                if (typeof openCartModal === 'function') {
                    openCartModal(event);
                } else {
                    console.error('La función openCartModal no está disponible');
                }
            });
        }
    });
    
    // Aplicar efectos a todas las tarjetas
    paymentCards.forEach(card => {
        // Efecto de brillo al pasar el mouse sobre la tarjeta
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left; // Posición X del mouse dentro de la tarjeta
            const y = e.clientY - rect.top;  // Posición Y del mouse dentro de la tarjeta
            
            // Calcular la posición relativa (0-1)
            const xPercent = x / rect.width;
            const yPercent = y / rect.height;
            
            // Aplicar efecto de gradiente basado en la posición del mouse
            this.style.background = `
                radial-gradient(
                    circle at ${xPercent * 100}% ${yPercent * 100}%, 
                    rgba(255, 255, 255, 0.1), 
                    rgba(255, 255, 255, 0.05) 40%
                ),
                rgba(255, 255, 255, 0.05)
            `;
            
            // Efecto de rotación 3D sutil
            const rotateX = (yPercent - 0.5) * 5; // -2.5 a 2.5 grados
            const rotateY = (0.5 - xPercent) * 5; // -2.5 a 2.5 grados
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });
        
        // Restaurar al salir el mouse
        card.addEventListener('mouseleave', function() {
            this.style.background = 'rgba(255, 255, 255, 0.05)';
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
    
    // Animación de entrada
    function animatePaymentSection() {
        const paymentSection = document.getElementById('payment-section');
        if (!paymentSection) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Animar todas las tarjetas con un pequeño retraso entre ellas
                    paymentCards.forEach((card, index) => {
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, index * 150); // 150ms de retraso entre cada tarjeta
                    });
                    observer.disconnect();
                }
            });
        }, { threshold: 0.2 });
        
        observer.observe(paymentSection);
    }
    
    // Iniciar animación
    animatePaymentSection();
});