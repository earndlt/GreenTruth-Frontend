import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { RefreshCcw, Award } from "lucide-react";
import WalletBalanceCard from "./WalletBalanceCard";
import WalletDetailsCard from "./WalletDetailsCard";
import RetirementCertificatesCard from "./RetirementCertificatesCard";
import RetireTokenDialog from "./RetireTokenDialog";
import CompanySelector, { Company } from "./CompanySelector";
import { useOrganization } from "@/context/OrganizationContext";

const WalletTab = () => {
  const [selectedWallet, setSelectedWallet] = useState<Company | null>(null);
  const [isRetireDialogOpen, setIsRetireDialogOpen] = useState(false);
  const {
    wallets,
    organizations,
    tokenAssets,
    fetchTokenAssets,
    loadingTokenAssets,
  } = useOrganization();

  // Convert wallets to company format
  const companies: Company[] = wallets.map((wallet) => ({
    id: wallet.id,
    name: wallet.name,
    walletId: wallet.address,
    logo: wallet.partnerProfile?.logo || null,
    division: wallet.profile.name || undefined,
    type: wallet.type,
    status: wallet.status,
    createdAt: wallet.createdAt,
  }));

  // Load initial wallet selection
  useEffect(() => {
    if (wallets.length > 0 && !selectedWallet) {
      const lastWallet = wallets[wallets.length - 1];
      setSelectedWallet({
        id: lastWallet.id,
        name: lastWallet.name,
        walletId: lastWallet.address,
        logo: lastWallet.partnerProfile?.logo || null,
        division: lastWallet.profile.name,
        type: lastWallet.type,
        status: lastWallet.status,
        createdAt: lastWallet.createdAt,
      });

      fetchTokenAssets(lastWallet.id, organizations[0].name);
    }
  }, [wallets]);

  const handleCompanyChange = (companyId: string) => {
    const wallet = wallets.find((w) => w.id === companyId);
    if (wallet) {
      fetchTokenAssets(wallet.id, organizations[0].name);
      setSelectedWallet({
        id: wallet.id,
        name: wallet.name,
        walletId: wallet.address,
        logo: wallet.partnerProfile?.logo || null,
        division: wallet.profile.name,
        type: wallet.type,
        status: wallet.status,
        createdAt: wallet.createdAt,
      });
    }
  };

  if (!selectedWallet || loadingTokenAssets) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full border-4 border-primary border-t-transparent h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="pt-4 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>EarnDLT Multi-Sig Wallet</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsRetireDialogOpen(true)}
            className="bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400"
          >
            <Award className="h-4 w-4 mr-2" />
            Retire Tokens
          </Button>
        </CardHeader>
        <CardContent>
          <CompanySelector
            companies={companies}
            selectedCompany={selectedWallet}
            onSelectCompany={handleCompanyChange}
          />

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              {selectedWallet.logo && (
                <div className="mr-3">
                  <img
                    src={selectedWallet.logo}
                    alt={`${selectedWallet.name} Logo`}
                    className="h-10 w-10 object-contain rounded-sm border p-1"
                  />
                </div>
              )}
              <div>
                <h3 className="text-lg font-medium">{selectedWallet.name}</h3>
                <p className="text-muted-foreground">
                  Last updated: {selectedWallet.createdAt}
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <RefreshCcw className="h-4 w-4 mr-2" />
              Refresh Balance
            </Button>
          </div>

          <WalletBalanceCard walletId={selectedWallet.id} />
          <WalletDetailsCard
            walletId={selectedWallet.id}
            walletName={selectedWallet.name}
            walletType={selectedWallet.type}
            walletStatus={selectedWallet.status}
            walletAddress={selectedWallet.walletId}
            createdAt={selectedWallet.createdAt}
          />
        </CardContent>
      </Card>

      <RetirementCertificatesCard companyId={selectedWallet.id} />

      <RetireTokenDialog
        isOpen={isRetireDialogOpen}
        onClose={() => setIsRetireDialogOpen(false)}
        companyName={selectedWallet.name}
      />
    </div>
  );
};

export default WalletTab;
