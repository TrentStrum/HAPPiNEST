import { MessageSquare, Mail, Bell, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function CommunicationFeaturePage() {
  const features = [
    {
      icon: MessageSquare,
      title: "Direct Messaging",
      description: "Secure messaging system between tenants and landlords",
      link: "/messages",
      details: [
        "Real-time messaging",
        "File and image sharing",
        "Message history and search",
      ],
    },
    {
      icon: Bell,
      title: "Notifications",
      description: "Stay updated with important announcements and updates",
      link: "/notifications",
      details: [
        "Maintenance updates",
        "Payment reminders",
        "Property announcements",
      ],
    },
    {
      icon: Mail,
      title: "Email Integration",
      description: "Get important updates delivered to your inbox",
      link: "/settings/notifications",
      details: [
        "Email notifications",
        "Custom alert preferences",
        "Weekly summaries",
      ],
    },
    {
      icon: Calendar,
      title: "Scheduling",
      description: "Easy scheduling for maintenance and property visits",
      link: "/calendar",
      details: [
        "Maintenance scheduling",
        "Property viewings",
        "Calendar integration",
      ],
    },
  ];

  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Streamlined Communication
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Stay connected with your landlord or tenants through our integrated
          communication tools.
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
                  {feature.details.map((detail, index) => (
                    <li key={index}>{detail}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-muted-foreground">
          All communications are encrypted and stored securely. Messages and
          notifications are retained according to our data retention policy.
        </p>
      </div>
    </div>
  );
}