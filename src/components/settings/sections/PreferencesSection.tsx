
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Toggle } from '@/components/ui/toggle';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import TwoFactorAuthSettings from "../security/TwoFactorAuthSettings";
import { useUser } from '@/context/UserContext';

const PreferencesSection = () => {
  const { toast } = useToast();
  const { userSettings, updateUserSettings } = useUser();

  const handleToggleTheme = (theme: string) => {
    // This would normally connect to a theme provider
    toast({
      title: `${theme} theme selected`,
      description: "Your theme preference has been saved.",
      duration: 2000,
    });
  };

  const handle2FAChange = (enabled: boolean) => {
    console.log("PreferencesSection 2FA change:", enabled);
    updateUserSettings({ twoFactorEnabled: enabled });
    // In a real app, this would update the user's 2FA settings in the backend
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Theme Preferences</CardTitle>
          <CardDescription>
            Choose your preferred application theme
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-4">
              <Toggle 
                pressed={true} 
                onPressedChange={() => handleToggleTheme('Light')}
                className="data-[state=on]:bg-primary"
              >
                Light
              </Toggle>
              <Toggle 
                pressed={false} 
                onPressedChange={() => handleToggleTheme('Dark')}
                className="data-[state=on]:bg-primary"
              >
                Dark
              </Toggle>
              <Toggle 
                pressed={false} 
                onPressedChange={() => handleToggleTheme('System')}
                className="data-[state=on]:bg-primary"
              >
                System
              </Toggle>
            </div>
            <Label className="text-xs text-muted-foreground">
              Note: Theme preferences are currently in development
            </Label>
          </div>
        </CardContent>
      </Card>
      <TwoFactorAuthSettings onChange={handle2FAChange} />
    </div>
  );
};

export default PreferencesSection;
