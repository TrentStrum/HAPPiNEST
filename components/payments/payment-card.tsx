import { format } from "date-fns";
import { CheckCircle, XCircle, Clock, Building2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PaymentCardProps {
  payment: {
    id: string;
    amount: number;
    status: "pending" | "completed" | "failed";
    due_date: string;
    paid_date?: string;
    lease: {
      unit: {
        unit_number: string;
        property: {
          name: string;
        };
      };
    };
  };
}

const statusConfig = {
  pending: {
    icon: Clock,
    color: "text-yellow-500",
    badge: "bg-yellow-100 text-yellow-800",
  },
  completed: {
    icon: CheckCircle,
    color: "text-green-500",
    badge: "bg-green-100 text-green-800",
  },
  failed: {
    icon: XCircle,
    color: "text-red-500",
    badge: "bg-red-100 text-red-800",
  },
};

export function PaymentCard({ payment }: PaymentCardProps) {
  const StatusIcon = statusConfig[payment.status].icon;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          <Building2 className="h-5 w-5 text-muted-foreground" />
          <CardTitle className="text-lg font-semibold">
            {payment.lease.unit.property.name} - Unit {payment.lease.unit.unit_number}
          </CardTitle>
        </div>
        <Badge
          className={statusConfig[payment.status].badge}
          variant="outline"
        >
          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <p className="text-2xl font-bold">
              ${payment.amount.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">
              Due: {format(new Date(payment.due_date), "PPP")}
            </p>
            {payment.paid_date && (
              <p className="text-sm text-muted-foreground">
                Paid: {format(new Date(payment.paid_date), "PPP")}
              </p>
            )}
          </div>
          <StatusIcon
            className={`h-8 w-8 ${statusConfig[payment.status].color}`}
          />
        </div>
      </CardContent>
    </Card>
  );
}