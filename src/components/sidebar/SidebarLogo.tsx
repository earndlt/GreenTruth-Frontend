
import React from 'react';
import { Link } from 'react-router-dom';

type SidebarLogoProps = {
  collapsed: boolean;
};

const SidebarLogo = ({ collapsed }: SidebarLogoProps) => {
  return (
    <div className="flex h-16 items-center border-b px-4">
      <Link 
        to="/" 
        className={`flex items-center ${collapsed ? 'justify-center w-full' : ''}`}
      >
        {collapsed ? (
          <span className="eco-gradient rounded-md p-1">
            <img 
              src="/lovable-uploads/eeb2b16e-8109-4c11-8034-93dec4806601.png" 
              alt="GreenTruth Icon" 
              className="h-4 w-4" 
            />
          </span>
        ) : (
          <div className="flex flex-col">
            <img 
              src="/lovable-uploads/98b27b9a-4308-4ad0-8f4e-b352806f3ca7.png" 
              alt="GreenTruth Logo" 
              className="h-10" 
            />
          </div>
        )}
      </Link>
    </div>
  );
};

export default SidebarLogo;
