import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUser } from "@/context/UserContext";

export interface PaymentMethod {
  id: string;
  type: string;
  isPrimary: boolean;
  last4?: string;
  expiry?: string;
  bankName?: string;
  accountLast4?: string;
  isPlaidConnected?: boolean;
  institutionName?: string;
}

export interface Company {
  id: string;
  name: string;
  walletId: string;
  logo: string | null;
  division?: string;
  type: string;
  status: string;
  createdAt: string;
  paymentMethods?: PaymentMethod[];
}

interface CompanySelectorProps {
  companies: Company[];
  selectedCompany: Company | null;
  onSelectCompany: (companyId: string) => void;
}

const CompanySelector = ({
  companies,
  selectedCompany,
  onSelectCompany,
}: CompanySelectorProps) => {
  const { assignedEntities, isAdmin } = useUser();

  // If user is admin, show all companies, otherwise filter by assigned entities
  const visibleCompanies = isAdmin
    ? companies
    : companies.filter((company) => assignedEntities.includes(company.id));
  // Only show selector if there are multiple companies
  if (visibleCompanies.length < 1) return null;

  return (
    <div className="flex flex-col space-y-2 mb-6">
      <label className="text-sm font-medium text-muted-foreground">
        Select Corporate Entity
      </label>
      <div className="ps-1">
        <Select
          value={selectedCompany?.id || ""}
          onValueChange={(value) => {
            console.log("CompanySelector - Selected value:", value);
            onSelectCompany(value);
          }}
        >
          <SelectTrigger className="w-full md:w-96 min-h-[60px] bg-background">
            <SelectValue placeholder="Select corporate entity" />
          </SelectTrigger>
          <SelectContent className="w-[calc(100%+2rem)] max-w-[500px]">
            {visibleCompanies.map((company) => (
              <SelectItem key={company.id} value={company.id}>
                <div className="flex flex-col space-y-0.5">
                  <span className="font-medium text-sm truncate max-w-[350px]">
                    {company.name}
                  </span>
                  {company.division && (
                    <span className="text-xs text-muted-foreground truncate max-w-[350px]">
                      {company.division}
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground">
                    Wallet ID: {company.walletId.substring(0, 20)}...
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default CompanySelector;
