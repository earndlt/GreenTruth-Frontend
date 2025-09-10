
import React, { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import DocumentVisibilityDialog, { VisibilityOption } from '@/components/DocumentVisibilityDialog';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import SearchSection from '@/components/dashboard/SearchSection';
import SummaryCards from '@/components/dashboard/SummaryCards';
import AlertsAndComplianceSection from '@/components/dashboard/AlertsAndComplianceSection';
import ProcurementAndProtocolSection from '@/components/dashboard/ProcurementAndProtocolSection';
import PipelineEacCard from '@/components/dashboard/cards/PipelineEacCard';

interface FileWithVisibility extends File {
  visibility?: VisibilityOption;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [uploadedFiles, setUploadedFiles] = useState<FileWithVisibility[]>([]);
  const [visibilityDialogOpen, setVisibilityDialogOpen] = useState(false);
  const [selectedVisibility, setSelectedVisibility] = useState<VisibilityOption | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/search');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && selectedVisibility) {
      const newFiles = Array.from(e.target.files);
      
      const filesWithVisibility = newFiles.map(file => {
        const fileWithVisibility = file as FileWithVisibility;
        fileWithVisibility.visibility = selectedVisibility;
        return fileWithVisibility;
      });
      
      setUploadedFiles((prevFiles) => [...prevFiles, ...filesWithVisibility]);
      
      toast({
        title: "Documents uploaded",
        description: `${filesWithVisibility.length} document${filesWithVisibility.length > 1 ? 's' : ''} uploaded with ${selectedVisibility} visibility.`,
      });
      
      e.target.value = '';
      setSelectedVisibility(null);
    }
  };

  const handleVisibilitySelect = (visibility: VisibilityOption) => {
    setSelectedVisibility(visibility);
    setVisibilityDialogOpen(false);
    
    setTimeout(() => {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    }, 100);
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };
  
  const triggerUploadFlow = () => {
    setVisibilityDialogOpen(true);
  };

  return (
    <div className="p-6 space-y-8">
      <DashboardHeader />
      
      <div className="grid grid-cols-1 gap-6">
        {/* Search Section moved to the top - Full Width */}
        <div className="border rounded-lg bg-card shadow-sm overflow-hidden">
          <div className="bg-muted/30 px-4 py-2">
            <h3 className="text-sm font-medium">Document Search & Upload</h3>
          </div>
          <div className="p-4">
            <SearchSection 
              uploadedFiles={uploadedFiles}
              removeFile={removeFile}
              triggerUploadFlow={triggerUploadFlow}
              handleSearch={handleSearch}
              fileInputRef={fileInputRef}
              handleFileUpload={handleFileUpload}
            />
          </div>
        </div>
        
        {/* Summary Section - Full Width */}
        <div className="border rounded-lg bg-card shadow-sm overflow-hidden">
          <div className="bg-muted/30 px-4 py-2">
            <h3 className="text-sm font-medium">Summary</h3>
          </div>
          <div className="p-4">
            <SummaryCards />
          </div>
        </div>
        
        {/* Pipeline EACs Section - Full Width */}
        <div className="border rounded-lg bg-card shadow-sm overflow-hidden">
          <div className="bg-muted/30 px-4 py-2">
            <h3 className="text-sm font-medium">Pipeline EACs</h3>
          </div>
          <div className="p-4">
            <PipelineEacCard />
          </div>
        </div>
        
        {/* Alerts & Compliance Section - Full Width */}
        <div className="border rounded-lg bg-card shadow-sm overflow-hidden">
          <div className="bg-muted/30 px-4 py-2">
            <h3 className="text-sm font-medium">Alerts & Compliance</h3>
          </div>
          <div className="p-4">
            <AlertsAndComplianceSection />
          </div>
        </div>
        
        {/* Procurement & Protocol Section - Full Width */}
        <div className="border rounded-lg bg-card shadow-sm overflow-hidden">
          <div className="bg-muted/30 px-4 py-2">
            <h3 className="text-sm font-medium">Procurement & Protocol</h3>
          </div>
          <div className="p-4">
            <ProcurementAndProtocolSection />
          </div>
        </div>
      </div>

      <DocumentVisibilityDialog
        open={visibilityDialogOpen}
        onClose={() => {
          setVisibilityDialogOpen(false);
          setSelectedVisibility(null);
        }}
        onConfirm={handleVisibilitySelect}
        selectionMode={true}
      />
    </div>
  );
};

export default Dashboard;
