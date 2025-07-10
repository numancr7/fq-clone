
import { Award, BookOpen } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface Education {
  institution?: string;
  degree?: string;
  details?: string[];
}

interface Certification {
  name?: string;
  issuer?: string;
}

interface Skill {
  name?: string;
  proficiency?: number | null;
}

interface ResumeData {
  education?: Education[];
  certifications?: Certification[];
  skills?: Skill[];
}

export function ResumeSection({ resumeData }: { resumeData: ResumeData }) {
  return (
    <section id="resume" className="space-y-12">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">Resume</h2>
      </div>

      <div className="space-y-12">
        {/* Education Section */}
        <div>
          <h3 className="flex items-center gap-3 text-2xl font-semibold mb-6">
            <BookOpen className="h-7 w-7 text-primary" />
            Education
          </h3>
          <div className="relative border-l-2 border-border/50 pl-8">
            {resumeData?.education?.map((edu, index) => (
              <div key={index} className="mb-8 relative">
                <div className="absolute -left-[42px] top-1 h-3 w-3 rounded-full bg-primary border-2 border-secondary"></div>
                <h4 className="text-lg font-medium text-primary">{edu.institution || 'Institution not specified'}</h4>
                <p className="font-semibold">{edu.degree || 'Degree not specified'}</p>
                {edu.details && edu.details.length > 0 && (
                  <ul className="mt-2 text-muted-foreground text-sm space-y-1">
                    {edu.details.map((detail, i) => (
                      <li key={i} className="flex items-start">
                        <span className="mr-2 mt-1">•</span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Certifications Section */}
        <div>
          <h3 className="flex items-center gap-3 text-2xl font-semibold mb-6">
            <Award className="h-7 w-7 text-primary" />
            Certifications
          </h3>
          <div className="relative border-l-2 border-border/50 pl-8">
            {resumeData?.certifications?.map((cert, index) => (
              <div key={index} className="mb-6 relative">
                <div className="absolute -left-[42px] top-1.5 h-3 w-3 rounded-full bg-primary border-2 border-secondary"></div>
                <h4 className="text-lg font-medium">{cert.name || 'Certification name not specified'}</h4>
                <p className="text-sm text-muted-foreground">{cert.issuer || 'Issuer not specified'}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Skills Section */}
        <div>
           <h3 className="text-2xl font-semibold mb-8">My Skills</h3>
           <div className="space-y-6">
              {resumeData?.skills?.map((skill, index) => (
                  <div key={index}>
                      <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-foreground/90 text-sm">{skill.name || 'Skill name not specified'}</span>
                          <span className="text-sm text-muted-foreground">{skill.proficiency || 0}%</span>
                      </div>
                      <Progress value={skill.proficiency || 0} />
                  </div>
              ))}
           </div>
        </div>
      </div>
    </section>
  );
}
