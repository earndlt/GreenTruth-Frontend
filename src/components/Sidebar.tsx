
import React, { useEffect, useState } from 'react';
import SidebarLogo from './sidebar/SidebarLogo';
import SidebarNavSection from './sidebar/SidebarNavSection';
import SidebarCollapseButton from './sidebar/SidebarCollapseButton';
import { mainNavItems, secondaryNavItems } from './sidebar/sidebarNavData';
import { cn } from '@/lib/utils';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [logo, setLogo] = useState<string | null>(null);
  
  // Initialize from localStorage immediately when component mounts
  useEffect(() => {
    // Check if sidebar collapse preference exists in localStorage
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState) {
      // Convert the string to boolean and update state
      const shouldCollapse = savedState === 'true';
      setCollapsed(shouldCollapse);
    }
    
    // Listen for sidebarToggle events from other components
    const handleSidebarToggle = (e: CustomEvent) => {
      setCollapsed(e.detail.collapsed);
    };
    
    window.addEventListener('sidebarToggle', handleSidebarToggle as EventListener);
    
    // Load logo from localStorage
    const savedLogo = localStorage.getItem('corporateLogo');
    if (savedLogo) {
      setLogo(savedLogo);
    }
    
    return () => {
      window.removeEventListener('sidebarToggle', handleSidebarToggle as EventListener);
    };
  }, []);
  
  // Dispatch custom event and save preference when sidebar state changes
  useEffect(() => {
    // Save preference to localStorage
    localStorage.setItem('sidebarCollapsed', collapsed.toString());
    
    // Dispatch custom event for MainLayout to listen to
    const event = new CustomEvent('sidebarToggle', { 
      detail: { collapsed } 
    });
    window.dispatchEvent(event);
  }, [collapsed]);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };
  
  return (
    <div 
      className={cn(
        "h-screen fixed left-0 top-0 z-5 flex flex-col border-r bg-background transition-all duration-300",
        collapsed ? "w-[60px]" : "w-[240px]"
      )}
    >
      <SidebarLogo collapsed={collapsed} />
      
      <div className="flex-1 overflow-auto py-4">
        <SidebarNavSection items={mainNavItems} collapsed={collapsed} />
        
        <SidebarNavSection 
          title="SETTINGS" 
          items={secondaryNavItems} 
          collapsed={collapsed} 
        />
      </div>
      
      <SidebarCollapseButton collapsed={collapsed} onToggle={toggleSidebar} />
    </div>
  );
};

export default Sidebar;
