
import React, { createContext, useState, useContext, ReactNode, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { VisibilityOption } from '@/components/DocumentVisibilityDialog';

interface FileWithVisibility extends File {
  visibility?: VisibilityOption;
}

interface SearchContextType {
  query: string;
  setQuery: (value: string) => void;
  chatHistory: { text: string; isUser: boolean }[];
  setChatHistory: React.Dispatch<React.SetStateAction<{ text: string; isUser: boolean }[]>>;
  uploadedFiles: FileWithVisibility[];
  setUploadedFiles: React.Dispatch<React.SetStateAction<FileWithVisibility[]>>;
  visibilityDialogOpen: boolean;
  setVisibilityDialogOpen: (open: boolean) => void;
  selectedVisibility: VisibilityOption | null;
  setSelectedVisibility: React.Dispatch<React.SetStateAction<VisibilityOption | null>>;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleSearch: (e: React.FormEvent) => void;
  handleSuggestionClick: (suggestion: string) => void;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleVisibilitySelect: (visibility: VisibilityOption) => void;
  removeFile: (index: number) => void;
  triggerUploadFlow: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [query, setQuery] = useState('');
  const [chatHistory, setChatHistory] = useState<{ text: string; isUser: boolean }[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<FileWithVisibility[]>([]);
  const [visibilityDialogOpen, setVisibilityDialogOpen] = useState(false);
  const [selectedVisibility, setSelectedVisibility] = useState<VisibilityOption | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    // Add user query to chat history
    setChatHistory([...chatHistory, { text: query, isUser: true }]);
    
    // Simulate response (in a real app, this would be an API call)
    setTimeout(() => {
      setChatHistory(prev => [
        ...prev, 
        { 
          text: "Welcome! I'm here to help with answering questions, creating content, analyzing data, or brainstorming ideas. Just let me know what you need!", 
          isUser: false 
        }
      ]);
    }, 1000);
    
    setQuery('');
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
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
      
      // Reset the file input value so the same file can be selected again if needed
      e.target.value = '';
      setSelectedVisibility(null);
    }
  };

  const handleVisibilitySelect = (visibility: VisibilityOption) => {
    setSelectedVisibility(visibility);
    setVisibilityDialogOpen(false);
    
    // Trigger file selection after visibility is chosen
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

  const value = {
    query,
    setQuery,
    chatHistory,
    setChatHistory,
    uploadedFiles,
    setUploadedFiles,
    visibilityDialogOpen,
    setVisibilityDialogOpen,
    selectedVisibility,
    setSelectedVisibility,
    fileInputRef,
    handleSearch,
    handleSuggestionClick,
    handleFileUpload,
    handleVisibilitySelect,
    removeFile,
    triggerUploadFlow
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearchContext = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearchContext must be used within a SearchProvider');
  }
  return context;
};
