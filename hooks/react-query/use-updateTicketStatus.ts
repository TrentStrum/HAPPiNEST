import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export const useUpdateTicketStatus = (ticketId: string) => {
	const queryClient = useQueryClient();
	
	return useMutation({
		mutationFn: (status: string) => {
			return apiClient.patch(`/api/maintenance/tickets/${ticketId}`, { status });
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['maintenance-tickets'] });
		},
	});
};
