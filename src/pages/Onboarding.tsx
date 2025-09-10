import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import API_ENDPOINTS from "@/config/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Building, ShieldCheck } from "lucide-react";

const kybSchema = z.object({
  companyName: z.string().min(2, "Required"),
  duns: z.string().optional(),
  taxId: z.string().min(2, "Required"),
  street: z.string().min(2, "Required"),
  city: z.string().min(2, "Required"),
  state: z.string().min(2, "Required"),
  zip: z.string().min(2, "Required"),
  country: z.string().min(2, "Required").default("USA"),
});

type KybFormValues = z.infer<typeof kybSchema>;

const Onboarding = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verification, setVerification] = useState<{
    success: boolean;
    status: string;
    message: string;
  } | null>(null);

  const form = useForm<KybFormValues>({
    resolver: zodResolver(kybSchema),
    defaultValues: {
      companyName: "",
      duns: "",
      taxId: "",
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "USA",
    },
  });

  const onSubmit = async (data: KybFormValues) => {
    setIsSubmitting(true);
    setVerification(null);
    try {
      const response = await fetch(API_ENDPOINTS.KYB.VERIFY, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          duns: data.duns || undefined,
          companyName: data.companyName,
          taxId: data.taxId,
          address: {
            street: data.street,
            city: data.city,
            state: data.state,
            zip: data.zip,
            country: data.country,
          },
        }),
      });
      const json = await response.json();
      setVerification(json?.data || null);

      if (json?.data?.success) {
        localStorage.setItem("kyb_verified", "true");
        // Redirect into dashboard after KYB success
        //navigate("/dashboard");
        navigate("/eac-registry?tab=gas-trace");
      }
    } catch (e) {
      setVerification({ success: false, status: "error", message: "Verification failed" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-xl">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Building className="h-5 w-5 text-primary" />
              <CardTitle>Complete Your Business Verification</CardTitle>
            </div>
            <CardDescription>We verify organizations via Dun & Bradstreet (D-U-N-S)</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Acme Corporation" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="duns"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>D-U-N-S Number (optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="9-digit DUNS" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="taxId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tax ID (EIN)</FormLabel>
                        <FormControl>
                          <Input placeholder="12-3456789" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="street"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main St" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="City" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input placeholder="State" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="zip"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ZIP</FormLabel>
                        <FormControl>
                          <Input placeholder="ZIP" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input placeholder="Country" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? "Verifying..." : "Verify & Continue"}
                </Button>
              </form>
            </Form>

            {verification && (
              <div className={`mt-4 p-3 rounded border ${verification.success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                <div className="flex items-center space-x-2">
                  <ShieldCheck className={`h-4 w-4 ${verification.success ? "text-green-600" : "text-red-600"}`} />
                  <div className={verification.success ? "text-green-700" : "text-red-700"}>
                    {verification.message}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <div className="text-xs text-muted-foreground">We use D&B for KYB/KYC verification. Your details are kept confidential.</div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;

