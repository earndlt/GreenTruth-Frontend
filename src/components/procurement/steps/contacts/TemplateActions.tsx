
import React, { useRef, useState } from 'react';
import { Download, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface TemplateActionsProps {
  downloadTemplate: () => void;
  handleFileUpload: (file: File) => void;
}

const TemplateActions: React.FC<TemplateActionsProps> = ({ 
  downloadTemplate, 
  handleFileUpload 
}) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const openFileDialog = () => {
    // Log before attempting to click
    console.log("Opening file dialog");
    if (fileInputRef.current) {
      console.log("File input ref exists, clicking");
      fileInputRef.current.click();
    } else {
      console.log("File input ref is null");
    }
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("File input changed", e.target.files);
    const file = e.target.files?.[0];
    if (file) {
      console.log("Selected file:", file.name, file.type);
      
      // Check file extension and MIME type
      const extension = file.name.split('.').pop()?.toLowerCase();
      console.log("File extension:", extension);
      
      if (extension !== 'csv') {
        toast({
          title: "Invalid File Type",
          description: "Please upload a CSV (.csv) file only",
          variant: "destructive"
        });
        return;
      }
      
      handleFileUpload(file);
      
      // Reset the file input so the same file can be selected again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Handle drag events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      console.log("Dropped file:", file.name, file.type);
      
      // Check file extension
      const extension = file.name.split('.').pop()?.toLowerCase();
      
      if (extension !== 'csv') {
        toast({
          title: "Invalid File Type",
          description: "Please upload a CSV (.csv) file only",
          variant: "destructive"
        });
        return;
      }
      
      handleFileUpload(file);
    }
  };

  return (
    <div className="flex space-x-2">
      <Button 
        variant="outline" 
        size="sm" 
        className="flex items-center gap-1" 
        onClick={downloadTemplate}
      >
        <Download className="h-4 w-4" />
        Template
      </Button>
      
      <div 
        className={`relative ${isDragging ? 'ring-2 ring-primary' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1" 
          onClick={openFileDialog}
          type="button"
        >
          <Upload className="h-4 w-4" />
          Upload CSV
        </Button>
        <input 
          ref={fileInputRef}
          type="file" 
          className="hidden" 
          // Use a comprehensive but simple accept attribute
          accept=".csv" 
          onChange={handleUpload} 
          onClick={(e) => console.log("File input clicked", e)}
        />
      </div>
    </div>
  );
};

export default TemplateActions;
