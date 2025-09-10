
import React from 'react';
import LogoDisplay from './LogoDisplay';

interface ProfileHeaderProps {
  logo: string | null;
  title: string;
}

const ProfileHeader = ({ logo, title }: ProfileHeaderProps) => {
  return (
    <div className="flex items-center mb-6">
      <LogoDisplay logo={logo} />
      <h2 className="text-2xl font-semibold">{title}</h2>
    </div>
  );
};

export default ProfileHeader;
