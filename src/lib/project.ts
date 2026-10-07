/** Display-only DTO. No disk paths, collaboration credentials or AI task files. */
export type ViewerDocument = {
  id: string;
  title: string;
  kind: 'idea' | 'document';
  section: string;
  summary: string;
  body: string;
  position: { x: number; y: number };
  color: 'cream' | 'green' | 'blue' | 'rose';
};

export type ViewerProject = {
  schemaVersion: 1;
  id: string;
  name: string;
  description: string;
  source: 'demo' | 'shared' | 'published' | 'local-live';
  revision: number;
  readOnly: true;
  documents: ViewerDocument[];
};
