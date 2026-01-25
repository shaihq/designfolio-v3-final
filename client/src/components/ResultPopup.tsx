import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Sparkle } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";

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
                {/* Profile Card - Exact Dashboard Replica */}
                <div className="z-10 mb-3">
                  <Card className="bg-white border-0 rounded-2xl relative" style={{ boxShadow: '0 0 0 1px rgba(0,0,0,0.03), 0 0 40px rgba(0,0,0,0.015)' }}>
                    {/* Profile Info */}
                    <div className="p-6 sm:p-8 pb-6">
                      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
                        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl flex items-center justify-center relative overflow-hidden shrink-0 bg-[#f6f2ef]">
                          <img 
                            src="/advanced.png" 
                            alt={content.user?.name} 
                            className="w-16 h-16 sm:w-24 sm:h-24 object-contain"
                          />
                        </div>
                        
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
                    
                    {/* Skills Banner Strip */}
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

                {/* Experience Card */}
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
                          <p className="text-sm text-foreground/50 leading-relaxed line-clamp-2">
                            {exp.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Works Section */}
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
