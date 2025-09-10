
import React from 'react';
import PlatformOverview from './overview/PlatformOverview';
import CoreFeatures from './overview/CoreFeatures';
import SubscriptionTiers from './overview/SubscriptionTiers';
import TechnicalArchitecture from './overview/TechnicalArchitecture';
import AiCapabilities from './overview/AiCapabilities';
import GettingStarted from './overview/GettingStarted';
import AdditionalHelp from './overview/AdditionalHelp';

const GreenTruthOverviewArticle = () => {
  return (
    <div className="space-y-6 pdf-article">
      <PlatformOverview />
      <CoreFeatures />
      <SubscriptionTiers />
      <TechnicalArchitecture />
      <AiCapabilities />
      <GettingStarted />
      <AdditionalHelp />
    </div>
  );
};

export default GreenTruthOverviewArticle;
