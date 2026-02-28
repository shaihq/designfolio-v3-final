'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Alert } from "@/components/ui/alert";
import { Info, X, Minus, Square, ChevronLeft, ChevronRight, RefreshCw, Lock, Trash2, EyeOff } from "lucide-react";
import Button3D from "./button-3d";
import { Gravity, MatterBody } from "./gravity";
import { PixelRocketHero } from "./pixel-rocket-voyager";
import { AnimatedFolder } from "./3d-folder";
import ImgStack from "./image-stack";

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
  const [animatingWindow, setAnimatingWindow] = useState<{id: string, type: 'open' | 'minimize'} | null>(null);
  const [browserWindows, setBrowserWindows] = useState<any[]>([]);
  const [pdfWindows, setPdfWindows] = useState<any[]>([]);
  const [windowPositions, setWindowPositions] = useState<Record<string, { x: number; y: number }>>(() => {
    const initialPositions: Record<string, { x: number; y: number }> = {};
    if (typeof window !== 'undefined') {
      // Only set initial position for the first app (Home)
      if (apps.length > 0) {
        initialPositions[apps[0].id] = { x: window.innerWidth / 2, y: window.innerHeight * 0.45 };
      }
    }
    return initialPositions;
  });
  const [isDragging, setIsDragging] = useState<string | null>(null);
  const dragOffset = useRef({ x: 0, y: 0 });

  // Projects / Finder state
  const [projects, setProjects] = useState([
    { id: 'proj1', name: 'Neural-Sync', icon: '🧠', category: 'AI', date: 'Feb 12' },
    { id: 'proj2', name: 'Quantum-Dash', icon: '⚡', category: 'Dev', date: 'Jan 28' },
    { id: 'proj3', name: 'Aether-UI', icon: '🎨', category: 'Design', date: 'Feb 05' },
    { id: 'proj4', name: 'Pulse-Engine', icon: '🔥', category: 'Systems', date: 'Mar 01' },
    { id: 'proj5', name: 'Vortex-App', icon: '🌀', category: 'Web', date: 'Feb 20' },
  ]);

  const [draggedProjectIndex, setDraggedProjectIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedProjectIndex(index);
    // Required for Firefox
    e.dataTransfer.setData('text/plain', index.toString());
    e.dataTransfer.effectAllowed = 'move';
    
    // Create a ghost image if needed, but standard browser drag is fine for now
    const target = e.currentTarget as HTMLElement;
    target.style.opacity = '0.5';
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedProjectIndex(null);
    const target = e.currentTarget as HTMLElement;
    target.style.opacity = '1';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    if (draggedProjectIndex !== null && draggedProjectIndex !== index) {
      const newProjects = [...projects];
      const draggedProject = newProjects[draggedProjectIndex];
      
      newProjects.splice(draggedProjectIndex, 1);
      newProjects.splice(index, 0, draggedProject);
      
      setProjects(newProjects);
      setDraggedProjectIndex(index);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDraggedProjectIndex(null);
  };

  const handleOpenBrowser = useCallback((project: any) => {
    const browserId = `browser-${project.id}-${Date.now()}`;
    const offset = (openWindows.length + browserWindows.length) * 20;
    
    setBrowserWindows(prev => [...prev, { ...project, browserId }]);
    setWindowPositions(prev => ({
      ...prev,
      [browserId]: { 
        x: (window.innerWidth / 2) + offset, 
        y: (window.innerHeight * 0.45) + offset 
      }
    }));
    setActiveWindowId(browserId);
  }, [openWindows.length, browserWindows.length]);

  const closeBrowser = (browserId: string) => {
    setBrowserWindows(prev => prev.filter(b => b.browserId !== browserId));
    if (activeWindowId === browserId) {
      setActiveWindowId(null);
    }
  };

  const handleOpenPdf = useCallback((title: string) => {
    const pdfId = `pdf-${Date.now()}`;
    const offset = (openWindows.length + browserWindows.length + pdfWindows.length) * 20;
    
    setPdfWindows(prev => [...prev, { id: pdfId, title }]);
    setWindowPositions(prev => ({
      ...prev,
      [pdfId]: { 
        x: (window.innerWidth / 2) + offset, 
        y: (window.innerHeight * 0.45) + offset 
      }
    }));
    setActiveWindowId(pdfId);
  }, [openWindows.length, browserWindows.length, pdfWindows.length]);

  const closePdf = (pdfId: string) => {
    setPdfWindows(prev => prev.filter(p => p.id !== pdfId));
    if (activeWindowId === pdfId) {
      setActiveWindowId(null);
    }
  };

  const handleAppClick = (appId: string, index: number) => {
    if (iconRefs.current[index]) {
      createBounceAnimation(iconRefs.current[index]!);
    }
    
    // Auto-minimize other windows on mobile when opening a new one
    if (isMobile) {
      setOpenWindows(prev => {
        const otherWindows = prev.filter(id => id !== appId);
        setMinimizedWindows(currentMin => {
          const newMin = [...currentMin];
          otherWindows.forEach(id => {
            if (!newMin.includes(id)) newMin.push(id);
          });
          return newMin;
        });
        return prev;
      });

      setBrowserWindows(prev => {
        const otherBrowsers = prev.filter(b => b.browserId !== appId);
        setMinimizedWindows(currentMin => {
          const newMin = [...currentMin];
          otherBrowsers.forEach(b => {
            if (!newMin.includes(b.browserId)) newMin.push(b.browserId);
          });
          return newMin;
        });
        return prev;
      });
    }

    if (!openWindows.includes(appId)) {
      setAnimatingWindow({ id: appId, type: 'open' });
      setOpenWindows(prev => [...prev, appId]);
      // Initialize position if not exists
      if (!windowPositions[appId]) {
        // Offset new windows slightly so they don't overlap perfectly
        const offset = openWindows.length * 20;
        setWindowPositions(prev => ({
          ...prev,
          [appId]: { 
            x: (window.innerWidth / 2) + offset, 
            y: (window.innerHeight * 0.45) + offset 
          }
        }));
      }
      setTimeout(() => setAnimatingWindow(null), 500);
    }
    // If it was minimized, restore it
    if (minimizedWindows.includes(appId)) {
      setAnimatingWindow({ id: appId, type: 'open' });
      setMinimizedWindows(prev => prev.filter(id => id !== appId));
      setTimeout(() => setAnimatingWindow(null), 500);
    }
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
    if (!minimizedWindows.includes(appId)) {
      setAnimatingWindow({ id: appId, type: 'minimize' });
      setTimeout(() => {
        setMinimizedWindows(prev => [...prev, appId]);
        setAnimatingWindow(null);
      }, 500);
    } else {
      setAnimatingWindow({ id: appId, type: 'open' });
      setMinimizedWindows(prev => prev.filter(id => id !== appId));
      setTimeout(() => setAnimatingWindow(null), 500);
    }
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

  const handleMouseMoveGlobal = useCallback((e: MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - dragOffset.current.x;
      const newY = e.clientY - dragOffset.current.y;

      setWindowPositions(prev => ({
        ...prev,
        [isDragging]: {
          x: newX,
          y: newY
        }
      }));
    }
  }, [isDragging]);

  useEffect(() => {
    const handleMouseUpGlobal = () => {
      setIsDragging(null);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMoveGlobal, { passive: true });
      window.addEventListener('mouseup', handleMouseUpGlobal);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMoveGlobal);
      window.removeEventListener('mouseup', handleMouseUpGlobal);
    };
  }, [isDragging, handleMouseMoveGlobal]);

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
        {apps.map((app, index) => {
          const isOpen = openWindows.includes(app.id);
          const isMinimized = minimizedWindows.includes(app.id);
          const isMaximized = maximizedWindows.includes(app.id);
          const isAnimating = animatingWindow?.id === app.id;
          
          if (!isOpen || (isMinimized && !isAnimating)) return null;

          const pos = windowPositions[app.id] || { x: 0, y: 0 };
          const isActive = activeWindowId === app.id;
          
          // Animation logic for opening/minimizing
          let animationStyles = {};
          if (isAnimating) {
            const dockPos = currentPositions[index] || 0;
            const dockRect = dockRef.current?.getBoundingClientRect();
            const targetX = dockRect ? dockRect.left + dockPos + padding : window.innerWidth / 2;
            const targetY = dockRect ? dockRect.top + baseIconSize / 2 : window.innerHeight;

            const isOpening = animatingWindow.type === 'open';
            
            animationStyles = {
              transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
              opacity: isOpening ? [0, 1] : [1, 0],
              transform: isOpening 
                ? [`translate(${targetX - pos.x}px, ${targetY - pos.y}px) scale(0.1) rotate(5deg)`, `translate(-50%, -50%) scale(1) rotate(0deg)`][isActive ? 1 : 1] // Simple toggle logic for ease
                : `translate(${targetX - pos.x}px, ${targetY - pos.y}px) scale(0.1) rotate(5deg)`,
              transformOrigin: 'center center',
            };

            // Using keyframes for smoother feel if possible, but standard transition is safer for fast edit
            if (isOpening) {
              animationStyles = {
                ...animationStyles,
                animation: 'macWindowOpen 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
              };
            } else {
              animationStyles = {
                ...animationStyles,
                animation: 'macWindowMinimize 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards'
              };
            }
          }

          return (
            <div 
              key={`window-${app.id}`}
              onMouseDown={() => setActiveWindowId(app.id)}
              onWheel={(e) => e.stopPropagation()}
              className={`fixed z-40 overflow-hidden border shadow-2xl flex flex-col pointer-events-auto ${
                app.id === 'work_experience' 
                  ? 'bg-[#1e1e1e] border-[#333]' 
                  : 'bg-[#faf9f6] border-[#d1d1d1]'
              } ${
                isMaximized || isMobile
                  ? 'max-w-none rounded-none border-0 transition-all duration-300'
                  : 'w-[896px] h-[70vh] rounded-lg transition-shadow'
              } ${isActive ? 'shadow-2xl ring-1 ring-black/5' : 'shadow-lg opacity-95'}`}
              style={{
                ...(isMaximized || isMobile ? {
                  zIndex: isActive ? 50 : 40,
                  left: isMobile ? '2.5%' : '0',
                  top: isMobile ? '50px' : '40px',
                  width: isMobile ? '95vw' : '100vw',
                  height: isMobile ? 'calc(100vh - 160px)' : 'calc(100vh - 140px)',
                  transform: 'none',
                  borderRadius: isMobile ? '12px' : '0'
                } : {
                  left: pos.x,
                  top: pos.y,
                  transform: 'translate(-50%, -50%)',
                  zIndex: isActive ? 50 : 40
                }),
                ...animationStyles
              }}
            >
              <style dangerouslySetInnerHTML={{ __html: `
                @keyframes macWindowOpen {
                  0% { transform: translate(calc(${currentPositions[index] || 0}px - ${pos.x}px), calc(100vh - ${pos.y}px)) scale(0.1); opacity: 0; }
                  100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
                }
                @keyframes macWindowMinimize {
                  0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
                  100% { transform: translate(calc(${currentPositions[index] || 0}px - ${pos.x}px), calc(100vh - ${pos.y}px)) scale(0.1); opacity: 0; }
                }
              `}} />
              {/* macOS Window Header */}
              <div 
                onMouseDown={(e) => !isMobile && !isMaximized && handleMouseDown(app.id, e)}
                className={`h-10 border-b flex items-center px-4 justify-between select-none ${
                  app.id === 'work_experience'
                    ? 'bg-[#2d2d2d] border-[#1e1e1e]'
                    : 'bg-[#e8e6e1] border-[#d1d1d1]'
                } ${isMobile || isMaximized ? 'cursor-default' : 'cursor-move active:cursor-grabbing'}`}
              >
                <div className="flex gap-2 items-center">
                  <div className={`text-sm font-medium flex items-center gap-2 ${
                    app.id === 'work_experience' ? 'text-[#d4d4d4]' : 'text-[#444]'
                  }`}>
                    <span className="opacity-70">{app.id === 'works' ? '📂' : '📄'}</span>
                    {app.id === 'works' ? 'Projects' : `${app.name}.mdx`} <span className="opacity-50 text-[10px]">⌄</span>
                  </div>
                </div>
                <div className={`flex items-center gap-4 ${
                  app.id === 'work_experience' ? 'text-[#aaa]' : 'text-[#666]'
                }`}>
                  <Minus 
                    className="w-4 h-4 cursor-pointer hover:opacity-70" 
                    onClick={(e) => toggleMinimize(app.id, e)}
                  />
                  <Square 
                    className="w-3 h-3 cursor-pointer hover:opacity-70" 
                    onClick={(e) => toggleMaximize(app.id, e)}
                  />
                  <X 
                    className="w-4 h-4 cursor-pointer hover:opacity-70" 
                    onClick={() => closeWindow(app.id)}
                  />
                </div>
              </div>

              {/* macOS Window Toolbar */}
              {app.id !== 'works' && (
                <div className={`h-12 border-b flex items-center px-4 gap-4 overflow-x-auto justify-between ${
                  app.id === 'work_experience'
                    ? 'bg-[#252525] border-[#1e1e1e]'
                    : 'bg-[#f4f2ee] border-[#e0ddd8]'
                }`}>
                  <div className="flex items-center gap-4">
                    {app.id === 'work_experience' ? (
                      <div className="flex items-center gap-3">
                        <div className="flex bg-black/30 border border-[#333] rounded-md overflow-hidden h-8 items-center px-2">
                          <div className="flex gap-2 items-center text-[11px] text-[#888]">
                            <span className="text-[#007aff]">main*</span>
                            <span className="opacity-30">|</span>
                            <span>UTF-8</span>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <button className="h-8 px-2 flex items-center justify-center gap-1.5 text-[11px] text-[#aaa] hover:bg-white/5 rounded border border-transparent hover:border-[#333] transition-all">
                            <RefreshCw size={12} className="text-[#007aff]" />
                            <span>Build</span>
                          </button>
                          <button className="h-8 px-2 flex items-center justify-center gap-1.5 text-[11px] text-[#aaa] hover:bg-white/5 rounded border border-transparent hover:border-[#333] transition-all">
                            <div className="w-2 h-2 rounded-full bg-[#28c841]" />
                            <span>Run</span>
                          </button>
                        </div>
                        <div className="h-4 w-px bg-[#333] mx-1" />
                        <div className="flex gap-1 text-[11px] text-[#666]">
                          <span className="hover:text-[#aaa] cursor-pointer">Terminal</span>
                          <span className="hover:text-[#aaa] cursor-pointer ml-2">Debug</span>
                          <span className="hover:text-[#aaa] cursor-pointer ml-2">Console</span>
                        </div>
                      </div>
                    ) : (
                      <>
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
                      </>
                    )}
                  </div>
                  
                  <Button3D>
                    {app.id === 'work_experience' ? 'COMMIT' : 'EDIT'}
                  </Button3D>
                </div>
              )}

              {/* macOS Window Content Area */}
              <div className={`flex-1 overflow-hidden relative ${
                app.id === 'works' 
                  ? '' 
                  : app.id === 'work_experience'
                    ? 'bg-[#1e1e1e] m-4 rounded-md border border-[#333] shadow-sm'
                    : 'bg-white m-4 rounded-md border border-[#e0ddd8] shadow-sm'
              }`}>
                <div className="w-full h-full overflow-y-auto custom-scrollbar">
                  <div className="w-full h-full flex flex-col relative font-azeretMono">
                    {app.id === 'works' ? (
                      <div className="flex h-full bg-[#faf9f6]">
                        {/* Finder Sidebar */}
                        <div className={`w-44 bg-[#ebe9e4]/50 backdrop-blur-md border-r border-[#d1d1d1] p-3 flex flex-col gap-6 ${isMobile ? "hidden" : "flex"}`}>
                          <div>
                            <div className="text-[10px] font-bold text-[#8e8c87] uppercase tracking-wider mb-2 px-2">Favorites</div>
                            <div className="flex flex-col gap-0.5">
                              {[
                                { name: 'AirDrop', icon: '📡' },
                                { name: 'Recents', icon: '🕒' },
                                { name: 'Applications', icon: '🚀' },
                                { name: 'Desktop', icon: '🖥️' },
                                { name: 'Documents', icon: '📄' },
                                { name: 'Downloads', icon: '⬇️' }
                              ].map((item) => (
                                <div 
                                  key={item.name} 
                                  className={`px-2 py-1.5 rounded-md text-[11px] flex items-center gap-2 cursor-pointer transition-colors ${item.name === 'Desktop' ? 'bg-[#d1cfca] text-[#222] font-semibold' : 'text-[#555] hover:bg-[#e1dfda]'}`}
                                >
                                  <span className="text-sm opacity-80">{item.icon}</span>
                                  {item.name}
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <div className="text-[10px] font-bold text-[#8e8c87] uppercase tracking-wider mb-2 px-2">Tags</div>
                            <div className="flex flex-col gap-1.5 px-2">
                              <div className="flex items-center gap-2 text-[10px] text-[#555] cursor-pointer hover:text-[#222]"><div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57] shadow-sm" /> Work</div>
                              <div className="flex items-center gap-2 text-[10px] text-[#555] cursor-pointer hover:text-[#222]"><div className="w-2.5 h-2.5 rounded-full bg-[#febc2e] shadow-sm" /> Personal</div>
                              <div className="flex items-center gap-2 text-[10px] text-[#555] cursor-pointer hover:text-[#222]"><div className="w-2.5 h-2.5 rounded-full bg-[#28c841] shadow-sm" /> Important</div>
                            </div>
                          </div>
                        </div>

                        {/* Finder Main View */}
                        <div className="flex-1 flex flex-col bg-white">
                          {/* Breadcrumbs / Path Bar */}
                          <div className="h-8 border-b border-[#e0ddd8] flex items-center px-4 gap-2 text-[10px] text-[#888] bg-[#fdfdfb]">
                            <span>Macintosh HD</span>
                            <span className="opacity-40">›</span>
                            <span>Users</span>
                            <span className="opacity-40">›</span>
                            <span>Shared</span>
                            <span className="opacity-40">›</span>
                            <span className="text-[#444] font-medium">Projects</span>
                          </div>

                          <div className="flex-1 p-8 overflow-y-auto">
                            <div className="max-w-4xl mx-auto mb-6">
                              <Alert
                                variant="info"
                                className="bg-blue-50/50 border-blue-200/50 text-blue-700 py-2 shadow-sm"
                                icon={<Info size={16} className="text-blue-500" />}
                              >
                                <span className="text-xs font-medium">Tip: You can re-arrange projects by dragging them into your preferred order.</span>
                              </Alert>
                            </div>
                            <div className={`grid ${isMobile ? "grid-cols-2" : "grid-cols-3"} gap-x-6 gap-y-10 max-w-4xl mx-auto`}>
                              {projects.map((proj, index) => (
                                <div 
                                  key={proj.id} 
                                  className={`transform scale-110 origin-center cursor-move transition-all duration-500 ease-in-out ${draggedProjectIndex === index ? 'opacity-50 scale-100 z-50' : 'opacity-100'}`}
                                  draggable
                                  onDragStart={(e) => handleDragStart(e, index)}
                                  onDragEnd={handleDragEnd}
                                  onDragOver={(e) => handleDragOver(e, index)}
                                  onDrop={handleDrop}
                                >
                                  <AnimatedFolder
                                    title={proj.name}
                                    projects={[
                                      { id: `${proj.id}-1`, title: proj.name, image: proj.icon },
                                      { id: `${proj.id}-2`, title: 'Documentation', image: '📄' },
                                      { id: `${proj.id}-3`, title: 'Assets', image: '🎨' }
                                    ]}
                                    onProjectClick={(project) => {
                                      if (proj.id === 'proj1') {
                                        handleOpenBrowser(project);
                                      }
                                    }}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : app.id === 'work_experience' ? (
                      <div className="w-full h-full bg-[#1e1e1e] text-[#d4d4d4] font-mono text-xs p-0 flex flex-col overflow-hidden">
                        {/* IDE Header/Tabs */}
                        <div className="flex bg-[#2d2d2d] border-b border-[#1e1e1e]">
                          <div className="px-3 py-2 bg-[#1e1e1e] border-t border-t-[#007aff] flex items-center gap-2">
                            <span className="text-[#e06c75]">index.ts</span>
                            <X size={10} className="opacity-50" />
                          </div>
                          <div className="px-3 py-2 opacity-50 flex items-center gap-2 border-r border-[#1e1e1e]">
                            <span>experience.json</span>
                            <X size={10} />
                          </div>
                        </div>
                        
                        {/* IDE Content */}
                        <div className="flex-1 flex overflow-hidden">
                          {/* Line Numbers */}
                          <div className="w-10 bg-[#1e1e1e] border-r border-[#333] flex flex-col items-end pr-2 pt-4 text-[#858585] select-none">
                            {Array.from({ length: 30 }).map((_, i) => (
                              <div key={i} className="leading-5">{i + 1}</div>
                            ))}
                          </div>
                          
                          {/* Code Area */}
                          <div className="flex-1 p-4 pt-4 overflow-y-auto custom-scrollbar leading-5">
                            <div>
                              <span className="text-[#c678dd]">const</span> <span className="text-[#e06c75]">workExperience</span>: <span className="text-[#e5c07b]">Experience[]</span> = [
                            </div>
                            
                            <div className="pl-4 mt-2">
                              <span className="text-[#abb2bf]">{`{`}</span>
                            </div>
                            <div className="pl-8">
                              <span className="text-[#d19a66]">company</span>: <span className="text-[#98c379]">"Tech Frontiers AI"</span>,
                            </div>
                            <div className="pl-8">
                              <span className="text-[#d19a66]">role</span>: <span className="text-[#98c379]">"Senior Full Stack Engineer"</span>,
                            </div>
                            <div className="pl-8">
                              <span className="text-[#d19a66]">duration</span>: <span className="text-[#98c379]">"2023 - Present"</span>,
                            </div>
                            <div className="pl-8">
                              <span className="text-[#d19a66]">achievements</span>: [
                            </div>
                            <div className="pl-12 text-[#98c379]">
                              "Architected a distributed neural-sync engine handling 10k+ concurrent streams",
                            </div>
                            <div className="pl-12 text-[#98c379]">
                              "Reduced latency by 45% through custom WebAssembly memory management",
                            </div>
                            <div className="pl-12 text-[#98c379]">
                              "Led a team of 6 developers in shipping the Pulse-Engine core"
                            </div>
                            <div className="pl-8">
                              ]
                            </div>
                            <div className="pl-4">
                              <span className="text-[#abb2bf]">{`},`}</span>
                            </div>

                            <div className="pl-4 mt-2">
                              <span className="text-[#abb2bf]">{`{`}</span>
                            </div>
                            <div className="pl-8">
                              <span className="text-[#d19a66]">company</span>: <span className="text-[#98c379]">"Quantum Systems"</span>,
                            </div>
                            <div className="pl-8">
                              <span className="text-[#d19a66]">role</span>: <span className="text-[#98c379]">"Frontend Specialist"</span>,
                            </div>
                            <div className="pl-8">
                              <span className="text-[#d19a66]">duration</span>: <span className="text-[#98c379]">"2021 - 2023"</span>,
                            </div>
                            <div className="pl-8">
                              <span className="text-[#d19a66]">achievements</span>: [
                            </div>
                            <div className="pl-12 text-[#98c379]">
                              "Built a real-time quantum state visualizer using Three.js and GLSL",
                            </div>
                            <div className="pl-12 text-[#98c379]">
                              "Optimized dashboard performance resulting in 60fps animations on mobile",
                            </div>
                            <div className="pl-12 text-[#98c379]">
                              "Implemented comprehensive UI testing suite increasing stability by 30%"
                            </div>
                            <div className="pl-8">
                              ]
                            </div>
                            <div className="pl-4">
                              <span className="text-[#abb2bf]">{`},`}</span>
                            </div>

                            <div className="pl-4 mt-2">
                              <span className="text-[#abb2bf]">{`{`}</span>
                            </div>
                            <div className="pl-8">
                              <span className="text-[#d19a66]">company</span>: <span className="text-[#98c379]">"Aether Design Lab"</span>,
                            </div>
                            <div className="pl-8">
                              <span className="text-[#d19a66]">role</span>: <span className="text-[#98c379]">"Junior Developer"</span>,
                            </div>
                            <div className="pl-8 text-[#5c6370]">
                              // Early career - focused on rapid prototyping and design tokens
                            </div>
                            <div className="pl-8">
                              <span className="text-[#d19a66]">duration</span>: <span className="text-[#98c379]">"2019 - 2021"</span>
                            </div>
                            <div className="pl-4">
                              <span className="text-[#abb2bf]">{`}`}</span>
                            </div>
                            
                            <div className="mt-2">
                              <span className="text-[#abb2bf]">{`];`}</span>
                            </div>
                            
                            <div className="mt-4">
                              <span className="text-[#c678dd]">export default</span> <span className="text-[#e06c75]">workExperience</span>;
                            </div>
                          </div>
                        </div>
                        
                        {/* IDE Footer */}
                        <div className="h-6 bg-[#007aff] text-white flex items-center px-2 justify-between text-[10px]">
                          <div className="flex gap-3">
                            <span>Main*</span>
                            <span>Ln 14, Col 22</span>
                          </div>
                          <div className="flex gap-3">
                            <span>UTF-8</span>
                            <span>TypeScript JSX</span>
                          </div>
                        </div>
                      </div>
                    ) : app.id === 'about' ? (
                      <div className="w-full h-full bg-[#1e3d2f] relative font-chalkboard flex flex-col">
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                          {/* Chalkboard Background Pattern */}
                          <div 
                            className="absolute inset-0 opacity-20" 
                            style={{ 
                              backgroundImage: `url("https://www.transparenttextures.com/patterns/chalkboard.png")`,
                              backgroundColor: '#1e3d2f'
                            }} 
                          />
                          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
                          
                          {/* Visual Chalk Dust / Scratches */}
                          <div className="absolute top-10 right-10 w-32 h-32 border-4 border-white/5 rounded-full opacity-20 -rotate-12" />
                          <div className="absolute bottom-20 left-10 w-48 h-1 bg-white/5 rotate-3 opacity-20" />
                        </div>

                        {/* Scrollable Chalk Content */}
                        <div className="relative z-10 flex-1 overflow-y-auto custom-scrollbar p-8">
                          <div className="flex flex-col gap-8 text-white/90 max-w-2xl mx-auto w-full">
                            <div className="border-b-2 border-white/20 pb-4">
                              <h1 className="text-5xl font-bold tracking-tight mb-2 text-white italic drop-shadow-[2px_2px_0px_rgba(255,255,255,0.2)]">
                                Yo! I am shai
                              </h1>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                              <div className="space-y-8">
                                <section>
                                  <h2 className="text-2xl font-bold text-[#fef08a] mb-3 underline decoration-wavy">Background</h2>
                                  <p className="text-lg leading-relaxed italic">
                                    Deeply passionate about bridging the gap between <span className="text-[#93c5fd]">Neural Networks</span> and <span className="text-[#86efac]">Intuitive UX</span>. I build systems that don't just work, but feel magical.
                                  </p>
                                </section>

                                <section>
                                  <h2 className="text-2xl font-bold text-[#fecaca] mb-3 underline decoration-wavy">Skills</h2>
                                  <div className="flex flex-wrap gap-3 mt-2">
                                    <div className="px-4 py-2 bg-[#86efac]/10 border border-[#86efac]/30 rounded-full text-[#86efac] text-xs font-bold -rotate-2">
                                      #Innovation
                                    </div>
                                    <div className="px-4 py-2 bg-[#93c5fd]/10 border border-[#93c5fd]/30 rounded-full text-[#93c5fd] text-xs font-bold rotate-1">
                                      #Architecture
                                    </div>
                                    <div className="px-4 py-2 bg-[#fef08a]/10 border border-[#fef08a]/30 rounded-full text-[#fef08a] text-xs font-bold rotate-3">
                                      #CreativeCoding
                                    </div>
                                  </div>
                                </section>

                                <section>
                                  <h2 className="text-2xl font-bold text-[#fed7aa] mb-3 underline decoration-wavy">Tools</h2>
                                  <ul className="list-disc list-inside space-y-1 text-lg italic">
                                    <li>VS Code / Cursor</li>
                                    <li>Figma / Spline</li>
                                    <li>Docker / Kubernetes</li>
                                    <li>PostgreSQL / Redis</li>
                                  </ul>
                                </section>
                              </div>

                              <div className="flex items-center justify-center pt-8">
                                <ImgStack images={[
                                  '/portraits/portrait1.png',
                                  '/portraits/portrait2.png',
                                  '/portraits/portrait3.png',
                                  '/portraits/portrait4.png',
                                  '/portraits/sticker1.png',
                                  '/portraits/sticker2.png'
                                ]} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (app.id === 'contact') ? (
                      <div className="w-full h-full bg-white flex flex-col font-azeretMono text-[#37352f]">
                        {/* Notion-style Header */}
                        <div className="px-10 pt-12 pb-4">
                          <div className="flex items-center gap-4 mb-2 opacity-50 text-sm">
                            <span>📂</span>
                            <span>Contacts</span>
                            <span>/</span>
                            <span>contact.mdx</span>
                          </div>
                          <h1 className="text-4xl font-bold mb-8 text-[#37352f]">Get in touch</h1>
                        </div>

                        {/* Notion-style Content */}
                        <div className="px-10 pb-20 space-y-8">
                          <section>
                            <div className="flex items-center gap-2 pb-2 border-b border-[#e9e9e7] mb-4">
                              <span className="text-xl">📧</span>
                              <h2 className="text-lg font-semibold">Contact Details</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="p-4 rounded-lg bg-[#f7f6f3] border border-[#e9e9e7] hover:bg-[#efeee9] transition-colors cursor-pointer group">
                                <div className="text-[10px] uppercase tracking-wider opacity-50 mb-1">Email</div>
                                <div className="font-medium">hello@shai.dev</div>
                              </div>
                              <div className="p-4 rounded-lg bg-[#f7f6f3] border border-[#e9e9e7] hover:bg-[#efeee9] transition-colors cursor-pointer group">
                                <div className="text-[10px] uppercase tracking-wider opacity-50 mb-1">Phone</div>
                                <div className="font-medium">+1 (555) 123-4567</div>
                              </div>
                              <div className="p-4 rounded-lg bg-[#f7f6f3] border border-[#e9e9e7] hover:bg-[#efeee9] transition-colors cursor-pointer group">
                                <div className="text-[10px] uppercase tracking-wider opacity-50 mb-1">GitHub</div>
                                <div className="font-medium">github.com/shai-dev</div>
                              </div>
                              <div 
                                className="p-4 rounded-lg bg-[#f7f6f3] border border-[#e9e9e7] hover:bg-[#efeee9] transition-colors cursor-pointer group"
                                onClick={() => handleOpenPdf('Resume_Shai.pdf')}
                              >
                                <div className="text-[10px] uppercase tracking-wider opacity-50 mb-1">Resume</div>
                                <div className="font-medium text-[#007aff] hover:underline">View Resume</div>
                              </div>
                            </div>
                          </section>

                          <section>
                            <div className="flex items-center gap-2 pb-2 border-b border-[#e9e9e7] mb-4">
                              <span className="text-xl">🌐</span>
                              <h2 className="text-lg font-semibold">Social Connect</h2>
                            </div>
                            <div className="space-y-3">
                              <div className="flex items-center gap-3 p-2 hover:bg-[#f7f6f3] rounded-md cursor-pointer transition-colors">
                                <span className="w-6 h-6 flex items-center justify-center bg-[#0077b5] text-white rounded text-[10px] font-bold">in</span>
                                <span className="flex-1 border-b border-[#e9e9e7] pb-1">linkedin.com/in/shai</span>
                              </div>
                              <div className="flex items-center gap-3 p-2 hover:bg-[#f7f6f3] rounded-md cursor-pointer transition-colors">
                                <span className="w-6 h-6 flex items-center justify-center bg-black text-white rounded text-[10px] font-bold">X</span>
                                <span className="flex-1 border-b border-[#e9e9e7] pb-1">x.com/shai_codes</span>
                              </div>
                              <div className="flex items-center gap-3 p-2 hover:bg-[#f7f6f3] rounded-md cursor-pointer transition-colors">
                                <span className="w-6 h-6 flex items-center justify-center bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white rounded text-[10px] font-bold">IG</span>
                                <span className="flex-1 border-b border-[#e9e9e7] pb-1">instagram.com/shai.builds</span>
                              </div>
                              <div className="flex items-center gap-3 p-2 hover:bg-[#f7f6f3] rounded-md cursor-pointer transition-colors">
                                <span className="w-6 h-6 flex items-center justify-center bg-[#ea4c89] text-white rounded text-[10px] font-bold">Dr</span>
                                <span className="flex-1 border-b border-[#e9e9e7] pb-1">dribbble.com/shai</span>
                              </div>
                            </div>
                          </section>

                          <section>
                            <div className="flex items-center gap-2 pb-2 border-b border-[#e9e9e7] mb-4">
                              <span className="text-xl">✍️</span>
                              <h2 className="text-lg font-semibold">Blogs</h2>
                            </div>
                            <div className="flex items-center gap-3 p-2 hover:bg-[#f7f6f3] rounded-md cursor-pointer transition-colors">
                              <span className="w-6 h-6 flex items-center justify-center bg-black text-white rounded text-[10px] font-bold">M</span>
                              <span className="flex-1 border-b border-[#e9e9e7] pb-1 text-[#37352f]">medium.com/@shai</span>
                            </div>
                          </section>
                        </div>
                      </div>
                    ) : (
                      <PixelRocketHero />
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* PDF Viewer Windows Layer */}
        {pdfWindows.map((pdf) => {
          const pos = windowPositions[pdf.id] || { x: 0, y: 0 };
          const isActive = activeWindowId === pdf.id;
          const isMinimized = minimizedWindows.includes(pdf.id);
          
          if (isMinimized) return null;

          return (
            <div 
              key={pdf.id}
              onMouseDown={() => setActiveWindowId(pdf.id)}
              onWheel={(e) => e.stopPropagation()}
              className={`fixed z-40 overflow-hidden bg-[#525659] border border-[#333] shadow-2xl flex flex-col pointer-events-auto ${
                isMobile ? 'max-w-none rounded-xl' : 'w-[800px] h-[85vh] rounded-lg'
              } ${isActive ? 'shadow-2xl ring-1 ring-black/5' : 'shadow-lg opacity-95'}`}
              style={{
                ...(isMobile ? {
                  zIndex: isActive ? 60 : 40,
                  left: '2.5%',
                  top: '50px',
                  width: '95vw',
                  height: 'calc(100vh - 160px)',
                  transform: 'none',
                  borderRadius: '12px'
                } : {
                  left: pos.x,
                  top: pos.y,
                  transform: 'translate(-50%, -50%)',
                  zIndex: isActive ? 60 : 40,
                  willChange: isDragging === pdf.id ? 'left, top' : 'auto',
                  transition: isDragging === pdf.id ? 'none' : 'all 0.3s ease'
                })
              }}
            >
              {/* macOS-style Window Header for PDF Viewer */}
              <div 
                onMouseDown={(e) => handleMouseDown(pdf.id, e)}
                className="h-9 bg-[#323639] border-b border-[#1a1a1a] flex items-center px-3 justify-between select-none cursor-move active:cursor-grabbing rounded-t-lg"
              >
                <div className="flex gap-2 items-center">
                  <div className="flex gap-1.5 px-1">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f57] border border-[#e0443e]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#28c940] border border-[#1aab29]"></div>
                  </div>
                  <div className="text-[12px] font-medium text-[#eee] flex items-center gap-1 ml-2">
                    <span className="opacity-70">📄</span>
                    <span className="font-sans">{pdf.title}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-1 hover:bg-white/10 rounded text-[#ccc]" onClick={() => closePdf(pdf.id)}>
                    <X className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* PDF Toolbar */}
              <div className="h-12 bg-[#323639] border-b border-[#1a1a1a] flex items-center px-4 justify-between">
                <div className="flex items-center gap-4 text-[#eee]">
                  <div className="flex items-center gap-2 bg-[#202124] px-3 py-1 rounded border border-[#444] text-xs">
                    <span>1 / 2</span>
                  </div>
                  <div className="h-4 w-[1px] bg-[#444]"></div>
                  <div className="flex items-center gap-3">
                    <Minus size={14} className="cursor-pointer hover:text-white" />
                    <span className="text-xs w-8 text-center">100%</span>
                    <Square size={12} className="cursor-pointer hover:text-white" />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button className="p-1.5 hover:bg-white/10 rounded text-[#eee]">
                    <RefreshCw size={14} />
                  </button>
                  <button className="bg-[#007aff] text-white px-3 py-1 rounded text-xs font-medium hover:bg-[#0062cc]">
                    Download
                  </button>
                </div>
              </div>

              {/* PDF Content (Mock) */}
              <div className="flex-1 bg-[#525659] overflow-auto p-8 flex justify-center">
                <div className="bg-white w-full max-w-[600px] shadow-2xl p-12 text-[#333] font-serif min-h-[842px]">
                  <div className="border-b-2 border-black pb-4 mb-8">
                    <h1 className="text-3xl font-bold uppercase tracking-tighter">Shai Dev</h1>
                    <p className="text-sm italic mt-1">Full Stack Engineer & Product Designer</p>
                    <div className="flex gap-4 text-[10px] mt-2 opacity-70">
                      <span>github.com/shai-dev</span>
                      <span>•</span>
                      <span>shai@example.com</span>
                      <span>•</span>
                      <span>San Francisco, CA</span>
                    </div>
                  </div>

                  <section className="mb-8">
                    <h2 className="text-sm font-bold uppercase border-b border-black/10 mb-3">Executive Summary</h2>
                    <p className="text-xs leading-relaxed">
                      Creative engineer with 5+ years of experience building high-performance web applications and immersive user interfaces. 
                      Specialized in React, Three.js, and AI integration. Proven track record of leading product design for 
                      scaled systems with over 100k+ active users.
                    </p>
                  </section>

                  <section className="mb-8">
                    <h2 className="text-sm font-bold uppercase border-b border-black/10 mb-3">Experience</h2>
                    <div className="mb-4">
                      <div className="flex justify-between items-baseline">
                        <h3 className="text-xs font-bold">Lead Engineer @ Neural-Sync</h3>
                        <span className="text-[10px] opacity-60">2023 - Present</span>
                      </div>
                      <ul className="text-[10px] list-disc list-inside mt-2 space-y-1 opacity-80">
                        <li>Architected real-time AI synchronization layer using WebSockets and Redis.</li>
                        <li>Reduced designer iteration time by 40% through custom 3D prototyping tools.</li>
                        <li>Led a cross-functional team of 8 engineers and designers.</li>
                      </ul>
                    </div>
                    <div>
                      <div className="flex justify-between items-baseline">
                        <h3 className="text-xs font-bold">UI Engineer @ Aether Labs</h3>
                        <span className="text-[10px] opacity-60">2020 - 2023</span>
                      </div>
                      <ul className="text-[10px] list-disc list-inside mt-2 space-y-1 opacity-80">
                        <li>Developed a proprietary design system used by 50+ internal developers.</li>
                        <li>Implemented complex data visualizations using D3.js and Three.js.</li>
                      </ul>
                    </div>
                  </section>

                  <section>
                    <h2 className="text-sm font-bold uppercase border-b border-black/10 mb-3">Technical Skills</h2>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-[10px] font-bold opacity-60 uppercase mb-1">Frontend</h4>
                        <p className="text-[10px]">React, TypeScript, Next.js, Tailwind CSS, Three.js, Framer Motion</p>
                      </div>
                      <div>
                        <h4 className="text-[10px] font-bold opacity-60 uppercase mb-1">Backend</h4>
                        <p className="text-[10px]">Node.js, Python, PostgreSQL, Redis, Docker, AWS</p>
                      </div>
                    </div>
                  </section>
                  
                  <div className="mt-12 pt-8 border-t border-black/5 text-center opacity-30 text-[8px]">
                    PDF Generated on February 28, 2026 • Page 1 of 2
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Browser Windows Layer */}
        {browserWindows.map((browser) => {
          const pos = windowPositions[browser.browserId] || { x: 0, y: 0 };
          const isActive = activeWindowId === browser.browserId;
          const isMinimized = minimizedWindows.includes(browser.browserId);
          
          if (isMinimized) return null;

          return (
            <div 
              key={browser.browserId}
              onMouseDown={() => setActiveWindowId(browser.browserId)}
              onWheel={(e) => e.stopPropagation()}
              className={`fixed z-40 overflow-hidden bg-[#faf9f6] border border-[#d1d1d1] shadow-2xl flex flex-col pointer-events-auto ${
                isMobile ? 'max-w-none rounded-xl' : 'w-[896px] h-[70vh] rounded-lg'
              } ${isActive ? 'shadow-2xl ring-1 ring-black/5' : 'shadow-lg opacity-95'}`}
              style={{
                ...(isMobile ? {
                  zIndex: isActive ? 60 : 40,
                  left: '2.5%',
                  top: '50px',
                  width: '95vw',
                  height: 'calc(100vh - 160px)',
                  transform: 'none',
                  borderRadius: '12px'
                } : {
                  left: pos.x,
                  top: pos.y,
                  transform: 'translate(-50%, -50%)',
                  zIndex: isActive ? 60 : 40,
                  willChange: isDragging === browser.browserId ? 'left, top' : 'auto',
                  transition: isDragging === browser.browserId ? 'none' : 'all 0.3s ease'
                })
              }}
            >
              {/* macOS-style Window Header for Browser */}
              <div 
                onMouseDown={(e) => handleMouseDown(browser.browserId, e)}
                className="h-9 bg-[#f6f6f6] border-b border-[#d1d1d1] flex items-center px-3 justify-between select-none cursor-move active:cursor-grabbing rounded-t-lg"
              >
                <div className="flex gap-2 items-center">
                  <div className="flex gap-1.5 px-1">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f57] border border-[#e0443e]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#28c940] border border-[#1aab29]"></div>
                  </div>
                  <div className="text-[12px] font-medium text-[#444] flex items-center gap-1 ml-2">
                    <span className="opacity-70">🌐</span>
                    <span className="font-sans">{browser.title}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-1 hover:bg-black/5 rounded text-[#666]">
                    <Minus className="w-3.5 h-3.5" />
                  </div>
                  <div className="p-1 hover:bg-black/5 rounded text-[#666]">
                    <Square className="w-3 h-3" />
                  </div>
                  <div className="p-1 hover:bg-red-500 hover:text-white rounded text-[#666] transition-colors" onClick={() => closeBrowser(browser.browserId)}>
                    <X className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* Browser Content Shell */}
              <div className="flex-1 flex flex-col bg-white overflow-hidden">
                <div className="h-10 bg-[#f6f6f6] border-b border-[#d1d1d1] flex items-center px-3 gap-3">
                   <div className="flex items-center gap-1">
                      <button className="p-1.5 hover:bg-black/5 rounded text-[#555] disabled:opacity-30">
                        <ChevronLeft size={16} />
                      </button>
                      <button className="p-1.5 hover:bg-black/5 rounded text-[#555] disabled:opacity-30">
                        <ChevronRight size={16} />
                      </button>
                   </div>
                  <div className="flex-1 flex items-center bg-[#e3e3e3]/50 border border-[#c8c8c8] rounded-md h-7 px-3 shadow-inner">
                    <Lock size={10} className="text-[#666] mr-2" />
                    <span className="text-[11px] text-[#444] font-sans truncate">https://{browser.title.toLowerCase().replace(/\s+/g, '-')}.com</span>
                    <div className="ml-auto">
                      <RefreshCw size={10} className="text-[#888]" />
                    </div>
                  </div>
                  <div className="flex items-center gap-1 border-l border-[#d1d1d1] ml-1 pl-2">
                    <button className="p-1.5 hover:bg-red-50 text-red-500/70 hover:text-red-500 rounded transition-colors" title="Delete Project">
                      <Trash2 size={14} />
                    </button>
                    <button className="p-1.5 hover:bg-black/5 text-[#666] rounded transition-colors" title="Hide Project">
                      <EyeOff size={14} />
                    </button>
                    <button className="p-1.5 hover:bg-black/5 text-[#666] rounded transition-colors" title="Add Password">
                      <Lock size={14} />
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-auto bg-white font-sans relative">
                  <div className="max-w-4xl mx-auto pb-12 px-8">
                    {/* Hero Section */}
                    <div className="relative h-64 w-full overflow-hidden rounded-xl bg-gradient-to-br from-[#007aff] to-[#00c6ff] mt-8 shadow-sm">
                      <div className="absolute inset-0 flex items-center justify-center text-9xl opacity-20 grayscale transform -rotate-12 scale-150">
                        {browser.image}
                      </div>
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-white text-center">
                        <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 mb-4 shadow-xl border border-white/30">
                          <span className="text-6xl">{browser.image}</span>
                        </div>
                        <h1 className="text-4xl font-black tracking-tight mb-2 drop-shadow-lg">
                          {browser.title}
                        </h1>
                        <p className="text-white/80 font-medium tracking-wide uppercase text-xs">
                          Case Study • 2026 • AI Research
                        </p>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="py-12 text-left">
                      <div className="grid grid-cols-3 gap-12 mb-12 border-b border-[#f0f2f5] pb-12">
                        <div>
                          <h3 className="text-[10px] font-bold text-[#888] uppercase tracking-widest mb-2">Role</h3>
                          <p className="text-sm text-[#444] font-semibold">Lead Product Designer</p>
                        </div>
                        <div>
                          <h3 className="text-[10px] font-bold text-[#888] uppercase tracking-widest mb-2">Duration</h3>
                          <p className="text-sm text-[#444] font-semibold">6 Months</p>
                        </div>
                        <div>
                          <h3 className="text-[10px] font-bold text-[#888] uppercase tracking-widest mb-2">Impact</h3>
                          <p className="text-sm text-[#444] font-semibold">+40% Efficiency</p>
                        </div>
                      </div>

                      <div className="max-w-2xl">
                        <h2 className="text-2xl font-bold mb-6 text-[#222]">The Challenge</h2>
                        <p className="text-[#666] text-base leading-relaxed mb-8">
                          {browser.title} was built to bridge the gap between complex neural networks and human-centric interfaces. 
                          The primary objective was to create a seamless synchronization layer that allows designers to iterate 
                          on AI-driven assets in real-time without technical friction.
                        </p>

                        <div className="bg-[#f9fafb] border border-[#e5e7eb] rounded-xl p-6 mb-8">
                          <h4 className="text-sm font-bold text-[#222] mb-3 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#007aff]"></span>
                            Key Insights
                          </h4>
                          <ul className="space-y-3">
                            <li className="text-sm text-[#555] flex gap-3">
                              <span className="text-[#007aff] font-bold">01</span>
                              Users felt overwhelmed by raw data visualizations.
                            </li>
                            <li className="text-sm text-[#555] flex gap-3">
                              <span className="text-[#007aff] font-bold">02</span>
                              Real-time feedback loops reduced decision fatigue.
                            </li>
                          </ul>
                        </div>

                        <h2 className="text-2xl font-bold mb-6 text-[#222]">The Solution</h2>
                        <p className="text-[#666] text-base leading-relaxed">
                          We implemented a recursive feedback architecture that prioritizes visual clarity. 
                          By abstracting the underlying complexity into intuitive 3D components, we achieved 
                          a 40% increase in workflow efficiency for the core user group.
                        </p>
                      </div>
                    </div>
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