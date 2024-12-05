import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PaymentSuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] py-12 px-4">
      <div className="text-center space-y-6">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
        <h1 className="text-3xl font-bold">Payment Successful!</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Your payment has been processed successfully. You can view your payment
          history in the payments section.
        </p>
        <Link href="/payments">
          <Button>View Payments</Button>
        </Link>
      </div>
    </div>
  );
}