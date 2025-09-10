
import React from "react";
import ApiDocumentation from "@/components/support/api-docs/ApiDocumentation";
import { Code } from "lucide-react";

const IntegrationHub = () => {
  // No access check for demo purposes
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
        <Code className="mr-2 h-6 w-6" />
        <h1 className="text-2xl font-bold">Integration Hub</h1>
      </div>
      <ApiDocumentation />
    </div>
  );
};

export default IntegrationHub;
