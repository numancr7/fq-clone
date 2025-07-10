'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { PlusCircle, Trash2 } from 'lucide-react';
import { AdminDashboardProps } from './types';

export function ResumeTab({ 
  data, 
  onArrayChange, 
  onAddArrayItem, 
  onRemoveArrayItem 
}: AdminDashboardProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Education</h3>
        {data?.resume?.education?.map((edu: any, i: number) => (
          <div key={i} className="p-4 border rounded-lg mb-4 space-y-3 relative">
            <Button 
              variant="destructive" 
              size="icon" 
              className="absolute top-2 right-2 h-7 w-7" 
              onClick={() => onRemoveArrayItem('resume', 'education', i)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <div>
              <Label>Institution</Label>
              <Input 
                value={edu.institution || ''} 
                onChange={(e) => onArrayChange('resume', 'education', i, 'institution', e.target.value)} 
              />
            </div>
            <div>
              <Label>Degree</Label>
              <Input 
                value={edu.degree || ''} 
                onChange={(e) => onArrayChange('resume', 'education', i, 'degree', e.target.value)} 
              />
            </div>
            <div>
              <Label>Details (comma-separated)</Label>
              <Input 
                value={edu.details?.join(', ') || ''} 
                onChange={(e) => onArrayChange('resume', 'education', i, 'details', e.target.value.split(',').map(d => d.trim()))} 
              />
            </div>
          </div>
        ))}
        <Button 
          variant="outline" 
          onClick={() => onAddArrayItem('resume', 'education', { institution: '', degree: '', details: [] })}
        >
          <PlusCircle className="mr-2" /> Add Education
        </Button>
      </div>
      
      <Separator/>
      
      <div>
        <h3 className="text-lg font-medium mb-2">Certifications</h3>
        {data?.resume?.certifications?.map((cert: any, i: number) => (
          <div key={i} className="p-4 border rounded-lg mb-4 space-y-3 relative">
            <Button 
              variant="destructive" 
              size="icon" 
              className="absolute top-2 right-2 h-7 w-7" 
              onClick={() => onRemoveArrayItem('resume', 'certifications', i)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <div>
              <Label>Name</Label>
              <Input 
                value={cert.name || ''} 
                onChange={(e) => onArrayChange('resume', 'certifications', i, 'name', e.target.value)} 
              />
            </div>
            <div>
              <Label>Issuer</Label>
              <Input 
                value={cert.issuer || ''} 
                onChange={(e) => onArrayChange('resume', 'certifications', i, 'issuer', e.target.value)} 
              />
            </div>
          </div>
        ))}
        <Button 
          variant="outline" 
          onClick={() => onAddArrayItem('resume', 'certifications', { name: '', issuer: '' })}
        >
          <PlusCircle className="mr-2" /> Add Certification
        </Button>
      </div>
      
      <Separator/>
      
      <div>
        <h3 className="text-lg font-medium mb-2">Skills</h3>
        {data?.resume?.skills?.map((skill: any, i: number) => (
          <div key={i} className="flex items-center gap-4 mb-2 p-2 border rounded-lg">
            <Input 
              placeholder="Skill Name" 
              value={skill.name || ''} 
              onChange={(e) => onArrayChange('resume', 'skills', i, 'name', e.target.value)} 
            />
            <Input
              type="number"
              placeholder="Proficiency (0-100)"
              value={skill.proficiency ?? ''}
              onChange={(e) => {
                const rawValue = e.target.value;
                const parsedValue = parseInt(rawValue, 10);
                if (rawValue === '') {
                  onArrayChange('resume', 'skills', i, 'proficiency', null);
                } else if (!isNaN(parsedValue)) {
                  onArrayChange('resume', 'skills', i, 'proficiency', parsedValue);
                }
              }}
            />
            <Button 
              variant="destructive" 
              size="icon" 
              onClick={() => onRemoveArrayItem('resume', 'skills', i)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button 
          variant="outline" 
          onClick={() => onAddArrayItem('resume', 'skills', { name: 'New Skill', proficiency: 50 })}
        >
          <PlusCircle className="mr-2" /> Add Skill
        </Button>
      </div>
    </div>
  );
} 