export interface Project {
  id?: string;
  name: string;
  description: string;
  function: string;
  technologies: string[];
  category: 'delivery' | 'education' | 'social' | 'shopping' | 'services' | 'other' | string;
  imageUrls: string[];
  liveLink?: string;
  order?: number;
  createdAt?: any;
}

export interface Stats {
  projectsCount: number;
  experienceYears: number;
  clientsCount: number;
}
