
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { X, Upload } from 'lucide-react';
import { ProductPolicy } from './types';

interface PolicyCardProps {
  policy: ProductPolicy;
  onUpdatePolicyText: (id: string, text: string) => void;
  onRemovePolicy: (id: string) => void;
  onUploadDocument: (policyId: string, event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveDocument: (policyId: string, documentIndex: number) => void;
}

const PolicyCard = ({
  policy,
  onUpdatePolicyText,
  onRemovePolicy,
  onUploadDocument,
  onRemoveDocument
}: PolicyCardProps) => {
  return (
    <Card className="relative">
      <Button
        variant="ghost"
        size="sm"
        className="absolute right-2 top-2 h-8 w-8 p-0"
        onClick={() => onRemovePolicy(policy.id)}
      >
        <X className="h-4 w-4" />
      </Button>

      <CardHeader>
        <CardTitle>{policy.name}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <Label htmlFor={`policy-text-${policy.id}`}>Policy Details:</Label>
          <Textarea
            id={`policy-text-${policy.id}`}
            placeholder={`Enter procurement policy details for ${policy.name}...`}
            className="min-h-[100px] mt-1"
            value={policy.policyText}
            onChange={(e) => onUpdatePolicyText(policy.id, e.target.value)}
          />
        </div>

        <div>
          <Label>Related Documents:</Label>

          {policy.documentUrls.length > 0 && (
            <div className="mt-2 space-y-2">
              {policy.documentUrls.map((doc, index) => (
                <div key={index} className="flex items-center justify-between bg-muted p-2 rounded-md">
                  <span className="text-sm truncate max-w-[80%]">{doc}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => onRemoveDocument(policy.id, index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          <div className="mt-2">
            <Label htmlFor={`upload-${policy.id}`} className="cursor-pointer">
              <div className="flex items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-md p-4 mt-1 hover:bg-accent/50 transition-colors">
                <Upload className="h-5 w-5 mr-2 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Upload policy document</span>
              </div>
            </Label>
            <Input
              id={`upload-${policy.id}`}
              type="file"
              className="hidden"
              onChange={(e) => onUploadDocument(policy.id, e)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PolicyCard;
