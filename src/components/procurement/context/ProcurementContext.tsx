
import React, { createContext, useContext, ReactNode } from 'react';
import { useProcurementState } from './hooks/useProcurementState';
import { useDraftState } from './hooks/useDraftState';
import { RfpItem } from './types/ProcurementTypes';
import { generateRfpResponseEmail } from '../utils/emailGenerator';

interface ProcurementContextType {
  rfps: RfpItem[];
  drafts: RfpItem[];
  addRfp: (rfp: Omit<RfpItem, 'id' | 'createdAt'>) => void;
  addDraft: (draft: Omit<RfpItem, 'id' | 'createdAt' | 'status'> & { completeness: number }) => void;
  updateRfp: (id: string, rfp: Partial<RfpItem>) => void;
  updateDraft: (id: string, draft: Partial<RfpItem>) => void;
  publishDraft: (id: string) => void;
  generatedDraft: string;
  setGeneratedDraft: (draft: string) => void;
  isGeneratingDraft: boolean;
  generateDraft: (formData: any) => Promise<void>;
  generateResponseEmail: (rfpId: string) => string;
}

const ProcurementContext = createContext<ProcurementContextType | undefined>(undefined);

export const ProcurementProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const {
    rfps,
    drafts,
    addRfp,
    addDraft,
    updateRfp,
    updateDraft,
    publishDraft
  } = useProcurementState();

  const {
    generatedDraft,
    setGeneratedDraft,
    isGeneratingDraft,
    generateDraft
  } = useDraftState();

  const generateResponseEmail = (rfpId: string): string => {
    return generateRfpResponseEmail(rfpId);
  };

  return (
    <ProcurementContext.Provider
      value={{
        rfps,
        drafts,
        addRfp,
        addDraft,
        updateRfp,
        updateDraft,
        publishDraft,
        generatedDraft,
        setGeneratedDraft,
        isGeneratingDraft,
        generateDraft,
        generateResponseEmail
      }}
    >
      {children}
    </ProcurementContext.Provider>
  );
};

export const useProcurement = () => {
  const context = useContext(ProcurementContext);
  if (!context) {
    throw new Error('useProcurement must be used within a ProcurementProvider');
  }
  return context;
};
