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
        const res = await fetch('/api/portfolio', { cache: 'no-store' });
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
    <div className="max-w-screen-xl mx-auto p-4 md:p-8">
            <div className="flex flex-col gap-8">
                {/* Mobile and Horizontal Sidebar for Medium/Large Screens */}
                <div className="block lg:hidden">
                    <ProfileSidebar personalData={data.personal} layout="horizontal" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Vertical Sidebar for XL Screens */}
                    <aside className="w-full lg:col-span-3 lg:sticky lg:top-8 hidden lg:block">
                        <ProfileSidebar personalData={data.personal} layout="vertical" />
                    </aside>
                    <div className="w-full lg:col-span-9 relative">

                <ClientContentRouter data={data} />
            </div>
        </div>
    </div>
</div>
  );
} 






