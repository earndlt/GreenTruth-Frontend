
import { useState } from 'react';
import { Company } from '../../CompanySelector';
import { getWalletCompanies } from '../types';
import { corporateWallets } from '@/data/corporateWallets';

export const useCompanySelection = () => {
  const [selectedCompany, setSelectedCompany] = useState<Company>(getWalletCompanies(corporateWallets)[0]);
  const [showPaymentMethodForm, setShowPaymentMethodForm] = useState(false);
  
  const handleSelectCompany = (companyId: string) => {
    const walletCompanies = getWalletCompanies(corporateWallets);
    const company = walletCompanies.find(c => c.id === companyId);
    if (company) {
      setSelectedCompany(company);
      setShowPaymentMethodForm(false);
      return company;
    }
    return null;
  };
  
  const togglePaymentMethodForm = () => {
    setShowPaymentMethodForm(!showPaymentMethodForm);
  };
  
  return {
    selectedCompany,
    showPaymentMethodForm,
    handleSelectCompany,
    togglePaymentMethodForm
  };
};
