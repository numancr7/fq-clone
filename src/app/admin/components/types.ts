// Shared types for admin dashboard components
export interface PortfolioData {
  [key: string]: any;
  personal?: {
    name?: string;
    title?: string;
    email?: string;
    image?: string;
    resumeUrl?: string;
    contacts?: Array<{
      label?: string;
      text?: string;
      href?: string;
    }>;
    socials?: Array<{
      href?: string;
    }>;
  };
  portfolio?: {
    projects?: Array<{
      title?: string;
      description?: string;
      image?: string;
      link?: string;
      tags?: string[];
      githubUrl?: string;
      dataAiHint?: string;
    }>;
    tags?: string[];
  };
  blog?: {
    posts?: Array<{
      title?: string;
      description?: string;
      image?: string;
      link?: string;
      date?: string;
      content?: string;
      url?: string;
      dataAiHint?: string;
    }>;
  };
  about?: {
    aboutText?: string;
    whatIDo?: Array<{
      title?: string;
      description?: string;
      iconUrl?: string;
    }>;
  };
  resume?: {
    education?: Array<{
      institution?: string;
      degree?: string;
      details?: string[];
    }>;
    certifications?: Array<{
      name?: string;
      issuer?: string;
    }>;
    skills?: Array<{
      name?: string;
      proficiency?: number | null;
    }>;
  };
  _id?: string;
  __v?: number;
}

export interface ImagePreviews {
  [key: string]: string;
}

export interface AdminDashboardProps {
  data: PortfolioData | null;
  imagePreviews: ImagePreviews;
  onInputChange: (section: string, path: string, value: any) => void;
  onArrayChange: (section: string, path: string, index: number, field: string, value: any) => void;
  onAddArrayItem: (section: string, path: string, newItem: any) => void;
  onRemoveArrayItem: (section: string, path: string, index: number) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>, path: string, index?: number | null, fieldName?: string) => void;
  onResumeUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
} 