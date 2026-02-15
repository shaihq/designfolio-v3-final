import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MapPin, Calendar, Banknote, Linkedin, ExternalLink, Building2, X } from "lucide-react";
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
  isMobileOrTablet?: boolean;
}

export const JobDetailSidePanel: React.FC<JobDetailSidePanelProps> = ({ job, isOpen, onClose, isMobileOrTablet }) => {
  if (!job) return null;

  const jobUrl = job.url || job.job_url;
  const isLinkedin = jobUrl?.includes('linkedin.com');
  const isIndeed = jobUrl?.includes('indeed.com');

  const PanelContent = (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-6 border-b border-border pt-[16px] pb-[16px]">
        <div className="flex items-center gap-2">
          {isLinkedin ? (
            <Linkedin className="w-5 h-5 text-[#0A66C2]" />
          ) : isIndeed ? (
            <div className="w-5 h-5 flex items-center justify-center font-bold text-white bg-[#2164f3] text-[12px] rounded-sm">i</div>
          ) : (
            <Building2 className="w-5 h-5 text-black/40" />
          )}
          <h2 className="text-lg font-semibold truncate max-w-[200px]">{job.title}</h2>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="bg-[#F8F7F5] text-[#1A1A1A]/60 border-black/[0.03]">
                {job.job_type || 'Job Opportunity'}
              </Badge>
              {jobUrl && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="rounded-full gap-2 h-7 px-3 text-xs"
                  onClick={() => window.open(jobUrl, '_blank')}
                >
                  Apply Now <ExternalLink className="w-3 h-3" />
                </Button>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex flex-col gap-1.5 text-sm text-[#1A1A1A]/60 font-medium">
                <div className="flex items-center gap-2 text-[#1A1A1A]">
                  <span className="font-semibold">{job.company}</span>
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
                <div className="flex flex-wrap items-center gap-4 mt-1">
                  {job.date_posted && (
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 opacity-50" />
                      <span>{new Date(job.date_posted).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5">
                    <Banknote className="w-3.5 h-3.5 opacity-50" />
                    <span>
                      {job.salary_source ? (
                        <>
                          {job.min_amount && job.max_amount ? (
                            `${job.currency || '$'}${job.min_amount.toLocaleString()} - ${job.max_amount.toLocaleString()}`
                          ) : job.min_amount ? (
                            `From ${job.currency || '$'}${job.min_amount.toLocaleString()}`
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
            </div>
          </div>

          <div className="border-t border-border/50 pt-6">
            <h4 className="text-sm font-semibold text-[#1A1A1A] mb-3 uppercase tracking-wider">Job Description</h4>
            <div 
              className="text-sm text-[#1A1A1A]/80 leading-relaxed space-y-4 prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: job.description || 'No description available.' }}
            />
          </div>
        </div>
      </ScrollArea>

      <div className="p-6 border-t bg-[#F8F7F5]/50 shrink-0">
        <Button 
          className="w-full rounded-full h-11 text-sm font-semibold"
          onClick={() => jobUrl && window.open(jobUrl, '_blank')}
        >
          Apply on {isLinkedin ? 'LinkedIn' : isIndeed ? 'Indeed' : 'Company Website'}
        </Button>
      </div>
    </div>
  );

  if (isMobileOrTablet) {
    return (
      <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <SheetContent className="w-80 p-0 flex flex-col">
          {PanelContent}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div 
      className={`fixed right-0 top-0 h-full bg-white border-l border-border transition-transform duration-300 z-40 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
      style={{ width: '320px' }}
    >
      {PanelContent}
    </div>
  );
};
