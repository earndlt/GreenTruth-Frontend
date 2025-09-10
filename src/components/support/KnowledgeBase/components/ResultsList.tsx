
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink } from 'lucide-react';
import { Article } from '../../KnowledgeBase';

interface ResultsListProps {
  articles: Article[];
  onArticleSelect: (article: Article) => void;
}

const ResultsList = ({ articles, onArticleSelect }: ResultsListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Help Articles</CardTitle>
        <CardDescription>
          Most frequently accessed help resources
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {articles.map((article, index) => (
            <li key={index} className="flex items-center">
              <button
                className="text-blue-600 hover:underline flex items-center gap-2 bg-transparent border-0 p-0 m-0 cursor-pointer"
                onClick={() => onArticleSelect(article)}
                type="button"
              >
                {article.icon}
                {article.title}
                {!article.content && (
                  <ExternalLink className="ml-1 h-3 w-3" />
                )}
              </button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default ResultsList;
