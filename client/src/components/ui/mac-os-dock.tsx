'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { X, Minus, Square, ChevronLeft, ChevronRight, RefreshCw, Lock } from "lucide-react";
import Button3D from "./button-3d";
import { Gravity, MatterBody } from "./gravity";
import { PixelRocketHero } from "./pixel-rocket-voyager";
import { AnimatedFolder } from "./3d-folder";

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
  const projects = [
    { id: 'proj1', name: 'Neural-Sync', icon: '🧠', category: 'AI', date: 'Feb 12' },
    { id: 'proj2', name: 'Quantum-Dash', icon: '⚡', category: 'Dev', date: 'Jan 28' },
    { id: 'proj3', name: 'Aether-UI', icon: '🎨', category: 'Design', date: 'Feb 05' },
    { id: 'proj4', name: 'Pulse-Engine', icon: '🔥', category: 'Systems', date: 'Mar 01' },
    { id: 'proj5', name: 'Vortex-App', icon: '🌀', category: 'Web', date: 'Feb 20' },
  ];

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

  const handleAppClick = (appId: string, index: number) => {
    if (iconRefs.current[index]) {
      createBounceAnimation(iconRefs.current[index]!);
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
              className={`fixed z-40 overflow-hidden bg-[#faf9f6] border border-[#d1d1d1] shadow-2xl flex flex-col pointer-events-auto ${
                isMaximized || isMobile
                  ? 'max-w-none rounded-none border-0 transition-all duration-300'
                  : 'w-[896px] h-[70vh] rounded-lg transition-shadow'
              } ${isActive ? 'shadow-2xl ring-1 ring-black/5' : 'shadow-lg opacity-95'}`}
              style={{
                ...(isMaximized || isMobile ? {
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
                className={`h-10 bg-[#e8e6e1] border-b border-[#d1d1d1] flex items-center px-4 justify-between select-none ${isMobile || isMaximized ? 'cursor-default' : 'cursor-move active:cursor-grabbing'}`}
              >
                <div className="flex gap-2 items-center">
                  <div className="text-sm font-medium text-[#444] flex items-center gap-2">
                    <span className="opacity-70">{app.id === 'works' ? '📂' : '📄'}</span>
                    {app.id === 'works' ? 'Projects' : `${app.name}.mdx`} <span className="opacity-50 text-[10px]">⌄</span>
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
              {app.id !== 'works' && (
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
              )}

              {/* macOS Window Content Area */}
              <div className={`flex-1 overflow-hidden relative ${app.id === 'works' ? '' : 'bg-white m-4 rounded-md border border-[#e0ddd8] shadow-sm'}`}>
                <div className="w-full h-full overflow-y-auto custom-scrollbar">
                  <div className="w-full h-full flex flex-col relative font-azeretMono">
                    {app.id === 'works' ? (
                      <div className="flex h-full bg-[#faf9f6]">
                        {/* Finder Sidebar */}
                        <div className="w-44 bg-[#ebe9e4]/50 backdrop-blur-md border-r border-[#d1d1d1] p-3 flex flex-col gap-6">
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
                            <div className="grid grid-cols-2 gap-x-8 gap-y-12 max-w-2xl mx-auto">
                              {projects.map((proj) => (
                                <div key={proj.id} className="transform scale-125 origin-center">
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
                    ) : (
                      <PixelRocketHero />
                    )}
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

          return (
            <div 
              key={browser.browserId}
              onMouseDown={() => setActiveWindowId(browser.browserId)}
              className={`fixed z-40 overflow-hidden bg-[#faf9f6] border border-[#d1d1d1] shadow-2xl flex flex-col pointer-events-auto w-[896px] h-[70vh] rounded-lg transition-shadow ${isActive ? 'shadow-2xl ring-1 ring-black/5' : 'shadow-lg opacity-95'}`}
              style={{
                left: pos.x,
                top: pos.y,
                transform: 'translate(-50%, -50%)',
                zIndex: isActive ? 60 : 40
              }}
            >
              {/* macOS-style Window Header for Browser */}
              <div 
                onMouseDown={(e) => handleMouseDown(browser.browserId, e)}
                className="h-10 bg-[#e8e6e1] border-b border-[#d1d1d1] flex items-center px-4 justify-between select-none cursor-move active:cursor-grabbing"
              >
                <div className="flex gap-2 items-center">
                  <div className="text-sm font-medium text-[#444] flex items-center gap-2">
                    <span className="opacity-70">🌐</span>
                    <span className="font-azeretMono">{browser.title}</span> <span className="opacity-50 text-[10px]">⌄</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-[#666]">
                  <Minus 
                    className="w-4 h-4 cursor-pointer hover:text-[#444]" 
                  />
                  <Square 
                    className="w-3 h-3 cursor-pointer hover:text-[#444]" 
                  />
                  <X 
                    className="w-4 h-4 cursor-pointer hover:text-[#444]" 
                    onClick={() => closeBrowser(browser.browserId)}
                  />
                </div>
              </div>

              {/* Browser Content Shell */}
              <div className="flex-1 flex flex-col bg-white">
                <div className="h-12 bg-[#f4f2ee] border-b border-[#e0ddd8] flex items-center px-4 gap-4">
                   <div className="flex bg-white/50 border border-[#dcd9d4] rounded-md overflow-hidden h-8 items-center">
                      <button className="px-3 py-1 border-r border-[#dcd9d4] hover:bg-white text-[#888] text-sm">
                        <ChevronLeft size={16} />
                      </button>
                      <button className="px-3 py-1 hover:bg-white text-[#888] text-sm">
                        <ChevronRight size={16} />
                      </button>
                   </div>
                   <div className="flex-1 flex items-center bg-white border border-[#dcd9d4] rounded-md h-8 px-3 shadow-sm">
                     <Lock size={12} className="text-[#888] mr-2" />
                     <span className="text-[11px] text-[#555] font-azeretMono">https://{browser.title.toLowerCase().replace(/\s+/g, '-')}.com</span>
                     <div className="ml-auto">
                       <RefreshCw size={12} className="text-[#aaa]" />
                     </div>
                   </div>
                </div>
                
                <div className="flex-1 overflow-auto flex flex-col items-center justify-center p-12 text-center bg-white m-4 rounded-md border border-[#e0ddd8] shadow-sm font-azeretMono">
                  <div className="text-8xl mb-8 opacity-20 grayscale">{browser.image}</div>
                  <h2 className="text-2xl font-bold mb-4 text-[#222]">{browser.title}</h2>
                  <p className="text-[#666] max-w-sm mx-auto text-sm leading-relaxed">
                    Welcome to the preview window. This project is currently being synchronized and will be available shortly.
                  </p>
                  <div className="mt-8 w-64 h-1.5 bg-[#f0f2f5] rounded-full overflow-hidden">
                    <div className="w-1/3 h-full bg-[#007aff] animate-pulse" />
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