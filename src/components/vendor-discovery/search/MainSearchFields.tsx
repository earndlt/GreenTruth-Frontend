import React, { useState, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormDescription, FormControl } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { SearchFormValues } from './types';
import { Checkbox } from '@/components/ui/checkbox';

interface MainSearchFieldsProps {
  form: UseFormReturn<SearchFormValues>;
}

const NATURAL_GAS_EMISSION_SOURCES = [
  'Production',
  'Processing',
  'Transmission',
  'Gathering & Boosting',
  'Distribution'
];

const MainSearchFields: React.FC<MainSearchFieldsProps> = ({ form }) => {
  const [productTypes, setProductTypes] = useState<string[]>([
    'Natural Gas',
    'Methanol',
    'Renewable Energy',
    'Thermal Credits'
  ]);
  const [newProduct, setNewProduct] = useState('');
  const [showAddProduct, setShowAddProduct] = useState(false);

  useEffect(() => {
    // Load products from localStorage (product procurement policies)
    const savedPolicies = localStorage.getItem('productProcurementPolicies');
    if (savedPolicies) {
      const policies = JSON.parse(savedPolicies);
      const policyProducts = policies.map((policy: { name: string }) => policy.name);
      setProductTypes(prevTypes => {
        const uniqueProducts = new Set([...prevTypes, ...policyProducts]);
        return Array.from(uniqueProducts);
      });
    }
  }, []);

  const handleAddProduct = () => {
    if (newProduct.trim() && !productTypes.includes(newProduct.trim())) {
      setProductTypes(prev => [...prev, newProduct.trim()]);
      setNewProduct('');
      setShowAddProduct(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={form.control}
        name="productType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Product Type</FormLabel>
            <Select
              onValueChange={(value) => {
                if (value === "add_new") {
                  setShowAddProduct(true);
                  return;
                }
                field.onChange(value);
                // Reset emission sources when changing product type
                if (value !== "Natural Gas") {
                  form.setValue("emissionSources", []);
                }
              }}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select product type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {productTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
                <SelectItem value="add_new">
                  + Add New Product
                </SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>
              Select the primary product category you're looking for
            </FormDescription>
          </FormItem>
        )}
      />

      {showAddProduct && (
        <FormItem className="space-y-2">
          <FormLabel>New Product Type</FormLabel>
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Enter new product type"
              value={newProduct}
              onChange={(e) => setNewProduct(e.target.value)}
              className="flex-1 bg-[#F1F0FB] border-[#9b87f5] focus:ring-[#9b87f5]"
            />
            <Button 
              onClick={handleAddProduct} 
              size="sm" 
              variant="outline" 
              className="border-[#9b87f5] text-[#1A1F2C] hover:bg-[#F1F0FB]"
            >
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>
        </FormItem>
      )}

      {form.watch("productType") === "Natural Gas" && (
        <FormField
          control={form.control}
          name="emissionSources"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Emission Sources</FormLabel>
              <div className="flex flex-col space-y-3 bg-[#F1F0FB] p-4 rounded-md border border-[#9b87f5]">
                {NATURAL_GAS_EMISSION_SOURCES.map((source) => (
                  <div key={source} className="flex items-center space-x-2">
                    <Checkbox
                      checked={field.value?.includes(source)}
                      onCheckedChange={(checked) => {
                        const currentSources = field.value || [];
                        const updatedSources = checked
                          ? [...currentSources, source]
                          : currentSources.filter((s) => s !== source);
                        field.onChange(updatedSources);
                      }}
                    />
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {source}
                    </label>
                  </div>
                ))}
              </div>
              <FormDescription>
                Select relevant emission sources along the natural gas supply chain
              </FormDescription>
            </FormItem>
          )}
        />
      )}
    </div>
  );
};

export default MainSearchFields;
