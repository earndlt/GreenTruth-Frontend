
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import GenerateReportButton from './GenerateReportButton';
import { ReportType, reportOptions } from './ReportOptions';

interface ReportGenerationPanelProps {
  selectedReport: ReportType | null;
  isGenerating: boolean;
  onGenerate: () => void;
}

const ReportGenerationPanel: React.FC<ReportGenerationPanelProps> = ({
  selectedReport,
  isGenerating,
  onGenerate
}) => {
  if (!selectedReport || selectedReport === 'compliance' || selectedReport === 'emissions') {
    return null;
  }

  return (
    <div className="pt-4 border-t">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">
            {reportOptions.find(r => r.id === selectedReport)?.title}
          </h3>
          <p className="text-sm text-muted-foreground">
            Using data from your EAC wallet
          </p>
        </div>
        <GenerateReportButton 
          isGenerating={isGenerating}
          onClick={onGenerate}
        />
      </div>
    </div>
  );
};

export default ReportGenerationPanel;
