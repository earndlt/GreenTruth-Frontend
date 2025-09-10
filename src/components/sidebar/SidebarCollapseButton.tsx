
import React from 'react';
import { cn } from '@/lib/utils';

type SidebarCollapseButtonProps = {
  collapsed: boolean;
  onToggle: () => void;
};

const SidebarCollapseButton = ({ collapsed, onToggle }: SidebarCollapseButtonProps) => {
  return (
    <div className="border-t p-3">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-center p-2 rounded-md hover:bg-muted"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn("h-5 w-5 transition-transform", collapsed ? "rotate-180" : "")}
        >
          {collapsed ? (
            <path d="m9 18 6-6-6-6" />
          ) : (
            <path d="m15 18-6-6 6-6" />
          )}
        </svg>
      </button>
    </div>
  );
};

export default SidebarCollapseButton;
