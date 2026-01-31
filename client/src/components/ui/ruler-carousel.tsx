"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface CarouselItem {
  id: number;
  title: string;
}

interface InfiniteCarouselItem extends Omit<CarouselItem, 'id'> {
  id: string;
  originalIndex: number;
}

const createInfiniteItems = (originalItems: CarouselItem[]): InfiniteCarouselItem[] => {
  const items: InfiniteCarouselItem[] = [];
  for (let i = 0; i < 3; i++) {
    originalItems.forEach((item, index) => {
      items.push({
        ...item,
        id: `${i}-${item.id}`,
        originalIndex: index,
      });
    });
  }
  return items;
};

const RulerLines = ({ totalLines = 41 }: { totalLines?: number }) => {
  const lines = [];

  for (let i = 0; i < totalLines; i++) {
    const isFifth = i % 5 === 0;
    const isCenter = i === Math.floor(totalLines / 2);

    let height = 6;
    let color = "bg-[#FF553E]/30";

    if (isCenter) {
      height = 16;
      color = "bg-[#FF553E]";
    } else if (isFifth) {
      height = 10;
      color = "bg-[#FF553E]/60";
    }

    lines.push(
      <div
        key={i}
        className={`w-[1px] ${color} flex-shrink-0`}
        style={{ height: `${height}px` }}
      />
    );
  }

  return (
    <div className="flex items-center justify-between w-full px-8">
      {lines}
    </div>
  );
};

const ITEM_WIDTH = 160;
const ITEM_GAP = 32;

export function RulerCarousel({
  originalItems,
  onItemSelect,
}: {
  originalItems: CarouselItem[];
  onItemSelect?: (index: number) => void;
}) {
  const infiniteItems = createInfiniteItems(originalItems);
  const itemsPerSet = originalItems.length;

  const [activeIndex, setActiveIndex] = useState(itemsPerSet);
  const [isResetting, setIsResetting] = useState(false);
  const previousIndexRef = useRef(itemsPerSet);

  const handleItemClick = (newIndex: number) => {
    if (isResetting) return;

    const targetOriginalIndex = newIndex % itemsPerSet;

    const possibleIndices = [
      targetOriginalIndex,
      targetOriginalIndex + itemsPerSet,
      targetOriginalIndex + itemsPerSet * 2,
    ];

    let closestIndex = possibleIndices[0];
    let smallestDistance = Math.abs(possibleIndices[0] - activeIndex);

    for (const index of possibleIndices) {
      const distance = Math.abs(index - activeIndex);
      if (distance < smallestDistance) {
        smallestDistance = distance;
        closestIndex = index;
      }
    }

    previousIndexRef.current = activeIndex;
    setActiveIndex(closestIndex);
    
    if (onItemSelect) {
      onItemSelect(targetOriginalIndex);
    }
  };

  const handlePrevious = () => {
    if (isResetting) return;
    const newIndex = activeIndex - 1;
    setActiveIndex(newIndex);
    if (onItemSelect) {
      onItemSelect(((newIndex % itemsPerSet) + itemsPerSet) % itemsPerSet);
    }
  };

  const handleNext = () => {
    if (isResetting) return;
    const newIndex = activeIndex + 1;
    setActiveIndex(newIndex);
    if (onItemSelect) {
      onItemSelect(newIndex % itemsPerSet);
    }
  };

  useEffect(() => {
    if (isResetting) return;

    if (activeIndex < itemsPerSet) {
      setIsResetting(true);
      setTimeout(() => {
        setActiveIndex(activeIndex + itemsPerSet);
        setIsResetting(false);
      }, 0);
    } else if (activeIndex >= itemsPerSet * 2) {
      setIsResetting(true);
      setTimeout(() => {
        setActiveIndex(activeIndex - itemsPerSet);
        setIsResetting(false);
      }, 0);
    }
  }, [activeIndex, itemsPerSet, isResetting]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isResetting) return;

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        handlePrevious();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isResetting, activeIndex]);

  const targetX = -(activeIndex * (ITEM_WIDTH + ITEM_GAP));

  const currentPage = (activeIndex % itemsPerSet) + 1;
  const totalPages = itemsPerSet;

  return (
    <div className="w-full flex flex-col items-center">
      <RulerLines />
      
      <div className="w-full h-10 relative overflow-hidden my-1">
        <motion.div
          className="absolute flex items-center h-full"
          style={{ gap: `${ITEM_GAP}px`, left: '50%' }}
          animate={{
            x: `calc(-${ITEM_WIDTH / 2}px + ${targetX}px)`,
          }}
          transition={
            isResetting
              ? { duration: 0 }
              : {
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                }
          }
        >
          {infiniteItems.map((item, index) => {
            const isActive = index === activeIndex;

            return (
              <motion.button
                key={item.id}
                onClick={() => handleItemClick(index)}
                className={`text-sm font-semibold whitespace-nowrap cursor-pointer flex items-center justify-center ${
                  isActive
                    ? "text-[#FF553E]"
                    : "text-muted-foreground/50 hover:text-muted-foreground/70"
                }`}
                animate={{
                  scale: isActive ? 1 : 0.85,
                  opacity: isActive ? 1 : 0.6,
                }}
                transition={
                  isResetting
                    ? { duration: 0 }
                    : {
                        type: "spring",
                        stiffness: 400,
                        damping: 25,
                      }
                }
                style={{
                  width: `${ITEM_WIDTH}px`,
                  flexShrink: 0,
                }}
              >
                {item.title}
              </motion.button>
            );
          })}
        </motion.div>
      </div>

      <RulerLines />
      
      <div className="flex items-center justify-center gap-4 mt-2">
        <button
          onClick={handlePrevious}
          disabled={isResetting}
          className="flex items-center justify-center cursor-pointer p-1"
          aria-label="Previous item"
        >
          <ChevronLeft className="w-4 h-4 text-[#FF553E]" />
        </button>

        <div className="flex items-center gap-1">
          <span className="text-xs font-medium text-muted-foreground">
            {currentPage}
          </span>
          <span className="text-xs text-muted-foreground/50">/</span>
          <span className="text-xs font-medium text-muted-foreground">
            {totalPages}
          </span>
        </div>

        <button
          onClick={handleNext}
          disabled={isResetting}
          className="flex items-center justify-center cursor-pointer p-1"
          aria-label="Next item"
        >
          <ChevronRight className="w-4 h-4 text-[#FF553E]" />
        </button>
      </div>
    </div>
  );
}
