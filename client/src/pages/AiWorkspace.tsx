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
              <Label htmlFor="resume">Upload Resume</Label>
              <div className="flex items-center gap-2">
                <Input id="resume" type="file" className="cursor-pointer" />
                <Button size="icon" variant="outline"><Upload className="w-4 h-4" /></Button>
              </div>
              <p className="text-xs text-muted-foreground">PDF or DOCX supported (Max 5MB)</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="job-desc">Target Job Description (Optional)</Label>
              <Textarea id="job-desc" placeholder="Paste the job description here for better matching..." className="min-h-[100px]" />
            </div>
            <Button className="w-full">Analyze Resume</Button>
          </div>
        );
      case 2: // Mock Interview
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="space-y-2">
              <Label htmlFor="role">Target Role</Label>
              <Input id="role" placeholder="e.g. Senior Product Designer" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="focus">Interview Focus</Label>
              <Input id="focus" placeholder="e.g. Behavioral, Technical, Case Study" />
            </div>
            <Button className="w-full">Start Practice Session</Button>
          </div>
        );
      case 3: // Salary Negotiation
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="current-offer">Current Offer ($)</Label>
                <Input id="current-offer" type="number" placeholder="120000" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="e.g. New York, NY" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Additional Perks/Context</Label>
              <Textarea id="notes" placeholder="Mention equity, bonuses, or other benefits..." />
            </div>
            <Button className="w-full">Generate Strategy</Button>
          </div>
        );
      case 4: // Email Generator
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="space-y-2">
              <Label htmlFor="recipient">To</Label>
              <Input id="recipient" placeholder="Hiring Manager / Recruiter Name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="purpose">Email Purpose</Label>
              <Input id="purpose" placeholder="e.g. Networking, Follow-up after interview" />
            </div>
            <Button className="w-full gap-2">
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
      <main className="flex-1 p-8 overflow-y-auto pb-32">
        <div className="max-w-4xl mx-auto">
          <Card className="border border-border/40 rounded-[2.5rem] bg-white/40 backdrop-blur-md shadow-2xl shadow-black/5 overflow-hidden p-3">
            <div className="flex items-center gap-4 px-8 py-6">
              <div className="p-3 bg-primary/10 rounded-2xl">
                <currentTool.icon className="w-6 h-6 text-primary" />
              </div>
              <div className="flex flex-col gap-0.5">
                <h1 className="text-2xl font-serif text-foreground/90 leading-tight">{currentTool.title}</h1>
                <p className="text-muted-foreground text-sm">
                  {currentTool.description}
                </p>
              </div>
            </div>
            
            <div className="bg-white/60 backdrop-blur-xl rounded-[2rem] border border-white/40 shadow-sm p-8 min-h-[400px]">
              <div className="max-w-xl mx-auto">
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
