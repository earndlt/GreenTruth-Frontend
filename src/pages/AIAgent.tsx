
import React from 'react';
import DocumentVisibilityDialog from '@/components/DocumentVisibilityDialog';
import SearchHeader from '@/components/search/SearchHeader';
import SearchContent from '@/components/search/SearchContent';
import { SearchProvider, useSearchContext } from '@/context/SearchContext';

const SearchPage: React.FC = () => {
  const { 
    visibilityDialogOpen, 
    setVisibilityDialogOpen, 
    selectedVisibility, 
    setSelectedVisibility, 
    handleVisibilitySelect 
  } = useSearchContext();

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="max-w-4xl mx-auto">
        <SearchHeader />
        <SearchContent />
      </div>

      {/* Document Visibility Dialog */}
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

// Wrap the component with the context provider
const Search: React.FC = () => {
  return (
    <SearchProvider>
      <SearchPage />
    </SearchProvider>
  );
};

export default Search;
