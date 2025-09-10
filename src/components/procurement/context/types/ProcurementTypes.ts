
export interface RfpItem {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'active' | 'closed' | 'awarded';
  dueDate: string;
  responses: number;
  createdAt: Date;
  lastEdited?: Date;
  completeness?: number;
  rfpText?: string;
}

export interface ProcurementContextType {
  rfps: RfpItem[];
  drafts: RfpItem[];
  addRfp: (rfp: Omit<RfpItem, 'id' | 'createdAt'>) => void;
  addDraft: (draft: Omit<RfpItem, 'id' | 'createdAt' | 'status'> & { completeness: number }) => void;
  updateRfp: (id: string, rfp: Partial<RfpItem>) => void;
  updateDraft: (id: string, draft: Partial<RfpItem>) => void;
  publishDraft: (id: string) => void;
}
