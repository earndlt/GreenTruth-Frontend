
import React from 'react';
import { DiscoveredVendor } from './VendorDiscovery';
import { Separator } from '@/components/ui/separator';
import VendorHeader from './details/VendorHeader';
import CompanyProfile from './details/CompanyProfile';
import ProductsServices from './details/ProductsServices';
import SustainabilityProfile from './details/SustainabilityProfile';
import PolicyMatch from './details/PolicyMatch';
import ComplianceInfo from './details/ComplianceInfo';

interface VendorDetailsViewProps {
  vendor: DiscoveredVendor;
}

const VendorDetailsView: React.FC<VendorDetailsViewProps> = ({ vendor }) => {
  return (
    <div className="space-y-6 p-2">
      <VendorHeader 
        name={vendor.name} 
        location={vendor.location} 
        matchScore={vendor.matchScore} 
      />

      <Separator />

      <CompanyProfile 
        description={vendor.description}
        category={vendor.category}
        location={vendor.location}
      />

      <Separator />

      <ProductsServices 
        products={vendor.products}
        category={vendor.category}
      />

      <Separator />

      <SustainabilityProfile 
        score={vendor.sustainability.score}
        certifications={vendor.sustainability.certifications}
      />

      <Separator />

      <PolicyMatch 
        environmental={vendor.policyMatch.environmental}
        procurement={vendor.policyMatch.procurement}
        esg={vendor.policyMatch.esg}
      />

      <Separator />
      
      <ComplianceInfo score={vendor.complianceScore} />
    </div>
  );
};

export default VendorDetailsView;
