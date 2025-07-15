'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Project {
  title?: string;
  description?: string;
  image?: string;
  tags?: string[];
  dataAiHint?: string;
  githubUrl?: string;
}

interface PortfolioData {
  projects?: Project[];
  tags?: string[];
}

export function PortfolioSection({ portfolioData }: { portfolioData: PortfolioData }) {
  const [activeTag, setActiveTag] = useState('All');

  const filteredProjects =
    activeTag === 'All'
      ? portfolioData?.projects || []
      : portfolioData?.projects?.filter((project) => project.tags?.includes(activeTag)) || [];

  return (
    <section id="portfolio" className="space-y-12">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Portfolio</h2>
        <div className="w-20 h-1 bg-primary rounded-full mt-2"></div>
      </div>

      <Select value={activeTag} onValueChange={setActiveTag}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="All" />
        </SelectTrigger>
        <SelectContent>
          {portfolioData?.tags?.map((tag) => (
            <SelectItem key={tag} value={tag}>
              {tag}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="grid gap-x-8 gap-y-12 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
        {filteredProjects?.map((project, index) => {
          const cardContent = (
            <div className="group cursor-pointer overflow-hidden rounded-xl bg-background shadow-md flex flex-col h-full">
              <div className="relative w-full aspect-[4/3] overflow-hidden">
                <Image
                  src={project.image || '/placeholder-image.jpg'}
                  alt={project.title || 'Project'}
                  fill
                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                  data-ai-hint={project.dataAiHint || 'project'}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-xl font-semibold text-foreground mb-1 break-words">{project.title || 'Untitled Project'}</h3>
                <p className="text-muted-foreground line-clamp-2 break-words">{project.description || 'No description available'}</p>
              </div>
            </div>
          );
          return project.githubUrl ? (
            <a
              key={index}
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block h-full"
            >
              {cardContent}
            </a>
          ) : (
            <div key={index}>{cardContent}</div>
          );
        })}
      </div>
    </section>
  );
}
