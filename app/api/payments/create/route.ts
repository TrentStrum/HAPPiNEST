import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { payments } from '@/lib/db/schema';

export async function POST(req: Request) {
  try {
    const { amount, leaseId } = await req.json();

    // Simulate payment processing without Stripe
    const payment = await db.insert(payments).values({
      leaseId,
      amount,
      status: 'pending',
      dueDate: new Date().toISOString(),
    }).returning().get();

    // Simulate async payment processing
    setTimeout(async () => {
      await db.update(payments)
        .set({ 
          status: 'completed',
          paidDate: new Date().toISOString()
        })
        .where(sql`id = ${payment.id}`)
        .run();
    }, 2000);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error creating payment:', error);
    return new NextResponse('Error creating payment', { status: 500 });
  }
}