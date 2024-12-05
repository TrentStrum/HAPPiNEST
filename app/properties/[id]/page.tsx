"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { Building2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase/client";
import { UnitCard } from "@/components/properties/unit-card";
import { AddUnitDialog } from "@/components/properties/add-unit-dialog";
import { useState } from "react";

export default function PropertyDetailsPage() {
  const params = useParams();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const { data: property, isLoading } = useQuery({
    queryKey: ["property", params.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("properties")
        .select(`
          *,
          units (
            *,
            leases (
              *,
              tenant:profiles (
                id,
                full_name,
                email
              )
            )
          )
        `)
        .eq("id", params.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!property) {
    return <div>Property not found</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{property.name}</h1>
          <p className="text-muted-foreground">
            {property.address}, {property.city}, {property.state} {property.zip}
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Unit
        </Button>
      </div>

      {property.units.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed rounded-lg p-8">
          <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No units yet</h3>
          <p className="text-muted-foreground text-center mb-4">
            Add your first unit to start managing tenants
          </p>
          <Button onClick={() => setIsAddDialogOpen(true)}>Add Unit</Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {property.units.map((unit) => (
            <UnitCard key={unit.id} unit={unit} />
          ))}
        </div>
      )}

      <AddUnitDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        propertyId={property.id}
      />
    </div>
  );
}