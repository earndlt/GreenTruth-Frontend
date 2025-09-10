
import React from 'react';

interface CustomAttribute {
  name: string;
  value: string;
}

interface CustomAttributesSectionProps {
  customAttributes: string | CustomAttribute[];
}

const CustomAttributesSection = ({ customAttributes }: CustomAttributesSectionProps) => {
  const renderCustomAttributes = () => {
    if (typeof customAttributes === 'string') {
      return <p className="text-sm text-muted-foreground">{customAttributes || 'No custom attributes added'}</p>;
    }

    if (Array.isArray(customAttributes) && customAttributes.length > 0) {
      return (
        <ul className="list-disc pl-5">
          {customAttributes.map((attr, index) => (
            <li key={index} className="text-sm text-muted-foreground">{attr.name}: {attr.value}</li>
          ))}
        </ul>
      );
    }

    return <p className="text-sm text-muted-foreground">No custom attributes added</p>;
  };

  return (
    <div>
      <h4 className="text-sm font-medium">Custom Attributes</h4>
      {renderCustomAttributes()}
    </div>
  );
};

export default CustomAttributesSection;
