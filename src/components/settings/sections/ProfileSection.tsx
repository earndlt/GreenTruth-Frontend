
import React, { useState, useEffect } from 'react';
import CorporateLogoUploader from '../CorporateLogoUploader';
import ProfileContent from './ProfileContent';

const ProfileSection = () => {
  const [logo, setLogo] = useState<string | null>(null);
  
  useEffect(() => {
    // Initialize with the current value from localStorage
    const savedLogo = localStorage.getItem('corporateLogo');
    if (savedLogo) {
      setLogo(savedLogo);
    }
    
    // Listen for changes to the logo in localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'corporateLogo') {
        setLogo(e.newValue);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <ProfileContent logo={logo} />
      <div>
        <CorporateLogoUploader />
      </div>
    </div>
  );
};

export default ProfileSection;
