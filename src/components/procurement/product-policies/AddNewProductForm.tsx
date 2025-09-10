
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import ProductSelector from './components/ProductSelector';
import NewProductInput from './components/NewProductInput';

interface AddNewProductFormProps {
  newProductName: string;
  setNewProductName: (name: string) => void;
  selectedProduct: string;
  setSelectedProduct: (product: string) => void;
  productOptions: string[];
  onAddNewProduct: () => void;
  onSelectExistingProduct: () => void;
}

const AddNewProductForm = ({
  newProductName,
  setNewProductName,
  selectedProduct,
  setSelectedProduct,
  productOptions,
  onAddNewProduct,
  onSelectExistingProduct
}: AddNewProductFormProps) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Add New Product Policy</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <ProductSelector
            selectedProduct={selectedProduct}
            setSelectedProduct={setSelectedProduct}
            productOptions={productOptions}
            onSelectExistingProduct={onSelectExistingProduct}
          />
          <NewProductInput
            newProductName={newProductName}
            setNewProductName={setNewProductName}
            onAddNewProduct={onAddNewProduct}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default AddNewProductForm;

