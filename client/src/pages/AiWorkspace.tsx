import { Button } from "@/components/ui/button-1";
import { Link, useLocation } from "wouter";
import { Home } from "lucide-react";
import { RulerCarousel, type CarouselItem } from "@/components/ui/ruler-carousel";

const navItems: CarouselItem[] = [
  { id: 1, title: "Resume Fixer" },
  { id: 2, title: "Mock Interview" },
  { id: 3, title: "Salary Negotiation" },
  { id: 4, title: "Email Generator" },
];

export default function AiWorkspace() {
  const [, setLocation] = useLocation();

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "#F1EDE2" }}>
      {/* Top Header with Home Link */}
      <header className="p-4 flex items-center">
        <Link href="/">
          <Button 
            variant="dashed" 
            size="custom" 
            className="bg-transparent border-border hover:bg-white/40 transition-all text-[#0A0A0A]/80 hover:text-[#0A0A0A] shadow-none"
          >
            <Home className="h-4 w-4 opacity-60" />
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
                Select a tool from the navigation below to begin. More features coming soon.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Ruler Carousel Navigation */}
      <div className="fixed bottom-0 inset-x-0 bg-[#F1EDE2]/95 backdrop-blur-sm pb-3 pt-1 z-50">
        <RulerCarousel 
          originalItems={navItems}
          onItemSelect={(index) => {
            console.log("Selected tool:", navItems[index].title);
          }}
        />
      </div>
    </div>
  );
}
