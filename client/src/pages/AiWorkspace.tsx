import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ChevronLeft, FileText, Users, Landmark, Mail } from "lucide-react";

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
  return (
    <div className="flex min-h-screen" style={{ background: "#F1EDE2" }}>
      {/* Side Navbar */}
      <aside className="w-64 border-r border-border/40 bg-white/30 backdrop-blur-md p-6 flex flex-col gap-8">
        <Link href="/">
          <Button variant="ghost" className="w-full justify-start gap-2 px-2 hover:bg-white/40">
            <ChevronLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        <nav className="flex flex-col gap-2">
          <p className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            AI Tools
          </p>
          {sidebarTools.map((tool) => (
            <Button
              key={tool.title}
              variant="ghost"
              className="w-full justify-start gap-3 px-3 py-6 rounded-xl hover:bg-white/50 text-foreground/80 hover:text-foreground transition-all"
            >
              <tool.icon className="h-5 w-5 opacity-70" />
              <span className="font-medium">{tool.title}</span>
            </Button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
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
