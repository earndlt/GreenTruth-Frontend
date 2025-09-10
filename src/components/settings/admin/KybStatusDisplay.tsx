import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle, AlertTriangle, XCircle, Loader2, Info, Play, Users, ArrowRight } from 'lucide-react';
import { KYBStatus } from '@/types/kyb';

interface KybStatusDisplayProps {
  status: KYBStatus;
  message: string;
  lastUpdated: string | null;
  estimatedCompletionTime: string | null;
  verificationId: string | null;
  onCheckStatus: () => void;
  onReset: () => void;
  onTestUpdate?: () => void;
  showTestButton?: boolean;
  onNavigateToTeamManagement?: () => void;
}

const KybStatusDisplay: React.FC<KybStatusDisplayProps> = ({
  status,
  message,
  lastUpdated,
  estimatedCompletionTime,
  verificationId,
  onCheckStatus,
  onReset,
  onTestUpdate,
  showTestButton = false,
  onNavigateToTeamManagement,
}) => {
  const getStatusConfig = (status: KYBStatus) => {
    switch (status) {
      case 'pending':
        return {
          icon: Clock,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          badgeVariant: 'secondary' as const,
        };
      case 'in_process':
        return {
          icon: Loader2,
          color: 'text-amber-600',
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-200',
          badgeVariant: 'default' as const,
        };
      case 'approved':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          badgeVariant: 'default' as const,
        };
      case 'rejected':
        return {
          icon: XCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          badgeVariant: 'destructive' as const,
        };
      case 'expired':
        return {
          icon: AlertTriangle,
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          badgeVariant: 'secondary' as const,
        };
      case 'requires_action':
        return {
          icon: Info,
          color: 'text-purple-600',
          bgColor: 'bg-purple-50',
          borderColor: 'border-purple-200',
          badgeVariant: 'secondary' as const,
        };
      default:
        return {
          icon: Info,
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          badgeVariant: 'secondary' as const,
        };
    }
  };

  const getStatusMessage = (status: KYBStatus) => {
    switch (status) {
      case 'pending':
        return 'Verification request submitted and pending review';
      case 'in_process':
        return 'Verification is being processed by Dun & Bradstreet';
      case 'approved':
        return 'Business verification completed successfully';
      case 'rejected':
        return 'Verification was not successful';
      case 'expired':
        return 'Verification has expired and needs to be renewed';
      case 'requires_action':
        return 'Additional information is required to complete verification';
      default:
        return 'Verification status unknown';
    }
  };

  const getStatusBadgeText = (status: KYBStatus) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'in_process':
        return 'In Process';
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      case 'expired':
        return 'Expired';
      case 'requires_action':
        return 'Action Required';
      default:
        return 'Unknown';
    }
  };

  const config = getStatusConfig(status);
  const IconComponent = config.icon;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getEstimatedTimeMessage = () => {
    if (!estimatedCompletionTime) return null;
    
    const estimated = new Date(estimatedCompletionTime);
    const now = new Date();
    const diffHours = Math.ceil((estimated.getTime() - now.getTime()) / (1000 * 60 * 60));
    
    if (diffHours <= 0) {
      return 'Verification should complete soon';
    } else if (diffHours === 1) {
      return 'Verification should complete within 1 hour';
    } else {
      return `Verification should complete within ${diffHours} hours`;
    }
  };

  return (
    <Card className={`${config.bgColor} ${config.borderColor} border`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <IconComponent className={`h-5 w-5 ${config.color}`} />
            <CardTitle className="text-lg">Verification Status</CardTitle>
          </div>
          <Badge variant={config.badgeVariant}>
            {getStatusBadgeText(status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium text-gray-900 mb-1">
            {getStatusMessage(status)}
          </p>
          {message && (
            <p className="text-sm text-gray-600">{message}</p>
          )}
        </div>

        {verificationId && (
          <div className="text-xs text-gray-500">
            <span className="font-medium">Verification ID:</span> {verificationId}
          </div>
        )}

        {lastUpdated && (
          <div className="text-xs text-gray-500">
            <span className="font-medium">Last Updated:</span> {formatDate(lastUpdated)}
          </div>
        )}

        {status === 'in_process' && (
          <div className="p-3 bg-amber-100 border border-amber-200 rounded-md">
            <div className="flex items-start space-x-2">
              <Clock className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-amber-800 mb-1">
                  KYB verification typically takes 1-2 days (up to 48 hours)
                </p>
                <p className="text-amber-700 text-xs">
                  Dun & Bradstreet is currently reviewing your business information. 
                  You'll receive an email notification when the verification is complete.
                </p>
                {getEstimatedTimeMessage() && (
                  <p className="text-amber-700 text-xs mt-1">
                    {getEstimatedTimeMessage()}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {status === 'approved' && (
          <div className="p-3 bg-green-100 border border-green-200 rounded-md">
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-green-800 mb-1">
                  Business verification completed successfully!
                </p>
                <p className="text-green-700 text-xs">
                  You can now add payment methods and perform transactions. 
                  Your business profile has been verified and is ready for use.
                </p>
              </div>
            </div>
          </div>
        )}

        {status === 'rejected' && (
          <div className="p-3 bg-red-100 border border-red-200 rounded-md">
            <div className="flex items-start space-x-2">
              <XCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-red-800 mb-1">
                  Verification was not successful
                </p>
                <p className="text-red-700 text-xs">
                  Please review the information provided and try again. 
                  If the issue persists, contact support for assistance.
                </p>
              </div>
            </div>
          </div>
        )}

        {status === 'approved' && onNavigateToTeamManagement && (
          <div className="p-3 bg-blue-100 border border-blue-200 rounded-md">
            <div className="flex items-start space-x-2">
              <Users className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-blue-800 mb-1">
                  Ready to add team members?
                </p>
                <p className="text-blue-700 text-xs">
                  Invite your team members to join your GreenTruth account.
                  Click the button below to manage your team.
                </p>
              </div>
            </div>
            <div className="flex justify-end mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={onNavigateToTeamManagement}
                className="text-xs bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
              >
                <ArrowRight className="mr-2 h-3 w-3" />
                Manage Team
              </Button>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2 pt-2">
          {status === 'in_process' && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={onCheckStatus}
                className="text-xs"
              >
                <Loader2 className="mr-2 h-3 w-3" />
                Check Status Now
              </Button>
              
              {showTestButton && onTestUpdate && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onTestUpdate}
                  className="text-xs bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                >
                  <Play className="mr-2 h-3 w-3" />
                  Test Update
                </Button>
              )}
            </>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            className="text-xs"
          >
            Reset Verification
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default KybStatusDisplay; 