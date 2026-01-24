"use client";

import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export default function AIThinkingBlock() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const ThinkingContent = `Analyzing resume structure...
Identifying key professional experience...
Extracting technical skill set...
Mapping project achievements...
Structuring educational background...
Optimizing content for professional portfolio...
Applying warm aesthetic design principles...
Generating personalized "About Me" section...
Formatting work history chronologically...
Refining skill categorization...
Polishing project descriptions...
Finalizing layout architecture...
Double-checking serif typography consistency...
Reviewing color contrast for accessibility...
Preparing final portfolio website preview...`;

  const [timer, setTimer] = useState(0);

  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(timerInterval);
    };
  }, []);

  useEffect(() => {
    if (contentRef.current) {
      const scrollHeight = contentRef.current.scrollHeight;
      const clientHeight = contentRef.current.clientHeight;
      const maxScroll = scrollHeight - clientHeight;

      scrollIntervalRef.current = setInterval(() => {
        setScrollPosition((prev) => {
          const newPosition = prev + 0.5;
          if (newPosition >= maxScroll) {
            return 0;
          }
          return newPosition;
        });
      }, 30);

      return () => {
        if (scrollIntervalRef.current) {
          clearInterval(scrollIntervalRef.current);
        }
      };
    }
  }, []);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = scrollPosition;
    }
  }, [scrollPosition]);

  return (
    <div className="flex flex-col p-3 w-full max-w-xl mx-auto">
      <div className="flex items-center justify-start gap-2 mb-4">
        <Loader2 className="h-4 w-4 animate-spin text-primary" />
        <p
          className="bg-[linear-gradient(110deg,#404040,35%,#fff,50%,#404040,75%,#404040)] bg-[length:200%_100%] bg-clip-text text-base text-transparent animate-shimmer"
        >
          Designfolio AI is thinking
        </p>
        <span className="text-sm text-muted-foreground ml-auto">
          {timer}s
        </span>
      </div>
      <Card className="relative h-[150px] overflow-hidden bg-secondary/50 p-4 rounded-xl border-dashed">
        {/* Top fade overlay */}
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-secondary to-transparent z-10 pointer-events-none h-12" />

        {/* Bottom fade overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-secondary to-transparent z-10 pointer-events-none h-12" />

        {/* Scrolling content */}
        <div
          ref={contentRef}
          className="h-full overflow-hidden text-sm text-muted-foreground/80 font-mono leading-relaxed"
        >
          {ThinkingContent.split('\n').map((line, i) => (
            <div key={i} className="py-1">
              <span className="text-primary/40 mr-2">›</span>
              {line}
            </div>
          ))}
        </div>
      </Card>
      
      <style>{`
        @keyframes shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
        .animate-shimmer {
          animation: shimmer 5s linear infinite;
        }
      `}</style>
    </div>
  );
}
