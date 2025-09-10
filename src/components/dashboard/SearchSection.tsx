
import React from 'react';
import { Bot, FileSearch, Upload, X, File, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { VisibilityOption } from '@/components/DocumentVisibilityDialog';

interface FileWithVisibility extends File {
  visibility?: VisibilityOption;
}

interface SearchSectionProps {
  uploadedFiles: FileWithVisibility[];
  removeFile: (index: number) => void;
  triggerUploadFlow: () => void;
  handleSearch: (e: React.FormEvent) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchSection = ({
  uploadedFiles,
  removeFile,
  triggerUploadFlow,
  handleSearch,
  fileInputRef,
  handleFileUpload
}: SearchSectionProps) => {
  const navigate = useNavigate();

  return (
    <div className="bg-card border rounded-lg p-4 shadow-sm">
      <form onSubmit={handleSearch} className="flex flex-col space-y-2">
        <div className="text-lg font-medium mb-1 flex items-center">
          Ask the greentruth AI Agent
          <Bot className="h-4 w-4 ml-2 text-muted-foreground" />
        </div>
        
        <div className="flex w-full items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              type="text" 
              placeholder="What is my current EAC balance for Q1 2025?" 
              className="pl-10 py-6" 
            />
          </div>
          <Button type="submit">
            <FileSearch className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
        
        <div className="mt-2 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Upload documents for AI insights and enhanced search
            </p>
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
              size="sm" 
              onClick={(e) => {
                e.preventDefault(); // Prevent form submission
                triggerUploadFlow();
              }}
              className="flex items-center gap-2"
            >
              <Upload size={14} />
              Upload Document
            </Button>
          </div>
          
          {uploadedFiles.length > 0 && (
            <div className="bg-muted/50 rounded-md p-2">
              <p className="text-xs text-muted-foreground mb-2">Uploaded documents:</p>
              <div className="flex flex-wrap gap-2">
                {uploadedFiles.map((file, index) => (
                  <div 
                    key={index} 
                    className="flex items-center gap-1 bg-background text-xs py-1 px-2 rounded border"
                  >
                    <File size={12} />
                    <span className="max-w-[150px] truncate">{file.name}</span>
                    {file.visibility && (
                      <span className="text-[10px] ml-1 px-1 py-0.5 rounded-full bg-muted">
                        {file.visibility}
                      </span>
                    )}
                    <button 
                      onClick={(e) => {
                        e.preventDefault(); // Prevent form submission
                        removeFile(index);
                      }}
                      className="text-muted-foreground hover:text-destructive ml-1"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default SearchSection;
