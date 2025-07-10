
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, ArrowLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const blogTitleMaxLength = 60;
const blogDescriptionMaxLength = 100;

interface BlogPost {
    _id: string;
    title: string;
    date: string;
    image: string;
    description: string;
    content: string;
    url: string;
    dataAiHint: string;
}

export default function EditBlogPostPage() {
    const [formState, setFormState] = useState<BlogPost | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { id: postId } = useParams();
    const { toast } = useToast();

    const fetchPost = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/portfolio?postId=${postId}`);
            if (!response.ok) throw new Error('Post not found');
            const data = await response.json();
            setFormState(data);
            if (data.image) {
                setImagePreview(data.image);
            }
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch blog post data.' });
            router.push('/admin/blog');
        } finally {
            setLoading(false);
        }
    }, [postId, router, toast]);

    useEffect(() => {
        if (postId) {
            fetchPost();
        }
    }, [postId, fetchPost]);

    const handleFormChange = (field: keyof BlogPost, value: string) => {
        setFormState(prev => (prev ? { ...prev, [field]: value } : null));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setImagePreview(URL.createObjectURL(file));

        const formData = new FormData();
        formData.append('file', file);
        try {
            const response = await fetch('/api/upload', { method: 'POST', body: formData });
            if (!response.ok) throw new Error('Upload failed');
            const result = await response.json();
            handleFormChange('image', result.url);
            toast({ title: 'Image Uploaded', description: 'New image URL is ready to be saved.' });
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: 'Upload Error', description: 'Could not upload blog image.' });
        }
    };

    const handleUpdatePost = async () => {
        setSaving(true);
        try {
            const response = await fetch(`/api/portfolio?postId=${postId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formState),
            });
            if (!response.ok) throw new Error('Failed to update the post.');
            toast({ title: 'Success', description: 'Blog post updated successfully.' });
            router.push('/admin/blog');
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: 'Update Error', description: (error as Error).message });
        } finally {
            setSaving(false);
        }
    };
    
    if (loading || !formState) {
        return (
            <Card>
                <CardHeader><Skeleton className="h-8 w-1/2" /></CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-24 w-full" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center gap-4">
                 <Button variant="outline" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <CardTitle>Edit Blog Post</CardTitle>
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
                   <Button onClick={handleUpdatePost} disabled={saving}>
                       {saving ? <Loader2 className="mr-2 animate-spin"/> : <Save className="mr-2"/>}
                       Update Post
                   </Button>
               </div>
            </CardContent>
        </Card>
    );
}
