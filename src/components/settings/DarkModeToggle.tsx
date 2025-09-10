
import React, { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

const DarkModeToggle = () => {
  const { toast } = useToast();
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Initialize the toggle based on current theme
  useEffect(() => {
    // Check if there's a saved theme preference or use system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const isDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    setIsDarkMode(isDark);
    
    // Make sure the theme is properly applied on initial load
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = (checked: boolean) => {
    setIsDarkMode(checked);
    
    if (checked) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }

    toast({
      title: checked ? "Dark mode enabled" : "Light mode enabled",
      description: `Theme preference has been saved.`,
      duration: 2000,
    });
  };

  return (
    <div className="flex items-center justify-between">
      <div className="space-y-0.5">
        <Label htmlFor="dark-mode">Dark Mode</Label>
        <p className="text-sm text-muted-foreground">
          Switch between light and dark theme
        </p>
      </div>
      <Switch 
        id="dark-mode" 
        checked={isDarkMode}
        onCheckedChange={toggleDarkMode}
      />
    </div>
  );
};

export default DarkModeToggle;
