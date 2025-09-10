import React from "react";
import { Wallet as WalletIcon, Copy, CheckCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { useOrganization } from "@/context/OrganizationContext";

interface WalletDetailsCardProps {
  walletId: string;
  walletName: string;
  walletType: string;
  walletStatus: string;
  walletAddress: string;
  createdAt: string;
}

const WalletDetailsCard = ({
  walletId,
  walletName,
  walletType,
  walletStatus,
  walletAddress,
  createdAt,
}: WalletDetailsCardProps) => {
  const { toast } = useToast();
  const { tokenAssets } = useOrganization();

  // Calculate total quantity from token assets
  const totalQuantity =
    tokenAssets?.results.reduce(
      (sum, asset) => sum + asset.energy.quantity.amount,
      0
    ) || 0;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(walletAddress);
    toast({
      title: "Wallet Address copied",
      description: "The wallet address has been copied to your clipboard",
    });
  };

  return (
    <Card className="border shadow-sm mt-6">
      <CardContent className="p-4">
        <div className="flex items-start gap-6 flex-wrap lg:flex-nowrap">
          <div className="flex-1 min-w-[300px]">
            <div className="flex items-center gap-2 mb-1">
              <WalletIcon className="h-4 w-4 text-emerald-500" />
              <h4 className="font-medium text-sm">Wallet Identification</h4>
            </div>
            <div className="p-3 bg-muted/40 rounded-md">
              <div className="flex items-center mb-1 group">
                <p className="font-mono text-xs mr-2 break-all">
                  {walletAddress}
                </p>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={copyToClipboard}
                        className="p-1 rounded-md hover:bg-muted-foreground/10 cursor-pointer"
                      >
                        <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Copy wallet address</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex items-center mt-2">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-500 mr-1" />
                <span className="text-xs text-muted-foreground">
                  EarnDLT Validated
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
            <div className="bg-muted/40 p-3 rounded-md">
              <p className="text-xs text-muted-foreground mb-1">
                Total Quantity
              </p>
              <p className="font-medium text-lg">
                {totalQuantity.toLocaleString()}
                <span className="text-sm font-normal text-muted-foreground ml-1">
                  {tokenAssets?.results[0]?.energy.quantity.uom || "N/A"}
                </span>
              </p>
            </div>
            <div className="bg-muted/40 p-3 rounded-md">
              <p className="text-xs text-muted-foreground mb-1">Wallet Type</p>
              <p className="font-medium">{walletType}</p>
            </div>
            <div className="bg-muted/40 p-3 rounded-md">
              <p className="text-xs text-muted-foreground mb-1">Status</p>
              <p className="font-medium">{walletStatus}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletDetailsCard;
