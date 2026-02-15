import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MapPin, Calendar, Banknote, Linkedin, ExternalLink, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Job {
  title: string;
  company: string;
  location?: string;
  date_posted?: string;
  salary_source?: string;
  min_amount?: number;
  max_amount?: number;
  currency?: string;
  interval?: string;
  job_type?: string;
  description?: string;
  job_url?: string;
  url?: string;
}

interface JobDetailSidePanelProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
}

export const JobDetailSidePanel: React.FC<JobDetailSidePanelProps> = ({ job, isOpen, onClose }) => {
  if (!job) return null;

  const jobUrl = job.url || job.job_url;
  const isLinkedin = jobUrl?.includes('linkedin.com');
  const isIndeed = jobUrl?.includes('indeed.com');

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-xl w-full p-0 flex flex-col h-full bg-white">
        <SheetHeader className="p-6 border-b shrink-0 text-left">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              {isLinkedin ? (
                <Linkedin className="w-5 h-5 text-[#0A66C2]" />
              ) : isIndeed ? (
                <div className="w-5 h-5 flex items-center justify-center font-bold text-white bg-[#2164f3] text-[12px] rounded-sm">i</div>
              ) : (
                <Building2 className="w-5 h-5 text-black/40" />
              )}
              <Badge variant="secondary" className="bg-[#F8F7F5] text-[#1A1A1A]/60 border-black/[0.03]">
                {job.job_type || 'Job Opportunity'}
              </Badge>
            </div>
            {jobUrl && (
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-full gap-2"
                onClick={() => window.open(jobUrl, '_blank')}
              >
                Apply Now <ExternalLink className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>
          <SheetTitle className="text-2xl font-bold text-[#1A1A1A] leading-tight mb-2">
            {job.title}
          </SheetTitle>
          <div className="flex flex-col gap-1.5 text-sm text-[#1A1A1A]/60 font-medium">
            <div className="flex items-center gap-2">
              <span className="text-[#1A1A1A]">{job.company}</span>
              {job.location && (
                <>
                  <span className="opacity-30">•</span>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 opacity-50" />
                    <span>{job.location}</span>
                  </div>
                </>
              )}
            </div>
            <div className="flex items-center gap-4 mt-1">
              {job.date_posted && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 opacity-50" />
                  <span>Posted {new Date(job.date_posted).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <Banknote className="w-3.5 h-3.5 opacity-50" />
                <span>
                  {job.salary_source ? (
                    <>
                      {job.min_amount && job.max_amount ? (
                        `${job.currency || '$'}${job.min_amount.toLocaleString()} - ${job.max_amount.toLocaleString()}${job.interval ? `/${job.interval}` : ''}`
                      ) : job.min_amount ? (
                        `From ${job.currency || '$'}${job.min_amount.toLocaleString()}${job.interval ? `/${job.interval}` : ''}`
                      ) : (
                        'Salary mentioned'
                      )}
                    </>
                  ) : (
                    'Salary not mentioned'
                  )}
                </span>
              </div>
            </div>
          </div>
        </SheetHeader>
        
        <ScrollArea className="flex-1 p-6">
          <div className="space-y-6">
            <section>
              <h4 className="text-base font-semibold text-[#1A1A1A] mb-3">Job Description</h4>
              <div 
                className="text-[15px] text-[#1A1A1A]/80 leading-relaxed space-y-4 prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: job.description || 'No description available.' }}
              />
            </section>
          </div>
        </ScrollArea>

        <div className="p-6 border-t bg-[#F8F7F5]/50 shrink-0">
          <Button 
            className="w-full rounded-full h-12 text-base font-semibold"
            onClick={() => jobUrl && window.open(jobUrl, '_blank')}
          >
            Apply on {isLinkedin ? 'LinkedIn' : isIndeed ? 'Indeed' : 'Company Website'}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
