export interface Property {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  landlord_id: string;
  units?: Unit[];
}

export interface Unit {
  id: string;
  unit_number: string;
  rent_amount: number;
  property_id: string;
  leases?: Lease[];
}

export interface Lease {
  id: string;
  unit_id: string;
  tenant: {
    id: string;
    full_name: string;
    email: string;
  };
}

export interface PropertyFormData {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
} 