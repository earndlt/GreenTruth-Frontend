
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Plus } from 'lucide-react';
import { RfiResponse } from '../../types/RfiTypes';
import { useResponseGrading, GradingScores } from '../../hooks/useResponseGrading';

interface ManualGradingProps {
  response: RfiResponse;
  onNavigate: (tab: string) => void;
  onAddVendor: () => void;
}

export const ManualGrading: React.FC<ManualGradingProps> = ({ response, onNavigate, onAddVendor }) => {
  const { userScores, setUserScores, calculateOverallScore, handleSaveGrades } = useResponseGrading(response);

  const handleScoreChange = (key: keyof GradingScores, values: number[]) => {
    setUserScores({ ...userScores, [key]: values[0] });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Evaluation</CardTitle>
        <CardDescription>
          Grade this response based on your assessment and company policies
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm font-medium">Procurement Policy Match</label>
              <span className="text-sm">{userScores.procurement}%</span>
            </div>
            <Slider
              value={[userScores.procurement]}
              min={0}
              max={100}
              step={1}
              onValueChange={(values) => handleScoreChange('procurement', values)}
            />
            <p className="text-xs text-muted-foreground">
              How well does this response align with your procurement requirements?
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm font-medium">Environmental Policy Match</label>
              <span className="text-sm">{userScores.environmental}%</span>
            </div>
            <Slider
              value={[userScores.environmental]}
              min={0}
              max={100}
              step={1}
              onValueChange={(values) => handleScoreChange('environmental', values)}
            />
            <p className="text-xs text-muted-foreground">
              How well does this response align with your environmental standards?
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm font-medium">ESG Policy Match</label>
              <span className="text-sm">{userScores.esg}%</span>
            </div>
            <Slider
              value={[userScores.esg]}
              min={0}
              max={100}
              step={1}
              onValueChange={(values) => handleScoreChange('esg', values)}
            />
            <p className="text-xs text-muted-foreground">
              How well does this response align with your ESG guidelines?
            </p>
          </div>
        </div>
        
        <div className="flex items-center p-4 bg-muted rounded-lg">
          <div className="mr-4">
            <div className="text-3xl font-bold">{calculateOverallScore()}%</div>
            <div className="text-sm text-muted-foreground">Overall Score</div>
          </div>
          <Separator orientation="vertical" className="h-16 mx-4" />
          <div className="flex-1">
            <p className="text-sm">
              Based on your evaluation, this vendor 
              {calculateOverallScore() >= 80 ? (
                <span className="text-green-600 font-medium"> strongly aligns </span>
              ) : calculateOverallScore() >= 60 ? (
                <span className="text-amber-600 font-medium"> moderately aligns </span>
              ) : (
                <span className="text-red-600 font-medium"> does not align well </span>
              )}
              with your company policies.
            </p>
          </div>
        </div>
      </CardContent>
      
      <div className="flex justify-between p-6 pt-0">
        <Button variant="outline" onClick={() => onNavigate('evaluation')}>
          Back to LLM Evaluation
        </Button>
        <div className="space-x-2">
          <Button variant="outline" onClick={handleSaveGrades}>
            Save Grades
          </Button>
          <Button onClick={onAddVendor}>
            <Plus className="h-4 w-4 mr-2" />
            Add as Vendor
          </Button>
        </div>
      </div>
    </Card>
  );
};
