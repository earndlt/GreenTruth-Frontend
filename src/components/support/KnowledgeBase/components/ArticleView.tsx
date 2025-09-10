
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Download } from 'lucide-react';
import { Article } from '../../KnowledgeBase';

interface ArticleViewProps {
  article: Article;
  onBack: () => void;
  onDownload: () => void;
  isGeneratingPdf: boolean;
  articleRef: React.RefObject<HTMLDivElement>;
}

const ArticleView = ({ article, onBack, onDownload, isGeneratingPdf, articleRef }: ArticleViewProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2" data-article-title={article.title}>
              {article.icon ?? null}
              {article.title}
            </CardTitle>
            <CardDescription>
              <Button variant="ghost" size="sm" className="p-0 text-primary underline" onClick={onBack}>
                ← Back to articles
              </Button>
            </CardDescription>
          </div>
          {article.content && (
            <Button
              variant="outline"
              size="sm"
              onClick={onDownload}
              disabled={isGeneratingPdf}
              className="flex items-center gap-2"
            >
              {isGeneratingPdf ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              Download PDF
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div ref={articleRef} className="pdf-content">
          {article.content}
        </div>
      </CardContent>
    </Card>
  );
};

export default ArticleView;
