
import React from 'react';
import { useErpIntegration } from '../context';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

const FieldMappingTab: React.FC = () => {
  const { syncFields, setSyncFields } = useErpIntegration();

  const handleFieldToggle = (field: string) => {
    setSyncFields(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const fieldGroups = [
    {
      title: "Basic Information",
      fields: ["id", "name", "email", "phone", "website", "category", "status", "location"]
    },
    {
      title: "Identification Numbers",
      fields: ["taxIdentificationNumber", "dunsNumber", "contractIds", "registrationNumber"]
    },
    {
      title: "Classification & Ratings",
      fields: ["industryClassification", "certifications", "creditRating", "supplierTier", "preferredVendorStatus", "complianceScore"]
    },
    {
      title: "Dates & Metrics",
      fields: ["onboardingDate", "lastAuditDate", "lastTransaction", "qualityRating", "performanceMetrics"]
    },
    {
      title: "Financial & Payment",
      fields: ["paymentTerms", "bankAccountDetails"]
    },
    {
      title: "Contacts & Documents",
      fields: ["contacts", "documents"]
    },
    {
      title: "Insurance & Compliance",
      fields: ["insuranceDetails", "complianceData"]
    },
    {
      title: "Additional Data",
      fields: ["transactions", "customFields"]
    }
  ];

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">Select which vendor fields should be synchronized between systems:</p>
      
      <div className="grid grid-cols-1 gap-6">
        {fieldGroups.map((group) => (
          <div key={group.title} className="space-y-4">
            <h3 className="font-medium text-sm text-muted-foreground">{group.title}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {group.fields.map((field) => (
                <div key={field} className="flex items-center justify-between space-x-2">
                  <Label htmlFor={`${field}-sync`} className="flex-1">
                    {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </Label>
                  <Switch 
                    id={`${field}-sync`} 
                    checked={syncFields[field]} 
                    onCheckedChange={() => handleFieldToggle(field)}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FieldMappingTab;
