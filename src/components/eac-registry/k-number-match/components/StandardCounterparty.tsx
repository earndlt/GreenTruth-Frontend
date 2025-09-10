
import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel 
} from "@/components/ui/form";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Input 
} from "@/components/ui/input";
import { 
  Switch
} from "@/components/ui/switch";
import { Mail, Phone, User } from "lucide-react";
import { approvedCounterparties } from "@/data/approvedCounterparties";
import { CounterpartyInfo } from "../schema";

interface StandardCounterpartyProps {
  index: number;
  counterparty: CounterpartyInfo;
}

const StandardCounterparty = ({ 
  index,
  counterparty
}: StandardCounterpartyProps) => {
  const { control } = useFormContext();
  const selectedPipeline = useWatch({ control, name: "pipeline" });

  return (
    <>
      <FormField
        control={control}
        name={`counterparties.${index}.knowsCounterparty`}
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 mb-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">
                Do you know the counterparty?
              </FormLabel>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />

      {counterparty?.knowsCounterparty && (
        <div className="space-y-4 pl-2">
          {selectedPipeline === "REX" ? (
            <FormField
              control={control}
              name={`counterparties.${index}.counterpartyName`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Counterparty Name</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a counterparty" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {approvedCounterparties.map((name) => (
                        <SelectItem key={name} value={name}>
                          {name}
                        </SelectItem>
                      ))}
                      <SelectItem value="OTHER">
                        Other (specify below)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          ) : (
            <FormField
              control={control}
              name={`counterparties.${index}.counterpartyName`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Counterparty Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter counterparty name" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          )}

          {counterparty?.counterpartyName === "OTHER" && (
            <FormField
              control={control}
              name={`counterparties.${index}.otherCounterpartyName`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Specify Counterparty</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter counterparty name" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name={`counterparties.${index}.contactName`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Contact person" className="pl-8" {...field} />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`counterparties.${index}.email`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Email address" className="pl-8" {...field} />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`counterparties.${index}.phone`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Phone className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Phone number" className="pl-8" {...field} />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default StandardCounterparty;
