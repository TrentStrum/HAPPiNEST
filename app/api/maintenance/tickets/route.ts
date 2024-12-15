import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { MaintenanceDataAccess } from '@/lib/dal/MaintenanceDataAccess';
import { isErrorWithMessage } from '@/lib/utils';

const maintenanceDataAccess = new MaintenanceDataAccess();

export async function POST(req: Request) {
	try {
		const user = await currentUser();
		if (!user) {
			return new NextResponse('Unauthorized', { status: 401 });
		}

		const body = await req.json();
		const ticket = await maintenanceDataAccess.create({
			...body,
			tenant_id: user.id,
		});

		return NextResponse.json(ticket, { status: 201 });
	} catch (error) {
		if (isErrorWithMessage(error)) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
		return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
	}
}
