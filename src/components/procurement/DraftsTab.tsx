
import React from 'react';
import DraftRfpItem from './DraftRfpItem';

interface DraftsTabProps {
  companyId: string;
}

const DraftsTab: React.FC<DraftsTabProps> = ({ companyId }) => {
  // Mock data - in a real app, this would be fetched based on companyId
  const drafts = [
    {
      id: '1',
      title: 'Hydrogen Supply Draft',
      description: 'Draft for future hydrogen procurement needs',
      completeness: 40,
      dueDate: '',
      responses: 0
    },
    {
      id: '2',
      title: 'LNG Long-term Contract',
      description: 'Long-term LNG supply contract considerations',
      completeness: 65,
      dueDate: '',
      responses: 0
    }
  ];

  return (
    <div className="space-y-4">
      {drafts.length > 0 ? (
        drafts.map(draft => (
          <DraftRfpItem key={draft.id} draft={draft} />
        ))
      ) : (
        <div className="text-center p-10 text-muted-foreground">
          No draft RFPs for this company.
        </div>
      )}
    </div>
  );
};

export default DraftsTab;
