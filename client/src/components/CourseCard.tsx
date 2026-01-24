import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronUp, GraduationCap, Calendar, X } from "lucide-react";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";

export function CourseCard() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  return (
    <>
      <div className={`fixed bottom-0 right-4 md:right-6 z-50 w-[calc(100%-2rem)] md:w-[300px] bg-white border border-border rounded-t-2xl shadow-[0_-8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] transform ${
        isExpanded ? 'translate-y-0' : 'translate-y-[calc(100%-60px)]'
      }`}>
        {/* Minimized Header / Toggle Area */}
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full h-[60px] flex items-center justify-between px-5 bg-white text-foreground rounded-t-2xl hover:bg-muted/30 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FAF8F5] border border-border/50 flex items-center justify-center group-hover:scale-105 transition-transform duration-300 relative">
              <div className="absolute inset-0 bg-foreground/5 rounded-xl animate-ping scale-110 opacity-75"></div>
              <GraduationCap className="w-4.5 h-4.5 text-foreground/80 relative z-10" />
            </div>
            <div className="flex flex-col items-start leading-none">
              <span className="text-sm font-bold tracking-tight">Upcoming Course</span>
            </div>
          </div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isExpanded ? 'bg-foreground/5 rotate-180' : 'bg-transparent'}`}>
            <ChevronUp className="w-4 h-4 text-foreground/40" />
          </div>
        </button>

        {/* Content Area */}
        <div className={`p-6 space-y-6 overflow-y-auto max-h-[80vh] transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
          <div className="space-y-1">
            <h2 className="text-base font-semibold tracking-tight text-foreground leading-tight">Vibe coding for Designers</h2>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Calendar className="w-3.5 h-3.5" />
              <span className="text-[12px] font-medium">January 18th, 2026</span>
            </div>
          </div>

          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold text-muted-foreground">Seats Available</p>
              <div className="flex items-center gap-1.5">
                <div className="w-1 h-1 rounded-full bg-[#f97316]"></div>
                <p className="text-[11px] font-semibold text-[#f97316]">Filling Fast</p>
              </div>
            </div>
            
            <div className="relative">
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full w-[45%] bg-[#f97316] rounded-full transition-all duration-1000 ease-out"></div>
              </div>
            </div>
            <p className="text-[12px] font-medium text-foreground">13 of 30 seats remaining</p>
          </div>

          <div className="pt-2">
            <Button 
              onClick={() => setIsPopoverOpen(true)}
              className="w-full h-10 text-sm font-semibold transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              Know More
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <DialogContent 
          className="max-w-[90vw] w-[90vw] h-[90vh] p-0 overflow-hidden border-none bg-background shadow-2xl [&>button]:hidden"
        >
          <div className="relative w-full h-full flex flex-col">
            <div className="absolute top-4 right-4 z-50">
              <DialogClose asChild>
                <Button size="icon" variant="secondary" className="rounded-full shadow-lg hover-elevate">
                  <X className="h-4 w-4" />
                </Button>
              </DialogClose>
            </div>
            <iframe 
              src="https://launchanyway.vercel.app/" 
              className="flex-1 w-full h-full border-none"
              title="Launch Anyway"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
