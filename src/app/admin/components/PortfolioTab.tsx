'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { PlusCircle, Trash2 } from 'lucide-react';
import { AdminDashboardProps } from './types';

const projectDescriptionMaxLength = 100;

export function PortfolioTab({ 
  data, 
  imagePreviews, 
  onInputChange, 
  onArrayChange, 
  onAddArrayItem, 
  onRemoveArrayItem, 
  onImageChange 
}: AdminDashboardProps) {
  return (
    <div className="space-y-6">
      <div>
        <Label>Filter Tags (comma-separated)</Label>
        <Input 
          value={data?.portfolio?.tags?.join(', ') || ''} 
          onChange={(e) => onInputChange('portfolio', 'tags', e.target.value.split(',').map(t => t.trim()))} 
        />
      </div>
      
      <Separator/>
      
      {data?.portfolio?.projects?.map((project: any, i: number) => (
        <div key={i} className="p-4 border rounded-lg mb-4 space-y-3 relative">
          <Button 
            variant="destructive" 
            size="icon" 
            className="absolute top-2 right-2 h-7 w-7" 
            onClick={() => onRemoveArrayItem('portfolio', 'projects', i)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          
          <div>
            <Label>Title</Label>
            <Input 
              value={project.title || ''} 
              onChange={(e) => onArrayChange('portfolio', 'projects', i, 'title', e.target.value)} 
            />
          </div>
          
          <div>
            <Label>Description</Label>
            <Textarea 
              value={project.description || ''} 
              onChange={(e) => onArrayChange('portfolio', 'projects', i, 'description', e.target.value)}
              maxLength={projectDescriptionMaxLength}
            />
            <p className="text-xs text-muted-foreground text-right">
              {(project.description?.length || 0)} / {projectDescriptionMaxLength}
            </p>
          </div>
          
          <div>
            <Label>Project Image</Label>
            <Input 
              type="file" 
              accept="image/*" 
              onChange={(e) => onImageChange(e, 'portfolio.projects', i)} 
            />
            {imagePreviews[`portfolio.projects-${i}`] && (
              <Image 
                src={imagePreviews[`portfolio.projects-${i}`]} 
                alt="Project Preview" 
                width={100} 
                height={100} 
                className="mt-2 rounded-md" 
              />
            )}
          </div>
          
          <div>
            <Label>Tags (comma-separated)</Label>
            <Input 
              value={project.tags?.join(', ') || ''} 
              onChange={(e) => onArrayChange('portfolio', 'projects', i, 'tags', e.target.value.split(',').map(t => t.trim()))} 
            />
          </div>
          
          <div>
            <Label>GitHub URL</Label>
            <Input 
              value={project.githubUrl || ''} 
              onChange={(e) => onArrayChange('portfolio', 'projects', i, 'githubUrl', e.target.value)} 
            />
          </div>
          
          <div>
            <Label>AI Hint for Image Search (1-2 words)</Label>
            <Input 
              value={project.dataAiHint || ''} 
              onChange={(e) => onArrayChange('portfolio', 'projects', i, 'dataAiHint', e.target.value)} 
            />
          </div>
        </div>
      ))}
      
      <Button 
        variant="outline" 
        onClick={() => onAddArrayItem('portfolio', 'projects', { 
          title: 'New Project', 
          description: '', 
          image: '', 
          tags: [], 
          githubUrl: '', 
          dataAiHint: '' 
        })}
      >
        <PlusCircle className="mr-2" /> Add Project
      </Button>
    </div>
  );
} 