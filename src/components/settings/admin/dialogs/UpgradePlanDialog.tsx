
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { NextPlanInfo } from '../types/userManagement';

interface UpgradePlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPlan: string;
  nextPlan: NextPlanInfo;
  onUpgrade: () => void;
  onCancel: () => void;
}

const UpgradePlanDialog = ({ 
  open, 
  onOpenChange, 
  currentPlan, 
  nextPlan, 
  onUpgrade, 
  onCancel 
}: UpgradePlanDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upgrade Your Plan</DialogTitle>
          <DialogDescription>
            You've reached the seat limit for your current plan.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-sm mb-4">
            Upgrade to the <span className="font-medium">{nextPlan.name}</span> plan to add more users.
          </p>
          
          <div className="space-y-2 rounded-md border p-4">
            <div className="flex justify-between">
              <span className="text-sm font-medium">New Plan:</span>
              <span className="text-sm font-medium capitalize">{nextPlan.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Price:</span>
              <span className="text-sm">{nextPlan.price}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">User Seats:</span>
              <span className="text-sm">{nextPlan.seats}</span>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button 
            type="button"
            onClick={onUpgrade}
          >
            Upgrade Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpgradePlanDialog;
