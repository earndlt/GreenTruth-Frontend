import React, { useState, useRef } from 'react';
import { toast } from "sonner";
import { articles } from './KnowledgeBase/KnowledgeBaseArticles';
import { generatePdf } from './KnowledgeBase/utils/pdfGenerator';
import ResultsList from './KnowledgeBase/components/ResultsList';
import ArticleView from './KnowledgeBase/components/ArticleView';
import KnowledgeBaseSearch from './KnowledgeBase/components/KnowledgeBaseSearch';

// Define a type for the articles to help TypeScript understand the structure
export type Article = {
  title: string;
  url: string | null;
  content?: React.ReactNode;
  icon?: React.ReactNode;
};

const KnowledgeBase = () => {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const articleRef = useRef<HTMLDivElement>(null);

  const handleOpenArticle = (article: Article) => {
    if (article.content) {
      setSelectedArticle(article);
    } else if (article.url) {
      window.open(article.url, '_blank');
    }
  };

  const handleDownload = async () => {
    if (!articleRef.current || !selectedArticle) return;
    
    setIsGeneratingPdf(true);
    const fileName = `${selectedArticle.title.toLowerCase().replace(/\s+/g, '-')}.pdf`;
    
    try {
      const success = await generatePdf(articleRef.current, fileName);
      if (success) {
        toast.success("PDF generated successfully");
      } else {
        toast.error("Failed to generate PDF");
      }
    } catch (error) {
      console.error("PDF generation error:", error);
      toast.error("Error generating PDF");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="space-y-4">
      {selectedArticle ? (
        <ArticleView
          article={selectedArticle}
          onBack={() => setSelectedArticle(null)}
          onDownload={handleDownload}
          isGeneratingPdf={isGeneratingPdf}
          articleRef={articleRef}
        />
      ) : (
        <div className="space-y-6">
          <KnowledgeBaseSearch 
            articles={articles} 
            onArticleSelect={handleOpenArticle}
          />
          <ResultsList
            articles={articles}
            onArticleSelect={handleOpenArticle}
          />
        </div>
      )}
    </div>
  );
};

export default KnowledgeBase;
