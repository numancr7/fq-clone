
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { ProfileTab } from './ProfileTab';
import { AboutTab } from './AboutTab';
import { ResumeTab } from './ResumeTab';
import { PortfolioTab } from './PortfolioTab';
import { BlogTab } from './BlogTab';
import SignOutButton from './SignOutButton';
import { PortfolioData, ImagePreviews } from './types';

export function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<ImagePreviews>({});
  const [activeTab, setActiveTab] = useState('profile');

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session || session.user.role !== 'admin') {
      router.push('/admin/login');
    }
  }, [session, status, router]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/portfolio');
        if (!response.ok) {
          throw new Error('Failed to fetch portfolio data');
        }
        const fetchedData: PortfolioData = await response.json();
        setData(fetchedData);
        
        // Pre-populate image previews from fetched data
        const previews: ImagePreviews = {};
        if (fetchedData.personal?.image) {
          previews['personal.image'] = fetchedData.personal.image;
        }
        fetchedData.portfolio?.projects?.forEach((p: any, i: number) => {
          if (p.image) previews[`portfolio.projects-${i}`] = p.image;
        });
        fetchedData.blog?.posts?.forEach((p: any, i: number) => {
          if (p.image) previews[`blog.posts-${i}`] = p.image;
        });
        fetchedData.about?.whatIDo?.forEach((s: any, i: number) => {
          if (s.iconUrl) previews[`about.whatIDo-${i}`] = s.iconUrl;
        });
        setImagePreviews(previews);

      } catch (error) {
        console.error(error);
        toast({
          variant: 'destructive',
          title: 'Error Loading Data',
          description: 'Could not fetch portfolio data from the server.',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [toast]);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Create a deep copy to avoid mutating the original state directly
      const saveData = JSON.parse(JSON.stringify(data));
      // Remove Mongoose-specific fields that shouldn't be sent in an update
      delete saveData._id;
      delete saveData.__v;

      const response = await fetch('/api/portfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(saveData),
      });

      if (!response.ok) {
        let errorMessage = 'Server responded with an error.';
        try {
          const errorResult = await response.json();
          errorMessage = errorResult.message || errorMessage;
        } catch (e) {
          // Response was not JSON, stick with the generic error
        }
        throw new Error(errorMessage);
      }
      
      const result = await response.json();
      // Update local state with the data returned from the server
      setData(result.data);
      
      toast({
        title: 'Changes Saved',
        description: 'Your changes have been successfully saved to the database.',
      });
    } catch (error) {
       console.error(error);
       toast({
        variant: 'destructive',
        title: 'Save Failed',
        description: (error as Error).message || 'Could not save your changes. Please try again.',
       });
    } finally {
      setSaving(false);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>, path: string, index: number | null = null, fieldName: string = 'image') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewKey = index !== null ? `${path}-${index}` : path;
    
    // Show a preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreviews(prev => ({ ...prev, [previewKey]: reader.result as string }));
    };
    reader.readAsDataURL(file);

    // Upload to the server
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const result = await response.json();
      const newUrl = result.url;
      
      // Update data state with the new URL from the server
      if (index !== null) {
        const [section, arrayName] = path.split('.');
        handleArrayChange(section, arrayName, index, fieldName, newUrl);
      } else {
        const [section, field] = path.split('.');
        handleInputChange(section, field, newUrl);
      }
      
      toast({
        title: 'Image Uploaded',
        description: 'The new image URL has been saved.',
      });

    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Upload Error',
        description: 'Could not upload the image. Please try again.',
      });
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
        toast({
            variant: 'destructive',
            title: 'Invalid File Type',
            description: 'Please upload a PDF file for the resume.',
        });
        return;
    }
    
    setSaving(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) throw new Error('Resume upload failed');

        const result = await response.json();
        const newUrl = result.url;
      
        handleInputChange('personal', 'resumeUrl', newUrl);
        
        toast({
            title: 'Resume Uploaded',
            description: 'Your new resume has been saved.',
        });

    } catch (error) {
        console.error(error);
        toast({
            variant: 'destructive',
            title: 'Upload Error',
            description: 'Could not upload your resume. Please try again.',
        });
    } finally {
        setSaving(false);
    }
  };

  const handleInputChange = (section: string, path: string, value: any) => {
    setData((prev) => {
      if (!prev) return prev;
      const newSectionData = { ...prev[section] };
      let current = newSectionData;
      const keys = path.split('.');
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return { ...prev, [section]: newSectionData };
    });
  };

  const handleArrayChange = (section: string, path: string, index: number, field: string, value: any) => {
    setData((prev) => {
      if (!prev) return prev;
      const newSectionData = { ...prev[section] };
      const newArray = [...newSectionData[path]];
      newArray[index] = { ...newArray[index], [field]: value };
      return {
        ...prev,
        [section]: { ...newSectionData, [path]: newArray },
      };
    });
  };
  
  const addArrayItem = (section: string, path: string, newItem: any) => {
    setData((prev) => {
        if (!prev) return prev;
        const newSectionData = { ...prev[section] };
        const newArray = [...(newSectionData[path] || []), newItem];
        return { ...prev, [section]: { ...newSectionData, [path]: newArray } };
    });
  };

  const removeArrayItem = (section: string, path: string, index: number) => {
    setData((prev) => {
        if (!prev) return prev;
        const newSectionData = { ...prev[section] };
        const newArray = [...newSectionData[path]];
        newArray.splice(index, 1);
        return { ...prev, [section]: { ...newSectionData, [path]: newArray } };
    });
  };

  // Show loading while checking session
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!session || session.user.role !== 'admin') {
    return null; // Will redirect via useEffect
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-end">
           <Skeleton className="h-10 w-32" />
        </div>
        <Card>
            <CardHeader><Skeleton className="h-8 w-1/2" /></CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-24 w-full" />
            </CardContent>
        </Card>
      </div>
    );
  }
  
  if (!data) {
     return <p className="text-destructive text-center">Failed to load dashboard data. Please refresh the page.</p>;
  }

  const tabsConfig = [
    { value: 'profile', label: 'Profile' },
    { value: 'about', label: 'About' },
    { value: 'resume', label: 'Resume' },
    { value: 'portfolio', label: 'Portfolio' },
    { value: 'blog', label: 'Blog' },
  ];

  const dashboardProps = {
    data,
    imagePreviews,
    onInputChange: handleInputChange,
    onArrayChange: handleArrayChange,
    onAddArrayItem: addArrayItem,
    onRemoveArrayItem: removeArrayItem,
    onImageChange: handleImageChange,
    onResumeUpload: handleResumeUpload,
  };

  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Welcome, {session?.user?.name || 'Admin'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={handleSave} disabled={saving}>
                {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : 'Save Changes'}
              </Button>
              <SignOutButton />
            </div>
        </div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="md:hidden mb-4">
          <Select value={activeTab} onValueChange={setActiveTab}>
            <SelectTrigger>
              <SelectValue placeholder="Select a section" />
            </SelectTrigger>
            <SelectContent>
              {tabsConfig.map((tab) => (
                <SelectItem key={tab.value} value={tab.value}>{tab.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <TabsList className="hidden md:grid w-full md:grid-cols-5">
           {tabsConfig.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>{tab.label}</TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader><CardTitle>Profile Information</CardTitle></CardHeader>
            <CardContent>
              <ProfileTab {...dashboardProps} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="about">
          <Card>
            <CardHeader><CardTitle>About Section</CardTitle></CardHeader>
            <CardContent>
              <AboutTab {...dashboardProps} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="resume">
          <Card>
            <CardHeader><CardTitle>Resume</CardTitle></CardHeader>
            <CardContent>
              <ResumeTab {...dashboardProps} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="portfolio">
          <Card>
            <CardHeader><CardTitle>Portfolio Projects</CardTitle></CardHeader>
            <CardContent>
              <PortfolioTab {...dashboardProps} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="blog">
          <Card>
            <CardHeader><CardTitle>Blog Posts</CardTitle></CardHeader>
            <CardContent>
              <BlogTab {...dashboardProps} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

    