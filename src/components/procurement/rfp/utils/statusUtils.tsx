
import React from 'react';
import { Badge } from '@/components/ui/badge';

export const getStatusBadge = (status: string) => {
  switch (status) {
    case 'new':
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">New</Badge>;
    case 'reviewed':
      return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Reviewed</Badge>;
    case 'graded':
      return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Graded</Badge>;
    case 'approved':
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Approved</Badge>;
    case 'rejected':
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejected</Badge>;
    case 'shortlisted':
      return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">Shortlisted</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};
