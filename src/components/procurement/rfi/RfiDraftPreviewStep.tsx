
import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Edit, CheckCircle, RefreshCcw } from 'lucide-react';

interface RfiDraftPreviewStepProps {
  initialDraft: string;
  isGenerating: boolean;
  onRegenerate: () => Promise<string>;
  onConfirm: (finalDraft: string) => void;
  onBack: () => void;
}

const RfiDraftPreviewStep: React.FC<RfiDraftPreviewStepProps> = ({
  initialDraft,
  isGenerating,
  onRegenerate,
  onConfirm,
  onBack,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedDraft, setEditedDraft] = useState(initialDraft);
  const [loadingRegenerate, setLoadingRegenerate] = useState(false);

  const handleRegenerate = async () => {
    setLoadingRegenerate(true);
    const newDraft = await onRegenerate();
    setEditedDraft(newDraft);
    setLoadingRegenerate(false);
    setIsEditing(false);
  };

  const handleSaveEdit = () => {
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Review & Edit RFI Draft</h3>
      <div className="flex gap-2 mb-2">
        {isEditing ? (
          <Button onClick={handleSaveEdit} size="sm" variant="outline">
            <CheckCircle className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        ) : (
          <Button onClick={() => setIsEditing(true)} size="sm" variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Edit Draft
          </Button>
        )}
        <Button
          onClick={handleRegenerate}
          size="sm"
          variant="outline"
          disabled={isGenerating || loadingRegenerate}
        >
          {(isGenerating || loadingRegenerate) ? (
            <RefreshCcw className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <RefreshCcw className="mr-2 h-4 w-4" />
          )}
          Regenerate
        </Button>
      </div>
      <Textarea
        value={editedDraft}
        onChange={(e) => setEditedDraft(e.target.value)}
        className="min-h-[300px] font-mono"
        readOnly={!isEditing}
      />
      <div className="flex justify-between mt-4">
        <Button variant="outline" onClick={onBack}>Back</Button>
        <Button onClick={() => onConfirm(editedDraft)} disabled={isGenerating || loadingRegenerate}>
          Confirm & Send RFI
        </Button>
      </div>
    </div>
  );
};

export default RfiDraftPreviewStep;
