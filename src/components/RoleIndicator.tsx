
import React from 'react';
import { useUser } from '@/context/UserContext';
import { Shield, User, Users, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RoleIndicatorProps {
  className?: string;
  showIcon?: boolean;
  showLabel?: boolean;
}

const RoleIndicator = ({ className, showIcon = true, showLabel = true }: RoleIndicatorProps) => {
  const { userRole, hasSodFeature } = useUser();
  
  // Role display information
  const getRoleInfo = () => {
    switch (userRole) {
      // Basic RBAC roles
      case 'admin':
        return { 
          icon: <Shield className="h-4 w-4 text-primary" />,
          label: 'Administrator',
          className: "text-primary font-medium"
        };
      case 'member':
        return {
          icon: <User className="h-4 w-4 text-blue-500" />,
          label: 'Member',
          className: "text-blue-500"
        };
      case 'guest':
        return {
          icon: <User className="h-4 w-4 text-gray-500" />,
          label: 'Guest',
          className: "text-gray-500"
        };
        
      // SoD roles
      case 'administrator':
        return {
          icon: <Shield className="h-4 w-4 text-primary" />,
          label: 'Administrator',
          className: "text-primary font-medium"
        };
      case 'treasury':
        return {
          icon: <FileText className="h-4 w-4 text-green-600" />,
          label: 'Treasury',
          className: "text-green-600"
        };
      case 'risk':
        return {
          icon: <Shield className="h-4 w-4 text-orange-600" />,
          label: 'Risk',
          className: "text-orange-600"
        };
      case 'trader':
        return {
          icon: <Users className="h-4 w-4 text-purple-600" />,
          label: 'Trader',
          className: "text-purple-600"
        };
      case 'professional':
        return {
          icon: <User className="h-4 w-4 text-indigo-600" />,
          label: 'Professional',
          className: "text-indigo-600"
        };
      case 'manager':
        return {
          icon: <Shield className="h-4 w-4 text-blue-700" />,
          label: 'Manager',
          className: "text-blue-700 font-medium"
        };
      case 'analyst':
        return {
          icon: <FileText className="h-4 w-4 text-gray-600" />,
          label: 'Analyst',
          className: "text-gray-600"
        };
      
      // Legacy role
      default:
        return {
          icon: <User className="h-4 w-4" />,
          label: 'User',
          className: "text-muted-foreground"
        };
    }
  };
  
  const roleInfo = getRoleInfo();
  
  return (
    <div className={cn("flex items-center text-sm gap-1", className)}>
      {showIcon && roleInfo.icon}
      {showLabel && (
        <span className={cn(roleInfo.className)}>
          {roleInfo.label}
          {hasSodFeature && userRole !== 'admin' && userRole !== 'member' && userRole !== 'guest' && (
            <span className="ml-1 text-xs bg-blue-100 text-blue-800 px-1 rounded">SoD</span>
          )}
        </span>
      )}
    </div>
  );
};

export default RoleIndicator;
