
import React, { ReactNode } from 'react';
import { GripVertical, Maximize2, Minimize2 } from 'lucide-react';
import { 
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle
} from '@/components/ui/resizable';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export interface DashboardWidgetProps {
  id: string;
  title: string;
  children: ReactNode;
  defaultSize?: number;
  minSize?: number;
}

export interface DashboardLayoutProps {
  widgets: DashboardWidgetProps[];
  direction?: 'horizontal' | 'vertical';
  className?: string;
}

const DashboardWidget = ({ 
  id, 
  title, 
  children, 
  defaultSize = 100, 
  minSize = 10 
}: DashboardWidgetProps) => {
  const [isMaximized, setIsMaximized] = React.useState(false);
  const [previousSize, setPreviousSize] = React.useState(defaultSize);

  const handleMaximizeToggle = () => {
    if (!isMaximized) {
      setPreviousSize(defaultSize);
      setIsMaximized(true);
    } else {
      setIsMaximized(false);
    }
  };

  return (
    <div 
      className="relative flex flex-col h-full border rounded-lg bg-card shadow-sm overflow-hidden"
      data-widget-id={id}
    >
      <div className="bg-muted/30 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
          <h3 className="text-sm font-medium">{title}</h3>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-muted-foreground"
          onClick={handleMaximizeToggle}
        >
          {isMaximized ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </Button>
      </div>
      <div className="flex-1 overflow-auto p-4">
        {children}
      </div>
    </div>
  );
};

const DashboardLayout = ({ widgets, direction = 'vertical', className }: DashboardLayoutProps) => {
  return (
    <ResizablePanelGroup
      direction={direction}
      className={cn("min-h-[200px] w-full rounded-lg", className)}
    >
      {widgets.map((widget, index) => (
        <React.Fragment key={widget.id}>
          <ResizablePanel 
            defaultSize={widget.defaultSize || 100} 
            minSize={widget.minSize || 10}
            className="p-2"
          >
            <DashboardWidget {...widget} />
          </ResizablePanel>
          {index < widgets.length - 1 && <ResizableHandle withHandle />}
        </React.Fragment>
      ))}
    </ResizablePanelGroup>
  );
};

export default DashboardLayout;
