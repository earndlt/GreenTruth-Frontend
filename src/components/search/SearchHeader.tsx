
import React from 'react';
import { useSearchContext } from '@/context/SearchContext';
import ChatHistory from '@/components/search/ChatHistory';

const SearchHeader: React.FC = () => {
  const { chatHistory } = useSearchContext();

  return (
    <div className="min-h-[300px] mb-6">
      <ChatHistory chatHistory={chatHistory} />
    </div>
  );
};

export default SearchHeader;
