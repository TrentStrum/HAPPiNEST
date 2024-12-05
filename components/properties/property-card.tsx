import Link from "next/link";
import { Building2, Home } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PropertyCardProps {
  property: {
    id: string;
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    units: Array<{
      id: string;
      unit_number: string;
      rent_amount: number;
    }>;
  };
}

export function PropertyCard({ property }: PropertyCardProps) {
  const totalUnits = property.units.length;
  const totalRent = property.units.reduce(
    (sum, unit) => sum + unit.rent_amount,
    0
  );

  return (
    <Link href={`/properties/${property.id}`}>
      <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-semibold">{property.name}</CardTitle>
          <Building2 className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <CardDescription>
              {property.address}, {property.city}, {property.state} {property.zip}
            </CardDescription>
            <div className="flex gap-2">
              <Badge variant="secondary">
                <Home className="mr-1 h-3 w-3" />
                {totalUnits} Units
              </Badge>
              <Badge variant="secondary">
                ${totalRent.toLocaleString()} /month
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}