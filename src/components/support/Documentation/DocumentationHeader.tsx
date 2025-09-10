
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const DocumentationHeader: React.FC = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <>
      <div className="flex items-center gap-2 mb-4">
        <Button variant="ghost" onClick={goBack} className="p-2 h-auto">
          <ChevronLeft className="h-4 w-4" />
          <span className="ml-1">Back</span>
        </Button>
        <h1 className="flex items-center text-2xl font-bold">
          <BookOpen className="h-5 w-5 mr-2" />
          Documentation
        </h1>
      </div>
      <Separator className="my-4" />
    </>
  );
};

export default DocumentationHeader;
