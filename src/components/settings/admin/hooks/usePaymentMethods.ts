
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { corporateWallets } from '@/data/corporateWallets';

export interface PaymentMethod {
  id: string;
  type: 'ach' | 'creditCard';
  isPrimary: boolean;
  isPlaidVerified?: boolean;
  institutionId?: string;
  institutionName?: string;
  // ACH/Wire specific
  bankName?: string;
  accountName?: string;
  routingNumber?: string;
  accountLast4?: string;
  // Credit card specific
  cardLast4?: string;
  expiryDate?: string;
  nameOnCard?: string;
}

export interface CorporateEntity {
  id: string;
  name: string;
  division?: string;
  paymentMethods: PaymentMethod[];
}

export function usePaymentMethods() {
  const { toast } = useToast();
  const [isVerifying, setIsVerifying] = useState(false);
  const [showVerificationSuccess, setShowVerificationSuccess] = useState(false);
  const [selectedEntityId, setSelectedEntityId] = useState(corporateWallets[0].id);
  const [currentMethodType, setCurrentMethodType] = useState<'ach' | 'creditCard'>('ach');
  
  // Form states for ACH/Wire
  const [bankName, setBankName] = useState('');
  const [accountName, setAccountName] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  
  // Form states for Credit Card
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [nameOnCard, setNameOnCard] = useState('');
  
  // Plaid states
  const [plaidLinkToken, setPlaidLinkToken] = useState<string | null>(null);
  const [isPlaidLoading, setIsPlaidLoading] = useState(false);
  const [plaidAccountData, setPlaidAccountData] = useState<any>(null);
  
  // Corporate entities with payment methods
  const [corporateEntities, setCorporateEntities] = useState<CorporateEntity[]>(() => {
    // Initialize with corporate wallets data and empty payment methods
    return corporateWallets.map(wallet => ({
      id: wallet.id,
      name: wallet.name,
      division: wallet.id.includes('permian') ? 'Permian Operations' : 
               wallet.id.includes('usa') ? 'US Operations' : 
               wallet.id.includes('energy') ? 'Energy Trading' : 
               'Corporate',
      paymentMethods: []
    }));
  });
  
  // Current entity
  const currentEntity = corporateEntities.find(entity => entity.id === selectedEntityId) || corporateEntities[0];
  
  // Effect to fetch Plaid link token when entity changes
  useEffect(() => {
    const fetchPlaidLinkToken = async () => {
      try {
        setIsPlaidLoading(true);
        // In a real implementation, you would fetch the link token from your backend
        // For this example, we'll simulate a successful response after a delay
        setTimeout(() => {
          // This would be the link token from your server
          setPlaidLinkToken('link-sandbox-12345-abcdef');
          setIsPlaidLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching Plaid link token:', error);
        setPlaidLinkToken(null);
        setIsPlaidLoading(false);
        
        toast({
          title: "Error",
          description: "Failed to initialize Plaid. Please try again or use manual entry.",
          variant: "destructive"
        });
      }
    };
    
    fetchPlaidLinkToken();
  }, [selectedEntityId, toast]);
  
  const resetForms = () => {
    // Reset ACH form
    setBankName('');
    setAccountName('');
    setRoutingNumber('');
    setAccountNumber('');
    
    // Reset Credit Card form
    setCardNumber('');
    setExpiryDate('');
    setCvv('');
    setNameOnCard('');
    
    // Reset Plaid data
    setPlaidAccountData(null);
  };
  
  const handleChangeEntity = (entityId: string) => {
    setSelectedEntityId(entityId);
    setShowVerificationSuccess(false);
    resetForms();
  };
  
  // Handle Plaid success
  const handlePlaidSuccess = useCallback((publicToken: string, metadata: any) => {
    setIsPlaidLoading(true);
    
    // In a real implementation, you would exchange the public token for an access token
    // and retrieve account information from your backend
    console.log('Public token:', publicToken);
    console.log('Metadata:', metadata);
    
    // Simulate API call to exchange token and get account info
    setTimeout(() => {
      const accountData = {
        institutionId: metadata.institution.institution_id,
        institutionName: metadata.institution.name,
        accountId: metadata.account.id,
        accountName: metadata.account.name,
        accountLast4: metadata.account.mask,
      };
      
      setPlaidAccountData(accountData);
      
      // Auto-fill form fields with Plaid data
      setBankName(accountData.institutionName);
      setAccountName(accountData.accountName);
      setAccountNumber(accountData.accountLast4);
      
      setIsPlaidLoading(false);
      
      toast({
        title: "Bank Account Connected",
        description: `Successfully connected to ${accountData.institutionName}.`,
      });
    }, 1500);
  }, [toast]);
  
  // Handle Plaid exit
  const handlePlaidExit = useCallback(() => {
    console.log('Plaid Link exited');
  }, []);
  
  const handleAddPaymentMethod = () => {
    setIsVerifying(true);
    
    // If we have Plaid data, use it
    if (currentMethodType === 'ach' && plaidAccountData) {
      // In a real implementation, you would verify the account with your payment processor
      setTimeout(() => {
        setCorporateEntities(prevEntities => {
          return prevEntities.map(entity => {
            if (entity.id === selectedEntityId) {
              const isFirstMethod = entity.paymentMethods.length === 0;
              
              const newMethod: PaymentMethod = {
                id: `ach-${Date.now()}`,
                type: 'ach',
                isPrimary: isFirstMethod,
                isPlaidVerified: true,
                institutionId: plaidAccountData.institutionId,
                institutionName: plaidAccountData.institutionName,
                bankName: plaidAccountData.institutionName,
                accountName: plaidAccountData.accountName,
                accountLast4: plaidAccountData.accountLast4
              };
              
              return {
                ...entity,
                paymentMethods: [...entity.paymentMethods, newMethod]
              };
            }
            return entity;
          });
        });
        
        setIsVerifying(false);
        setShowVerificationSuccess(true);
        
        toast({
          title: "Bank Account Added",
          description: `Your bank account from ${plaidAccountData.institutionName} has been successfully added and verified.`,
        });
        
        resetForms();
      }, 1500);
      return;
    }
    
    // Basic validation for manual entry
    if (currentMethodType === 'ach') {
      if (!bankName || !accountName || !routingNumber || !accountNumber) {
        toast({
          title: "Missing Information",
          description: "Please fill in all bank account fields",
          variant: "destructive"
        });
        setIsVerifying(false);
        return;
      }
    } else {
      if (!cardNumber || !expiryDate || !cvv || !nameOnCard) {
        toast({
          title: "Missing Information",
          description: "Please fill in all credit card fields",
          variant: "destructive"
        });
        setIsVerifying(false);
        return;
      }
    }
    
    // Simulate verification process
    setTimeout(() => {
      setCorporateEntities(prevEntities => {
        return prevEntities.map(entity => {
          if (entity.id === selectedEntityId) {
            const isFirstMethod = entity.paymentMethods.length === 0;
            
            let newMethod: PaymentMethod;
            if (currentMethodType === 'ach') {
              newMethod = {
                id: `ach-${Date.now()}`,
                type: 'ach',
                isPrimary: isFirstMethod,
                bankName,
                accountName,
                routingNumber,
                accountLast4: accountNumber.slice(-4)
              };
            } else {
              newMethod = {
                id: `cc-${Date.now()}`,
                type: 'creditCard',
                isPrimary: isFirstMethod,
                cardLast4: cardNumber.slice(-4),
                expiryDate,
                nameOnCard
              };
            }
            
            return {
              ...entity,
              paymentMethods: [...entity.paymentMethods, newMethod]
            };
          }
          return entity;
        });
      });
      
      setIsVerifying(false);
      setShowVerificationSuccess(true);
      
      toast({
        title: currentMethodType === 'ach' ? "Bank Account Added" : "Credit Card Added",
        description: `Your payment method has been successfully added to ${currentEntity.name}.`,
      });
      
      resetForms();
    }, 1500);
  };
  
  const handleSetPrimary = (methodId: string) => {
    setCorporateEntities(prevEntities => {
      return prevEntities.map(entity => {
        if (entity.id === selectedEntityId) {
          return {
            ...entity,
            paymentMethods: entity.paymentMethods.map(method => ({
              ...method,
              isPrimary: method.id === methodId
            }))
          };
        }
        return entity;
      });
    });
    
    toast({
      title: "Primary Method Updated",
      description: "Your primary payment method has been updated."
    });
  };
  
  const handleDeleteMethod = (methodId: string) => {
    setCorporateEntities(prevEntities => {
      return prevEntities.map(entity => {
        if (entity.id === selectedEntityId) {
          const updatedMethods = entity.paymentMethods.filter(method => method.id !== methodId);
          
          // If we just deleted the primary method and there are other methods, make the first one primary
          if (updatedMethods.length > 0 && !updatedMethods.some(m => m.isPrimary)) {
            updatedMethods[0].isPrimary = true;
          }
          
          return {
            ...entity,
            paymentMethods: updatedMethods
          };
        }
        return entity;
      });
    });
    
    toast({
      title: "Payment Method Removed",
      description: "The payment method has been removed successfully."
    });
  };

  return {
    isVerifying,
    showVerificationSuccess,
    setShowVerificationSuccess,
    selectedEntityId,
    currentMethodType,
    setCurrentMethodType,
    bankName,
    setBankName,
    accountName,
    setAccountName,
    routingNumber,
    setRoutingNumber,
    accountNumber,
    setAccountNumber,
    cardNumber,
    setCardNumber,
    expiryDate,
    setExpiryDate,
    cvv,
    setCvv,
    nameOnCard,
    setNameOnCard,
    corporateEntities,
    currentEntity,
    handleChangeEntity,
    handleAddPaymentMethod,
    handleSetPrimary,
    handleDeleteMethod,
    // Plaid related properties and methods
    plaidLinkToken,
    handlePlaidSuccess,
    handlePlaidExit,
    isPlaidLoading
  };
}
