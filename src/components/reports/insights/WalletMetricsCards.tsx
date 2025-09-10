
import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  description: string;
  valueClass?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, description, valueClass = '' }) => (
  <div className="p-4 bg-muted/50 rounded-md">
    <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
    <p className={`text-3xl font-bold ${valueClass}`}>{value}</p>
    <p className="text-sm text-muted-foreground">{description}</p>
  </div>
);

const WalletMetricsCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <MetricCard 
        title="Total EACs" 
        value="83,750" 
        description="MMBtu certified" 
      />
      <MetricCard 
        title="Compliance Rating" 
        value="98%" 
        description="Above industry average" 
        valueClass="text-emerald-500" 
      />
      <MetricCard 
        title="Carbon Offset" 
        value="41,800" 
        description="MMBtu equivalent" 
      />
    </div>
  );
};

export default WalletMetricsCards;
