import { Link, useLocation } from "wouter";
import { Home, FileText, Users, DollarSign, Mail, Upload, Send } from "lucide-react";
import { RulerCarousel, type CarouselItem } from "@/components/ui/ruler-carousel";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface WorkspaceTool extends CarouselItem {
  icon: LucideIcon;
  description: string;
}

const navItems: WorkspaceTool[] = [
  { id: 1, title: "Resume Fixer", icon: FileText, description: "Optimize your resume for ATS and impact." },
  { id: 2, title: "Mock Interview", icon: Users, description: "Practice with AI-driven interview questions." },
  { id: 3, title: "Salary Negotiation", icon: DollarSign, description: "Get data-backed negotiation strategies." },
  { id: 4, title: "Email Generator", icon: Mail, description: "Draft professional outreach and follow-ups." },
];

export default function AiWorkspace() {
  const [, setLocation] = useLocation();
  const [selectedTool, setSelectedTool] = useState(0);

  const currentTool = navItems[selectedTool];

  const renderToolForm = () => {
    switch (currentTool.id) {
      case 1: // Resume Fixer
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="space-y-2">
              <Label htmlFor="resume" className="text-sm font-medium text-foreground ml-1">Upload Resume</Label>
              <div className="bg-white dark:bg-white border-2 border-border rounded-full hover:border-foreground/20 focus-within:border-foreground/30 focus-within:shadow-[0_0_0_4px_hsl(var(--foreground)/0.12)] transition-all duration-300 ease-out">
                <div className="flex items-center gap-2 px-4">
                  <Input id="resume" type="file" className="border-0 bg-transparent h-11 px-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-base text-foreground cursor-pointer" />
                  <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full hover:bg-muted/50 transition-colors"><Upload className="w-4 h-4" /></Button>
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold ml-1">PDF or DOCX supported (Max 5MB)</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="job-desc" className="text-sm font-medium text-foreground ml-1">Target Job Description (Optional)</Label>
              <div className="bg-white dark:bg-white border-2 border-border rounded-2xl hover:border-foreground/20 focus-within:border-foreground/30 focus-within:shadow-[0_0_0_4px_hsl(var(--foreground)/0.12)] transition-all duration-300 ease-out overflow-hidden">
                <Textarea id="job-desc" placeholder="Paste the job description here..." className="border-0 bg-transparent min-h-[100px] px-4 py-3 focus-visible:ring-0 focus-visible:ring-offset-0 text-base text-foreground placeholder:text-muted-foreground/60 resize-none" />
              </div>
            </div>
            <Button className="w-full bg-foreground text-background hover:bg-foreground/90 focus-visible:outline-none border-0 rounded-full h-11 px-6 text-base font-semibold transition-colors">Analyze Resume</Button>
          </div>
        );
      case 2: // Mock Interview
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="space-y-2">
              <Label htmlFor="role" className="text-sm font-medium text-foreground ml-1">Target Role</Label>
              <div className="bg-white dark:bg-white border-2 border-border rounded-full hover:border-foreground/20 focus-within:border-foreground/30 focus-within:shadow-[0_0_0_4px_hsl(var(--foreground)/0.12)] transition-all duration-300 ease-out">
                <Input id="role" placeholder="e.g. Senior Product Designer" className="border-0 bg-transparent h-11 px-4 focus-visible:ring-0 focus-visible:ring-offset-0 text-base text-foreground placeholder:text-muted-foreground/60" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="focus" className="text-sm font-medium text-foreground ml-1">Interview Focus</Label>
              <div className="bg-white dark:bg-white border-2 border-border rounded-full hover:border-foreground/20 focus-within:border-foreground/30 focus-within:shadow-[0_0_0_4px_hsl(var(--foreground)/0.12)] transition-all duration-300 ease-out">
                <Input id="focus" placeholder="Behavioral, Technical, Case Study" className="border-0 bg-transparent h-11 px-4 focus-visible:ring-0 focus-visible:ring-offset-0 text-base text-foreground placeholder:text-muted-foreground/60" />
              </div>
            </div>
            <Button className="w-full bg-foreground text-background hover:bg-foreground/90 focus-visible:outline-none border-0 rounded-full h-11 px-6 text-base font-semibold transition-colors">Start Practice Session</Button>
          </div>
        );
      case 3: // Salary Negotiation
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="current-offer" className="text-sm font-medium text-foreground ml-1">Current Offer ($)</Label>
                <div className="bg-white dark:bg-white border-2 border-border rounded-full hover:border-foreground/20 focus-within:border-foreground/30 focus-within:shadow-[0_0_0_4px_hsl(var(--foreground)/0.12)] transition-all duration-300 ease-out">
                  <Input id="current-offer" type="number" placeholder="120000" className="border-0 bg-transparent h-11 px-4 focus-visible:ring-0 focus-visible:ring-offset-0 text-base text-foreground placeholder:text-muted-foreground/60" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location" className="text-sm font-medium text-foreground ml-1">Location</Label>
                <div className="bg-white dark:bg-white border-2 border-border rounded-full hover:border-foreground/20 focus-within:border-foreground/30 focus-within:shadow-[0_0_0_4px_hsl(var(--foreground)/0.12)] transition-all duration-300 ease-out">
                  <Input id="location" placeholder="e.g. New York, NY" className="border-0 bg-transparent h-11 px-4 focus-visible:ring-0 focus-visible:ring-offset-0 text-base text-foreground placeholder:text-muted-foreground/60" />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm font-medium text-foreground ml-1">Additional Perks/Context</Label>
              <div className="bg-white dark:bg-white border-2 border-border rounded-2xl hover:border-foreground/20 focus-within:border-foreground/30 focus-within:shadow-[0_0_0_4px_hsl(var(--foreground)/0.12)] transition-all duration-300 ease-out overflow-hidden">
                <Textarea id="notes" placeholder="Mention equity, bonuses, or other benefits..." className="border-0 bg-transparent min-h-[100px] px-4 py-3 focus-visible:ring-0 focus-visible:ring-offset-0 text-base text-foreground placeholder:text-muted-foreground/60 resize-none" />
              </div>
            </div>
            <Button className="w-full bg-foreground text-background hover:bg-foreground/90 focus-visible:outline-none border-0 rounded-full h-11 px-6 text-base font-semibold transition-colors">Generate Strategy</Button>
          </div>
        );
      case 4: // Email Generator
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="space-y-2">
              <Label htmlFor="recipient" className="text-sm font-medium text-foreground ml-1">To</Label>
              <div className="bg-white dark:bg-white border-2 border-border rounded-full hover:border-foreground/20 focus-within:border-foreground/30 focus-within:shadow-[0_0_0_4px_hsl(var(--foreground)/0.12)] transition-all duration-300 ease-out">
                <Input id="recipient" placeholder="Hiring Manager Name" className="border-0 bg-transparent h-11 px-4 focus-visible:ring-0 focus-visible:ring-offset-0 text-base text-foreground placeholder:text-muted-foreground/60" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="purpose" className="text-sm font-medium text-foreground ml-1">Email Purpose</Label>
              <div className="bg-white dark:bg-white border-2 border-border rounded-full hover:border-foreground/20 focus-within:border-foreground/30 focus-within:shadow-[0_0_0_4px_hsl(var(--foreground)/0.12)] transition-all duration-300 ease-out">
                <Input id="purpose" placeholder="e.g. Networking, Follow-up" className="border-0 bg-transparent h-11 px-4 focus-visible:ring-0 focus-visible:ring-offset-0 text-base text-foreground placeholder:text-muted-foreground/60" />
              </div>
            </div>
            <Button className="w-full bg-foreground text-background hover:bg-foreground/90 focus-visible:outline-none border-0 rounded-full h-11 px-6 text-base font-semibold transition-colors gap-2">
              Generate Draft <Send className="w-4 h-4" />
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "#F1EDE2" }}>
      {/* Breadcrumb Navigation */}
      <header className="p-4 flex items-center">
        <Breadcrumb>
          <BreadcrumbList className="rounded-lg border border-border bg-background px-3 py-2 shadow-sm shadow-black/5">
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">
                  <Home size={16} strokeWidth={2} aria-hidden="true" />
                  <span className="sr-only">Home</span>
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Career Workspace</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto pb-32 flex justify-center">
        <div className="w-fit max-w-2xl">
          <Card className="border border-border/40 rounded-[2rem] bg-[#E5E1D5] shadow-none overflow-hidden p-2">
            <div className="flex items-center gap-3 px-6 py-4">
              <div className="flex items-center justify-center">
                {currentTool.id === 2 ? (
                  <svg width="40" height="40" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                    <path d="M30.48 28.96H24.38V25.91H27.43V24.38H24.38V22.86H25.91V21.34H24.38V18.29H27.43V16.77H24.38V15.24H22.86V16.77H19.81V18.29H22.86V21.34H21.33V22.86H22.86V24.38H19.81V25.91H22.86V28.96H9.14V25.91H12.19V24.38H9.14V22.86H10.67V21.34H9.14V18.29H12.19V16.77H9.14V15.24H10.67V13.72H9.14V10.67H7.62V13.72H6.1V15.24H7.62V16.77H4.57V18.29H7.62V21.34H6.1V22.86H7.62V24.38H4.57V25.91H7.62V28.96H1.52V30.48H0V32H32V30.48H30.48V28.96Z" fill="currentColor"/>
                    <path d="M27.4299 24.38H28.9499V19.81H25.9099V21.34H27.4299V24.38Z" fill="currentColor"/>
                    <path d="M27.4299 16.77H28.9499V12.19H25.9099V13.72H27.4299V16.77Z" fill="currentColor"/>
                    <path d="M28.9499 4.57001H27.4299V6.10001H28.9499V4.57001Z" fill="currentColor"/>
                    <path d="M27.4299 7.62H25.9099V9.14999H27.4299V7.62Z" fill="currentColor"/>
                    <path d="M27.4299 1.53003H25.9099V3.05003H27.4299V1.53003Z" fill="currentColor"/>
                    <path d="M25.9099 13.72H24.3799V15.24H25.9099V13.72Z" fill="currentColor"/>
                    <path d="M24.3801 9.15002H22.8601V10.67H24.3801V9.15002Z" fill="currentColor"/>
                    <path d="M24.3801 0H22.8601V1.53H24.3801V0Z" fill="currentColor"/>
                    <path d="M22.8601 13.72H21.3301V15.24H22.8601V13.72Z" fill="currentColor"/>
                    <path d="M25.9101 3.04999H21.3301V7.61999H25.9101V3.04999Z" fill="currentColor"/>
                    <path d="M21.3301 7.62H19.8101V9.14999H21.3301V7.62Z" fill="currentColor"/>
                    <path d="M21.3301 1.53003H19.8101V3.05003H21.3301V1.53003Z" fill="currentColor"/>
                    <path d="M21.33 21.34V19.81H18.29V24.38H19.81V21.34H21.33Z" fill="currentColor"/>
                    <path d="M21.33 13.72V12.19H18.29V16.77H19.81V13.72H21.33Z" fill="currentColor"/>
                    <path d="M19.81 4.57001H18.29V6.10001H19.81V4.57001Z" fill="currentColor"/>
                    <path d="M12.1899 24.38H13.7199V19.81H10.6699V21.34H12.1899V24.38Z" fill="currentColor"/>
                    <path d="M12.1899 16.77H13.7199V12.19H10.6699V13.72H12.1899V16.77Z" fill="currentColor"/>
                    <path d="M12.1899 7.62H10.6699V9.14999H12.1899V7.62Z" fill="currentColor"/>
                    <path d="M10.6699 9.15002H9.13989V10.67H10.6699V9.15002Z" fill="currentColor"/>
                    <path d="M7.6201 9.15002H6.1001V10.67H7.6201V9.15002Z" fill="currentColor"/>
                    <path d="M6.10007 7.62H4.57007V9.14999H6.10007V7.62Z" fill="currentColor"/>
                    <path d="M6.10005 21.34V19.81H3.05005V24.38H4.57005V21.34H6.10005Z" fill="currentColor"/>
                    <path d="M6.10005 13.72V12.19H3.05005V16.77H4.57005V13.72H6.10005Z" fill="currentColor"/>
                  </svg>
                ) : (
                  <div className="p-2 bg-primary/10 rounded-xl">
                    <currentTool.icon className="w-5 h-5 text-primary" />
                  </div>
                )}
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-serif text-foreground/90 leading-tight whitespace-nowrap">{currentTool.title}</h1>
                <p className="text-muted-foreground text-xs whitespace-nowrap">
                  {currentTool.description}
                </p>
              </div>
            </div>
            
            <div className="bg-white/60 backdrop-blur-xl rounded-[1.75rem] border border-white/40 shadow-sm p-6 min-h-[300px]">
              <div className="w-full">
                {renderToolForm()}
              </div>
            </div>
          </Card>
        </div>
      </main>

      {/* Ruler Carousel Navigation */}
      <div className="fixed bottom-0 inset-x-0 bg-transparent py-3 z-50">
        <RulerCarousel 
          originalItems={navItems}
          onItemSelect={(index) => {
            setSelectedTool(index);
          }}
        />
      </div>
    </div>
  );
}
