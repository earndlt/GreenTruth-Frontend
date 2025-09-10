
import { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { DocumentItem } from './types';

// Sample documents - in a real app, this would come from an API
const initialDocuments: DocumentItem[] = [
  {
    id: '1',
    name: '2024-sustainability-report.pdf',
    type: 'esg-report',
    uploadDate: new Date(2024, 2, 15),
    status: 'ready',
    size: '3.2 MB',
  },
  {
    id: '2',
    name: 'carbon-reduction-methodology.pdf',
    type: 'methodologies',
    uploadDate: new Date(2024, 1, 28),
    status: 'ready',
    size: '1.8 MB',
  },
];

export const useDocumentUploader = () => {
  const [documents, setDocuments] = useState<DocumentItem[]>(initialDocuments);
  const [selectedDocumentType, setSelectedDocumentType] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDocumentTypeChange = (value: string) => {
    setSelectedDocumentType(value);
  };

  const triggerFileInput = () => {
    if (selectedDocumentType) {
      fileInputRef.current?.click();
    } else {
      toast({
        title: "Document type required",
        description: "Please select a document type before uploading.",
        variant: "destructive",
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsUploading(true);
      
      // Simulate processing
      setTimeout(() => {
        const newDocuments = Array.from(e.target.files!).map((file, index) => ({
          id: Date.now().toString() + index,
          name: file.name,
          type: selectedDocumentType,
          uploadDate: new Date(),
          status: 'ready' as const,
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        }));
        
        setDocuments((prev) => [...newDocuments, ...prev]);
        setIsUploading(false);
        e.target.value = '';
        
        toast({
          title: "Document uploaded",
          description: "Your document is now available for AI analysis.",
        });
      }, 1500);
    }
  };

  const removeDocument = (id: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
    toast({
      title: "Document removed",
      description: "The document has been removed from your profile.",
    });
  };

  return {
    documents,
    selectedDocumentType,
    isUploading,
    fileInputRef,
    handleDocumentTypeChange,
    triggerFileInput,
    handleFileChange,
    removeDocument,
  };
};
