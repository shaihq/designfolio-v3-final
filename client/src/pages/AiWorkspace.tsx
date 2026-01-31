import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { Home, FileText, Users, Landmark, Mail } from "lucide-react";
import { MenuBar } from "@/components/ui/bottom-menu";

const sidebarTools = [
  {
    title: "Resume Fixer",
    icon: (props: any) => <FileText {...props} />,
    label: "Resume Fixer"
  },
  {
    title: "Mock Interview",
    icon: (props: any) => <Users {...props} />,
    label: "Mock Interview"
  },
  {
    title: "Salary Negotiation",
    icon: (props: any) => <Landmark {...props} />,
    label: "Salary Negotiation"
  },
  {
    title: "Email Generator",
    icon: (props: any) => <Mail {...props} />,
    label: "Email Generator"
  }
];

export default function AiWorkspace() {
  const [, setLocation] = useLocation();

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "#F1EDE2" }}>
      {/* Top Header with Home Link */}
      <header className="p-4 flex items-center">
        <Link href="/">
          <Button variant="default" size="sm" className="gap-2 rounded-xl shadow-sm">
            <Home className="h-4 w-4" />
            Back Home
          </Button>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto pb-32">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            <h1 className="text-4xl font-bold text-foreground font-serif">AI-workspace</h1>
            <p className="text-lg text-muted-foreground">
              Welcome to your AI-powered career assistant workspace. 
              Choose a tool from the menu below to get started with your professional journey.
            </p>
            
            <div className="p-12 border-2 border-dashed border-border/60 rounded-3xl flex flex-col items-center justify-center text-center bg-white/20">
              <p className="text-muted-foreground">
                Select a tool from the dock below to begin. More features coming soon.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Bottom Dock */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <MenuBar 
          items={sidebarTools} 
          onItemClick={(index) => {
            // Handle tool selection here
            console.log("Selected tool:", sidebarTools[index].title);
          }}
        />
      </div>
    </div>
  );
}
