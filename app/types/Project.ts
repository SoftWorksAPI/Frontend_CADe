export interface Project {
  id: string;
  name: string;
  description: string;
  fileUrl?: string;
  uploadDate: Date;
  status: 'pending' | 'processing' | 'completed';
}

export type Projects = Project[];
