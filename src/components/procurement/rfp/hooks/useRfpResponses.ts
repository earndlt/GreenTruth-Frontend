
import { useState } from 'react';
import { RfpResponse } from '../types/RfpResponseTypes';

// Sample RFP response data
const sampleResponses: RfpResponse[] = [
  {
    id: '1',
    vendorName: 'EcoEnergy Solutions',
    email: 'rfp-abc123@rfp.greentruth.com',
    contactEmail: 'info@ecoenergysolutions.com',
    receivedDate: '2023-12-05',
    status: 'graded',
    submittedDate: '2023-12-04',
    score: 92,
    rfpTitle: 'Renewable Energy Procurement',
    subject: 'Response to: Renewable Energy Procurement',
    category: 'Renewable Energy',
    llmScore: {
      overall: 92,
      procurement: 90,
      environmental: 95,
      esg: 91,
    }
  },
  {
    id: '2',
    vendorName: 'GreenPack Industries',
    email: 'rfp-def456@rfp.greentruth.com',
    contactEmail: 'contact@greenpackindustries.com',
    receivedDate: '2023-12-04',
    status: 'new',
    submittedDate: '2023-12-03',
    score: null,
    rfpTitle: 'Sustainable Packaging Materials',
    subject: 'Response to: Sustainable Packaging Materials',
    category: 'Packaging',
  },
  {
    id: '3',
    vendorName: 'SustainTech Materials',
    email: 'rfp-ghi789@rfp.greentruth.com',
    contactEmail: 'support@sustaintech.com',
    receivedDate: '2023-12-03',
    submittedDate: '2023-12-02',
    score: 79,
    status: 'reviewed',
    rfpTitle: 'Renewable Energy Procurement',
    subject: 'Response to: Renewable Energy Procurement',
    category: 'Energy',
    llmScore: {
      overall: 79,
      procurement: 75,
      environmental: 85,
      esg: 77,
    }
  },
  {
    id: '4',
    vendorName: 'CleanLogistics Inc.',
    email: 'rfp-jkl012@rfp.greentruth.com',
    contactEmail: 'info@cleanlogistics.com',
    receivedDate: '2023-12-01',
    submittedDate: '2023-11-30',
    score: 67,
    status: 'reviewed',
    rfpTitle: 'Sustainable Packaging Materials',
    subject: 'Response to: Sustainable Packaging Materials',
    category: 'Packaging',
    llmScore: {
      overall: 67,
      procurement: 70,
      environmental: 65,
      esg: 66,
    }
  },
];

export const useRfpResponses = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');
  const [responses, setResponses] = useState<RfpResponse[]>(sampleResponses);

  // Fix the type by using a properly typed status parameter
  const updateResponseStatus = (id: string, status: string) => {
    setResponses(prev => 
      prev.map(response => 
        response.id === id ? { ...response, status } : response
      )
    );
  };

  const filteredResponses = responses.filter(response => {
    const matchesSearch = 
      response.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (response.subject && response.subject.toLowerCase().includes(searchTerm.toLowerCase())) ||
      response.rfpTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (response.category && response.category.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (selectedTab === 'all') return matchesSearch;
    if (selectedTab === 'new') return matchesSearch && response.status === 'new';
    if (selectedTab === 'reviewed') return matchesSearch && (response.status === 'reviewed' || response.status === 'graded');
    if (selectedTab === 'approved') return matchesSearch && response.status === 'approved';
    return matchesSearch;
  });

  return {
    searchTerm,
    setSearchTerm,
    selectedTab,
    setSelectedTab,
    filteredResponses,
    updateResponseStatus
  };
};
