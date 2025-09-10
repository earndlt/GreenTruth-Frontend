import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/context/AuthContext";
import {
  Mail,
  Lock,
  LogIn,
  User,
  Calendar,
  Building,
  MapPin,
  Eye,
  EyeOff,
} from "lucide-react";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { PasswordStrengthIndicator } from "@/components/ui/password-strength-indicator";
import { checkPasswordStrength } from "@/utils/passwordUtils";

// Define schema for form validation with stronger password requirements
const registerSchema = z.object({
  email: z.string().email({ message: "is invalid" }),
  password: z.string().min(1, { message: "is required" }), // Basic validation, strength checked separately
  firstName: z.string().min(3, { message: "is required" }),
  lastName: z.string().min(3, { message: "is required" }),
  company: z.string().min(3, { message: "is required" }),
});

type RegisterFormValues = z.infer<typeof registerSchema> & {};

const Register = () => {
  const { register, error } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      company: "",
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    // Check password strength before submission
    const strength = checkPasswordStrength(data.password);
    if (!strength.isStrong) {
      form.setError("password", {
        type: "manual",
        message: "Password is too weak. Please choose a stronger password."
      });
      return;
    }

    setIsLoading(true);
    try {
      await register(
        data.email,
        data.password,
        data.firstName,
        data.lastName,
        data.company
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    form.setValue("password", newPassword);
    
    // Clear password error when user starts typing
    if (form.formState.errors.password?.type === "manual") {
      form.clearErrors("password");
    }
  };

  const isPasswordStrong = checkPasswordStrength(password).isStrong;

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
              Enter your details to create an account
            </CardDescription>
          </CardHeader>
          <CardContent>
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
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        Email&nbsp;
                        <FormMessage />
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="name@example.com"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        Password&nbsp;
                        <FormMessage />
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="pl-10 pr-10"
                            {...field}
                            onChange={handlePasswordChange}
                            value={password}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground"
                          >
                            {showPassword ? <EyeOff /> : <Eye />}
                          </button>
                        </div>
                      </FormControl>
                      
                      {/* Password Strength Indicator */}
                      {password && (
                        <PasswordStrengthIndicator 
                          password={password} 
                          className="mt-3"
                        />
                      )}
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          First Name&nbsp;
                          <FormMessage />
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="First Name"
                              className="pl-10"
                              {...field}
                            />
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          Last Name&nbsp;
                          <FormMessage />
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Last Name"
                              className="pl-10"
                              {...field}
                            />
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        Company&nbsp;
                        <FormMessage />
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="text"
                            placeholder="Company Name"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading || !isPasswordStrong}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                      Signing up...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <LogIn className="mr-2 h-4 w-4" />
                      {!isPasswordStrong ? "Complete Password Requirements" : "Sign Up"}
                    </div>
                  )}
                </Button>
                
                <div className="flex justify-center items-center gap-2">
                  <p className="text-sm text-muted-foreground">
                    Already have an account?
                  </p>
                  <NavLink
                    to="/login"
                    className="text-sm text-muted-foreground hover:text-primary font-bold"
                  >
                    Click here to Login
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

export default Register;
