import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Sparkles, Plus } from "lucide-react";
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
              <div className="space-y-12">
                {/* Hero Section */}
                <section className="flex flex-col items-start gap-6">
                  <div className="space-y-4">
                    <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-foreground">
                      Hey, I'm <span className="text-[#FF553E]">{content.user?.name?.split(' ')[0] || "Shai"}</span>!
                    </h1>
                    <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
                      {content.user?.role}
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {content.user?.categories?.map((cat: string, i: number) => (
                      <Badge 
                        key={i} 
                        variant="secondary"
                        className="bg-white/50 backdrop-blur-sm border-border/50 text-foreground px-4 py-1.5 rounded-full text-sm font-medium hover-elevate"
                      >
                        {cat}
                      </Badge>
                    ))}
                  </div>

                  {content.user?.skills && (
                    <div className="w-full max-w-md mt-4 p-6 bg-white/40 backdrop-blur-md rounded-2xl border border-white/20 shadow-sm">
                      <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="w-4 h-4 text-[#FF553E]" />
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Expertise</h3>
                      </div>
                      <div className="space-y-4">
                        {content.user.skills.slice(0, 4).map((skill: any, i: number) => (
                          <div key={i} className="space-y-1.5">
                            <div className="flex justify-between text-xs font-medium">
                              <span>{skill.name}</span>
                              <span className="text-muted-foreground">{skill.level}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-black/5 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${skill.level}%` }}
                                transition={{ duration: 1, delay: i * 0.1 }}
                                className="h-full bg-[#FF553E]"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </section>

                {/* Experience Section */}
                <section>
                  <div className="flex items-center gap-2 mb-6">
                    <div className="h-px flex-1 bg-border/50" />
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground px-4">Experience</h3>
                    <div className="h-px flex-1 bg-border/50" />
                  </div>
                  <div className="grid gap-4">
                    {content.workExperiences?.map((exp: any, i: number) => (
                      <Card key={i} className="bg-white/50 backdrop-blur-sm border-0 shadow-sm p-6 hover-elevate transition-all">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <h4 className="font-bold text-lg">{exp.role}</h4>
                            <p className="text-[#FF553E] font-medium">{exp.company}</p>
                          </div>
                          <Badge variant="outline" className="w-fit rounded-full px-4 py-1 border-border/50">
                            {exp.period}
                          </Badge>
                        </div>
                        <p className="mt-4 text-muted-foreground text-sm leading-relaxed">
                          {exp.description}
                        </p>
                      </Card>
                    ))}
                  </div>
                </section>

                {/* Projects Section */}
                <section>
                  <div className="flex items-center gap-2 mb-6">
                    <div className="h-px flex-1 bg-border/50" />
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground px-4">Selected Works</h3>
                    <div className="h-px flex-1 bg-border/50" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {content.caseStudies?.map((cs: any, i: number) => (
                      <Card key={i} className="group overflow-hidden border-0 shadow-sm hover-elevate transition-all bg-white">
                        <div className="aspect-video bg-muted/30 relative flex items-center justify-center p-8">
                          <div className="absolute inset-0 bg-gradient-to-br from-[#FF553E]/5 to-transparent" />
                          <div className="w-20 h-20 rounded-2xl bg-white shadow-xl flex items-center justify-center">
                            <Plus className="w-8 h-8 text-[#FF553E] group-hover:rotate-90 transition-transform duration-500" />
                          </div>
                        </div>
                        <div className="p-6">
                          <Badge className="mb-3 bg-[#FF553E]/10 text-[#FF553E] border-none hover:bg-[#FF553E]/10">
                            {cs.category}
                          </Badge>
                          <h4 className="font-bold text-lg mb-2">{cs.title}</h4>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {cs.description}
                          </p>
                        </div>
                      </Card>
                    ))}
                  </div>
                </section>
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
