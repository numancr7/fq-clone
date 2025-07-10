'use client';

import { SessionProvider } from 'next-auth/react';
import { Toaster } from '@/components/ui/toaster';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-6">
          {children}
        </div>
        <Toaster />
      </div>
    </SessionProvider>
  );
}
