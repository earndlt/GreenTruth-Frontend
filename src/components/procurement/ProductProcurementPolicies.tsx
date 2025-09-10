import React, { useState, useEffect } from 'react';
import { FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AddNewProductForm from './product-policies/AddNewProductForm';
import PolicyList from './product-policies/PolicyList';
import { ProductPolicy, INITIAL_PRODUCT_OPTIONS } from './utils/types/draft-types';
import { useUser } from '@/context/UserContext';

interface ProductProcurementPoliciesProps {
  selectedCompanyId: string;
}

const ProductProcurementPolicies: React.FC<ProductProcurementPoliciesProps> = ({ selectedCompanyId }) => {
  const [productPolicies, setProductPolicies] = useState<ProductPolicy[]>([]);
  const [newProductName, setNewProductName] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [productOptions, setProductOptions] = useState<string[]>(INITIAL_PRODUCT_OPTIONS);
  const { toast } = useToast();
  const { isAdmin } = useUser();

  useEffect(() => {
    const savedPolicies = localStorage.getItem(`productProcurementPolicies-${selectedCompanyId}`);
    if (savedPolicies) {
      setProductPolicies(JSON.parse(savedPolicies));
    } else {
      setProductPolicies([]);
    }
  }, [selectedCompanyId]);

  useEffect(() => {
    localStorage.setItem(
      `productProcurementPolicies-${selectedCompanyId}`, 
      JSON.stringify(productPolicies)
    );
  }, [productPolicies, selectedCompanyId]);

  const handleAddProduct = () => {
    if (newProductName.trim() === '') {
      toast({
        title: "Invalid product name",
        description: "Please enter a valid product name",
        variant: "destructive",
      });
      return;
    }

    if (!productOptions.includes(newProductName)) {
      setProductOptions([...productOptions, newProductName]);
    }
    
    setNewProductName('');
    
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
      companyId: selectedCompanyId,
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
      setProductPolicies(
        productPolicies.map(policy => 
          policy.id === policyId 
            ? { ...policy, documentUrls: [...policy.documentUrls, file.name] } 
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
        <AddNewProductForm
          newProductName={newProductName}
          setNewProductName={setNewProductName}
          selectedProduct={selectedProduct}
          setSelectedProduct={setSelectedProduct}
          productOptions={productOptions}
          onAddNewProduct={handleAddProduct}
          onSelectExistingProduct={handleSelectExistingProduct}
        />
        
        <PolicyList
          policies={productPolicies}
          onUpdatePolicyText={updatePolicyText}
          onRemovePolicy={removePolicy}
          onUploadDocument={handleUploadDocument}
          onRemoveDocument={removeDocument}
          isAdmin={isAdmin}
          currentCompanyId={selectedCompanyId}
        />
      </div>
    </div>
  );
};

export default ProductProcurementPolicies;
