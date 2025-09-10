
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface InviteVendorStepProps {
  vendorData: any;
  onComplete: () => void;
  companyName?: string;
}

const InviteVendorStep: React.FC<InviteVendorStepProps> = ({ 
  vendorData, 
  onComplete,
  companyName
}) => {
  const [inviteType, setInviteType] = useState<'email' | 'manual'>('email');
  const [isSending, setIsSending] = useState(false);
  const [emailContent, setEmailContent] = useState(generateInviteEmail(vendorData, companyName));
  const { toast } = useToast();

  const handleSendInvite = () => {
    setIsSending(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSending(false);
      toast({
        title: "Invitation Sent",
        description: `Invitation sent to ${vendorData.name}${companyName ? ` for ${companyName}` : ''}.`,
      });
      onComplete();
    }, 1500);
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-muted/50 p-4 rounded-md">
        <h3 className="text-sm font-medium mb-2">Vendor Information</h3>
        <div className="space-y-1">
          <div className="flex items-start">
            <span className="font-medium text-sm min-w-[120px]">Name:</span>
            <span className="text-sm">{vendorData.name}</span>
          </div>
          <div className="flex items-start">
            <span className="font-medium text-sm min-w-[120px]">Email:</span>
            <span className="text-sm">{vendorData.email}</span>
          </div>
          <div className="flex items-start">
            <span className="font-medium text-sm min-w-[120px]">Category:</span>
            <span className="text-sm">{vendorData.category}</span>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="email" onValueChange={(value) => setInviteType(value as 'email' | 'manual')}>
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="email">Send Email Invitation</TabsTrigger>
          <TabsTrigger value="manual">Manual Invitation</TabsTrigger>
        </TabsList>
        
        <TabsContent value="email">
          <div className="space-y-4">
            <p className="text-sm">
              Send an email invitation to this vendor to create an account in your GreenTruth vendor portal
              {companyName ? ` for ${companyName}` : ''}.
            </p>
            
            <div className="relative">
              <Textarea
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
                className="min-h-[250px] font-mono text-sm"
              />
            </div>
            
            <Button 
              onClick={handleSendInvite} 
              disabled={isSending}
              className="w-full"
            >
              {isSending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Invitation
                </>
              )}
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="manual">
          <div className="space-y-4">
            <p className="text-sm">
              Manually invite this vendor to your GreenTruth portal
              {companyName ? ` for ${companyName}` : ''}. You'll need to provide them with the following information:
            </p>
            
            <div className="bg-muted p-4 rounded-md space-y-3">
              <div>
                <p className="text-sm font-medium">Vendor Portal URL:</p>
                <p className="text-sm font-mono bg-background p-2 rounded mt-1">https://vendors.greentruth.com/register</p>
              </div>
              
              <div>
                <p className="text-sm font-medium">Registration Code:</p>
                <p className="text-sm font-mono bg-background p-2 rounded mt-1">VENDOR-{Math.random().toString(36).substring(2, 10).toUpperCase()}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium">Company to register with:</p>
                <p className="text-sm font-mono bg-background p-2 rounded mt-1">{companyName || 'Your Company'}</p>
              </div>
            </div>
            
            <Button 
              onClick={onComplete} 
              variant="outline"
              className="w-full"
            >
              Mark as Manually Invited
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

function generateInviteEmail(vendorData: any, companyName?: string) {
  return `Dear ${vendorData.name},

We're pleased to invite you to join our vendor portal${companyName ? ` for ${companyName}` : ''}.

As a valued supplier, we're streamlining our procurement processes through the GreenTruth platform, which will enable more efficient collaboration on RFPs, contract management, and payments.

To get started, please click the link below to create your account:
https://vendors.greentruth.com/register?code=VENDOR-${Math.random().toString(36).substring(2, 10).toUpperCase()}

If you have any questions, please don't hesitate to contact our procurement team.

Regards,
${companyName || 'The Procurement Team'}`;
}

export default InviteVendorStep;
