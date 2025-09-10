
import React from 'react';
import { FileText } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import DocumentTypeSelector from './DocumentTypeSelector';
import UploadButton from './UploadButton';
import PrivacyAlert from './PrivacyAlert';
import DocumentList from './DocumentList';
import { useDocumentUploader } from './useDocumentUploader';

const BusinessDocumentUploader = () => {
  const {
    documents,
    selectedDocumentType,
    isUploading,
    fileInputRef,
    handleDocumentTypeChange,
    triggerFileInput,
    handleFileChange,
    removeDocument,
  } = useDocumentUploader();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="h-5 w-5 mr-2 text-primary" />
          Business Documentation
        </CardTitle>
        <CardDescription>
          Upload company documents to help our AI better understand your business and provide tailored insights.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".pdf,.doc,.docx,.xlsx,.csv,.pptx"
          multiple
        />
        
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
          <div className="flex-1">
            <DocumentTypeSelector 
              value={selectedDocumentType} 
              onChange={handleDocumentTypeChange} 
            />
          </div>
          <UploadButton 
            isUploading={isUploading} 
            onClick={triggerFileInput} 
          />
        </div>
        
        <PrivacyAlert />

        <div className="mt-6">
          <h3 className="text-sm font-medium mb-2">Uploaded documents</h3>
          <DocumentList documents={documents} onRemove={removeDocument} />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-6">
        <CardDescription>
          Format supported: PDF, DOC, DOCX, XLSX, CSV, PPTX
        </CardDescription>
      </CardFooter>
    </Card>
  );
};

export default BusinessDocumentUploader;
