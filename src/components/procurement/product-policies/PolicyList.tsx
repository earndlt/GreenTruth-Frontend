
import React from 'react';
import PolicyCard from './components/PolicyCard';
import { ProductPolicy } from '../utils/types/draft-types';

interface PolicyListProps {
  policies: ProductPolicy[];
  onUpdatePolicyText: (id: string, text: string) => void;
  onRemovePolicy: (id: string) => void;
  onUploadDocument: (policyId: string, event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveDocument: (policyId: string, documentIndex: number) => void;
  isAdmin?: boolean;
  currentCompanyId: string;
}

const PolicyList = ({
  policies,
  onUpdatePolicyText,
  onRemovePolicy,
  onUploadDocument,
  onRemoveDocument,
  isAdmin,
  currentCompanyId
}: PolicyListProps) => {
  if (policies.length === 0) return null;

  return (
    <div className="space-y-4 mt-4">
      <h3 className="text-lg font-medium">Your Product Policies</h3>
      {policies.map(policy => (
        <PolicyCard
          key={policy.id}
          policy={policy}
          onUpdatePolicyText={onUpdatePolicyText}
          onRemovePolicy={onRemovePolicy}
          onUploadDocument={onUploadDocument}
          onRemoveDocument={onRemoveDocument}
          currentCompanyId={currentCompanyId}
        />
      ))}
    </div>
  );
};

export default PolicyList;
