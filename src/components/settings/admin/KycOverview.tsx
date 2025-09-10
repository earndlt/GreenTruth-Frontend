import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Shield, Building, Loader2, Users, ArrowRight } from "lucide-react";
import { useKybStatus } from "@/hooks/useKybStatus";
import { KYBVerificationRecord, KYBVerificationRequest } from "@/types/kyb";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";

const kybSchema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  duns: z.string().min(9, "DUNS number must be at least 9 digits").regex(/^\d+$/, "DUNS number must contain only digits"),
});

type KybFormValues = z.infer<typeof kybSchema>;

// Type guard to validate verification response
const isValidVerificationResponse = (data: any): data is any => {
  return data &&
    typeof data === 'object' &&
    typeof data.status === 'string' &&
    data.details &&
    typeof data.details === 'object';
};

const KycOverview = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [verificationHistory, setVerificationHistory] = useState<KYBVerificationRecord[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [currentVerification, setCurrentVerification] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const {
    isLoading,
    message,
    submitVerification,
    checkStatus,
    getVerificationHistory,
    getVerificationStats,
  } = useKybStatus();

  const form = useForm<KybFormValues>({
    resolver: zodResolver(kybSchema),
    defaultValues: {
      companyName: user?.company || "",
      duns: "",
    },
  });

  // Load verification history on component mount
  useEffect(() => {
    loadVerificationData();
  }, []);

  // Update form when user data changes
  useEffect(() => {
    if (user?.company) {
      form.setValue("companyName", user.company);
    }
  }, [user?.company, form]);

  const loadVerificationData = async () => {
    try {
      setIsLoadingHistory(true);
      const history = await getVerificationHistory();
      setVerificationHistory(history);
    } catch (error) {
      console.error('Error loading verification data:', error);
      toast({
        title: "Error",
        description: "Failed to load verification data",
        variant: "destructive",
      });
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const onSubmit = async (data: KybFormValues) => {
    try {
      setIsSubmitting(true);

      const request: KYBVerificationRequest = {
        duns: data.duns,
        companyName: data.companyName,
      };

      console.log('🔍 Submitting KYB verification request:', request);

      const result = await submitVerification(request);

      console.log('✅ KYB verification response:', result);

      // Extract the actual verification data from the response
      let verificationData: any = result;

      // Check if the response is wrapped in a data property (backend format)
      if (result && typeof result === 'object' && 'data' in result && result.data) {
        verificationData = result.data;
        console.log('📦 Extracted verification data from response:', verificationData);
      }

      // Validate the response structure
      if (!verificationData || typeof verificationData !== 'object') {
        throw new Error('Invalid response format from verification API');
      }

      if (!isValidVerificationResponse(verificationData)) {
        throw new Error('Response missing required fields: status and details');
      }

      setCurrentVerification(verificationData);

      toast({
        title: "Verification Submitted Successfully!",
        description: `D&B verification completed for ${verificationData.details?.companyName || data.companyName}. Risk Level: ${verificationData.details?.riskLevel || 'Unknown'}, Score: ${verificationData.details?.riskScore || 'Unknown'}`,
      });

      // Reload verification data
      await loadVerificationData();

      // Reset form
      form.reset();

      // Scroll to results
      setTimeout(() => {
        const resultsSection = document.querySelector('[data-kyb-results]');
        if (resultsSection) {
          resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);

    } catch (error) {
      console.error('❌ KYB verification error:', error);
      console.error('❌ Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace',
        data: data
      });

      toast({
        title: "Verification Failed",
        description: error instanceof Error ? error.message : "Failed to submit verification request",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNavigateToTeamManagement = () => {
    // Scroll to the User Management section on the same page
    const userManagementSection = document.getElementById('user-management');
    if (userManagementSection) {
      // Show a brief toast message
      toast({
        title: "Scrolling to Team Management",
        description: "Taking you to the User Management section...",
        duration: 1500,
      });

      // Scroll to the section with smooth animation
      userManagementSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });

      // Add a subtle highlight effect after scrolling
      setTimeout(() => {
        userManagementSection.classList.add('ring-2', 'ring-blue-300', 'ring-opacity-50');
        setTimeout(() => {
          userManagementSection.classList.remove('ring-2', 'ring-blue-300', 'ring-opacity-50');
        }, 2000);
      }, 500);
    } else {
      // Fallback: scroll to top of the page
      toast({
        title: "Navigation",
        description: "Scrolling to top of page...",
        duration: 1500,
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Determine current verification status
  const getCurrentStatus = () => {
    // First check if user is verified in the database
    if (user?.is_kyb_verified) {
      return 'approved';
    }

    if (currentVerification) {
      return currentVerification.status;
    }
    // Check if there are any approved verifications in history
    const approvedVerification = verificationHistory.find(v => v.status === 'approved');
    if (approvedVerification) {
      return 'approved';
    }
    // Check if there are any in_process verifications
    const inProcessVerification = verificationHistory.find(v => v.status === 'in_process');
    if (inProcessVerification) {
      return 'in_process';
    }
    return null;
  };

  const currentStatus = getCurrentStatus();

  // Check if user is already verified
  const isUserVerified = user?.is_kyb_verified || currentStatus === 'approved';

  // Get the latest approved verification for display
  const latestVerification = verificationHistory.find(v => v.status === 'approved') || currentVerification;

  // Load verification data when user becomes verified
  useEffect(() => {
    if (isUserVerified && verificationHistory.length === 0) {
      loadVerificationData();
    }
  }, [isUserVerified]);

  return (
    <div className="space-y-5">
      {/* Workflow Progress Indicator */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-lg text-blue-800">Your Setup Progress</CardTitle>
          <CardDescription className="text-blue-700">
            Complete these steps to unlock all GreenTruth features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            {/* Step 1: Business Verification */}
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStatus === 'approved'
                ? 'bg-green-500 text-white'
                : currentStatus === 'in_process' || currentStatus === 'pending'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-300 text-gray-600'
                }`}>
                {currentStatus === 'approved' ? '✓' : '1'}
              </div>
              <div className="text-sm">
                <div className={`font-medium ${currentStatus === 'approved' ? 'text-green-700' : 'text-blue-700'}`}>
                  Business Verification
                </div>
                <div className="text-xs text-blue-600">
                  {currentStatus === 'approved' ? 'Completed' : currentStatus === 'in_process' ? 'In Progress' : 'Pending'}
                </div>
              </div>
            </div>

            {/* Arrow */}
            <div className="text-blue-400">
              <ArrowRight className="h-4 w-4" />
            </div>

            {/* Step 2: Team Setup */}
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStatus === 'approved' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                2
              </div>
              <div className="text-sm">
                <div className="font-medium text-blue-700">Team Setup</div>
                <div className="text-xs text-blue-600">
                  {currentStatus === 'approved' ? 'Ready to start' : 'Waiting for verification'}
                </div>
              </div>
            </div>

            {/* Arrow */}
            <div className="text-blue-400">
              <ArrowRight className="h-4 w-4" />
            </div>

            {/* Step 3: Payment Setup */}
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium bg-gray-300 text-gray-600">
              3
            </div>
            <div className="text-sm">
              <div className="font-medium text-gray-600">Payment Setup</div>
              <div className="text-xs text-gray-500">
                {currentStatus === 'approved' ? 'Ready to start' : 'Waiting for verification'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Business Verification (KYB)</h2>
          <p className="text-muted-foreground">
            Verify business entities using Dun & Bradstreet RiskAnalytics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Shield className="h-8 w-8 text-primary" />
          <span className="text-sm font-medium">D&B Integration</span>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Current Verification Status */}
          {currentVerification && currentVerification.status ? (
            <Card className="border-blue-200 bg-blue-50" data-kyb-results>
            <CardHeader>
                <CardTitle className="text-blue-800">Verification Results</CardTitle>
              <CardDescription>
                  D&B Risk Analytics verification completed successfully
              </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                  {/* Verification Message */}
                  <div className={`p-4 rounded-lg border-2 ${currentVerification.status === 'approved' ? 'bg-green-50 border-green-200' :
                    currentVerification.status === 'rejected' ? 'bg-red-50 border-red-200' :
                      'bg-yellow-50 border-yellow-200'
                    }`}>
                    <div className="text-center">
                      <div className={`text-lg font-semibold mb-2 ${currentVerification.status === 'approved' ? 'text-green-800' :
                        currentVerification.status === 'rejected' ? 'text-red-800' :
                          'text-yellow-800'
                        }`}>
                        {currentVerification.status === 'approved' ? '✓ Business Verification Approved' :
                          currentVerification.status === 'rejected' ? '✗ Business Verification Rejected' :
                            '⚠ Business Verification Under Review'}
                      </div>
                      <div className={`text-sm ${currentVerification.status === 'approved' ? 'text-green-700' :
                        currentVerification.status === 'rejected' ? 'text-red-700' :
                          'text-yellow-700'
                        }`}>
                        {currentVerification.message || 'Verification completed'}
                      </div>
                    </div>
                  </div>

                  {/* Company Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900">Company Details</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">D&B Company Name:</span>
                          <span className="text-sm font-medium">{currentVerification.details?.companyName || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">User Input Name:</span>
                          <span className="text-sm font-medium text-gray-500">{currentVerification.userInput?.companyName || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">DUNS Number:</span>
                          <span className="text-sm font-medium">{currentVerification.details?.dunsNumber || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Entity State:</span>
                          <span className="text-sm font-medium">{currentVerification.details?.entityState || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Data Package:</span>
                          <span className="text-sm font-medium">{currentVerification.details?.dataPackage || 'N/A'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900">Verification Status</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Status:</span>
                          <Badge variant={
                            currentVerification.status === 'approved' ? 'default' :
                              currentVerification.status === 'rejected' ? 'destructive' :
                                currentVerification.status === 'in_process' ? 'secondary' :
                                  'outline'
                          }>
                            {String(currentVerification.status || 'unknown').toUpperCase()}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Verification ID:</span>
                          <span className="text-sm font-medium font-mono">{currentVerification.details?.verificationId || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Submitted:</span>
                          <span className="text-sm font-medium">
                            {currentVerification.details?.submittedAt ?
                              new Date(currentVerification.details.submittedAt).toLocaleString() : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Risk Assessment */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">Risk Assessment</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-3 bg-white border rounded-lg">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900">{currentVerification.details?.riskScore || 'N/A'}</div>
                          <div className="text-sm text-gray-600">Risk Score</div>
                          <div className={`mt-2 px-2 py-1 rounded-full text-xs font-medium ${currentVerification.details?.riskLevel === 'L' ? 'bg-green-100 text-green-800' :
                            currentVerification.details?.riskLevel === 'M' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                            {currentVerification.details?.riskLevel === 'L' ? 'LOW RISK' :
                              currentVerification.details?.riskLevel === 'M' ? 'MEDIUM RISK' : 'HIGH RISK'}
                          </div>
                        </div>
                      </div>

                      <div className="p-3 bg-white border rounded-lg">
                        <div className="text-center">
                          <div className="text-lg font-semibold text-gray-900">
                            {currentVerification.details?.riskLevel === 'L' ? '✓' :
                              currentVerification.details?.riskLevel === 'M' ? '⚠' : '✗'}
                          </div>
                          <div className="text-sm text-gray-600">Risk Level</div>
                          <div className="mt-2 text-xs text-gray-500">
                            {currentVerification.details?.riskLevel === 'L' ? 'Approved' :
                              currentVerification.details?.riskLevel === 'M' ? 'Under Review' : 'Rejected'}
                          </div>
                        </div>
                      </div>

                      <div className="p-3 bg-white border rounded-lg">
                        <div className="text-center">
                          <div className="text-lg font-semibold text-gray-900">
                            {currentVerification.status === 'approved' ? '✓' :
                              currentVerification.status === 'in_process' ? '⏳' : '✗'}
                          </div>
                          <div className="text-sm text-gray-600">Final Decision</div>
                          <div className="mt-2 text-xs text-gray-500">
                            {currentVerification.status === 'approved' ? 'Business Verified' :
                              currentVerification.status === 'in_process' ? 'Under Review' : 'Verification Failed'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Detailed Risk Breakdown */}
                  {currentVerification.details?.dnbEntityData?.riskScorecard?.riskScores && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900">Final Risk Results</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-200 bg-white rounded-lg">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">Risk Category</th>
                              <th className="border border-gray-200 px-4 py-3 text-center text-sm font-medium text-gray-700">Score</th>
                              <th className="border border-gray-200 px-4 py-3 text-center text-sm font-medium text-gray-700">Level</th>
                              <th className="border border-gray-200 px-4 py-3 text-center text-sm font-medium text-gray-700">Visual Indicator</th>
                            </tr>
                          </thead>
                          <tbody>
                            {/* Country/Region Risk */}
                            <tr className="hover:bg-gray-50">
                              <td className="border border-gray-200 px-4 py-3 text-sm font-medium text-gray-900">Country/Region Risk</td>
                              <td className="border border-gray-200 px-4 py-3 text-center text-sm font-bold text-gray-900">
                                {currentVerification.details.dnbEntityData.riskScorecard.riskScores.overallCountryRisk?.rating || '—'}
                              </td>
                              <td className="border border-gray-200 px-4 py-3 text-center">
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${currentVerification.details.dnbEntityData.riskScorecard.riskScores.overallCountryRisk?.level === 'L' ? 'bg-green-100 text-green-800' :
                                    currentVerification.details.dnbEntityData.riskScorecard.riskScores.overallCountryRisk?.level === 'M' ? 'bg-yellow-100 text-yellow-800' :
                                      'bg-red-100 text-red-800'
                                  }`}>
                                  {currentVerification.details.dnbEntityData.riskScorecard.riskScores.overallCountryRisk?.level || '—'}
                                </span>
                              </td>
                              <td className="border border-gray-200 px-4 py-3 text-center">
                                <div className={`h-2 w-16 mx-auto rounded-full ${currentVerification.details.dnbEntityData.riskScorecard.riskScores.overallCountryRisk?.level === 'L' ? 'bg-green-600' :
                                    currentVerification.details.dnbEntityData.riskScorecard.riskScores.overallCountryRisk?.level === 'M' ? 'bg-yellow-500' :
                                      'bg-red-600'
                                  }`}></div>
                              </td>
                            </tr>

                            {/* Industry Risk */}
                            <tr className="hover:bg-gray-50">
                              <td className="border border-gray-200 px-4 py-3 text-sm font-medium text-gray-900">Industry Risk</td>
                              <td className="border border-gray-200 px-4 py-3 text-center text-sm font-bold text-gray-900">
                                {currentVerification.details.dnbEntityData.riskScorecard.riskScores.industryRisk?.rating || '—'}
                              </td>
                              <td className="border border-gray-200 px-4 py-3 text-center">
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${currentVerification.details.dnbEntityData.riskScorecard.riskScores.industryRisk?.level === 'L' ? 'bg-green-100 text-green-800' :
                                    currentVerification.details.dnbEntityData.riskScorecard.riskScores.industryRisk?.level === 'M' ? 'bg-yellow-100 text-yellow-800' :
                                      'bg-red-100 text-red-800'
                                  }`}>
                                  {currentVerification.details.dnbEntityData.riskScorecard.riskScores.industryRisk?.level || '—'}
                                </span>
                              </td>
                              <td className="border border-gray-200 px-4 py-3 text-center">
                                <div className={`h-2 w-16 mx-auto rounded-full ${currentVerification.details.dnbEntityData.riskScorecard.riskScores.industryRisk?.level === 'L' ? 'bg-green-600' :
                                    currentVerification.details.dnbEntityData.riskScorecard.riskScores.industryRisk?.level === 'M' ? 'bg-yellow-500' :
                                      'bg-red-600'
                                  }`}></div>
                              </td>
                            </tr>

                            {/* Entity Risk */}
                            <tr className="hover:bg-gray-50">
                              <td className="border border-gray-200 px-4 py-3 text-sm font-medium text-gray-900">Entity Risk</td>
                              <td className="border border-gray-200 px-4 py-3 text-center text-sm font-bold text-gray-900">
                                {currentVerification.details.dnbEntityData.riskScorecard.riskScores.overallEntityRisk?.rating || '—'}
                              </td>
                              <td className="border border-gray-200 px-4 py-3 text-center">
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${currentVerification.details.dnbEntityData.riskScorecard.riskScores.overallEntityRisk?.level === 'L' ? 'bg-green-100 text-green-800' :
                                    currentVerification.details.dnbEntityData.riskScorecard.riskScores.overallEntityRisk?.level === 'M' ? 'bg-yellow-100 text-yellow-800' :
                                      'bg-red-100 text-red-800'
                                  }`}>
                                  {currentVerification.details.dnbEntityData.riskScorecard.riskScores.overallEntityRisk?.level || '—'}
                                </span>
                              </td>
                              <td className="border border-gray-200 px-4 py-3 text-center">
                                <div className={`h-2 w-16 mx-auto rounded-full ${currentVerification.details.dnbEntityData.riskScorecard.riskScores.overallEntityRisk?.level === 'L' ? 'bg-green-600' :
                                    currentVerification.details.dnbEntityData.riskScorecard.riskScores.overallEntityRisk?.level === 'M' ? 'bg-yellow-500' :
                                      'bg-red-600'
                                  }`}></div>
                              </td>
                            </tr>

                            {/* Sanctions */}
                            <tr className="hover:bg-gray-50">
                              <td className="border border-gray-200 px-4 py-3 text-sm font-medium text-gray-900">Sanctions</td>
                              <td className="border border-gray-200 px-4 py-3 text-center" colSpan={2}>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-600">
                                  {currentVerification.details.dnbEntityData.riskScorecard.riskScores.sanctionsRisk?.reason || 'No Hits'}
                                </span>
                              </td>
                              <td className="border border-gray-200 px-4 py-3 text-center">
                                <div className="h-2 w-16 mx-auto rounded-full bg-blue-500"></div>
                              </td>
                            </tr>

                            {/* Watchlists */}
                            <tr className="hover:bg-gray-50">
                              <td className="border border-gray-200 px-4 py-3 text-sm font-medium text-gray-900">Watchlists</td>
                              <td className="border border-gray-200 px-4 py-3 text-center" colSpan={2}>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-600">
                                  {currentVerification.details.dnbEntityData.riskScorecard.riskScores.watchlistRisk?.reason || 'No Hits'}
                                </span>
                              </td>
                              <td className="border border-gray-200 px-4 py-3 text-center">
                                <div className="h-2 w-16 mx-auto rounded-full bg-blue-500"></div>
                              </td>
                            </tr>

                            {/* Political Affiliations (PEP) */}
                            <tr className="hover:bg-gray-50">
                              <td className="border border-gray-200 px-4 py-3 text-sm font-medium text-gray-900">Political Affiliations (PEP)</td>
                              <td className="border border-gray-200 px-4 py-3 text-center" colSpan={2}>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-600">
                                  {currentVerification.details.dnbEntityData.riskScorecard.riskScores.politicalAffiliationRisk?.reason || 'No Hits'}
                                </span>
                              </td>
                              <td className="border border-gray-200 px-4 py-3 text-center">
                                <div className="h-2 w-16 mx-auto rounded-full bg-blue-500"></div>
                              </td>
                            </tr>

                            {/* Adverse Media */}
                            <tr className="hover:bg-gray-50">
                              <td className="border border-gray-200 px-4 py-3 text-sm font-medium text-gray-900">Adverse Media</td>
                              <td className="border border-gray-200 px-4 py-3 text-center" colSpan={2}>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-600">
                                  {currentVerification.details.dnbEntityData.riskScorecard.riskScores.adverseMediaRisk?.reason || 'No Hits'}
                                </span>
                              </td>
                              <td className="border border-gray-200 px-4 py-3 text-center">
                                <div className="h-2 w-16 mx-auto rounded-full bg-blue-500"></div>
                              </td>
                            </tr>

                            {/* Calculated Risk */}
                            <tr className="hover:bg-gray-50 bg-gray-50">
                              <td className="border border-gray-200 px-4 py-3 text-sm font-bold text-gray-900">Calculated Risk</td>
                              <td className="border border-gray-200 px-4 py-3 text-center text-sm font-bold text-gray-900">
                                {currentVerification.details.dnbEntityData.riskScorecard.riskScores.overallRisk?.rating || '—'}
                              </td>
                              <td className="border border-gray-200 px-4 py-3 text-center">
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${currentVerification.details.dnbEntityData.riskScorecard.riskScores.overallRisk?.level === 'L' ? 'bg-green-100 text-green-800' :
                                  currentVerification.details.dnbEntityData.riskScorecard.riskScores.overallRisk?.level === 'M' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                  }`}>
                                  {currentVerification.details.dnbEntityData.riskScorecard.riskScores.overallRisk?.level || '—'}
                                </span>
                              </td>
                              <td className="border border-gray-200 px-4 py-3 text-center">
                                <div className={`h-2 w-16 mx-auto rounded-full ${currentVerification.details.dnbEntityData.riskScorecard.riskScores.overallRisk?.level === 'L' ? 'bg-green-600' :
                                  currentVerification.details.dnbEntityData.riskScorecard.riskScores.overallRisk?.level === 'M' ? 'bg-yellow-500' :
                                    'bg-red-600'
                                  }`}></div>
                              </td>
                            </tr>

                            {/* Final Risk */}
                            <tr className="hover:bg-gray-50 bg-blue-50">
                              <td className="border-gray-200 px-4 py-3 text-sm font-bold text-blue-900 flex items-center gap-2">
                                Final Risk
                                <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                              </td>
                              <td className="border border-gray-200 px-4 py-3 text-center text-sm font-bold text-blue-900">
                                {currentVerification.details.dnbEntityData.riskScorecard.riskScores.overriddenRisk?.rating || '—'}
                              </td>
                              <td className="border border-gray-200 px-4 py-3 text-center">
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${currentVerification.details.dnbEntityData.riskScorecard.riskScores.overriddenRisk?.level === 'L' ? 'bg-green-100 text-green-800' :
                                  currentVerification.details.dnbEntityData.riskScorecard.riskScores.overriddenRisk?.level === 'M' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                  }`}>
                                  {currentVerification.details.dnbEntityData.riskScorecard.riskScores.overriddenRisk?.level || '—'}
                                </span>
                              </td>
                              <td className="border border-gray-200 px-4 py-3 text-center">
                                <div className={`h-2 w-16 mx-auto rounded-full ${currentVerification.details.dnbEntityData.riskScorecard.riskScores.overriddenRisk?.level === 'L' ? 'bg-green-600' :
                                  currentVerification.details.dnbEntityData.riskScorecard.riskScores.overriddenRisk?.level === 'M' ? 'bg-yellow-500' :
                                    'bg-red-600'
                                  }`}></div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Entity Process Information */}
                  {currentVerification.details?.entityProcess && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900">Entity Process Status</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3 bg-white border rounded-lg">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Process Status:</span>
                            <Badge variant={
                              currentVerification.details.entityProcess.status === 'APPROVED' ? 'default' :
                                currentVerification.details.entityProcess.status === 'PENDING' ? 'secondary' :
                                  'destructive'
                            }>
                              {currentVerification.details.entityProcess.status}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Decision By:</span>
                            <span className="text-sm font-medium">{currentVerification.details.entityProcess.decisionBy || 'N/A'}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Initiated By:</span>
                            <span className="text-sm font-medium">{currentVerification.details.entityProcess.initiatedBy || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Reason:</span>
                            <span className="text-sm font-medium">{currentVerification.details.entityProcess.reason || 'N/A'}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Updated Date:</span>
                            <span className="text-sm font-medium">
                              {currentVerification.details.entityProcess.updatedDate ?
                                new Date(currentVerification.details.entityProcess.updatedDate).toLocaleDateString() : 'N/A'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Screening Details */}
                  {currentVerification.details?.screeningDetails && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900">Screening Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3 bg-white border rounded-lg">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Screening Level:</span>
                            <span className="text-sm font-medium">{currentVerification.details.screeningDetails.level || 'N/A'}</span>
                  </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Enrichment:</span>
                            <span className="text-sm font-medium">{currentVerification.details.screeningDetails.enrichment || 'N/A'}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Kase Iteration ID:</span>
                            <span className="text-sm font-medium font-mono text-xs">{currentVerification.details.screeningDetails.kaseIterationId || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Address Information */}
                  {currentVerification.details?.address && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900">Address Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 bg-white border rounded-lg">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Street:</span>
                            <span className="text-sm font-medium">{currentVerification.details.address.street || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">City:</span>
                            <span className="text-sm font-medium">{currentVerification.details.address.city || 'N/A'}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">State:</span>
                            <span className="text-sm font-medium">{currentVerification.details.address.state || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">ZIP:</span>
                            <span className="text-sm font-medium">{currentVerification.details.address.zip || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Country:</span>
                            <span className="text-sm font-medium">{currentVerification.details.address.country || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Business Details */}
                  {currentVerification.details?.businessDetails && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900">Business Details</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 bg-white border rounded-lg">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Year Established:</span>
                            <span className="text-sm font-medium">{currentVerification.details.businessDetails.yearEstablished || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Registration #:</span>
                            <span className="text-sm font-medium">{currentVerification.details.businessDetails.registrationNumber || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Industry:</span>
                            <span className="text-sm font-medium">{currentVerification.details.businessDetails.industry || 'N/A'}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Operating Status:</span>
                            <span className="text-sm font-medium">{currentVerification.details.businessDetails.operatingStatus || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">CEO:</span>
                            <span className="text-sm font-medium">{currentVerification.details.businessDetails.ceo || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Additional Business Information */}
                  {currentVerification.details?.additionalInfo && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900">Additional Business Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 bg-white border rounded-lg">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Website:</span>
                            <span className="text-sm font-medium">
                              {currentVerification.details.additionalInfo.website ? (
                                <a href={`https://${currentVerification.details.additionalInfo.website}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline">
                                  {currentVerification.details.additionalInfo.website}
                                </a>
                              ) : 'N/A'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Phone:</span>
                            <span className="text-sm font-medium">{currentVerification.details.additionalInfo.phone || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Currency:</span>
                            <span className="text-sm font-medium">{currentVerification.details.additionalInfo.currency || 'N/A'}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">SIC Code:</span>
                            <span className="text-sm font-medium">{currentVerification.details.additionalInfo.sicCode || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">NAICS Code:</span>
                            <span className="text-sm font-medium">{currentVerification.details.additionalInfo.naicsCode || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">UNSPSC Code:</span>
                            <span className="text-sm font-medium">{currentVerification.details.additionalInfo.unspscCode || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  </div>
              </CardContent>
            </Card>
          ) : (
            <></>
          )}

          {/* <Card className="border-gray-200 bg-gray-50">
              <CardHeader>
                <CardTitle className="text-gray-800">No Active Verification</CardTitle>
                <CardDescription>
                  Submit a business verification request to see results here
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Shield className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 mb-2">No verification has been submitted yet</p>
                  <p className="text-sm text-gray-500">Use the form below to verify a business entity</p>
                </div>
              </CardContent>
            </Card> */}

          {/* Conditional Rendering: Verification Success or Form */}
          {isUserVerified ? (
            /* Verification Success Display */
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <Shield className="h-5 w-5" />
                  Business Verification Complete
                </CardTitle>
                <CardDescription className="text-green-700">
                  Your business has been successfully verified with D&B Risk Analytics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Success Message */}
                  <div className="p-4 rounded-lg border-2 bg-green-100 border-green-300">
                    <div className="text-center">
                      <div className="text-lg font-semibold mb-2 text-green-800">
                        ✓ Business Verification Approved
                      </div>
                      <div className="text-sm text-green-700">
                        Your business verification is complete and active
                      </div>
                    </div>
                  </div>

                  {/* Company Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900">Verified Company Details</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Company Name:</span>
                          <span className="text-sm font-medium">{user?.company || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Verification Status:</span>
                          <Badge variant="default" className="bg-green-600">
                            VERIFIED
                          </Badge>
                        </div>
                        {latestVerification?.details?.dunsNumber && (
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">DUNS Number:</span>
                            <span className="text-sm font-medium">{latestVerification.details.dunsNumber}</span>
                          </div>
                        )}
                        {latestVerification?.details?.riskLevel && (
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Risk Level:</span>
                            <Badge variant={
                              latestVerification.details.riskLevel === 'L' ? 'default' :
                                latestVerification.details.riskLevel === 'M' ? 'secondary' :
                                  'destructive'
                            } className={
                              latestVerification.details.riskLevel === 'L' ? 'bg-green-600' :
                                latestVerification.details.riskLevel === 'M' ? 'bg-yellow-600' :
                                  'bg-red-600'
                            }>
                              {latestVerification.details.riskLevel}
                            </Badge>
                          </div>
                        )}
                        {latestVerification?.details?.riskScore && (
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Risk Score:</span>
                            <span className="text-sm font-medium">{latestVerification.details.riskScore}</span>
                          </div>
                        )}
                        {latestVerification?.details?.verificationId && (
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Verification ID:</span>
                            <span className="text-sm font-medium font-mono">{latestVerification.details.verificationId}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900">Verification Benefits</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-gray-700">Full platform access enabled</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-gray-700">EAC purchase capabilities unlocked</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-gray-700">Advanced features available</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-gray-700">Compliance requirements met</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* View History Button */}
                  <div className="text-center pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setActiveTab("history")}
                      className="border-green-300 text-green-700 hover:bg-green-100"
                    >
                      <Users className="mr-2 h-4 w-4" />
                      View Verification Detail
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            /* Verification Form */
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Business Verification
                </CardTitle>
                <CardDescription>
                  Verify a business entity using DUNS number and company name
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                        name="companyName"
                      render={({ field }) => (
                        <FormItem>
                            <FormLabel>Company Name *</FormLabel>
                          <FormControl>
                              <Input
                                placeholder="Company name from your profile"
                                {...field}
                                readOnly
                                className="bg-gray-50 cursor-not-allowed"
                              />
                          </FormControl>
                          <FormMessage />
                            <p className="text-sm text-gray-500">
                              Company name is taken from your account settings. After verification, it will be updated to match the D&B authoritative record.
                            </p>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                        name="duns"
                      render={({ field }) => (
                        <FormItem>
                            <FormLabel>DUNS Number *</FormLabel>
                          <FormControl>
                              <Input placeholder="Enter 9-digit DUNS number" {...field} />
                          </FormControl>
                          <FormMessage />
                          <p className="text-sm text-gray-500">
                            Don't have a DUNS number?{" "}
                            <a 
                              href="https://www.dnb.com/duns-number/lookup.html" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 underline"
                            >
                              Look up your DUNS number
                            </a>
                            {" "}or{" "}
                            <a 
                              href="https://www.dnb.com/duns-number.html" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 underline"
                            >
                              request a new one
                            </a>
                            {" "}from Dun & Bradstreet.
                          </p>
                        </FormItem>
                      )}
                    />
                  </div>

                    <Button type="submit" disabled={isSubmitting} className="w-full">
                      {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Verifying with D&B...
                      </>
                    ) : (
                      <>
                        <Shield className="mr-2 h-4 w-4" />
                        Verify Business
                      </>
                    )}
                  </Button>

                    {isSubmitting && (
                      <div className="text-center text-sm text-gray-600">
                        <p>Connecting to D&B Risk Analytics...</p>
                        <p className="text-xs">This may take a few moments</p>
                      </div>
                    )}
                </form>
              </Form>
            </CardContent>
          </Card>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Verification History
              </CardTitle>
              <CardDescription>
                View all business verification requests and their detailed results
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingHistory ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : verificationHistory.length > 0 ? (
                <div className="space-y-6">
                  {verificationHistory.map((verification) => (
                    <div
                      key={verification.verificationId}
                      className="border rounded-lg overflow-hidden"
                    >
                      {/* Verification Header */}
                      <div className="bg-gray-50 p-4 border-b">
                        <div className="flex items-center justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <span className="font-semibold text-lg">{verification.companyName}</span>
                          <Badge variant={
                            verification.status === 'approved' ? 'default' :
                              verification.status === 'rejected' ? 'destructive' :
                                verification.status === 'in_process' ? 'secondary' :
                                  'outline'
                          }>
                            {verification.status.toUpperCase()}
                          </Badge>
                        </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span>DUNS: {verification.duns}</span>
                              <span>Submitted: {new Date(verification.submittedAt).toLocaleDateString()}</span>
                              <span>Updated: {new Date(verification.updatedAt).toLocaleDateString()}</span>
                      </div>
                          </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => checkStatus(verification.verificationId)}
                      >
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                        </div>
                      </div>

                      {/* Verification Details */}
                      <div className="p-4 space-y-6">
                        {/* Risk Assessment Summary */}
                        <div className="space-y-3">
                          <h4 className="font-semibold text-gray-900">Risk Assessment</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-3 bg-white border rounded-lg">
                              <div className="text-center">
                                <div className="text-xl font-bold text-gray-900">{verification.riskScore || 'N/A'}</div>
                                <div className="text-sm text-gray-600">Risk Score</div>
                                <div className={`mt-2 px-2 py-1 rounded-full text-xs font-medium ${verification.riskLevel === 'L' ? 'bg-green-100 text-green-800' :
                                  verification.riskLevel === 'M' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                  }`}>
                                  {verification.riskLevel === 'L' ? 'LOW RISK' :
                                    verification.riskLevel === 'M' ? 'MEDIUM RISK' : 'HIGH RISK'}
                                </div>
                              </div>
                            </div>

                            <div className="p-3 bg-white border rounded-lg">
                              <div className="text-center">
                                <div className="text-lg font-semibold text-gray-900">
                                  {verification.riskLevel === 'L' ? '✓' :
                                    verification.riskLevel === 'M' ? '⚠' : '✗'}
                                </div>
                                <div className="text-sm text-gray-600">Risk Level</div>
                                <div className="mt-2 text-xs text-gray-500">
                                  {verification.riskLevel === 'L' ? 'Approved' :
                                    verification.riskLevel === 'M' ? 'Under Review' : 'Rejected'}
                                </div>
                              </div>
                            </div>

                            <div className="p-3 bg-white border rounded-lg">
                              <div className="text-center">
                                <div className="text-lg font-semibold text-gray-900">
                                  {verification.status === 'approved' ? '✓' :
                                    verification.status === 'in_process' ? '⏳' : '✗'}
                                </div>
                                <div className="text-sm text-gray-600">Final Decision</div>
                                <div className="mt-2 text-xs text-gray-500">
                                  {verification.status === 'approved' ? 'Business Verified' :
                                    verification.status === 'in_process' ? 'Under Review' : 'Verification Failed'}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Detailed Risk Breakdown */}
                        {verification.dnbEntityData?.riskScorecard?.riskScores && (
                          <div className="space-y-3">
                            <h4 className="font-semibold text-gray-900">Final Risk Results</h4>
                            <div className="overflow-x-auto">
                              <table className="w-full border-collapse border border-gray-200 bg-white rounded-lg">
                                <thead>
                                  <tr className="bg-gray-50">
                                    <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">Risk Category</th>
                                    <th className="border border-gray-200 px-4 py-3 text-center text-sm font-medium text-gray-700">Score</th>
                                    <th className="border border-gray-200 px-4 py-3 text-center text-sm font-medium text-gray-700">Level</th>
                                    <th className="border border-gray-200 px-4 py-3 text-center text-sm font-medium text-gray-700">Visual Indicator</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {/* Country/Region Risk */}
                                  <tr className="hover:bg-gray-50">
                                    <td className="border border-gray-200 px-4 py-3 text-sm font-medium text-gray-900">Country/Region Risk</td>
                                    <td className="border border-gray-200 px-4 py-3 text-center text-sm font-bold text-gray-900">
                                      {verification.dnbEntityData.riskScorecard.riskScores.overallCountryRisk?.rating || '—'}
                                    </td>
                                    <td className="border border-gray-200 px-4 py-3 text-center">
                                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${verification.dnbEntityData.riskScorecard.riskScores.overallCountryRisk?.level === 'L' ? 'bg-green-100 text-green-800' :
                                          verification.dnbEntityData.riskScorecard.riskScores.overallCountryRisk?.level === 'M' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                        {verification.dnbEntityData.riskScorecard.riskScores.overallCountryRisk?.level || '—'}
                                      </span>
                                    </td>
                                    <td className="border border-gray-200 px-4 py-3 text-center">
                                      <div className={`h-2 w-16 mx-auto rounded-full ${verification.dnbEntityData.riskScorecard.riskScores.overallCountryRisk?.level === 'L' ? 'bg-green-600' :
                                          verification.dnbEntityData.riskScorecard.riskScores.overallCountryRisk?.level === 'M' ? 'bg-yellow-500' :
                                            'bg-red-600'
                                        }`}></div>
                                    </td>
                                  </tr>

                                  {/* Industry Risk */}
                                  <tr className="hover:bg-gray-50">
                                    <td className="border border-gray-200 px-4 py-3 text-sm font-medium text-gray-900">Industry Risk</td>
                                    <td className="border border-gray-200 px-4 py-3 text-center text-sm font-bold text-gray-900">
                                      {verification.dnbEntityData.riskScorecard.riskScores.industryRisk?.rating || '—'}
                                    </td>
                                    <td className="border border-gray-200 px-4 py-3 text-center">
                                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${verification.dnbEntityData.riskScorecard.riskScores.industryRisk?.level === 'L' ? 'bg-green-100 text-green-800' :
                                          verification.dnbEntityData.riskScorecard.riskScores.industryRisk?.level === 'M' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                        {verification.dnbEntityData.riskScorecard.riskScores.industryRisk?.level || '—'}
                                      </span>
                                    </td>
                                    <td className="border border-gray-200 px-4 py-3 text-center">
                                      <div className={`h-2 w-16 mx-auto rounded-full ${verification.dnbEntityData.riskScorecard.riskScores.industryRisk?.level === 'L' ? 'bg-green-600' :
                                          verification.dnbEntityData.riskScorecard.riskScores.industryRisk?.level === 'M' ? 'bg-yellow-500' :
                                            'bg-red-600'
                                        }`}></div>
                                    </td>
                                  </tr>

                                  {/* Entity Risk */}
                                  <tr className="hover:bg-gray-50">
                                    <td className="border border-gray-200 px-4 py-3 text-sm font-medium text-gray-900">Entity Risk</td>
                                    <td className="border border-gray-200 px-4 py-3 text-center text-sm font-bold text-gray-900">
                                      {verification.dnbEntityData.riskScorecard.riskScores.overallEntityRisk?.rating || '—'}
                                    </td>
                                    <td className="border border-gray-200 px-4 py-3 text-center">
                                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${verification.dnbEntityData.riskScorecard.riskScores.overallEntityRisk?.level === 'L' ? 'bg-green-100 text-green-800' :
                                          verification.dnbEntityData.riskScorecard.riskScores.overallEntityRisk?.level === 'M' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                        {verification.dnbEntityData.riskScorecard.riskScores.overallEntityRisk?.level || '—'}
                                      </span>
                                    </td>
                                    <td className="border border-gray-200 px-4 py-3 text-center">
                                      <div className={`h-2 w-16 mx-auto rounded-full ${verification.dnbEntityData.riskScorecard.riskScores.overallEntityRisk?.level === 'L' ? 'bg-green-600' :
                                          verification.dnbEntityData.riskScorecard.riskScores.overallEntityRisk?.level === 'M' ? 'bg-yellow-500' :
                                            'bg-red-600'
                                        }`}></div>
                                    </td>
                                  </tr>

                                  {/* Sanctions */}
                                  <tr className="hover:bg-gray-50">
                                    <td className="border border-gray-200 px-4 py-3 text-sm font-medium text-gray-900">Sanctions</td>
                                    <td className="border border-gray-200 px-4 py-3 text-center text-sm font-bold text-gray-900">
                                      {verification.dnbEntityData.riskScorecard.riskScores.sanctionsRisk?.reason === 'No Hits' ? '—' :
                                        verification.dnbEntityData.riskScorecard.riskScores.sanctionsRisk?.rating || '—'}
                                    </td>
                                    <td className="border border-gray-200 px-4 py-3 text-center">
                                      {verification.dnbEntityData.riskScorecard.riskScores.sanctionsRisk?.reason === 'No Hits' ? (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-600">
                                          No Hits
                                        </span>
                                      ) : (
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${verification.dnbEntityData.riskScorecard.riskScores.sanctionsRisk?.level === 'L' ? 'bg-green-100 text-green-800' :
                                            verification.dnbEntityData.riskScorecard.riskScores.sanctionsRisk?.level === 'M' ? 'bg-yellow-100 text-yellow-800' :
                                              'bg-red-100 text-red-800'
                                          }`}>
                                          {verification.dnbEntityData.riskScorecard.riskScores.sanctionsRisk?.level || '—'}
                                        </span>
                                      )}
                                    </td>
                                    <td className="border border-gray-200 px-4 py-3 text-center">
                                      {verification.dnbEntityData.riskScorecard.riskScores.sanctionsRisk?.reason === 'No Hits' ? (
                                        <div className="h-2 w-16 mx-auto rounded-full bg-blue-500"></div>
                                      ) : (
                                        <div className={`h-2 w-16 mx-auto rounded-full ${verification.dnbEntityData.riskScorecard.riskScores.sanctionsRisk?.level === 'L' ? 'bg-green-600' :
                                            verification.dnbEntityData.riskScorecard.riskScores.sanctionsRisk?.level === 'M' ? 'bg-yellow-500' :
                                              'bg-red-600'
                                          }`}></div>
                                      )}
                                    </td>
                                  </tr>

                                  {/* Watchlists */}
                                  <tr className="hover:bg-gray-50">
                                    <td className="border border-gray-200 px-4 py-3 text-sm font-medium text-gray-900">Watchlists</td>
                                    <td className="border border-gray-200 px-4 py-3 text-center text-sm font-bold text-gray-900">
                                      {verification.dnbEntityData.riskScorecard.riskScores.watchlistRisk?.reason === 'No Hits' ? '—' :
                                        verification.dnbEntityData.riskScorecard.riskScores.watchlistRisk?.rating || '—'}
                                    </td>
                                    <td className="border border-gray-200 px-4 py-3 text-center">
                                      {verification.dnbEntityData.riskScorecard.riskScores.watchlistRisk?.reason === 'No Hits' ? (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-600">
                                          No Hits
                                        </span>
                                      ) : (
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${verification.dnbEntityData.riskScorecard.riskScores.watchlistRisk?.level === 'L' ? 'bg-green-100 text-green-800' :
                                            verification.dnbEntityData.riskScorecard.riskScores.watchlistRisk?.level === 'M' ? 'bg-yellow-100 text-yellow-800' :
                                              'bg-red-100 text-red-800'
                                          }`}>
                                          {verification.dnbEntityData.riskScorecard.riskScores.watchlistRisk?.level || '—'}
                                        </span>
                                      )}
                                    </td>
                                    <td className="border border-gray-200 px-4 py-3 text-center">
                                      {verification.dnbEntityData.riskScorecard.riskScores.watchlistRisk?.reason === 'No Hits' ? (
                                        <div className="h-2 w-16 mx-auto rounded-full bg-blue-500"></div>
                                      ) : (
                                        <div className={`h-2 w-16 mx-auto rounded-full ${verification.dnbEntityData.riskScorecard.riskScores.watchlistRisk?.level === 'L' ? 'bg-green-600' :
                                            verification.dnbEntityData.riskScorecard.riskScores.watchlistRisk?.level === 'M' ? 'bg-yellow-500' :
                                              'bg-red-600'
                                          }`}></div>
                                      )}
                                    </td>
                                  </tr>

                                  {/* Political Affiliations (PEP) */}
                                  <tr className="hover:bg-gray-50">
                                    <td className="border border-gray-200 px-4 py-3 text-sm font-medium text-gray-900">Political Affiliations (PEP)</td>
                                    <td className="border border-gray-200 px-4 py-3 text-center text-sm font-bold text-gray-900">
                                      {verification.dnbEntityData.riskScorecard.riskScores.politicalAffiliationRisk?.reason === 'No Hits' ? '—' :
                                        verification.dnbEntityData.riskScorecard.riskScores.politicalAffiliationRisk?.rating || '—'}
                                    </td>
                                    <td className="border border-gray-200 px-4 py-3 text-center">
                                      {verification.dnbEntityData.riskScorecard.riskScores.politicalAffiliationRisk?.reason === 'No Hits' ? (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-600">
                                          No Hits
                                        </span>
                                      ) : (
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${verification.dnbEntityData.riskScorecard.riskScores.politicalAffiliationRisk?.level === 'L' ? 'bg-green-100 text-green-800' :
                                            verification.dnbEntityData.riskScorecard.riskScores.politicalAffiliationRisk?.level === 'M' ? 'bg-yellow-100 text-yellow-800' :
                                              'bg-red-100 text-red-800'
                                          }`}>
                                          {verification.dnbEntityData.riskScorecard.riskScores.politicalAffiliationRisk?.level || '—'}
                                        </span>
                                      )}
                                    </td>
                                    <td className="border border-gray-200 px-4 py-3 text-center">
                                      {verification.dnbEntityData.riskScorecard.riskScores.politicalAffiliationRisk?.reason === 'No Hits' ? (
                                        <div className="h-2 w-16 mx-auto rounded-full bg-blue-500"></div>
                                      ) : (
                                        <div className={`h-2 w-16 mx-auto rounded-full ${verification.dnbEntityData.riskScorecard.riskScores.politicalAffiliationRisk?.level === 'L' ? 'bg-green-600' :
                                            verification.dnbEntityData.riskScorecard.riskScores.politicalAffiliationRisk?.level === 'M' ? 'bg-yellow-500' :
                                              'bg-red-600'
                                          }`}></div>
                                      )}
                                    </td>
                                  </tr>

                                  {/* Adverse Media */}
                                  <tr className="hover:bg-gray-50">
                                    <td className="border border-gray-200 px-4 py-3 text-sm font-medium text-gray-900">Adverse Media</td>
                                    <td className="border border-gray-200 px-4 py-3 text-center text-sm font-bold text-gray-900">
                                      {verification.dnbEntityData.riskScorecard.riskScores.adverseMediaRisk?.reason === 'No Hits' ? '—' :
                                        verification.dnbEntityData.riskScorecard.riskScores.adverseMediaRisk?.rating || '—'}
                                    </td>
                                    <td className="border border-gray-200 px-4 py-3 text-center">
                                      {verification.dnbEntityData.riskScorecard.riskScores.adverseMediaRisk?.reason === 'No Hits' ? (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-600">
                                          No Hits
                                        </span>
                                      ) : (
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${verification.dnbEntityData.riskScorecard.riskScores.adverseMediaRisk?.level === 'L' ? 'bg-green-100 text-green-800' :
                                            verification.dnbEntityData.riskScorecard.riskScores.adverseMediaRisk?.level === 'M' ? 'bg-yellow-100 text-yellow-800' :
                                              'bg-red-100 text-red-800'
                                          }`}>
                                          {verification.dnbEntityData.riskScorecard.riskScores.adverseMediaRisk?.level || '—'}
                                        </span>
                                      )}
                                    </td>
                                    <td className="border border-gray-200 px-4 py-3 text-center">
                                      {verification.dnbEntityData.riskScorecard.riskScores.adverseMediaRisk?.reason === 'No Hits' ? (
                                        <div className="h-2 w-16 mx-auto rounded-full bg-blue-500"></div>
                                      ) : (
                                        <div className={`h-2 w-16 mx-auto rounded-full ${verification.dnbEntityData.riskScorecard.riskScores.adverseMediaRisk?.level === 'L' ? 'bg-green-600' :
                                            verification.dnbEntityData.riskScorecard.riskScores.adverseMediaRisk?.level === 'M' ? 'bg-yellow-500' :
                                              'bg-red-600'
                                          }`}></div>
                                      )}
                                    </td>
                                  </tr>

                                  {/* Final Risk */}
                                  <tr className="hover:bg-gray-50 bg-blue-50">
                                    <td className="border-gray-200 px-4 py-3 text-sm font-bold text-blue-900 flex items-center gap-2">
                                      Final Risk
                                      <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                      </svg>
                                    </td>
                                    <td className="border border-gray-200 px-4 py-3 text-center text-sm font-bold text-blue-900">
                                      {verification.dnbEntityData.riskScorecard.riskScores.overriddenRisk?.rating || '—'}
                                    </td>
                                    <td className="border border-gray-200 px-4 py-3 text-center">
                                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${verification.dnbEntityData.riskScorecard.riskScores.overriddenRisk?.level === 'L' ? 'bg-green-100 text-green-800' :
                                        verification.dnbEntityData.riskScorecard.riskScores.overriddenRisk?.level === 'M' ? 'bg-yellow-100 text-yellow-800' :
                                          'bg-red-100 text-red-800'
                                        }`}>
                                        {verification.dnbEntityData.riskScorecard.riskScores.overriddenRisk?.level || '—'}
                                      </span>
                                    </td>
                                    <td className="border border-gray-200 px-4 py-3 text-center">
                                      <div className={`h-2 w-16 mx-auto rounded-full ${verification.dnbEntityData.riskScorecard.riskScores.overriddenRisk?.level === 'L' ? 'bg-green-600' :
                                        verification.dnbEntityData.riskScorecard.riskScores.overriddenRisk?.level === 'M' ? 'bg-yellow-500' :
                                          'bg-red-600'
                                        }`}></div>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}

                        {/* Business Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Company Details */}
                          <div className="space-y-3">
                            <h4 className="font-semibold text-gray-900">Company Details</h4>
                            <div className="space-y-2 p-3 bg-white border rounded-lg">
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Entity State:</span>
                                <span className="text-sm font-medium">{verification.entityState || 'N/A'}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Data Package:</span>
                                <span className="text-sm font-medium">{verification.dataPackage || 'N/A'}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Industry:</span>
                                <span className="text-sm font-medium">{verification.businessDetails?.industry || 'N/A'}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Operating Status:</span>
                                <span className="text-sm font-medium">{verification.businessDetails?.operatingStatus || 'N/A'}</span>
                              </div>
                            </div>
                          </div>

                          {/* Address Information */}
                          {verification.address && (
                            <div className="space-y-3">
                              <h4 className="font-semibold text-gray-900">Address Information</h4>
                              <div className="space-y-2 p-3 bg-white border rounded-lg">
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600">Street:</span>
                                  <span className="text-sm font-medium">{verification.address.street || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600">City:</span>
                                  <span className="text-sm font-medium">{verification.address.city || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600">State:</span>
                                  <span className="text-sm font-medium">{verification.address.state || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600">ZIP:</span>
                                  <span className="text-sm font-medium">{verification.address.zip || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600">Country:</span>
                                  <span className="text-sm font-medium">{verification.address.country || 'N/A'}</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Additional Business Information */}
                        {verification.additionalInfo && (
                          <div className="space-y-3">
                            <h4 className="font-semibold text-gray-900">Additional Business Information</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 bg-white border rounded-lg">
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600">Website:</span>
                                  <span className="text-sm font-medium">
                                    {verification.additionalInfo.website ? (
                                      <a href={`https://${verification.additionalInfo.website}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline">
                                        {verification.additionalInfo.website}
                                      </a>
                                    ) : 'N/A'}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600">Phone:</span>
                                  <span className="text-sm font-medium">{verification.additionalInfo.phone || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600">Currency:</span>
                                  <span className="text-sm font-medium">{verification.additionalInfo.currency || 'N/A'}</span>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600">SIC Code:</span>
                                  <span className="text-sm font-medium">{verification.additionalInfo.sicCode || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600">NAICS Code:</span>
                                  <span className="text-sm font-medium">{verification.additionalInfo.naicsCode || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600">UNSPSC Code:</span>
                                  <span className="text-sm font-medium">{verification.additionalInfo.unspscCode || 'N/A'}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No verification history found</p>
                  <p className="text-sm">Start by submitting a verification request</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Team Member Invitation - Only show after KYB approval */}
      {currentStatus === 'approved' && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-green-600" />
              <CardTitle className="text-lg text-green-800">Ready to Build Your Team?</CardTitle>
            </div>
            <CardDescription className="text-green-700">
              Now that your business is verified, you can manage your team members in the User Management section above
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-white border border-green-200 rounded-md">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="text-sm text-green-800">
                  <p className="font-medium mb-1">Team members can:</p>
                  <ul className="space-y-1 text-xs text-green-700">
                    <li>• Access Gas Trace tool and search for companies</li>
                    <li>• View available data and pricing information</li>
                    <li>• Complete their profile setup</li>
                    <li>• Help manage your GreenTruth account</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleNavigateToTeamManagement}
                className="bg-green-600 hover:bg-green-700 text-white flex-1"
              >
                <Users className="mr-2 h-4 w-4" />
                Go to Team Management
              </Button>
              <Button
                variant="outline"
                className="border-green-300 text-green-700 hover:bg-green-100 flex-1"
              >
                Learn More
              </Button>
            </div>

            <div className="text-xs text-green-600 text-center">
              You can add up to 5 team members with your current plan
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default KycOverview;
