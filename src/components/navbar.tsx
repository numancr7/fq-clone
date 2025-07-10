'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';

export type SectionId = 'about' | 'resume' | 'portfolio' | 'blog';

interface NavbarProps {
  activeSection: SectionId;
  onSectionChange: (sectionId: SectionId) => void;
}

const navLinks: { id: SectionId; label: string }[] = [
  { id: 'about', label: 'About' },
  { id: 'resume', label: 'Resume' },
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'blog', label: 'Blog' },
];

export function Navbar({ activeSection, onSectionChange }: NavbarProps) {
  return (
    <>
      {/* Desktop Navbar: floating at the top-right */}
      <nav className="hidden md:flex absolute top-0 right-0 w-auto justify-end p-4 z-10 rounded-bl-2xl rounded-tr-2xl bg-card/95 backdrop-blur-sm border-b border-l border-border/10">          {navLinks.map((link) => (
            <Button
              key={link.id}
              type="button"
              variant={'ghost'}
              onClick={() => onSectionChange(link.id)}
              className={cn(
                'rounded-lg px-4 py-1.5 transition-colors text-sm font-medium',
                activeSection === link.id
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-primary'
              )}
            >
              {link.label}
            </Button>
          ))}
          <div className="ml-2">
            <ThemeToggle />
          </div>
      </nav>

      {/* Mobile Navbar: fixed and floating at the bottom */}
      <nav className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-20 bg-card/70 backdrop-blur-md p-1.5 rounded-xl border border-border/20 shadow-lg">
        <div className="flex items-center">
          {navLinks.map((link) => (
            <Button
              key={link.id}
              type="button"
              variant={'ghost'}
              onClick={() => onSectionChange(link.id)}
              className={cn(
                'rounded-lg px-4 py-1.5 transition-colors text-sm font-medium',
                activeSection === link.id
                  ? 'text-primary bg-muted'
                  : 'text-muted-foreground hover:text-primary'
              )}
            >
              {link.label}
            </Button>
          ))}
          <div className="ml-1">
            <ThemeToggle />
          </div>
        </div>
      </nav>
    </>
  );
}
