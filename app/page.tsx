"use client";

import { Button } from "@/components/ui/button";
import { Building2, Shield, Wrench, DollarSign, FileText, BarChart3, MessageSquare } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export default function Home() {
  const { theme } = useTheme();

  const features = [
    {
      icon: Building2,
      title: "Property Management",
      description: "Manage all your properties in one place with our intuitive dashboard",
    },
    {
      icon: DollarSign,
      title: "Secure Payments",
      description: "Automated rent collection with instant payment notifications",
    },
    {
      icon: Wrench,
      title: "Maintenance Tracking",
      description: "Streamlined maintenance requests with real-time updates",
    },
    {
      icon: FileText,
      title: "Document Management",
      description: "Store and manage leases, contracts, and other documents securely",
    },
    {
      icon: BarChart3,
      title: "Analytics & Insights",
      description: "Make data-driven decisions with detailed property analytics",
    },
    {
      icon: MessageSquare,
      title: "Communication Hub",
      description: "Seamless communication between landlords and tenants",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <div 
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2946&q=80')",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-background/95 to-background/70" />
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                Property Management
              </span>
              <br />
              Made Simple
            </h1>
            <p className="text-xl text-muted-foreground mb-8 md:pr-8">
              The all-in-one platform for landlords and tenants. Manage properties,
              collect rent, and handle maintenance requests with ease.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/auth/register?role=landlord">
                <Button size="lg" className="w-full sm:w-auto">
                  I'm a Landlord
                </Button>
              </Link>
              <Link href="/auth/register?role=tenant">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  I'm a Tenant
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Everything You Need to Manage Your Properties
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our comprehensive suite of tools helps you save time and streamline
              your property management workflow.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className={cn(
                  "relative group p-8 rounded-lg transition-all duration-200",
                  "bg-card hover:bg-accent hover:text-accent-foreground",
                  "border border-border hover:border-accent"
                )}
              >
                <div className="flex items-center gap-4 mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                </div>
                <p className="text-muted-foreground group-hover:text-accent-foreground/90">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">1,000+</div>
              <div className="text-muted-foreground">Properties Managed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">5,000+</div>
              <div className="text-muted-foreground">Happy Tenants</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">98%</div>
              <div className="text-muted-foreground">Customer Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Ready to Streamline Your Property Management?
          </h2>
          <p className="text-lg mb-8 text-primary-foreground/90 max-w-2xl mx-auto">
            Join thousands of property managers who are saving time and increasing
            efficiency with our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto"
              >
                Get Started for Free
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-primary-foreground hover:bg-primary-foreground hover:text-primary"
              >
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}