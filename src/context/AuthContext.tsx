import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { API_ENDPOINTS } from "@/config/api";

export interface User {
  email: string;
  name: string;
  role: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  profilePictureId?: string | null;
  wallet?: string | null;
  id?: string;
  is_kyb_verified?: boolean;
  address?: {
    city: string;
    state: string;
    country: string;
  };
  rbacRoles?: Array<{
    name: string;
    permissions: Record<string, boolean>;
    category: string;
  }>;
}

interface Address {
  country: string;
  state: string;
  city: string;
  zip: string;
  street: string;
}

interface OrganizationData {
  type: string;
  investorType: string;
  name: string;
  ein: string;
  duns: string;
  jurisdiction: string;
  address: Address;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    company: string
  ) => Promise<boolean>;
  activate: (email: string, code: string) => Promise<boolean>;
  userEmail: string;
  logout: (reason?: string) => void;
  isLoading: boolean;
  error: string | null;
  handleApiResponse: (response: Response) => Promise<Response>;
  refreshUser: () => Promise<void>;
}

// Authentication response from our GreenTruth backend
interface AuthResponse {
  success: boolean;
  message: string;
  accessToken?: string;
  accessTokenExpiresAt?: number;
  refreshToken?: string;
  refreshTokenExpiresAt?: number;
  error?: {
    errorName?: string;
    status?: number;
    message?: string;
  };
}

// Profile response from our GreenTruth backend
interface ProfileResponse {
  success: boolean;
  data?: User;
  error?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");
  const navigate = useNavigate();
  const handleApiResponse = async (response: Response): Promise<Response> => {
    if (response.status === 401) {
      // Token expired or invalid
      logout("Your session has expired. Please log in again.");
      throw new Error("Unauthorized: Session expired");
    }
    return response;
  };

  // Refresh user profile data from backend
  const refreshUser = async (): Promise<void> => {
    const storedAccessToken = localStorage.getItem("greentruth_access_token");
    if (!storedAccessToken) {
      console.error("No access token found for profile refresh");
      return;
    }

    try {
      const profileResponse = await fetch(API_ENDPOINTS.AUTH.PROFILE, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedAccessToken}`,
        },
      });

      if (!profileResponse.ok) {
        console.error("Failed to fetch updated profile");
        return;
      }

      const profileData = await profileResponse.json();

      // Transform profile data to our User format
      const userData: User = {
        email: profileData.data.email,
        name: `${profileData.data.firstName || ""} ${profileData.data.lastName || ""
          }`.trim(),
        firstName: profileData.data.firstName,
        lastName: profileData.data.lastName,
        company: profileData.data.company,
        profilePictureId: profileData.data.profilePictureId,
        wallet: profileData.data.wallet,
        id: profileData.data.id,
        is_kyb_verified: profileData.data.is_kyb_verified,
        address: profileData.data.address,
        rbacRoles: profileData.data.rbacRoles,
        // Determine role from rbacRoles
        role: profileData.data.rbacRoles?.some(
          (role) =>
            role.name === "Admin" &&
            (role.category === "organization" || role.category === "basic")
        )
          ? "admin"
          : "user",
      };

      // Update localStorage and state
      localStorage.setItem("greentruth_user", JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error("Error refreshing user profile:", error);
    }
  };

  // Check if user is already logged in on initial load
  useEffect(() => {
    const checkAuthStatus = async () => {
      const storedAccessToken = localStorage.getItem("greentruth_access_token");
      const storedUser = localStorage.getItem("greentruth_user");

      if (storedAccessToken && storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Error parsing stored user data:", error);
          localStorage.removeItem("greentruth_access_token");
          localStorage.removeItem("greentruth_user");
        }
      }

      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (data.errorName || data.status === 401) {
        setError(data.message || "Invalid credentials");
        setIsLoading(false);
        return false;
      }

      if (!data.accessToken) {
        setError("No access token received");
        setIsLoading(false);
        return false;
      }

      // Store tokens
      localStorage.setItem("greentruth_access_token", data.accessToken);
      if (data.refreshToken) {
        localStorage.setItem("greentruth_refresh_token", data.refreshToken);
      }

      // Fetch user profile from our backend
      const profileResponse = await fetch(API_ENDPOINTS.AUTH.PROFILE, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.accessToken}`,
        },
      });

      if (!profileResponse.ok) {
        setError("Failed to fetch user profile");
        setIsLoading(false);
        return false;
      }

      const profileData = await profileResponse.json();

      // Transform profile data to our User format
      const userData: User = {
        email: profileData.data.email,
        name: `${profileData.data.firstName || ""} ${profileData.data.lastName || ""
          }`.trim(),
        firstName: profileData.data.firstName,
        lastName: profileData.data.lastName,
        company: profileData.data.company,
        profilePictureId: profileData.data.profilePictureId,
        wallet: profileData.data.wallet,
        id: profileData.data.id,
        is_kyb_verified: profileData.data.is_kyb_verified,
        address: profileData.data.address,
        rbacRoles: profileData.data.rbacRoles,
        // Determine role from rbacRoles
        role: profileData.data.rbacRoles?.some(
          (role) =>
            role.name === "Admin" &&
            (role.category === "organization" || role.category === "basic")
        )
          ? "admin"
          : "user",
      };

      // Save user data in localStorage
      localStorage.setItem("greentruth_user", JSON.stringify(userData));

      setUser(userData);
      setIsAuthenticated(true);
      setError(null);
      //navigate("/dashboard");
      navigate("/eac-registry?tab=gas-trace");
      return true;
    } catch (error) {
      console.error("Login error:", error);
      setError("Login failed. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (reason?: string) => {
    localStorage.removeItem("greentruth_access_token");
    localStorage.removeItem("greentruth_refresh_token");
    localStorage.removeItem("greentruth_user");
    setUser(null);
    setIsAuthenticated(false);
    navigate("/login");
    toast.info(reason || "You have been logged out", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const register = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    company: string
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(API_ENDPOINTS.AUTH.REGISTER, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          firstName,
          lastName,
          termsAgreement: true,
          securityAgreement: true,
          company,
        }),
      });

      const data = await response.json();

      if (data.errorName || data.status === 401) {
        setError(data.message || "Invalid credentials");
        setIsLoading(false);
        return false;
      }
      setError(null);
      /* toast.info("Registration Successful", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      }); */
      localStorage.setItem("userEmail", email);
      // Store registration data for potential resend
      localStorage.setItem("registrationData", JSON.stringify({
        email,
        password,
        firstName,
        lastName,
        company
      }));
      navigate("/activate");
      return true;
    } catch (error) {
      console.error("Register error:", error);
      setError("Register failed. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const activate = async (email: string, code: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(API_ENDPOINTS.AUTH.ACTIVATE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          code,
        }),
      });

      const data = await response.json();

      if (data.errorName || data.status === 404) {
        setError("Invalid activation code");
        setIsLoading(false);
        return false;
      }

      if (!data.accessToken) {
        setError("No access token received");
        setIsLoading(false);
        return false;
      }

      // Store tokens
      localStorage.setItem("greentruth_access_token", data.accessToken);
      if (data.refreshToken) {
        localStorage.setItem("greentruth_refresh_token", data.refreshToken);
      }

      // Fetch user profile from our backend
      const profileResponse = await fetch(API_ENDPOINTS.AUTH.PROFILE, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.accessToken}`,
        },
      });

      if (!profileResponse.ok) {
        setError("Failed to fetch user profile");
        setIsLoading(false);
        return false;
      }

      const profileData = await profileResponse.json();

      // Transform profile data to our User format
      const userData: User = {
        email: profileData.data.email,
        name: `${profileData.data.firstName || ""} ${profileData.data.lastName || ""
          }`.trim(),
        firstName: profileData.data.firstName,
        lastName: profileData.data.lastName,
        company: profileData.data.company,
        profilePictureId: profileData.data.profilePictureId,
        wallet: profileData.data.wallet,
        id: profileData.data.id,
        is_kyb_verified: profileData.data.is_kyb_verified,
        address: profileData.data.address,
        rbacRoles: profileData.data.rbacRoles,
        // Determine role from rbacRoles
        role: profileData.data.rbacRoles?.some(
          (role) =>
            role.name === "Admin" &&
            (role.category === "organization" || role.category === "basic")
        )
          ? "admin"
          : "user",
      };

      // Save user data in localStorage
      localStorage.setItem("greentruth_user", JSON.stringify(userData));

      setUser(userData);
      setIsAuthenticated(true);
      setError(null);
      
      // Redirect to admin tab with KYB verification section after registration
      navigate("/settings?tab=admin#kyb");
      return true;
    } catch (error) {
      console.error("Login error:", error);
      setError("Login failed. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        userEmail,
        login,
        register,
        activate,
        logout,
        isLoading,
        error,
        handleApiResponse,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Helper function to get user initials for avatar fallback
export const getUserInitials = (user: User | null): string => {
  if (!user) return "";

  if (user.firstName && user.lastName) {
    return `${user.firstName.charAt(0)}${user.lastName.charAt(
      0
    )}`.toUpperCase();
  }

  if (user.name) {
    const nameParts = user.name.split(" ");
    if (nameParts.length >= 2) {
      return `${nameParts[0].charAt(0)}${nameParts[1].charAt(0)}`.toUpperCase();
    }
    return user.name.charAt(0).toUpperCase();
  }

  return user.email.charAt(0).toUpperCase();
};
