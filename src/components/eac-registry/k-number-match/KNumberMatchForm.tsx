
import React from 'react';
import { useForm, FormProvider, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Search, Loader2 } from 'lucide-react';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { kNumberMatchFormSchema, KNumberMatchFormValues } from './schema';
import PipelineSelector from './components/PipelineSelector';
import ContractIdField from './components/ContractIdField';
import ReceiptLocationField from './components/ReceiptLocationField';
import OrderTypeSelector from './components/OrderTypeSelector';
import DateRangeSelector from './DateRangeSelector';

interface KNumberMatchFormProps {
  onSubmit: (data: KNumberMatchFormValues) => void;
  isLoading: boolean;
  contractValidated: boolean | null;
  validationMessage: string;
  form?: UseFormReturn<KNumberMatchFormValues>; // External form control, if provided
}

const KNumberMatchForm: React.FC<KNumberMatchFormProps> = ({
  onSubmit,
  isLoading,
  contractValidated,
  validationMessage,
  form: externalForm
}) => {
  // Always call useForm hook, but use external form if provided
  const internalForm = useForm<KNumberMatchFormValues>({
    resolver: zodResolver(kNumberMatchFormSchema),
    defaultValues: {
      contractId: "",
      receiptLocationId: "",
      orderType: "spot",
      pipeline: "REX",
      emissionPoints: [],
      /* dataElements: {
        qetCompatible: false,
        cetCompatible: false,
        carbonNeutral: false,
        waterUsage: false,
        landUsage: false,
        airImpact: false,
        communityImpact: false
      }, */
      counterparties: []
    },
  });

  const formMethods = externalForm || internalForm;

  const orderType = formMethods.watch("orderType");
  const selectedPipeline = formMethods.watch("pipeline");
  /* const selectedEmissionPoints = formMethods.watch("emissionPoints");
  
  // For advanced settings collapse state
  const [isAdvancedOpen, setIsAdvancedOpen] = React.useState(false); */
  // Handle form submission
  const handleSubmit = () => {
    console.log("Submit button clicked");
    const formValues = formMethods.getValues();
    console.log("Current form values:", formValues);

    // Directly submit the form data without relying on event handling
    onSubmit(formValues);
  };

  return (
    <Card className="shadow-none border-0 p-0">
      <CardHeader className="px-0 pt-0 pb-4">
        <CardTitle className="text-lg">Gas Trace</CardTitle>
        <CardDescription>
          Enter your gas trace parameters to find and purchase available EACs that match your sustainability requirements.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <FormProvider {...formMethods}>
          <Form {...formMethods}>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <PipelineSelector form={formMethods} />
                <ContractIdField
                  form={formMethods}
                  contractValidated={contractValidated}
                  selectedPipeline={selectedPipeline}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ReceiptLocationField
                  form={formMethods}
                  selectedPipeline={selectedPipeline}
                />
                <OrderTypeSelector form={formMethods} />
              </div>

              <DateRangeSelector form={formMethods} orderType={orderType} />
              {/* <Collapsible
                open={true}
                onOpenChange={setIsAdvancedOpen}
                className="border rounded-md p-3 bg-gray-50"
              >
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="flex w-full justify-between p-0 h-auto font-medium">
                    Advanced Filters
                    <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                      {isAdvancedOpen ? "Hide" : "Show"}
                    </span>
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-4 pt-4">
                <EmissionPointsSelector form={formMethods} />
                  <DataElementsSelector form={formMethods} />
                  <CounterpartySelector emissionPoints={selectedEmissionPoints} />
                </CollapsibleContent>
              </Collapsible> */}
              <Button
                type="button"
                className="w-full"
                disabled={isLoading}
                onClick={handleSubmit}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Matching...
                  </>
                ) : (
                  <>
                    Match EACs
                    <Search className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </Form>
        </FormProvider>
      </CardContent>
      {/* {validationMessage && (
        <CardFooter className="flex flex-col items-start px-0">
          <Alert variant={contractValidated ? "default" : "destructive"} className="w-full">
            <AlertTitle>
              {contractValidated ? "Contract Found" : "Invalid Contract"}
            </AlertTitle>
            <AlertDescription>{validationMessage}</AlertDescription>
          </Alert>
        </CardFooter>
      )} */}
    </Card>
  );
};

export default KNumberMatchForm;
