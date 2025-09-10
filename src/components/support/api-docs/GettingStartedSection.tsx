
import React from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink, FileText, Code, Server } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const GettingStartedSection: React.FC = () => (
  <div className="mt-6">
    <Card>
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Getting Started with Integration
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <ol className="list-decimal pl-6 space-y-3 mb-6">
          <li>Register for API access in your GreenTruth Admin Panel</li>
          <li>Generate API keys with appropriate scopes</li>
          <li>Review integration guides for your specific system (SAP, Microsoft, etc.)</li>
          <li>Test connections in the sandbox environment</li>
          <li>Deploy to production when ready</li>
        </ol>
        
        <div className="grid gap-4 md:grid-cols-2 mt-6">
          <Card className="bg-muted/40">
            <CardContent className="p-4 flex flex-col h-full">
              <div className="flex items-center gap-2 font-medium mb-2">
                <Code className="h-4 w-4 text-primary" />
                Developer Resources
              </div>
              <p className="text-sm text-muted-foreground flex-1">
                Access code samples, SDKs, and reference implementations.
              </p>
              <Button 
                variant="outline"
                size="sm"
                className="flex items-center mt-4 self-start"
                onClick={(e) => {
                  e.preventDefault();
                  window.open('https://developers.greentruth.com/docs', '_blank');
                }}
              >
                View Docs <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
          
          <Card className="bg-muted/40">
            <CardContent className="p-4 flex flex-col h-full">
              <div className="flex items-center gap-2 font-medium mb-2">
                <Server className="h-4 w-4 text-primary" />
                Sandbox Environment
              </div>
              <p className="text-sm text-muted-foreground flex-1">
                Test your integration in our sandbox before going live.
              </p>
              <Button 
                variant="outline"
                size="sm"
                className="flex items-center mt-4 self-start"
                onClick={(e) => {
                  e.preventDefault();
                  window.open('https://sandbox.greentruth.com', '_blank');
                }}
              >
                Access Sandbox <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default GettingStartedSection;
