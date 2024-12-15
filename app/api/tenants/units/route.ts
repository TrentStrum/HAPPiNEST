import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { Database } from '@/lib/supabase/database.types';

export async function GET(req: Request) {
	try {
		const cookieStore = cookies();
		const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore });
		
		const { searchParams } = new URL(req.url);
		const tenantId = searchParams.get('tenant_id');
		const status = searchParams.get('status') || 'active';

		if (!tenantId) {
			return NextResponse.json({ error: 'Tenant ID is required' }, { status: 400 });
		}

		// Use a simpler query first to debug
		const { data: units, error } = await supabase
			.from('tenant_units')
			.select(`
				unit_id,
				units (
					id,
					unit_number,
					property:properties!inner (
						id,
						name,
						address
					)
				)
			`)
			.eq('tenant_id', tenantId)
			.eq('status', status);

		if (error) {
			console.error('Supabase error:', error);
			return NextResponse.json(
				{ error: error.message }, 
				{ status: 500 }
			);
		}

		if (!units) {
			return NextResponse.json([], { status: 200 });
		}

		// Transform the response to match expected format
		const transformedUnits = units.map(item => ({
			id: item.unit_id,
			unit_number: item.units.unit_number,
			property: item.units.property
		})).filter(unit => unit.id != null);

		return NextResponse.json(transformedUnits);
	} catch (error) {
		console.error('[TENANTS_UNITS_GET]', error);
		return NextResponse.json(
			{ error: 'Internal server error' }, 
			{ status: 500 }
		);
	}
}
