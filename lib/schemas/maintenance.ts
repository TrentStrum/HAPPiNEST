// lib/schemas/maintenance.ts
import * as z from 'zod';

export const createTicketFormSchema = z.object({
    unit_id: z.string().min(1, 'Please select a unit'),
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    category: z.string().min(1, 'Category is required'),
    priority: z.string().min(1, 'Priority is required'),
    images: z.array(z.string()).optional(),
});

export const defaultValues = {
    unit_id: '',
    title: '',
    description: '',
    category: '',
    priority: '1',
    images: [] as string[],
} as const;

export const categories = [
    'Plumbing',
    'Electrical',
    'HVAC',
    'Appliance',
    'Structural',
    'Pest Control',
    'Other',
] as const;

export type CreateTicketFormValues = z.infer<typeof createTicketFormSchema>;