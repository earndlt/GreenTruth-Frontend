
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { documentTypes } from './types';

interface DocumentTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const DocumentTypeSelector = ({ value, onChange }: DocumentTypeSelectorProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select document type" />
      </SelectTrigger>
      <SelectContent>
        {documentTypes.map((type) => (
          <SelectItem key={type.value} value={type.value}>
            {type.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default DocumentTypeSelector;
