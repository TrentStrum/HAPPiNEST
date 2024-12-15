import { supabase } from '@/lib/supabase/client';
import { DataAccessInterface } from '../contracts/DataAccess';
import { Property } from '@/types/property.types';

export class PropertyDataAccess implements DataAccessInterface<Property> {
  private table = 'properties' as const;

  async getById(id: string): Promise<Property> {
    const { data, error } = await supabase
      .from(this.table)
      .select(`
        *,
        units (
          *,
          leases (
            *,
            tenant:tenant_id (*)
          )
        )
      `)
      .eq('id', id)
      .single();
    
    if (error) throw new Error(error.message);
    return data;
  }

  // ... other methods
} 