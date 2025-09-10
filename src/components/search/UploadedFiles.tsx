
import React from 'react';
import { File, X } from 'lucide-react';
import { VisibilityOption } from '@/components/DocumentVisibilityDialog';

interface FileWithVisibility extends File {
  visibility?: VisibilityOption;
}

interface UploadedFilesProps {
  uploadedFiles: FileWithVisibility[];
  removeFile: (index: number) => void;
}

const UploadedFiles = ({ uploadedFiles, removeFile }: UploadedFilesProps) => {
  if (uploadedFiles.length === 0) {
    return null;
  }

  return (
    <div className="bg-muted/50 rounded-md p-3">
      <p className="text-sm mb-2">Uploaded documents:</p>
      <div className="flex flex-wrap gap-2">
        {uploadedFiles.map((file, index) => (
          <div 
            key={index} 
            className="flex items-center gap-1 bg-background text-sm py-1 px-2 rounded border"
          >
            <File size={14} />
            <span className="max-w-[200px] truncate">{file.name}</span>
            {file.visibility && (
              <span className="text-xs ml-1 px-1.5 py-0.5 rounded-full bg-muted">
                {file.visibility}
              </span>
            )}
            <button 
              onClick={() => removeFile(index)}
              className="text-muted-foreground hover:text-destructive ml-1"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UploadedFiles;
