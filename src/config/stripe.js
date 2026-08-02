import Stripe from "stripe";
import dotenv from 'dotenv';

dotenv.config()

const StripeKey = process.env.STRIPE_SECRET_KEY

if(!StripeKey){
    throw new Error("There's not Stripe secret key")
}

export const stripe = new Stripe(StripeKey)