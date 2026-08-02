import express from 'express';
import { stripe } from '../config/stripe';
import { supabaseAdmin } from '../db/SupabaseConnection';


const router = express.Router();


router.post('/', express.raw({ type: 'application/json' }), async (req, res) => {

  const sig = req.headers['stripe-signature'];
  let event;



  try {

    event = stripe.webhooks.constructEvent(

      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET

    );

  } catch (err) {
    console.error(` Fallo en verificación de firma del Webhook: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }



  if (event.type === 'checkout.session.completed') {

    const session = event.data.object;
    const userId = session.client_reference_id || session.metadata?.userId;
    const plan = session.metadata?.plan;


    if (userId) {

      //console.log(`Pago recibido para el usuario: ${userId}`);

      const { error } = await supabaseAdmin
        .from('suscriptores')
        .update({

          estado: 'activo',
          plan: plan,
          creditos_disponibles: plan === 'basico' ? 5 : 10,

        })
        .eq('id', userId);

      if (error) {

        console.error(' Error actualizando estado en Supabase:', error);
        return res.status(500).send('Error interno actualizando BD.');

      }
      console.log(` Suscriptor ${userId} activado con éxito en plan ${plan}`);
    }

  }

  res.status(200).json({ received: true });

});



export default router; 

