const express = require('express');
const Stripe = require('stripe');
const User = require('../models/User');
const authenticateToken = require('../utils/authMiddleware');

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:8080';

const checkoutRoute = express.Router();
const webhookRoute = express.Router();

// 1. Create a checkout session
checkoutRoute.post('/create-checkout-session', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (user.isPremium) {
            return res.status(400).json({ message: 'You are already a Premium member' });
        }

        const sessionConfig = {
            payment_method_types: ['card'], // Apple Pay/Google Pay are included automatically within 'card' if the user's browser supports it
            mode: 'payment',
            customer_email: user.email,
            client_reference_id: user._id.toString(), // To identify user in webhook
            metadata: {
                userId: user._id.toString(),
            },
            line_items: [
                {
                    price_data: {
                        currency: 'eur',
                        product_data: {
                            name: 'MuscleMap Pro (Lifetime)',
                            description: 'Unlock all premium fitness intelligence features.',
                        },
                        unit_amount: 50, // 0.50 EUR (Note: Stripe might reject this minimum in live mode)
                    },
                    quantity: 1,
                },
            ],
            success_url: `${CLIENT_URL}/premium?success=true`,
            cancel_url: `${CLIENT_URL}/premium?canceled=true`,
        };

        const session = await stripe.checkout.sessions.create(sessionConfig);
        res.json({ id: session.id, url: session.url });
    } catch (error) {
        console.error('Stripe Checkout Error:', error);
        res.status(500).json({ message: error.message });
    }
});

// 2. Stripe Webhook Handler (Requires raw body)
webhookRoute.post('/', async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        console.error(`Webhook Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    try {
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;

            // Only grant premium if the payment was successful
            if (session.payment_status === 'paid') {
                const userId = session.metadata.userId;
                const customerId = session.customer || session.customer_details?.email;

                if (userId) {
                    await User.findByIdAndUpdate(userId, {
                        isPremium: true,
                        stripeCustomerId: customerId
                    });
                    console.log(`User ${userId} upgraded to Premium Lifetime!`);
                }
            }
        }
        res.send().end();
    } catch (err) {
        console.error('Error handling webhook event:', err);
        res.status(500).end();
    }
});

module.exports = { checkoutRoute, webhookRoute };
