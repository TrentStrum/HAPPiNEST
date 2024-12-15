import { supabase } from '@/lib/supabase/client';
import { DataAccessInterface } from '../contracts/DataAccess';
import { MaintenanceTicketResponse as MaintenanceTicket } from '@/app/types/maintenance.types';
import { Database } from '@/lib/supabase/database.types';

type MaintenanceRow = Database['public']['Tables']['maintenance_tickets']['Row'];
type MaintenanceJoins = {
	unit: { unit_number: string; property: { name: string; address: string } };
	tenant: { full_name: string; email: string };
	technician?: { full_name: string; email: string };
};

type MaintenanceInsert = Database['public']['Tables']['maintenance_tickets']['Insert'];

export class MaintenanceDataAccess implements DataAccessInterface<MaintenanceTicket> {
	private table = 'maintenance_tickets' as const;

	async getById(id: string): Promise<MaintenanceTicket> {
		const { data, error } = await supabase
			.from(this.table)
			.select(this.getFullSelectQuery())
			.eq('id', id)
			.single<MaintenanceRow & MaintenanceJoins>();

		if (error) throw new Error(error.message);
		if (!data) throw new Error('Maintenance ticket not found');
		return data as unknown as MaintenanceTicket;
	}

	async getAll(userId?: string, role?: string): Promise<MaintenanceTicket[]> {
		let query = supabase
			.from(this.table)
			.select<string, MaintenanceRow & MaintenanceJoins>(this.getFullSelectQuery());

		if (userId && role) {
			query = this.applyRoleFilter(query, userId, role);
		}

		const { data, error } = await query;
		if (error) throw new Error(error.message);
		if (!data) return [];
		return data as unknown as MaintenanceTicket[];
	}

	async create(data: Partial<MaintenanceInsert>): Promise<MaintenanceTicket> {
		const { data: ticket, error } = await supabase
			.from(this.table)
			.insert(data as MaintenanceInsert)
			.select<string, MaintenanceRow & MaintenanceJoins>(this.getFullSelectQuery())
			.single();

		if (error) throw new Error(error.message);
		if (!ticket) throw new Error('Failed to create ticket');
		return ticket as unknown as MaintenanceTicket;
	}

	async update(id: string, data: Partial<MaintenanceRow>): Promise<MaintenanceTicket> {
		const { data: updated, error } = await supabase
			.from(this.table)
			.update(data)
			.eq('id', id)
			.select<string, MaintenanceRow & MaintenanceJoins>(this.getFullSelectQuery())
			.single();

		if (error) throw new Error(error.message);
		if (!updated) throw new Error('Failed to update ticket');
		return updated as unknown as MaintenanceTicket;
	}

	async delete(id: string): Promise<void> {
		const { error } = await supabase.from(this.table).delete().eq('id', id);

		if (error) throw new Error(error.message);
	}

	private getFullSelectQuery() {
		return `
      *,
      unit:units (
        id,
        unit_number,
        property:properties (
          id,
          name,
          address
        )
      ),
      tenant:profiles!tenant_id (
        id,
        full_name,
        email
      ),
      technician:profiles!technician_id (
        id,
        full_name,
        email
      )
    `;
	}

	private applyRoleFilter(query: any, userId: string, role: string) {
		switch (role) {
			case 'tenant':
				return query.eq('tenant_id', userId);
			case 'technician':
				return query.eq('technician_id', userId);
			case 'landlord':
				return query.eq('unit.property.landlord_id', userId);
			default:
				return query;
		}
	}
}
