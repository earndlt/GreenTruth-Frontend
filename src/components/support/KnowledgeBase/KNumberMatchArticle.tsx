
import React from 'react';
import ArticleHeader from './KNumberMatch/ArticleHeader';
import KeyFeatures from './KNumberMatch/KeyFeatures';
import UsageGuide from './KNumberMatch/UsageGuide';
import AdditionalInfo from './KNumberMatch/AdditionalInfo';
import Footer from './KNumberMatch/Footer';

const KNumberMatchArticle = () => {
  return (
    <div className="space-y-6">
      <ArticleHeader />
      <KeyFeatures />
      <UsageGuide />
      <AdditionalInfo />
      <Footer />
    </div>
  );
};

export default KNumberMatchArticle;
