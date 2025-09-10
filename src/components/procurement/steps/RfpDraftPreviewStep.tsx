
import React, { useState } from 'react';
import { useRfpForm } from '../context/RfpFormContext';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Edit, CheckCircle } from 'lucide-react';

interface RfpDraftPreviewStepProps {
  generatedDraft: string;
  isGenerating: boolean;
  regenerateDraft: () => void;
}

const RfpDraftPreviewStep: React.FC<RfpDraftPreviewStepProps> = ({
  generatedDraft,
  isGenerating,
  regenerateDraft,
}) => {
  const { setGeneratedDraft, handleSubmit } = useRfpForm();
  const [editedDraft, setEditedDraft] = useState(generatedDraft);
  const [isEditing, setIsEditing] = useState(false);

  const handleSaveEdit = () => {
    setGeneratedDraft(editedDraft);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">AI-Generated RFP Draft</h3>
        <div className="flex gap-2">
          {isEditing ? (
            <Button 
              onClick={handleSaveEdit} 
              size="sm" 
              variant="outline"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          ) : (
            <Button 
              onClick={() => setIsEditing(true)} 
              size="sm" 
              variant="outline"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Draft
            </Button>
          )}
          <Button
            onClick={regenerateDraft}
            size="sm"
            variant="outline"
            disabled={isGenerating}
          >
            {isGenerating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Regenerate
          </Button>
        </div>
      </div>

      {isGenerating ? (
        <div className="flex flex-col items-center justify-center h-64 border rounded-md p-6 bg-muted/20">
          <Loader2 className="h-8 w-8 animate-spin mb-4 text-primary" />
          <p className="text-muted-foreground">Generating your RFP draft...</p>
          <p className="text-xs text-muted-foreground mt-1">This may take a few moments</p>
        </div>
      ) : (
        <Textarea
          value={editedDraft}
          onChange={(e) => setEditedDraft(e.target.value)}
          className="min-h-[400px] font-medium"
          placeholder="Your AI-generated RFP draft will appear here..."
          readOnly={!isEditing}
        />
      )}

      <div className="flex justify-end">
        <Button onClick={handleSubmit} className="mt-4">
          Finalize RFP
        </Button>
      </div>
    </div>
  );
};

export default RfpDraftPreviewStep;
