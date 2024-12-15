export interface Payment {
  id: string;
  lease_id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  due_date: string;
  paid_date?: string;
  payment_method?: string;
  stripe_payment_id?: string;
  tenant: {
    id: string;
    full_name: string;
    email: string;
  };
  unit: {
    unit_number: string;
    property: {
      name: string;
    };
  };
}

export interface PaymentFormData {
  lease_id: string;
  amount: number;
  due_date: string;
}

export interface CreatePaymentIntentData {
  amount: number;
  lease_id: string;
  description?: string;
} 