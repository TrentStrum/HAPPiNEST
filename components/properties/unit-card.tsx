import { Home, User, DollarSign } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface UnitCardProps {
  unit: {
    id: string;
    unit_number: string;
    rent_amount: number;
    square_feet: number;
    bedrooms: number;
    bathrooms: number;
    leases: Array<{
      id: string;
      start_date: string;
      end_date: string;
      tenant: {
        id: string;
        full_name: string;
        email: string;
      };
    }>;
  };
}

export function UnitCard({ unit }: UnitCardProps) {
  const currentLease = unit.leases?.[0];
  const isOccupied = !!currentLease;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">
          Unit {unit.unit_number}
        </CardTitle>
        <Badge variant={isOccupied ? "default" : "secondary"}>
          {isOccupied ? "Occupied" : "Vacant"}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-muted-foreground">
              <Home className="mr-1 h-4 w-4" />
              {unit.bedrooms} bed, {unit.bathrooms} bath
            </div>
            <div className="text-muted-foreground">
              {unit.square_feet} sq ft
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <DollarSign className="mr-1 h-4 w-4 text-muted-foreground" />
              <span className="font-semibold">
                ${unit.rent_amount.toLocaleString()}/mo
              </span>
            </div>
          </div>

          {isOccupied && (
            <div className="pt-2 border-t">
              <div className="flex items-center text-sm text-muted-foreground">
                <User className="mr-1 h-4 w-4" />
                <span>{currentLease.tenant.full_name}</span>
              </div>
              <CardDescription className="mt-1">
                Lease: {new Date(currentLease.start_date).toLocaleDateString()} -{" "}
                {new Date(currentLease.end_date).toLocaleDateString()}
              </CardDescription>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}