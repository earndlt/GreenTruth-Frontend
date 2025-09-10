
import React from 'react';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ResponseInfoSectionProps {
  responseEmail: string;
}

const ResponseInfoSection = ({ responseEmail }: ResponseInfoSectionProps) => {
  const { toast } = useToast();

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(responseEmail);
    toast({
      title: "Email Copied",
      description: "Response email address copied to clipboard",
    });
  };

  return (
    <div>
      <h4 className="text-sm font-medium">Response Information</h4>
      <div className="mt-2 border rounded-md p-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Vendor Response Email</p>
            <p className="text-sm text-blue-600">{responseEmail}</p>
          </div>
          <Button size="sm" variant="outline" onClick={handleCopyEmail}>
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          This unique email address will be automatically included in your RFP. 
          All vendor responses sent to this address will be processed by our system.
        </p>
      </div>
    </div>
  );
};

export default ResponseInfoSection;
