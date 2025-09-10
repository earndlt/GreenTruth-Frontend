
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Boxes, TrendingUp, AlertTriangle, BarChart2 } from 'lucide-react';

const SupplyChain = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Supply Chain</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Chain Visibility</CardTitle>
            <CardDescription>Monitor suppliers and logistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Boxes className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold">87%</span>
              </div>
              <span className="text-sm text-muted-foreground">12 tiers mapped</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Carbon Footprint</CardTitle>
            <CardDescription>End-to-end emissions tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-8 w-8 text-green-500" />
                <span className="text-2xl font-bold">-12%</span>
              </div>
              <span className="text-sm text-muted-foreground">YoY reduction</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Risk Assessment</CardTitle>
            <CardDescription>Supply chain vulnerabilities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-8 w-8 text-amber-500" />
                <span className="text-2xl font-bold">3</span>
              </div>
              <span className="text-sm text-muted-foreground">High priority alerts</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="col-span-1 md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle>Supply Chain Performance</CardTitle>
          <CardDescription>Year-to-date sustainability metrics</CardDescription>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">
          <div className="flex flex-col items-center text-center">
            <BarChart2 className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              Interactive supply chain performance charts coming soon
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupplyChain;
