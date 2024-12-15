'use client';

import { useState } from 'react';
import { Plus, WrenchIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TicketCard } from '@/components/maintenance/ticket-card';
import { CreateTicketDialog } from '@/components/maintenance/create-ticket-dialog';
import { useMaintenanceTickets } from '@/hooks/react-query/use-maintenance';
import { useUser } from '@clerk/nextjs';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function MaintenancePage() {
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
	const { user } = useUser();
	const { data: tickets, isPending } = useMaintenanceTickets();

	if (isPending) {
		return <div>Loading...</div>;
	}

	const openTickets = tickets?.filter((ticket) => ticket.status === 'open') || [];
	const inProgressTickets = tickets?.filter((ticket) => ticket.status === 'in_progress') || [];
	const completedTickets = tickets?.filter((ticket) => ticket.status === 'completed') || [];

	return (
		<div className="space-y-8">
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Maintenance</h1>
					<p className="text-muted-foreground">Manage maintenance requests and repairs</p>
				</div>
				{user?.publicMetadata?.role === 'tenant' && (
					<Button onClick={() => setIsCreateDialogOpen(true)}>
						<Plus className="mr-2 h-4 w-4" />
						Create Ticket
					</Button>
				)}
			</div>

			{tickets?.length === 0 ? (
				<div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed rounded-lg p-8">
					<WrenchIcon className="h-12 w-12 text-muted-foreground mb-4" />
					<h3 className="text-lg font-semibold mb-2">No maintenance tickets</h3>
					<p className="text-muted-foreground text-center mb-4">
						{user?.publicMetadata?.role === 'tenant'
							? 'Create a ticket to report maintenance issues'
							: 'No maintenance tickets have been submitted yet'}
					</p>
					{user?.publicMetadata?.role === 'tenant' && (
						<Button onClick={() => setIsCreateDialogOpen(true)}>Create Ticket</Button>
					)}
				</div>
			) : (
				<Tabs defaultValue="open" className="space-y-6">
					<TabsList>
						<TabsTrigger value="open">Open ({openTickets.length})</TabsTrigger>
						<TabsTrigger value="in-progress">In Progress ({inProgressTickets.length})</TabsTrigger>
						<TabsTrigger value="completed">Completed ({completedTickets.length})</TabsTrigger>
					</TabsList>

					<TabsContent value="open" className="space-y-4">
						{openTickets.map((ticket) => (
							<TicketCard key={ticket.id} ticket={ticket} />
						))}
					</TabsContent>

					<TabsContent value="in-progress" className="space-y-4">
						{inProgressTickets.map((ticket) => (
							<TicketCard key={ticket.id} ticket={ticket} />
						))}
					</TabsContent>

					<TabsContent value="completed" className="space-y-4">
						{completedTickets.map((ticket) => (
							<TicketCard key={ticket.id} ticket={ticket} />
						))}
					</TabsContent>
				</Tabs>
			)}

			<CreateTicketDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
		</div>
	);
}
