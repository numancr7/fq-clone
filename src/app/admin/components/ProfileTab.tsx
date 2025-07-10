'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { PlusCircle, Trash2 } from 'lucide-react';
import { AdminDashboardProps } from './types';

export function ProfileTab({ 
  data, 
  imagePreviews, 
  onInputChange, 
  onArrayChange, 
  onAddArrayItem, 
  onRemoveArrayItem, 
  onImageChange, 
  onResumeUpload 
}: AdminDashboardProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input 
            id="name" 
            value={data?.personal?.name || ''} 
            onChange={(e) => onInputChange('personal', 'name', e.target.value)} 
          />
        </div>
        <div>
          <Label htmlFor="title">Title</Label>
          <Input 
            id="title" 
            value={data?.personal?.title || ''} 
            onChange={(e) => onInputChange('personal', 'title', e.target.value)} 
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="profileImage">Profile Image</Label>
        <Input 
          id="profileImage" 
          type="file" 
          accept="image/*" 
          onChange={(e) => onImageChange(e, 'personal.image')} 
        />
        {imagePreviews['personal.image'] && (
          <Image 
            src={imagePreviews['personal.image']} 
            alt="Profile Preview" 
            width={100} 
            height={100} 
            className="mt-2 rounded-md" 
          />
        )}
      </div>
      
      <Separator/>
      
      <h3 className="text-lg font-medium">Contact Details</h3>
      {data?.personal?.contacts?.map((contact: any, i: number) => (
        <div key={i} className="p-4 border rounded-lg mb-4 space-y-3 relative">
          <Button 
            variant="destructive" 
            size="icon" 
            className="absolute top-2 right-2 h-7 w-7" 
            onClick={() => onRemoveArrayItem('personal', 'contacts', i)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <div>
            <Label>Label (e.g., EMAIL)</Label>
            <Input 
              value={contact.label || ''} 
              onChange={(e) => onArrayChange('personal', 'contacts', i, 'label', e.target.value)} 
            />
          </div>
          <div>
            <Label>Text (e.g., name@example.com)</Label>
            <Input 
              value={contact.text || ''} 
              onChange={(e) => onArrayChange('personal', 'contacts', i, 'text', e.target.value)} 
            />
          </div>
          <div>
            <Label>HREF (e.g., mailto:name@example.com)</Label>
            <Input 
              value={contact.href || ''} 
              onChange={(e) => onArrayChange('personal', 'contacts', i, 'href', e.target.value)} 
            />
          </div>
        </div>
      ))}
      <Button 
        variant="outline" 
        onClick={() => onAddArrayItem('personal', 'contacts', { label: '', text: '', href: '' })}
      >
        <PlusCircle className="mr-2" /> Add Contact
      </Button>
      
      <Separator/>
      
      <h3 className="text-lg font-medium">Social Links</h3>
      {data?.personal?.socials?.map((social: any, i: number) => (
        <div key={i} className="p-4 border rounded-lg mb-4 space-y-3 relative">
          <Button 
            variant="destructive" 
            size="icon" 
            className="absolute top-2 right-2 h-7 w-7" 
            onClick={() => onRemoveArrayItem('personal', 'socials', i)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <div>
            <Label>Social URL</Label>
            <Input 
              value={social.href || ''} 
              onChange={(e) => onArrayChange('personal', 'socials', i, 'href', e.target.value)} 
            />
          </div>
        </div>
      ))}
      <Button 
        variant="outline" 
        onClick={() => onAddArrayItem('personal', 'socials', { href: '' })}
      >
        <PlusCircle className="mr-2" /> Add Social
      </Button>
      
      <Separator/>
      
      <h3 className="text-lg font-medium">Resume File</h3>
      <div>
        <Label htmlFor="resumeFile">Upload Resume (PDF)</Label>
        <Input 
          id="resumeFile" 
          type="file" 
          accept="application/pdf" 
          onChange={onResumeUpload} 
        />
        {data?.personal?.resumeUrl && (
          <p className="text-sm text-muted-foreground mt-2">
            Current resume: 
            <a 
              href={data.personal.resumeUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-primary underline ml-1"
            >
              View/Download
            </a>
          </p>
        )}
      </div>
    </div>
  );
} 