export interface MaintenanceTicketRow {
	id: string;
	unit_id: string;
	tenant_id: string;
	title: string;
	description: string;
	status: 'open' | 'in_progress' | 'completed' | 'cancelled';
	priority: 1 | 2 | 3;
	category: string;
	created_at: string;
	images?: string[];
}

// Keep existing interfaces, add this type for Supabase returns
export type MaintenanceTicketResponse = MaintenanceTicketRow & {
	unit: {
		unit_number: string;
		property: {
			name: string;
			address: string;
		};
	};
	tenant: {
		full_name: string;
		email: string;
	};
	technician?: {
		full_name: string;
		email: string;
	};
};

export interface MaintenanceTicketFormData {
	unit_id: string;
	title: string;
	description: string;
	category: string;
	priority: 1 | 2 | 3;
	images?: string[];
}

export interface UpdateTicketData {
	status?: 'open' | 'in_progress' | 'completed' | 'cancelled';
	notes?: string;
	technician_id?: string;
	images?: string[];
}

export type CreateTicketFormValues = {
	unit_id: string;
	title: string;
	description: string;
	category: string;
	priority: string;
	images?: string[];
};
