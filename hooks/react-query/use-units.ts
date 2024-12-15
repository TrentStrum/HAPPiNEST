import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import { useUser } from "@clerk/nextjs";

export const useTenantUnits = () => {
  const { user } = useUser();
  
  return useQuery({
    queryKey: ["tenant-units", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leases")
        .select(`
          unit_id,
          unit:units (
            id,
            unit_number,
            property:properties (
              id,
              name
            )
          )
        `)
        .eq("tenant_id", user?.id || "")
        .eq("status", "active");

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};