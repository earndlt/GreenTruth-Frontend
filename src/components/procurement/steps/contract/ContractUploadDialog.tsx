
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FileUp } from 'lucide-react';

interface ContractUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContinue: () => void;
  onSkip: () => void;
}

const ContractUploadDialog: React.FC<ContractUploadDialogProps> = ({
  open,
  onOpenChange,
  onContinue,
  onSkip
}) => {
  const [file, setFile] = React.useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = () => {
    if (file) {
      // In a real implementation, you would upload the file to your storage
      console.log('Uploading contract:', file.name);
      onContinue();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Contract Document</DialogTitle>
          <DialogDescription>
            Upload the finalized contract document for this vendor relationship
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
            <input
              type="file"
              id="contract"
              className="hidden"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
            />
            <label
              htmlFor="contract"
              className="flex flex-col items-center gap-2 cursor-pointer"
            >
              <FileUp className="h-8 w-8 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {file ? file.name : 'Click to upload contract document'}
              </span>
            </label>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onSkip}>
              Skip for Now
            </Button>
            <Button onClick={handleUpload} disabled={!file}>
              Continue to Purchase Order
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContractUploadDialog;
