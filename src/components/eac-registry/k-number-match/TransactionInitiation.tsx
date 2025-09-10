import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { MatchedEAC } from "./types";
import { Company } from "../CompanySelector";

interface TransactionInitiationProps {
  matchedEACs: MatchedEAC[];
  selectedCompany: Company;
  transactionType: "spot" | "forward";
  onInitiateTransaction: () => void;
}

const TransactionInitiation: React.FC<TransactionInitiationProps> = ({
  matchedEACs,
  selectedCompany,
  transactionType,
  onInitiateTransaction,
}) => {
  const navigate = useNavigate();

  const totalVolume = matchedEACs.reduce((sum, eac) => sum + eac.volume, 0);

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <CardTitle className="mb-2">
              Initialize {transactionType === "spot" ? "Spot" : "Forward"}{" "}
              Transaction
            </CardTitle>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <div>
                <p className="text-sm text-muted-foreground">Total Volume</p>
                <p className="text-xl font-bold">
                  {totalVolume.toLocaleString()} MMBtu
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">EACs</p>
                <p className="text-xl font-bold">{matchedEACs.length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Company</p>
                <p className="text-xl font-medium">{selectedCompany.name}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-stretch w-full md:w-auto">
            <Button className="w-full" onClick={onInitiateTransaction}>
              Initialize Transaction
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionInitiation;
