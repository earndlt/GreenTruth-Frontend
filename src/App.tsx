import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RegulationsProvider } from "@/context/RegulationsContext";
import { UserProvider } from "@/context/UserContext";
import { AuthProvider } from "@/context/AuthContext";
import { OrganizationProvider } from "@/context/OrganizationContext";
import { EacProvider } from "@/context/EacContext";
import MainLayout from "@/layouts/MainLayout";
import ProtectedRoute from "@/components/ProtectedRoute";

// Import pages
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Compliance from "@/pages/Compliance";
import EacRegistry from "@/pages/EacRegistry";
import Procurement from "@/pages/Procurement";
import Reports from "@/pages/Reports";
import AIAgent from "@/pages/AIAgent"; // Renamed from Search
import Settings from "@/pages/Settings";
import Support from "@/pages/Support";
import Vendors from "@/pages/Vendors";
import SupplyChain from "@/pages/SupplyChain";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import VendorDetailPage from "@/pages/VendorDetailPage";
import IntegrationHub from "@/pages/IntegrationHub";
import DocumentationViewer from "@/components/support/Documentation/DocumentationViewer";
import Register from "@/pages/Register";
import Activate from "@/pages/Activate";
import PlaidTest from "@/pages/PlaidTest";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <RegulationsProvider>
        <Router>
          <AuthProvider>
            <EacProvider>
              <OrganizationProvider>
                <UserProvider>
                  <Routes>
                    {/* Public route */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/activate" element={<Activate />} />

                    {/* Root path redirect */}
                    <Route
                      path="/"
                      element={<Navigate to="/login" replace />}
                    />

                    {/* Protected routes - all wrapped in MainLayout */}
                    <Route
                      element={
                        <ProtectedRoute>
                          <MainLayout />
                        </ProtectedRoute>
                      }
                    >
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/compliance" element={<Compliance />} />
                      <Route path="/eac-registry/*" element={<EacRegistry />} />
                      <Route path="/procurement" element={<Procurement />} />
                      <Route path="/reports" element={<Reports />} />
                      <Route path="/ai-agent" element={<AIAgent />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="/support" element={<Support />} />
                      <Route path="/vendors" element={<Vendors />} />
                      <Route
                        path="/vendors/directory/:vendorId"
                        element={<VendorDetailPage />}
                      />
                      <Route path="/supply-chain" element={<SupplyChain />} />
                      <Route
                        path="/integration-hub"
                        element={<IntegrationHub />}
                      />

                      {/* Plaid Test Route */}
                      <Route path="/plaid-test" element={<PlaidTest />} />

                      {/* Documentation Routes */}
                      <Route
                        path="/docs/:docPath/*"
                        element={<DocumentationViewer />}
                      />
                      <Route path="/docs" element={<DocumentationViewer />} />

                      {/* Admin panel access point - will link to separate admin application */}
                      <Route
                        path="/admin-access"
                        element={<AdminAccessPoint />}
                      />

                      <Route path="*" element={<NotFound />} />
                    </Route>
                  </Routes>
                  <Toaster />
                  <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                  />
                </UserProvider>
              </OrganizationProvider>
            </EacProvider>
          </AuthProvider>
        </Router>
      </RegulationsProvider>
    </QueryClientProvider>
  );
};

// Temporary component that will serve as the entry point to the admin backend
// In the future, this will redirect to the separate admin application
const AdminAccessPoint = () => {
  return (
    <div className="container mx-auto py-10">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-8 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">
          GreenTruth Administration Portal
        </h1>
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            This portal provides access to the GreenTruth Backend Administration
            Application. This application is currently under development and
            will be available soon.
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            For more information about the administration application, please
            refer to the
            <a
              href="/docs/admin-backend"
              className="text-blue-500 hover:underline ml-1"
            >
              administration application documentation
            </a>
            .
          </p>
        </div>
        <div className="p-4 border border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-700 rounded-md">
          <h3 className="font-semibold text-yellow-800 dark:text-yellow-400">
            Coming Soon
          </h3>
          <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
            The GreenTruth Backend Administration Application is currently under
            development. Access will be provided to authorized GreenTruth staff
            members upon completion.
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;
