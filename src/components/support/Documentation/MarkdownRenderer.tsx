
import React from 'react';

interface MarkdownRendererProps {
  markdown: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ markdown }) => {
  return (
    <div 
      className="prose prose-slate max-w-none" 
      dangerouslySetInnerHTML={{ 
        __html: markdown
          .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mt-4 mb-2">$1</h1>')
          .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold mt-4 mb-2">$1</h2>')
          .replace(/^### (.*$)/gm, '<h3 class="text-lg font-medium mt-3 mb-1">$1</h3>')
          .replace(/```([^`]+)```/gs, '<pre class="bg-muted p-4 my-4 rounded-md overflow-auto"><code>$1</code></pre>')
          .replace(/`([^`]+)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-sm">$1</code>')
          .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
          .replace(/\*([^*]+)\*/g, '<em>$1</em>')
          .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-primary underline">$1</a>')
          .replace(/^\- (.*$)/gm, '<li>$1</li>')
          .replace(/<li>.*?<\/li>/gs, match => `<ul class="list-disc pl-6 my-2">${match}</ul>`)
          .split('\n\n').join('<p class="my-2"></p>')
      }}
    />
  );
};

export default MarkdownRenderer;
