
import React from 'react';
import { useSearchContext } from '@/context/SearchContext';
import SearchBar from './SearchBar';
import DocumentUploader from './DocumentUploader';
import SuggestionCards from './SuggestionCards';
import ActionButtons from './ActionButtons';

const SearchContent: React.FC = () => {
  const { 
    query, 
    setQuery, 
    chatHistory,
    handleSearch, 
    uploadedFiles, 
    removeFile, 
    triggerUploadFlow, 
    fileInputRef, 
    handleFileUpload,
    handleSuggestionClick
  } = useSearchContext();

  // These suggestions would typically come from an API or be moved to a constants file
  const suggestions = [
    "How can companies implement more effective emissions measurement?",
    "What does cradle-to-gate emissions tracking entail?",
    "What methods can companies use to substantiate their sustainability credentials?",
    "Why is primary data critical for accurate sustainability reporting?",
    "How does the EU's Carbon Border Adjustment Mechanism work?"
  ];

  return (
    <>
      <div className="space-y-4 mb-6">
        <SearchBar 
          query={query} 
          setQuery={setQuery} 
          handleSearch={handleSearch} 
        />
        
        <DocumentUploader 
          uploadedFiles={uploadedFiles}
          removeFile={removeFile}
          triggerUploadFlow={triggerUploadFlow}
          fileInputRef={fileInputRef}
          handleFileUpload={handleFileUpload}
        />
      </div>

      {/* Suggestions */}
      {chatHistory.length === 0 && (
        <SuggestionCards 
          suggestions={suggestions} 
          handleSuggestionClick={handleSuggestionClick} 
        />
      )}

      {/* Action buttons */}
      {chatHistory.length === 0 && <ActionButtons />}
    </>
  );
};

export default SearchContent;
