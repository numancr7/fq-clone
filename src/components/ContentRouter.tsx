'use client';

import { useState } from 'react';
import { AboutSection } from '@/components/sections/about';
import { ResumeSection } from '@/components/sections/resume';
import { PortfolioSection } from '@/components/sections/portfolio';
import { BlogSection } from '@/components/sections/blog';
import { Navbar, type SectionId } from '@/components/navbar';

export function ContentRouter({ data }: { data: any }) {
    const [activeSection, setActiveSection] = useState<SectionId>('about');

    const handleSectionChange = (sectionId: SectionId) => {
        setActiveSection(sectionId);
    };

    const renderSection = () => {
        switch (activeSection) {
            case 'about':
                return <AboutSection aboutData={data.about} />;
            case 'resume':
                return <ResumeSection resumeData={data.resume} />;
            case 'portfolio':
                return <PortfolioSection portfolioData={data.portfolio} />;
            case 'blog':
                return <BlogSection blogData={data.blog} />;
            default:
                return <AboutSection aboutData={data.about} />;
        }
    };

    return (
        <div className="relative bg-secondary rounded-2xl shadow-glow">
            <Navbar activeSection={activeSection} onSectionChange={handleSectionChange} />
            <main className="p-[30px] md:pt-24">
                {renderSection()}
            </main>
        </div>
    );
}
