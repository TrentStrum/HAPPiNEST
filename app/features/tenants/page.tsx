import { Home, CreditCard, MessageSquare, FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function TenantFeaturesPage() {
  const features = [
    {
      icon: CreditCard,
      title: "Easy Rent Payments",
      description: "Pay your rent online with multiple payment options and automatic receipts.",
      link: "/payments",
    },
    {
      icon: MessageSquare,
      title: "Maintenance Requests",
      description: "Submit and track maintenance requests with real-time updates.",
      link: "/maintenance",
    },
    {
      icon: FileText,
      title: "Document Access",
      description: "Access your lease, payment history, and other important documents.",
      link: "/documents",
    },
    {
      icon: Home,
      title: "Property Information",
      description: "View property details, amenities, and important announcements.",
      link: "/properties",
    },
  ];

  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Simplify Your Rental Experience
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Everything you need to manage your rental experience in one place.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {features.map((feature) => (
          <Link key={feature.title} href={feature.link}>
            <Card className="h-full hover:bg-muted/50 transition-colors">
              <CardHeader>
                <feature.icon className="h-8 w-8 text-primary mb-4" />
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  {feature.title === "Easy Rent Payments" && (
                    <>
                      <li>Multiple payment methods accepted</li>
                      <li>Automatic payment reminders</li>
                      <li>Instant payment confirmation</li>
                    </>
                  )}
                  {feature.title === "Maintenance Requests" && (
                    <>
                      <li>Easy request submission</li>
                      <li>Photo and description upload</li>
                      <li>Real-time status updates</li>
                    </>
                  )}
                  {feature.title === "Document Access" && (
                    <>
                      <li>Digital lease agreements</li>
                      <li>Payment history records</li>
                      <li>Important notices archive</li>
                    </>
                  )}
                  {feature.title === "Property Information" && (
                    <>
                      <li>Property rules and guidelines</li>
                      <li>Amenity information</li>
                      <li>Community updates</li>
                    </>
                  )}
                </ul>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}