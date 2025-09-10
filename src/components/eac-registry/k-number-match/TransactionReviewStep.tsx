
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Info, CreditCard, Landmark, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Company } from '../CompanySelector';
import { KNumberMatchFormValues, TransactionDetails } from './schema';
import DeliveryScheduleVisual from './DeliveryScheduleVisual';
import { getReceiptLocationNameById } from './utils/receiptLocations';
import { calculateTotalPriceForPoints } from './utils/emissions/factorCalculator';

interface TransactionReviewStepProps {
  form: UseFormReturn<KNumberMatchFormValues>;
  transactionDetails: TransactionDetails;
  selectedCompany: Company;
  onPrevStep: () => void;
  onConfirm: () => void;
  isSubmitting: boolean;
  navigateToPaymentSettings: () => void;
}

const TransactionReviewStep: React.FC<TransactionReviewStepProps> = ({
  form,
  transactionDetails,
  selectedCompany,
  onPrevStep,
  onConfirm,
  isSubmitting,
  navigateToPaymentSettings,
}) => {
  const isForward = transactionDetails.transactionType === 'forward';
  const pipeline = form.watch('pipeline');
  const receiptLocationId = form.watch('receiptLocationId');

  // Calculate days in period
  let daysInPeriod = 1;
  if (transactionDetails.startDate && transactionDetails.endDate) {
    const start = new Date(transactionDetails.startDate);
    const end = new Date(transactionDetails.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    daysInPeriod = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Add 1 to include both start and end dates
  }

  // Get the receipt location name if available
  const receiptLocationName = receiptLocationId && pipeline === 'REX'
    ? getReceiptLocationNameById(receiptLocationId)
    : undefined;

  // Format the offtake point display to include receipt location if available
  const offtakePointDisplay = receiptLocationId && receiptLocationName
    ? `${transactionDetails.offtakePoint} (Rcpt LOC: ${receiptLocationId} - ${receiptLocationName})`
    : transactionDetails.offtakePoint;

  const primaryPaymentMethod = React.useMemo(() => {
    return selectedCompany.id.includes('energy')
      ? {
        type: 'credit-card',
        last4: '4242',
        expiry: '04/25',
        isPlaidVerified: false
      }
      : {
        type: 'ach',
        bankName: 'Chase',
        accountLast4: '6789',
        isPlaidVerified: true,
        institutionName: 'Chase Bank'
      };
  }, [selectedCompany]);

  // Calculate price per MMBtu based on the number of emission points ($0.05 per point)
  const emissionPoints = transactionDetails.segment.filter(s => s !== 'carbonNeutral');
  const pricePerMMBtu = calculateTotalPriceForPoints(emissionPoints);

  // Calculate daily volume (for display)
  const dailyVolume = parseInt(transactionDetails.quantity) / daysInPeriod;

  // Calculate total price from quantity and price per MMBtu
  const totalPrice = Number(transactionDetails.quantity) * pricePerMMBtu;

  // Calculate monthly payment for forward transactions
  const monthlyPayment = isForward ? (totalPrice / (transactionDetails.endDate && transactionDetails.startDate ?
    Math.ceil((new Date(transactionDetails.endDate).getTime() - new Date(transactionDetails.startDate).getTime()) / (30 * 24 * 60 * 60 * 1000)) : 1)) : totalPrice;

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-1.5 text-center sm:text-left">
        <h3 className="text-lg font-semibold leading-none tracking-tight">Review Transaction</h3>
        <p className="text-sm text-muted-foreground">
          Please review your transaction details before submitting to EarnDLT
        </p>
      </div>

      <ScrollArea className="max-h-[600px] pr-4">
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-2 border-b pb-3">
            <p className="font-medium">Transaction Type:</p>
            <p>{isForward ? 'Forward (Scheduled)' : 'Spot (One-time)'}</p>

            {isForward && (
              <>
                <p className="font-medium">Schedule Period:</p>
                <p>{transactionDetails.startDate} to {transactionDetails.endDate}</p>

                <p className="font-medium">Delivery Frequency:</p>
                <p>Monthly</p>

                {transactionDetails.dailyVolume && (
                  <>
                    <p className="font-medium">Daily Volume:</p>
                    <p>{parseInt(transactionDetails.dailyVolume).toLocaleString()} MMBtu/day</p>
                  </>
                )}
              </>
            )}

            <p className="font-medium">Days in Period:</p>
            <p>{daysInPeriod} days</p>

            <p className="font-medium">Daily Volume:</p>
            <p>{Math.round(dailyVolume).toLocaleString()} MMBtu/day</p>

            <p className="font-medium">Total Quantity:</p>
            <p>{parseInt(transactionDetails.quantity).toLocaleString()} MMBtu</p>

            <p className="font-medium">Price per MMBtu:</p>
            <p>${pricePerMMBtu.toFixed(2)} <span className="text-xs text-muted-foreground">($0.05 per emission point)</span></p>

            <p className="font-medium">Total Price:</p>
            <p>${totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>

            <p className="font-medium">Segment:</p>
            <p className="capitalize">{transactionDetails.segment.join(', ')}</p>

            <p className="font-medium">Offtake Point:</p>
            <p>{offtakePointDisplay}</p>

            {pipeline === 'REX' && receiptLocationId && (
              <>
                <p className="font-medium">Pipeline:</p>
                <p>{pipeline}</p>
              </>
            )}
          </div>

          <div className="border-b pb-3">
            <p className="font-medium mb-2">Corporate Entity:</p>
            <div className="bg-gray-50 p-2 rounded">
              <p>{selectedCompany.name}</p>
              {selectedCompany.division && (
                <p className="text-sm text-gray-500">{selectedCompany.division}</p>
              )}
              <p className="text-sm text-gray-500">Wallet ID: {selectedCompany.walletId}</p>
            </div>
          </div>

          <div className="border-b pb-3">
            <p className="font-medium mb-2">Payment Method:</p>
            <div className="bg-gray-50 p-2 rounded flex items-start">
              {primaryPaymentMethod.type === 'credit-card' ? (
                <CreditCard className="h-5 w-5 mr-2 mt-0.5 text-gray-500" />
              ) : (
                <Landmark className="h-5 w-5 mr-2 mt-0.5 text-gray-500" />
              )}
              <div className="flex-1">
                {primaryPaymentMethod.type === 'credit-card' ? (
                  <p>Credit Card •••• {primaryPaymentMethod.last4}</p>
                ) : primaryPaymentMethod.isPlaidVerified ? (
                  <div className="flex items-center">
                    <p>{primaryPaymentMethod.institutionName} •••• {primaryPaymentMethod.accountLast4}</p>
                    <span className="ml-2 inline-flex items-center text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Plaid Verified
                    </span>
                  </div>
                ) : (
                  <p>ACH/Wire Transfer ({primaryPaymentMethod.bankName})</p>
                )}
                <p className="text-sm text-gray-500">
                  Primary payment method from Transaction Payments
                  <Button
                    variant="link"
                    className="p-0 h-auto text-primary"
                    onClick={navigateToPaymentSettings}
                  >
                    Edit
                  </Button>
                </p>
              </div>
            </div>
          </div>

          <div>
            <p className="font-medium mb-2">Source Information:</p>
            <p className="mb-4">GreenTruth will match you with appropriate geolocated and temporally matched EACs.</p>

            {isForward && transactionDetails.startDate && transactionDetails.endDate && (
              <>
                <Alert className="bg-blue-50 border-blue-200">
                  <Info className="h-4 w-4 text-blue-500" />
                  <AlertDescription className="text-blue-700 text-sm">
                    Gas will flow continuously from {transactionDetails.startDate} to {transactionDetails.endDate}.
                  </AlertDescription>
                </Alert>

                <Alert className="bg-amber-50 border-amber-200 mt-4">
                  <CreditCard className="h-4 w-4 text-amber-500" />
                  <AlertDescription className="text-amber-700 text-sm font-medium">
                    EACs will be delivered monthly within 60 days of the physical molecules received.
                    You will receive a total of {Math.ceil((new Date(transactionDetails.endDate).getTime() - new Date(transactionDetails.startDate).getTime()) / (30 * 24 * 60 * 60 * 1000))} monthly deliveries over the contract period.
                  </AlertDescription>
                </Alert>

                <DeliveryScheduleVisual
                  startDate={transactionDetails.startDate}
                  endDate={transactionDetails.endDate}
                />
              </>
            )}
          </div>
        </div>
      </ScrollArea>

      <div className="flex justify-between w-full">
        <Button variant="outline" onClick={onPrevStep}>
          Previous Step
        </Button>
        <Button type="submit" /* onClick={onConfirm} */ disabled={isSubmitting}>
          {isSubmitting ? 'Processing...' : 'Confirm Transaction'}
        </Button>
      </div>
    </div>
  );
};

export default TransactionReviewStep;
