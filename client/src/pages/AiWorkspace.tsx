import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ChevronLeft } from "lucide-react";

export default function AiWorkspace() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/">
          <Button variant="ghost" className="mb-8 gap-2">
            <ChevronLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
        
        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-foreground font-serif">AI-workspace</h1>
          <p className="text-lg text-muted-foreground">
            Welcome to your AI-powered career assistant workspace. 
            Choose a tool from the home page to get started with your professional journey.
          </p>
          
          <div className="p-12 border-2 border-dashed border-border/60 rounded-3xl flex flex-col items-center justify-center text-center bg-accent/5">
            <p className="text-muted-foreground">
              This is a simple workspace page. More features coming soon.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
