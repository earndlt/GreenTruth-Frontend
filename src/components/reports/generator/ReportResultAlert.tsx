
import React from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FileText } from 'lucide-react';

interface ReportResultAlertProps {
  generatedReport: string | null;
  onDownload: () => void;
}

const ReportResultAlert: React.FC<ReportResultAlertProps> = ({ generatedReport, onDownload }) => {
  if (!generatedReport) return null;
  
  return (
    <Alert className="mt-4">
      <AlertTitle className="flex items-center gap-2">
        <FileText className="h-4 w-4" />
        Report Ready
      </AlertTitle>
      <AlertDescription className="flex items-center justify-between">
        <span>Your report has been generated and is ready to download.</span>
        <Button size="sm" onClick={onDownload}>Download</Button>
      </AlertDescription>
    </Alert>
  );
};

export default ReportResultAlert;
