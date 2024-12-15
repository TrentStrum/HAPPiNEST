import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, queryKeys } from '@/lib/api-client';
import { Lease, LeaseFormData } from '@/types/lease.types';

// Fetch a single lease
export const useLease = (id: string, enabled: boolean = true) =>
  useQuery<Lease>({
    queryKey: ['leases', id],
    queryFn: async () => {
      return apiClient.get<Lease>(`/leases/${id}`);
    },
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

// Fetch leases for a unit
export const useUnitLeases = (unitId: string) =>
  useQuery<Lease[]>({
    queryKey: queryKeys.units.leases(unitId),
    queryFn: async () => {
      return apiClient.get<Lease[]>(`/units/${unitId}/leases`);
    },
  });

// Create a new lease
export const useCreateLease = () => {
  const queryClient = useQueryClient();

  return useMutation<Lease, Error, LeaseFormData>({
    mutationFn: async (data: LeaseFormData) => {
      return apiClient.post<LeaseFormData, Lease>('/leases', data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['leases'] });
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.units.leases(data.unit_id) 
      });
    },
  });
};

// Update a lease
export const useUpdateLease = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation<Lease, Error, Partial<Lease>>({
    mutationFn: async (data: Partial<Lease>) => {
      return apiClient.put<Lease>(`/leases/${id}`, data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['leases', id] });
      queryClient.invalidateQueries({ queryKey: ['leases'] });
      if (data.unit_id) {
        queryClient.invalidateQueries({ 
          queryKey: queryKeys.units.leases(data.unit_id) 
        });
      }
    },
  });
};

// Terminate a lease
export const useTerminateLease = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { id: string; unitId: string }>({
    mutationFn: async ({ id }) => {
      await apiClient.patch(`/leases/${id}/terminate`);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['leases'] });
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.units.leases(variables.unitId) 
      });
    },
  });
}; 