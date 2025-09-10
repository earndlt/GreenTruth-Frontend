
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useRfpForm } from '../context/RfpFormContext';
import { useProcurement } from '../context/ProcurementContext';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import ReviewHeader from './review/ReviewHeader';
import BasicInfo from './review/BasicInfo';
import CategoryAttributes from './review/CategoryAttributes';
import CustomAttributesSection from './review/CustomAttributesSection';
import VendorSection from './review/VendorSection';
import TimelineSection from './review/TimelineSection';
import ResponseInfoSection from './review/ResponseInfoSection';

const ReviewStep = () => {
  const { 
    title, 
    selectedCategory,
    mrvSubcategories,
    environmentalAttributes,
    customAttributes,
    vendorOptions,
    vendorContacts,
    timeline,
    handlePrevious,
  } = useRfpForm();
  
  const { generateResponseEmail } = useProcurement();
  const mockRfpId = 'demo-rfp-123';
  const responseEmail = generateResponseEmail(mockRfpId);
  
  const selectedMrvSubcategories = mrvSubcategories.filter(sc => sc.selected);
  const selectedAttributes = environmentalAttributes.filter(attr => attr.selected);
  
  return (
    <div className="space-y-6">
      <ReviewHeader />
      
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            <BasicInfo 
              title={title} 
              selectedCategory={selectedCategory} 
            />
            
            <CategoryAttributes 
              selectedMrvSubcategories={selectedMrvSubcategories}
              selectedAttributes={selectedAttributes}
            />
            
            <CustomAttributesSection customAttributes={customAttributes} />
            
            <VendorSection 
              vendorOptions={vendorOptions}
              vendorContacts={vendorContacts}
            />
            
            {timeline && <TimelineSection timeline={timeline} />}
            
            <ResponseInfoSection responseEmail={responseEmail} />
            
            <Alert className="bg-blue-50 border-blue-200">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-sm text-blue-800">
                Once your RFP is finalized, all vendor responses will be automatically processed by our
                AI and scored based on your company policies.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-between">
        <Button onClick={handlePrevious} variant="outline">
          Back
        </Button>
      </div>
    </div>
  );
};

export default ReviewStep;
