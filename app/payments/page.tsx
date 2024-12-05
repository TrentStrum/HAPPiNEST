"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { DollarSign, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PaymentCard } from "@/components/payments/payment-card";
import { MakePaymentDialog } from "@/components/payments/make-payment-dialog";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function PaymentsPage() {
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const { user } = useAuth();

  const { data: payments, isLoading } = useQuery({
    queryKey: ["payments"],
    queryFn: async () => {
      const query = supabase
        .from("payments")
        .select(`
          *,
          lease:leases (
            id,
            unit:units (
              id,
              unit_number,
              property:properties (
                id,
                name
              )
            )
          )
        `);

      if (user?.role === "tenant") {
        query.eq("lease.tenant_id", user.id);
      } else if (user?.role === "landlord") {
        query.eq("lease.unit.property.landlord_id", user.id);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const pendingPayments = payments?.filter((p) => p.status === "pending") || [];
  const completedPayments = payments?.filter((p) => p.status === "completed") || [];
  const failedPayments = payments?.filter((p) => p.status === "failed") || [];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
          <p className="text-muted-foreground">
            Manage rent payments and transaction history
          </p>
        </div>
        {user?.role === "tenant" && (
          <Button onClick={() => setIsPaymentDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Make Payment
          </Button>
        )}
      </div>

      {payments?.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed rounded-lg p-8">
          <DollarSign className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No payments yet</h3>
          <p className="text-muted-foreground text-center mb-4">
            {user?.role === "tenant"
              ? "Make your first rent payment"
              : "No payments have been made yet"}
          </p>
          {user?.role === "tenant" && (
            <Button onClick={() => setIsPaymentDialogOpen(true)}>
              Make Payment
            </Button>
          )}
        </div>
      ) : (
        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList>
            <TabsTrigger value="pending">
              Pending ({pendingPayments.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({completedPayments.length})
            </TabsTrigger>
            <TabsTrigger value="failed">
              Failed ({failedPayments.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            {pendingPayments.map((payment) => (
              <PaymentCard key={payment.id} payment={payment} />
            ))}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completedPayments.map((payment) => (
              <PaymentCard key={payment.id} payment={payment} />
            ))}
          </TabsContent>

          <TabsContent value="failed" className="space-y-4">
            {failedPayments.map((payment) => (
              <PaymentCard key={payment.id} payment={payment} />
            ))}
          </TabsContent>
        </Tabs>
      )}

      <MakePaymentDialog
        open={isPaymentDialogOpen}
        onOpenChange={setIsPaymentDialogOpen}
      />
    </div>
  );
}