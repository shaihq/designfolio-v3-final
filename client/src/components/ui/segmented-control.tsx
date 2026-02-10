import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SegmentedControlProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function SegmentedControl({
  options,
  value,
  onChange,
  className,
}: SegmentedControlProps) {
  return (
    <div
      className={cn(
        "inline-flex w-full p-1 bg-muted/50 backdrop-blur-sm rounded-full border border-border/50",
        className
      )}
    >
      {options.map((option) => {
        const isActive = value === option;
        return (
          <button
            key={option}
            onClick={() => onChange(option)}
            className={cn(
              "relative flex-1 px-6 py-2.5 text-sm font-medium transition-colors duration-200 rounded-full outline-none whitespace-nowrap",
              isActive ? "text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground/80"
            )}
            type="button"
          >
            {isActive && (
              <motion.div
                layoutId="segmented-control-active"
                className="absolute inset-0 bg-white dark:bg-[#1a1a1a] rounded-full border border-border/50"
                transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
              />
            )}
            <span className="relative z-10">{option}</span>
          </button>
        );
      })}
    </div>
  );
}
