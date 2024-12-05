import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabase } from '@/lib/supabase/client';

export async function POST(req: Request) {
  try {
    const { amount, leaseId, description } = await req.json();

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        leaseId,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Create payment record in database
    const { error } = await supabase.from('payments').insert([
      {
        lease_id: leaseId,
        amount,
        stripe_payment_id: paymentIntent.id,
        status: 'pending',
        due_date: new Date().toISOString(),
      },
    ]);

    if (error) throw error;

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating payment:', error);
    return new NextResponse('Error creating payment', { status: 500 });
  }
}