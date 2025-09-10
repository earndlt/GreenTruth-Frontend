
import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import SidebarNavItem from './SidebarNavItem';
import { NavItem } from './sidebarNavData';

type SidebarNavSectionProps = {
  title?: string;
  items: NavItem[];
  collapsed: boolean;
};

const SidebarNavSection = ({ title, items, collapsed }: SidebarNavSectionProps) => {
  return (
    <div className="mt-1">
      {title && (
        <div className={cn("px-4 mb-2 text-xs font-semibold text-muted-foreground", collapsed && "text-center")}>
          {!collapsed && title}
        </div>
      )}
      <nav className="flex flex-col px-2 space-y-1">
        {items && items.map((item) => (
          <SidebarNavItem
            key={item.href}
            item={item}
            collapsed={collapsed}
          />
        ))}
      </nav>
    </div>
  );
};

export default SidebarNavSection;
