
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { RfiResponse, UserScore } from '../types/RfiTypes';

export interface GradingScores {
  procurement: number;
  environmental: number;
  esg: number;
}

export const useResponseGrading = (response: RfiResponse) => {
  const [userScores, setUserScores] = useState<GradingScores>({
    procurement: response.userScore?.procurement || response.llmScore?.procurement || 50,
    environmental: response.userScore?.environmental || response.llmScore?.environmental || 50,
    esg: response.userScore?.esg || response.llmScore?.esg || 50,
  });

  const { toast } = useToast();

  const calculateOverallScore = () => {
    return Math.round((userScores.procurement + userScores.environmental + userScores.esg) / 3);
  };

  const handleSaveGrades = () => {
    toast({
      title: "Grades Saved",
      description: "Your evaluation has been saved for this vendor response.",
    });
  };

  return {
    userScores,
    setUserScores,
    calculateOverallScore,
    handleSaveGrades,
  };
};
