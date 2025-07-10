
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { Bot, Loader2, FileText, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { summarizeBlogPost, SummarizeBlogPostInput } from '@/ai/flows/summarize-blog-post';
import { useToast } from '@/hooks/use-toast';

interface BlogPost {
  title?: string;
  description?: string;
  image?: string;
  date?: string;
  content?: string;
  url?: string;
  dataAiHint?: string;
}

interface BlogData {
  posts?: BlogPost[];
}

export function BlogSection({ blogData }: { blogData: BlogData }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState('');
  const [isDialogVisible, setIsDialogVisible] = useState(false);

  const handleSummarize = async (content: string) => {
    setLoading(true);
    setSummary('');
    setIsDialogVisible(true);
    try {
      const input: SummarizeBlogPostInput = { blogPostContent: content };
      const result = await summarizeBlogPost(input);
      setSummary(result.summary);
    } catch (error) {
      console.error('Summarization failed:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate summary. Please try again.',
        variant: 'destructive',
      });
      setIsDialogVisible(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="blog" className="space-y-12">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">Blog</h2>
        <p className="mt-4 text-lg text-muted-foreground">
          My thoughts on data, technology, and everything in between.
        </p>
      </div>
      <div className="grid gap-8 md:grid-cols-2">
        {blogData?.posts?.map((post: BlogPost, index: number) => (
          <Card key={index} className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl">
            <CardHeader className="p-0">
               <div className="relative h-60 w-full">
                <Image
                  src={post.image || '/placeholder-image.jpg'}
                  alt={post.title || 'Blog post'}
                  layout="fill"
                  objectFit="cover"
                  data-ai-hint={post.dataAiHint || 'blog post'}
                />
              </div>
            </CardHeader>
            <CardContent className="flex-grow p-6">
              <p className="mb-2 text-sm text-muted-foreground">
                {post.date ? (() => {
                  try {
                    const date = new Date(post.date);
                    if (isNaN(date.getTime())) {
                      return 'Date not available';
                    }
                    return format(date, 'MMMM d, yyyy');
                  } catch (error) {
                    return 'Date not available';
                  }
                })() : 'Date not available'}
              </p>
              <CardTitle className="mb-2">{post.title || 'Untitled Post'}</CardTitle>
              <p className="text-muted-foreground line-clamp-2">{post.description || 'No description available'}</p>
            </CardContent>
            <CardFooter className="flex justify-between p-6 pt-0">
              <Button variant="outline" onClick={() => handleSummarize(post.content || '')}>
                <Bot className="mr-2 h-4 w-4" />
                Summarize
              </Button>
              <Link href={post.url || '#'} target="_blank" rel="noopener noreferrer">
                <Button variant="ghost">
                  Read More
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      <AlertDialog open={isDialogVisible} onOpenChange={setIsDialogVisible}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Blog Post Summary
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
                <div className="pt-4 max-h-[60vh] overflow-y-auto pr-2">
                {loading ? (
                    <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <p className="text-foreground">{summary}</p>
                )}
                </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}

    