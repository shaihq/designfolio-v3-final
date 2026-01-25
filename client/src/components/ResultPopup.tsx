import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Check, Sparkle, Mail, Linkedin, Instagram, Dribbble, ArrowUpRight, 
  Plus, Sparkles, Pencil, FileText, Smartphone, Monitor, Search, Layers,
  Trash2, GripVertical, Paintbrush, Upload, Lock, Crown, Eye, EyeOff, Bell
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { SiBehance } from "react-icons/si";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Magnetic } from "@/components/ui/magnetic";

const CrypticText = ({ text, className }: { text: string; className?: string }) => {
  const [displayText, setDisplayText] = useState(text.split('').map(() => ''));
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.5 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isInView) return;

    const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const targetChars = text.split('');
    let iteration = 0;

    const interval = setInterval(() => {
      setDisplayText((prev) =>
        targetChars.map((char, index) => {
          if (index < iteration) {
            return targetChars[index];
          }
          if (char === ' ') return ' ';
          return chars[Math.floor(Math.random() * chars.length)];
        })
      );

      iteration += 1 / 3;

      if (iteration >= targetChars.length) {
        clearInterval(interval);
        setDisplayText(targetChars);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [isInView, text]);

  return (
    <span ref={containerRef} className={className}>
      {displayText.join('')}
    </span>
  );
};

interface ResultPopupProps {
  content: any;
  onClose: () => void;
}

export function ResultPopup({ content, onClose }: ResultPopupProps) {
  const isStructured = typeof content === 'object' && !content.raw;
  
  const handleApply = () => {
    if (isStructured) {
      localStorage.setItem('pending-portfolio-data', JSON.stringify(content));
      window.location.href = '/dashboard';
    }
    onClose();
  };

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 sm:p-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-5xl h-[90vh] bg-background border-[6px] border-white/20 rounded-2xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-md"
        >
          {/* Chrome-style Top Bar */}
          <div className="bg-[#f1f3f4] dark:bg-[#202124] border-b border-border/50 flex items-center h-12 px-4 shrink-0">
            <div className="flex gap-1.5 w-[72px]">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e]"></div>
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]"></div>
              <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]"></div>
            </div>
            
            <div className="flex-1 flex justify-center px-4">
              <div className="bg-white dark:bg-[#2a2a2a] rounded-lg h-8 px-4 flex items-center gap-2 border border-black/5 dark:border-white/5 w-fit min-w-[240px] shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                <Lock className="w-3 h-3 text-foreground/40" />
                <span className="text-[11px] text-foreground/40 font-medium truncate">your-new-portfolio.designfolio.me</span>
              </div>
            </div>

            <div className="flex items-center gap-2 justify-end">
              {isStructured && (
                <>
                  <Button 
                    variant="outline"
                    onClick={onClose} 
                    className="rounded-full h-8 px-4 text-xs font-bold border-border/50 transition-all focus-visible:ring-0 focus-visible:ring-offset-0"
                    data-testid="button-discard"
                  >
                    Discard
                  </Button>
                  <Button 
                    onClick={handleApply} 
                    className="bg-[#FF553E] hover:bg-[#FF553E]/90 text-white rounded-full h-8 px-4 text-xs font-bold shadow-sm active-elevate-2 transition-all focus-visible:ring-0 focus-visible:ring-offset-0"
                    data-testid="button-open-editor"
                  >
                    Open in Editor
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Subtle feedback message below bar */}
          <div className="bg-white/50 dark:bg-black/10 px-6 py-2 border-b border-border/10 flex justify-center">
            <span className="text-[10px] uppercase tracking-[0.1em] font-bold text-foreground/30">
              Hope you like your new portfolio!
            </span>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 sm:p-10 bg-[#F8F7F5]">
            {isStructured ? (
              <div className="max-w-4xl mx-auto space-y-3">
                {/* Profile Card */}
                <div className="z-10 mb-3">
                  <Card className="bg-white border-0 rounded-2xl relative" style={{ boxShadow: '0 0 0 1px rgba(0,0,0,0.03), 0 0 40px rgba(0,0,0,0.015)' }}>
                    <div className="p-6 sm:p-8 pb-6">
                      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
                        <TooltipProvider>
                          <Tooltip delayDuration={300}>
                            <Magnetic intensity={0.2} range={100}>
                              <TooltipTrigger asChild>
                                <motion.div 
                                  initial={{ opacity: 0, filter: "blur(10px)", scale: 0.95 }}
                                  animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                                  whileHover={{ 
                                    scale: 1.05,
                                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.03)"
                                  }}
                                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl flex items-center justify-center relative overflow-hidden shrink-0 bg-[#f6f2ef] preserve-3d" 
                                  style={{ backgroundColor: '#F5F3F1', perspective: "1000px" }} 
                                  data-testid="avatar-profile"
                                >
                                  <img 
                                    src="/advanced.png" 
                                    alt={content.user?.name} 
                                    className="w-16 h-16 sm:w-24 sm:h-24 object-contain"
                                  />
                                </motion.div>
                              </TooltipTrigger>
                            </Magnetic>
                            <TooltipContent side="top" className="bg-[#1A1A1A] text-white border-0 px-4 py-2 rounded-xl flex items-center gap-2 shadow-xl">
                              <span className="text-sm font-medium">Happy to have you here</span>
                              <img src="/handshake.png" alt="Handshake" className="w-5 h-5 object-contain" />
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        <div className="flex-1">
                          <motion.h1 
                            initial={{ opacity: 0, filter: "blur(10px)", y: 10 }}
                            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
                            className="text-2xl sm:text-3xl font-semibold mb-2 font-heading" 
                          >
                            {content.user?.name || "Shai!"}
                          </motion.h1>
                          <motion.p 
                            initial={{ opacity: 0, filter: "blur(10px)", y: 10 }}
                            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1], delay: 0.3 }}
                            className="text-sm sm:text-base text-foreground/50 leading-relaxed max-w-2xl font-medium" 
                          >
                            {content.user?.role}
                          </motion.p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="relative overflow-hidden border-t border-border/10 py-3 bg-[#F8F7F5] rounded-b-2xl">
                      <div className="flex gap-4 animate-scroll px-8 opacity-40">
                        {(content.user?.categories || []).concat(content.user?.categories || []).map((category: string, index: number) => (
                          <div key={index} className="flex items-center gap-3 shrink-0">
                            <span className="text-[12px] font-medium whitespace-nowrap uppercase text-[#0A0A0A] tracking-normal">
                              {category}
                            </span>
                            <Sparkle className="w-2.5 h-2.5 fill-[#0A0A0A] text-[#0A0A0A]" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                </div>

                <div className="mt-3">
                  {/* Works Section */}
                  <motion.div
                    key="works"
                    layout
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.01 }}
                    transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
                  >
                    <Card className="bg-white border-0 rounded-2xl p-6 mb-3" style={{ boxShadow: '0 0 0 1px rgba(0,0,0,0.03), 0 0 40px rgba(0,0,0,0.015)' }}>
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-medium text-foreground/50 uppercase tracking-wider">My works</h2>
                        <div className="flex items-center gap-3">
                          <motion.svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-foreground/30" animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }}>
                            <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
                          </motion.svg>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {content.caseStudies?.map((project: any, i: number) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="group relative"
                          >
                            <div className="bg-white dark:bg-card rounded-xl lg:rounded-2xl border border-border overflow-hidden shadow-lg flex flex-col relative z-20 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full">
                              <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-[#FCF9F6] to-[#F5F1ED]">
                                <img
                                  src={i % 2 === 0 ? "/casestudyux1.svg" : "/casestudyux2.svg"}
                                  alt={project.title}
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <div className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg">
                                    <ArrowUpRight className="w-5 h-5 text-foreground" />
                                  </div>
                                </div>
                              </div>
                              <div className="p-5 flex-1 flex flex-col">
                                <h3 className="font-heading text-lg font-semibold text-foreground mb-1 line-clamp-2 min-h-[3rem]">
                                  {project.title}
                                </h3>
                                <p className="text-sm text-foreground/50">
                                  {project.category}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </Card>
                  </motion.div>

                  {/* Work Experience Section */}
                  <motion.div
                    key="work_experience"
                    layout
                    id="section-work-experience"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.01 }}
                    transition={{
                      duration: 0.7,
                      ease: [0.21, 0.47, 0.32, 0.98],
                    }}
                  >
                    <Card className="bg-white border-0 rounded-2xl p-6 mb-3" style={{ boxShadow: '0 0 0 1px rgba(0,0,0,0.03), 0 0 40px rgba(0,0,0,0.015)' }}>
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-sm font-medium text-foreground/50 uppercase tracking-wider" data-testid="text-work-experience-title">
                          Work Experience
                        </h2>
                      </div>
                      
                      <div className="space-y-4">
                        {content.workExperiences?.map((exp: any, i: number) => (
                          <div 
                            key={i} 
                            className="group flex gap-5 p-4 rounded-2xl border border-border/30 bg-[#F5F3F1] hover-elevate transition-all duration-300"
                            data-testid={`card-work-experience-${i}`}
                          >
                            <div className="shrink-0">
                              <div className="w-12 h-12 rounded-xl border border-border/50 bg-white flex items-center justify-center overflow-hidden">
                                <img 
                                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${exp.company}`}
                                  alt={exp.company}
                                  className="w-8 h-8 rounded-lg"
                                />
                              </div>
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h3 className="font-semibold text-base truncate" data-testid={`text-experience-role-${i}`}>
                                  {exp.role}
                                </h3>
                                <span className="text-xs font-medium text-foreground/40 shrink-0" data-testid={`text-experience-period-${i}`}>
                                  {exp.period}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm font-medium text-foreground/60" data-testid={`text-experience-company-${i}`}>
                                  {exp.company}
                                </span>
                              </div>
                              <p className="text-sm text-foreground/50 leading-relaxed line-clamp-2" data-testid={`text-experience-description-${i}`}>
                                {exp.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </motion.div>

                  {/* About Me Section */}
                  <motion.div
                    key="about"
                    layout
                    id="section-about"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.01 }}
                    transition={{
                      duration: 0.7,
                      ease: [0.21, 0.47, 0.32, 0.98],
                    }}
                  >
                    <Card className="bg-white border-0 rounded-2xl p-6 mt-0 mb-3" style={{ boxShadow: '0 0 0 1px rgba(0,0,0,0.03), 0 0 40px rgba(0,0,0,0.015)' }}>
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-sm font-medium text-foreground/50 uppercase tracking-wider" data-testid="text-about-title">
                          About Me
                        </h2>
                      </div>
                      <div className="space-y-4 text-foreground/80 leading-relaxed mb-8">
                        <p data-testid="text-about-description-1">
                          {content.user?.aboutMe || "I am a passionate product designer dedicated to creating intuitive and impactful digital experiences. With over 6 years of experience, I specialize in bridging the gap between user needs and business goals through thoughtful design and prototyping."}
                        </p>
                      </div>

                      {/* Pin Board (Authentic Pegboard) */}
                      <div className="relative group/pegboard mb-8">
                        <div className="absolute inset-0 bg-black/5 rounded-2xl translate-y-[2px] translate-x-[1px] blur-[3px] pointer-events-none" />

                        <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] lg:aspect-[16/9] bg-[#FFFFFF] rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.02)] z-10 overflow-visible border border-black/[0.03]">
                          <div
                            className="absolute inset-0 pointer-events-none rounded-2xl"
                            style={{
                              backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.1) 2px, transparent 2px)`,
                              backgroundSize: '36px 36px',
                              backgroundPosition: 'center',
                              padding: '18px',
                              backgroundOrigin: 'content-box',
                              backgroundClip: 'content-box',
                            }}
                          />
                          <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] overflow-hidden" />
                          <div className="absolute inset-0 bg-gradient-to-tr from-black/[0.01] via-transparent to-white/[0.05] pointer-events-none overflow-hidden" />
                          
                          <motion.div
                            initial={{ rotate: -5, left: '20%', top: '25%', x: '-50%', y: '-50%' }}
                            animate={{ left: '20%', top: '25%', x: '-50%', y: '-50%' }}
                            className="absolute w-24 sm:w-28 md:w-36 lg:w-40 aspect-[4/3] p-1 bg-white shadow-[0_8px_16px_rgba(0,0,0,0.06),0_2px_4px_rgba(0,0,0,0.02)] z-10 rounded-sm"
                          >
                            <div className="w-full h-full overflow-hidden rounded-sm">
                              <img src="/portraits/portrait1.png" alt="" className="w-full h-full object-cover" />
                            </div>
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 flex items-center justify-center z-20">
                              <div className="w-5 h-5 rounded-full bg-[#FF553E] shadow-[0_2px_4px_rgba(0,0,0,0.2),inset_0_-1px_2px_rgba(0,0,0,0.2)]" />
                            </div>
                          </motion.div>

                          <motion.div
                            initial={{ rotate: 3, left: '80%', top: '30%', x: '-50%', y: '-50%' }}
                            animate={{ left: '80%', top: '30%', x: '-50%', y: '-50%' }}
                            className="absolute w-28 sm:w-32 md:w-40 lg:w-44 aspect-square p-1 bg-white shadow-[0_8px_16px_rgba(0,0,0,0.06),0_2px_4px_rgba(0,0,0,0.02)] z-20 rounded-sm"
                          >
                            <div className="w-full h-full overflow-hidden rounded-sm">
                              <img src="/portraits/portrait2.png" alt="" className="w-full h-full object-cover" />
                            </div>
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 flex items-center justify-center z-20">
                              <div className="w-5 h-5 rounded-full bg-[#FF553E] shadow-[0_2px_4px_rgba(0,0,0,0.2),inset_0_-1px_2px_rgba(0,0,0,0.2)]" />
                            </div>
                          </motion.div>
                        </div>
                      </div>
                      <div className="text-center text-[10px] text-foreground/20 font-medium tracking-widest uppercase pointer-events-none mb-4">
                        Try moving things around :)
                      </div>
                    </Card>
                  </motion.div>

                  {/* Testimonials Section */}
                  <motion.div
                    key="testimonials"
                    layout
                    id="section-testimonials"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.01 }}
                    transition={{
                      duration: 0.7,
                      ease: [0.21, 0.47, 0.32, 0.98],
                    }}
                  >
                    <Card className="bg-white border-0 rounded-2xl p-6 mt-0 mb-3" style={{ boxShadow: '0 0 0 1px rgba(0,0,0,0.03), 0 0 40px rgba(0,0,0,0.015)' }}>
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-medium text-foreground/50 uppercase tracking-wider" data-testid="text-testimonials-title">
                          Testimonials
                        </h2>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        {[
                          { id: 1, name: "Sarah Chen", company: "Stripe", text: "Morgan's approach to design thinking transformed how our team tackles complex problems." },
                          { id: 2, name: "James Rodriguez", company: "Airbnb", text: "Working with Morgan was a game-changer for our design system." }
                        ].map((t, idx) => (
                          <motion.div
                            key={t.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            className="group rounded-2xl p-6 flex flex-col relative transition-all duration-300 bg-white hover-elevate shadow-[0_0_0_1px_rgba(0,0,0,0.04),0_2px_12px_rgba(0,0,0,0.04)]"
                            data-testid={`card-testimonial-${t.id}`}
                          >
                            <div className="mb-4 mt-2 flex items-center justify-between">
                              <svg width="24" height="20" viewBox="0 0 40 32" fill="none" className="text-foreground/20">
                                <path d="M0 13.5C0 7.5 2.5 2.5 7.5 -1.5L10.5 1.5C7 4.5 5 8 5 12C5 12.5 5.1 13 5.2 13.5C6 13 7 12.5 8.5 12.5C10.5 12.5 12 13 13.5 14.5C15 16 15.5 18 15.5 20C15.5 22 15 24 13.5 25.5C12 27 10.5 27.5 8.5 27.5C6 27.5 4 26.5 2.5 24.5C1 22.5 0 19.5 0 15.5V13.5ZM24 13.5C24 7.5 26.5 2.5 31.5 -1.5L34.5 1.5C31 4.5 29 8 29 12C29 12.5 29.1 13 29.2 13.5C30 13 31 12.5 32.5 12.5C34.5 12.5 36 13 37.5 14.5C39 16 39.5 18 39.5 20C39.5 22 39 24 37.5 25.5C36 27 34.5 27.5 32.5 27.5C30 27.5 28 26.5 26.5 24.5C25 22.5 24 19.5 24 15.5V13.5Z" fill="currentColor"/>
                              </svg>
                              <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Pencil className="w-4 h-4" />
                              </Button>
                            </div>
                            <p className="text-base leading-relaxed mb-8 flex-1 text-foreground/80">
                              {t.text}
                            </p>
                            <div className="flex items-center justify-between gap-3 mt-auto">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#FFB088] flex items-center justify-center text-white text-xs font-bold">
                                  {t.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div>
                                  <h3 className="font-semibold text-sm mb-0.5 text-foreground">{t.name}</h3>
                                  <p className="text-xs text-foreground/60">{t.company}</p>
                                </div>
                              </div>
                              <Linkedin className="w-5 h-5 text-foreground/20" />
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </Card>
                  </motion.div>

                  {/* Toolbox Section */}
                  <motion.div
                    key="toolbox"
                    layout
                    id="section-toolbox"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.01 }}
                    transition={{
                      duration: 0.7,
                      ease: [0.21, 0.47, 0.32, 0.98],
                    }}
                  >
                    <Card className="bg-white border-0 rounded-2xl p-6 mt-0 mb-3 overflow-visible" style={{ boxShadow: '0 0 0 1px rgba(0,0,0,0.03), 0 0 40px rgba(0,0,0,0.015)' }}>
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-medium text-foreground/50 uppercase tracking-wider">
                          Toolbox
                        </h2>
                        <Button variant="outline" size="icon" className="rounded-full h-11 w-11">
                          <Plus className="w-5 h-5" />
                        </Button>
                      </div>

                      <div className="relative mt-2 overflow-x-hidden overflow-y-visible -mx-6 px-6">
                        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-20 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
                        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-20 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />

                        <div className="flex group">
                          <div className="flex animate-scroll group-hover:[animation-play-state:paused] py-4">
                            {["Figma", "Figjam", "Maze", "Webflow", "Protopie", "Jitter", "Figma", "Figjam", "Maze", "Webflow", "Protopie", "Jitter"].map((tool, idx) => (
                              <div
                                key={idx}
                                className="bg-white border border-border/30 rounded-2xl p-3 md:p-4 hover-elevate mx-2 shrink-0 flex items-center justify-center w-16 h-16 md:w-20 md:h-20 cursor-default"
                              >
                                <div className="w-8 h-8 md:w-10 md:h-10 bg-muted rounded flex items-center justify-center text-[10px] font-bold text-foreground/40">
                                  {tool.substring(0, 2).toUpperCase()}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>

                  {/* Footer Section */}
                  <motion.footer
                    key="footer"
                    layout
                    id="footer"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.01 }}
                    transition={{
                      duration: 0.7,
                      ease: [0.21, 0.47, 0.32, 0.98],
                    }}
                    className="relative pb-12"
                  >
                    <Card className="bg-white border-0 rounded-2xl overflow-hidden" style={{ boxShadow: '0 0 0 1px rgba(0,0,0,0.03), 0 0 40px rgba(0,0,0,0.015)' }}>
                      <div className="p-8 sm:p-12">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-12">
                          <div className="space-y-6 max-w-sm">
                            <h2 className="text-3xl font-semibold leading-tight font-heading">
                              Let's build something <span className="text-[#FF553E]">great</span> together.
                            </h2>
                            <div className="flex flex-col gap-3">
                              <div className="flex items-center gap-2 text-foreground/60 group cursor-pointer hover:text-[#FF553E] transition-colors">
                                <Mail className="w-4 h-4" />
                                <span className="text-sm font-medium">{content.user?.contact?.email || 'hello@example.com'}</span>
                                <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" />
                              </div>
                              <div className="flex items-center gap-2 text-foreground/60">
                                <span className="text-sm font-medium">{content.user?.contact?.location || 'San Francisco, CA'}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-4">
                            {[Linkedin, Instagram, Dribbble, SiBehance].map((Icon, i) => (
                              <Button key={i} variant="outline" size="icon" className="rounded-full h-11 w-11 hover:bg-[#FF553E] hover:text-white transition-all border-black/[0.05]">
                                <Icon className="w-4 h-4" />
                              </Button>
                            ))}
                          </div>
                        </div>

                        <div className="pt-12 flex flex-col items-center justify-center gap-4">
                          <Button 
                            variant="outline" 
                            size="icon"
                            className="rounded-full h-11 w-11"
                            data-testid="button-edit-footer"
                          >
                            <Pencil className="w-5 h-5" />
                          </Button>
                          <svg
                            width="120"
                            height="40"
                            viewBox="0 0 120 40"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="text-foreground/20"
                          >
                            <motion.path
                              d="M10 20C17 13 23 27 30 20C37 13 43 27 50 20C57 13 63 27 70 20C77 13 83 27 90 20C97 13 103 27 110 20"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              initial={{ pathLength: 0, opacity: 0 }}
                              whileInView={{ pathLength: 1, opacity: 1 }}
                              transition={{
                                pathLength: { duration: 2, ease: "easeInOut" },
                                opacity: { duration: 0.3 }
                              }}
                            />
                          </svg>
                          <CrypticText text={`© ${content.user?.name?.toUpperCase() || "SHAI KRISHNA"}`} className="text-[11px] font-bold uppercase tracking-[0.3em] text-foreground/20" />
                        </div>
                      </div>
                    </Card>
                  </motion.footer>
                </div>
              </div>
            ) : (
              <pre className="p-4 bg-muted rounded-lg overflow-x-auto whitespace-pre-wrap font-mono text-sm">
                {content.raw || JSON.stringify(content, null, 2)}
              </pre>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}
