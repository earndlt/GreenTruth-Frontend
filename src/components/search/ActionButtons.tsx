
import React from 'react';
import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSearchContext } from '@/context/SearchContext';

const ActionButtons = () => {
  const { setChatHistory } = useSearchContext();
  
  const handleNewChat = () => {
    setChatHistory([]);
  };

  return (
    <div className="mt-8 flex flex-wrap gap-4 justify-center">
      <Button variant="outline" className="gap-2" onClick={handleNewChat}>
        <MessageSquare size={18} />
        New Chat
      </Button>
    </div>
  );
};

export default ActionButtons;
