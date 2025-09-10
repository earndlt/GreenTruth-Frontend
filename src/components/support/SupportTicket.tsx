
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ExternalLink } from 'lucide-react';

const SupportTicket = () => {
  const openHubspotTicket = () => {
    // This would be replaced with your actual Hubspot ticket URL
    window.open('https://yourdomain.hubspot.com/customer-support', '_blank');
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Contact Support</CardTitle>
          <CardDescription>
            Our support team is here to help you with any questions or issues
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>You can submit a support ticket directly through our ticketing system:</p>
          <Button 
            onClick={openHubspotTicket} 
            className="flex items-center"
          >
            Open Support Ticket <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
          
          <Separator className="my-4" />
          
          <div>
            <h3 className="text-md font-medium mb-2">Support Hours</h3>
            <p>Monday to Friday: 9:00 AM - 6:00 PM EST</p>
            <p>Expected Response Time: Within 24 hours</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupportTicket;
