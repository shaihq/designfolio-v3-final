import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ChevronLeft, FileText, Users, Landmark, Mail, Menu, ChevronRight } from "lucide-react";

const sidebarTools = [
  {
    title: "Resume Fixer",
    icon: FileText,
  },
  {
    title: "Mock Interview",
    icon: Users,
  },
  {
    title: "Salary Negotiation",
    icon: Landmark,
  },
  {
    title: "Email Generator",
    icon: Mail,
  }
];

export default function AiWorkspace() {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <div className="flex min-h-screen bg-white">
      {/* Side Navbar - Floating Style */}
      <div className="p-4 flex">
        <aside 
          className={`${
            isCollapsed ? "w-20" : "w-64"
          } h-[calc(100vh-2rem)] rounded-3xl border border-border/40 bg-white shadow-xl flex flex-col gap-8 transition-all duration-300 relative group p-4`}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute -right-3 top-10 h-6 w-6 rounded-full border bg-white shadow-sm z-10 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>

          <Link href="/">
            <Button variant="ghost" className={`w-full ${isCollapsed ? "justify-center px-0" : "justify-start px-2"} gap-2 hover:bg-slate-100`}>
              <ChevronLeft className="h-4 w-4" />
              {!isCollapsed && <span>Back to Home</span>}
            </Button>
          </Link>

          <nav className="flex flex-col gap-2">
            {!isCollapsed && (
              <p className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                AI Tools
              </p>
            )}
            {sidebarTools.map((tool) => (
              <Button
                key={tool.title}
                variant="ghost"
                className={`w-full ${isCollapsed ? "justify-center px-0" : "justify-start px-3"} gap-3 py-6 rounded-xl hover:bg-slate-100 text-foreground/80 hover:text-foreground transition-all`}
                title={isCollapsed ? tool.title : ""}
              >
                <tool.icon className="h-5 w-5 opacity-70" />
                {!isCollapsed && <span className="font-medium">{tool.title}</span>}
              </Button>
            ))}
          </nav>
        </aside>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto bg-slate-50/50">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            <h1 className="text-4xl font-bold text-foreground font-serif">AI-workspace</h1>
            <p className="text-lg text-muted-foreground">
              Welcome to your AI-powered career assistant workspace. 
              Choose a tool from the side menu to get started with your professional journey.
            </p>
            
            <div className="p-12 border-2 border-dashed border-border/60 rounded-3xl flex flex-col items-center justify-center text-center bg-white/20">
              <p className="text-muted-foreground">
                Select a tool from the sidebar to begin. More features coming soon.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
