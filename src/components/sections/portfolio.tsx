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

      <div className="grid gap-x-8 gap-y-12 md:grid-cols-2 xl:grid-cols-3">
        {filteredProjects?.map((project, index) => (
          <div key={index} className="group cursor-pointer">
            <div className="relative h-60 w-full overflow-hidden rounded-xl mb-4">
              <Image
                src={project.image || '/placeholder-image.jpg'}
                alt={project.title || 'Project'}
                layout="fill"
                objectFit="cover"
                data-ai-hint={project.dataAiHint || 'project'}
                className="transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-1">{project.title || 'Untitled Project'}</h3>
            <p className="text-muted-foreground line-clamp-2">{project.description || 'No description available'}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
