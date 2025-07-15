
import { Card } from '@/components/ui/card';
import { type LucideIcon, BarChart, Code, Smartphone } from 'lucide-react';
import Image from 'next/image';

interface AboutItem {
  title?: string;
  description?: string;
  iconUrl?: string;
}

interface AboutData {
  aboutText?: string;
  whatIDo?: AboutItem[];
}

// Helper to map string names to icon components
const iconMap: { [key: string]: LucideIcon } = {
  BarChart,
  Code,
  Smartphone
};

export function AboutSection({ aboutData }: { aboutData: AboutData }) {
  const getServiceIconName = (title: string) => {
    if (title.toLowerCase().includes('analysis')) return 'BarChart';
    if (title.toLowerCase().includes('develop')) return 'Code';
    if (title.toLowerCase().includes('design')) return 'Smartphone';
    return 'BarChart';
  }

  return (
    <section id="about" className="space-y-12">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">About Me</h2>
        <p className="mt-4 text-lg text-muted-foreground whitespace-pre-line">
          {aboutData?.aboutText || 'About me information not available.'}
        </p>
      </div>

      <div>
        <h3 className="text-2xl font-bold tracking-tight sm:text-3xl">What I&apos;m Doing</h3>
        <div className="mt-6 grid grid-cols-1 gap-y-4 gap-x-6 md:grid-cols-2">
          {aboutData?.whatIDo?.map((item, index) => {
            const IconComponent = iconMap[getServiceIconName(item.title || '')];
            return (
              <Card key={index} className="w-full transform transition-transform duration-300 hover:scale-105 hover:shadow-xl p-6">
                 <div className="flex items-start gap-4">
                      <div className="text-primary mt-1 flex-shrink-0">
                          {item.iconUrl ? (
                             <Image src={item.iconUrl} alt={`${item.title || 'Service'} icon`} width={32} height={32} className="h-8 w-8 object-contain" />
                          ) : (
                            IconComponent && <IconComponent className="h-8 w-8" />
                          )}
                      </div>
                      <div className="overflow-hidden">
                          <h4 className="font-bold text-lg text-foreground mb-1 truncate">{item.title || 'Untitled Service'}</h4>
                          <p className="text-muted-foreground text-sm line-clamp-2">{item.description || 'No description available'}</p>
                      </div>
                  </div>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  );
}
