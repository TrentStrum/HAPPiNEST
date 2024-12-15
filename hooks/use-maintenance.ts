import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MaintenanceDataAccess } from '@/lib/dal/MaintenanceDataAccess';
import { useAuth } from '@/hooks/use-auth';
import { MaintenanceTicket } from '@/types/maintenance.types';

const maintenanceDataAccess = new MaintenanceDataAccess();

export const useMaintenanceTickets = () => {
  const { user } = useAuth();
  
  return useQuery<MaintenanceTicket[]>({
    queryKey: ['maintenance-tickets'],
    queryFn: async () => {
      return maintenanceDataAccess.getAll(user?.id, user?.role);
    },
    enabled: !!user,
  });
};

export const useMaintenanceTicket = (id: string) => {
  return useQuery<MaintenanceTicket>({
    queryKey: ['maintenance-tickets', id],
    queryFn: async () => {
      return maintenanceDataAccess.getById(id);
    },
  });
};

// Add other maintenance-related hooks (create, update, etc.) 