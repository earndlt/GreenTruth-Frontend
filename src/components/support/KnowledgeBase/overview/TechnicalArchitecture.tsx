
import React from 'react';

const TechnicalArchitecture = () => {
  return (
    <section className="border-t pt-4">
      <h3 className="text-xl font-medium mb-3">Technical Architecture</h3>
      <div className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">Technology Stack</h4>
          <p className="text-sm text-muted-foreground">
            GreenTruth is built on a modern stack including React, TypeScript, and Tailwind CSS for the frontend, with a microservices backend architecture leveraging PostgreSQL, MongoDB, and vector databases for different data requirements.
          </p>
        </div>
        
        <div>
          <h4 className="font-medium mb-2">Integration Capabilities</h4>
          <p className="text-sm text-muted-foreground mb-3">
            The platform offers robust integration options through the Integration Hub, including:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>RESTful API access</li>
            <li>ERP system integration (SAP, Oracle, etc.)</li>
            <li>Blockchain connectivity (EarnDLT QET Protocol)</li>
            <li>Zapier workflow automation</li>
            <li>Custom data connectors</li>
          </ul>
        </div>

        <div>
          <h4 className="font-medium mb-2">Security & Compliance</h4>
          <p className="text-sm text-muted-foreground mb-3">
            GreenTruth implements enterprise-grade security protocols:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Role-Based Access Control (RBAC)</li>
            <li>Segregation of Duties (SoD)</li>
            <li>Two-factor authentication</li>
            <li>Data encryption at rest and in transit</li>
            <li>Comprehensive audit logging</li>
            <li>Regular security audits and penetration testing</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default TechnicalArchitecture;
