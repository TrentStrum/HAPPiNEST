import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useUser } from '@clerk/nextjs';

interface TenantUnit {
	id: string;
	unit: {
		id: string;
		unit_number: string;
		property: {
			name: string;
		};
	};
}

export const useTenantUnits = () => {
	const { user } = useUser();

	return useQuery<TenantUnit[]>({
		queryKey: ['tenant-units', user?.id],
		queryFn: async () => {
			if (!user?.id) throw new Error('No user ID');
			
			const response = await apiClient.get<TenantUnit[]>('/api/tenants/units', {
				params: {
					tenant_id: user.id,
					status: 'active'
				}
			});
			
			return response;
		},
		enabled: !!user?.id,
	});
};
