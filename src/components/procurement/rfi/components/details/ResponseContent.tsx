
import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { RfiResponse } from '../../types/RfiTypes';

interface ResponseContentProps {
  response: RfiResponse;
  onNavigate: (tab: string) => void;
}

export const ResponseContent: React.FC<ResponseContentProps> = ({ response, onNavigate }) => {
  return (
    <div className="bg-muted p-4 rounded-lg">
      <p className="text-sm text-muted-foreground mb-4">
        This is where the actual RFI response content would be displayed. For this demo, we're showing placeholder content.
      </p>
      
      <div className="space-y-4">
        <section>
          <h3 className="font-semibold">Business Details</h3>
          <p>
            {response.vendorName} is a leading provider of {response.category.toLowerCase()} solutions with operations across North America. Established in 2005, we have grown to employ over 500 staff with annual revenue exceeding $100M.
          </p>
        </section>
        
        <Separator />
        
        <section>
          <h3 className="font-semibold">Payment Terms</h3>
          <p>
            We offer flexible payment terms with Net 30, 60, or 90 options available depending on contract value. Volume discounts are available for large orders, and we accept all major payment methods including bank transfers and credit cards.
          </p>
        </section>
        
        <Separator />
        
        <section>
          <h3 className="font-semibold">Delivery Details</h3>
          <p>
            Our standard delivery time is 10-15 business days after order confirmation. We maintain distribution centers in Texas, California, and Illinois for efficient nationwide delivery. Custom delivery schedules can be arranged for long-term contracts.
          </p>
        </section>
        
        <Separator />
        
        <section>
          <h3 className="font-semibold">Environmental Information</h3>
          <p>
            We are committed to environmental stewardship, with ISO 14001 certification across all our facilities. Our products reduce carbon emissions by an average of 30% compared to traditional alternatives, and we have pledged to be carbon-neutral by 2030.
          </p>
        </section>
        
        <Separator />
        
        <section>
          <h3 className="font-semibold">ESG Compliance</h3>
          <p>
            Our company adheres to the highest ESG standards, publishing annual sustainability reports verified by third-party auditors. We maintain strict supplier ethics guidelines and have been recognized with the EcoVadis Gold Rating for three consecutive years.
          </p>
        </section>
      </div>
      
      <div className="flex justify-end mt-6">
        <Button onClick={() => onNavigate('evaluation')}>
          View LLM Evaluation
        </Button>
      </div>
    </div>
  );
};
