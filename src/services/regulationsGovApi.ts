
import { toast } from "sonner";

// Regulations.gov API key
const API_KEY = "Qkv1JdPDUfLlmXqSzPAgLgO948dahNjMm4pGakoX";
const BASE_URL = "https://api.regulations.gov/v4";

// Define types for the API responses
export interface RegulationsDocument {
  id: string;
  type: string;
  attributes: {
    agencyId: string;
    docketId: string;
    title: string;
    documentType: string;
    publicationDate: string;
    commentStartDate?: string;
    commentEndDate?: string;
    frNumber?: string;
    content?: string;
    status?: string;
    postedDate?: string;
    summary?: string;
  };
}

export interface RegulationsResponse {
  data: RegulationsDocument[];
  meta: {
    totalElements: number;
    totalPages: number;
    pageNumber: number;
    pageSize: number;
  };
}

// Search parameters interface
export interface RegulationsSearchParams {
  searchTerm?: string;
  agencyIds?: string[];
  docketIds?: string[];
  documentType?: string;
  commentPeriodStatus?: 'Open' | 'Closed';
  postedDateFrom?: string;
  postedDateTo?: string;
  page?: number;
  pageSize?: number;
}

/**
 * Search for documents on Regulations.gov
 */
export const searchRegulations = async (params: RegulationsSearchParams): Promise<RegulationsResponse> => {
  try {
    // Construct query parameters
    const queryParams = new URLSearchParams();
    
    if (params.searchTerm) queryParams.append('filter[searchTerm]', params.searchTerm);
    if (params.agencyIds?.length) queryParams.append('filter[agencyId]', params.agencyIds.join(','));
    if (params.docketIds?.length) queryParams.append('filter[docketId]', params.docketIds.join(','));
    if (params.documentType) queryParams.append('filter[documentType]', params.documentType);
    if (params.commentPeriodStatus) queryParams.append('filter[commentPeriod]', params.commentPeriodStatus);
    if (params.postedDateFrom) queryParams.append('filter[postedDate][ge]', params.postedDateFrom);
    if (params.postedDateTo) queryParams.append('filter[postedDate][le]', params.postedDateTo);
    
    // Pagination
    queryParams.append('page[size]', params.pageSize?.toString() || '10');
    queryParams.append('page[number]', params.page?.toString() || '1');
    
    // API key
    queryParams.append('api_key', API_KEY);
    
    const response = await fetch(`${BASE_URL}/documents?${queryParams.toString()}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Regulations.gov API error: ${errorData.message || response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching regulations:', error);
    toast.error('Failed to fetch regulations data');
    throw error;
  }
};

/**
 * Get details of a specific document
 */
export const getDocumentDetails = async (documentId: string): Promise<RegulationsDocument> => {
  try {
    const response = await fetch(`${BASE_URL}/documents/${documentId}?api_key=${API_KEY}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Regulations.gov API error: ${errorData.message || response.statusText}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching document details:', error);
    toast.error('Failed to fetch regulation document details');
    throw error;
  }
};

/**
 * Get comments for a specific document
 */
export const getDocumentComments = async (documentId: string): Promise<RegulationsResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/comments?filter[documentId]=${documentId}&api_key=${API_KEY}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Regulations.gov API error: ${errorData.message || response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching document comments:', error);
    toast.error('Failed to fetch regulation comments');
    throw error;
  }
};
