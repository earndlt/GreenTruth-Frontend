import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, Tag, MapPin, Mail, Phone, Link } from 'lucide-react';
import { Vendor } from '../types/vendorTypes';

interface CompanyInfoProps {
  vendor: Vendor;
}

const CompanyInfo: React.FC<CompanyInfoProps> = ({ vendor }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Company Information</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div className="space-y-1">
          <p className="text-muted-foreground">Category</p>
          <div className="flex items-center">
            <Tag className="h-4 w-4 mr-2 text-primary" />
            <span>{vendor.category}</span>
          </div>
        </div>
        
        <div className="space-y-1">
          <p className="text-muted-foreground">Location</p>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-primary" />
            <span>{vendor.location}</span>
          </div>
        </div>
        
        <div className="space-y-1">
          <p className="text-muted-foreground">Contact Email</p>
          <div className="flex items-center">
            <Mail className="h-4 w-4 mr-2 text-primary" />
            <span>contact@{vendor.name.toLowerCase().replace(/\s+/g, '')}.com</span>
          </div>
        </div>
        
        <div className="space-y-1">
          <p className="text-muted-foreground">Phone</p>
          <div className="flex items-center">
            <Phone className="h-4 w-4 mr-2 text-primary" />
            <span>(555) 123-4567</span>
          </div>
        </div>
        
        <div className="space-y-1">
          <p className="text-muted-foreground">Website</p>
          <div className="flex items-center">
            <Link className="h-4 w-4 mr-2 text-primary" />
            <span>www.{vendor.name.toLowerCase().replace(/\s+/g, '')}.com</span>
          </div>
        </div>
        
        <div className="space-y-1">
          <p className="text-muted-foreground">Compliance Score</p>
          <div className="flex items-center">
            <div className="w-full bg-muted rounded-full h-2 mr-2">
              <div 
                className={`h-2 rounded-full ${
                  vendor.complianceScore >= 90 
                    ? 'bg-green-500' 
                    : vendor.complianceScore >= 70 
                    ? 'bg-amber-500' 
                    : 'bg-destructive'
                }`} 
                style={{ width: `${vendor.complianceScore}%` }}
              ></div>
            </div>
            <span className="text-xs">{vendor.complianceScore}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyInfo;
