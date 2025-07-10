
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, ArrowLeft } from 'lucide-react';

const initialProjectState = {
    title: '',
    description: '',
    image: '',
    tags: [] as string[],
    githubUrl: '',
    dataAiHint: '',
};

const projectTitleMaxLength = 60;
const projectDescriptionMaxLength = 100;

export default function AddProjectPage() {
    const [formState, setFormState] = useState(initialProjectState);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    const handleFormChange = (field: string, value: string | string[]) => {
        setFormState(prev => ({ ...prev, [field]: value }));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setImagePreview(URL.createObjectURL(file));

        const formData = new FormData();
        formData.append('file', file);
        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });
            if (!response.ok) throw new Error('Upload failed');
            const result = await response.json();
            handleFormChange('image', result.url);
            toast({ title: 'Image Uploaded', description: 'Project image URL has been updated.' });
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: 'Upload Error', description: 'Could not upload project image.' });
        }
    };

    const handleSaveProject = async () => {
        setSaving(true);
        try {
            const response = await fetch('/api/portfolio?section=projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formState),
            });
            if (!response.ok) {
                throw new Error('Failed to save the project.');
            }
            toast({ title: 'Success', description: 'New project added successfully.' });
            router.push('/admin/portfolio');
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: 'Save Error', description: (error as Error).message });
        } finally {
            setSaving(false);
        }
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center gap-4">
                <Button variant="outline" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <CardTitle>Add New Project</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <Label>Title</Label>
                    <Input 
                        value={formState.title} 
                        onChange={(e) => handleFormChange('title', e.target.value)}
                        maxLength={projectTitleMaxLength}
                    />
                    <p className="text-xs text-muted-foreground text-right">{formState.title.length} / {projectTitleMaxLength}</p>
                </div>
                <div>
                    <Label>Description</Label>
                    <Textarea 
                       value={formState.description} 
                       onChange={(e) => handleFormChange('description', e.target.value)}
                       maxLength={projectDescriptionMaxLength}
                     />
                     <p className="text-xs text-muted-foreground text-right">{formState.description.length} / {projectDescriptionMaxLength}</p>
                </div>
                <div>
                    <Label>Project Image</Label>
                    <Input type="file" accept="image/*" onChange={handleImageUpload} />
                    {imagePreview && <Image src={imagePreview} alt="Project Preview" width={100} height={100} className="mt-2 rounded-md object-cover" />}
                </div>
                <div>
                    <Label>Tags (comma-separated)</Label>
                    <Input 
                        value={Array.isArray(formState.tags) ? formState.tags.join(', ') : ''} 
                        onChange={(e) => handleFormChange('tags', e.target.value.split(',').map(t => t.trim()))} 
                    />
                </div>
                <div><Label>GitHub URL</Label><Input value={formState.githubUrl} onChange={(e) => handleFormChange('githubUrl', e.target.value)} /></div>
                <div><Label>AI Hint for Image Search (1-2 words)</Label><Input value={formState.dataAiHint} onChange={(e) => handleFormChange('dataAiHint', e.target.value)} /></div>

                <div className="flex gap-2 justify-end">
                   <Button onClick={handleSaveProject} disabled={saving}>
                       {saving ? <Loader2 className="mr-2 animate-spin"/> : <Save className="mr-2"/>}
                       Save Project
                   </Button>
               </div>
            </CardContent>
        </Card>
    );
}
