import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, FileText, Trash2, Upload, X } from 'lucide-react';
import { ProductPolicy } from '../../../procurement/utils/types/draft-types';
import { useRegulations } from '@/context/RegulationsContext';
import SharePolicyDialog from './SharePolicyDialog';

interface PolicyCardProps {
  policy: ProductPolicy;
  onUpdatePolicyText: (id: string, text: string) => void;
  onRemovePolicy: (id: string) => void;
  onUploadDocument: (id: string, event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveDocument: (id: string, documentIndex: number) => void;
  currentCompanyId: string;
}

const PolicyCard: React.FC<PolicyCardProps> = ({
  policy,
  onUpdatePolicyText,
  onRemovePolicy,
  onUploadDocument,
  onRemoveDocument,
  currentCompanyId
}) => {
  const [showRegulations, setShowRegulations] = useState(false);
  const { getRelevantDocuments } = useRegulations();
  
  const relevantRegulations = getRelevantDocuments(policy.name);
  
  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{policy.name} Policy</CardTitle>
          <div className="flex items-center space-x-2">
            <SharePolicyDialog policy={policy} currentCompanyId={currentCompanyId} />
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 text-muted-foreground"
              onClick={() => onRemovePolicy(policy.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Textarea
            placeholder={`Define procurement policy for ${policy.name}...`}
            className="min-h-[150px]"
            value={policy.policyText}
            onChange={(e) => onUpdatePolicyText(policy.id, e.target.value)}
          />
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium">Supporting Documents</h3>
              <label>
                <Button variant="outline" size="sm" className="cursor-pointer" asChild>
                  <div>
                    <Upload className="h-4 w-4 mr-2" />
                    Add Document
                    <input 
                      type="file" 
                      className="hidden" 
                      onChange={(e) => onUploadDocument(policy.id, e)}
                    />
                  </div>
                </Button>
              </label>
            </div>
            
            {policy.documentUrls.length > 0 ? (
              <div className="space-y-2 mb-4">
                {policy.documentUrls.map((doc, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between bg-muted p-2 rounded-md"
                  >
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm truncate max-w-[200px]">{doc}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => onRemoveDocument(policy.id, index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground mb-4">No documents attached</p>
            )}
          </div>
          
          {relevantRegulations.length > 0 && (
            <div>
              <div 
                className="flex items-center justify-between cursor-pointer" 
                onClick={() => setShowRegulations(!showRegulations)}
              >
                <div className="flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2 text-blue-500" />
                  <h3 className="text-sm font-medium">Related Regulations</h3>
                  <Badge variant="outline" className="ml-2 bg-blue-500/10 text-blue-600 border-blue-200">
                    {relevantRegulations.length}
                  </Badge>
                </div>
                <Button variant="ghost" size="sm">
                  {showRegulations ? 'Hide' : 'Show'}
                </Button>
              </div>
              
              {showRegulations && (
                <div className="mt-2 space-y-2 border rounded-md p-3 bg-muted/50">
                  {relevantRegulations.slice(0, 3).map(reg => (
                    <div key={reg.id} className="text-sm">
                      <div className="font-medium">{reg.attributes.title}</div>
                      <div className="text-xs text-muted-foreground mt-1 flex justify-between">
                        <span>Agency: {reg.attributes.agencyId}</span>
                        <a 
                          href={`https://www.regulations.gov/document/${reg.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          View
                        </a>
                      </div>
                    </div>
                  ))}
                  
                  {relevantRegulations.length > 3 && (
                    <Button 
                      variant="link" 
                      size="sm" 
                      className="p-0 h-auto"
                      onClick={() => window.location.href = '/compliance'}
                    >
                      View all {relevantRegulations.length} relevant regulations
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PolicyCard;
