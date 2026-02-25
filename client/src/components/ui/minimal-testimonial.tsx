"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

const testimonials = [
  {
    quote: "Working with them transformed our entire brand identity. The attention to detail was exceptional.",
    name: "Sarah Chen",
    role: "CEO at Stripe",
    image: "https://images.unsplash.com/photo-1701615004837-40d8573b6652?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDB8fGF2YXRhcnN8ZW58MHx8MHx8fDA%3D$0",
  },
  {
    quote: "A rare talent who combines strategic thinking with flawless execution. Highly recommended.",
    name: "Marcus Johnson",
    role: "Design Lead at Linear",
    image: "https://images.unsplash.com/photo-1639149888905-fb39731f2e6c?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDN8fGF2YXRhcnN8ZW58MHx8MHx8fDA%3D$0",
  },
  {
    quote: "The most seamless collaboration I've experienced. They truly understand modern design.",
    name: "Elena Voss",
    role: "Founder at Notion",
    image: "https://plus.unsplash.com/premium_photo-1689977830819-d00b3a9b7363?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTJ8fGF2YXRhcnN8ZW58MHx8MHx8fDA%3D$0",
  },
]

const AUTO_PLAY_DURATION = 5000 // 5 seconds

export function TestimonialsMinimal() {
  const [active, setActive] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const startTime = Date.now()
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const newProgress = (elapsed / AUTO_PLAY_DURATION) * 100
      
      if (newProgress >= 100) {
        setActive((prev) => (prev + 1) % testimonials.length)
        setProgress(0)
      } else {
        setProgress(newProgress)
      }
    }, 16) // ~60fps

    return () => clearInterval(interval)
  }, [active])

  return (
    <div className="w-full max-w-2xl mx-auto px-6 py-16 text-center">
      {/* Quote */}
      <div className="relative min-h-[140px] mb-12 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={active}
            initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-xl md:text-2xl font-light leading-relaxed text-foreground"
          >
            "{testimonials[active].quote}"
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Author Row */}
      <div className="flex flex-col items-center gap-6">
        <div className="flex items-center gap-6">
          {/* Avatars */}
          <div className="flex -space-x-2">
            {testimonials.map((t, i) => (
              <button
                key={i}
                onClick={() => {
                  setActive(i)
                  setProgress(0)
                }}
                className={`
                  relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-background
                  transition-all duration-300 ease-out
                  ${active === i ? "z-10 scale-110" : "grayscale hover:grayscale-0 hover:scale-105"}
                `}
              >
                <img src={t.image || "/placeholder.svg"} alt={t.name} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="h-8 w-px bg-border" />

          {/* Active Author Info */}
          <div className="text-left min-w-[140px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col justify-center"
              >
                <span className="text-sm font-medium text-foreground">{testimonials[active].name}</span>
                <span className="text-xs text-muted-foreground">{testimonials[active].role}</span>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-48 h-0.5 bg-muted rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-foreground/20"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1, ease: "linear" }}
          />
        </div>
      </div>
    </div>
  )
}
