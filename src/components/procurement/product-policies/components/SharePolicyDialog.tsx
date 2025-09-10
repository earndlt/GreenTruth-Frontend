
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Share2 } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { Company } from '@/components/eac-registry/CompanySelector';
import { corporateWallets } from '@/data/corporateWallets';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ProductPolicy } from '../../../procurement/utils/types/draft-types';

interface SharePolicyDialogProps {
  policy: ProductPolicy;
  currentCompanyId: string;
}

const SharePolicyDialog: React.FC<SharePolicyDialogProps> = ({ policy, currentCompanyId }) => {
  const { assignedEntities, isAdmin } = useUser();
  const { toast } = useToast();
  const [selectedCompanies, setSelectedCompanies] = React.useState<string[]>([]);
  
  // Convert wallet entities to companies for selector
  const companies: Company[] = corporateWallets.map(wallet => ({
    id: wallet.id,
    name: wallet.name,
    walletId: wallet.walletId,
  }));

  // Filter available companies based on user's permissions and exclude current company
  const availableCompanies = companies.filter(company => 
    company.id !== currentCompanyId && 
    (isAdmin || assignedEntities.includes(company.id))
  );

  const handleShare = () => {
    selectedCompanies.forEach(companyId => {
      // Get existing policies for the target company
      const existingPoliciesJson = localStorage.getItem(`productProcurementPolicies-${companyId}`);
      const existingPolicies: ProductPolicy[] = existingPoliciesJson 
        ? JSON.parse(existingPoliciesJson) 
        : [];

      // Create new policy for target company
      const newPolicy: ProductPolicy = {
        ...policy,
        id: crypto.randomUUID(),
        companyId,
      };

      // Add new policy to target company's policies
      localStorage.setItem(
        `productProcurementPolicies-${companyId}`,
        JSON.stringify([...existingPolicies, newPolicy])
      );
    });

    toast({
      title: "Policy shared successfully",
      description: `Policy shared with ${selectedCompanies.length} corporate entities.`,
    });

    setSelectedCompanies([]);
  };

  if (availableCompanies.length === 0) {
    return null;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Share2 className="h-4 w-4 mr-2" />
          Share Policy
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Policy with Other Entities</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Select the corporate entities you want to share this policy with:
          </p>
          <div className="space-y-2">
            {availableCompanies.map((company) => (
              <div key={company.id} className="flex items-center space-x-2">
                <Checkbox
                  id={company.id}
                  checked={selectedCompanies.includes(company.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedCompanies([...selectedCompanies, company.id]);
                    } else {
                      setSelectedCompanies(selectedCompanies.filter(id => id !== company.id));
                    }
                  }}
                />
                <Label htmlFor={company.id} className="text-sm">
                  {company.name}
                </Label>
              </div>
            ))}
          </div>
          <div className="flex justify-end space-x-2">
            <DialogTrigger asChild>
              <Button variant="outline">Cancel</Button>
            </DialogTrigger>
            <Button
              onClick={handleShare}
              disabled={selectedCompanies.length === 0}
            >
              Share
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SharePolicyDialog;
