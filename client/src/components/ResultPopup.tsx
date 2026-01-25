import { motion, AnimatePresence } from "framer-motion";
import { X, Check } from "lucide-react";
import { Button } from "./ui/button";

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
              <div className="space-y-8">
                <section>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Profile</h3>
                  <div className="bg-secondary/30 p-4 rounded-xl border">
                    <p className="text-lg font-medium">{content.user?.name}</p>
                    <p className="text-muted-foreground">{content.user?.role}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {content.user?.categories?.map((cat: string, i: number) => (
                        <span key={i} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md border border-primary/20">
                          {cat}
                        </span>
                      ))}
                    </div>

                    {content.user?.skills && (
                      <div className="mt-6 space-y-3">
                        <p className="text-sm font-medium text-muted-foreground">Skills</p>
                        <div className="space-y-2">
                          {content.user.skills.map((skill: any, i: number) => (
                            <div key={i} className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span>{skill.name}</span>
                                <span>{skill.level}%</span>
                              </div>
                              <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-primary transition-all duration-500" 
                                  style={{ width: `${skill.level}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </section>

                <section>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Experience</h3>
                  <div className="space-y-3">
                    {content.workExperiences?.map((exp: any, i: number) => (
                      <div key={i} className="bg-secondary/30 p-4 rounded-xl border">
                        <p className="font-medium">{exp.role} @ {exp.company}</p>
                        <p className="text-xs text-muted-foreground mb-2">{exp.period}</p>
                        <p className="text-sm">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <section>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Projects</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {content.caseStudies?.map((cs: any, i: number) => (
                      <div key={i} className="bg-secondary/30 p-4 rounded-xl border">
                        <p className="font-medium">{cs.title}</p>
                        <p className="text-xs text-primary mb-2">{cs.category}</p>
                        <p className="text-sm text-muted-foreground">{cs.description}</p>
                      </div>
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
          <div className="p-4 border-t flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>Discard</Button>
            <Button className="bg-[#FF553E] hover:bg-[#E64935]" onClick={handleApply}>
              {isStructured ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Pre-fill My Dashboard
                </>
              ) : "Close Preview"}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
