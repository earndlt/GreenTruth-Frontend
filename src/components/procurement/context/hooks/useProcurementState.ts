
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';
import { RfpItem } from '../types/ProcurementTypes';

export const useProcurementState = () => {
  const [rfps, setRfps] = useState<RfpItem[]>([
    {
      id: '1',
      title: "Renewable Energy Procurement",
      description: "Seeking vendors for renewable energy solutions with integrated EAC tracking",
      status: "active",
      dueDate: "Oct 15, 2023",
      responses: 5,
      createdAt: new Date('2023-09-01')
    },
    {
      id: '2',
      title: "Sustainable Packaging Materials",
      description: "RFP for eco-friendly packaging materials with EarnDLT QET compliance",
      status: "active",
      dueDate: "Oct 22, 2023",
      responses: 3,
      createdAt: new Date('2023-09-05')
    },
    {
      id: '3',
      title: "Carbon-Neutral Logistics",
      description: "Seeking logistics partners with carbon-neutral operations and EAC integration",
      status: "closed",
      dueDate: "Sep 30, 2023",
      responses: 12,
      createdAt: new Date('2023-08-15')
    },
    {
      id: '4',
      title: "Chemical Supply Chain Compliance",
      description: "RFP for chemical suppliers meeting updated EPA regulations",
      status: "awarded",
      dueDate: "Aug 15, 2023",
      responses: 8,
      createdAt: new Date('2023-07-01')
    },
    {
      id: '5',
      title: "Waste Management Services",
      description: "Seeking waste management vendors with sustainable practices",
      status: "active",
      dueDate: "Nov 5, 2023",
      responses: 0,
      createdAt: new Date('2023-09-20')
    }
  ]);

  const [drafts, setDrafts] = useState<RfpItem[]>([
    {
      id: '6',
      title: "Green Manufacturing Equipment",
      description: "RFP for energy-efficient manufacturing equipment with QET integration",
      status: "draft",
      dueDate: "Not published",
      responses: 0,
      createdAt: new Date('2023-09-25'),
      lastEdited: new Date('2023-09-28'),
      completeness: 85
    },
    {
      id: '7',
      title: "Sustainable Office Supplies",
      description: "Seeking vendors for eco-friendly office supplies with sustainability certifications",
      status: "draft",
      dueDate: "Not published",
      responses: 0,
      createdAt: new Date('2023-09-20'),
      lastEdited: new Date('2023-09-27'),
      completeness: 42
    },
    {
      id: '8',
      title: "Solar Panel Installation",
      description: "RFP for installation of solar panels at manufacturing facilities",
      status: "draft",
      dueDate: "Not published",
      responses: 0,
      createdAt: new Date('2023-09-18'),
      lastEdited: new Date('2023-09-25'),
      completeness: 68
    }
  ]);

  const { toast } = useToast();

  const addRfp = (rfp: Omit<RfpItem, 'id' | 'createdAt'>) => {
    const newRfp: RfpItem = {
      ...rfp,
      id: uuidv4(),
      createdAt: new Date()
    };
    setRfps(prev => [newRfp, ...prev]);
    toast({
      title: "RFP Created",
      description: `Successfully created: ${rfp.title}`,
    });
  };

  const addDraft = (draft: Omit<RfpItem, 'id' | 'createdAt' | 'status'> & { completeness: number }) => {
    const newDraft: RfpItem = {
      ...draft,
      id: uuidv4(),
      status: 'draft',
      createdAt: new Date(),
      lastEdited: new Date(),
      dueDate: "Not published",
      responses: 0,
    };
    setDrafts(prev => [newDraft, ...prev]);
    toast({
      title: "Draft Saved",
      description: `Draft saved: ${draft.title}`,
    });
  };

  const updateRfp = (id: string, rfp: Partial<RfpItem>) => {
    setRfps(prev => prev.map(item => 
      item.id === id ? { ...item, ...rfp } : item
    ));
  };

  const updateDraft = (id: string, draft: Partial<RfpItem>) => {
    setDrafts(prev => prev.map(item => 
      item.id === id ? { ...item, ...draft, lastEdited: new Date() } : item
    ));
  };

  const publishDraft = (id: string) => {
    const draft = drafts.find(d => d.id === id);
    if (draft) {
      // Add to RFPs
      const newRfp: RfpItem = {
        ...draft,
        status: 'active',
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      };
      setRfps(prev => [newRfp, ...prev]);
      
      // Remove from drafts
      setDrafts(prev => prev.filter(d => d.id !== id));
      
      toast({
        title: "RFP Published",
        description: `Successfully published: ${draft.title}`,
      });
    }
  };

  return {
    rfps,
    drafts,
    addRfp,
    addDraft,
    updateRfp,
    updateDraft,
    publishDraft
  };
};
