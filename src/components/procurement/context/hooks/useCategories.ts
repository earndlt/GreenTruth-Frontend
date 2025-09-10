
import { useState } from 'react';
import { MrvSubcategory } from '../../types';

export const useCategories = (
  initialMrvSubcategories: MrvSubcategory[]
) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [mrvSubcategoriesState, setMrvSubcategories] = useState<MrvSubcategory[]>(initialMrvSubcategories);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId === '' ? null : categoryId);
    if (categoryId !== '8') {
      setMrvSubcategories(mrvSubcategoriesState.map(sc => ({ ...sc, selected: false })));
    }
  };

  const toggleSubcategory = (id: string) => {
    setMrvSubcategories(mrvSubcategoriesState.map(sc => 
      sc.id === id ? { ...sc, selected: !sc.selected } : sc
    ));
  };

  return {
    selectedCategory,
    setSelectedCategory: handleCategorySelect,
    mrvSubcategories: mrvSubcategoriesState,
    toggleSubcategory
  };
};
