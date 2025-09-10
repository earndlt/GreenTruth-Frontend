import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { apiClient } from "@/services/apiClient";
import { Shield, Lock, Loader2 } from "lucide-react";
import API_ENDPOINTS from "@/config/api";

const AccountTab = () => {
  const { user, refreshUser } = useAuth();
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    organization: user?.company || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Update user profile including company name
      await apiClient.put(`${API_ENDPOINTS.AUTH.PROFILE}`, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        company: formData.organization,
      });

      // Refresh user data in AuthContext to reflect the changes
      await refreshUser();

      toast.success("Profile updated successfully");

    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if company name is locked due to KYB verification
  const isCompanyNameLocked = user?.is_kyb_verified;

  useEffect(() => {
    const loadUserData = async () => {
      setIsRefreshing(true);
      try {
        await refreshUser();
      } catch (error) {
        console.error("Error refreshing user data:", error);
      } finally {
        setIsRefreshing(false);
      }
    };

    loadUserData();
  }, []);
  // Update form data when user data changes
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        organization: user.company || "",
      });
    }
  }, [user]);

  if (isRefreshing) {
    return (
      <div className="flex items-center justify-center py-8 mb-6">
        <div className="flex items-center space-x-2 text-gray-600">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading account information...</span>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Settings</CardTitle>
        <CardDescription>
          Manage your account information and organization details.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                disabled={isRefreshing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                disabled={isRefreshing}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="organization" className="flex items-center gap-2">
              Organization
              {isCompanyNameLocked && (
                <div className="flex items-center gap-1 text-sm text-amber-600">
                  <Lock className="h-3 w-3" />
                  <span>Locked after KYB verification</span>
                </div>
              )}
            </Label>
            <Input
              id="organization"
              name="organization"
              value={formData.organization}
              onChange={handleInputChange}
              disabled={isCompanyNameLocked || isRefreshing}
              placeholder={isCompanyNameLocked ? "Company name locked after KYB verification" : "Enter company name"}
            />
            {isCompanyNameLocked && (
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <Shield className="h-3 w-3" />
                Company name cannot be changed after KYB verification is completed.
              </p>
            )}
          </div>

          <Button type="submit" className="mt-4" disabled={isSubmitting || isRefreshing}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AccountTab;
