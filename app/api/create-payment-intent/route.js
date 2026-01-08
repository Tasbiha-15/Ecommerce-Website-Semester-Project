import { NextResponse } from 'next/server'
import Stripe from 'stripe'

// Initialize Stripe with Secret Key
// Prevent build crash if key is missing
const stripe = process.env.STRIPE_SECRET_KEY
    ? new Stripe(process.env.STRIPE_SECRET_KEY)
    : null;

export async function POST(request) {
    try {
        const { amount, currency = 'pkr' } = await request.json()

        if (!stripe) {
            console.error('Stripe Secret Key is missing')
            return NextResponse.json({ error: 'Stripe configuration missing' }, { status: 500 })
        }

        // Amount validation (should be handled by frontend/logic but good to double check)
        if (!amount || amount <= 0) {
            return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
        }

        // Create Payment Intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Stripe expects amount in smallest currency unit (e.g., cents/paisa)
            currency: currency,
            automatic_payment_methods: {
                enabled: true,
            },
        })

        return NextResponse.json({
            clientSecret: paymentIntent.client_secret,
        })
    } catch (error) {
        console.error('Stripe Payment Intent Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
