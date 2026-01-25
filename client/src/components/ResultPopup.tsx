import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Sparkle, Mail, Linkedin, Instagram, Dribbble, ArrowUpRight } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { SiBehance } from "react-icons/si";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Magnetic } from "@/components/ui/magnetic";

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
                {/* Header Section: Exact Dashboard Profile Card Replica */}
                <div className="z-10 mb-3">
                  <Card className="bg-white border-0 rounded-2xl relative" style={{ boxShadow: '0 0 0 1px rgba(0,0,0,0.03), 0 0 40px rgba(0,0,0,0.015)' }}>
                    <div className="p-6 sm:p-8 pb-6">
                      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
                        <TooltipProvider>
                          <Tooltip delayDuration={300}>
                            <Magnetic intensity={0.2} range={100}>
                              <TooltipTrigger asChild>
                                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl flex items-center justify-center relative overflow-hidden shrink-0 bg-[#f6f2ef]">
                                  <img 
                                    src="/advanced.png" 
                                    alt={content.user?.name} 
                                    className="w-16 h-16 sm:w-24 sm:h-24 object-contain"
                                  />
                                </div>
                              </TooltipTrigger>
                            </Magnetic>
                            <TooltipContent side="top" className="bg-[#1A1A1A] text-white border-0 px-4 py-2 rounded-xl flex items-center gap-2 shadow-xl">
                              <span className="text-sm font-medium">Happy to have you here</span>
                              <img src="/handshake.png" alt="Handshake" className="w-5 h-5 object-contain" />
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        <div className="flex-1">
                          <h1 className="text-2xl sm:text-3xl font-semibold mb-2 font-heading">
                            Hey, I'm {content.user?.name?.split(' ')[0] || "Shai"}!
                          </h1>
                          <p className="text-sm sm:text-base text-foreground/50 leading-relaxed max-w-2xl">
                            {content.user?.role}
                          </p>
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

                {/* My Works Section */}
                <Card className="bg-white border-0 rounded-2xl p-6 mb-3" style={{ boxShadow: '0 0 0 1px rgba(0,0,0,0.03), 0 0 40px rgba(0,0,0,0.015)' }}>
                  <h2 className="text-sm font-medium text-foreground/50 uppercase tracking-wider mb-6">
                    My works
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {content.caseStudies?.map((cs: any, i: number) => (
                      <div key={i} className="bg-white border-0 rounded-2xl overflow-hidden relative shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_2px_8px_rgba(0,0,0,0.04)]">
                        <div className="w-full h-48 flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-[#FCF9F6] to-[#F5F1ED]">
                          <img 
                            src={i % 2 === 0 ? "/casestudyux1.svg" : "/casestudyux2.svg"}
                            className="w-20 h-20 opacity-20"
                            alt=""
                          />
                        </div>
                        <div className="p-4">
                          <Badge className="text-[10px] font-medium bg-muted/50 text-muted-foreground border-none px-2 py-0 mb-2">
                            {cs.category}
                          </Badge>
                          <h3 className="text-sm font-semibold mb-1 truncate">{cs.title}</h3>
                          <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                            {cs.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Work Experience Section */}
                <Card className="bg-white border-0 rounded-2xl p-6 mb-3" style={{ boxShadow: '0 0 0 1px rgba(0,0,0,0.03), 0 0 40px rgba(0,0,0,0.015)' }}>
                  <h2 className="text-sm font-medium text-foreground/50 uppercase tracking-wider mb-6">
                    Work Experience
                  </h2>
                  <div className="space-y-6">
                    {content.workExperiences?.map((exp: any, i: number) => (
                      <div key={i} className="flex gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#F5F3F1] flex items-center justify-center shrink-0">
                          <img 
                            src={`https://api.dicebear.com/7.x/initials/svg?seed=${exp.company}`}
                            alt={exp.company}
                            className="w-8 h-8 rounded-lg"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-1">
                            <h3 className="font-semibold text-base truncate">{exp.role}</h3>
                            <span className="text-xs text-foreground/40 whitespace-nowrap ml-2">{exp.period}</span>
                          </div>
                          <p className="text-[#FF553E] text-sm font-medium mb-2">{exp.company}</p>
                          <p className="text-sm text-foreground/50 leading-relaxed">
                            {exp.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* About Me Section: Humane Intro with Mock Pegboard */}
                <Card className="bg-white border-0 rounded-2xl p-6 mb-3" style={{ boxShadow: '0 0 0 1px rgba(0,0,0,0.03), 0 0 40px rgba(0,0,0,0.015)' }}>
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex-1">
                      <h2 className="text-sm font-medium text-foreground/50 uppercase tracking-wider mb-4">
                        About Me
                      </h2>
                      <p className="text-base text-foreground/70 leading-relaxed italic">
                        "{content.user?.aboutMe || "I believe in design that balances utility with delight, creating products that people actually want to use every day."}"
                      </p>
                    </div>
                    {/* Mock Pegboard Component */}
                    <div className="w-full md:w-[300px] aspect-square rounded-2xl bg-[#F5F3F1] border-2 border-dashed border-border/50 flex items-center justify-center relative overflow-hidden">
                      <div className="grid grid-cols-6 grid-rows-6 gap-4 opacity-10">
                        {Array.from({ length: 36 }).map((_, i) => (
                          <div key={i} className="w-2 h-2 rounded-full bg-black" />
                        ))}
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center transform rotate-12">
                          <img src="/advanced.png" className="w-10 h-10" alt="" />
                        </div>
                        <div className="absolute top-10 right-10 w-12 h-12 rounded-lg bg-white shadow-md flex items-center justify-center transform -rotate-6">
                          <Sparkle className="w-6 h-6 text-[#FF553E]" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Testimonials Section: Default Mock Data */}
                <Card className="bg-white border-0 rounded-2xl p-6 mb-3" style={{ boxShadow: '0 0 0 1px rgba(0,0,0,0.03), 0 0 40px rgba(0,0,0,0.015)' }}>
                  <h2 className="text-sm font-medium text-foreground/50 uppercase tracking-wider mb-6">
                    What people say
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { name: "Sarah Chen", company: "Stripe", text: "Exceptional design thinking and technical execution." },
                      { name: "James Rodriguez", company: "Airbnb", text: "Transformed our complex user flow into something elegant." }
                    ].map((t, i) => (
                      <div key={i} className="p-4 rounded-xl bg-[#F8F7F5] border border-border/10">
                        <p className="text-sm text-foreground/70 mb-4 italic">"{t.text}"</p>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-border/20 flex items-center justify-center text-[10px] font-bold">
                            {t.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="text-xs font-semibold">{t.name}</p>
                            <p className="text-[10px] text-foreground/40">{t.company}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Toolbox Section: Static Default Data */}
                <Card className="bg-white border-0 rounded-2xl p-6 mb-3" style={{ boxShadow: '0 0 0 1px rgba(0,0,0,0.03), 0 0 40px rgba(0,0,0,0.015)' }}>
                  <h2 className="text-sm font-medium text-foreground/50 uppercase tracking-wider mb-6">
                    My Toolbox
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {["Figma", "Webflow", "React", "Tailwind", "Framer", "Adobe CC"].map((tool, i) => (
                      <Badge key={i} variant="outline" className="rounded-full px-4 py-1.5 border-border/50 bg-[#F8F7F5]">
                        {tool}
                      </Badge>
                    ))}
                  </div>
                </Card>

                {/* Footer Section: Resume Contact Data */}
                <footer className="mt-12 py-12 px-6 sm:px-8 border-t border-border/10">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-12">
                    <div className="space-y-6 max-w-sm">
                      <h2 className="text-3xl font-semibold leading-tight font-heading">
                        Let's build something <span className="text-[#FF553E]">great</span> together.
                      </h2>
                      <div className="flex flex-col gap-3">
                        <a href={`mailto:${content.user?.contact?.email || 'hello@example.com'}`} className="flex items-center gap-2 text-foreground/60 hover:text-[#FF553E] transition-colors group">
                          <Mail className="w-4 h-4" />
                          <span className="text-sm">{content.user?.contact?.email || 'hello@example.com'}</span>
                          <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" />
                        </a>
                        <div className="flex items-center gap-2 text-foreground/60">
                          <span className="text-sm">{content.user?.contact?.location || 'San Francisco, CA'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4">
                      <Button variant="outline" size="icon" className="rounded-full hover:bg-[#FF553E] hover:text-white transition-all">
                        <Linkedin className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="rounded-full hover:bg-[#FF553E] hover:text-white transition-all">
                        <Instagram className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="rounded-full hover:bg-[#FF553E] hover:text-white transition-all">
                        <Dribbble className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="rounded-full hover:bg-[#FF553E] hover:text-white transition-all">
                        <SiBehance className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </footer>
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
