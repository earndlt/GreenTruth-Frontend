
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ReportType } from './ReportOptions';
import { ComplianceFormValues, regulationOptions } from './ComplianceReportDialog';
import { EmissionsFormValues, carbonStandardOptions, scopeOptions } from './EmissionsReportDialog';
import { productOptions } from './ComplianceReportDialog';

export const useReportGeneration = () => {
  const [selectedReport, setSelectedReport] = useState<ReportType | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<string | null>(null);
  const [showComplianceDialog, setShowComplianceDialog] = useState(false);
  const [showEmissionsDialog, setShowEmissionsDialog] = useState(false);
  const { toast } = useToast();

  const handleSelectReport = (type: ReportType) => {
    setSelectedReport(type);
    setGeneratedReport(null);
    
    if (type === 'compliance') {
      setShowComplianceDialog(true);
    } else if (type === 'emissions') {
      setShowEmissionsDialog(true);
    }
  };

  const onSubmitComplianceForm = async (values: ComplianceFormValues) => {
    setShowComplianceDialog(false);
    setIsGenerating(true);
    
    // Simulate API call to generate report
    try {
      // In a real implementation, this would call an API endpoint with the form values
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      const regulation = regulationOptions.find(r => r.id === values.regulation)?.name;
      const product = productOptions.find(p => p.id === values.product)?.name;
      
      // Mock generated report data
      const reportData = `${regulation} Compliance Report for ${product} - ${new Date().toISOString()}`;
      setGeneratedReport(reportData);
      
      toast({
        title: "Report generated successfully",
        description: `Your compliance report for ${product} under ${regulation} is ready to download.`,
      });
    } catch (error) {
      toast({
        title: "Failed to generate report",
        description: "An error occurred while generating your report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const onSubmitEmissionsForm = async (values: EmissionsFormValues) => {
    setShowEmissionsDialog(false);
    setIsGenerating(true);
    
    // Simulate API call to generate report
    try {
      // In a real implementation, this would call an API endpoint with the form values
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      const standard = carbonStandardOptions.find(s => s.id === values.standard)?.name;
      const product = productOptions.find(p => p.id === values.product)?.name;
      const scope = values.scope ? scopeOptions.find(s => s.id === values.scope)?.name : 'All Scopes';
      
      // Mock generated report data
      const reportData = `${standard} Carbon Emissions Report for ${product} - ${scope} - ${new Date().toISOString()}`;
      setGeneratedReport(reportData);
      
      toast({
        title: "Report generated successfully",
        description: `Your carbon emissions report for ${product} using ${standard} is ready to download.`,
      });
    } catch (error) {
      toast({
        title: "Failed to generate report",
        description: "An error occurred while generating your report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateReport = async () => {
    if (!selectedReport || selectedReport === 'compliance' || selectedReport === 'emissions') return;
    
    setIsGenerating(true);
    
    // Simulate API call to generate report
    try {
      await new Promise(resolve => setTimeout(resolve, 2500));
      const reportData = `${selectedReport.charAt(0).toUpperCase() + selectedReport.slice(1)} Report ${new Date().toISOString()}`;
      setGeneratedReport(reportData);
      
      toast({
        title: "Report generated successfully",
        description: `Your ${selectedReport} report is ready to download.`,
      });
    } catch (error) {
      toast({
        title: "Failed to generate report",
        description: "An error occurred while generating your report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedReport) return;
    
    // In a real implementation, this would trigger a file download
    toast({
      title: "Report downloaded",
      description: "Your report has been downloaded successfully.",
    });
  };

  return {
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
  };
};
