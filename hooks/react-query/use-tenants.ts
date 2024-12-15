import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useUser } from '@clerk/nextjs';
import { TenantUnit } from '@/app/types/tenant.types';

export const useTenantUnits = () => {
	const { user } = useUser();

	return useQuery<TenantUnit[]>({
		queryKey: ['tenant-units', user?.id],
		queryFn: async () => {
			return apiClient.get('/api/tenants/units', {
				params: {
					tenant_id: user?.id,
					status: 'active'
				}
			});
		},
		enabled: !!user,
	});
};
