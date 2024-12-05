import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabase } from '@/lib/supabase/client';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = headers().get('stripe-signature') as string;

    let event: any;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        webhookSecret!
      );
    } catch (err) {
      return new NextResponse(`Webhook Error: ${err instanceof Error ? err.message : 'Unknown Error'}`, { status: 400 });
    }

    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        // Update payment status in database
        const { error } = await supabase
          .from('payments')
          .update({ 
            status: 'completed',
            paid_date: new Date().toISOString(),
          })
          .eq('stripe_payment_id', paymentIntent.id);

        if (error) throw error;
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        // Update payment status in database
        await supabase
          .from('payments')
          .update({ status: 'failed' })
          .eq('stripe_payment_id', failedPayment.id);
        break;
    }

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new NextResponse('Webhook error', { status: 400 });
  }
}