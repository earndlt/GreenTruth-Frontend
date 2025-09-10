
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw } from 'lucide-react';

interface GenerateReportButtonProps {
  isGenerating: boolean;
  onClick: () => void;
  disabled?: boolean;
}

const GenerateReportButton: React.FC<GenerateReportButtonProps> = ({ 
  isGenerating,
  onClick,
  disabled = false
}) => {
  return (
    <Button 
      onClick={onClick} 
      disabled={disabled || isGenerating}
    >
      {isGenerating ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <RefreshCw className="h-4 w-4 mr-2" />
          Generate Report
        </>
      )}
    </Button>
  );
};

export default GenerateReportButton;
