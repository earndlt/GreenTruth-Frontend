
import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle2 } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps?: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps = 5 }) => {
  // Generate steps array based on totalSteps
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);
  
  // Map step numbers to their labels
  const getStepLabel = (step: number): string => {
    switch (step) {
      case 1: return "Basic Info";
      case 2: return "Product";
      case 3: return "Attributes";
      case 4: return "Vendors";
      case 5: return "Review";
      default: return `Step ${step}`;
    }
  };
  
  return (
    <div className="flex mb-6 justify-between">
      {steps.map((i) => (
        <div key={i} className="flex flex-col items-center">
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center mb-2",
            currentStep === i ? "bg-primary text-primary-foreground" : 
            currentStep > i ? "bg-primary/90 text-primary-foreground" : "bg-muted text-muted-foreground"
          )}>
            {currentStep > i ? <CheckCircle2 className="h-5 w-5" /> : i}
          </div>
          <span className="text-xs text-muted-foreground">
            {getStepLabel(i)}
          </span>
        </div>
      ))}
    </div>
  );
};

export default StepIndicator;
