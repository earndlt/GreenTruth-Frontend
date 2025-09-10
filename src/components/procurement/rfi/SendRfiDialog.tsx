
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Check } from 'lucide-react';
import RfiForm from './RfiForm';
import { DiscoveredVendor } from '@/components/vendor-discovery/VendorDiscovery';
import { ScrollArea } from '@/components/ui/scroll-area';
import { generateRfpDraft } from '../utils/generators/draftGenerator';
import { useBusinessProfileForm } from '@/hooks/use-business-profile-form';
import RfiDraftPreviewStep from './RfiDraftPreviewStep';
import { generateRfiDraft } from './generator/rfiDraftGenerator';

interface SendRfiDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vendors: DiscoveredVendor[];
  companyId?: string;
  companyName?: string;
}

const SendRfiDialog: React.FC<SendRfiDialogProps> = ({ 
  open, 
  onOpenChange, 
  vendors,
  companyId,
  companyName = ''
}) => {
  const [step, setStep] = useState<'form' | 'review' | 'success'>('form');
  const [formValues, setFormValues] = useState<any>(null);
  const [draftText, setDraftText] = useState<string>('');
  const [isGeneratingDraft, setIsGeneratingDraft] = useState(false);
  const [emailAddress, setEmailAddress] = useState('');
  const { toast } = useToast();
  const { form } = useBusinessProfileForm();

  // Generate business profile once
  const businessProfile = {
    companyName: companyName || form.getValues('companyName'),
    industry: form.getValues('industry'),
    mission: form.getValues('mission'),
    sustainabilityGoals: form.getValues('sustainabilityGoals'),
  };
  const vendorNames = vendors.map(v => v.name);

  // When user submits RFI form, generate draft and go to review step
  const handleFormSubmit = async (data: any) => {
    setIsGeneratingDraft(true);
    setFormValues(data);

    // Generate draft text
    const draft = generateRfiDraft(data, businessProfile, vendorNames);
    setDraftText(draft);
    setStep('review');
    setIsGeneratingDraft(false);
  };

  // Regenerate draft function (called from preview component)
  const handleRegenerateDraft = async () => {
    if (!formValues) return draftText;
    setIsGeneratingDraft(true);
    const newDraft = generateRfiDraft(formValues, businessProfile, vendorNames);
    setDraftText(newDraft);
    setIsGeneratingDraft(false);
    return newDraft;
  };

  // Send RFI (only from preview step)
  const handleSend = (finalDraft: string) => {
    // Generate a unique email for RFI responses
    const uniqueId = Math.random().toString(36).substring(2, 10);
    const companyPrefix = companyId ? companyId.toLowerCase().replace(/[^a-z0-9]/g, '-') : '';
    const generatedEmail = `rfi-${companyPrefix}-${uniqueId}@rfi.greentruth.com`;
    setEmailAddress(generatedEmail);

    // Pretend to send to backend (simulate send)
    toast({
      title: "RFI Sent Successfully",
      description: `Your RFI from ${businessProfile.companyName} has been sent to ${vendors.length} vendor(s).`,
    });

    setStep('success');
  };

  const handleClose = () => {
    setStep('form');
    setFormValues(null);
    setDraftText('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        {step === 'form' && (
          <ScrollArea className="max-h-[80vh]">
            <div className="p-1">
              <DialogHeader>
                <DialogTitle>
                  Send Request for Information (RFI)
                  {companyName && ` from ${companyName}`}
                </DialogTitle>
                <DialogDescription>
                  Request detailed information from potential vendors about their products, services, and business practices.
                </DialogDescription>
              </DialogHeader>
              <RfiForm
                vendors={vendors}
                onSubmit={handleFormSubmit}
                companyName={companyName}
              />
            </div>
          </ScrollArea>
        )}
        {step === 'review' && (
          <RfiDraftPreviewStep
            initialDraft={draftText}
            isGenerating={isGeneratingDraft}
            onRegenerate={handleRegenerateDraft}
            onConfirm={handleSend}
            onBack={() => setStep('form')}
          />
        )}
        {step === 'success' && (
          <div className="space-y-4 py-4 flex flex-col items-center text-center">
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center text-green-700 mx-auto">
              <Check className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-semibold">RFI Sent Successfully!</h2>
            <p className="text-muted-foreground">
              Your Request for Information from {businessProfile.companyName} has been sent to {vendors.length} vendor(s).
            </p>
            <div className="bg-muted p-4 rounded-lg w-full">
              <p className="font-medium text-sm">Responses will be sent to:</p>
              <p className="text-primary font-mono mt-1">{emailAddress}</p>
              <p className="text-xs text-muted-foreground mt-2">
                Our system will automatically process responses and grade them according to your policies.
              </p>
            </div>
            <Button onClick={handleClose} className="mt-4">
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SendRfiDialog;
