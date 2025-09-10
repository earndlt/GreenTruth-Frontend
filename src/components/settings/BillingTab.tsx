
import React, { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import CurrentSubscription from '@/components/settings/billing/CurrentSubscription';
import AvailablePlans from '@/components/settings/billing/AvailablePlans';
import PlanAddOns from '@/components/settings/billing/PlanAddOns';
import WordUsageCard from '@/components/settings/billing/WordUsageCard';
import BillingHistory from '@/components/settings/billing/BillingHistory';
import CancelSubscription from '@/components/settings/billing/CancelSubscription';
import { useToast } from '@/hooks/use-toast';

const BillingTab = () => {
  const { toast } = useToast();
  const [currentPlan, setCurrentPlan] = useState('basic');
  // Rename addApiAccess to addIntegrationHub for clarity
  const [addIntegrationHub, setAddIntegrationHub] = useState(false);
  const [addProcurement, setAddProcurement] = useState(false);
  
  const wordsReadLimit = 750000; 
  const wordsWrittenLimit = 750000;
  const [wordsReadUsage] = useState(wordsReadLimit * 2.3618);
  const [wordsWrittenUsage] = useState(300000);

  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const getPlanCost = () => {
    if (currentPlan === 'basic' || currentPlan === 'enterprise') return 'Custom';
    if (currentPlan === 'business') return '$1,800';
    const baseCost = currentPlan === 'pro' ? 175 : 750;
    let totalCost = baseCost;

    // Only Team, Business, Enterprise can have Integration Hub
    if (['team', 'business', 'enterprise'].includes(currentPlan)) {
      if (addIntegrationHub) totalCost += 150;
    }
    if (addProcurement) totalCost += 500;
    return `$${totalCost}`;
  };

  const handlePlanChange = (plan: string) => {
    setCurrentPlan(plan);

    if (plan === 'enterprise') {
      setAddIntegrationHub(true);
      setAddProcurement(true);
    } else if (plan === 'business') {
      setAddIntegrationHub(true);
      setAddProcurement(false);
    } else if (plan === 'basic' || plan === 'pro') {
      setAddIntegrationHub(false);
      setAddProcurement(false);
    }
    toast({
      title: "Plan selection updated",
      description: `You selected the ${plan.charAt(0).toUpperCase() + plan.slice(1)} plan.`,
    });
  };

  const handleCheckout = async () => {
    setIsProcessingPayment(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast({
        title: "Redirecting to checkout",
        description: "You'll be redirected to complete your payment.",
      });
    } catch (error) {
      toast({
        title: "Checkout error",
        description: "There was an issue starting the checkout process. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <ScrollArea className="h-[calc(100vh-12rem)] pr-4">
      <div className="space-y-8 pb-6">
        <CurrentSubscription 
          currentPlan={currentPlan}
          planCost={getPlanCost()}
        />

        <AvailablePlans 
          currentPlan={currentPlan}
          setCurrentPlan={handlePlanChange}
          onCheckout={handleCheckout}
          isProcessing={isProcessingPayment}
        />

        {currentPlan !== 'basic' && currentPlan !== 'enterprise' && (
          <PlanAddOns
            currentPlan={currentPlan}
            addApiAccess={addIntegrationHub}
            setAddApiAccess={setAddIntegrationHub}
            addProcurement={addProcurement}
            setAddProcurement={setAddProcurement}
          />
        )}

        {currentPlan !== 'basic' && (
          <WordUsageCard 
            wordsReadUsage={wordsReadUsage}
            wordsWrittenUsage={wordsWrittenUsage}
            wordsReadLimit={wordsReadLimit}
            wordsWrittenLimit={wordsWrittenLimit}
          />
        )}

        {currentPlan !== 'basic' && (
          <>
            <BillingHistory planCost={getPlanCost()} />
            <CancelSubscription />
          </>
        )}
      </div>
    </ScrollArea>
  );
};

export default BillingTab;

