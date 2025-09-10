
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface BasicInfoStepProps {
  title: string;
  setTitle: (title: string) => void;
}

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({ title, setTitle }) => {
  return (
    <Card className="border border-muted">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">RFP Details</CardTitle>
        <CardDescription>
          Enter the basic information for your Request for Proposal
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">RFP Title</Label>
            <Input 
              id="title" 
              placeholder="Enter RFP title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BasicInfoStep;
