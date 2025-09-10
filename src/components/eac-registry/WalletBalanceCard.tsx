import React from "react";
import { Download, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useOrganization } from "@/context/OrganizationContext";

interface WalletBalanceCardProps {
  walletId?: string;
}

const WalletBalanceCard = ({ walletId }: WalletBalanceCardProps) => {
  const { tokenAssets } = useOrganization();

  if (!tokenAssets?.results.length) {
    return (
      <Card className="border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Token Holdings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No token assets found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Token Holdings</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Energy Type</TableHead>
              <TableHead>Standard</TableHead>
              <TableHead>Vintage</TableHead>
              <TableHead>Pollutant Source ID</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Measurer</TableHead>
              <TableHead>Pollutant Name</TableHead>
              <TableHead className="text-right w-[200px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tokenAssets.results.map((asset) => (
              <TableRow key={asset._id}>
                <TableCell className="font-medium">
                  {asset.energy.type}
                </TableCell>
                <TableCell>
                  {asset.defaultStandard?.standard.name || "N/A"}
                </TableCell>
                <TableCell>
                  {asset.vintage.year}-{asset.vintage.month}
                </TableCell>
                <TableCell>
                  {asset.pollutantSource?.identifier?.id || "N/A"}
                </TableCell>
                <TableCell className="text-right tabular-nums font-semibold">
                  {asset.energy.quantity.amount.toLocaleString()}
                </TableCell>
                <TableCell>{asset.energy.quantity.uom}</TableCell>
                <TableCell>
                  {asset.providers.measurers.join(", ") || "N/A"}
                </TableCell>
                <TableCell>{asset.pollutantSource?.name || "N/A"}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button size="sm" variant="outline" className="h-8 px-2">
                      <Download className="h-3.5 w-3.5 mr-1" />
                      Export
                    </Button>
                    <Button size="sm" variant="default" className="h-8 px-2">
                      <ArrowUpRight className="h-3.5 w-3.5 mr-1" />
                      Transfer
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            <TableRow className="bg-muted/50">
              <TableCell colSpan={4} className="font-medium">
                Total Quantity
              </TableCell>
              <TableCell className="text-right font-bold tabular-nums">
                {tokenAssets.results
                  .reduce((sum, asset) => sum + asset.energy.quantity.amount, 0)
                  .toLocaleString()}
              </TableCell>
              <TableCell
                colSpan={4}
                className="text-right text-muted-foreground"
              >
                {tokenAssets.results[0]?.energy.quantity.uom || "N/A"}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <div className="mt-4 pt-2 border-t text-xs text-muted-foreground">
          <div className="flex justify-between items-center">
            <span>QET Verified Assets</span>
            <span>Last updated: {new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletBalanceCard;
