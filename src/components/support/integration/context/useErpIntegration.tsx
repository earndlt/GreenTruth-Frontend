
import { useContext } from 'react';
import ErpIntegrationContext from './ErpIntegrationContextCore';

export const useErpIntegration = () => {
  const context = useContext(ErpIntegrationContext);
  if (context === undefined) {
    throw new Error('useErpIntegration must be used within an ErpIntegrationProvider');
  }
  return context;
};
