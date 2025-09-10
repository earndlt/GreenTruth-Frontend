
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';
import ComplianceReportDialog from './generator/ComplianceReportDialog';
import EmissionsReportDialog from './generator/EmissionsReportDialog';
import ReportOptions from './generator/ReportOptions';
import ReportResultAlert from './generator/ReportResultAlert';
import ReportGenerationPanel from './generator/ReportGenerationPanel';
import { useReportGeneration } from './generator/useReportGeneration';

const AutoReportGenerator = () => {
  const {
    selectedReport,
    isGenerating,
    generatedReport,
    showComplianceDialog,
    showEmissionsDialog,
    setShowComplianceDialog,
    setShowEmissionsDialog,
    handleSelectReport,
    onSubmitComplianceForm,
    onSubmitEmissionsForm,
    generateReport,
    handleDownload,
  } = useReportGeneration();

  return (
    <>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Automated Report Generator</CardTitle>
          <CardDescription>
            Generate compliant reports based on your EAC wallet data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <ReportOptions 
              selectedReport={selectedReport} 
              onSelectReport={handleSelectReport} 
            />

            <ReportGenerationPanel 
              selectedReport={selectedReport}
              isGenerating={isGenerating}
              onGenerate={generateReport}
            />

            <ReportResultAlert 
              generatedReport={generatedReport}
              onDownload={handleDownload}
            />
          </div>
        </CardContent>
      </Card>

      <ComplianceReportDialog
        open={showComplianceDialog}
        onOpenChange={setShowComplianceDialog}
        onSubmit={onSubmitComplianceForm}
      />

      <EmissionsReportDialog
        open={showEmissionsDialog}
        onOpenChange={setShowEmissionsDialog}
        onSubmit={onSubmitEmissionsForm}
      />
    </>
  );
};

export default AutoReportGenerator;
