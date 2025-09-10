
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface SuggestionCardsProps {
  suggestions: string[];
  handleSuggestionClick: (suggestion: string) => void;
}

const SuggestionCards = ({ suggestions, handleSuggestionClick }: SuggestionCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {suggestions.map((suggestion, index) => (
        <Card 
          key={index} 
          className="hover:bg-accent cursor-pointer transition-colors border-muted"
          onClick={() => handleSuggestionClick(suggestion)}
        >
          <CardContent className="p-4">
            <p className="text-sm">{suggestion}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SuggestionCards;
