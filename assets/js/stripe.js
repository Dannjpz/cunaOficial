// Definir stripe como variable global si no existe ya
if (typeof window.stripe === 'undefined') {
    window.stripe = Stripe("pk_test_51R7T02BgNkeedNhqYOkFSgPQScP44f2vXamBXFcBdaybvR8rngwdW5lQoXFDEWzwr0rKmgEDFZhoSt0Gg5CMpWYs00XHLgs4Zo");
}

document.getElementById("checkout-button")?.addEventListener("click", async () => {
    try {
        // Show loading state
        const button = document.getElementById("checkout-button");
        if (!button) return;
        
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
        button.disabled = true;
        
        // Use the Express server URL instead of relative path
        const serverUrl = "http://localhost:3000";
        console.log(`Sending request to ${serverUrl}/crear-sesion-pago`);
        
        // Get cart data from localStorage if available
        let cart = [];
        let totalAmount = 0;
        
        try {
            cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
            
            if (cart.length > 0) {
                // Calcular el total del carrito
                totalAmount = cart.reduce((total, item) => total + (item.price * item.guests), 0);
                console.log("Total del carrito calculado:", totalAmount);
                
                // Enviar un solo item con el total del carrito
                const response = await fetch(`${serverUrl}/crear-sesion-pago`, { 
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        productName: "Paquetes Cuna de Sabores",
                        amount: Math.round(totalAmount * 100), // Convertir a centavos para Stripe
                        quantity: 1,
                        successUrl: `${window.location.origin}/components/success.html`,
                        cancelUrl: `${window.location.origin}/components/cancel.html`
                    })
                });
                
                console.log("Response status:", response.status);
                
                // Check if the response is ok
                if (!response.ok) {
                    throw new Error(`Error: ${response.status} - ${response.statusText}`);
                }
                
                // Parse the JSON response
                const session = await response.json();
                console.log("Session received:", session);
                console.log("Session ID:", session.id);
                
                // Redirect to Stripe checkout
                const result = await stripe.redirectToCheckout({ sessionId: session.id });
                
                // If redirectToCheckout fails, display the error
                if (result.error) {
                    throw new Error(result.error.message);
                }
            } else {
                // Si el carrito está vacío, usar el valor predeterminado
                const response = await fetch(`${serverUrl}/crear-sesion-pago`, { 
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        productName: "Experiencia Gastronómica",
                        amount: 150000, // 1500 MXN in cents
                        quantity: 1,
                        successUrl: `${window.location.origin}/components/success.html`,
                        cancelUrl: `${window.location.origin}/components/cancel.html`
                    })
                });
                
                // Resto del código para procesar la respuesta...
                console.log("Response status:", response.status);
                
                if (!response.ok) {
                    throw new Error(`Error: ${response.status} - ${response.statusText}`);
                }
                
                const session = await response.json();
                console.log("Session received:", session);
                
                const result = await stripe.redirectToCheckout({ sessionId: session.id });
                
                if (result.error) {
                    throw new Error(result.error.message);
                }
            }
        } catch (error) {
            console.error("Error processing payment:", error);
            
            // Show error message to user
            const paymentCard = document.querySelector('.payment-card');
            if (paymentCard) {
                const errorMessage = document.createElement('div');
                errorMessage.className = 'payment-error';
                errorMessage.innerHTML = `
                    <i class="fas fa-exclamation-circle"></i>
                    <p>Lo sentimos, ha ocurrido un error al procesar el pago. Por favor, inténtalo de nuevo más tarde o contacta con soporte.</p>
                    <p class="error-details">Detalles: ${error.message}</p>
                `;
                
                // Reset button
                button.innerHTML = originalText;
                button.disabled = false;
                
                // Add error message
                paymentCard.appendChild(errorMessage);
                
                // Remove error message after 8 seconds
                setTimeout(() => {
                    if (errorMessage.parentNode) {
                        errorMessage.parentNode.removeChild(errorMessage);
                    }
                }, 8000);
            } else {
                // If payment card not found, use alert as fallback
                alert(`Error al procesar el pago: ${error.message}`);
                
                // Reset button
                button.innerHTML = originalText;
                button.disabled = false;
            }
        }
    } catch (error) {
        console.error("Error general:", error);
        
        // Reset button
        const button = document.getElementById("checkout-button");
        if (button) {
            button.innerHTML = '<span>Pagar ahora</span><i class="fas fa-arrow-right"></i>';
            button.disabled = false;
        }
        
        // Show error as alert
        alert(`Error al procesar el pago: ${error.message}`);
    }
});

