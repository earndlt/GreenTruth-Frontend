import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/context/AuthContext";
import { Mail, Lock, LogIn, CheckCircle, XCircle } from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { NavLink } from "react-router-dom";

// Define schema for form validation
const activateSchema = z.object({
  code: z
    .string()
    .min(6, { message: "must be 6 characters" })
    .max(6, { message: "must be 6 characters" }),
});

type ActivateFormValues = z.infer<typeof activateSchema>;

const Activate = () => {
  const { activate, userEmail, error, register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  
  // Get the email from localStorage (set during registration)
  const registeredEmail = localStorage.getItem("userEmail") || userEmail || "";

  const form = useForm<ActivateFormValues>({
    resolver: zodResolver(activateSchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = async (data: ActivateFormValues) => {
    setIsLoading(true);
    try {
      await activate(registeredEmail, data.code);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!registeredEmail) {
      toast.error("No email address found. Please try registering again.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    setIsResending(true);
    try {
      // Get stored registration data
      const storedData = localStorage.getItem("registrationData");
      if (!storedData) {
        toast.error("Registration data not found. Please try registering again.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return;
      }

      const registrationData = JSON.parse(storedData);
      
      // Call register again to resend activation code
      const success = await register(
        registrationData.email,
        registrationData.password,
        registrationData.firstName,
        registrationData.lastName,
        registrationData.company
      );

      if (success) {
        toast.success("Activation code has been resent to your email address.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        toast.error("Failed to resend activation code. Please try again.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.error("Resend error:", error);
      toast.error("Failed to resend activation code. Please try again.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border-border shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <img
                src="/lovable-uploads/eeb2b16e-8109-4c11-8034-93dec4806601.png"
                alt="GreenTruth Logo"
                className="h-12 w-auto"
              />
            </div>
            <CardTitle className="text-2xl font-bold text-primary">
              Welcome to GreenTruth
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Enter your activation code to complete your account setup
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Activation Code Delivery Notification */}
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-blue-900">
                    Check Your Email
                  </h3>
                  <p className="text-sm text-blue-800">
                    We've sent a 6-digit activation code to:
                  </p>
                  <p className="text-sm font-mono font-semibold text-blue-900 bg-blue-100 px-2 py-1 rounded">
                    {registeredEmail || "your registered email address"}
                  </p>
                  <p className="text-xs text-blue-700">
                    Please check your inbox and spam folder. The code will expire in 15 minutes.
                  </p>
                </div>
              </div>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {error && (
                  <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
                    {error}
                  </div>
                )}
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        Activation Code&nbsp;
                        <FormMessage />
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="_ _ _ _ _ _"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                      Activating...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <LogIn className="mr-2 h-4 w-4" />
                      Activate Account
                    </div>
                  )}
                </Button>
                
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    Didn't receive the code?
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-sm"
                    onClick={handleResendCode}
                    disabled={isResending}
                  >
                    {isResending ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                        Resending...
                      </>
                    ) : (
                      <>
                        <Mail className="mr-2 h-4 w-4" />
                        Resend Activation Code
                      </>
                    )}
                  </Button>
                </div>
                <div className="flex justify-center items-center gap-2">
                  <NavLink
                    to="/login"
                    className="text-sm text-muted-foreground hover:text-primary font-bold"
                  >
                    Back to Login
                  </NavLink>
                </div>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="text-center text-sm text-muted-foreground flex justify-center">
            <p>Energy Attribute Certificate Management</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Activate;
