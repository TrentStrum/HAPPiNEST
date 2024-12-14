'use client';

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';

export function SubscriptionsTable() {
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Customer</TableHead>
					<TableHead>Plan</TableHead>
					<TableHead>Status</TableHead>
					<TableHead>Amount</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				<TableRow>
					<TableCell>Loading...</TableCell>
					<TableCell>Loading...</TableCell>
					<TableCell>Loading...</TableCell>
					<TableCell>Loading...</TableCell>
				</TableRow>
			</TableBody>
		</Table>
	);
} 