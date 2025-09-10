
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Article } from '../../KnowledgeBase';

interface KnowledgeBaseSearchProps {
  articles: Article[];
  onArticleSelect: (article: Article) => void;
}

const KnowledgeBaseSearch = ({ articles, onArticleSelect }: KnowledgeBaseSearchProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [combinedResults, setCombinedResults] = useState<Article[]>([]);
  const { toast } = useToast();

  // Search local articles
  const searchLocalArticles = (query: string): Article[] => {
    const lowercaseQuery = query.toLowerCase();
    return articles.filter(article => 
      article.title.toLowerCase().includes(lowercaseQuery)
    );
  };

  // Search HubSpot knowledge base
  const searchHubspotArticles = async (query: string): Promise<Article[]> => {
    try {
      const response = await fetch(
        `https://api.hubspot.com/knowledge/v2/articles/search?q=${encodeURIComponent(query)}`,
        {
          headers: {
            'Authorization': `Bearer ${process.env.HUBSPOT_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch HubSpot articles');
      }

      const data = await response.json();
      
      // Transform HubSpot results to match our Article type
      return data.results.map((result: any) => ({
        title: result.title,
        url: result.url,
        icon: <Search className="h-3 w-3 text-primary mr-1" />,
      }));
    } catch (error) {
      console.error('Error searching HubSpot:', error);
      return [];
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setCombinedResults([]);
      return;
    }

    setIsSearching(true);
    
    try {
      // Search both local and HubSpot articles
      const localResults = searchLocalArticles(searchQuery);
      const hubspotResults = await searchHubspotArticles(searchQuery);
      
      // Combine and deduplicate results
      const allResults = [...localResults, ...hubspotResults];
      const uniqueResults = allResults.filter((article, index, self) =>
        index === self.findIndex((t) => t.title === article.title)
      );
      
      setCombinedResults(uniqueResults);
    } catch (error) {
      toast({
        title: "Search Error",
        description: "Failed to search knowledge base articles. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Search knowledge base..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          className="flex-1"
        />
        <Button 
          onClick={handleSearch}
          disabled={isSearching}
        >
          {isSearching ? (
            "Searching..."
          ) : (
            <>
              <Search className="h-4 w-4 mr-2" />
              Search
            </>
          )}
        </Button>
      </div>

      {combinedResults.length > 0 && (
        <div className="border rounded-lg p-4 space-y-2">
          <h3 className="font-medium mb-2">Search Results</h3>
          {combinedResults.map((article, index) => (
            <button
              key={index}
              className="w-full text-left px-4 py-2 hover:bg-accent rounded-md flex items-center gap-2"
              onClick={() => onArticleSelect(article)}
            >
              {article.icon}
              {article.title}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default KnowledgeBaseSearch;
