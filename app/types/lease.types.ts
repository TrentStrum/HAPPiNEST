export interface Lease {
  id: string;
  unit_id: string;
  tenant_id: string;
  start_date: string;
  end_date: string;
  rent_amount: number;
  status: 'active' | 'pending' | 'expired' | 'terminated';
  tenant?: {
    id: string;
    full_name: string;
    email: string;
  };
  unit?: {
    id: string;
    unit_number: string;
    property: {
      id: string;
      name: string;
    };
  };
}

export interface LeaseFormData {
  unit_id: string;
  tenant_id: string;
  start_date: string;
  end_date: string;
  rent_amount: number;
} 