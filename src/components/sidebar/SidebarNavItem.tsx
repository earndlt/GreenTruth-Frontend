import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NavItem } from './sidebarNavData';
import { useUser } from '@/context/UserContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SidebarNavItemProps {
  item: NavItem;
  collapsed: boolean;
}

const SidebarNavItem = ({ item, collapsed }: SidebarNavItemProps) => {
  const { isAdmin, subscription } = useUser();
  const location = useLocation();

  if (!item) return null;

  // Restrict Integration Hub visibility
  if (item.title === 'Integration Hub' && subscription) {
    const allowedPlans = ['team', 'business', 'enterprise'];
    const hasAddon = subscription.addons && subscription.addons.includes('integration-hub');
    if (!allowedPlans.includes(subscription.plan) || !hasAddon) {
      return null;
    }
  }

  // If item is undefined, don't render anything
  if (!item) {
    return null;
  }

  // Remove the check for Procurement access so it's always visible
  // We'll keep the code but make it always show Procurement for demo purposes

  // If the item requires admin access and user is not admin, don't render it
  if (item.adminOnly && !isAdmin) {
    return null;
  }

  const Icon = item.icon;

  // Custom active state detection for EAC Registry tabs
  const isActive = () => {
    if (item.href.includes('/eac-registry')) {
      // Extract tab parameter from href
      const hrefTab = item.href.split('tab=')[1];
      // Extract tab parameter from current location
      const currentTab = location.search.includes('tab=')
        ? location.search.split('tab=')[1]
        : 'gas-trace'; // Default to gas-trace if no tab specified

      // Debug logging
      /* console.log(`SidebarNavItem - ${item.title}:`, {
        hrefTab,
        currentTab,
        locationPath: location.pathname,
        locationSearch: location.search,
        isActive: location.pathname === '/eac-registry' && hrefTab === currentTab
      }); */

      // Check if we're on the EAC Registry page and the tab matches
      return location.pathname === '/eac-registry' && hrefTab === currentTab;
    }

    // For other routes, use default NavLink behavior
    return location.pathname === item.href || location.pathname.startsWith(item.href);
  };

  const active = isActive();

  const content = (
    <NavLink
      to={item.href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
        "hover:bg-accent hover:text-accent-foreground",
        active ? "bg-accent text-accent-foreground" : "text-muted-foreground",
        collapsed && "justify-center px-2",
        item.highlight && !active && "bg-primary/10 text-primary"
      )}
    >
      <Icon className={cn("h-5 w-5", collapsed && "h-5 w-5")} />
      {!collapsed && (
        <div className="flex-1 flex items-center justify-between">
          <span>{item.title}</span>
          {item.badge && (
            <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              {item.badge}
            </span>
          )}
        </div>
      )}
    </NavLink>
  );

  if (collapsed) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {content}
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>{item.title}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return content;
};

export default SidebarNavItem;
