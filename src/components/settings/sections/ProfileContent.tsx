
import React from 'react';
import BusinessProfileForm from '../BusinessProfileForm';
import ProfileHeader from './ProfileHeader';

interface ProfileContentProps {
  logo: string | null;
}

const ProfileContent = ({ logo }: ProfileContentProps) => {
  return (
    <div>
      <ProfileHeader logo={logo} title="Company Profile" />
      <BusinessProfileForm />
    </div>
  );
};

export default ProfileContent;
