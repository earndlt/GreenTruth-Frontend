
import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Info } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { BasicUserRole, SodUserRole } from '@/context/user/userTypes';

interface RoleSelectorProps {
  selectedRole: string;
  onRoleChange: (role: string) => void;
}

const RoleSelector = ({ selectedRole, onRoleChange }: RoleSelectorProps) => {
  const { hasSodFeature } = useUser();
  
  // If the current selected role isn't valid for the current mode, reset it
  React.useEffect(() => {
    if (hasSodFeature) {
      // Check if the selected role is a valid SoD role
      const validSodRoles: SodUserRole[] = ['administrator', 'treasury', 'risk', 'trader', 'professional', 'manager', 'analyst'];
      if (!validSodRoles.includes(selectedRole as SodUserRole)) {
        onRoleChange('analyst'); // Default SoD role
      }
    } else {
      // Check if the selected role is a valid basic role
      const validBasicRoles: BasicUserRole[] = ['admin', 'member', 'guest'];
      if (!validBasicRoles.includes(selectedRole as BasicUserRole)) {
        onRoleChange('member'); // Default basic role
      }
    }
  }, [hasSodFeature, selectedRole, onRoleChange]);

  return (
    <div className="space-y-4">
      <Label>User Role</Label>
      
      {hasSodFeature ? (
        <>
          <Alert className="mb-4 bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              Your organization is using Segregation of Duties (SoD) for enhanced access control based on the Sarbanes-Oxley Act.
            </AlertDescription>
          </Alert>
          
          <RadioGroup 
            value={selectedRole} 
            onValueChange={onRoleChange}
            className="space-y-3"
          >
            <div className="flex items-start space-x-2">
              <RadioGroupItem value="administrator" id="administrator" className="mt-1" />
              <div>
                <Label htmlFor="administrator" className="font-medium">Administrator</Label>
                <p className="text-sm text-muted-foreground">
                  Platform administrator with limited transactional permissions.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <RadioGroupItem value="treasury" id="treasury" className="mt-1" />
              <div>
                <Label htmlFor="treasury" className="font-medium">Treasury</Label>
                <p className="text-sm text-muted-foreground">
                  Initiates token movements, transactions, and retirements.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <RadioGroupItem value="risk" id="risk" className="mt-1" />
              <div>
                <Label htmlFor="risk" className="font-medium">Risk</Label>
                <p className="text-sm text-muted-foreground">
                  Manages vendors and creates batches for token producers.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <RadioGroupItem value="trader" id="trader" className="mt-1" />
              <div>
                <Label htmlFor="trader" className="font-medium">Trader</Label>
                <p className="text-sm text-muted-foreground">
                  Combined Treasury and Risk role for efficient trading operations.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <RadioGroupItem value="professional" id="professional" className="mt-1" />
              <div>
                <Label htmlFor="professional" className="font-medium">Professional</Label>
                <p className="text-sm text-muted-foreground">
                  External role for third-party marketers with limited permissions.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <RadioGroupItem value="manager" id="manager" className="mt-1" />
              <div>
                <Label htmlFor="manager" className="font-medium">Manager</Label>
                <p className="text-sm text-muted-foreground text-amber-600">
                  <strong>Requires 2FA:</strong> Approves transactions, retirements, and other activities.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <RadioGroupItem value="analyst" id="analyst" className="mt-1" />
              <div>
                <Label htmlFor="analyst" className="font-medium">Analyst</Label>
                <p className="text-sm text-muted-foreground">
                  Read-only access to all data and platform sections.
                </p>
              </div>
            </div>
          </RadioGroup>
        </>
      ) : (
        <>
          <Alert className="mb-4 bg-amber-50 border-amber-200">
            <Info className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              Enhanced Segregation of Duties (SoD) is available as a paid add-on. Upgrade in the Billing & Subscription section.
            </AlertDescription>
          </Alert>
          
          <RadioGroup 
            value={selectedRole} 
            onValueChange={onRoleChange}
            className="space-y-3"
          >
            <div className="flex items-start space-x-2">
              <RadioGroupItem value="admin" id="admin" className="mt-1" />
              <div>
                <Label htmlFor="admin" className="font-medium">Admin</Label>
                <p className="text-sm text-muted-foreground">
                  Administrative user with all permissions. Can manage users, settings, and perform all actions.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <RadioGroupItem value="member" id="member" className="mt-1" />
              <div>
                <Label htmlFor="member" className="font-medium">Member</Label>
                <p className="text-sm text-muted-foreground">
                  Regular user who can perform all platform actions except administration.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <RadioGroupItem value="guest" id="guest" className="mt-1" />
              <div>
                <Label htmlFor="guest" className="font-medium">Guest</Label>
                <p className="text-sm text-muted-foreground">
                  Read-only access to all platform sections.
                </p>
              </div>
            </div>
          </RadioGroup>
        </>
      )}
    </div>
  );
};

export default RoleSelector;
