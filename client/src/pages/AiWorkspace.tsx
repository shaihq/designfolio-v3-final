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
        <div className="w-full max-w-2xl">
          <Card className="border border-border/40 rounded-[2rem] bg-[#E5E1D5] shadow-none overflow-hidden p-2">
            <div className="flex items-center gap-3 px-6 py-4">
              <div className="p-2 bg-primary/10 rounded-xl">
                <currentTool.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-serif text-foreground/90 leading-tight">{currentTool.title}</h1>
                <p className="text-muted-foreground text-xs">
                  {currentTool.description}
                </p>
              </div>
            </div>
            
            <div className="bg-white/60 backdrop-blur-xl rounded-[1.75rem] border border-white/40 shadow-sm p-6 min-h-[300px]">
              <div className="max-w-md mx-auto">
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
