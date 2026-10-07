/** Display-only DTO. No disk paths, collaboration credentials or AI task files. */
export type ViewerDocument = {
  id: string;
  title: string;
  kind: 'idea' | 'document' | 'image' | 'html';
  section: string;
  summary: string;
  body: string;
  position: { x: number; y: number };
  color: 'cream' | 'green' | 'blue' | 'rose' | 'purple' | 'gray';
  width?: number;
  height?: number;
  onCanvas?: boolean;
  image?: string;
  html?: string;
};

export type ViewerProject = {
  schemaVersion: 1;
  id: string;
  name: string;
  description: string;
  source: 'demo' | 'shared' | 'published' | 'local-live';
  revision: number;
  readOnly: true;
  publishedAt?: number;
  modifiedAt?: number;
  folder?: string;
  sections?: {
    id: string;
    title: string;
    x: number;
    y: number;
    width: number;
    height: number;
  }[];
  documents: ViewerDocument[];
};

export type ProjectSummary = Omit<ViewerProject, 'documents' | 'sections'> & {
  documentCount: number;
  sectionCount: number;
};
