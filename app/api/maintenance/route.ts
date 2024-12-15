import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { Database } from '@/lib/supabase/database.types';

export async function GET(req: Request) {
	try {
		const cookieStore = cookies();
		const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore });
		
		const { data: tickets, error } = await supabase
			.from('maintenance_tickets')
			.select(`
				*,
				units!maintenance_tickets_unit_id_fkey (
						unit_number,
						properties!units_property_id_fkey (
								name,
								address
						)
				),
				profiles!maintenance_tickets_tenant_id_fkey (
						full_name,
						email
				),
				technician:profiles!maintenance_tickets_technician_id_fkey (
						full_name,
						email
				)
			`);

		if (error) {
			console.error('Supabase error:', error);
			return NextResponse.json({ error: error.message }, { status: 500 });
		}

		return NextResponse.json(tickets);
	} catch (error) {
		console.error('[MAINTENANCE_GET]', error);
		return NextResponse.json(
			{ error: 'Internal server error' }, 
			{ status: 500 }
		);
	}
}
