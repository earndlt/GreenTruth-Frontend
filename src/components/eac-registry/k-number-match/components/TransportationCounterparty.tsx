
import React from "react";
import { CounterpartyInfo } from "../schema";

interface TransportationCounterpartyProps {
  index: number;
  selectedPipeline: string;
  counterparty?: CounterpartyInfo;
}

const TransportationCounterparty = ({ 
  index, 
  selectedPipeline, 
  counterparty 
}: TransportationCounterpartyProps) => {
  return (
    <div className="mb-4 p-3 bg-muted/40 rounded-lg">
      <p className="text-sm mb-2">
        For the Transportation segment, the counterparty is automatically set to {selectedPipeline} Pipeline.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
        <div>
          <p className="text-sm font-medium">Counterparty:</p>
          <p className="text-sm">{counterparty?.counterpartyName || `${selectedPipeline} Pipeline`}</p>
        </div>
        <div>
          <p className="text-sm font-medium">Contact:</p>
          <p className="text-sm">{counterparty?.contactName || `${selectedPipeline} Operations`}</p>
        </div>
        <div>
          <p className="text-sm font-medium">Email:</p>
          <p className="text-sm">
            {counterparty?.email || 
              (selectedPipeline === "REX" ? "operations@rexpipeline.com" : "operations@rubypipeline.com")}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium">Phone:</p>
          <p className="text-sm">
            {counterparty?.phone || 
              (selectedPipeline === "REX" ? "555-123-4567" : "555-789-0123")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TransportationCounterparty;
