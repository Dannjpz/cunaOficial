const express = require('express');
const Stripe = require('stripe');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Stripe with your secret key
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Enable CORS for all routes
app.use(cors());

// Middleware to parse JSON and serve static files
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Log all incoming requests for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Route to create a checkout session
app.post('/crear-sesion-pago', async (req, res) => {
  try {
    console.log('Creating checkout session...');
    
    // Get product details from request body or use defaults
    const { productName = 'Experiencia Gastronómica', amount = 150000, quantity = 1 } = req.body;
    
    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'mxn',
            product_data: {
              name: productName,
              description: 'Experiencia gastronómica única en Cuna de Sabores',
            },
            unit_amount: amount,
          },
          quantity: quantity,
        },
      ],
      mode: 'payment',
      success_url: `${req.protocol}://${req.get('host')}/components/success.html`,
      cancel_url: `${req.protocol}://${req.get('host')}/components/cancel.html`,
    });
    
    // Return the session ID
    console.log('Session created:', session.id);
    res.json({ id: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error.message });
  }
});

// Catch-all route to handle SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`POST endpoint available at http://localhost:${PORT}/crear-sesion-pago`);
});