import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Check, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface AvailablePlansProps {
  currentPlan: string;
  setCurrentPlan: (plan: string) => void;
  onCheckout?: () => Promise<void>;
  isProcessing?: boolean;
}

const AvailablePlans: React.FC<AvailablePlansProps> = ({ 
  currentPlan, 
  setCurrentPlan, 
  onCheckout,
  isProcessing = false
}) => {
  // Simulated plan data
  const plans = [
    { 
      id: 'basic', 
      name: 'Basic', 
      price: '$0', 
      period: 'month',
      features: [
        '1 user seat',
        '5 prompts per day',
        '2 documents per prompt',
        'No Integration Hub access',
        'No Procurement module',
        'Purchase leads at $100 each'
      ],
      limitations: [
        'Limited daily usage',
        'No word count allocation'
      ]
    },
    { 
      id: 'pro', 
      name: 'Pro', 
      price: '$175', 
      period: 'month',
      features: [
        '1 user seat',
        'Unlimited prompts per day',
        'Up to 5 documents per prompt',
        'No Integration Hub access',
        'Optional Procurement module (+$500/month)',
        '750,000 words read/written per month',
        'Purchase leads at $100 each'
      ],
      limitations: [
        'Single user only',
        'No access to Integration Hub',
        'Overage: $15/$100 per 750K words'
      ]
    },
    { 
      id: 'team', 
      name: 'Team', 
      price: '$750', 
      period: 'month',
      features: [
        'Up to 5 user seats',
        'Unlimited prompts per day',
        'Up to 5 documents per prompt',
        'Optional Integration Hub Access (+$150/month)',
        'Optional Procurement module (+$500/month)',
        '750,000 words read/written per month',
        'Purchase leads at $100 each'
      ],
      limitations: [
        'Limited to 5 team members',
        'Overage: $15/$100 per 750K words'
      ]
    },
    { 
      id: 'business', 
      name: 'Business', 
      price: '$1,800', 
      period: 'month',
      features: [
        'Up to 15 user seats',
        'Unlimited prompts per day',
        'Up to 10 documents per prompt',
        'Integration Hub Access included',
        'Optional Procurement module (+$500/month)',
        '750,000 words read/written per month',
        'Purchase leads at $100 each'
      ],
      limitations: [
        'Limited to 15 team members',
        'Overage: $15/$100 per 750K words'
      ]
    },
    { 
      id: 'enterprise', 
      name: 'Enterprise', 
      price: 'Custom', 
      period: 'Contact Sales',
      features: [
        'Customizable seats (15+)',
        'Unlimited prompts per day',
        'Up to 10 documents per prompt',
        'Integration Hub Access included',
        'Procurement module included',
        '750,000 words read/written per month',
        'Custom lead pricing available'
      ],
      limitations: []
    }
  ];

  const handleUpgrade = (planId: string) => {
    // In a real app, this would connect to your Stripe checkout flow
    if (onCheckout) {
      onCheckout();
    } else {
      toast.success(`Starting upgrade process to ${planId} plan...`);
    }
    // This would typically redirect to a Stripe checkout page or open a modal
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Available Plans</CardTitle>
        <CardDescription>
          Choose the plan that best fits your organization's needs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup 
          value={currentPlan} 
          onValueChange={setCurrentPlan}
          className="grid gap-6 md:grid-cols-3"
        >
          {plans.map((plan) => (
            <div 
              key={plan.id}
              className={`relative flex flex-col rounded-lg border p-5 ${
                currentPlan === plan.id ? 'border-primary bg-primary/5' : ''
              }`}
            >
              <RadioGroupItem 
                value={plan.id} 
                id={plan.id}
                className="absolute right-4 top-4"
              />
              <div className="mb-4">
                <h3 className="font-semibold text-lg">{plan.name}</h3>
                <p className="text-2xl font-bold">
                  {plan.price}
                  {plan.id !== 'enterprise' && <span className="text-sm font-normal text-muted-foreground">/{plan.period}</span>}
                </p>
              </div>
              <Separator className="my-2" />
              <ul className="mt-2 space-y-2 flex-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              {plan.limitations.length > 0 && (
                <>
                  <Separator className="my-2" />
                  <div className="mt-2">
                    <p className="text-sm font-medium text-muted-foreground mb-1">Limitations:</p>
                    <ul className="space-y-1">
                      {plan.limitations.map((limitation, i) => (
                        <li key={i} className="text-xs text-muted-foreground flex items-start">
                          <span className="mr-1">•</span>
                          <span>{limitation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
              {currentPlan !== plan.id && (
                <Button 
                  onClick={() => handleUpgrade(plan.id)} 
                  className="mt-4"
                  variant={plan.id === 'enterprise' ? 'default' : 'outline'}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    plan.id === 'enterprise' ? 'Contact Sales' : 
                    plan.price === '$0' ? 'Downgrade' : 
                    currentPlan === 'basic' ? 'Upgrade' : 
                    parseInt((plans.find(p => p.id === currentPlan)?.price || '$0').replace('$', '')) < parseInt(plan.price.replace('$', '')) ? 'Upgrade' : 'Downgrade'
                  )}
                </Button>
              )}
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export default AvailablePlans;
