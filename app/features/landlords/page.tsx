import { Building2, BarChart3, DollarSign, Wrench } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function LandlordFeaturesPage() {
  const features = [
    {
      icon: Building2,
      title: "Property Management",
      description: "Manage all your properties in one centralized dashboard. Track units, leases, and occupancy rates.",
      link: "/dashboard",
    },
    {
      icon: DollarSign,
      title: "Rent Collection",
      description: "Automated rent collection with instant notifications and detailed payment tracking.",
      link: "/payments",
    },
    {
      icon: Wrench,
      title: "Maintenance Management",
      description: "Streamlined maintenance request handling with automated technician notifications.",
      link: "/maintenance",
    },
    {
      icon: BarChart3,
      title: "Analytics & Reporting",
      description: "Comprehensive analytics and reports to make data-driven property management decisions.",
      link: "/analytics",
    },
  ];

  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Property Management Made Simple
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Everything you need to manage your rental properties efficiently and grow your business.
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
                  {feature.title === "Property Management" && (
                    <>
                      <li>Centralized property and unit management</li>
                      <li>Digital lease management and e-signatures</li>
                      <li>Tenant screening and application processing</li>
                    </>
                  )}
                  {feature.title === "Rent Collection" && (
                    <>
                      <li>Automated payment processing</li>
                      <li>Late fee calculations</li>
                      <li>Payment history and reporting</li>
                    </>
                  )}
                  {feature.title === "Maintenance Management" && (
                    <>
                      <li>Online maintenance requests</li>
                      <li>Automated technician dispatching</li>
                      <li>Work order tracking and updates</li>
                    </>
                  )}
                  {feature.title === "Analytics & Reporting" && (
                    <>
                      <li>Financial performance tracking</li>
                      <li>Occupancy and lease analytics</li>
                      <li>Maintenance cost analysis</li>
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