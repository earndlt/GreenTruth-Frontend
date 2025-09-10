
import React, { createContext, useContext } from 'react';
import { useRegulationsState } from './regulations/useRegulationsState';
import { RegulationsContextValue } from './regulations/types';

const RegulationsContext = createContext<RegulationsContextValue | undefined>(undefined);

export const RegulationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const regulationsState = useRegulationsState();
  
  return (
    <RegulationsContext.Provider value={regulationsState}>
      {children}
    </RegulationsContext.Provider>
  );
};

export const useRegulations = (): RegulationsContextValue => {
  const context = useContext(RegulationsContext);
  
  if (context === undefined) {
    throw new Error('useRegulations must be used within a RegulationsProvider');
  }
  
  return context;
};
