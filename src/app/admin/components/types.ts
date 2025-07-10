export interface BlogPost {
  _id?: string;
  title?: string;
  description?: string;
  image?: string;
  date?: string;
  content?: string;
  url?: string;
  dataAiHint?: string;
}

export interface BlogData {
  posts?: BlogPost[];
}

export interface Project {
  _id?: string;
  title?: string;
  description?: string;
  image?: string;
  tags?: string[];
  githubUrl?: string;
  dataAiHint?: string;
}

export interface PortfolioData {
  [key: string]: any;
  projects?: Project[];
  tags?: string[];
} 