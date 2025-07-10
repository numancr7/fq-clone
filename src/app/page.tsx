"use client";
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { ProfileSidebar } from '@/components/profile-sidebar';

const ClientContentRouter = dynamic(() => import('@/components/ClientContentRouter'), { ssr: false });

export default function Home() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const res = await fetch(`${baseUrl}/api/portfolio`, { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch portfolio data');
        const json = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!data) return null;

  return (
    <div className="max-w-screen-xl mx-auto p-2 md:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <aside className="w-xl lg:col-span-4 lg:sticky lg:top-8">
          <ProfileSidebar personalData={data.personal} />
        </aside>
        <div className="w-full lg:col-span-8">
          <ClientContentRouter data={data} />
        </div>
      </div>
    </div>
  );
} 