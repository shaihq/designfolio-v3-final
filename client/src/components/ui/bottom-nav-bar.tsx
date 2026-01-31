"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const MOBILE_LABEL_WIDTH = 120; // Increased to accommodate longer labels

export interface NavItem {
  label: string;
  icon: LucideIcon;
}

type BottomNavBarProps = {
  className?: string;
  defaultIndex?: number;
  stickyBottom?: boolean;
  items: NavItem[];
  onItemClick?: (index: number) => void;
};

export function BottomNavBar({
  className,
  defaultIndex = 0,
  stickyBottom = false,
  items,
  onItemClick,
}: BottomNavBarProps) {
  const [activeIndex, setActiveIndex] = useState(defaultIndex);

  const handleItemClick = (idx: number) => {
    setActiveIndex(idx);
    if (onItemClick) {
      onItemClick(idx);
    }
  };

  return (
    <motion.nav
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 26 }}
      role="navigation"
      aria-label="Bottom Navigation"
      className={cn(
        "bg-white/80 dark:bg-card/80 backdrop-blur-md border border-border dark:border-sidebar-border rounded-full flex items-center p-2 shadow-xl space-x-1 min-w-fit max-w-[95vw] h-[52px]",
        stickyBottom && "fixed inset-x-0 bottom-4 mx-auto z-20 w-fit",
        className,
      )}
    >
      {items.map((item, idx) => {
        const Icon = item.icon;
        const isActive = activeIndex === idx;

        return (
          <motion.button
            key={item.label}
            whileTap={{ scale: 0.97 }}
            className={cn(
              "flex items-center gap-0 px-3 py-2 rounded-full transition-all duration-300 relative h-10 min-w-[44px] min-h-[40px] max-h-[44px] overflow-hidden",
              isActive
                ? "bg-[#FF553E]/10 text-[#FF553E] gap-2"
                : "bg-transparent text-muted-foreground hover:bg-muted dark:hover:bg-muted/20",
              "focus:outline-none focus-visible:ring-0",
            )}
            onClick={() => handleItemClick(idx)}
            aria-label={item.label}
            type="button"
          >
            <div className="flex items-center justify-center shrink-0">
              <Icon
                size={20}
                strokeWidth={2}
                aria-hidden
                className="transition-colors duration-200"
              />
            </div>

            <motion.div
              initial={false}
              animate={{
                width: isActive ? "auto" : "0px",
                opacity: isActive ? 1 : 0,
                marginLeft: isActive ? "8px" : "0px",
                paddingRight: isActive ? "12px" : "0px", // Added padding for better visual balance
              }}
              transition={{
                width: { type: "spring", stiffness: 350, damping: 32 },
                opacity: { duration: 0.2 },
                marginLeft: { duration: 0.2 },
              }}
              className={cn("overflow-hidden flex items-center min-w-0")}
            >
              <span
                className={cn(
                  "font-medium text-[13px] whitespace-nowrap select-none transition-opacity duration-200",
                  isActive ? "text-[#FF553E]" : "opacity-0",
                )}
              >
                {item.label}
              </span>
            </motion.div>
          </motion.button>
        );
      })}
    </motion.nav>
  );
}

export default BottomNavBar;
