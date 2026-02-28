'use client'
import { useState, useRef, useEffect } from 'react';
import { motion, PanInfo, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Card {
  id: number;
  src: string;
  zIndex: number;
}

interface ImgStackProps {
  images: string[];
  autoPlayInterval?: number;
}

export default function ImgStack({ images, autoPlayInterval = 5000 }: ImgStackProps) {
    const [cards, setCards] = useState<Card[]>(
        images.map((src, index) => ({
            id: index,
            src: src,
            zIndex: 50 - (index * 10)
        }))
    );
    const [isAnimating, setIsAnimating] = useState<boolean>(false);
    const dragStartPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
    const minDragDistance: number = 50;

    useEffect(() => {
        if (!autoPlayInterval) return;
        
        const interval = setInterval(() => {
            handleNext();
        }, autoPlayInterval);

        return () => clearInterval(interval);
    }, [autoPlayInterval, isAnimating]);

    const getCardStyles = (index: number) => {
        const baseRotation = 2;
        const rotationIncrement = 3;
        const offsetIncrement = -12;
        const verticalOffset = -8;

        return {
            x: index * offsetIncrement,
            y: index * verticalOffset,
            rotate: index === 0 ? 0 : -(baseRotation + (index * rotationIncrement)),
            scale: 1,
            transition: { duration: 0.5 }
        };
    };

    const handleNext = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setCards(prevCards => {
            const newCards = [...prevCards];
            const cardToMove = newCards.shift()!;
            newCards.push(cardToMove);
            return newCards.map((card, index) => ({
                ...card,
                zIndex: 50 - (index * 10)
            }));
        });
        setTimeout(() => setIsAnimating(false), 300);
    };

    const handlePrev = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setCards(prevCards => {
            const newCards = [...prevCards];
            const cardToMove = newCards.pop()!;
            newCards.unshift(cardToMove);
            return newCards.map((card, index) => ({
                ...card,
                zIndex: 50 - (index * 10)
            }));
        });
        setTimeout(() => setIsAnimating(false), 300);
    };

    const handleDragStart = (_: any, info: PanInfo) => {
        dragStartPos.current = { x: info.point.x, y: info.point.y };
    };

    const handleDragEnd = (_: any, info: PanInfo) => {
        const dragDistance = Math.sqrt(
            Math.pow(info.point.x - dragStartPos.current.x, 2) +
            Math.pow(info.point.y - dragStartPos.current.y, 2)
        );

        if (isAnimating) return;
        if (dragDistance < minDragDistance) return;

        handleNext();
    };

    return (
        <div className="relative flex items-center justify-center w-full h-80 my-8 group">
            {/* Navigation Buttons */}
            <button 
                onClick={handlePrev}
                className="absolute left-0 z-[60] p-2 bg-black/20 hover:bg-black/40 rounded-full text-white backdrop-blur-sm transition-all -translate-x-4"
            >
                <ChevronLeft size={24} />
            </button>
            
            <div className="relative w-48 h-64">
                {cards.map((card: Card, index: number) => {
                    const isTopCard = index === 0;
                    const cardStyles = getCardStyles(index);
                    const canDrag = isTopCard && !isAnimating;

                    return (
                        <motion.div
                            key={card.id}
                            className="absolute inset-0 origin-bottom-center overflow-hidden rounded-xl shadow-xl bg-white cursor-grab active:cursor-grabbing border border-white/20"
                            style={{
                                zIndex: card.zIndex,
                            }}
                            animate={cardStyles}
                            drag={canDrag}
                            dragElastic={0.2}
                            dragConstraints={{ left: -150, right: 150, top: -150, bottom: 150 }}
                            dragSnapToOrigin={true}
                            dragTransition={{ bounceStiffness: 600, bounceDamping: 10 }}
                            onDragStart={handleDragStart}
                            onDragEnd={handleDragEnd}
                            whileHover={isTopCard ? {
                                scale: 1.05,
                                transition: { duration: 0.2 }
                            } : {}}
                            whileDrag={{
                                scale: 1.1,
                                rotate: 0,
                                zIndex: 100,
                                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                                transition: { duration: 0.1 }
                            }}
                        >
                            <img
                                src={card.src}
                                alt={`Card ${card.id + 1}`}
                                className="w-full h-full object-cover rounded-lg pointer-events-none"
                                draggable={false}
                            />
                        </motion.div>
                    );
                })}
            </div>

            <button 
                onClick={handleNext}
                className="absolute right-0 z-[60] p-2 bg-black/20 hover:bg-black/40 rounded-full text-white backdrop-blur-sm transition-all translate-x-4"
            >
                <ChevronRight size={24} />
            </button>
        </div>
    );
}
