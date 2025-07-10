'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Trash2 } from 'lucide-react';
import { AdminDashboardProps } from './types';

const blogDescriptionMaxLength = 100;

export function BlogTab({ 
  data, 
  imagePreviews, 
  onArrayChange, 
  onAddArrayItem, 
  onRemoveArrayItem, 
  onImageChange 
}: AdminDashboardProps) {
  return (
    <div className="space-y-6">
      {data?.blog?.posts?.map((post: any, i: number) => (
        <div key={i} className="p-4 border rounded-lg mb-4 space-y-3 relative">
          <Button 
            variant="destructive" 
            size="icon" 
            className="absolute top-2 right-2 h-7 w-7" 
            onClick={() => onRemoveArrayItem('blog', 'posts', i)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          
          <div>
            <Label>Title</Label>
            <Input 
              value={post.title || ''} 
              onChange={(e) => onArrayChange('blog', 'posts', i, 'title', e.target.value)} 
            />
          </div>
          
          <div>
            <Label>Date</Label>
            <Input 
              type="date" 
              value={post.date || ''} 
              onChange={(e) => onArrayChange('blog', 'posts', i, 'date', e.target.value)} 
            />
          </div>
          
          <div>
            <Label>Blog Post Image</Label>
            <Input 
              type="file" 
              accept="image/*" 
              onChange={(e) => onImageChange(e, 'blog.posts', i)} 
            />
            {imagePreviews[`blog.posts-${i}`] && (
              <Image 
                src={imagePreviews[`blog.posts-${i}`]} 
                alt="Blog Post Preview" 
                width={100} 
                height={100} 
                className="mt-2 rounded-md" 
              />
            )}
          </div>
          
          <div>
            <Label>Description</Label>
            <Textarea 
              value={post.description || ''} 
              onChange={(e) => onArrayChange('blog', 'posts', i, 'description', e.target.value)}
              maxLength={blogDescriptionMaxLength}
            />
            <p className="text-xs text-muted-foreground text-right">
              {(post.description?.length || 0)} / {blogDescriptionMaxLength}
            </p>
          </div>
          
          <div>
            <Label>Content</Label>
            <Textarea 
              rows={8} 
              value={post.content || ''} 
              onChange={(e) => onArrayChange('blog', 'posts', i, 'content', e.target.value)} 
            />
          </div>
          
          <div>
            <Label>Medium URL</Label>
            <Input 
              value={post.url || ''} 
              onChange={(e) => onArrayChange('blog', 'posts', i, 'url', e.target.value)} 
            />
          </div>
          
          <div>
            <Label>AI Hint for Image Search (1-2 words)</Label>
            <Input 
              value={post.dataAiHint || ''} 
              onChange={(e) => onArrayChange('blog', 'posts', i, 'dataAiHint', e.target.value)} 
            />
          </div>
        </div>
      ))}
      
      <Button 
        variant="outline" 
        onClick={() => onAddArrayItem('blog', 'posts', { 
          title: '', 
          date: '', 
          image: '', 
          description: '', 
          url: '', 
          content: '', 
          dataAiHint: '' 
        })}
      >
        <PlusCircle className="mr-2" /> Add Post
      </Button>
    </div>
  );
} 