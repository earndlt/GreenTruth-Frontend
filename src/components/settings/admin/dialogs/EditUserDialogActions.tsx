
import React from 'react';
import { Button } from '@/components/ui/button';
import { User } from '../types/userManagement';

interface EditUserDialogActionsProps {
  onCancel: () => void;
  onSave: () => void;
  onResetPassword: (() => void) | undefined;
}

const EditUserDialogActions: React.FC<EditUserDialogActionsProps> = ({
  onCancel,
  onSave,
  onResetPassword,
}) => (
  <div className="w-full flex flex-col space-y-2">
    <div className="flex flex-row items-center justify-between gap-2">
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button onClick={onSave}>
        Save
      </Button>
    </div>
    <Button
      type="button"
      variant="secondary"
      onClick={onResetPassword}
      className="w-full"
    >
      Reset Password
    </Button>
  </div>
);

export default EditUserDialogActions;
