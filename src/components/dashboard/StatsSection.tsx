
import React from 'react';
import { AlertTriangle, ShoppingCart, Database, Users } from 'lucide-react';
import StatCard from '@/components/StatCard';

const StatsSection = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <StatCard 
        title="Active Regulations" 
        value="245" 
        icon={<AlertTriangle className="h-6 w-6" />} 
        trend={{ value: 12, isPositive: true }}
      />
      <StatCard 
        title="Pending Procurements" 
        value="18" 
        icon={<ShoppingCart className="h-6 w-6" />} 
        trend={{ value: 5, isPositive: true }}
      />
      <StatCard 
        title="Tracked EACs" 
        value="1,432" 
        icon={<Database className="h-6 w-6" />} 
        trend={{ value: 23, isPositive: true }}
      />
      <StatCard 
        title="Vendor Network" 
        value="87" 
        icon={<Users className="h-6 w-6" />} 
        trend={{ value: 3, isPositive: true }}
      />
    </div>
  );
};

export default StatsSection;
