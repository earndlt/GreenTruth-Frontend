
import React, { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  query: string;
  setQuery: (value: string) => void;
  handleSearch: (e: React.FormEvent) => void;
}

const SearchBar = ({ query, setQuery, handleSearch }: SearchBarProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <form onSubmit={handleSearch} className="relative">
      <div className="relative flex items-center">
        <Input
          ref={inputRef}
          type="text"
          placeholder="What is BASF's Scope 3 emissions target for 2030?"
          className="pr-12 py-6 text-base"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button 
          type="submit" 
          size="icon" 
          className="absolute right-2 rounded-full"
        >
          <ArrowRight className="h-5 w-5" />
        </Button>
      </div>
    </form>
  );
};

export default SearchBar;
