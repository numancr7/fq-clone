
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { Separator } from '@/components/ui/separator';
import { PlusCircle, Trash2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PortfolioData } from './types';
import { useSession } from 'next-auth/react';

export function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<{ [key: string]: any }>({});
  const [activeTab, setActiveTab] = useState('profile');
  
  const serviceTitleMaxLength = 25;
  const serviceDescriptionMaxLength = 80;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/portfolio');
        if (!response.ok) {
          throw new Error('Failed to fetch portfolio data');
        }
        const fetchedData = await response.json();
        setData(fetchedData);
        // Pre-populate image previews from fetched data
        const previews = {};
        if (fetchedData.personal?.image) {
          (previews as any)['personal.image'] = fetchedData.personal.image;
        }
        fetchedData.about?.whatIDo?.forEach((s: any, i: any) => {
          if (s.iconUrl) (previews as any)[`about.whatIDo-${i}`] = s.iconUrl;
        });
        setImagePreviews(previews);

      } catch (error: any) {
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
      const saveData = JSON.parse(JSON.stringify(data));
      // Delete fields that are managed elsewhere or are artifacts
      delete saveData._id;
      delete saveData.__v;
      delete saveData.blog;
      delete saveData.portfolio; 

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
      setData(result.data);
      
      toast({
        title: 'Changes Saved',
        description: 'Your changes have been successfully saved to the database.',
      });
    } catch (error: any) {
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

  const handleImageChange = async (e: any, path: any, index: number | null = null, fieldName: string = 'image') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewKey = index !== null ? `${path}-${index}` : path;
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreviews(prev => ({ ...prev, [previewKey]: reader.result as string }));
    };
    reader.readAsDataURL(file);

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

    } catch (error: any) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Upload Error',
        description: 'Could not upload the image. Please try again.',
      });
    }
  };

  const handleResumeUpload = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        toast({
            variant: 'destructive',
            title: 'Invalid File Type',
            description: 'Please upload a JPG or PNG image for the resume.',
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

        let result = await response.json();
        if (!response.ok) {
          throw new Error(result?.error || 'Resume upload failed');
        }

        const newUrl = result.url;
        handleInputChange('personal', 'resumeUrl', newUrl);
        
        toast({
            title: 'Resume Uploaded',
            description: 'Your new resume image has been saved.',
        });

    } catch (error: any) {
        toast({
            variant: 'destructive',
            title: 'Upload Error',
            description: error?.message || 'Could not upload your resume. Please try again.',
        });
    } finally {
        setSaving(false);
    }
  };

  const handleInputChange = (section: any, path: any, value: any) => {
    setData((prev) => {
      if (!prev || typeof prev[section] !== 'object' || prev[section] === null) return prev;
      const newSectionData = { ...(prev[section] as Record<string, any>) };
      let current = newSectionData;
      const keys = path.split('.');
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return { ...prev, [section]: newSectionData };
    });
  };

  const handleArrayChange = (section: any, path: any, index: number, field: string, value: any) => {
    setData((prev) => {
      if (!prev || typeof prev[section] !== 'object' || prev[section] === null) return prev;
      const newSectionData = { ...(prev[section] as Record<string, any>) };
      const newArray = [...newSectionData[path]];
      newArray[index] = { ...newArray[index], [field]: value };
      return {
        ...prev,
        [section]: { ...newSectionData, [path]: newArray },
      };
    });
  };
  
  const addArrayItem = (section: any, path: any, newItem: any) => {
    setData((prev) => {
      if (!prev || typeof prev[section] !== 'object' || prev[section] === null) return prev;
      const newSectionData = { ...(prev[section] as Record<string, any>) };
      const newArray = [...(newSectionData[path] || []), newItem];
      return { ...prev, [section]: { ...newSectionData, [path]: newArray } };
    });
  };

  const removeArrayItem = (section: any, path: any, index: number) => {
    setData((prev) => {
      if (!prev || typeof prev[section] !== 'object' || prev[section] === null) return prev;
      const newSectionData = { ...(prev[section] as Record<string, any>) };
      const newArray = [...newSectionData[path]];
      newArray.splice(index, 1);
      return { ...prev, [section]: { ...newSectionData, [path]: newArray } };
    });
  };

  const handleTabChange = (value: string) => {
    if (value === 'blog') {
      router.push('/admin/blog');
    } else if (value === 'portfolio') {
      router.push('/admin/portfolio');
    }
    else {
      setActiveTab(value);
    }
  };

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

  return (
    <div className="space-y-6">
        <div className="flex justify-end">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : 'Save Changes'}
            </Button>
        </div>
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <div className="md:hidden mb-4">
          <Select value={activeTab} onValueChange={handleTabChange}>
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
            <TabsTrigger key={tab.value} value={tab.value}>
                {tab.value === 'blog' ? <Link href="/admin/blog">{tab.label}</Link> :
                 tab.value === 'portfolio' ? <Link href="/admin/portfolio">{tab.label}</Link> :
                 tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader><CardTitle>Profile Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><Label htmlFor="name">Name</Label><Input id="name" value={data.personal.name} onChange={(e) => handleInputChange('personal', 'name', e.target.value)} /></div>
                <div><Label htmlFor="title">Title</Label><Input id="title" value={data.personal.title} onChange={(e) => handleInputChange('personal', 'title', e.target.value)} /></div>
              </div>
              <div><Label htmlFor="profileImage">Profile Image</Label>
                <Input id="profileImage" type="file" accept="image/*" onChange={(e) => handleImageChange(e, 'personal.image')} />
                {imagePreviews['personal.image'] && <Image src={imagePreviews['personal.image']} alt="Profile Preview" width={100} height={100} className="mt-2 rounded-md object-cover" />}
              </div>
              <Separator/>
              <h3 className="text-lg font-medium">Contact Details</h3>
              {data.personal.contacts.map((contact: any, i: number) => (
                <div key={i} className="p-4 border rounded-lg mb-4 space-y-3 relative">
                    <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => removeArrayItem('personal', 'contacts', i)}><Trash2 className="h-4 w-4" /></Button>
                    <div><Label>Label (e.g., EMAIL)</Label><Input value={contact.label} onChange={(e) => handleArrayChange('personal', 'contacts', i, 'label', e.target.value)} /></div>
                    <div><Label>Text (e.g., name@example.com)</Label><Input value={contact.text} onChange={(e) => handleArrayChange('personal', 'contacts', i, 'text', e.target.value)} /></div>
                    <div><Label>HREF (e.g., mailto:name@example.com)</Label><Input value={contact.href} onChange={(e) => handleArrayChange('personal', 'contacts', i, 'href', e.target.value)} /></div>
                </div>
              ))}
              <Button variant="outline" onClick={() => addArrayItem('personal', 'contacts', { label: '', text: '', href: '' })}><PlusCircle className="mr-2" /> Add Contact</Button>
              <Separator/>
              <h3 className="text-lg font-medium">Social Links</h3>
               {data.personal.socials.map((social: any, i: number) => (
                <div key={i} className="p-4 border rounded-lg mb-4 space-y-3 relative">
                     <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => removeArrayItem('personal', 'socials', i)}><Trash2 className="h-4 w-4" /></Button>
                    <div><Label>Social URL</Label><Input value={social.href} onChange={(e) => handleArrayChange('personal', 'socials', i, 'href', e.target.value)} /></div>
                </div>
               ))}
               <Button variant="outline" onClick={() => addArrayItem('personal', 'socials', { href: ''})}><PlusCircle className="mr-2" /> Add Social</Button>
               <Separator/>
                <h3 className="text-lg font-medium">Resume File</h3>
                <div>
                  <Label htmlFor="resumeFile">Upload Resume (JPG/PNG)</Label>
                  <Input id="resumeFile" type="file" accept="image/jpeg,image/png,image/jpg" onChange={(e) => handleResumeUpload(e)} />
                  {data.personal.resumeUrl && (
                      <p className="text-sm text-muted-foreground mt-2">
                          Current resume: 
                          <a href={data.personal.resumeUrl} target="_blank" rel="noopener noreferrer">
                            <img src={data.personal.resumeUrl} alt="Resume Preview" className="max-w-xs mt-2 rounded border cursor-pointer hover:shadow-lg" />
                          </a>
                      </p>
                  )}
                </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="about">
            <Card>
                <CardHeader><CardTitle>About Section</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                    <div><Label htmlFor="about-text">About Me Bio</Label><Textarea id="about-text" value={data.about.aboutText} onChange={(e) => handleInputChange('about', 'aboutText', e.target.value)} rows={5} /></div>
                    <Separator />
                    <div>
                        <h3 className="text-lg font-medium mb-2">Services ("What I'm Doing")</h3>
                        {data.about.whatIDo.map((service: any, i: number) => (
                            <div key={i} className="p-4 border rounded-lg mb-4 space-y-3 relative">
                                <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => removeArrayItem('about', 'whatIDo', i)}><Trash2 className="h-4 w-4" /></Button>
                                <div>
                                    <Label htmlFor={`service-title-${i}`}>Title</Label>
                                    <Input 
                                      id={`service-title-${i}`}
                                      value={service.title} 
                                      onChange={(e) => handleArrayChange('about', 'whatIDo', i, 'title', e.target.value)} 
                                      maxLength={serviceTitleMaxLength}
                                    />
                                    <p className="text-xs text-muted-foreground text-right">{service.title?.length || 0} / {serviceTitleMaxLength}</p>
                                </div>
                                <div>
                                    <Label htmlFor={`service-desc-${i}`}>Description</Label>
                                    <Textarea 
                                      id={`service-desc-${i}`}
                                      value={service.description} 
                                      onChange={(e) => handleArrayChange('about', 'whatIDo', i, 'description', e.target.value)}
                                      maxLength={serviceDescriptionMaxLength}
                                    />
                                     <p className="text-xs text-muted-foreground text-right">{service.description?.length || 0} / {serviceDescriptionMaxLength}</p>
                                </div>
                                <div>
                                    <Label htmlFor={`serviceIcon-${i}`}>Service Icon (PNG)</Label>
                                    <Input id={`serviceIcon-${i}`} type="file" accept="image/png" onChange={(e) => handleImageChange(e, 'about.whatIDo', i, 'iconUrl')} />
                                    {(imagePreviews[`about.whatIDo-${i}`] || service.iconUrl) && (
                                        <div className="mt-2 p-2 border rounded-md inline-block">
                                            <Image src={imagePreviews[`about.whatIDo-${i}`] || service.iconUrl} alt="Service Icon Preview" width={40} height={40} className="rounded-md object-contain" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                         <Button variant="outline" onClick={() => addArrayItem('about', 'whatIDo', { title: 'New Service', description: 'Description', iconUrl: '' })}><PlusCircle className="mr-2" /> Add Service</Button>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
        
        <TabsContent value="resume">
          <Card>
              <CardHeader><CardTitle>Resume</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                   <div>
                      <h3 className="text-lg font-medium mb-2">Education</h3>
                      {data.resume.education.map((edu: any, i: number) => (
                          <div key={i} className="p-4 border rounded-lg mb-4 space-y-3 relative">
                              <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => removeArrayItem('resume', 'education', i)}><Trash2 className="h-4 w-4" /></Button>
                              <div><Label>Institution</Label><Input value={edu.institution} onChange={(e) => handleArrayChange('resume', 'education', i, 'institution', e.target.value)} /></div>
                              <div><Label>Degree</Label><Input value={edu.degree} onChange={(e) => handleArrayChange('resume', 'education', i, 'degree', e.target.value)} /></div>
                              <div><Label>Details (comma-separated)</Label><Input value={edu.details.join(', ')} onChange={(e) => handleArrayChange('resume', 'education', i, 'details', e.target.value.split(',').map(d => d.trim()))} /></div>
                          </div>
                      ))}
                      <Button variant="outline" onClick={() => addArrayItem('resume', 'education', { institution: '', degree: '', details: []})}><PlusCircle className="mr-2" /> Add Education</Button>
                  </div>
                  <Separator/>
                   <div>
                      <h3 className="text-lg font-medium mb-2">Certifications</h3>
                      {data.resume.certifications.map((cert: any, i: number) => (
                          <div key={i} className="p-4 border rounded-lg mb-4 space-y-3 relative">
                              <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => removeArrayItem('resume', 'certifications', i)}><Trash2 className="h-4 w-4" /></Button>
                              <div><Label>Name</Label><Input value={cert.name} onChange={(e) => handleArrayChange('resume', 'certifications', i, 'name', e.target.value)} /></div>
                              <div><Label>Issuer</Label><Input value={cert.issuer} onChange={(e) => handleArrayChange('resume', 'certifications', i, 'issuer', e.target.value)} /></div>
                          </div>
                      ))}
                      <Button variant="outline" onClick={() => addArrayItem('resume', 'certifications', { name: '', issuer: ''})}><PlusCircle className="mr-2" /> Add Certification</Button>
                  </div>
                  <Separator/>
                  <div>
                      <h3 className="text-lg font-medium mb-2">Skills</h3>
                      {data.resume.skills.map((skill: any, i: number) => (
                          <div key={i} className="flex items-center gap-4 mb-2 p-2 border rounded-lg">
                              <Input placeholder="Skill Name" value={skill.name} onChange={(e) => handleArrayChange('resume', 'skills', i, 'name', e.target.value)} />
                               <Input
                                type="number"
                                placeholder="Proficiency (0-100)"
                                value={skill.proficiency ?? ''}
                                onChange={(e) => {
                                    const rawValue = e.target.value;
                                    if (rawValue === '') {
                                      handleArrayChange('resume', 'skills', i, 'proficiency', null);
                                    } else {
                                      const parsedValue = parseInt(rawValue.replace(/[^0-9]/g, ''), 10);
                                      if (!isNaN(parsedValue)) {
                                          handleArrayChange('resume', 'skills', i, 'proficiency', parsedValue);
                                      }
                                    }
                                }}
                              />
                              <Button variant="destructive" size="icon" onClick={() => removeArrayItem('resume', 'skills', i)}><Trash2 className="h-4 w-4" /></Button>
                          </div>
                      ))}
                      <Button variant="outline" onClick={() => addArrayItem('resume', 'skills', { name: 'New Skill', proficiency: 50 })}><PlusCircle className="mr-2" /> Add Skill</Button>
                  </div>
              </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
