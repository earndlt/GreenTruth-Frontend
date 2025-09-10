
import React from 'react';
import { FileText, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DocumentItem, documentTypes } from './types';

interface DocumentListProps {
  documents: DocumentItem[];
  onRemove: (id: string) => void;
}

const DocumentList = ({ documents, onRemove }: DocumentListProps) => {
  if (documents.length === 0) {
    return <p className="text-sm text-muted-foreground">No documents uploaded yet</p>;
  }
  
  return (
    <div className="space-y-2">
      {documents.map((doc) => (
        <div 
          key={doc.id} 
          className="flex items-center justify-between bg-muted/50 p-3 rounded-md"
        >
          <div className="flex items-center space-x-3">
            <FileText className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-medium">{doc.name}</p>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-muted-foreground">
                  {documentTypes.find(t => t.value === doc.type)?.label || 'Document'}
                </span>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground">
                  {doc.uploadDate.toLocaleDateString()}
                </span>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground">{doc.size}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {doc.status === 'processing' ? (
              <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                Processing
              </span>
            ) : doc.status === 'ready' ? (
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full flex items-center">
                <Check className="h-3 w-3 mr-1" />
                Ready
              </span>
            ) : (
              <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                Failed
              </span>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onRemove(doc.id)}
              className="text-muted-foreground hover:text-destructive"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DocumentList;
