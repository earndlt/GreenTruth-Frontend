
import React from 'react';
import { productCategories } from '../../rfp-form-data';

interface BasicInfoProps {
  title: string;
  selectedCategory: string | null;
}

const BasicInfo = ({ title, selectedCategory }: BasicInfoProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <h4 className="text-sm font-medium">Title</h4>
        <p className="text-sm text-muted-foreground">{title}</p>
      </div>
      <div>
        <h4 className="text-sm font-medium">Product Category</h4>
        <p className="text-sm text-muted-foreground">
          {selectedCategory ? productCategories.find(c => c.id === selectedCategory)?.name : 'None selected'}
        </p>
      </div>
    </div>
  );
};

export default BasicInfo;
