
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Plus, X, Upload, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProductPolicy {
  id: string;
  name: string;
  policyText: string;
  documentUrls: string[];
}

const INITIAL_PRODUCT_OPTIONS = [
  'Natural Gas', 
  'Renewable Natural Gas (RNG)', 
  'Methanol',
  'LNG',
  'Carbon Offsets',
  'Hydrogen',
  'Ammonia'
];

const ProductProcurementPolicies: React.FC = () => {
  const [productPolicies, setProductPolicies] = useState<ProductPolicy[]>([]);
  const [newProductName, setNewProductName] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [productOptions, setProductOptions] = useState<string[]>(INITIAL_PRODUCT_OPTIONS);
  const { toast } = useToast();

  // Load saved policies from localStorage on component mount
  useEffect(() => {
    const savedPolicies = localStorage.getItem('productProcurementPolicies');
    if (savedPolicies) {
      setProductPolicies(JSON.parse(savedPolicies));
    }
  }, []);

  // Save policies to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('productProcurementPolicies', JSON.stringify(productPolicies));
  }, [productPolicies]);

  const handleAddProduct = () => {
    if (newProductName.trim() === '') {
      toast({
        title: "Invalid product name",
        description: "Please enter a valid product name",
        variant: "destructive",
      });
      return;
    }

    // Add to product options if it doesn't already exist
    if (!productOptions.includes(newProductName)) {
      setProductOptions([...productOptions, newProductName]);
    }
    
    setNewProductName('');
    
    // If the product doesn't already have a policy, create one
    if (!productPolicies.find(policy => policy.name === newProductName)) {
      addPolicy(newProductName);
    } else {
      toast({
        title: "Policy already exists",
        description: `A policy for ${newProductName} already exists`,
        variant: "destructive",
      });
    }
  };

  const addPolicy = (productName: string) => {
    const newPolicy: ProductPolicy = {
      id: crypto.randomUUID(),
      name: productName,
      policyText: '',
      documentUrls: [],
    };
    
    setProductPolicies([...productPolicies, newPolicy]);
    setSelectedProduct(productName);
    
    toast({
      title: "Policy added",
      description: `Policy for ${productName} has been added`,
    });
  };

  const handleSelectExistingProduct = () => {
    if (selectedProduct && !productPolicies.find(policy => policy.name === selectedProduct)) {
      addPolicy(selectedProduct);
    }
  };

  const updatePolicyText = (id: string, text: string) => {
    setProductPolicies(
      productPolicies.map(policy => 
        policy.id === id ? { ...policy, policyText: text } : policy
      )
    );
  };

  const handleUploadDocument = (policyId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      // In a real implementation, we would upload this file to a server
      // For now, we'll just store the file name
      
      setProductPolicies(
        productPolicies.map(policy => 
          policy.id === policyId 
            ? { 
                ...policy, 
                documentUrls: [...policy.documentUrls, file.name] 
              } 
            : policy
        )
      );
      
      toast({
        title: "Document uploaded",
        description: `${file.name} has been added to the policy`,
      });
    }
  };

  const removePolicy = (id: string) => {
    const policyToRemove = productPolicies.find(policy => policy.id === id);
    if (policyToRemove) {
      setProductPolicies(productPolicies.filter(policy => policy.id !== id));
      
      toast({
        title: "Policy removed",
        description: `Policy for ${policyToRemove.name} has been removed`,
      });
    }
  };

  const removeDocument = (policyId: string, documentIndex: number) => {
    setProductPolicies(
      productPolicies.map(policy => 
        policy.id === policyId 
          ? { 
              ...policy, 
              documentUrls: policy.documentUrls.filter((_, index) => index !== documentIndex) 
            } 
          : policy
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <FileText className="h-5 w-5 text-primary" />
        <h2 className="text-2xl font-semibold">Product Procurement Policies</h2>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Add New Product Policy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
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
                  <Button onClick={handleAddProduct}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
              </div>
              
              <div className="flex flex-col space-y-2">
                <Label htmlFor="existing-product">Or Select Existing Product:</Label>
                <div className="flex">
                  <select 
                    id="existing-product"
                    className="flex-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background mr-2"
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                  >
                    <option value="">Select a product</option>
                    {productOptions
                      .filter(product => !productPolicies.some(policy => policy.name === product))
                      .map(product => (
                        <option key={product} value={product}>{product}</option>
                      ))}
                  </select>
                  <Button onClick={handleSelectExistingProduct} disabled={!selectedProduct}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Policy
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {productPolicies.length > 0 && (
          <div className="space-y-4 mt-4">
            <h3 className="text-lg font-medium">Your Product Policies</h3>
            
            {productPolicies.map(policy => (
              <Card key={policy.id} className="relative">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="absolute right-2 top-2 h-8 w-8 p-0" 
                  onClick={() => removePolicy(policy.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
                
                <CardHeader>
                  <CardTitle>{policy.name}</CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor={`policy-text-${policy.id}`}>Policy Details:</Label>
                    <Textarea 
                      id={`policy-text-${policy.id}`}
                      placeholder={`Enter procurement policy details for ${policy.name}...`}
                      className="min-h-[100px] mt-1"
                      value={policy.policyText}
                      onChange={(e) => updatePolicyText(policy.id, e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label>Related Documents:</Label>
                    
                    {policy.documentUrls.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {policy.documentUrls.map((doc, index) => (
                          <div key={index} className="flex items-center justify-between bg-muted p-2 rounded-md">
                            <span className="text-sm truncate max-w-[80%]">{doc}</span>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0" 
                              onClick={() => removeDocument(policy.id, index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="mt-2">
                      <Label htmlFor={`upload-${policy.id}`} className="cursor-pointer">
                        <div className="flex items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-md p-4 mt-1 hover:bg-accent/50 transition-colors">
                          <Upload className="h-5 w-5 mr-2 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Upload policy document</span>
                        </div>
                      </Label>
                      <Input 
                        id={`upload-${policy.id}`}
                        type="file" 
                        className="hidden" 
                        onChange={(e) => handleUploadDocument(policy.id, e)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductProcurementPolicies;
