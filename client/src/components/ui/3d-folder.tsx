"use client"

import { useState, useRef, useEffect, useLayoutEffect, useCallback } from "react"
import { cn } from "@/lib/utils"
import { X, ExternalLink, ChevronLeft, ChevronRight, Minus, Square, Search, RefreshCw, Lock, Star, ChevronDown, User } from "lucide-react"

interface Project {
  id: string
  image: string
  title: string
  url?: string
}

interface AnimatedFolderProps {
  title: string
  projects: Project[]
  className?: string
  onProjectClick?: (project: Project, index: number) => void
}

export function AnimatedFolder({ title, projects, className, onProjectClick }: AnimatedFolderProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [sourceRect, setSourceRect] = useState<DOMRect | null>(null)
  const [hiddenCardId, setHiddenCardId] = useState<string | null>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  const handleProjectClick = (project: Project, index: number) => {
    if (onProjectClick) {
      onProjectClick(project, index)
      return
    }
    const cardEl = cardRefs.current[index]
    if (cardEl) {
      setSourceRect(cardEl.getBoundingClientRect())
    }
    setSelectedIndex(index)
    setHiddenCardId(project.id)
  }

  const handleCloseLightbox = () => {
    setSelectedIndex(null)
    setSourceRect(null)
  }

  const handleCloseComplete = () => {
    setHiddenCardId(null)
  }

  const handleNavigate = (newIndex: number) => {
    setSelectedIndex(newIndex)
    setHiddenCardId(projects[newIndex]?.id || null)
  }

  return (
    <>
      <div
        className={cn(
          "relative flex flex-col items-center justify-center",
          "p-4 rounded-2xl cursor-pointer",
          "bg-transparent group",
          className,
        )}
        style={{
          minWidth: "120px",
          minHeight: "140px",
          perspective: "1000px",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative flex items-center justify-center mb-2" style={{ height: "80px", width: "100px" }}>
          {/* Folder back layer */}
          <div
            className="absolute w-16 h-12 bg-[#007aff] rounded-md shadow-sm"
            style={{
              transformOrigin: "bottom center",
              transform: isHovered ? "rotateX(-15deg)" : "rotateX(0deg)",
              transition: "transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1)",
              zIndex: 10,
            }}
          />

          {/* Folder tab */}
          <div
            className="absolute w-6 h-2 bg-[#007aff] rounded-t-sm"
            style={{
              top: "calc(50% - 24px - 6px)",
              left: "calc(50% - 32px + 8px)",
              transformOrigin: "bottom center",
              transform: isHovered ? "rotateX(-25deg) translateY(-1px)" : "rotateX(0deg)",
              transition: "transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1)",
              zIndex: 10,
            }}
          />

          {/* Project cards */}
          <div
            className="absolute"
            style={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 20,
            }}
          >
            {projects.slice(0, 1).map((project, index) => (
              <ProjectCard
                key={project.id}
                ref={(el) => {
                  cardRefs.current[index] = el
                }}
                image={project.image}
                title={project.title}
                delay={index * 80}
                isVisible={isHovered}
                index={index}
                onClick={() => handleProjectClick(project, index)}
                isSelected={hiddenCardId === project.id}
              />
            ))}
          </div>

          {/* Folder front layer */}
          <div
            className="absolute w-16 h-12 bg-[#4ca1ff] rounded-md shadow-md"
            style={{
              top: "calc(50% - 24px + 2px)",
              transformOrigin: "bottom center",
              transform: isHovered ? "rotateX(25deg) translateY(4px)" : "rotateX(0deg)",
              transition: "transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1)",
              zIndex: 30,
            }}
          />
        </div>

        <h3 className="text-[11px] font-medium text-[#333] leading-tight group-hover:bg-[#0063e1] group-hover:text-white px-1.5 py-0.5 rounded transition-colors truncate max-w-full">
          {title}
        </h3>
      </div>

      <BrowserWindow
        projects={projects.slice(0, 1)}
        currentIndex={selectedIndex ?? 0}
        isOpen={selectedIndex !== null}
        onClose={handleCloseLightbox}
        onCloseComplete={handleCloseComplete}
      />
    </>
  )
}

function ProjectCard({ image, title, delay, isVisible, index, onClick, isSelected, ref }: any) {
  return (
    <div
      ref={ref}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      className={cn(
        "absolute w-12 h-12 bg-white rounded-sm shadow-sm border border-black/5 overflow-hidden",
        "transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1)",
        isSelected ? "opacity-0 scale-90" : "opacity-100 scale-100",
      )}
      style={{
        left: "-24px",
        top: "-24px",
        transform: isVisible
          ? `translateY(-30px) rotate(0deg)`
          : `translateY(0) rotate(0deg)`,
        transitionDelay: `${delay}ms`,
        zIndex: 20 - index,
      }}
    >
      <div className="w-full h-full flex items-center justify-center text-xs bg-gray-100">
        {image}
      </div>
    </div>
  )
}

function BrowserWindow({
  projects,
  currentIndex,
  isOpen,
  onClose,
  onCloseComplete,
}: any) {
  const [animationPhase, setAnimationPhase] = useState<"initial" | "animating" | "complete">("initial")
  const [isClosing, setIsClosing] = useState(false)
  const [shouldRender, setShouldRender] = useState(false)
  const [internalIndex, setInternalIndex] = useState(currentIndex)

  useEffect(() => {
    if (isOpen) {
      setInternalIndex(currentIndex)
      setShouldRender(true)
      setAnimationPhase("initial")
      setIsClosing(false)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setAnimationPhase("animating")
        })
      })
      setTimeout(() => {
        setAnimationPhase("complete")
      }, 500)
    }
  }, [isOpen, currentIndex])

  const handleClose = useCallback(() => {
    setIsClosing(true)
    onClose()
    setTimeout(() => {
      setIsClosing(false)
      setShouldRender(false)
      setAnimationPhase("initial")
      onCloseComplete?.()
    }, 400)
  }, [onClose, onCloseComplete])

  if (!shouldRender) return null

  const currentProject = projects[internalIndex]

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-8"
      onClick={handleClose}
      style={{
        opacity: isClosing ? 0 : 1,
        transition: "opacity 400ms",
      }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      
      <div 
        className="relative bg-[#f3f3f3] rounded-lg shadow-2xl overflow-hidden w-full max-w-5xl h-[80vh] flex flex-col border border-gray-400"
        onClick={e => e.stopPropagation()}
        style={{
          transform: animationPhase === "initial" ? "scale(0.9) translateY(20px)" : "scale(1) translateY(0)",
          opacity: animationPhase === "initial" ? 0 : 1,
          transition: "transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 400ms",
        }}
      >
        {/* Title Bar */}
        <div className="h-10 bg-[#e7e7e7] flex items-center justify-between px-3 border-b border-gray-300 shrink-0 select-none">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-sm flex items-center justify-center bg-gray-200 text-[10px] text-gray-500">
              {currentProject?.image}
            </div>
            <span className="text-[11px] text-gray-600 truncate max-w-[200px]">
              {currentProject?.title || "New Tab"} - Microsoft Edge
            </span>
          </div>
          <div className="flex items-center">
            <button className="h-10 w-11 flex items-center justify-center hover:bg-gray-300 transition-colors">
              <Minus size={14} className="text-gray-600" />
            </button>
            <button className="h-10 w-11 flex items-center justify-center hover:bg-gray-300 transition-colors">
              <Square size={10} className="text-gray-600" />
            </button>
            <button onClick={handleClose} className="h-10 w-11 flex items-center justify-center hover:bg-[#e81123] hover:text-white transition-colors">
              <X size={16} className="text-gray-600 group-hover:text-inherit" />
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-white border-b border-gray-200 p-2 flex flex-col gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <button className="p-1.5 rounded-full hover:bg-gray-100 disabled:opacity-30">
                <ChevronLeft size={18} className="text-gray-600" />
              </button>
              <button className="p-1.5 rounded-full hover:bg-gray-100 disabled:opacity-30">
                <ChevronRight size={18} className="text-gray-600" />
              </button>
              <button className="p-1.5 rounded-full hover:bg-gray-100">
                <RefreshCw size={16} className="text-gray-600" />
              </button>
            </div>

            <div className="flex-1 flex items-center bg-[#f0f2f5] rounded-full px-3 py-1.5 border border-transparent hover:border-gray-300 transition-all group">
              <div className="flex items-center gap-2 mr-2">
                <Lock size={12} className="text-gray-500" />
              </div>
              <input 
                type="text" 
                readOnly
                value={`https://${currentProject?.title?.toLowerCase()?.replace(/\s+/g, '-') || 'replit'}.com`}
                className="bg-transparent border-none outline-none text-xs text-gray-700 w-full"
              />
              <div className="flex items-center gap-2 ml-2">
                <Star size={14} className="text-gray-500 cursor-pointer hover:text-yellow-500" />
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button className="p-1.5 rounded hover:bg-gray-100">
                <User size={18} className="text-gray-600" />
              </button>
              <button className="p-1.5 rounded hover:bg-gray-100 font-bold text-gray-600">
                ...
              </button>
            </div>
          </div>
        </div>

        {/* Browser Content */}
        <div className="flex-1 bg-white overflow-auto flex flex-col items-center justify-center text-center p-8">
          <div className="max-w-md space-y-6">
            <div className="text-8xl mb-8 opacity-20 grayscale">
              {currentProject?.image}
            </div>
            <h1 className="text-2xl font-semibold text-gray-800">
              {currentProject?.title}
            </h1>
            <p className="text-gray-500 leading-relaxed">
              Welcome to the preview window for {currentProject?.title}. This project is currently under synchronization.
            </p>
            <div className="pt-8 flex flex-col items-center gap-4">
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="w-1/3 h-full bg-[#007aff] animate-pulse" />
              </div>
              <span className="text-[11px] text-gray-400 uppercase tracking-widest font-bold">
                Connection Secure
              </span>
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <div className="h-6 bg-[#f3f3f3] border-t border-gray-200 px-3 flex items-center justify-between shrink-0">
          <span className="text-[10px] text-gray-500">Ready</span>
          <div className="flex items-center gap-3">
             <span className="text-[10px] text-gray-500">100%</span>
          </div>
        </div>
      </div>
    </div>
  )
}

