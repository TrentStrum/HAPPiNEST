export interface TenantUnit {
	id: string;
	unit_number: string;
	property: {
		id: string;
		name: string;
		address: string;
	};
}

export interface RawTenantUnit {
	unit_id: string;
	units: {
		id: string;
		unit_number: string;
		properties: {
			id: string;
			name: string;
			address: string;
		};
	} | null;
}

export interface Tenant {
	id: string;
	first_name: string;
	last_name: string;
	email: string;
}
    