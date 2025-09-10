
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import VendorDetailsView from '@/components/vendors/VendorDetailsView';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Vendor } from '@/components/vendors/types/vendorTypes';
import { corporateWallets } from '@/data/corporateWallets';

// Import vendor data accessor functions
import { getAllVendorData } from '@/components/vendors/hooks/useVendorDirectory';

const VendorDetailPage = () => {
  const { vendorId } = useParams<{ vendorId: string }>();
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [entityName, setEntityName] = useState<string>("Unknown Entity");

  useEffect(() => {
    // In a real app, this would be an API call
    // For now, we're using the vendor data from useVendorDirectory
    setLoading(true);
    
    // Get all vendors across all companies
    const allVendors = getAllVendorData();
    const foundVendor = allVendors.find(v => v.id === vendorId);
    
    if (foundVendor) {
      setVendor(foundVendor as Vendor);
      
      // Look up the entity name based on companyId
      const entity = corporateWallets.find(wallet => wallet.id === foundVendor.companyId);
      if (entity) {
        setEntityName(entity.name);
      }
    }
    
    setLoading(false);
  }, [vendorId]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="h-8 w-36 bg-muted rounded animate-pulse mb-4"></div>
        <div className="h-64 bg-muted rounded animate-pulse"></div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="p-6">
        <Button variant="outline" asChild className="mb-4">
          <Link to="/vendors?tab=directory">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Vendor Directory
          </Link>
        </Button>
        <Card>
          <CardHeader>
            <CardTitle>Vendor Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p>The requested vendor could not be found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <Button variant="outline" asChild className="mb-4">
        <Link to="/vendors?tab=directory">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Vendor Directory
        </Link>
      </Button>
      
      <Card>
        <CardContent className="p-6">
          <VendorDetailsView vendor={vendor} companyName={entityName} />
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorDetailPage;
