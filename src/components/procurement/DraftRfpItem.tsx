
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export interface DraftRfpItemProps {
  draft: {
    id: string;
    title: string;
    description: string;
    completeness: number;
    dueDate: string;
    responses: number;
  };
}

const DraftRfpItem: React.FC<DraftRfpItemProps> = ({ draft }) => {
  return (
    <Card className="hover:border-primary transition-colors cursor-pointer">
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-base">{draft.title}</h3>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              Draft
            </span>
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-2">
            {draft.description}
          </p>
          
          <div className="pt-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium">Completeness</span>
              <span className="text-xs">{draft.completeness}%</span>
            </div>
            <Progress value={draft.completeness} className="h-1" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DraftRfpItem;
