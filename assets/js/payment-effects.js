document.addEventListener('DOMContentLoaded', function() {
    // Referencia al botón de checkout
    const checkoutButton = document.getElementById('checkout-button');
    const paymentCard = document.querySelector('.payment-card');
    
    if (!checkoutButton || !paymentCard) return;
    
    // Efecto de pulsación al hacer clic en el botón
    checkoutButton.addEventListener('mousedown', function() {
        this.style.transform = 'scale(0.98)';
    });
    
    checkoutButton.addEventListener('mouseup', function() {
        this.style.transform = 'scale(1)';
    });
    
    // Efecto de brillo al pasar el mouse sobre la tarjeta
    paymentCard.addEventListener('mousemove', function(e) {
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
    paymentCard.addEventListener('mouseleave', function() {
        this.style.background = 'rgba(255, 255, 255, 0.05)';
        this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
    
    // Animación de entrada
    function animatePaymentSection() {
        const paymentSection = document.getElementById('payment-section');
        if (!paymentSection) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    paymentCard.style.opacity = '1';
                    paymentCard.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.2 });
        
        observer.observe(paymentSection);
    }
    
    // Inicializar la tarjeta con opacidad 0 y desplazada
    paymentCard.style.opacity = '0';
    paymentCard.style.transform = 'translateY(30px)';
    paymentCard.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    
    // Iniciar animación
    animatePaymentSection();
});