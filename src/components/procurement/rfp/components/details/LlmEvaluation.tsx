
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { RfpResponse } from '../../types/RfpResponseTypes';

interface LlmEvaluationProps {
  response: RfpResponse;
  onNavigate: (tab: string) => void;
}

export const LlmEvaluation: React.FC<LlmEvaluationProps> = ({ response, onNavigate }) => {
  if (!response.llmScore) {
    return (
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" />
            <path d="M12 8V12L14 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <h3 className="text-lg font-medium">LLM Evaluation Pending</h3>
        <p className="text-muted-foreground mt-2">
          The Greentruth LLM is currently analyzing this response.
          <br />Check back soon for the automated evaluation.
        </p>
        <Button className="mt-4" onClick={() => onNavigate('manual-grading')}>
          Proceed to Manual Grading
        </Button>
      </div>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>AI Evaluation Summary</CardTitle>
          <CardDescription>
            Automated analysis of this RFP response against your policies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold">{response.llmScore.overall}%</div>
              <div className="text-sm text-muted-foreground">Overall Match</div>
            </div>
            <Separator orientation="vertical" className="h-16" />
            <div className="text-center">
              <div className="text-3xl font-bold">{response.llmScore.procurement}%</div>
              <div className="text-sm text-muted-foreground">Procurement</div>
            </div>
            <Separator orientation="vertical" className="h-16" />
            <div className="text-center">
              <div className="text-3xl font-bold">{response.llmScore.environmental}%</div>
              <div className="text-sm text-muted-foreground">Environmental</div>
            </div>
            <Separator orientation="vertical" className="h-16" />
            <div className="text-center">
              <div className="text-3xl font-bold">{response.llmScore.esg}%</div>
              <div className="text-sm text-muted-foreground">ESG</div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Key Strengths</h3>
              <ul className="list-disc pl-5 text-sm">
                <li>Confirms delivering EACs through the EarnDLT registry</li>
                <li>Pricing structure matches your procurement requirements</li>
                <li>Strong environmental certifications provided</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Areas of Concern</h3>
              <ul className="list-disc pl-5 text-sm">
                <li>Delivery timeline slightly longer than requested</li>
                <li>Some ESG documentation could be more comprehensive</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={() => onNavigate('response')}>
          Back to Response
        </Button>
        <Button onClick={() => onNavigate('manual-grading')}>
          Provide Your Evaluation
        </Button>
      </div>
    </>
  );
};
