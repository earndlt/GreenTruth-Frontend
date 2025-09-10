
import { z } from "zod";
import { isValidReceiptLocationId } from "./utils/receiptLocations";

// Schema for counterparty info
export const counterpartyInfoSchema = z.object({
  emissionPoint: z.string(),
  knowsCounterparty: z.boolean().default(false),
  counterpartyName: z.string().optional(),
  otherCounterpartyName: z.string().optional(), // Added field for "OTHER" counterparty name
  contactName: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
});

export const kNumberMatchFormSchema = z.object({
  contractId: z.string().min(1, "Contract ID is required"),
  receiptLocationId: z.string().refine(
    (id) => id === '' || isValidReceiptLocationId(id),
    {
      message: "Please select a valid Receipt Location ID"
    }
  ).optional(),
  orderType: z.enum(["spot", "forward"]),
  pipeline: z.enum(["REX", "Ruby"]), 
  emissionPoints: z.array(z.string()).optional(), // Made optional since system auto-assigns
  dataElements: z.object({
    qetCompatible: z.boolean().optional(),
    cetCompatible: z.boolean().optional(),
    carbonNeutral: z.boolean().optional(),
    waterUsage: z.boolean().optional(),
    landUsage: z.boolean().optional(),
    airImpact: z.boolean().optional(),
    communityImpact: z.boolean().optional()
  }).optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  // Add counterparties array for storing counterparty info for each emission point
  counterparties: z.array(counterpartyInfoSchema).optional(),
}).refine((data) => {
  // Make REX receipt location required only when REX pipeline is selected
  return !(data.pipeline === 'REX' && !data.receiptLocationId);
}, {
  message: "Receipt Location ID is required for REX pipeline",
  path: ['receiptLocationId']
});

export type KNumberMatchFormValues = z.infer<typeof kNumberMatchFormSchema>;
export type CounterpartyInfo = z.infer<typeof counterpartyInfoSchema>;

export const dataElementsSchema = z.object({
  qetCompatible: z.boolean().optional(),
  cetCompatible: z.boolean().optional(),
  carbonNeutral: z.boolean().optional(),
  waterUsage: z.boolean().optional(),
  landUsage: z.boolean().optional(),
  airImpact: z.boolean().optional(),
  communityImpact: z.boolean().optional()
});

export type DataElements = z.infer<typeof dataElementsSchema>;

export interface TransactionDetails {
  quantity: string;
  segment: string[];
  offtakePoint: string;
  transactionType: "spot" | "forward";
  startDate: string;
  endDate: string;
  dailyVolume: string;
}
