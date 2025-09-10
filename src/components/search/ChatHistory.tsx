
import React from 'react';

interface ChatMessage {
  text: string;
  isUser: boolean;
}

interface ChatHistoryProps {
  chatHistory: ChatMessage[];
}

const ChatHistory = ({ chatHistory }: ChatHistoryProps) => {
  if (chatHistory.length === 0) {
    return (
      <div className="text-center py-16">
        <h1 className="text-4xl font-bold text-primary mb-4">What can I help you with?</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Welcome! I'm here to help with answering questions, creating content, analyzing data, or brainstorming ideas. Just let me know what you need!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {chatHistory.map((message, index) => (
        <div 
          key={index} 
          className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
        >
          <div 
            className={`max-w-[80%] p-4 rounded-lg ${
              message.isUser 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted'
            }`}
          >
            {message.text}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatHistory;
