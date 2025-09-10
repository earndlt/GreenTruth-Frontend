
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';

interface ProductSelectorProps {
  selectedProduct: string;
  setSelectedProduct: (product: string) => void;
  productOptions: string[];
  onSelectExistingProduct: () => void;
}

const ProductSelector = ({
  selectedProduct,
  setSelectedProduct,
  productOptions,
  onSelectExistingProduct
}: ProductSelectorProps) => {
  return (
    <div className="flex flex-col space-y-2">
      <Label htmlFor="existing-product">Select Existing Product:</Label>
      <div className="flex">
        <select
          id="existing-product"
          className="flex-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background mr-2"
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
        >
          <option value="">Select a product</option>
          {productOptions
            .filter(product => product)
            .map(product => (
              <option key={product} value={product}>{product}</option>
            ))}
        </select>
        <Button onClick={onSelectExistingProduct} disabled={!selectedProduct}>
          <Plus className="h-4 w-4 mr-2" />
          Add Policy
        </Button>
      </div>
    </div>
  );
};

export default ProductSelector;

