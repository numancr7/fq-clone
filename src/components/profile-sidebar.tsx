
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Download, Github, Linkedin, Mail, MapPin, Phone, Newspaper, type LucideIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from './ui/skeleton';

interface Contact {
  label?: string;
  text?: string;
  href?: string;
}

interface Social {
  href?: string;
}

interface PersonalData {
  name?: string;
  title?: string;
  image?: string;
  resumeUrl?: string;
  contacts?: Contact[];
  socials?: Social[];
}

// Helper to map string names to icon components
const iconMap: { [key: string]: LucideIcon } = {
  MAIL: Mail,
  EMAIL: Mail,
  PHONE: Phone,
  LOCATION: MapPin,
  ADDRESS: MapPin,
  GITHUB: Github,
  LINKEDIN: Linkedin,
  NEWSPAPER: Newspaper,
};

export function ProfileSidebar({ personalData }: { personalData: PersonalData }) {
  if (!personalData) {
    return (
      <div className="w-full bg-card px-8 py-12 rounded-3xl shadow-lg flex flex-col items-center text-center">
        <Skeleton className="h-[128px] w-[228px] rounded-[20px] mb-6" />
        <Skeleton className="h-9 w-3/4 mb-2" />
        <Skeleton className="h-6 w-1/2 mb-8" />
        <Separator className="bg-border/50 w-full" />
        <div className="space-y-8 text-sm w-full text-left py-8">
          {[...Array(3)].map((_, i) => (
             <div key={i} className="flex items-center gap-4">
               <Skeleton className="h-12 w-12 rounded-xl" />
               <div className="w-full space-y-2">
                 <Skeleton className="h-3 w-1/4" />
                 <Skeleton className="h-5 w-3/4" />
               </div>
             </div>
          ))}
        </div>
      </div>
    );
  }

  // A simple mapping for socials from href to icon name
  const getSocialIconName = (href: string) => {
    if (href.includes('github')) return 'GITHUB';
    if (href.includes('linkedin')) return 'LINKEDIN';
    if (href.includes('medium')) return 'NEWSPAPER';
    return 'MAIL'; // default
  };

  return (
    <div className="w-full bg-card px-8 py-12 rounded-3xl shadow-lg flex flex-col items-center text-center">
      <Image
        src={personalData.image || '/placeholder-image.jpg'}
        alt={personalData.name || 'Profile'}
        width={228}
        height={128}
        className="w-[228px] h-[128px] rounded-[20px] mb-6 object-cover"
        data-ai-hint="profile picture"
        priority // Load image faster
      />
      <h1 className="text-3xl font-bold text-foreground mb-2">{personalData.name || 'Name not available'}</h1>
      <Badge variant="secondary" className="mb-8 bg-background">{personalData.title || 'Title not available'}</Badge>
      
      <Separator className="bg-border/50 w-full" />

      <div className="space-y-8 text-sm w-full text-left py-8">
        {personalData.contacts?.map((contact: Contact, index: number) => {
          const IconComponent = iconMap[contact.label?.toUpperCase() || ''];
          return(
            <div key={index} className="flex items-center gap-4">
              <div className="p-3 bg-background rounded-xl flex items-center justify-center border border-border/70 shadow-sm">
                  {IconComponent && <IconComponent className="h-5 w-5 text-primary" />}
              </div>
              <div>
                  <p className="text-xs text-muted-foreground">{contact.label || 'Contact'}</p>
                   <div className="font-medium text-foreground">
                      {contact.href ? <a href={contact.href} className="hover:text-primary transition-colors">{contact.text || 'No text'}</a> : <span>{contact.text || 'No text'}</span>}
                   </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex items-center space-x-2">
          {personalData.socials?.map((social: Social, index: number) => {
            const IconComponent = iconMap[getSocialIconName(social.href || '')];
            return (
              <Link key={index} href={social.href || '#'} target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary transition-colors">
                  {IconComponent && <IconComponent className="h-5 w-5" />}
                </Button>
              </Link>
            )
          })}
          {personalData.resumeUrl && personalData.resumeUrl !== '#' && (
              <a href={personalData.resumeUrl} download target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center h-10 w-10 text-muted-foreground hover:text-primary transition-colors" aria-label="Download Resume">
                  <Download className="h-5 w-5" />
              </a>
          )}
      </div>
    </div>
  );
}
