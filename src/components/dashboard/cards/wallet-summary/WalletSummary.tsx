
import React from 'react';
import { Wallet, Copy } from 'lucide-react';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { WalletEntity } from '@/types/wallet';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface WalletSummaryProps {
  selectedWallet: WalletEntity;
  totalTokens: number;
  displayHoldings: Array<{
    name: string;
    amount: number;
    unit: string;
    icon: React.ElementType;
    color: string;
    bgColor: string;
  }>;
  totalMMBtuTokens: number;
}

const WalletSummary = ({ 
  selectedWallet, 
  totalTokens, 
  displayHoldings, 
  totalMMBtuTokens 
}: WalletSummaryProps) => {
  const { toast } = useToast();
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(selectedWallet.walletId);
    toast({
      title: "Wallet ID copied",
      description: "The wallet ID has been copied to your clipboard",
    });
  };
  
  return (
    <div className="p-3 rounded-md bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <Wallet className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
          <p className="text-sm font-medium text-blue-700 dark:text-blue-400">Wallet Summary</p>
        </div>
        <span className="text-xs font-medium text-blue-600 dark:text-blue-400">Total: {totalTokens.toLocaleString()} Tokens</span>
      </div>
      
      <div className="mt-3">
        <Table className="text-xs">
          <TableBody>
            {displayHoldings.map((item, index) => (
              <TableRow key={index} className="border-b-0">
                <TableCell className="py-1 pl-0 pr-2">
                  <div className={`w-6 h-6 rounded-full ${item.bgColor} flex items-center justify-center ${item.color}`}>
                    <item.icon className="h-3.5 w-3.5" />
                  </div>
                </TableCell>
                <TableCell className="py-1 text-slate-700 dark:text-slate-300">{item.name}</TableCell>
                <TableCell className="py-1 text-right font-medium tabular-nums">
                  {item.amount.toLocaleString()} {item.unit}
                </TableCell>
                <TableCell className="py-1 pl-2 pr-0 w-1/3">
                  <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full">
                    <div 
                      className={`h-full rounded-full ${item.bgColor.replace('bg-', 'bg-').replace('/20', '')}`}
                      style={{ 
                        width: item.unit === "MMBtu" 
                          ? `${(item.amount / totalMMBtuTokens) * 100}%` 
                          : `${(item.amount / totalTokens) * 100}%`
                      }}
                    ></div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex items-center mt-3 pt-2 border-t border-blue-200 dark:border-blue-800 text-xs">
        <span className="text-blue-600 dark:text-blue-400 mr-2">Wallet ID:</span>
        <div className="flex items-center flex-1 group">
          <span className="font-mono text-slate-600 dark:text-slate-400 mr-2">
            {selectedWallet.walletId}
          </span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={copyToClipboard}
                  className="p-1 rounded-md invisible group-hover:visible hover:bg-blue-100 dark:hover:bg-blue-800/30"
                  aria-label="Copy wallet ID"
                >
                  <Copy className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy wallet ID</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};

export default WalletSummary;
