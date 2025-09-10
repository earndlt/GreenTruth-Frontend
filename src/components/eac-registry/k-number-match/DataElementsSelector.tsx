import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { KNumberMatchFormValues } from "./schema";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DataElementsSelectorProps {
  form: UseFormReturn<KNumberMatchFormValues>;
}

// Create a type for the data element IDs to ensure type safety
type DataElementId =
  | "qetCompatible"
  | "cetCompatible"
  | "carbonNeutral"
  | "waterUsage"
  | "landUsage"
  | "airImpact"
  | "communityImpact";

// Create a type for data element field paths
type DataElementPath = `dataElements.${DataElementId}`;

const DataElementsSelector: React.FC<DataElementsSelectorProps> = ({
  form,
}) => {
  const dataElements = [
    {
      id: "qetCompatible" as const,
      label: "QET Compatible",
      icon: "check",
      tooltip:
        "Quantified Emissions Token (QET) - A verified environmental token validated in alignment with ISO 14064-3 standards, providing precise emissions tracking and certification",
    },
    {
      id: "cetCompatible" as const,
      label: "CET Compatible",
      icon: "check",
      tooltip:
        "Certified Environmental Token (CET) - An environmental certification token that represents environmental attributes but does not undergo ISO-aligned validation or third-party verification",
    },
    // { id: 'carbonNeutral' as const, label: 'Carbon Neutral', icon: 'leaf' },
    // { id: 'waterUsage' as const, label: 'Water Usage', icon: 'leaf' },
    // { id: 'landUsage' as const, label: 'Land Usage', icon: 'leaf' },
    // { id: 'airImpact' as const, label: 'Air Impact', icon: 'air-vent' },
    // { id: 'communityImpact' as const, label: 'Community Impact', icon: 'users' }
  ];

  // Handle QET/CET mutual exclusivity
  const handleQetCetChange = (
    elementId: "qetCompatible" | "cetCompatible",
    checked: boolean
  ) => {
    if (checked) {
      // If QET is selected, uncheck CET and vice versa
      const otherElement =
        elementId === "qetCompatible" ? "cetCompatible" : "qetCompatible";
      form.setValue(`dataElements.${otherElement}` as DataElementPath, false);
      form.setValue(`dataElements.${elementId}` as DataElementPath, true);
    } else {
      form.setValue(`dataElements.${elementId}` as DataElementPath, false);
    }
  };

  return (
    <FormField
      control={form.control}
      name="dataElements"
      render={() => (
        <FormItem>
          <FormLabel>Additional Data Elements</FormLabel>
          <div className="space-y-2">
            <Alert className="bg-blue-50 border-blue-200">
              <Info className="h-4 w-4 text-blue-500" />
              <AlertDescription className="text-blue-700 text-sm">
                Selected data elements will be requested from producers.
                Fulfillment is subject to data availability.
              </AlertDescription>
            </Alert>
            <div className="border rounded-md p-3">
              <TooltipProvider>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dataElements.map((element) => (
                    <div
                      key={element.id}
                      className="flex items-center space-x-2"
                    >
                      {/* {element.id === 'qetCompatible' || element.id === 'cetCompatible' ? ( */}
                      <FormField
                        control={form.control}
                        name={`dataElements.${element.id}` as DataElementPath}
                        render={({ field }) => (
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={(checked) => {
                              handleQetCetChange(
                                element.id as "qetCompatible" | "cetCompatible",
                                checked === true
                              );
                            }}
                            id={element.id}
                          />
                        )}
                      />
                      {/* ) : (
                        <FormField
                          control={form.control}
                          name={`dataElements.${element.id}` as DataElementPath}
                          render={({ field }) => (
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={(checked) => {
                                field.onChange(checked === true);
                              }}
                              id={element.id}
                            />
                          )}
                        />
                      )} */}
                      <div className="flex items-center">
                        {element.tooltip ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <label
                                htmlFor={element.id}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-help"
                              >
                                {element.label}
                              </label>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              <p>{element.tooltip}</p>
                            </TooltipContent>
                          </Tooltip>
                        ) : (
                          <label
                            htmlFor={element.id}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {element.label}
                          </label>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </TooltipProvider>
            </div>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default DataElementsSelector;
