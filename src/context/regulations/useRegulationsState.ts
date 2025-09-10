
import { useState, useEffect } from 'react';
import { RegulationsState } from './types';
import { searchRegulations, RegulationsDocument } from '@/services/regulationsGovApi';
import { shouldSync } from './utils/syncUtils';
import { getKeywordsFromProductPolicies } from './utils/policyUtils';
import { useToast } from '@/hooks/use-toast';

export const useRegulationsState = () => {
  const { toast } = useToast();
  const [state, setState] = useState<RegulationsState>({
    documents: [],
    loading: false,
    lastSync: localStorage.getItem('regulationsLastSync'),
    error: null,
    syncFrequency: (localStorage.getItem('regulationsSyncFrequency') as 'daily' | 'weekly' | 'monthly') || 'weekly',
    syncInProgress: false,
  });

  useEffect(() => {
    const savedDocuments = localStorage.getItem('regulationsDocuments');
    if (savedDocuments) {
      try {
        setState(prev => ({
          ...prev,
          documents: JSON.parse(savedDocuments),
        }));
      } catch (error) {
        console.error('Error parsing saved regulations data:', error);
      }
    }
  }, []);

  const syncRegulations = async (forceSync: boolean = false): Promise<void> => {
    if (state.syncInProgress) return;
    
    if (!forceSync && !shouldSync(state.lastSync, state.syncFrequency)) return;
    
    setState(prev => ({ ...prev, syncInProgress: true, loading: true }));
    
    try {
      const keywords = getKeywordsFromProductPolicies();
      
      const searchTerm = keywords.length > 0 
        ? keywords.join(' OR ') 
        : 'energy natural gas methane emissions compliance';
      
      const response = await searchRegulations({
        searchTerm,
        pageSize: 50,
        documentType: 'Notice,Rule',
      });
      
      setState(prev => ({
        ...prev,
        documents: response.data,
        lastSync: new Date().toISOString(),
        loading: false,
        error: null,
        syncInProgress: false,
      }));
      
      localStorage.setItem('regulationsDocuments', JSON.stringify(response.data));
      localStorage.setItem('regulationsLastSync', new Date().toISOString());
      
      toast({
        title: "Regulations updated",
        description: `Successfully synced ${response.data.length} regulatory documents`,
      });
      
    } catch (error) {
      console.error('Error syncing regulations:', error);
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error syncing regulations',
        syncInProgress: false,
      }));
      
      toast({
        title: "Sync failed",
        description: "Failed to sync regulations data. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const setSyncFrequency = (frequency: 'daily' | 'weekly' | 'monthly'): void => {
    setState(prev => ({ ...prev, syncFrequency: frequency }));
    localStorage.setItem('regulationsSyncFrequency', frequency);
  };

  const getRelevantDocuments = (product: string): RegulationsDocument[] => {
    if (!product) return [];
    
    return state.documents.filter(doc => 
      doc.attributes.documentType === 'Rule' &&
      (doc.attributes.title.toLowerCase().includes(product.toLowerCase()) ||
       (doc.attributes.summary && doc.attributes.summary.toLowerCase().includes(product.toLowerCase())))
    );
  };

  useEffect(() => {
    if (shouldSync(state.lastSync, state.syncFrequency)) {
      syncRegulations();
    }
  }, []);

  return {
    ...state,
    setSyncFrequency,
    syncRegulations,
    getRelevantDocuments,
  };
};
