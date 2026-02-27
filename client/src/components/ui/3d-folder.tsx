"use client"

import { useState, useRef, useEffect, useLayoutEffect, useCallback } from "react"
import { cn } from "@/lib/utils"
import { X, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react"

interface Project {
  id: string
  image: string
  title: string
}

interface AnimatedFolderProps {
  title: string
  projects: Project[]
  className?: string
}

export function AnimatedFolder({ title, projects, className }: AnimatedFolderProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [sourceRect, setSourceRect] = useState<DOMRect | null>(null)
  const [hiddenCardId, setHiddenCardId] = useState<string | null>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  const handleProjectClick = (project: Project, index: number) => {
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

      <ImageLightbox
        projects={projects.slice(0, 1)}
        currentIndex={selectedIndex ?? 0}
        isOpen={selectedIndex !== null}
        onClose={handleCloseLightbox}
        sourceRect={sourceRect}
        onCloseComplete={handleCloseComplete}
        onNavigate={handleNavigate}
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

function ImageLightbox({
  projects,
  currentIndex,
  isOpen,
  onClose,
  sourceRect,
  onCloseComplete,
  onNavigate,
}: any) {
  const [animationPhase, setAnimationPhase] = useState<"initial" | "animating" | "complete">("initial")
  const [isClosing, setIsClosing] = useState(false)
  const [shouldRender, setShouldRender] = useState(false)
  const [internalIndex, setInternalIndex] = useState(currentIndex)
  const [prevIndex, setPrevIndex] = useState(currentIndex)
  const [isSliding, setIsSliding] = useState(false)
  const [slideDirection, setSlideDirection] = useState<"left" | "right">("right")

  useEffect(() => {
    if (isOpen && currentIndex !== internalIndex && !isSliding) {
      const direction = currentIndex > internalIndex ? "left" : "right"
      setSlideDirection(direction)
      setPrevIndex(internalIndex)
      setIsSliding(true)
      setTimeout(() => {
        setInternalIndex(currentIndex)
        setIsSliding(false)
      }, 400)
    }
  }, [currentIndex, isOpen, internalIndex, isSliding])

  useEffect(() => {
    if (isOpen) {
      setInternalIndex(currentIndex)
      setPrevIndex(currentIndex)
      setIsSliding(false)
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

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
      onClick={handleClose}
      style={{
        opacity: isClosing ? 0 : 1,
        transition: "opacity 400ms",
      }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />
      <div 
        className="relative bg-white rounded-xl shadow-2xl overflow-hidden max-w-2xl w-full aspect-video flex items-center justify-center text-4xl"
        onClick={e => e.stopPropagation()}
        style={{
          transform: animationPhase === "initial" ? "scale(0.5)" : "scale(1)",
          transition: "transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        {projects[internalIndex]?.image}
        <button onClick={handleClose} className="absolute top-4 right-4 p-2 bg-black/10 rounded-full hover:bg-black/20 transition-colors">
          <X size={20} />
        </button>
      </div>
    </div>
  )
}
