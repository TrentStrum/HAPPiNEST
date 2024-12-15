import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, queryKeys } from '@/lib/api-client';
import { Property, PropertyFormData } from '@/app/types/property.types';
import { OverviewStats } from '@/app/types/dashboard.types';
import { useUser } from '@clerk/nextjs';

// Fetch a single property
export const useProperty = (id: string, enabled: boolean = true) =>
  useQuery<Property>({
    queryKey: queryKeys.properties.detail(id),
    queryFn: async () => {
      return apiClient.get<Property>(`/properties/${id}`);
    },
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

// Fetch all properties
export const useProperties = () =>
  useQuery<Property[]>({
    queryKey: queryKeys.properties.all,
    queryFn: async () => {
      return apiClient.get<Property[]>('/properties');
    },
  });

// Create a new property
export const useCreateProperty = () => {
  const queryClient = useQueryClient();

  return useMutation<Property, Error, PropertyFormData>({
    mutationFn: async (data: PropertyFormData) => {
      return apiClient.post<PropertyFormData, Property>('/properties', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.properties.all });
    },
  });
};

// Update a property
export const useUpdateProperty = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation<Property, Error, Partial<Property>>({
    mutationFn: async (data: Partial<Property>) => {
      return apiClient.put<Property>(`/properties/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.properties.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.properties.all });
    },
  });
};

// Delete a property
export const useDeleteProperty = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (propertyId: string) => {
      await apiClient.delete(`/properties/${propertyId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.properties.all });
    },
  });
};

export const useOverviewStats = () => {
  const { user } = useUser();
  
  return useQuery<OverviewStats>({
    queryKey: ['overview'],
    queryFn: async () => {
      return apiClient.get('/overview');
    },
    enabled: !!user,
  });
};

export const useRecentActivity = () => {
  const { user } = useUser();
  
  return useQuery<OverviewStats['recentActivity']>({
    queryKey: ['recentActivity'],
    queryFn: async () => {
      return apiClient.get('/activity/recent');
    },
    enabled: !!user,
  });
}; 