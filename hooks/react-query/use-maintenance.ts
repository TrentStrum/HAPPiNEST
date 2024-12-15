import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { MaintenanceTicketResponse, MaintenanceTicketFormData, UpdateTicketData, CreateTicketFormValues } from '@/app/types/maintenance.types';

const ITEMS_PER_PAGE = 10;

// Fetch a single ticket
export const useMaintenanceTicket = (id: string, enabled: boolean = true) =>
  useQuery<MaintenanceTicketResponse>({
    queryKey: ['maintenance', id],
    queryFn: async () => {
      return apiClient.get<MaintenanceTicketResponse>(`/maintenance/${id}`);
    },
    enabled,
    staleTime: 1000 * 60 * 5,
  });

// Fetch all tickets with filtering
export const useMaintenanceTickets = (filters?: {
  status?: string;
  priority?: number;
  unitId?: string;
}) => {
  return useQuery<MaintenanceTicketResponse[]>({
    queryKey: ['maintenance', filters],
    queryFn: async () => {
      return apiClient.get<MaintenanceTicketResponse[]>('/maintenance', {
        params: filters,
      });
    },
  });
};

// Create a new ticket
export const useCreateMaintenanceTicket = (options?: {
  onSuccess?: () => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation<MaintenanceTicketResponse, Error, CreateTicketFormValues>({
    mutationFn: (data) => {
      return apiClient.post('/api/maintenance/tickets', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance-tickets'] });
      options?.onSuccess?.();
    },
  });
};

// Update a ticket
export const useUpdateMaintenanceTicket = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation<MaintenanceTicketResponse, Error, UpdateTicketData>({
    mutationFn: async (data: UpdateTicketData) => {
      return apiClient.put<MaintenanceTicketResponse>(`/maintenance/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance', id] });
      queryClient.invalidateQueries({ queryKey: ['maintenance'] });
    },
  });
};

export function useMaintenance() {
  return useQuery<MaintenanceTicketResponse[]>({
    queryKey: ['maintenance'],
    queryFn: () => apiClient.get<{ data: MaintenanceTicketResponse[] }>('/api/maintenance')
      .then((res) => res.data),
  });
} 