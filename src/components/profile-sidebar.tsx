
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Download, Github, Linkedin, Mail, MapPin, Phone, Newspaper, ChevronDown, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from './ui/skeleton';


interface PersonalData {
    name: string;
    title: string;
    image: string;
    contacts: {
        label: string;
        text: string;
        href?: string;
    }[];
    socials: {
        href: string;
    }[];
    resumeUrl?: string;
}

interface ProfileSidebarProps {
  personalData: PersonalData | null;
  layout?: 'vertical' | 'horizontal';
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

export function ProfileSidebar({ personalData, layout = 'vertical' }: ProfileSidebarProps) {
  const [isVerticalExpanded, setIsVerticalExpanded] = useState(false);
  const [isHorizontalContactsVisible, setIsHorizontalContactsVisible] = useState(false);

  if (!personalData) {
    return (
      <div className="w-full bg-card px-8 py-12 rounded-3xl shadow-lg flex flex-col items-center text-center">
        <Skeleton className="h-32 w-32 rounded-3xl mb-8" />
        <Skeleton className="h-9 w-3/4 mb-4" />
        <Skeleton className="h-7 w-1/3 mb-8 rounded-lg" />
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

  const ContactList = () => (
      <div className="space-y-6 text-sm w-full text-left py-8">
            {personalData.contacts.map((contact, index) => {
              const IconComponent = iconMap[contact.label.toUpperCase()];
              return(
                <div key={index} className="flex items-center gap-4">
                  <div className="p-3 bg-secondary rounded-xl flex items-center justify-center border border-border/70 shadow-sm">
                      {IconComponent && <IconComponent className="h-5 w-5 text-primary" />}
                  </div>
                  <div className="truncate">
                      <p className="text-xs text-muted-foreground">{contact.label}</p>
                       <div className="font-medium text-foreground truncate">
                          {contact.href ? <a href={contact.href} className="hover:text-primary transition-colors">{contact.text}</a> : <span>{contact.text}</span>}
                       </div>
                  </div>
                </div>
              )
            })}
          </div>
  );
  
  const SocialLinks = () => (
     <div className="flex items-center justify-center space-x-2">
          {personalData.socials.map((social, index) => {
            const IconComponent = iconMap[getSocialIconName(social.href)];
            return (
              <Link key={index} href={social.href} target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary transition-colors">
                  {IconComponent && <IconComponent className="h-5 w-5" />}
                </Button>
              </Link>
            )
          })}
          {personalData.resumeUrl && personalData.resumeUrl !== '#' && (
              <a href={personalData.resumeUrl} download="resume.pdf" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center h-10 w-10 text-muted-foreground hover:text-primary transition-colors" aria-label="Download Resume">
                  <Download className="h-5 w-5" />
              </a>
          )}
      </div>
  );

  if (layout === 'horizontal') {
      return (
          <div className="relative w-full bg-card p-6 rounded-3xl shadow-glow flex flex-col">
              <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-4 flex-1">
                      <Image
                        src={personalData.image}
                        alt={personalData.name}
                        width={80}
                        height={80}
                        className="w-16 h-16 md:w-20 md:h-20 rounded-2xl object-cover"
                        data-ai-hint="woman avatar"
                        priority
                      />
                      <div className='flex-1'>
                          <h1 className="text-xl md:text-2xl font-bold text-foreground">{personalData.name}</h1>
                          <div className="text-xs text-foreground bg-secondary py-1 px-3 rounded-lg inline-block mt-1">
                              {personalData.title}
                          </div>
                      </div>
                  </div>
                  <button
                    onClick={() => setIsHorizontalContactsVisible(!isHorizontalContactsVisible)}
                    className="absolute top-0 right-0 px-4 py-2 text-sm font-medium text-primary bg-card border-b border-l border-border/50 rounded-bl-xl rounded-tr-3xl"
                   >
                    Show Contacts
                   </button>
              </div>

             <div
                className={cn(
                    "transition-all duration-500 ease-in-out overflow-hidden",
                    isHorizontalContactsVisible ? 'grid grid-rows-[1fr] opacity-100' : 'grid grid-rows-[0fr] opacity-0'
                )}
                >
                <div className='min-h-0'>
                  <Separator className="bg-border/30 w-full my-6" />
                  <ContactList />
                  <SocialLinks />
                </div>
              </div>
          </div>
      )
  }

  // Vertical Layout (default for mobile and large screens)
  return (
    <div className="relative w-full bg-card p-6 rounded-3xl shadow-glow flex flex-col items-center">
      
      {/* Mobile-only Collapsible Toggle */}
      <div className="absolute top-0 right-0 lg:hidden">
          <button 
            onClick={() => setIsVerticalExpanded(!isVerticalExpanded)} 
            className="w-12 h-11 bg-card border-b border-l border-primary/50 rounded-bl-3xl rounded-tr-3xl flex items-center justify-center text-primary"
            aria-expanded={isVerticalExpanded}
            aria-controls="contact-info"
          >
              <ChevronDown className={cn("h-5 w-5 transition-transform duration-300", isVerticalExpanded && "rotate-180")} />
          </button>
      </div>

      <div className="w-full flex flex-col items-center">
        <div className="flex flex-col items-center w-full text-center gap-4 mb-8">
            <div className="flex-shrink-0">
                <Image
                    src={personalData.image}
                    alt={personalData.name}
                    width={228}
                    height={128}
                    className="w-[228px] h-[128px] rounded-3xl object-cover"
                    data-ai-hint="woman avatar"
                    priority
                />
            </div>
            <div className="flex flex-col items-center flex-grow">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2 text-center">{personalData.name}</h1>
                <div className="text-sm text-foreground bg-secondary py-1.5 px-4 rounded-lg">
                    {personalData.title}
                </div>
            </div>
        </div>
      </div>
      
      <div
        id="contact-info" 
        className={cn(
          "w-full transition-all duration-500 ease-in-out lg:block",
          "grid lg:grid-rows-[1fr_auto] grid-rows-[0fr_auto]", // Grid transition for height
          isVerticalExpanded ? "grid-rows-[1fr_auto]" : "grid-rows-[0fr_auto]"
      )}>
        <div className="overflow-hidden">
          <Separator className="bg-border/30 w-full lg:my-0" />
          <ContactList />
        </div>
      </div>
      <SocialLinks />
    </div>
  );
}
