
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';

interface NewProductInputProps {
  newProductName: string;
  setNewProductName: (name: string) => void;
  onAddNewProduct: () => void;
}

const NewProductInput = ({
  newProductName,
  setNewProductName,
  onAddNewProduct
}: NewProductInputProps) => {
  return (
    <div>
      <Label htmlFor="new-product">Create New Product:</Label>
      <div className="flex mt-1">
        <Input
          id="new-product"
          placeholder="Enter new product name"
          value={newProductName}
          onChange={(e) => setNewProductName(e.target.value)}
          className="mr-2"
        />
        <Button onClick={onAddNewProduct}>
          <Plus className="h-4 w-4 mr-2" />
          Add
        </Button>
      </div>
    </div>
  );
};

export default NewProductInput;

