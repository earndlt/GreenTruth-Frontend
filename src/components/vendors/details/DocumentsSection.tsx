import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Vendor } from '../types/vendorTypes';

interface DocumentsSectionProps {
  vendor: Vendor;
}

const DocumentsSection: React.FC<DocumentsSectionProps> = ({ vendor }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Documents</CardTitle>
        <CardDescription>Contracts and other documents related to {vendor.name}</CardDescription>
      </CardHeader>
      <CardContent className="text-center py-8">
        <p className="text-muted-foreground">No documents available yet.</p>
        <Button variant="outline" className="mt-4">
          <Plus className="h-4 w-4 mr-2" />
          Upload Document
        </Button>
      </CardContent>
    </Card>
  );
};

export default DocumentsSection;
