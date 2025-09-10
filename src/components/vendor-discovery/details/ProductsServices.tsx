
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface ProductsServicesProps {
  products: string[];
  category: string;
}

const ProductsServices: React.FC<ProductsServicesProps> = ({ products, category }) => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-2">Products & Services</h3>
      <div className="flex flex-wrap gap-2 mb-4">
        {products.map((product, index) => (
          <Badge key={index} className="py-1 px-3">{product}</Badge>
        ))}
      </div>
      
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          This vendor offers products that align with your procurement needs for {category}.
        </p>
      </div>
    </div>
  );
};

export default ProductsServices;
