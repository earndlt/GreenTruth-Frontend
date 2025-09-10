import React from "react";
import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormValues, EacData } from "../types";
import { getCommodityUnit } from "@/utils/analytics";

interface QuantitySelectorProps {
  form: UseFormReturn<FormValues>;
  eacData: EacData;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  form,
  eacData,
}) => {
  const commodity =
    eacData.certType === "Methanol" ? "Methanol" : "Natural Gas";
  const unitOfMeasure = getCommodityUnit(commodity);
  const transactionType = form.watch("transactionType");
  const isSpotTransaction = transactionType === "spot";

  return (
    <FormField
      control={form.control}
      name="quantity"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Total Quantity ({unitOfMeasure})</FormLabel>
          <div className="ps-1">
            <FormControl>
              <Input
                type="number"
                placeholder={`Enter quantity in ${unitOfMeasure}`}
                {...field}
                min="1"
                max={isSpotTransaction ? eacData.available : undefined}
                onWheel={(e) => e.preventDefault()}
                onKeyDown={(e) => {
                  if (
                    e.key === "ArrowUp" ||
                    e.key === "ArrowDown" ||
                    e.key === "e" ||
                    e.key === "+" ||
                    e.key === "-"
                  ) {
                    e.preventDefault();
                  }
                }}
              />
            </FormControl>
          </div>
          {isSpotTransaction ? (
            <FormDescription>
              Maximum available: {eacData.available.toLocaleString()}{" "}
              {unitOfMeasure}
            </FormDescription>
          ) : (
            <FormDescription>
              Enter the total volume needed for your contract period
            </FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default QuantitySelector;
