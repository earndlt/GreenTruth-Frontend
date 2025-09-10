
import React from 'react';
import RfpResponsesTab from './rfp/RfpResponsesTab';

interface VendorResponsesTabProps {
  companyId: string;
}

const VendorResponsesTab: React.FC<VendorResponsesTabProps> = ({ companyId }) => {
  return <RfpResponsesTab companyId={companyId} />;
};

export default VendorResponsesTab;
