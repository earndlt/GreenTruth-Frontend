
import React from 'react';
import { MrvSubcategory, EnvironmentalAttribute } from '../../types';

interface CategoryAttributesProps {
  selectedMrvSubcategories: MrvSubcategory[];
  selectedAttributes: EnvironmentalAttribute[];
}

const CategoryAttributes = ({ selectedMrvSubcategories, selectedAttributes }: CategoryAttributesProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <h4 className="text-sm font-medium">MRV Subcategories</h4>
        <p className="text-sm text-muted-foreground">
          {selectedMrvSubcategories.map(sc => sc.name).join(', ') || 'None selected'}
        </p>
      </div>
      <div>
        <h4 className="text-sm font-medium">Environmental Attributes</h4>
        <p className="text-sm text-muted-foreground">
          {selectedAttributes.map(attr => attr.name).join(', ') || 'None selected'}
        </p>
      </div>
    </div>
  );
};

export default CategoryAttributes;
