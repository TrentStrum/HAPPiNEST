import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, queryKeys } from '@/lib/api-client';
import { Payment, PaymentFormData, CreatePaymentIntentData } from '@/types/payment.types';

// Fetch a single payment
export const usePayment = (id: string, enabled: boolean = true) =>
  useQuery<Payment>({
    queryKey: ['payments', id],
    queryFn: async () => {
      return apiClient.get<Payment>(`/payments/${id}`);
    },
    enabled,
    staleTime: 1000 * 60 * 5,
  });

// Fetch payments for a lease
export const useLeasePayments = (leaseId: string) =>
  useQuery<Payment[]>({
    queryKey: ['payments', 'lease', leaseId],
    queryFn: async () => {
      return apiClient.get<Payment[]>(`/leases/${leaseId}/payments`);
    },
  });

// Create a payment intent
export const useCreatePaymentIntent = () => {
  return useMutation<{ clientSecret: string }, Error, CreatePaymentIntentData>({
    mutationFn: async (data: CreatePaymentIntentData) => {
      return apiClient.post<CreatePaymentIntentData, { clientSecret: string }>(
        '/payments/create-payment-intent',
        data
      );
    },
  });
};

// Create a payment record
export const useCreatePayment = () => {
  const queryClient = useQueryClient();

  return useMutation<Payment, Error, PaymentFormData>({
    mutationFn: async (data: PaymentFormData) => {
      return apiClient.post<PaymentFormData, Payment>('/payments', data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ 
        queryKey: ['payments', 'lease', data.lease_id] 
      });
    },
  });
};

// Update payment status
export const useUpdatePaymentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<
    Payment,
    Error,
    { id: string; status: 'completed' | 'failed'; leaseId: string }
  >({
    mutationFn: async ({ id, status }) => {
      return apiClient.patch<Payment>(`/payments/${id}/status`, { status });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ 
        queryKey: ['payments', 'lease', variables.leaseId] 
      });
    },
  });
}; 