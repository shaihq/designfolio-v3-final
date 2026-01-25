import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Check, Sparkle, Mail, Linkedin, Instagram, Dribbble, ArrowUpRight, 
  Plus, Sparkles, Pencil, FileText, Smartphone, Monitor, Search, Layers,
  Trash2, GripVertical, Paintbrush, Upload, Lock, Crown, Eye, EyeOff,
  RotateCcw, Bell
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
      // Save to localStorage for Dashboard to pick up
      localStorage.setItem('pending-portfolio-data', JSON.stringify(content));
      // Navigate to dashboard
      window.location.href = '/dashboard';
    }
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 sm:p-8">
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
          className="relative w-full max-w-5xl h-[90vh] bg-background border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        >
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-heading font-semibold">
              {isStructured ? "Generated Portfolio Structure" : "Your Portfolio Content"}
            </h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 sm:p-10">
            {isStructured ? (
              <div className="max-w-4xl mx-auto space-y-3">
                {/* Profile Card */}
                <div className="z-10 mb-3">
                  <Card className="bg-white border-0 rounded-2xl relative" style={{ boxShadow: '0 0 0 1px rgba(0,0,0,0.03), 0 0 40px rgba(0,0,0,0.015)' }}>
                    {/* Edit Button - Top Right */}
                    <div className="absolute top-4 right-4 z-10">
                      <Button 
                        variant="outline" 
                        size="icon"
                        className="rounded-full h-11 w-11"
                      >
                        <Pencil className="w-5 h-5" />
                      </Button>
                    </div>

                    {/* Profile Info */}
                    <div className="p-6 sm:p-8 pb-6">
                      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
                        <TooltipProvider>
                          <Tooltip delayDuration={300}>
                            <Magnetic intensity={0.2} range={100}>
                              <TooltipTrigger asChild>
                                <motion.div 
                                  initial={{ opacity: 0, filter: "blur(10px)", scale: 0.95 }}
                                  animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl flex items-center justify-center relative overflow-hidden shrink-0 bg-[#f6f2ef] preserve-3d" 
                                  style={{ 
                                    backgroundColor: '#F5F3F1',
                                    perspective: "1000px"
                                  }} 
                                >
                                  <img 
                                    src="/advanced.png" 
                                    alt={content.user?.name} 
                                    className="w-16 h-16 sm:w-24 sm:h-24 object-contain"
                                  />
                                </motion.div>
                              </TooltipTrigger>
                            </Magnetic>
                            <TooltipContent 
                              side="top" 
                              className="bg-[#1A1A1A] text-white border-0 px-4 py-2 rounded-xl flex items-center gap-2 shadow-xl"
                            >
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
                            Hey, I'm {content.user?.name?.split(' ')[0] || "Shai"}!
                          </motion.h1>
                          <motion.p 
                            initial={{ opacity: 0, filter: "blur(10px)", y: 10 }}
                            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1], delay: 0.3 }}
                            className="text-sm sm:text-base text-foreground/50 leading-relaxed max-w-2xl" 
                          >
                            {content.user?.role}
                          </motion.p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Skills Banner Strip */}
                    <div 
                      className="relative overflow-hidden border-t border-border/10 py-3 bg-[#F8F7F5] rounded-b-2xl" 
                    >
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
                  {/* My Works Section */}
                  <motion.div
                    key="works"
                    layout
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
                        <h2 className="text-sm font-medium text-foreground/50 uppercase tracking-wider">
                          My works
                        </h2>
                        <div className="flex items-center gap-3">
                          <motion.svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="text-foreground/30"
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              ease: "linear"
                            }}
                          >
                            <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
                          </motion.svg>
                          <Button
                            variant="outline"
                            size="icon"
                            className="rounded-full h-11 w-11"
                          >
                            <Plus className="w-5 h-5" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {content.caseStudies?.map((project: any, i: number) => (
                          <motion.div
                            key={project.id || i}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                            className="group relative"
                          >
                            <div 
                              className="w-full h-full bg-white border border-border/10 rounded-2xl overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.02)] transition-all duration-300 flex flex-col min-h-[360px]"
                            >
                              <div className="w-full h-48 flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-[#FCF9F6] to-[#F5F1ED]">
                                <img 
                                  src={i % 2 === 0 ? "/casestudyux1.svg" : "/casestudyux2.svg"}
                                  alt={project.title} 
                                  className="w-20 h-20 object-contain group-hover:scale-110 transition-transform duration-500 opacity-20"
                                />
                                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <div className="bg-white/80 backdrop-blur-md p-2 rounded-full shadow-lg">
                                    <ArrowUpRight className="w-4 h-4" />
                                  </div>
                                </div>
                              </div>
                              <div className="p-5 flex-1 flex flex-col justify-between">
                                <div>
                                  <Badge className="text-[10px] font-medium bg-muted/50 text-muted-foreground border-none px-2 py-0 mb-2 no-default-hover-elevate">
                                    {project.category}
                                  </Badge>
                                  <h3 className="text-base font-semibold mb-1 text-foreground leading-tight">{project.title}</h3>
                                  <p className="text-xs text-foreground/40 line-clamp-2 leading-relaxed font-medium">
                                    {project.description}
                                  </p>
                                </div>
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
                        <h2 className="text-sm font-medium text-foreground/50 uppercase tracking-wider">
                          Work Experience
                        </h2>
                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-full h-11 w-11"
                        >
                          <Plus className="w-5 h-5" />
                        </Button>
                      </div>
                      <div className="space-y-6">
                        {content.workExperiences?.map((exp: any, i: number) => (
                          <div key={i} className="flex gap-4 group">
                            <div className="w-12 h-12 rounded-xl bg-[#F5F3F1] flex items-center justify-center shrink-0 border border-black/[0.03]">
                              <img 
                                src={`https://api.dicebear.com/7.x/initials/svg?seed=${exp.company}`}
                                alt={exp.company}
                                className="w-8 h-8 rounded-lg"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start mb-1">
                                <h3 className="font-semibold text-base truncate">{exp.role}</h3>
                                <span className="text-xs text-foreground/40 whitespace-nowrap ml-2 font-medium uppercase tracking-wider">{exp.period}</span>
                              </div>
                              <p className="text-[#FF553E] text-sm font-medium mb-2">{exp.company}</p>
                              <p className="text-sm text-foreground/50 leading-relaxed font-medium">
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
                        <h2 className="text-sm font-medium text-foreground/50 uppercase tracking-wider">
                          About Me
                        </h2>
                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-full h-11 w-11"
                        >
                          <Pencil className="w-5 h-5" />
                        </Button>
                      </div>
                      <div className="space-y-4 text-foreground/80 leading-relaxed mb-8 font-medium">
                        <p>
                          {content.user?.aboutMe || "I am a passionate product designer dedicated to creating intuitive and impactful digital experiences. I specialize in bridging the gap between user needs and business goals through thoughtful design and prototyping."}
                        </p>
                      </div>

                      {/* Pin Board */}
                      <div className="relative group/pegboard mb-8">
                        <div className="absolute inset-0 bg-black/5 rounded-2xl translate-y-[2px] translate-x-[1px] blur-[3px] pointer-events-none" />
                        <div className="relative w-full aspect-[16/9] bg-[#FFFFFF] rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.02)] z-10 overflow-visible border border-black/[0.03]">
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
                          <div className="absolute inset-0 flex items-center justify-center">
                            <motion.div
                              initial={{ rotate: -5 }}
                              className="w-32 aspect-[4/3] p-1 bg-white shadow-[0_8px_16px_rgba(0,0,0,0.06),0_2px_4px_rgba(0,0,0,0.02)] rounded-sm"
                            >
                              <div className="w-full h-full overflow-hidden rounded-sm bg-[#f6f2ef] flex items-center justify-center">
                                <img src="/advanced.png" className="w-16 h-16" alt="" />
                              </div>
                              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 flex items-center justify-center pointer-events-none z-20">
                                <div className="w-5 h-5 rounded-full bg-[#FF553E] shadow-[0_2px_4px_rgba(0,0,0,0.2),inset_0_-1px_2px_rgba(0,0,0,0.2)] relative" />
                              </div>
                            </motion.div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>

                  {/* Testimonials Section */}
                  <motion.div
                    key="testimonials"
                    layout
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
                        <h2 className="text-sm font-medium text-foreground/50 uppercase tracking-wider">
                          What people say
                        </h2>
                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-full h-11 w-11"
                        >
                          <Plus className="w-5 h-5" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          { name: "Sarah Chen", company: "Stripe", text: "Morgan's approach to design thinking transformed how our team tackles complex problems." },
                          { name: "James Rodriguez", company: "Airbnb", text: "Working with Morgan was a game-changer for our design system." }
                        ].map((t, i) => (
                          <div key={i} className="p-6 rounded-2xl bg-[#F8F7F5] border border-black/[0.03] flex flex-col justify-between min-h-[160px]">
                            <p className="text-sm text-foreground/70 mb-4 italic font-medium leading-relaxed">"{t.text}"</p>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-border/20 flex items-center justify-center text-xs font-bold border border-black/5">
                                {t.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-foreground">{t.name}</p>
                                <p className="text-[11px] text-foreground/40 font-medium uppercase tracking-wider">{t.company}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </motion.div>

                  {/* Footer */}
                  <motion.footer
                    key="footer"
                    layout
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
              <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap font-sans text-foreground/90">
                {content.raw || content}
              </div>
            )}
          </div>
          <div className="p-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/80 backdrop-blur-md">
            <p className="text-sm text-muted-foreground italic">
              Looks good? Click confirm to populate your dashboard.
            </p>
            <div className="flex gap-3 w-full sm:w-auto">
              <Button variant="outline" className="flex-1 sm:flex-none rounded-full px-8" onClick={onClose}>
                Discard
              </Button>
              <Button 
                className="flex-1 sm:flex-none bg-[#FF553E] hover:bg-[#E64935] text-white rounded-full px-8 shadow-lg shadow-[#FF553E]/20" 
                onClick={handleApply}
              >
                {isStructured ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Confirm & Start Designing
                  </>
                ) : "Close Preview"}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
