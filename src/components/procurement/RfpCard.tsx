
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Pencil } from 'lucide-react';

export interface RfpCardProps {
  title: string;
  description: string;
  status: string;
  statusType: 'success' | 'warning' | 'neutral' | 'complete';
  dueDate: string;
  responses: number;
  onView?: () => void;
  onManage?: () => void;
}

const RfpCard = ({
  title,
  description,
  status,
  statusType,
  dueDate,
  responses,
  onView,
  onManage,
}: RfpCardProps) => {
  const statusColor = {
    success: 'bg-green-500 hover:bg-green-600',
    warning: 'bg-amber-500 hover:bg-amber-600',
    neutral: 'bg-muted hover:bg-muted/80',
    complete: 'bg-blue-500 hover:bg-blue-600',
  };
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="font-medium">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <Badge className={statusColor[statusType]}>{status}</Badge>
        </div>
        <div className="mt-4 flex flex-col space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Due Date:</span>
            <span>{dueDate}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Responses:</span>
            <span>{responses}</span>
          </div>
          <div className="mt-2 flex justify-end space-x-2">
            <Button variant="outline" size="sm" onClick={onView} disabled={!onView}>
              <Eye className="h-4 w-4 mr-1" /> View
            </Button>
            <Button size="sm" onClick={onManage} disabled={!onManage}>
              <Pencil className="h-4 w-4 mr-1" /> Manage
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RfpCard;
