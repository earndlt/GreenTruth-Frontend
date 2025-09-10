
import { z } from 'zod';

export const searchFormSchema = z.object({
  productType: z.string().min(1, 'Product type is required'),
  emissionSources: z.array(z.string()).optional(),
  productSpecifications: z.string().optional(),
  productionLocation: z.string().optional(),
  considerProcurementPolicy: z.boolean().default(true),
  considerEnvironmentalPolicy: z.boolean().default(true),
  considerEsgPolicy: z.boolean().default(true),
  additionalRequirements: z.string().optional(),
});

export type SearchFormValues = z.infer<typeof searchFormSchema>;
