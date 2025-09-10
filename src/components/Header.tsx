import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bell,
  Settings as SettingsIcon,
  User,
  Search,
  CreditCard,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { useUser } from "@/context/UserContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useAuth, getUserInitials } from "@/context/AuthContext";
import { LogOut } from "lucide-react";
import { useOrganization } from "@/context/OrganizationContext";

const Header = () => {
  const { logout, user } = useAuth();
  const parentOrganization = "Acme Corporation";
  const [logo, setLogo] = useState<string | null>(null);
  const navigate = useNavigate();
  const { isAdmin, userRole, setUserRole } = useUser();
  const { clearOrganizationData } = useOrganization();

  useEffect(() => {
    const savedLogo = localStorage.getItem("corporateLogo");
    if (savedLogo) {
      setLogo(savedLogo);
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "corporateLogo") {
        setLogo(e.newValue);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleSettingsNavigation = (tab: string) => {
    navigate(`/settings?tab=${tab}`);
  };

  const toggleUserRole = () => {
    setUserRole(userRole === "admin" ? "user" : "admin");
  };

  const handleLogout = () => {
    clearOrganizationData();
    logout();
  };

  return (
    <header className="sticky top-0 z-6 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="flex-1 flex items-center justify-center px-2">
          <div className="w-full max-w-lg relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search regulations, vendors, or EACs..."
              className="w-full pl-10"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center text-sm text-muted-foreground mr-2">
            {logo ? (
              <Avatar className="h-6 w-6 mr-2 rounded-sm">
                <AvatarImage
                  src={logo}
                  alt="Company Logo"
                  className="object-contain"
                />
                <AvatarFallback className="rounded-sm bg-primary/10">
                  C
                </AvatarFallback>
              </Avatar>
            ) : null}
            {user.company ? user.company : parentOrganization}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <SettingsIcon className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Settings</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleSettingsNavigation("account")}
              >
                Account
              </DropdownMenuItem>
              {isAdmin && (
                <DropdownMenuItem
                  onClick={() => handleSettingsNavigation("business-profile")}
                >
                  Business Profile
                </DropdownMenuItem>
              )}
              {isAdmin && (
                <DropdownMenuItem
                  onClick={() => handleSettingsNavigation("billing")}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Billing & Subscription
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={() => handleSettingsNavigation("preferences")}
              >
                Preferences & Notifications
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSettingsNavigation("api")}>
                API Settings
              </DropdownMenuItem>
              {isAdmin && (
                <DropdownMenuItem
                  onClick={() => handleSettingsNavigation("admin")}
                >
                  Admin
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  {user.profilePictureId ? (
                    <AvatarImage
                      src={`https://api.staging.earndlt.com/file/${user.profilePictureId}`}
                      alt={user.name || user.email}
                    />
                  ) : null}
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {getUserInitials(user)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user.name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => navigate("/settings?tab=account")}
              >
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>Teams</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/support")}>
                Support
              </DropdownMenuItem>

              <DropdownMenuItem onClick={toggleUserRole}>
                Currently: {userRole === "admin" ? "Admin" : "Regular User"}{" "}
                (click to toggle)
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
