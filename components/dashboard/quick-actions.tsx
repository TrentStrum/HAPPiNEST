import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Building2, FileText, WrenchIcon, DollarSign } from "lucide-react";
import Link from "next/link";
import { OverviewStats } from "@/app/types/dashboard.types";

interface QuickActionsProps {
  stats: OverviewStats;
}

export function QuickActions({ stats }: QuickActionsProps) {
  const actions = [
    {
      title: "Properties",
      description: "Manage your properties",
      icon: Building2,
      href: "/properties",
      color: "text-blue-500",
      metric: `${stats.totalProperties} Units`,
    },
    {
      title: "Maintenance",
      description: "View maintenance requests",
      icon: WrenchIcon,
      href: "/maintenance",
      color: "text-orange-500",
      metric: "2 Open",
    },
    {
      title: "Leases",
      description: "Manage active leases",
      icon: FileText,
      href: "/leases",
      color: "text-green-500",
      metric: "3 Active",
    },
    {
      title: "Payments",
      description: "View payment history",
      icon: DollarSign,
      href: "/payments",
      color: "text-purple-500",
      metric: `$${stats.monthlyRevenue.toLocaleString()}`,
    },
  ];

  return (
    <>
      {actions.map((action) => (
        <Link key={action.title} href={action.href}>
          <Card className="hover:bg-muted/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {action.title}
              </CardTitle>
              <action.icon className={`h-4 w-4 ${action.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{action.metric}</div>
              <p className="text-xs text-muted-foreground">
                {action.description}
              </p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </>
  );
}