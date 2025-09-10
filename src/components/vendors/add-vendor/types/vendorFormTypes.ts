import { z } from 'zod';

export const vendorSchema = z.object({
  name: z.string().min(1, "Vendor name is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  phone: z.string().optional(),
  website: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  description: z.string().optional(),
  addressLine1: z.string().min(1, "Street address is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  stateProvince: z.string().min(1, "State/Province is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
  paymentTerms: z.string(),
  earndltClearing: z.boolean(),
});

export type VendorFormValues = z.infer<typeof vendorSchema>;

export interface VendorFormProps {
  onSubmit: (data: VendorFormValues, inviteVendor: boolean) => void;
  initialData?: {
    name?: string;
    email?: string;
    category?: string;
  };
}

export interface NewVendorData extends VendorFormValues {
  id: string;
  complianceScore: number;
  status: 'active' | 'inactive';
  lastTransaction: string;
  companyId?: string;
}
