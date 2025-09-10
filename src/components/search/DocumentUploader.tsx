
import React from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VisibilityOption } from '@/components/DocumentVisibilityDialog';
import UploadedFiles from './UploadedFiles';

interface FileWithVisibility extends File {
  visibility?: VisibilityOption;
}

interface DocumentUploaderProps {
  uploadedFiles: FileWithVisibility[];
  removeFile: (index: number) => void;
  triggerUploadFlow: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const DocumentUploader = ({
  uploadedFiles,
  removeFile,
  triggerUploadFlow,
  fileInputRef,
  handleFileUpload
}: DocumentUploaderProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileUpload}
          accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt"
        />
        <Button 
          variant="outline" 
          className="w-full gap-2" 
          onClick={triggerUploadFlow}
        >
          <Upload size={18} />
          Upload Document
        </Button>
      </div>
      
      <UploadedFiles uploadedFiles={uploadedFiles} removeFile={removeFile} />
    </div>
  );
};

export default DocumentUploader;
