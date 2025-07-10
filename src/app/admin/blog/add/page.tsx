
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

const initialPostState = {
    title: '',
    date: '',
    image: '',
    description: '',
    url: '',
    content: '',
    dataAiHint: '',
};

const blogTitleMaxLength = 60;
const blogDescriptionMaxLength = 100;

export default function AddBlogPostPage() {
    const [formState, setFormState] = useState(initialPostState);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    const handleFormChange = (field: string, value: string) => {
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
            toast({ title: 'Image Uploaded', description: 'Blog image URL has been updated.' });
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: 'Upload Error', description: 'Could not upload blog image.' });
        }
    };

    const handleSavePost = async () => {
        setSaving(true);
        try {
            const response = await fetch('/api/portfolio', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formState),
            });
            if (!response.ok) {
                throw new Error('Failed to save the post.');
            }
            toast({ title: 'Success', description: 'New blog post added successfully.' });
            router.push('/admin/blog');
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
                <CardTitle>Add New Blog Post</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <Label>Title</Label>
                    <Input 
                        value={formState.title} 
                        onChange={(e) => handleFormChange('title', e.target.value)}
                        maxLength={blogTitleMaxLength}
                    />
                    <p className="text-xs text-muted-foreground text-right">{formState.title.length} / {blogTitleMaxLength}</p>
                </div>
                <div><Label>Date</Label><Input type="date" value={formState.date} onChange={(e) => handleFormChange('date', e.target.value)} /></div>
                <div>
                    <Label>Blog Post Image</Label>
                    <Input type="file" accept="image/*" onChange={handleImageUpload} />
                    {imagePreview && <Image src={imagePreview} alt="Blog Post Preview" width={100} height={100} className="mt-2 rounded-md object-cover" />}
                </div>
                <div>
                    <Label>Description</Label>
                    <Textarea 
                       value={formState.description} 
                       onChange={(e) => handleFormChange('description', e.target.value)}
                       maxLength={blogDescriptionMaxLength}
                     />
                     <p className="text-xs text-muted-foreground text-right">{formState.description.length} / {blogDescriptionMaxLength}</p>
                </div>
                <div><Label>Content</Label><Textarea rows={8} value={formState.content} onChange={(e) => handleFormChange('content', e.target.value)} /></div>
                <div><Label>Medium URL</Label><Input value={formState.url} onChange={(e) => handleFormChange('url', e.target.value)} /></div>
                <div><Label>AI Hint for Image Search (1-2 words)</Label><Input value={formState.dataAiHint} onChange={(e) => handleFormChange('dataAiHint', e.target.value)} /></div>

                <div className="flex gap-2 justify-end">
                   <Button onClick={handleSavePost} disabled={saving}>
                       {saving ? <Loader2 className="mr-2 animate-spin"/> : <Save className="mr-2"/>}
                       Save Post
                   </Button>
               </div>
            </CardContent>
        </Card>
    );
}
