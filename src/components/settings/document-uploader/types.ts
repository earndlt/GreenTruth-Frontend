
export interface DocumentItem {
  id: string;
  name: string;
  type: string;
  uploadDate: Date;
  status: 'processing' | 'ready' | 'failed';
  size: string;
}

export type { DocumentType } from './config/documentTypes';
export { documentTypes } from './config/documentTypes';
