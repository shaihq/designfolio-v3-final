import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { Home, FileText, Users, Landmark, Mail } from "lucide-react";
import { BottomNavBar } from "@/components/ui/bottom-nav-bar";

const navItems = [
  { label: "Resume Fixer", icon: FileText },
  { label: "Mock Interview", icon: Users },
  { label: "Salary Negotiation", icon: Landmark },
  { label: "Email Generator", icon: Mail },
];

export default function AiWorkspace() {
  const [, setLocation] = useLocation();

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "#F1EDE2" }}>
      {/* Top Header with Home Link */}
      <header className="p-4 flex items-center">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-2 rounded-full px-4 bg-white/50 hover:bg-white/80 border border-black/5 shadow-sm text-sm font-medium transition-all">
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
                Select a tool from the bottom navigation to begin. More features coming soon.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Bottom Navigation Bar */}
      <BottomNavBar 
        className="fixed bottom-8 inset-x-0 mx-auto z-50 w-fit" 
        items={navItems}
        onItemClick={(index) => {
          console.log("Selected tool:", navItems[index].label);
        }}
      />
    </div>
  );
}
