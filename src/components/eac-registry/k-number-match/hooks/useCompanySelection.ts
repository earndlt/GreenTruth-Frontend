
import { useState } from 'react';
import { Company } from '../../CompanySelector';
import { corporateWallets } from '@/data/corporateWallets';

export const useCompanySelection = () => {
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const handleSelectCompany = (companyId: string) => {
    const company = corporateWallets.find(w => w.id === companyId);
    if (company) {
      setSelectedCompany({
        id: company.id,
        name: company.name,
        division: company.division,
        walletId: company.walletId,
        paymentMethods: [
          {
            id: 'default-method',
            type: 'credit-card',
            isPrimary: true
          }
        ]
      });
    }
  };

  return {
    selectedCompany,
    handleSelectCompany
  };
};
