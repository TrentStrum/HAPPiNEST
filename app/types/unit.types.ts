export interface Unit {
  id: string;
  unit_number: string;
  rent_amount: number;
  property_id: string;
  property?: {
    id: string;
    name: string;
    address: string;
  };
  leases?: Lease[];
}

export interface UnitFormData {
  unit_number: string;
  rent_amount: number;
  property_id: string;
} 