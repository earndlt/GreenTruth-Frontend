
import React from 'react';
import { Company } from '../../CompanySelector';

interface CompanySectionProps {
  selectedCompany: Company;
}

const CompanySection: React.FC<CompanySectionProps> = ({ selectedCompany }) => {
  return (
    <div className="border-b pb-3">
      <p className="font-medium mb-2">Corporate Entity:</p>
      <div className="bg-gray-50 p-2 rounded">
        <p>{selectedCompany.name}</p>
        {selectedCompany.division && (
          <p className="text-sm text-gray-500">{selectedCompany.division}</p>
        )}
        <p className="text-sm text-gray-500">Wallet ID: {selectedCompany.walletId}</p>
      </div>
    </div>
  );
};

export default CompanySection;
