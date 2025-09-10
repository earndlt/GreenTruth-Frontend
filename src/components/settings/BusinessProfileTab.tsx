
import React from 'react';
import ProfileSection from './sections/ProfileSection';
import DocumentSection from './sections/DocumentSection';
import LlmPreferencesForm from './LlmPreferencesForm';
import BusinessStakeholdersForm from './BusinessStakeholdersForm';
import { ScrollArea } from '@/components/ui/scroll-area';

const BusinessProfileTab = () => {
  return (
    <ScrollArea className="h-[calc(100vh-12rem)] pr-4">
      <div className="space-y-8 pb-6">
        <ProfileSection />
        
        <div className="mt-10 space-y-8">
          <BusinessStakeholdersForm />
          <DocumentSection />
          <LlmPreferencesForm />
        </div>
      </div>
    </ScrollArea>
  );
};

export default BusinessProfileTab;
