
import React from 'react';
import { Button } from "@/components/ui/button";
import { ExternalLink } from 'lucide-react';

const AdditionalHelp = () => {
  return (
    <div className="border-t pt-4 flex flex-col space-y-4">
      <div>
        <h3 className="text-xl font-medium mb-2">Need Additional Help?</h3>
        <p className="text-sm text-muted-foreground">
          If you have specific questions about GreenTruth functionality or need personalized assistance:
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          Schedule a Demo
          <ExternalLink className="h-3 w-3" />
        </Button>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          Contact Support
          <ExternalLink className="h-3 w-3" />
        </Button>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          View Training Videos
          <ExternalLink className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};

export default AdditionalHelp;
