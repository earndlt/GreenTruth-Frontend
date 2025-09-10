import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Database } from "lucide-react";
import { useEac } from "@/context/EacContext";

const EacRegistryStatus = () => {
  const { eacOrganizations, loading } = useEac();

  // Calculate totals from the API data
  const totals = React.useMemo(() => {
    if (!eacOrganizations || eacOrganizations.length === 0) {
      return {
        activeQets: 0,
        totalBalance: 0,
        organizations: 0,
      };
    }

    const activeQets = eacOrganizations.reduce((sum, org) => {
      return sum + (org.assets?.summary?.count || 0);
    }, 0);

    const totalBalance = eacOrganizations.reduce((sum, org) => {
      return sum + (org.assets?.summary?.total_balance_total || 0);
    }, 0);

    return {
      activeQets,
      totalBalance,
      organizations: eacOrganizations.length,
    };
  }, [eacOrganizations]);

  return (
    <Card className="bg-gradient-to-r from-teal-500/10 to-emerald-500/10 border-emerald-200 dark:border-emerald-900">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-full eco-gradient flex items-center justify-center">
              <Database className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-medium">
                EarnDLT Blockchain Registry
              </h3>
              <p className="text-sm text-muted-foreground">
                Connected to EarnDLT Blockchain
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">ACTIVE QETs</p>
              <p className="text-xl font-medium">
                {loading ? "..." : totals.activeQets.toLocaleString()}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">TOTAL BALANCE</p>
              <p className="text-xl font-medium">
                {loading
                  ? "..."
                  : `${(totals.totalBalance / 1000).toFixed(1)}k MMBtu`}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">CONTRACT ID</p>
              <p className="text-xl font-medium">QET-28495</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EacRegistryStatus;
