
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/context/UserContext';

interface TwoFactorAuthSettingsProps {
  onChange?: (enabled: boolean) => void;
}

const TwoFactorAuthSettings = ({ onChange }: TwoFactorAuthSettingsProps) => {
  const { toast } = useToast();
  const { userSettings, updateUserSettings, userRole, hasSodFeature } = useUser();
  
  const require2FA = userSettings.require2FA;
  const twoFactorEnabled = userSettings.twoFactorEnabled;
  
  // Local state for UI management
  const [isEnabled, setIsEnabled] = useState(twoFactorEnabled);
  const [showSetup, setShowSetup] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  
  // Check if 2FA is required for this user's role
  const is2FARequired = require2FA || (hasSodFeature && userRole === 'manager');
  
  // Sync with context
  useEffect(() => {
    setIsEnabled(twoFactorEnabled);
  }, [twoFactorEnabled]);
  
  const handleToggle = (checked: boolean) => {
    console.log('2FA toggle clicked, new state:', checked);
    
    // If 2FA is required for this role, don't allow disabling
    if (is2FARequired && !checked) {
      toast({
        title: "2FA Required",
        description: userRole === 'manager' 
          ? "Manager role requires Two-Factor Authentication for security purposes." 
          : "Two-Factor Authentication is required by your organization's policy.",
        variant: "destructive"
      });
      return;
    }
    
    if (checked) {
      // Enable 2FA - show setup
      setShowSetup(true);
    } else {
      // Disable 2FA immediately
      handleDisable2FA();
    }
  };

  const handleDisable2FA = () => {
    // Update the global context
    updateUserSettings({ twoFactorEnabled: false });
    
    // Update local state
    setIsEnabled(false);
    setShowSetup(false);
    
    // Notify parent component
    if (onChange) {
      onChange(false);
    }
    
    toast({
      title: "Two-Factor Authentication Disabled",
      description: "Your account is now less secure. We recommend enabling 2FA for better security."
    });
  };

  const handleSetupComplete = () => {
    // Verify the code (this would normally make an API call)
    if (verificationCode === "123456" || verificationCode.length === 6) {
      // Update the global context
      updateUserSettings({ twoFactorEnabled: true });
      
      // Update local state
      setIsEnabled(true);
      setShowSetup(false);
      
      // Notify parent component
      if (onChange) {
        onChange(true);
      }
      
      toast({
        title: "Two-Factor Authentication Enabled",
        description: "Your account is now more secure."
      });
    } else {
      toast({
        title: "Invalid Verification Code",
        description: "Please enter a valid 6-digit code.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Two-Factor Authentication
        </CardTitle>
        <CardDescription>
          Add an extra layer of security to your account by requiring a verification code in addition to your password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {is2FARequired && !isEnabled && (
          <Alert className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {userRole === 'manager' 
                ? "As a Manager role, Two-Factor Authentication is required for your account to approve transactions."
                : "Two-Factor Authentication is required by your organization's security policy."}
            </AlertDescription>
          </Alert>
        )}
        
        <div className="flex items-center justify-between mb-6">
          <div>
            <Label htmlFor="2fa-toggle" className="text-base font-medium">
              Enable Two-Factor Authentication
            </Label>
            <p className="text-sm text-muted-foreground mt-1">
              Use an authenticator app to generate verification codes.
            </p>
          </div>
          <Switch 
            id="2fa-toggle" 
            checked={isEnabled} 
            onCheckedChange={handleToggle}
            disabled={is2FARequired && isEnabled}
          />
        </div>
        
        {showSetup && (
          <div className="bg-muted p-4 rounded-md mt-4 space-y-4">
            <div className="space-y-2">
              <Label>Scan this QR code with an authenticator app</Label>
              <div className="bg-white p-4 rounded-md w-48 h-48 mx-auto flex items-center justify-center border">
                <p className="text-sm text-center text-muted-foreground">
                  [QR Code Placeholder]<br />
                  This would be a real QR code in production
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="verification-code">Enter the verification code</Label>
              <div className="flex gap-2">
                <Input 
                  id="verification-code" 
                  placeholder="000000" 
                  maxLength={6}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                />
                <Button onClick={handleSetupComplete}>Verify</Button>
              </div>
              <p className="text-xs text-muted-foreground">
                For demo purposes, enter "123456" or any 6-digit code
              </p>
            </div>
            
            <div className="pt-2">
              <Button variant="outline" onClick={() => setShowSetup(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}
        
        {isEnabled && !showSetup && (
          <div className="bg-green-50 border border-green-200 p-4 rounded-md">
            <p className="text-green-800 font-medium">Two-Factor Authentication is enabled</p>
            <p className="text-sm text-green-700 mt-1">
              Your account has an extra layer of security.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TwoFactorAuthSettings;
