
import React from 'react';
import { cn } from '@/lib/utils';
import { ProductCategory, MrvSubcategory } from '../types';
import { Info } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface ProductCategoryStepProps {
  productCategories: ProductCategory[];
  selectedCategory: string | null;
  setSelectedCategory: (categoryId: string) => void;
  mrvSubcategories: MrvSubcategory[];
  toggleSubcategory: (id: string) => void;
}

const ProductCategoryStep: React.FC<ProductCategoryStepProps> = ({ 
  productCategories, 
  selectedCategory, 
  setSelectedCategory,
  mrvSubcategories,
  toggleSubcategory
}) => {
  // Find the selected category object
  const selectedCategoryObj = selectedCategory 
    ? productCategories.find(category => category.id === selectedCategory) 
    : null;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-medium mb-3">
          {selectedCategory ? 'Selected Product Category' : 'Select Product Category'}
        </h3>
        
        {selectedCategory ? (
          // Show only the selected category
          <div className="border rounded-md p-4 bg-primary/5 border-primary">
            <div className="font-medium">{selectedCategoryObj?.name}</div>
            <div className="text-sm text-muted-foreground">{selectedCategoryObj?.description}</div>
            <button 
              onClick={() => setSelectedCategory('')} 
              className="text-sm text-primary hover:underline mt-2"
            >
              Change selection
            </button>
          </div>
        ) : (
          // Show all categories when nothing is selected
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {productCategories.map(category => (
              <div
                key={category.id}
                className="p-4 border rounded-md cursor-pointer hover:border-primary transition-colors"
                onClick={() => setSelectedCategory(category.id)}
              >
                <div className="font-medium">{category.name}</div>
                <div className="text-sm text-muted-foreground">{category.description}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedCategory === '8' && (
        <Accordion type="single" collapsible defaultValue="subcategories" className="border rounded-md">
          <AccordionItem value="subcategories" className="border-none">
            <AccordionTrigger className="px-4 py-3 hover:no-underline font-medium">
              Select MRV Natural Gas Subcategories
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <p className="text-sm text-muted-foreground mb-4">
                Please select at least one subcategory that applies to your procurement needs
              </p>
              <div className="space-y-3">
                {mrvSubcategories.map(subcategory => (
                  <div 
                    key={subcategory.id}
                    className={cn(
                      "p-3 border rounded-md transition-colors flex items-start gap-3",
                      subcategory.selected ? "border-primary bg-primary/5" : ""
                    )}
                  >
                    <Checkbox 
                      id={subcategory.id} 
                      checked={subcategory.selected}
                      onCheckedChange={() => toggleSubcategory(subcategory.id)}
                      className="mt-1"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Label 
                          htmlFor={subcategory.id}
                          className="font-medium cursor-pointer"
                        >
                          {subcategory.name}
                        </Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="w-[200px]">{subcategory.description}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <p className="text-sm text-muted-foreground">{subcategory.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </div>
  );
};

export default ProductCategoryStep;
