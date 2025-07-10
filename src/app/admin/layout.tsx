'use client';
import { SignOutButton } from './components/SignOutButton';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from '@/components/ui/toaster';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <div className="bg-background text-foreground min-h-screen">
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
          <header className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
              <p className="text-muted-foreground">
                Manage your portfolio content here.
              </p>
            </div>
            <SignOutButton />
          </header>
          <main>{children}</main>
        </div>
      <Toaster />
      </div>
    </SessionProvider>
  );
}
