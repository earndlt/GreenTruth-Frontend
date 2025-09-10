
import React from 'react';

interface LogoDisplayProps {
  logo: string | null;
}

const LogoDisplay = ({ logo }: LogoDisplayProps) => {
  if (!logo) return null;
  
  return (
    <div className="mr-4">
      <img 
        src={logo} 
        alt="Corporate Logo" 
        className="h-16 w-16 object-contain border rounded-md p-1"
      />
    </div>
  );
};

export default LogoDisplay;
