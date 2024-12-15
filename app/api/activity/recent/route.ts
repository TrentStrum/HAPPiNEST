import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { Database } from '@/lib/supabase/database.types';

export async function GET(req: Request) {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore });

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user role from profiles
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    // Get recent maintenance tickets
    const { data: tickets } = await supabase
      .from('maintenance_tickets')
      .select(`
        id,
        title,
        status,
        created_at,
        units (
          unit_number,
          properties (name)
        )
      `)
      .order('created_at', { ascending: false })
      .limit(5);

    // Get recent payments
    const { data: payments } = await supabase
      .from('payments')
      .select(`
        id,
        amount,
        status,
        created_at,
        leases (
          units (
            unit_number,
            properties (name)
          )
        )
      `)
      .order('created_at', { ascending: false })
      .limit(5);

    const activity = {
      tickets: tickets || [],
      payments: payments || []
    };

    return NextResponse.json(activity);
  } catch (error) {
    console.error('[ACTIVITY_GET]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 