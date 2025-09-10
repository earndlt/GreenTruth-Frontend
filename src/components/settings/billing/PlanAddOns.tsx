
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useUser } from '@/context/UserContext';
import { Shield } from 'lucide-react';

interface PlanAddOnsProps {
  currentPlan: string;
  addApiAccess: boolean;
  setAddApiAccess: (value: boolean) => void;
  addProcurement: boolean;
  setAddProcurement: (value: boolean) => void;
}

const PlanAddOns: React.FC<PlanAddOnsProps> = ({ 
  currentPlan, 
  addApiAccess, 
  setAddApiAccess,
  addProcurement,
  setAddProcurement
}) => {
  const { subscription, setSubscription } = useUser();

  // Detect if SoD is enabled in the subscription
  const addSoD = subscription?.addons?.includes('sod') || false;

  // Only plans team, business, enterprise can have Integration Hub Access (API Access)
  const canHaveIntegrationHub = ['team', 'business', 'enterprise'].includes(currentPlan);

  const handleApiAccessToggle = (checked: boolean) => {
    setAddApiAccess(checked);
    // Update to use new integration-hub slug for add-on
    let updatedAddons = subscription?.addons || [];
    if (checked) {
      if (!updatedAddons.includes('integration-hub')) {
        updatedAddons = [...updatedAddons, 'integration-hub'];
      }
      toast.success('Integration Hub Access will be added to your subscription (+$150/month)');
    } else {
      updatedAddons = updatedAddons.filter(addon => addon !== 'integration-hub');
      toast.success('Integration Hub Access will be removed from your subscription');
    }
    setSubscription?.({ ...subscription!, addons: updatedAddons });
  };

  const handleProcurementToggle = (checked: boolean) => {
    setAddProcurement(checked);
    let updatedAddons = subscription?.addons || [];
    if (checked) {
      if (!updatedAddons.includes('procurement')) {
        updatedAddons = [...updatedAddons, 'procurement'];
      }
      toast.success('Procurement module will be added to your subscription (+$500/month)');
    } else {
      updatedAddons = updatedAddons.filter(addon => addon !== 'procurement');
      toast.success('Procurement module will be removed from your subscription');
    }
    setSubscription?.({ ...subscription!, addons: updatedAddons });
  };

  const handleSoDToggle = (checked: boolean) => {
    const updatedAddons = checked
      ? [...(subscription?.addons || []), 'sod']
      : (subscription?.addons || []).filter(addon => addon !== 'sod');

    setSubscription?.({
      ...subscription!,
      addons: updatedAddons
    });
    
    if (checked) {
      toast.success('Segregation of Duties (SoD) will be added to your subscription (+$500/month)');
    } else {
      toast.success('Segregation of Duties (SoD) will be removed from your subscription');
    }
  };

  const handlePurchaseLead = () => {
    toast.success('Redirecting to lead purchase flow...');
  };

  // Only show SoD for plans that support it (Team and higher)
  const showSoD = currentPlan === 'team' || currentPlan === 'business' || currentPlan === 'enterprise';

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Plan Add-ons</CardTitle>
        <CardDescription>
          Customize your subscription with additional features
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {canHaveIntegrationHub && (
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="api-access">Integration Hub Access</Label>
                <p className="text-sm text-muted-foreground">
                  Add access to the Integration Hub and API Connectivity to your subscription ($150/month)
                </p>
              </div>
              <Switch 
                id="api-access" 
                checked={addApiAccess}
                onCheckedChange={handleApiAccessToggle}
              />
            </div>
          )}

          {(currentPlan === 'pro' || currentPlan === 'team' || currentPlan === 'business') && (
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="space-y-0.5">
                <Label htmlFor="procurement-access">Procurement Module</Label>
                <p className="text-sm text-muted-foreground">
                  Add procurement capabilities to your subscription ($500/month)
                </p>
              </div>
              <Switch 
                id="procurement-access" 
                checked={addProcurement}
                onCheckedChange={handleProcurementToggle}
              />
            </div>
          )}
          
          {showSoD && (
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="space-y-0.5">
                <Label htmlFor="sod-access" className="flex items-center gap-1">
                  <Shield className="h-4 w-4 text-primary" />
                  Segregation of Duties (SoD)
                </Label>
                <p className="text-sm text-muted-foreground">
                  Enhanced role-based access control with "park and post" approval workflow ($500/month)
                </p>
              </div>
              <Switch 
                id="sod-access" 
                checked={addSoD}
                onCheckedChange={handleSoDToggle}
              />
            </div>
          )}
          
          <div className="pt-4 border-t">
            <Button 
              onClick={handlePurchaseLead} 
              variant="outline"
              className="w-full"
            >
              Purchase Leads ($100 each)
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              Expand your network with qualified leads
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlanAddOns;

