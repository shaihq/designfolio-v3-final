'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { X, Minus, Square } from "lucide-react";
import Button3D from "./button-3d";
import { Gravity, MatterBody } from "./gravity";
import { PixelRocketHero } from "./pixel-rocket-voyager";

// Types for the component
interface DockApp {
  id: string;
  name: string;
  icon: string;
}

interface MacOSDockProps {
  apps: DockApp[];
  onAppClick: (appId: string) => void;
  openApps?: string[];
  className?: string;
}

const MacOSDock: React.FC<MacOSDockProps> = ({ 
  apps, 
  onAppClick, 
  openApps = [],
  className = ''
}) => {
  const [mouseX, setMouseX] = useState<number | null>(null);
  const [currentScales, setCurrentScales] = useState<number[]>(apps.map(() => 1));
  const [currentPositions, setCurrentPositions] = useState<number[]>([]);
  const dockRef = useRef<HTMLDivElement>(null);
  const iconRefs = useRef<(HTMLDivElement | null)[]>([]);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const lastMouseMoveTime = useRef<number>(0);

  // Responsive size calculations based on viewport
  const getResponsiveConfig = useCallback(() => {
    if (typeof window === 'undefined') {
      return { baseIconSize: 64, maxScale: 1.6, effectWidth: 240 };
    }

    // Base calculations on smaller dimension for better mobile experience
    const smallerDimension = Math.min(window.innerWidth, window.innerHeight);
    
    // Scale icon size based on screen size
    if (smallerDimension < 480) {
      // Mobile phones
      return {
        baseIconSize: Math.max(40, smallerDimension * 0.08),
        maxScale: 1.4,
        effectWidth: smallerDimension * 0.4
      };
    } else if (smallerDimension < 768) {
      // Tablets
      return {
        baseIconSize: Math.max(48, smallerDimension * 0.07),
        maxScale: 1.5,
        effectWidth: smallerDimension * 0.35
      };
    } else if (smallerDimension < 1024) {
      // Small laptops
      return {
        baseIconSize: Math.max(56, smallerDimension * 0.06),
        maxScale: 1.6,
        effectWidth: smallerDimension * 0.3
      };
    } else {
      // Desktop and large screens
      return {
        baseIconSize: Math.max(64, Math.min(80, smallerDimension * 0.05)),
        maxScale: 1.8,
        effectWidth: 300
      };
    }
  }, []);

  const [config, setConfig] = useState(getResponsiveConfig);
  const { baseIconSize, maxScale, effectWidth } = config;
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const minScale = 1.0;
  const baseSpacing = Math.max(4, baseIconSize * 0.08);

  // Update config on window resize
  useEffect(() => {
    const handleResize = () => {
      setConfig(getResponsiveConfig());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [getResponsiveConfig]);

  // Authentic macOS cosine-based magnification algorithm
  const calculateTargetMagnification = useCallback((mousePosition: number | null) => {
    if (mousePosition === null) {
      return apps.map(() => minScale);
    }

    return apps.map((_, index) => {
      const normalIconCenter = (index * (baseIconSize + baseSpacing)) + (baseIconSize / 2);
      const minX = mousePosition - (effectWidth / 2);
      const maxX = mousePosition + (effectWidth / 2);
      
      if (normalIconCenter < minX || normalIconCenter > maxX) {
        return minScale;
      }
      
      const theta = ((normalIconCenter - minX) / effectWidth) * 2 * Math.PI;
      const cappedTheta = Math.min(Math.max(theta, 0), 2 * Math.PI);
      const scaleFactor = (1 - Math.cos(cappedTheta)) / 2;
      
      return minScale + (scaleFactor * (maxScale - minScale));
    });
  }, [apps, baseIconSize, baseSpacing, effectWidth, maxScale, minScale]);

  // Calculate positions based on current scales
  const calculatePositions = useCallback((scales: number[]) => {
    let currentX = 0;
    
    return scales.map((scale) => {
      const scaledWidth = baseIconSize * scale;
      const centerX = currentX + (scaledWidth / 2);
      currentX += scaledWidth + baseSpacing;
      return centerX;
    });
  }, [baseIconSize, baseSpacing]);

  // Initialize positions
  useEffect(() => {
    const initialScales = apps.map(() => minScale);
    const initialPositions = calculatePositions(initialScales);
    setCurrentScales(initialScales);
    setCurrentPositions(initialPositions);
  }, [apps, calculatePositions, minScale, config]);

  // Animation loop
  const animateToTarget = useCallback(() => {
    const targetScales = calculateTargetMagnification(mouseX);
    const targetPositions = calculatePositions(targetScales);
    const lerpFactor = mouseX !== null ? 0.2 : 0.12;

    setCurrentScales(prevScales => {
      return prevScales.map((currentScale, index) => {
        const diff = targetScales[index] - currentScale;
        return currentScale + (diff * lerpFactor);
      });
    });

    setCurrentPositions(prevPositions => {
      return prevPositions.map((currentPos, index) => {
        const diff = targetPositions[index] - currentPos;
        return currentPos + (diff * lerpFactor);
      });
    });

    const scalesNeedUpdate = currentScales.some((scale, index) => 
      Math.abs(scale - targetScales[index]) > 0.002
    );
    const positionsNeedUpdate = currentPositions.some((pos, index) => 
      Math.abs(pos - targetPositions[index]) > 0.1
    );
    
    if (scalesNeedUpdate || positionsNeedUpdate || mouseX !== null) {
      animationFrameRef.current = requestAnimationFrame(animateToTarget);
    }
  }, [mouseX, calculateTargetMagnification, calculatePositions, currentScales, currentPositions]);

  // Start/stop animation loop
  useEffect(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    animationFrameRef.current = requestAnimationFrame(animateToTarget);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [animateToTarget]);

  // Throttled mouse movement handler
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const now = performance.now();
    
    if (now - lastMouseMoveTime.current < 16) {
      return;
    }
    
    lastMouseMoveTime.current = now;
    
    if (dockRef.current) {
      const rect = dockRef.current.getBoundingClientRect();
      const padding = Math.max(8, baseIconSize * 0.12);
      setMouseX(e.clientX - rect.left - padding);
    }
  }, [baseIconSize]);

  const handleMouseLeave = useCallback(() => {
    setMouseX(null);
  }, []);

  const createBounceAnimation = (element: HTMLElement) => {
    const bounceHeight = Math.max(-8, -baseIconSize * 0.15);
    element.style.transition = 'transform 0.2s ease-out';
    element.style.transform = `translateY(${bounceHeight}px)`;
    
    setTimeout(() => {
      element.style.transform = 'translateY(0px)';
    }, 200);
  };

  const [openWindows, setOpenWindows] = useState<string[]>(apps.slice(0, 1).map(a => a.id));
  const [activeWindowId, setActiveWindowId] = useState<string | null>(apps[0]?.id || null);
  const [minimizedWindows, setMinimizedWindows] = useState<string[]>([]);
  const [maximizedWindows, setMaximizedWindows] = useState<string[]>([]);
  const [windowPositions, setWindowPositions] = useState<Record<string, { x: number; y: number }>>(() => {
    const initialPositions: Record<string, { x: number; y: number }> = {};
    if (typeof window !== 'undefined') {
      apps.slice(0, 1).forEach(app => {
        initialPositions[app.id] = { x: window.innerWidth / 2, y: window.innerHeight * 0.45 };
      });
    }
    return initialPositions;
  });
  const [isDragging, setIsDragging] = useState<string | null>(null);
  const dragOffset = useRef({ x: 0, y: 0 });

  const handleAppClick = (appId: string, index: number) => {
    if (iconRefs.current[index]) {
      createBounceAnimation(iconRefs.current[index]!);
    }
    
    if (!openWindows.includes(appId)) {
      setOpenWindows(prev => [...prev, appId]);
      // Initialize position if not exists
      if (!windowPositions[appId]) {
        setWindowPositions(prev => ({
          ...prev,
          [appId]: { x: window.innerWidth / 2, y: window.innerHeight * 0.45 }
        }));
      }
    }
    // If it was minimized, restore it
    setMinimizedWindows(prev => prev.filter(id => id !== appId));
    setActiveWindowId(appId);
    onAppClick(appId);
  };

  const closeWindow = (appId: string) => {
    setOpenWindows(prev => prev.filter(id => id !== appId));
    setMinimizedWindows(prev => prev.filter(id => id !== appId));
    setMaximizedWindows(prev => prev.filter(id => id !== appId));
    if (activeWindowId === appId) {
      setActiveWindowId(null);
    }
  };

  const toggleMinimize = (appId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setMinimizedWindows(prev => 
      prev.includes(appId) ? prev.filter(id => id !== appId) : [...prev, appId]
    );
    if (activeWindowId === appId) {
      setActiveWindowId(null);
    }
  };

  const toggleMaximize = (appId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setMaximizedWindows(prev => 
      prev.includes(appId) ? prev.filter(id => id !== appId) : [...prev, appId]
    );
  };

  const handleMouseDown = (appId: string, e: React.MouseEvent) => {
    setActiveWindowId(appId);
    setIsDragging(appId);
    const pos = windowPositions[appId] || { x: window.innerWidth / 2, y: window.innerHeight * 0.45 };
    dragOffset.current = {
      x: e.clientX - pos.x,
      y: e.clientY - pos.y
    };
  };

  useEffect(() => {
    const handleMouseMoveGlobal = (e: MouseEvent) => {
      if (isDragging) {
        setWindowPositions(prev => {
          const currentPos = prev[isDragging] || { x: window.innerWidth / 2, y: window.innerHeight * 0.45 };
          const newX = e.clientX - dragOffset.current.x;
          const newY = e.clientY - dragOffset.current.y;

          return {
            ...prev,
            [isDragging]: {
              x: newX,
              y: newY
            }
          };
        });
      }
    };

    const handleMouseUpGlobal = () => {
      setIsDragging(null);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMoveGlobal);
      window.addEventListener('mouseup', handleMouseUpGlobal);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMoveGlobal);
      window.removeEventListener('mouseup', handleMouseUpGlobal);
    };
  }, [isDragging]);

  // Calculate content width
  const contentWidth = currentPositions.length > 0 
    ? Math.max(...currentPositions.map((pos, index) => 
        pos + (baseIconSize * currentScales[index]) / 2
      ))
    : (apps.length * (baseIconSize + baseSpacing)) - baseSpacing;

  const padding = Math.max(8, baseIconSize * 0.12);

  return (
    <div className="flex flex-col items-center w-full h-full relative pointer-events-none">
      {/* Windows Layer */}
      <div className="flex-1 w-full relative pointer-events-none">
        {apps.map((app) => {
          const isOpen = openWindows.includes(app.id);
          const isMinimized = minimizedWindows.includes(app.id);
          const isMaximized = maximizedWindows.includes(app.id);
          
          if (!isOpen || isMinimized) return null;

          const pos = windowPositions[app.id] || { x: 0, y: 0 };
          const isActive = activeWindowId === app.id;

          return (
            <div 
              key={`window-${app.id}`}
              onMouseDown={() => setActiveWindowId(app.id)}
              onWheel={(e) => e.stopPropagation()}
              className={`fixed z-40 overflow-hidden bg-[#faf9f6] border border-[#d1d1d1] shadow-2xl flex flex-col pointer-events-auto ${
                isMaximized || isMobile
                  ? 'max-w-none rounded-none border-0 transition-all duration-300'
                  : 'w-[896px] h-[70vh] rounded-lg transition-shadow'
              } ${isActive ? 'shadow-2xl ring-1 ring-black/5' : 'shadow-lg opacity-95'}`}
              style={isMaximized || isMobile ? {
                zIndex: isActive ? 50 : 40,
                left: '0',
                top: '40px',
                width: '100vw',
                height: 'calc(100vh - 140px)',
                transform: 'none'
              } : {
                left: pos.x,
                top: pos.y,
                transform: 'translate(-50%, -50%)',
                zIndex: isActive ? 50 : 40
              }}
            >
              {/* macOS Window Header */}
              <div 
                onMouseDown={(e) => !isMobile && !isMaximized && handleMouseDown(app.id, e)}
                className={`h-10 bg-[#e8e6e1] border-b border-[#d1d1d1] flex items-center px-4 justify-between select-none ${isMobile || isMaximized ? 'cursor-default' : 'cursor-move active:cursor-grabbing'}`}
              >
                <div className="flex gap-2 items-center">
                  <div className="text-sm font-medium text-[#444] flex items-center gap-2">
                    <span className="opacity-70">📄</span>
                    {app.name}.mdx <span className="opacity-50 text-[10px]">⌄</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-[#666]">
                  <Minus 
                    className="w-4 h-4 cursor-pointer hover:text-[#444]" 
                    onClick={(e) => toggleMinimize(app.id, e)}
                  />
                  <Square 
                    className="w-3 h-3 cursor-pointer hover:text-[#444]" 
                    onClick={(e) => toggleMaximize(app.id, e)}
                  />
                  <X 
                    className="w-4 h-4 cursor-pointer hover:text-[#444]" 
                    onClick={() => closeWindow(app.id)}
                  />
                </div>
              </div>

              {/* macOS Window Toolbar */}
              <div className="h-12 bg-[#f4f2ee] border-b border-[#e0ddd8] flex items-center px-4 gap-4 overflow-x-auto justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex bg-white/50 border border-[#dcd9d4] rounded-md overflow-hidden">
                    <button className="px-3 py-1 border-r border-[#dcd9d4] hover:bg-white text-[#888] text-sm">↺</button>
                    <button className="px-3 py-1 hover:bg-white text-[#888] text-sm">↻</button>
                  </div>
                  <div className="flex bg-white/50 border border-[#dcd9d4] rounded-md overflow-hidden h-8 items-center px-2 text-xs text-[#888] min-w-[80px] cursor-pointer hover:bg-white">
                    Zoom <span className="ml-1 opacity-50">⌄</span>
                  </div>
                  <div className="flex gap-1">
                    <button className="w-8 h-8 flex items-center justify-center font-bold text-[#444] hover:bg-white rounded">B</button>
                    <button className="w-8 h-8 flex items-center justify-center italic text-[#444] hover:bg-white rounded">I</button>
                    <button className="w-8 h-8 flex items-center justify-center line-through text-[#444] hover:bg-white rounded">S</button>
                  </div>
                </div>
                
                <Button3D>
                  EDIT
                </Button3D>
              </div>

              {/* macOS Window Content Area */}
              <div className="flex-1 bg-white m-4 rounded-md border border-[#e0ddd8] shadow-sm overflow-hidden relative custom-scrollbar">
                <div className="w-full h-full overflow-y-auto custom-scrollbar">
                  <div className="w-full h-full flex flex-col relative font-azeretMono">
                    <PixelRocketHero />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dock Area */}
      <div 
        ref={dockRef}
        className={`backdrop-blur-md mb-4 pointer-events-auto ${className}`}
        style={{
          width: `${contentWidth + padding * 2}px`,
          background: 'rgba(45, 45, 45, 0.75)',
          borderRadius: `${Math.max(12, baseIconSize * 0.4)}px`,
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: `
            0 ${Math.max(4, baseIconSize * 0.1)}px ${Math.max(16, baseIconSize * 0.4)}px rgba(0, 0, 0, 0.4),
            0 ${Math.max(2, baseIconSize * 0.05)}px ${Math.max(8, baseIconSize * 0.2)}px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.15),
            inset 0 -1px 0 rgba(0, 0, 0, 0.2)
          `,
          padding: `${padding}px`,
          zIndex: 100
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div 
          className="relative"
          style={{
            height: `${baseIconSize}px`,
            width: '100%'
          }}
        >
          {apps.map((app, index) => {
            const scale = currentScales[index];
            const position = currentPositions[index] || 0;
            const scaledSize = baseIconSize * scale;
            const isOpen = openWindows.includes(app.id);
            const isActive = activeWindowId === app.id;
            
            return (
              <div
                key={app.id}
                ref={(el) => { iconRefs.current[index] = el; }}
                className="absolute cursor-pointer flex flex-col items-center justify-end"
                title={app.name}
                onClick={() => handleAppClick(app.id, index)}
                style={{
                  left: `${position - scaledSize / 2}px`,
                  bottom: '0px',
                  width: `${scaledSize}px`,
                  height: `${scaledSize}px`,
                  transformOrigin: 'bottom center',
                  zIndex: Math.round(scale * 10)
                }}
              >
                <img
                  src={app.icon}
                  alt={app.name}
                  width={scaledSize}
                  height={scaledSize}
                  className="object-contain"
                  style={{
                    filter: `drop-shadow(0 ${scale > 1.2 ? Math.max(2, baseIconSize * 0.05) : Math.max(1, baseIconSize * 0.03)}px ${scale > 1.2 ? Math.max(4, baseIconSize * 0.1) : Math.max(2, baseIconSize * 0.06)}px rgba(0,0,0,${0.2 + (scale - 1) * 0.15}))`
                  }}
                />
                
                {/* App Indicator Dot */}
                {(isOpen || openApps.includes(app.id)) && (
                  <div 
                    className="absolute"
                    style={{
                      bottom: `${Math.max(-2, -baseIconSize * 0.05)}px`,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: `${Math.max(3, baseIconSize * 0.06)}px`,
                      height: `${Math.max(3, baseIconSize * 0.06)}px`,
                      borderRadius: '50%',
                      backgroundColor: isActive ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.5)',
                      boxShadow: '0 0 4px rgba(0, 0, 0, 0.3)',
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MacOSDock;