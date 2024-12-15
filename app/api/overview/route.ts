import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function GET() {
	try {
		const { userId } = await auth();

		if (!userId) {
			return new NextResponse('Unauthorized', { status: 401 });
		}

		// Mock data for now - replace with actual DB queries later
		const overview = {
			totalProperties: 5,
			totalUnits: 12,
			occupancyRate: 92,
			monthlyRevenue: 15000,
			recentActivity: [
				{
					id: '1',
					type: 'payment',
					title: 'Rent Payment Received',
					description: 'Unit 101 - $1,500',
					timestamp: '2 hours ago',
					user: {
						name: 'John Doe',
						image: 'https://i.pravatar.cc/150?u=1',
					},
				},
				// Add more mock activities...
			],
		};

		return NextResponse.json(overview);
	} catch (error) {
		console.error('[OVERVIEW_GET]', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
}
