
import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import RoleIndicator from '@/components/RoleIndicator';
import { cn } from '@/lib/utils';

const MainLayout = () => {
  // State to track sidebar collapsed state for adjusting main content
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Initialize from localStorage and listen for custom sidebarToggle event
  useEffect(() => {
    // Function to handle sidebar toggle event
    const handleSidebarToggle = (e: CustomEvent) => {
      setSidebarCollapsed(e.detail.collapsed);
    };
    
    // Add event listener for custom event
    window.addEventListener('sidebarToggle', handleSidebarToggle as EventListener);
    
    // Initialize from localStorage if available
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState) {
      setSidebarCollapsed(savedState === 'true');
    }
    
    return () => {
      window.removeEventListener('sidebarToggle', handleSidebarToggle as EventListener);
    };
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      {/* Main content */}
      <div 
        className={cn(
          "flex flex-col flex-1 transition-all duration-300 overflow-hidden",
          sidebarCollapsed ? "ml-[60px]" : "ml-[240px]"
        )}
      >
        <Header />
        
        {/* Role indicator */}
        <div className="px-4 py-2 border-b bg-muted/30">
          <div className="container mx-auto flex justify-between items-center">
            <RoleIndicator />
            <span className="text-xs text-muted-foreground">
              Access varies based on user role
            </span>
          </div>
        </div>
        
        {/* Main scrollable area */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
