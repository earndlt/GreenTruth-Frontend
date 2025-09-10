/**
 * SIDEBAR NAVIGATION CONFIGURATION
 * 
 * PRODUCTION SIMPLIFICATION (Based on Meeting 2025-08-13):
 * - Core navigation for initial production launch with Tall Grass
 * - Essential features: Gas Trace + Active EACs + EAC Map + Transactions + Wallet + basic settings
 * - Active EACs and Transactions kept for daily operational needs
 * - EAC Map kept for sales and demo purposes (important for concept car)
 * - Removed complex features to focus on core functionality
 * - All removed items are commented out for easy re-enabling later
 * 
 * NAVIGATION STRUCTURE:
 * Main: Gas Trace, Active EACs, EAC Map, Transactions, Wallet
 * Settings: Settings & Business Profile
 * 
 * TO RE-ENABLE FEATURES:
 * 1. Uncomment the desired navigation items
 * 2. Update the EAC Registry tabs accordingly
 * 3. Ensure proper routing and component imports
 */

import {
  BarChart3,
  FileText,
  ShoppingCart,
  Users,
  AlertTriangle,
  Database,
  Boxes,
  FileSearch,
  Settings,
  HelpCircle,
  Code,
  Building,
  Bot,
  Map,
  FileCheck,
} from "lucide-react";
import { LucideIcon } from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  highlight?: boolean;
  badge?: string;
  adminOnly?: boolean;
  paidOnly?: boolean;
};

export const mainNavItems: NavItem[] = [
  // PRODUCTION NAVIGATION - Core functionality for daily operations
  {
    title: "Gas Trace",
    href: "/eac-registry?tab=gas-trace",
    icon: FileSearch,
  },
  /* HIDDEN FOR PRODUCTION - To be re-enabled in future releases
  {
    title: "Active EACs",
    href: "/eac-registry?tab=active",
    icon: FileCheck,
  },
  {
    title: "EAC Map",
    href: "/eac-registry?tab=pipeline-map",
    icon: Map,
  },
  */
  {
    title: "Transactions",
    href: "/eac-registry?tab=transactions",
    icon: FileText,
  },
  {
    title: "Wallet",
    href: "/eac-registry?tab=wallet",
    icon: Database,
  },

  // COMMENTED OUT FOR PRODUCTION - To be re-enabled later
  /*
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: BarChart3,
  },
  {
    title: "EAC Registry",
    href: "/eac-registry",
    icon: Database,
  },
  {
    title: "Vendors",
    href: "/vendors",
    icon: Users,
  },
  {
    title: "Procurement",
    href: "/procurement",
    icon: ShoppingCart,
  },
  {
    title: "Compliance Monitor",
    href: "/compliance",
    icon: AlertTriangle,
  },
  {
    title: "Reports",
    href: "/reports",
    icon: FileText,
  },
  {
    title: "AI Agent",
    href: "/ai-agent",
    icon: Bot,
  },
  */
];

export const secondaryNavItems: NavItem[] = [
  {
    title: "Settings & Business Profile",
    href: "/settings",
    icon: Settings,
    badge: "Admin",
    adminOnly: false,
  },
  // COMMENTED OUT FOR PRODUCTION - To be re-enabled later
  /*
  {
    title: "Help & Support",
    href: "/support",
    icon: HelpCircle,
  },
  {
    title: "Integration Hub",
    href: "/integration-hub",
    icon: Code,
    paidOnly: true,
  },
  */
];
