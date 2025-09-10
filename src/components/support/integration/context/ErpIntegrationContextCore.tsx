
import React from 'react';
import type { ErpIntegrationContextType } from './ErpIntegrationContextTypes';

const ErpIntegrationContext = React.createContext<ErpIntegrationContextType | undefined>(undefined);

export default ErpIntegrationContext;
