
import React from 'react';
import { Shield } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

interface TwoFactorToggleProps {
  checked: boolean;
  onToggle: (checked: boolean) => void;
}

const TwoFactorToggle: React.FC<TwoFactorToggleProps> = ({ checked, onToggle }) => (
  <div className="mb-4 flex items-center justify-between p-4 bg-muted rounded">
    <div>
      <div className="font-medium flex items-center gap-2">
        <Shield className="h-4 w-4 text-muted-foreground" />
        Require Two-Factor Authentication (2FA)
      </div>
      <div className="text-xs text-muted-foreground">
        When enabled, all users will be required to set up 2FA.
      </div>
    </div>
    <Switch
      checked={checked}
      onCheckedChange={onToggle}
      aria-label="Require 2FA for all users"
    />
  </div>
);

export default TwoFactorToggle;
