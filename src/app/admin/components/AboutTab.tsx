'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { PlusCircle, Trash2 } from 'lucide-react';
import { AdminDashboardProps } from './types';

const serviceTitleMaxLength = 25;
const serviceDescriptionMaxLength = 80;

export function AboutTab({ 
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
        <Label htmlFor="about-text">About Me Bio</Label>
        <Textarea 
          id="about-text" 
          value={data?.about?.aboutText || ''} 
          onChange={(e) => onInputChange('about', 'aboutText', e.target.value)} 
          rows={5} 
        />
      </div>
      
      <Separator />
      
      <div>
        <h3 className="text-lg font-medium mb-2">Services ("What I'm Doing")</h3>
        {data?.about?.whatIDo?.map((service: any, i: number) => (
          <div key={i} className="p-4 border rounded-lg mb-4 space-y-3 relative">
            <Button 
              variant="destructive" 
              size="icon" 
              className="absolute top-2 right-2 h-7 w-7" 
              onClick={() => onRemoveArrayItem('about', 'whatIDo', i)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            
            <div>
              <Label htmlFor={`service-title-${i}`}>Title</Label>
              <Input 
                id={`service-title-${i}`}
                value={service.title || ''} 
                onChange={(e) => onArrayChange('about', 'whatIDo', i, 'title', e.target.value)} 
                maxLength={serviceTitleMaxLength}
              />
              <p className="text-xs text-muted-foreground text-right">
                {(service.title?.length || 0)} / {serviceTitleMaxLength}
              </p>
            </div>
            
            <div>
              <Label htmlFor={`service-desc-${i}`}>Description</Label>
              <Textarea 
                id={`service-desc-${i}`}
                value={service.description || ''} 
                onChange={(e) => onArrayChange('about', 'whatIDo', i, 'description', e.target.value)}
                maxLength={serviceDescriptionMaxLength}
              />
              <p className="text-xs text-muted-foreground text-right">
                {(service.description?.length || 0)} / {serviceDescriptionMaxLength}
              </p>
            </div>
            
            <div>
              <Label htmlFor={`serviceIcon-${i}`}>Service Icon (PNG)</Label>
              <Input 
                id={`serviceIcon-${i}`} 
                type="file" 
                accept="image/png" 
                onChange={(e) => onImageChange(e, 'about.whatIDo', i, 'iconUrl')} 
              />
              {(imagePreviews[`about.whatIDo-${i}`] || service.iconUrl) && (
                <div className="mt-2 p-2 border rounded-md inline-block">
                  <Image 
                    src={imagePreviews[`about.whatIDo-${i}`] || service.iconUrl || ''} 
                    alt="Service Icon Preview" 
                    width={40} 
                    height={40} 
                    className="rounded-md object-contain" 
                  />
                </div>
              )}
            </div>
          </div>
        ))}
        
        <Button 
          variant="outline" 
          onClick={() => onAddArrayItem('about', 'whatIDo', { 
            title: 'New Service', 
            description: 'Description', 
            iconUrl: '' 
          })}
        >
          <PlusCircle className="mr-2" /> Add Service
        </Button>
      </div>
    </div>
  );
} 