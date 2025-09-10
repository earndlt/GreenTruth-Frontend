
import React, { useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { CounterpartyInfo } from "../schema";
import EmissionPointCard from "./EmissionPointCard";
import StandardCounterparty from "./StandardCounterparty";
import TransportationCounterparty from "./TransportationCounterparty";

interface CounterpartySelectorProps {
  emissionPoints: string[];
}

const CounterpartySelector = ({ emissionPoints }: CounterpartySelectorProps) => {
  const { control, setValue, getValues } = useFormContext();
  const selectedPipeline = useWatch({ control, name: "pipeline" });
  const existingCounterparties = useWatch({ control, name: "counterparties" }) || [];

  // Initialize counterparties when emission points change
  useEffect(() => {
    if (emissionPoints.length > 0) {
      // Create or update counterparty entries for each emission point
      const updatedCounterparties = emissionPoints.map(point => {
        // Check if we already have this emission point in counterparties
        const existing = existingCounterparties.find(c => c.emissionPoint === point);
        
        if (existing) {
          return existing;
        }
        
        // For transportation, automatically set knowsCounterparty to true
        // and populate with pipeline information
        if (point === 'transportation') {
          const pipelineName = selectedPipeline === "REX" ? "ROCKIES EXPRESS PIPELINE LLC" : "Ruby Pipeline";
          const contactName = selectedPipeline === "REX" ? "REX Operations" : "Ruby Operations";
          const email = selectedPipeline === "REX" ? "operations@rexpipeline.com" : "operations@rubypipeline.com";
          const phone = selectedPipeline === "REX" ? "555-123-4567" : "555-789-0123";
          
          return {
            emissionPoint: point,
            knowsCounterparty: true,
            counterpartyName: pipelineName,
            contactName,
            email,
            phone
          };
        }
        
        // Create new counterparty info for other emission points
        return {
          emissionPoint: point,
          knowsCounterparty: false,
          counterpartyName: "",
          contactName: "",
          email: "",
          phone: ""
        };
      });
      
      setValue("counterparties", updatedCounterparties);
    }
  }, [emissionPoints, setValue, selectedPipeline, existingCounterparties]);

  // Only show counterparty selector if there are emission points selected
  if (emissionPoints.length === 0) {
    return null;
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Counterparty Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {emissionPoints.map((point, index) => {
            const existingIndex = existingCounterparties.findIndex(c => c.emissionPoint === point);
            const actualIndex = existingIndex !== -1 ? existingIndex : index;
            
            return (
              <div key={point} className="p-4 border rounded-md">
                <div className="flex items-center gap-2 mb-4">
                  <EmissionPointCard emissionPoint={point} />
                  <h3 className="font-medium">
                    {point.charAt(0).toUpperCase() + point.slice(1)} Counterparty
                  </h3>
                </div>
                
                {point === 'transportation' ? (
                  <TransportationCounterparty 
                    index={actualIndex} 
                    selectedPipeline={selectedPipeline}
                    counterparty={existingCounterparties[actualIndex]}
                  />
                ) : (
                  <StandardCounterparty 
                    index={actualIndex}
                    counterparty={existingCounterparties[actualIndex]}
                  />
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default CounterpartySelector;
