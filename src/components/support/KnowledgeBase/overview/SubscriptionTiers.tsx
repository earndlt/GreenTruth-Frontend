
import React from 'react';

const SubscriptionTiers = () => {
  return (
    <section className="border-t pt-4">
      <h3 className="text-xl font-medium mb-3">Business Model & User Tiers</h3>
      <div className="space-y-3">
        <div className="bg-muted/50 p-4 rounded-md">
          <h4 className="font-semibold mb-2">Subscription Tiers</h4>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 subscription-tiers-grid">
            <div>
              <h5 className="font-medium text-sm">Basic</h5>
              <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                <li>• Basic EAC tracking</li>
                <li>• Limited procurement tools</li>
                <li>• Standard reporting</li>
                <li>• Single user</li>
                <li>• $75/month</li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium text-sm">Pro</h5>
              <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                <li>• Full EAC tracking</li>
                <li>• Basic procurement suite</li>
                <li>• Enhanced reporting</li>
                <li>• Single user</li>
                <li>• $175/month</li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium text-sm">Team</h5>
              <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                <li>• Complete EAC management</li>
                <li>• Full procurement suite</li>
                <li>• Advanced analytics</li>
                <li>• Up to 5 users</li>
                <li>• $750/month</li>
                <li>• API access</li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium text-sm">Business</h5>
              <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                <li>• All Team features</li>
                <li>• Enhanced API access</li>
                <li>• Priority support</li>
                <li>• Up to 15 users</li>
                <li>• $1,800/month</li>
                <li>• Basic integrations</li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium text-sm">Enterprise</h5>
              <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                <li>• All Business features</li>
                <li>• RBAC controls</li>
                <li>• Custom integrations</li>
                <li>• 15+ users</li>
                <li>• Custom pricing</li>
                <li>• Dedicated support</li>
                <li>• SLA guarantees</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6">
            <h4 className="font-semibold mb-2">Add-ons & Extensions</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-md p-3">
                <h5 className="font-medium text-sm">Segregation of Duties (SoD)</h5>
                <p className="text-xs text-muted-foreground">Advanced role-based security controls for regulatory compliance</p>
                <p className="text-xs font-medium mt-1">$250/month</p>
              </div>
              <div className="border rounded-md p-3">
                <h5 className="font-medium text-sm">Advanced Analytics</h5>
                <p className="text-xs text-muted-foreground">Enhanced reporting with custom dashboards and data exports</p>
                <p className="text-xs font-medium mt-1">$350/month</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SubscriptionTiers;
