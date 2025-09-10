
import React from 'react';
import { Briefcase, Globe } from 'lucide-react';

interface CompanyProfileProps {
  description: string;
  category: string;
  location: string;
}

const CompanyProfile: React.FC<CompanyProfileProps> = ({ description, category, location }) => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-2">Company Profile</h3>
      <p className="text-muted-foreground mb-4">{description}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center">
          <Briefcase className="h-5 w-5 text-muted-foreground mr-2" />
          <div>
            <p className="text-sm font-medium">Industry</p>
            <p>{category}</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <Globe className="h-5 w-5 text-muted-foreground mr-2" />
          <div>
            <p className="text-sm font-medium">Headquarters</p>
            <p>{location}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;
