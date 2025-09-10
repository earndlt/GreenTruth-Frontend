import { z } from 'zod';
import { DeliveryPointData } from '../map/types/pipelineTypes';

// Update EacData to include the missing properties used in EacCard
export interface EacData {
  id: string;
  producer: string;
  certType: string;
  available: number;
  price: string;
  vintage: string;
  deliveryPoint: DeliveryPointData;
  status?: string;
  availableFrom?: string;
  energySource?: string;
  availableVolume?: number;
  description?: string;
  ferc_details?: {
    contract: string;
    effective: string;
    details: string;
  };
  organizationId?: string;
  profileId?: string;
  profileWalletId?: string;
}

export const formSchema = z.object({
  transactionType: z.enum(['spot', 'forward']),
  quantity: z.string().refine(val => {
    const num = parseInt(val);
    return !isNaN(num) && num > 0;
  }, { message: "Quantity must be a positive number" }),
  segment: z.array(z.enum(['production', 'processing', 'transportation', 'distribution', 'gathering_boosting'])),
  offtakePoint: z.string(),
  // Forward purchase specific fields
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  deliveryFrequency: z.enum(['daily', 'weekly', 'monthly', 'quarterly', 'annually']).optional(),
  dailyVolume: z.string().optional(),
  companyId: z.string()
});

export type FormValues = z.infer<typeof formSchema>;

// Convert corporateWallets to the Company format needed by CompanySelector
export const getWalletCompanies = (corporateWallets: any[]) => {
  return corporateWallets.map(wallet => ({
    id: wallet.id,
    name: wallet.name,
    walletId: wallet.walletId,
    division: wallet.id.includes('permian') ? 'Permian Operations' : 
              wallet.id.includes('usa') ? 'US Operations' : 
              wallet.id.includes('energy') ? 'Energy Trading' : 
              'Corporate'
  }));
};
