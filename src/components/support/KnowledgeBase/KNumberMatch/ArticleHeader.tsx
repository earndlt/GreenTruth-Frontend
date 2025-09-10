
import React from 'react';

const ArticleHeader = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Gas Trace in EAC Registry</h1>
      
      <section>
        <h2 className="text-xl font-semibold mb-4">What is Gas Trace?</h2>
        <p className="mb-4">The Gas Trace tool enables users to identify and match Environmental Attribute Certificates (EACs) with specific pipeline contracts using their unique K# identifiers. This feature allows seamless matching of environmental attributes across both REX and Ruby pipelines through a streamlined, tabbed interface designed for efficient user experience.</p>
      </section>
    </div>
  );
};

export default ArticleHeader;
