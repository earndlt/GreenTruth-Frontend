
import React from 'react';
import { Award, CheckCircle } from 'lucide-react';

interface SustainabilityProfileProps {
  score: number;
  certifications: string[];
}

const SustainabilityProfile: React.FC<SustainabilityProfileProps> = ({ score, certifications }) => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-2">Sustainability Profile</h3>
      <div className="mb-3 flex items-center">
        <Award className="h-5 w-5 text-muted-foreground mr-2" />
        <span className="text-base font-medium">Overall Sustainability Score: {score}%</span>
      </div>
      
      <div className="w-full bg-muted rounded-full h-3 mb-4">
        <div 
          className={`h-3 rounded-full ${
            score >= 80 
              ? 'bg-green-500' 
              : score >= 60 
              ? 'bg-amber-500' 
              : 'bg-destructive'
          }`} 
          style={{ width: `${score}%` }}
        ></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <h4 className="text-sm font-medium mb-2">Certifications</h4>
          <ul className="space-y-1">
            {certifications.map((cert, index) => (
              <li key={index} className="flex items-center text-sm">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                {cert}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SustainabilityProfile;
