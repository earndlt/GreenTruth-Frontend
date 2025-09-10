
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DocumentationHeader from './DocumentationHeader';
import DocumentationSidebar from './DocumentationSidebar';
import MarkdownRenderer from './MarkdownRenderer';
import { fetchDocumentationContent } from './utils/documentationUtils';

const DocumentationViewer: React.FC = () => {
  // Default to k-number-match if no docPath provided
  const { docPath = 'k-number-match' } = useParams<{ docPath: string }>();
  const [content, setContent] = useState<string>('Loading documentation...');
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadContent = async () => {
      try {
        console.log("Loading content for path:", docPath);
        const docContent = await fetchDocumentationContent(docPath);
        setContent(docContent);
        setError(null);
      } catch (e) {
        console.error("Failed to load documentation:", e);
        setError("Could not load the requested documentation.");
        setContent('# Documentation Not Found\n\nThe requested documentation could not be loaded. Please check the path and try again.');
      }
    };
    
    loadContent();
  }, [docPath]);

  return (
    <div className="container max-w-4xl mx-auto py-8">
      <DocumentationHeader />
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <DocumentationSidebar />
        </div>
        
        <div className="md:col-span-3">
          {error ? (
            <div className="p-4 border border-destructive/20 bg-destructive/10 rounded-md text-destructive">
              {error}
            </div>
          ) : (
            <MarkdownRenderer markdown={content} />
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentationViewer;
