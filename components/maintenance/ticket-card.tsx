'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { AlertTriangle, CheckCircle, Clock, User, Home, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UpdateTicketDialog } from './update-ticket-dialog';
import { MaintenanceTicketResponse } from '@/app/types/maintenance.types';

import { useUpdateTicketStatus } from '@/hooks/react-query/use-updateTicketStatus';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';
import { MAINTENANCE_CONSTANTS } from '@/lib/constants/maintenance';

interface TicketCardProps {
	ticket: MaintenanceTicketResponse;
}

export function TicketCard({ ticket }: TicketCardProps) {
	const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
	const { user } = useUser();
	const updateMutation = useUpdateTicketStatus(ticket.id);

	const StatusIcon = MAINTENANCE_CONSTANTS.statusIcons[ticket.status as keyof typeof MAINTENANCE_CONSTANTS.statusIcons];

	const handleStatusUpdate = async (status: string) => {
		await updateMutation.mutateAsync(status);
	};

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<div className="flex items-center space-x-2">
					<div
						className={`w-2 h-2 rounded-full ${
							MAINTENANCE_CONSTANTS.priorityColors[ticket.priority as keyof typeof MAINTENANCE_CONSTANTS.priorityColors]
						}`}
					/>
					<CardTitle className="text-lg font-semibold">{ticket.title}</CardTitle>
				</div>
				<div className="flex items-center space-x-2">
					<StatusIcon className={`h-5 w-5 ${MAINTENANCE_CONSTANTS.statusColors[ticket.status as keyof typeof MAINTENANCE_CONSTANTS.statusColors]}`} />
					<Badge variant="outline">{ticket.category}</Badge>
				</div>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					<p className="text-sm text-muted-foreground">{ticket.description}</p>

					{ticket.images && ticket.images.length > 0 && (
						<div className="flex gap-2 overflow-x-auto py-2">
							{ticket.images.map((image: string, index: number) => (
								<Image
									key={index}
									src={image}
									alt={`Ticket image ${index + 1}`}
									width={96}
									height={96}
									className="object-cover rounded-md"
								/>
							))}
						</div>
					)}

					<div className="flex flex-col space-y-2 text-sm">
						<div className="flex items-center text-muted-foreground">
							<Home className="mr-2 h-4 w-4" />
							{ticket.unit.property.name} - Unit {ticket.unit.unit_number}
						</div>
						<div className="flex items-center text-muted-foreground">
							<User className="mr-2 h-4 w-4" />
							Reported by: {ticket.tenant.full_name}
						</div>
						{ticket.technician && (
							<div className="flex items-center text-muted-foreground">
								<User className="mr-2 h-4 w-4" />
								Assigned to: {ticket.technician.full_name}
							</div>
						)}
						<div className="flex items-center text-muted-foreground">
							<Clock className="mr-2 h-4 w-4" />
							Created: {format(new Date(ticket.created_at), 'PPp')}
						</div>
					</div>

					{(user?.publicMetadata?.role === 'landlord' ||
						user?.publicMetadata?.role === 'technician') && (
						<div className="flex justify-end space-x-2 pt-4">
							<Button variant="outline" size="sm" onClick={() => setIsUpdateDialogOpen(true)}>
								<MessageSquare className="mr-2 h-4 w-4" />
								Update
							</Button>
							{ticket.status === 'open' && (
								<Button size="sm" onClick={() => handleStatusUpdate('in_progress')}>
									Start Work
								</Button>
							)}
							{ticket.status === 'in_progress' && (
								<Button size="sm" onClick={() => handleStatusUpdate('completed')}>
									Mark Complete
								</Button>
							)}
						</div>
					)}
				</div>
			</CardContent>

			<UpdateTicketDialog
				ticket={ticket}
				open={isUpdateDialogOpen}
				onOpenChange={setIsUpdateDialogOpen}
			/>
		</Card>
	);
}
