import express from 'express';
import { stripe } from '../config/stripe';
import { requireAuth } from '../middlewares/authMiddleware';


const router = express.Router();


router.post('/create-session', requireAuth, async (req, res) => {
    try {

        console.log("Petición de Checkout recibida para el usuario:", req.user?.id);

        const { plan } = req.body;
        const userId = req.user.id
        const userEmail = req.user.email

        let priceId;

        if(plan === 'basico'){
            priceId = process.env.STRIPE_PRICE_BASIC;
        }else if(plan === 'premium'){
            priceId = process.env.STRIPE_PRICE_PREMIUM;
        }else{
            return res.status(400).json({error: "Selected plan is not valid"})
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'subscription',
            customer_email: userEmail,
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            client_reference_id: userId,
            metadata: {
                userId,
                plan
            },
            success_url: `${process.env.FRONTEND_URL}/omega?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/#registro`
        })
        
        console.log(" Sesión de Stripe creada exitosamente:", session.url);

        return res.json({ url: session.url });

    } catch (error) {
        console.error("Error al crear la sesión de Stripe: ", error);
        return res.status(500).json({ 
            error: error.message || "Error interno del servidor al procesar el pago." 
        });
    }
})


export default router