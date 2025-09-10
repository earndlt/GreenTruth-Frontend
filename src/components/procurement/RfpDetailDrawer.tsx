
import React from 'react';
import { 
  Drawer, 
  DrawerContent, 
  DrawerHeader, 
  DrawerTitle, 
  DrawerDescription, 
  DrawerFooter, 
  DrawerClose 
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Users, 
  FileText, 
  Send, 
  Pencil, 
  Copy, 
  CheckCircle 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useProcurement } from './context/ProcurementContext';

interface RfpDetailDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rfpId: string;
  isDraft?: boolean;
}

const RfpDetailDrawer: React.FC<RfpDetailDrawerProps> = ({ 
  open, 
  onOpenChange, 
  rfpId,
  isDraft = false
}) => {
  const { toast } = useToast();
  const { 
    rfps, 
    drafts, 
    publishDraft, 
    updateDraft 
  } = useProcurement();
  
  const rfpItem = isDraft 
    ? drafts.find(draft => draft.id === rfpId) 
    : rfps.find(rfp => rfp.id === rfpId);
    
  if (!rfpItem) {
    return null;
  }

  const handleEditRfp = () => {
    toast({
      title: "Edit RFP",
      description: `Opening editor for: ${rfpItem.title}`,
    });
    // Would navigate to an edit form in real implementation
    onOpenChange(false);
  };

  const handleShareWithTeam = () => {
    toast({
      title: "Share with Team",
      description: `Sharing "${rfpItem.title}" with your team members`,
    });
  };

  const handlePublishDraft = () => {
    if (isDraft && rfpItem.completeness === 100) {
      publishDraft(rfpId);
      toast({
        title: "Draft Published",
        description: `"${rfpItem.title}" has been published as an RFP`,
      });
      onOpenChange(false);
    } else {
      toast({
        title: "Cannot Publish",
        description: "Draft is not complete. Please finish all required sections.",
        variant: "destructive"
      });
    }
  };

  const handleCopyRfp = () => {
    toast({
      title: "RFP Duplicated",
      description: `A copy of "${rfpItem.title}" has been created`,
    });
    // Implementation would duplicate the RFP in the real app
  };

  // Calculate the status based on the RFP state
  const getStatusBadge = () => {
    if (isDraft) {
      return (
        <Badge className="bg-amber-500 hover:bg-amber-600">
          Draft - {rfpItem.completeness}% Complete
        </Badge>
      );
    }
    
    switch (rfpItem.status) {
      case 'active':
        return <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>;
      case 'closed':
        return <Badge className="bg-muted hover:bg-muted/80">Closed</Badge>;
      case 'awarded':
        return <Badge className="bg-blue-500 hover:bg-blue-600">Awarded</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh]">
        <div className="mx-auto w-full max-w-4xl">
          <DrawerHeader>
            <DrawerTitle className="text-xl">{rfpItem.title}</DrawerTitle>
            <DrawerDescription className="flex items-center justify-between">
              <span>{rfpItem.description}</span>
              {getStatusBadge()}
            </DrawerDescription>
          </DrawerHeader>
          
          <div className="p-4 space-y-6 overflow-auto max-h-[calc(90vh-200px)]">
            <div className="flex flex-col space-y-4">
              <div className="flex justify-between items-center py-2 border-b">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Due Date:</span>
                </div>
                <span>{rfpItem.dueDate}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b">
                <div className="flex items-center">
                  <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Responses:</span>
                </div>
                <span>{rfpItem.responses}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Last Modified:</span>
                </div>
                <span>
                  {rfpItem.lastEdited 
                    ? new Date(rfpItem.lastEdited).toLocaleDateString() 
                    : new Date(rfpItem.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {rfpItem.rfpText ? (
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">RFP Content</h3>
                <div className="bg-muted/20 p-4 rounded-md whitespace-pre-wrap text-sm">
                  {rfpItem.rfpText}
                </div>
              </div>
            ) : (
              <div className="bg-muted/20 p-4 rounded-md text-center text-muted-foreground">
                No RFP content available
              </div>
            )}
          </div>
          
          <DrawerFooter>
            <div className="flex flex-wrap gap-2 justify-end">
              {isDraft ? (
                <>
                  <Button variant="outline" size="sm" onClick={handleEditRfp}>
                    <Pencil className="h-4 w-4 mr-1" /> Edit Draft
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleShareWithTeam}
                  >
                    <Users className="h-4 w-4 mr-1" /> Share with Team
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={handlePublishDraft}
                    disabled={rfpItem.completeness < 100}
                  >
                    <Send className="h-4 w-4 mr-1" /> Publish
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" size="sm" onClick={handleCopyRfp}>
                    <Copy className="h-4 w-4 mr-1" /> Duplicate
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleShareWithTeam}>
                    <Users className="h-4 w-4 mr-1" /> Share
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleEditRfp}>
                    <Pencil className="h-4 w-4 mr-1" /> Edit
                  </Button>
                  {rfpItem.status === 'active' && (
                    <Button size="sm">
                      <CheckCircle className="h-4 w-4 mr-1" /> Mark as Awarded
                    </Button>
                  )}
                </>
              )}
              <DrawerClose asChild>
                <Button variant="outline" size="sm">Close</Button>
              </DrawerClose>
            </div>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default RfpDetailDrawer;
