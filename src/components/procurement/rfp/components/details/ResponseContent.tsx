
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download } from 'lucide-react';
import { RfpResponse } from '../../types/RfpResponseTypes';

interface ResponseContentProps {
  response: RfpResponse;
  onNavigate: (tab: string) => void;
}

export const ResponseContent: React.FC<ResponseContentProps> = ({ response, onNavigate }) => {
  // Mock content for demo
  const content = response.responseContent || 
    `Dear ${response.vendorName},

Thank you for your interest in our RFP for ${response.rfpTitle}. We are pleased to submit our proposal which includes:

1. Detailed pricing for EACs from our renewable energy sources
2. Timeline for delivery and registration on the EarnDLT registry
3. Technical specifications of our generation facilities
4. Environmental certifications and compliance documentation
5. Our ESG policy and sustainability commitments

We confirm that all EACs will be delivered through the EarnDLT registry as specified in your RFP requirements.

We look forward to potentially working with you.

Best regards,
${response.vendorName} Team`;

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <div>
          <h3 className="text-lg font-medium">Response Content</h3>
          <p className="text-sm text-muted-foreground">
            Original response submitted by {response.vendorName}
          </p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-4">
          <pre className="whitespace-pre-wrap text-sm font-sans">{content}</pre>
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button onClick={() => onNavigate('evaluation')}>
          View AI Evaluation
        </Button>
      </div>
    </div>
  );
};
