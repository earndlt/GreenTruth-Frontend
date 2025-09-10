import React from "react";
import { useNavigate } from "react-router-dom";
import { Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DashboardCard from "@/components/DashboardCard";
import { WalletEntity } from "@/types/wallet";
import WalletSummary from "./wallet-summary/WalletSummary";
import MonthlyStats from "./wallet-summary/MonthlyStats";
import { calculateWalletTokens } from "./wallet-summary/walletUtils";

interface EacRegistryCardProps {
  corporateWallets: WalletEntity[];
  selectedWallet: WalletEntity;
  setSelectedWallet: (wallet: WalletEntity) => void;
}

const EacRegistryCard = ({
  corporateWallets,
  selectedWallet,
  setSelectedWallet,
}: EacRegistryCardProps) => {
  const navigate = useNavigate();

  // Calculate wallet token values using our utility function
  const { displayHoldings, totalTokens, totalMMBtuTokens } =
    calculateWalletTokens(selectedWallet);

  // Navigate to the EAC Registry wallet tab with the selected wallet ID
  const handleViewEacRegistry = () => {
    navigate("/eac-registry", {
      state: {
        activeTab: "wallet",
        selectedCompanyId: selectedWallet.id,
      },
    });
  };

  return (
    <DashboardCard
      title="EAC Registry Summary"
      description="Overview of your EAC assets and transactions"
    >
      <div className="space-y-4">
        <div className="flex flex-col space-y-1.5">
          <label className="text-xs text-muted-foreground">
            Select Corporate Entity
          </label>
          <Select
            value={selectedWallet.id}
            onValueChange={(value) => {
              const wallet = corporateWallets.find((w) => w.id === value);
              if (wallet) setSelectedWallet(wallet);
            }}
          >
            <SelectTrigger className="h-8 text-sm bg-background">
              <div className="flex items-center">
                <Building className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Select corporate entity" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {corporateWallets.map((wallet) => (
                <SelectItem key={wallet.id} value={wallet.id}>
                  {wallet.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <WalletSummary
          selectedWallet={selectedWallet}
          totalTokens={totalTokens}
          displayHoldings={displayHoldings}
          totalMMBtuTokens={totalMMBtuTokens}
        />

        <MonthlyStats />

        <div className="pt-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={handleViewEacRegistry}
          >
            View Wallet
          </Button>
        </div>
      </div>
    </DashboardCard>
  );
};

export default EacRegistryCard;
