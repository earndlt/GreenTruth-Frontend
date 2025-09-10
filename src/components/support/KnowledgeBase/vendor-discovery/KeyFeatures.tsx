
import React from 'react';
import { Card } from '@/components/ui/card';

const KeyFeatures = () => {
  return (
    <section>
      <h3 className="text-xl font-semibold mb-3">Key Features</h3>
      <div className="grid gap-4">
        <Card className="p-4">
          <h4 className="font-medium mb-2">Smart Vendor Discovery</h4>
          <p className="text-sm text-muted-foreground">
            Search and filter vendors based on product categories, sustainability ratings, 
            certifications, and geographic locations. Our system automatically matches vendors 
            against your organization's procurement policies and ESG requirements.
          </p>
        </Card>
        
        <Card className="p-4">
          <h4 className="font-medium mb-2">Policy Compliance Scoring</h4>
          <p className="text-sm text-muted-foreground">
            Each discovered vendor receives compliance scores across three key areas:
            environmental policies, procurement policies, and ESG standards. This helps you 
            quickly identify vendors that align with your organization's requirements.
          </p>
        </Card>
        
        <Card className="p-4">
          <h4 className="font-medium mb-2">Automated RFI Process</h4>
          <p className="text-sm text-muted-foreground">
            Generate and send Request for Information (RFI) documents to multiple vendors 
            simultaneously. The system automatically includes relevant questions based on 
            your organization's policies and the vendor's category.
          </p>
        </Card>
      </div>
    </section>
  );
};

export default KeyFeatures;
