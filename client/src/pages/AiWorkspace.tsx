import { Link, useLocation } from "wouter";
import { Home, FileText, Users, DollarSign, Mail } from "lucide-react";
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

const navItems: CarouselItem[] = [
  { id: 1, title: "Resume Fixer", icon: FileText, description: "Optimize your resume for ATS and impact." },
  { id: 2, title: "Mock Interview", icon: Users, description: "Practice with AI-driven interview questions." },
  { id: 3, title: "Salary Negotiation", icon: DollarSign, description: "Get data-backed negotiation strategies." },
  { id: 4, title: "Email Generator", icon: Mail, description: "Draft professional outreach and follow-ups." },
];

export default function AiWorkspace() {
  const [, setLocation] = useLocation();
  const [selectedTool, setSelectedTool] = useState(0);

  const currentTool = navItems[selectedTool];

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
          <div className="space-y-6">
            <h1 className="text-4xl font-bold text-foreground font-serif">Career Workspace</h1>
            <p className="text-lg text-muted-foreground">
              Welcome to your AI-powered career assistant workspace. 
              Select a tool to get started.
            </p>
            
            <Card className="border-2 border-border/60 rounded-3xl bg-white/40 backdrop-blur-sm shadow-sm">
              <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                <div className="p-2 bg-primary/10 rounded-xl">
                  {currentTool.icon && <currentTool.icon className="w-6 h-6 text-primary" />}
                </div>
                <CardTitle className="text-2xl font-serif">{currentTool.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  {currentTool.description}
                </p>
                <div className="p-8 border-2 border-dashed border-border/40 rounded-2xl flex items-center justify-center bg-white/20">
                  <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    {currentTool.title} Form coming soon
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
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
