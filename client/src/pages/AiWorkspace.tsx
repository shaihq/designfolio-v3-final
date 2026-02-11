import { Link, useLocation } from "wouter";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { 
  Home, 
  FileText, 
  Users, 
  DollarSign, 
  Mail, 
  Upload, 
  Send, 
  Sparkles, 
  Loader2, 
  RefreshCcw, 
  Search, 
  PenTool, 
  Lock,
  Landmark 
} from "lucide-react";
import { RulerCarousel, type CarouselItem } from "@/components/ui/ruler-carousel";
import ScannerCardStream from "@/components/ui/scanner-card-stream";
import ResumeAnalysisReport from "@/components/resume-analysis-report";
import { CaseStudyAuditIcon } from "@/components/ui/case-study-audit-icon";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { ResponseStream } from "@/components/ui/response-stream";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";

interface WorkspaceTool extends CarouselItem {
  icon: LucideIcon;
  description: string;
}

const navItems: WorkspaceTool[] = [
  { id: 1, title: "Resume Fixer", icon: FileText, description: "Optimize your resume for ATS and impact." },
  { id: 2, title: "Mock Interview", icon: Users, description: "Practice with AI-driven interview questions." },
  { id: 3, title: "Salary Negotiation", icon: Landmark, description: "Get data-backed negotiation strategies." },
  { id: 4, title: "Email Generator", icon: Mail, description: "Draft professional outreach and follow-ups." },
  { id: 5, title: "Case Study Audit", icon: Search, description: "Get critical feedback on your design case studies." },
  { id: 6, title: "Write Case Study using AI", icon: PenTool, description: "Write compelling case studies with AI assistance." },
];

export default function AiWorkspace() {
  const [, setLocation] = useLocation();
  const [selectedTool, setSelectedTool] = useState(0);
  const [uploadedResume, setUploadedResume] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [role, setRole] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [interviewRound, setInterviewRound] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isMocking, setIsMocking] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [isGeneratingEmail, setIsGeneratingEmail] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [emailGenerated, setEmailGenerated] = useState(false);
  const [emailData, setEmailData] = useState({ subject: "", body: "" });
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const currentTool = navItems[selectedTool];

  const handleResumeUpload = (file: File) => {
    setUploadedResume(file);
    console.log("Uploaded file:", file.name);
  };

  const handleAnalyze = async () => {
    if (!uploadedResume || !jobDescription) return;
    
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setAnalysisComplete(false);
    
    // Simulate AI analysis process
    const duration = 5000;
    const interval = 50;
    const steps = duration / interval;
    const increment = 100 / steps;
    
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= 100) {
        clearInterval(timer);
        setAnalysisProgress(100);
        setTimeout(() => {
          setIsAnalyzing(false);
          setAnalysisComplete(true);
        }, 800);
      } else {
        setAnalysisProgress(current);
      }
    }, interval);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setJobDescription(text);
      }
    } catch (err) {
      console.error("Failed to read clipboard:", err);
    }
  };

  const handleStartMock = () => {
    setIsMocking(true);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setCurrentAnswer("");
  };

  const [showTetris, setShowTetris] = useState(false);

  const onStartMockClick = () => {
    setShowTetris(true);
    setTimeout(() => {
      setShowTetris(false);
      handleStartMock();
    }, 2000);
  };

  const mockQuestions = [
    {
      question: "Imagine a core application you are responsible for is suddenly experiencing intermittent performance degradation, but there have been no recent code deployments. Describe your initial diagnostic steps and the tools or methodologies you'd employ to pinpoint the root cause, considering both infrastructure and application layers.",
      tip: "Tool Selection → Implementation → Best Practices → Optimization → Results"
    },
    {
      question: "How do you handle conflict within a design team when two senior designers have diametrically opposed views on a critical UX decision?",
      tip: "Empathy → Evidence-based → Consensus → Action"
    },
    {
      question: "Walk me through your process for performing a deep-dive audit on a complex user flow that is seeing high drop-off rates.",
      tip: "Data Analysis → User Research → Heuristic Evaluation → Hypothesis"
    },
    {
      question: "Describe a time you had to make a significant trade-off between user experience and technical feasibility. How did you arrive at the decision?",
      tip: "Constraint → Rationale → Collaboration → Outcome"
    },
    {
      question: "How do you stay updated with the latest trends and technologies in your field, and how have you applied a recent learning to your work?",
      tip: "Source → Learning → Application → Impact"
    }
  ];

  const handleNextQuestion = () => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex] = currentAnswer;
    setAnswers(updatedAnswers);
    
    if (currentQuestionIndex < mockQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setCurrentAnswer("");
    } else {
      // End of interview - for now just reset or show complete
      setIsMocking(false);
      setAnalysisComplete(true); // Reuse analysis complete state for summary or similar
    }
  };

  const handleGenerateEmail = () => {
    setIsGeneratingEmail(true);
    setAnalysisProgress(0);
    setEmailGenerated(false);

    const duration = 5000;
    const interval = 50;
    const steps = duration / interval;
    const increment = 100 / steps;

    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= 100) {
        clearInterval(timer);
        setAnalysisProgress(100);
        setTimeout(() => {
          setIsGeneratingEmail(false);
          setEmailGenerated(true);
          setEmailData({
            subject: "Follow-up: Interview for Senior Product Designer at Company X",
            body: "Hi Interviewer Name,\n\nIt was a pleasure meeting you and learning more about the Senior Product Designer position at Company X. I am very excited about the opportunity and believe my background in UX design and product strategy aligns well with the team's goals.\n\nThank you again for your time and consideration. I look forward to hearing from you.\n\nBest regards,\nYour Name"
          });
        }, 500);
      } else {
        setAnalysisProgress(current);
      }
    }, interval);
  };

  const [salaryTab, setSalaryTab] = useState("Enter Details Manually");

  const renderToolForm = () => {
    if (isMocking) {
      const currentQ = mockQuestions[currentQuestionIndex];
      return (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-foreground">
              Q. {currentQuestionIndex + 1} of {mockQuestions.length}
            </h3>
            <Button 
              onClick={handleNextQuestion}
              disabled={!currentAnswer.trim()}
              className="bg-[#1A1F2C] text-white hover:bg-[#1A1F2C]/90 rounded-full px-8 h-11 font-medium transition-all"
            >
              {currentQuestionIndex === mockQuestions.length - 1 ? 'Finish Interview' : 'Next Question'}
            </Button>
          </div>

          {/* Progress Indicator */}
          <div className="flex gap-2 w-full">
            {mockQuestions.map((_, i) => (
              <div 
                key={i} 
                className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                  i === currentQuestionIndex 
                    ? 'bg-[#FF553E]' 
                    : i < currentQuestionIndex 
                      ? 'bg-[#FF553E]/40' 
                      : 'bg-muted/30'
                }`} 
              />
            ))}
          </div>

          <div className="space-y-6 pt-4">
            <ResponseStream 
              textStream={currentQ.question}
              mode="fade"
              speed={40}
              className="text-base font-medium text-foreground leading-relaxed"
            />

            <div className="relative group">
              <div className="bg-white dark:bg-white border-2 border-border rounded-2xl hover:border-foreground/20 focus-within:border-foreground/30 focus-within:shadow-[0_0_0_4px_hsl(var(--foreground)/0.12)] transition-all duration-300 ease-out overflow-hidden">
                <Textarea 
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value.slice(0, 500))}
                  placeholder="Type your answer here..." 
                  className="border-0 bg-transparent min-h-[240px] px-6 py-5 focus-visible:ring-0 focus-visible:ring-offset-0 text-base text-foreground placeholder:text-muted-foreground/40 resize-none" 
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="text-sm font-medium text-foreground/60">
                Characters remaining: {500 - currentAnswer.length}
              </div>
              <div className="flex items-center gap-2 text-sm text-foreground/60">
                <Sparkles className="w-4 h-4 text-yellow-500" />
                <span className="font-medium italic">Tip: {currentQ.tip}</span>
              </div>
            </div>
          </div>
        </motion.div>
      );
    }

    switch (currentTool.id) {
      case 1: // Resume Fixer
        return (
          <div className="space-y-4">
            <AnimatePresence mode="wait">
              {isAnalyzing ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col items-center justify-center py-4 space-y-6"
                >
                  <ScannerCardStream isScanning={true} file={uploadedResume} />
                  
                  <div className="w-full max-w-xs space-y-3 text-center">
                    <div className="flex items-center justify-center gap-2 text-foreground font-medium">
                      <Loader2 className="w-4 h-4 animate-spin text-[#FF553E]" />
                      <span className="text-sm">AI is thinking...</span>
                    </div>
                    <div className="h-1.5 w-full bg-foreground/5 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-[#FF553E]"
                        initial={{ width: 0 }}
                        animate={{ width: `${analysisProgress}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                      Matching Job Requirements
                    </p>
                  </div>
                </motion.div>
              ) : analysisComplete ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full space-y-8"
                >
                  <div className="flex items-center justify-between mb-8">
                    <Button 
                      onClick={() => {
                        setAnalysisComplete(false);
                        setUploadedResume(null);
                        setJobDescription("");
                      }}
                      variant="outline"
                      className="rounded-full border-foreground/20 bg-white/50 backdrop-blur-sm"
                    >
                      <RefreshCcw className="w-4 h-4 mr-2 text-foreground/60" />
                      Start New Analysis
                    </Button>

                    <Button 
                      variant="outline"
                      className="rounded-full border-foreground/20 bg-white/50 backdrop-blur-sm"
                    >
                      <FileText className="w-4 h-4 mr-2 text-foreground/60" />
                      Download Report (PDF)
                    </Button>
                  </div>
                  
                  <ResumeAnalysisReport />
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="resume" className="text-sm font-medium text-foreground ml-1">Upload Resume</Label>
                    <input 
                      type="file" 
                      id="resume"
                      accept=".pdf,.docx" 
                      className="hidden" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleResumeUpload(file);
                        }
                      }}
                    />
                    <div 
                      onClick={() => document.getElementById('resume')?.click()}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.currentTarget.classList.add('border-[#FF553E]', 'bg-[#FF553E]/[0.02]');
                      }}
                      onDragLeave={(e) => {
                        e.preventDefault();
                        e.currentTarget.classList.remove('border-[#FF553E]', 'bg-[#FF553E]/[0.02]');
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.currentTarget.classList.remove('border-[#FF553E]', 'bg-[#FF553E]/[0.02]');
                        const file = e.dataTransfer.files?.[0];
                        if (file && (file.type === "application/pdf" || file.name.endsWith(".docx"))) {
                          handleResumeUpload(file);
                        }
                      }}
                      className={`p-6 rounded-2xl border-2 border-dashed transition-all duration-300 group cursor-pointer ${
                        uploadedResume 
                          ? 'border-[#FF553E]/20 bg-[#FF553E]/[0.02]' 
                          : 'border-border/40 bg-white/50 hover:border-[#FF553E]/20 hover:bg-[#FF553E]/[0.01]'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                          uploadedResume ? 'bg-[#FF553E]/10' : 'bg-muted/30 group-hover:bg-[#FF553E]/10'
                        }`}>
                          {uploadedResume ? (
                            <FileText className="w-5 h-5 text-[#FF553E]" />
                          ) : (
                            <Upload className="w-5 h-5 text-foreground/30 group-hover:text-[#FF553E] transition-colors" />
                          )}
                        </div>
                        <div className="flex-1 text-left">
                          <h4 className="text-sm font-semibold text-foreground">
                            {uploadedResume ? uploadedResume.name : 'Update Resume'}
                          </h4>
                          <p className="text-[11px] text-foreground/40 font-medium">
                            {uploadedResume 
                              ? `Size: ${(uploadedResume.size / 1024 / 1024).toFixed(2)} MB`
                              : 'PDF or DOCX • Max 5MB'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between ml-1">
                      <Label htmlFor="job-desc" className="text-sm font-medium text-foreground">Job description</Label>
                      {!jobDescription && (
                        <button 
                          onClick={handlePaste}
                          className="text-[11px] font-medium text-foreground hover:text-foreground/80 underline underline-offset-4 transition-colors flex items-center gap-1"
                        >
                          <Upload className="w-3 h-3" />
                          Paste
                        </button>
                      )}
                    </div>
                    <div className="bg-white dark:bg-white border-2 border-border rounded-2xl hover:border-foreground/20 focus-within:border-foreground/30 focus-within:shadow-[0_0_0_4px_hsl(var(--foreground)/0.12)] transition-all duration-300 ease-out overflow-hidden">
                      <Textarea 
                        id="job-desc" 
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        placeholder="Paste the job description here..." 
                        className="border-0 bg-transparent min-h-[100px] px-4 py-3 focus-visible:ring-0 focus-visible:ring-offset-0 text-base text-foreground placeholder:text-muted-foreground/60 resize-none" 
                      />
                    </div>
                  </div>
                  <Button 
                    onClick={handleAnalyze}
                    disabled={!uploadedResume || !jobDescription}
                    className="w-full bg-foreground text-background hover:bg-foreground/90 focus-visible:outline-none border-0 rounded-full h-11 px-6 text-base font-semibold transition-colors disabled:opacity-50"
                  >
                    Analyze Resume
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      case 2: // Mock Interview
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="role" className="text-sm font-medium text-foreground ml-1">Role you're applying for*</Label>
              <div className="bg-white dark:bg-white border-2 border-border rounded-2xl hover:border-foreground/20 focus-within:border-foreground/30 focus-within:shadow-[0_0_0_4px_hsl(var(--foreground)/0.12)] transition-all duration-300 ease-out">
                <Input 
                  id="role" 
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. SPD" 
                  className="border-0 bg-transparent h-11 px-4 focus-visible:ring-0 focus-visible:ring-offset-0 text-base text-foreground placeholder:text-muted-foreground/60" 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="experience" className="text-sm font-medium text-foreground ml-1">Experience Level*</Label>
              <div className="bg-white dark:bg-white border-2 border-border rounded-2xl hover:border-foreground/20 focus-within:border-foreground/30 focus-within:shadow-[0_0_0_4px_hsl(var(--foreground)/0.12)] transition-all duration-300 ease-out">
                <Input 
                  id="experience" 
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  placeholder="Entry Level 0-2 years" 
                  className="border-0 bg-transparent h-11 px-4 focus-visible:ring-0 focus-visible:ring-offset-0 text-base text-foreground placeholder:text-muted-foreground/60" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="round" className="text-sm font-medium text-foreground ml-1">Interview Round*</Label>
              <div className="bg-white dark:bg-white border-2 border-border rounded-2xl hover:border-foreground/20 focus-within:border-foreground/30 focus-within:shadow-[0_0_0_4px_hsl(var(--foreground)/0.12)] transition-all duration-300 ease-out">
                <Input 
                  id="round" 
                  value={interviewRound}
                  onChange={(e) => setInterviewRound(e.target.value)}
                  placeholder="e.g. Design Challenge, Portfolio Review" 
                  className="border-0 bg-transparent h-11 px-4 focus-visible:ring-0 focus-visible:ring-offset-0 text-base text-foreground placeholder:text-muted-foreground/60" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mock-job-desc" className="text-sm font-medium text-foreground ml-1">Paste Job Description*</Label>
              <div className="bg-white dark:bg-white border-2 border-border rounded-2xl hover:border-foreground/20 focus-within:border-foreground/30 focus-within:shadow-[0_0_0_4px_hsl(var(--foreground)/0.12)] transition-all duration-300 ease-out overflow-hidden">
                <Textarea 
                  id="mock-job-desc" 
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Copy and paste the JD from Linkedin, WellFound or any job platform" 
                  className="border-0 bg-transparent min-h-[120px] px-4 py-3 focus-visible:ring-0 focus-visible:ring-offset-0 text-base text-foreground placeholder:text-muted-foreground/60 resize-none" 
                />
              </div>
            </div>

            <Button 
              onClick={onStartMockClick}
              disabled={!role || !experienceLevel || !interviewRound || !jobDescription}
              className="w-full bg-[#1A1F2C] text-white hover:bg-[#1A1F2C]/90 focus-visible:outline-none border-0 rounded-2xl h-12 px-6 text-base font-semibold transition-colors mt-2"
            >
              Start Mock Interview
            </Button>
            {showTetris && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                <div className="bg-white p-8 rounded-3xl shadow-xl flex flex-col items-center gap-4">
                  <TetrisLoading />
                  <p className="text-sm font-medium text-foreground animate-pulse">Initializing your interview session...</p>
                </div>
              </div>
            )}
          </div>
        );
      case 3: // Salary Negotiation
        return (
          <div className="space-y-6">
            <div className="flex justify-center">
              <SegmentedControl 
                options={["Enter Details Manually", "Upload Offer Letter"]}
                value={salaryTab}
                onChange={setSalaryTab}
                className="w-full"
              />
            </div>

            {salaryTab === "Enter Details Manually" ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-salary" className="text-sm font-medium text-foreground ml-1">Current Salary*</Label>
                    <div className="bg-white dark:bg-white border-2 border-border rounded-full hover:border-foreground/20 focus-within:border-foreground/30 focus-within:shadow-[0_0_0_4px_hsl(var(--foreground)/0.12)] transition-all duration-300 ease-out">
                      <Input id="current-salary" placeholder="e.g. $75,000" className="border-0 bg-transparent h-11 px-4 focus-visible:ring-0 focus-visible:ring-offset-0 text-base text-foreground placeholder:text-muted-foreground/60" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="offered-salary" className="text-sm font-medium text-foreground ml-1">Offered Salary*</Label>
                    <div className="bg-white dark:bg-white border-2 border-border rounded-full hover:border-foreground/20 focus-within:border-foreground/30 focus-within:shadow-[0_0_0_4px_hsl(var(--foreground)/0.12)] transition-all duration-300 ease-out">
                      <Input id="offered-salary" placeholder="e.g. $75,000" className="border-0 bg-transparent h-11 px-4 focus-visible:ring-0 focus-visible:ring-offset-0 text-base text-foreground placeholder:text-muted-foreground/60" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="position-title" className="text-sm font-medium text-foreground ml-1">Position Title</Label>
                    <div className="bg-white dark:bg-white border-2 border-border rounded-full hover:border-foreground/20 focus-within:border-foreground/30 focus-within:shadow-[0_0_0_4px_hsl(var(--foreground)/0.12)] transition-all duration-300 ease-out">
                      <Input id="position-title" placeholder="e.g. Senior Product Designer" className="border-0 bg-transparent h-11 px-4 focus-visible:ring-0 focus-visible:ring-offset-0 text-base text-foreground placeholder:text-muted-foreground/60" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company" className="text-sm font-medium text-foreground ml-1">Company</Label>
                    <div className="bg-white dark:bg-white border-2 border-border rounded-full hover:border-foreground/20 focus-within:border-foreground/30 focus-within:shadow-[0_0_0_4px_hsl(var(--foreground)/0.12)] transition-all duration-300 ease-out">
                      <Input id="company" placeholder="e.g. Tesla" className="border-0 bg-transparent h-11 px-4 focus-visible:ring-0 focus-visible:ring-offset-0 text-base text-foreground placeholder:text-muted-foreground/60" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country" className="text-sm font-medium text-foreground ml-1">Country</Label>
                  <div className="bg-white dark:bg-white border-2 border-border rounded-full hover:border-foreground/20 focus-within:border-foreground/30 focus-within:shadow-[0_0_0_4px_hsl(var(--foreground)/0.12)] transition-all duration-300 ease-out">
                    <Input id="country" defaultValue="United States" className="border-0 bg-transparent h-11 px-4 focus-visible:ring-0 focus-visible:ring-offset-0 text-base text-foreground" />
                  </div>
                </div>

                <Button className="w-full bg-[#1A1F2C] text-white hover:bg-[#1A1F2C]/90 focus-visible:outline-none border-0 rounded-full h-12 px-6 text-base font-semibold transition-colors mt-2">Analyze Offer</Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div 
                  className="p-8 rounded-2xl border-2 border-dashed border-border/40 bg-white/50 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-[#FF553E]/20 hover:bg-[#FF553E]/[0.01] transition-all"
                  onClick={() => document.getElementById('offer-letter-upload')?.click()}
                >
                  <input type="file" id="offer-letter-upload" className="hidden" />
                  <div className="w-12 h-12 rounded-xl bg-muted/30 flex items-center justify-center">
                    <Upload className="w-6 h-6 text-foreground/30" />
                  </div>
                  <div className="text-center">
                    <h4 className="text-sm font-semibold text-foreground">Upload Offer Letter</h4>
                    <p className="text-[11px] text-foreground/40 font-medium">PDF or DOCX • Max 5MB</p>
                  </div>
                </div>
                <Button className="w-full bg-[#1A1F2C] text-white hover:bg-[#1A1F2C]/90 focus-visible:outline-none border-0 rounded-full h-12 px-6 text-base font-semibold transition-colors">Analyze Offer</Button>
              </div>
            )}
          </div>
        );
      case 4: // Email Generator
        return (
          <AnimatePresence mode="wait">
            {isGeneratingEmail ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center justify-center py-4 space-y-6"
              >
                <div className="flex flex-col items-center">
                  <TetrisLoading size="sm" speed="fast" loadingText="Drafting your email..." />
                </div>
              </motion.div>
            ) : emailGenerated ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-foreground/60 uppercase tracking-wider">Email Preview</h3>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline"
                      size="sm"
                      className="rounded-full bg-white/50"
                      onClick={() => setEmailGenerated(false)}
                    >
                      <RefreshCcw className="w-3 h-3 mr-2" />
                      Edit Details
                    </Button>
                    <Button 
                      size="sm"
                      className="rounded-full bg-foreground text-background"
                      onClick={() => {
                        navigator.clipboard.writeText(`Subject: ${emailData.subject}\n\n${emailData.body}`);
                      }}
                    >
                      <PenTool className="w-3 h-3 mr-2" />
                      Copy Email
                    </Button>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-border/50 shadow-sm overflow-hidden font-sans">
                  {/* Chrome-like Email Mock Header */}
                  <div className="bg-muted/30 border-b border-border/50 px-6 py-4 space-y-3">
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-muted-foreground w-16">Subject:</span>
                      <span className="font-medium text-foreground">{emailData.subject}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm border-t border-border/30 pt-3">
                      <span className="text-muted-foreground w-16">From:</span>
                      <span className="text-foreground">you@example.com</span>
                    </div>
                  </div>
                  <div className="p-8 min-h-[300px] whitespace-pre-wrap text-foreground leading-relaxed">
                    {emailData.body}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
              >
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-type" className="text-sm font-medium text-foreground ml-1">Email Type*</Label>
                    <div className="bg-white dark:bg-white border-2 border-border rounded-full hover:border-foreground/20 focus-within:border-foreground/30 focus-within:shadow-[0_0_0_4px_hsl(var(--foreground)/0.12)] transition-all duration-300 ease-out overflow-hidden">
                      <select 
                        id="email-type" 
                        className="w-full bg-transparent h-11 px-4 focus:outline-none text-base text-foreground appearance-none cursor-pointer"
                        defaultValue="Interview Follow-up"
                      >
                        <option value="Interview Follow-up">Interview Follow-up</option>
                        <option value="Thank You">Thank You</option>
                        <option value="Technical Interview Follow-up">Technical Interview Follow-up</option>
                        <option value="Second Round Interview Follow-up">Second Round Interview Follow-up</option>
                        <option value="HR Round Follow-up">HR Round Follow-up</option>
                        <option value="Offer Acceptance">Offer Acceptance</option>
                        <option value="Custom">Custom</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company-name" className="text-sm font-medium text-foreground ml-1">Company Name*</Label>
                    <div className="bg-white dark:bg-white border-2 border-border rounded-full hover:border-foreground/20 focus-within:border-foreground/30 focus-within:shadow-[0_0_0_4px_hsl(var(--foreground)/0.12)] transition-all duration-300 ease-out">
                      <Input id="company-name" placeholder="Enter company name" className="border-0 bg-transparent h-11 px-4 focus-visible:ring-0 focus-visible:ring-offset-0 text-base text-foreground placeholder:text-muted-foreground/60" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position" className="text-sm font-medium text-foreground ml-1">Position*</Label>
                    <div className="bg-white dark:bg-white border-2 border-border rounded-full hover:border-foreground/20 focus-within:border-foreground/30 focus-within:shadow-[0_0_0_4px_hsl(var(--foreground)/0.12)] transition-all duration-300 ease-out">
                      <Input id="position" placeholder="Enter position title" className="border-0 bg-transparent h-11 px-4 focus-visible:ring-0 focus-visible:ring-offset-0 text-base text-foreground placeholder:text-muted-foreground/60" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="interviewer-name" className="text-sm font-medium text-foreground ml-1">Interviewer Name*</Label>
                    <div className="bg-white dark:bg-white border-2 border-border rounded-full hover:border-foreground/20 focus-within:border-foreground/30 focus-within:shadow-[0_0_0_4px_hsl(var(--foreground)/0.12)] transition-all duration-300 ease-out">
                      <Input id="interviewer-name" placeholder="Enter interviewer's name" className="border-0 bg-transparent h-11 px-4 focus-visible:ring-0 focus-visible:ring-offset-0 text-base text-foreground placeholder:text-muted-foreground/60" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="your-name" className="text-sm font-medium text-foreground ml-1">Your Name*</Label>
                    <div className="bg-white dark:bg-white border-2 border-border rounded-full hover:border-foreground/20 focus-within:border-foreground/30 focus-within:shadow-[0_0_0_4px_hsl(var(--foreground)/0.12)] transition-all duration-300 ease-out">
                      <Input id="your-name" placeholder="Enter your name" className="border-0 bg-transparent h-11 px-4 focus-visible:ring-0 focus-visible:ring-offset-0 text-base text-foreground placeholder:text-muted-foreground/60" />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col h-full">
                  <div className="space-y-2 flex-1 flex flex-col">
                    <Label htmlFor="context" className="text-sm font-medium text-foreground ml-1">Additional Context</Label>
                    <div className="bg-white dark:bg-white border-2 border-border rounded-2xl hover:border-foreground/20 focus-within:border-foreground/30 focus-within:shadow-[0_0_0_4px_hsl(var(--foreground)/0.12)] transition-all duration-300 ease-out overflow-hidden flex-1">
                      <Textarea id="context" placeholder="Add any additional context or specific points you'd like to include" className="border-0 bg-transparent h-full min-h-[200px] px-4 py-3 focus-visible:ring-0 focus-visible:ring-offset-0 text-base text-foreground placeholder:text-muted-foreground/60 resize-none" />
                    </div>
                  </div>
                  <Button 
                    onClick={handleGenerateEmail}
                    className="w-full mt-6 bg-foreground text-background hover:bg-foreground/90 focus-visible:outline-none border-0 rounded-full h-12 px-6 text-base font-semibold transition-colors gap-2"
                  >
                    Generate Email <Send className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        );
      case 5: // Case Study Audit
      case 6: // AI Case Study
        return (
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-6">
            <div className="w-16 h-16 bg-[#FF553E]/10 rounded-2xl flex items-center justify-center">
              <Lock className="w-8 h-8 text-[#FF553E]" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-serif text-foreground">Ready to level up?</h3>
              <p className="text-muted-foreground text-sm max-w-[280px]">
                Login to unlock these powerful tools and supercharge your career.
              </p>
            </div>
            <Link href="/auth">
              <Button className="bg-foreground text-background hover:bg-foreground/90 rounded-full px-8">
                Login to unlock
              </Button>
            </Link>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "#F1EDE2" }}>
      {/* Breadcrumb Navigation */}
      <header className="p-4 flex items-center justify-between">
        <Breadcrumb>
          <BreadcrumbList className="rounded-lg border border-border bg-background px-3 py-2 shadow-sm shadow-black/5">
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">
                  <Home size={16} strokeWidth={2} aria-hidden="true" />
                  <span className="sr-only">Home</span>
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Career Workspace</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Link href="/signup">
          <InteractiveHoverButton 
            text="Try Portfolio Builder"
            className="w-auto px-6 py-2 h-auto"
          />
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto pb-32 flex justify-center">
        <div className={`w-full transition-all duration-500 ease-[0.23,1,0.32,1] ${analysisComplete || currentTool.id === 4 ? 'max-w-6xl' : 'max-w-lg'}`}>
          <Card className="border border-border/40 rounded-[2rem] bg-[#E5E1D5] shadow-none overflow-hidden p-2">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={currentTool.id}
                initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                transition={{ 
                  duration: 0.4, 
                  ease: [0.23, 1, 0.32, 1],
                  opacity: { duration: 0.3 },
                  filter: { duration: 0.3 }
                }}
              >
                <div className="flex items-center gap-3 px-6 py-4">
                  <div className="flex items-center justify-center pr-1">
                    {currentTool.id === 5 ? (
                      <CaseStudyAuditIcon className="w-8 h-8 text-purple-600" />
                    ) : currentTool.id === 1 ? (
                      <svg width="40" height="40" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-foreground">
                        <g clipPath="url(#clip0_1128_6494)">
                        <path d="M30.472 3.045H28.952V1.525H27.432V-0.00500488H6.09197V12.195H1.52197V13.715H9.14197V12.195H7.62197V1.525H24.382V7.615H30.472V22.855H28.952V25.905H30.472V30.475H32.002V4.575H30.472V3.045Z" fill="currentColor"/>
                        <path d="M30.4719 30.475H7.62195V31.995H30.4719V30.475Z" fill="currentColor"/>
                        <path d="M28.952 19.805H27.432V22.855H28.952V19.805Z" fill="currentColor"/>
                        <path d="M27.432 16.765H25.902V19.805H27.432V16.765Z" fill="currentColor"/>
                        <path d="M25.902 15.235H10.672V16.765H25.902V15.235Z" fill="currentColor"/>
                        <path d="M21.332 7.61499H19.812V9.14499H21.332V7.61499Z" fill="currentColor"/>
                        <path d="M19.8119 10.665H15.2419V12.195H19.8119V10.665Z" fill="currentColor"/>
                        <path d="M15.2419 7.61499H13.7119V9.14499H15.2419V7.61499Z" fill="currentColor"/>
                        <path d="M10.672 13.715H9.14197V15.235H10.672V13.715Z" fill="currentColor"/>
                        <path d="M7.62192 27.425H6.09192V30.475H7.62192V27.425Z" fill="currentColor"/>
                        <path d="M6.0919 24.385H4.5719V27.425H6.0919V24.385Z" fill="currentColor"/>
                        <path d="M4.572 21.335H3.052V24.385H4.572V21.335Z" fill="currentColor"/>
                        <path d="M3.05197 18.285H1.52197V21.335H3.05197V18.285Z" fill="currentColor"/>
                        <path d="M1.52195 13.715H0.00195312V18.285H1.52195V13.715Z" fill="currentColor"/>
                        </g>
                        <defs>
                        <clipPath id="clip0_1128_6494">
                        <rect width="32" height="32" fill="white"/>
                        </clipPath>
                        </defs>
                      </svg>
                    ) : currentTool.id === 2 ? (
                      <svg width="40" height="40" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-foreground">
                        <path d="M30.48 28.96H24.38V25.91H27.43V24.38H24.38V22.86H25.91V21.34H24.38V18.29H27.43V16.77H24.38V15.24H22.86V16.77H19.81V18.29H22.86V21.34H21.33V22.86H22.86V24.38H19.81V25.91H22.86V28.96H9.14V25.91H12.19V24.38H9.14V22.86H10.67V21.34H9.14V18.29H12.19V16.77H9.14V15.24H10.67V13.72H9.14V10.67H7.62V13.72H6.1V15.24H7.62V16.77H4.57V18.29H7.62V21.34H6.1V22.86H7.62V24.38H4.57V25.91H7.62V28.96H1.52V30.48H0V32H32V30.48H30.48V28.96Z" fill="currentColor"/>
                        <path d="M27.4299 24.38H28.9499V19.81H25.9099V21.34H27.4299V24.38Z" fill="currentColor"/>
                        <path d="M27.4299 16.77H28.9499V12.19H25.9099V13.72H27.4299V16.77Z" fill="currentColor"/>
                        <path d="M28.9499 4.57001H27.4299V6.10001H28.9499V4.57001Z" fill="currentColor"/>
                        <path d="M27.4299 7.62H25.9099V9.14999H27.4299V7.62Z" fill="currentColor"/>
                        <path d="M27.4299 1.53003H25.9099V3.05003H27.4299V1.53003Z" fill="currentColor"/>
                        <path d="M25.9099 13.72H24.3799V15.24H25.9099V13.72Z" fill="currentColor"/>
                        <path d="M24.3801 9.15002H22.8601V10.67H24.3801V9.15002Z" fill="currentColor"/>
                        <path d="M24.3801 0H22.8601V1.53H24.3801V0Z" fill="currentColor"/>
                        <path d="M22.8601 13.72H21.3301V15.24H22.8601V13.72Z" fill="currentColor"/>
                        <path d="M25.9101 3.04999H21.3301V7.61999H25.9101V3.04999Z" fill="currentColor"/>
                        <path d="M21.3301 7.62H19.8101V9.14999H21.3301V7.62Z" fill="currentColor"/>
                        <path d="M21.3301 1.53003H19.8101V3.05003H21.3301V1.53003Z" fill="currentColor"/>
                        <path d="M21.33 21.34V19.81H18.29V24.38H19.81V21.34H21.33Z" fill="currentColor"/>
                        <path d="M21.33 13.72V12.19H18.29V16.77H19.81V13.72H21.33Z" fill="currentColor"/>
                        <path d="M19.81 4.57001H18.29V6.10001H19.81V4.57001Z" fill="currentColor"/>
                        <path d="M12.1899 24.38H13.7199V19.81H10.6699V21.34H12.1899V24.38Z" fill="currentColor"/>
                        <path d="M12.1899 16.77H13.7199V12.19H10.6699V13.72H12.1899V16.77Z" fill="currentColor"/>
                        <path d="M12.1899 7.62H10.6699V9.14999H12.1899V7.62Z" fill="currentColor"/>
                        <path d="M10.6699 9.15002H9.13989V10.67H10.6699V9.15002Z" fill="currentColor"/>
                        <path d="M7.6201 9.15002H6.1001V10.67H7.6201V9.15002Z" fill="currentColor"/>
                        <path d="M6.10007 7.62H4.57007V9.14999H6.10007V7.62Z" fill="currentColor"/>
                        <path d="M6.10005 21.34V19.81H3.05005V24.38H4.57005V21.34H6.10005Z" fill="currentColor"/>
                        <path d="M6.10005 13.72V12.19H3.05005V16.77H4.57005V13.72H6.10005Z" fill="currentColor"/>
                      </svg>
                    ) : currentTool.id === 3 ? (
                      <svg width="40" height="40" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-foreground">
                        <g clipPath="url(#clip0_1135_1510)">
                        <path d="M32 28.95H30.47V30.48H32V28.95Z" fill="currentColor"/>
                        <path d="M30.47 1.52H28.95V3.05H27.43V4.57H28.95V6.1H30.47V4.57H32V3.05H30.47V1.52Z" fill="currentColor"/>
                        <path d="M30.47 22.86H28.95V24.38H30.47V22.86Z" fill="currentColor"/>
                        <path d="M28.95 24.38H27.43V25.91H28.95V24.38Z" fill="currentColor"/>
                        <path d="M28.95 21.33H27.43V22.86H28.95V21.33Z" fill="currentColor"/>
                        <path d="M28.95 15.24H27.43V16.76H28.95V15.24Z" fill="currentColor"/>
                        <path d="M28.95 9.14H27.43V10.67H28.95V9.14Z" fill="currentColor"/>
                        <path d="M27.43 22.86H25.9V24.38H27.43V22.86Z" fill="currentColor"/>
                        <path d="M27.43 16.76H25.9V18.29H27.43V16.76Z" fill="currentColor"/>
                        <path d="M27.43 7.62H25.9V9.14H27.43V7.62Z" fill="currentColor"/>
                        <path d="M25.9 18.29H24.38V19.81H25.9V18.29Z" fill="currentColor"/>
                        <path d="M25.9 6.10001H24.38V7.62001H25.9V6.10001Z" fill="currentColor"/>
                        <path d="M24.38 32V30.48H25.9V28.95H24.38V27.43H22.85V28.95H21.33V30.48H22.85V32H24.38Z" fill="currentColor"/>
                        <path d="M24.38 19.81H22.85V21.33H24.38V19.81Z" fill="currentColor"/>
                        <path d="M22.85 21.33H21.33V22.86H22.85V21.33Z" fill="currentColor"/>
                        <path d="M22.85 15.24H21.33V16.76H22.85V15.24Z" fill="currentColor"/>
                        <path d="M22.85 9.14H21.33V10.67H22.85V9.14Z" fill="currentColor"/>
                        <path d="M22.85 1.52H21.33V3.05H22.85V1.52Z" fill="currentColor"/>
                        <path d="M21.33 22.86H19.81V24.38H21.33V22.86Z" fill="currentColor"/>
                        <path d="M21.33 16.76H19.81V19.81H21.33V16.76Z" fill="currentColor"/>
                        <path d="M21.33 7.62H19.81V9.14H21.33V7.62Z" fill="currentColor"/>
                        <path d="M19.81 19.81H18.28V22.86H19.81V19.81Z" fill="currentColor"/>
                        <path d="M18.28 22.86H16.76V27.43H18.28V25.91H19.81V24.38H18.28V22.86Z" fill="currentColor"/>
                        <path d="M18.28 0H16.76V1.52H18.28V0Z" fill="currentColor"/>
                        <path d="M16.76 27.43H13.71V28.95H16.76V27.43Z" fill="currentColor"/>
                        <path d="M13.71 22.86H12.19V24.38H10.66V25.91H12.19V27.43H13.71V22.86Z" fill="currentColor"/>
                        <path d="M12.19 19.81H10.66V22.86H12.19V19.81Z" fill="currentColor"/>
                        <path d="M10.66 22.86H9.14V24.38H10.66V22.86Z" fill="currentColor"/>
                        <path d="M10.66 16.76H9.14V19.81H10.66V16.76Z" fill="currentColor"/>
                        <path d="M10.66 7.62H9.14V9.14H10.66V7.62Z" fill="currentColor"/>
                        <path d="M10.66 1.52H9.14V3.05H10.66V1.52Z" fill="currentColor"/>
                        <path d="M9.14 27.43H7.62V28.95H9.14V27.43Z" fill="currentColor"/>
                        <path d="M9.14 21.33H7.62V22.86H9.14V21.33Z" fill="currentColor"/>
                        <path d="M9.14 15.24H7.62V16.76H9.14V15.24Z" fill="currentColor"/>
                        <path d="M9.14 9.14H7.62V10.67H9.14V9.14Z" fill="currentColor"/>
                        <path d="M10.66 6.10001V7.62001H12.19V6.10001H18.28V7.62001H19.81V6.10001H24.38V4.57001H6.09V6.10001H10.66Z" fill="currentColor"/>
                        <path d="M7.62 19.81H6.09V21.33H7.62V19.81Z" fill="currentColor"/>
                        <path d="M6.09 18.29H4.57V19.81H6.09V18.29Z" fill="currentColor"/>
                        <path d="M6.09 6.10001H4.57V7.62001H6.09V6.10001Z" fill="currentColor"/>
                        <path d="M4.57 24.38H3.04V25.91H4.57V24.38Z" fill="currentColor"/>
                        <path d="M4.57 16.76H3.04V18.29H4.57V16.76Z" fill="currentColor"/>
                        <path d="M4.57 7.62H3.04V9.14H4.57V7.62Z" fill="currentColor"/>
                        <path d="M3.04 30.48H1.52V32H3.04V30.48Z" fill="currentColor"/>
                        <path d="M3.04 25.91H1.52V27.43H3.04V25.91Z" fill="currentColor"/>
                        <path d="M3.04 22.86H1.52V24.38H3.04V22.86Z" fill="currentColor"/>
                        <path d="M3.04 15.24H1.52V16.76H3.04V15.24Z" fill="currentColor"/>
                        <path d="M1.52 13.71H6.09V15.24H7.62V13.71H22.85V15.24H24.38V13.71H28.95V15.24H30.47V10.67H28.95V12.19H24.38V10.67H22.85V12.19H7.62V10.67H6.09V12.19H1.52V10.67H0V15.24H1.52V13.71Z" fill="currentColor"/>
                        <path d="M3.04 9.14H1.52V10.67H3.04V9.14Z" fill="currentColor"/>
                        <path d="M1.52 4.57H3.04V3.05H4.57V1.52H3.04V0H1.52V1.52H0V3.05H1.52V4.57Z" fill="currentColor"/>
                        <path d="M1.52 24.38H0V25.91H1.52V24.38Z" fill="currentColor"/>
                        </g>
                        <defs>
                        <clipPath id="clip0_1135_1510">
                        <rect width="32" height="32" fill="white"/>
                        </clipPath>
                        </defs>
                      </svg>
                    ) : currentTool.id === 4 ? (
                      <svg width="40" height="40" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-foreground">
                        <path d="M32 6.1001H30.47V25.9001H32V6.1001Z" fill="currentColor"/>
                        <path d="M30.47 25.9H28.95V27.43H30.47V25.9Z" fill="currentColor"/>
                        <path d="M30.47 4.57007H28.95V6.10007H30.47V4.57007Z" fill="currentColor"/>
                        <path d="M28.95 7.62H27.43V10.67H28.95V7.62Z" fill="currentColor"/>
                        <path d="M28.95 27.4301H3.04999V28.9501H28.95V27.4301Z" fill="currentColor"/>
                        <path d="M27.43 22.8601H25.90V24.3801H27.43V22.8601Z" fill="currentColor"/>
                        <path d="M27.43 10.67H25.9V12.19H27.43V10.67Z" fill="currentColor"/>
                        <path d="M25.9 21.3301H24.38V22.8601H25.9V21.3301Z" fill="currentColor"/>
                        <path d="M25.9 12.1901H24.38V13.7101H25.9V12.1901Z" fill="currentColor"/>
                        <path d="M24.38 19.8101H22.85V21.3301H24.38V19.8101Z" fill="currentColor"/>
                        <path d="M24.38 13.7101H22.85V15.2401H24.38V13.7101Z" fill="currentColor"/>
                        <path d="M22.85 18.29H21.33V19.81H22.85V18.29Z" fill="currentColor"/>
                        <path d="M22.85 15.24H21.33V16.76H22.85V15.24Z" fill="currentColor"/>
                        <path d="M21.33 16.76H18.28V18.29H21.33V16.76Z" fill="currentColor"/>
                        <path d="M18.28 18.29H13.71V19.81H18.28V18.29Z" fill="currentColor"/>
                        <path d="M13.71 16.76H10.66V18.29H13.71V16.76Z" fill="currentColor"/>
                        <path d="M10.66 18.29H9.14001V19.81H10.66V18.29Z" fill="currentColor"/>
                        <path d="M10.66 15.24H9.14001V16.76H10.66V15.24Z" fill="currentColor"/>
                        <path d="M9.14 19.8101H7.62V21.3301H9.14V19.8101Z" fill="currentColor"/>
                        <path d="M9.14 13.7101H7.62V15.2401H9.14V13.7101Z" fill="currentColor"/>
                        <path d="M7.62 21.3301H6.09V22.8601H7.62V21.3301Z" fill="currentColor"/>
                        <path d="M7.62 12.1901H6.09V13.7101H7.62V12.1901Z" fill="currentColor"/>
                        <path d="M6.09001 22.8601H4.57001V24.3801H6.09001V22.8601Z" fill="currentColor"/>
                        <path d="M6.09001 10.67H4.57001V12.19H6.09001V10.67Z" fill="currentColor"/>
                        <path d="M28.95 3.05005H3.04999V4.57005H28.95V3.05005Z" fill="currentColor"/>
                        <path d="M4.56999 7.62H3.04999V10.67H4.56999V7.62Z" fill="currentColor"/>
                        <path d="M3.04999 25.9H1.51999V27.43H3.04999V25.9Z" fill="currentColor"/>
                        <path d="M3.04999 4.57007H1.51999V6.10007H3.04999V4.57007Z" fill="currentColor"/>
                        <path d="M1.52 6.1001H0V25.9001H1.52V6.1001Z" fill="currentColor"/>
                      </svg>
                    ) : currentTool.id === 6 ? (
                      <svg width="40" height="40" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-foreground">
                        <path d="M27.4351 3.05H28.9551V1.52H30.4751V0H21.3351V1.52H27.4351V3.05Z" fill="currentColor"/>
                        <path d="M27.435 3.04999H25.905V4.56999H27.435V3.04999Z" fill="currentColor"/>
                        <path d="M25.905 4.57001H24.385V6.10001H25.905V4.57001Z" fill="currentColor"/>
                        <path d="M24.385 6.10001H22.865V7.62001H24.385V6.10001Z" fill="currentColor"/>
                        <path d="M22.8651 7.62H21.3351V10.67H22.8651V7.62Z" fill="currentColor"/>
                        <path d="M22.8651 3.04999H21.3351V4.56999H22.8651V3.04999Z" fill="currentColor"/>
                        <path d="M21.3351 10.67H19.8151V12.19H21.3351V10.67Z" fill="currentColor"/>
                        <path d="M21.3351 4.57001H19.8151V6.10001H21.3351V4.57001Z" fill="currentColor"/>
                        <path d="M21.335 1.51999H18.285V3.04999H21.335V1.51999Z" fill="currentColor"/>
                        <path d="M19.815 6.10001H18.285V7.62001H19.815V6.10001Z" fill="currentColor"/>
                        <path d="M19.815 12.19H16.765V13.72H19.815V12.19Z" fill="currentColor"/>
                        <path d="M18.285 7.62H16.765V9.14H18.285V7.62Z" fill="currentColor"/>
                        <path d="M18.285 3.04999H16.765V4.56999H18.285V3.04999Z" fill="currentColor"/>
                        <path d="M3.05502 32H16.765V30.48H18.285V24.38H16.765V25.91H9.14502V24.38H6.10002V22.86H3.05502V24.38H1.52502V30.48H3.05502V32ZM4.57502 25.91H6.10002V28.95H9.15002V30.48H6.10002V28.95H4.57502V25.91Z" fill="currentColor"/>
                        <path d="M16.765 9.14001H15.245V10.67H16.765V9.14001Z" fill="currentColor"/>
                        <path d="M16.765 4.57001H15.245V6.10001H16.765V4.57001Z" fill="currentColor"/>
                        <path d="M16.765 22.86H13.715V24.38H16.765V22.86Z" fill="currentColor"/>
                        <path d="M16.765 13.72H13.715V12.19H12.195V10.67H10.675V15.24H16.765V13.72Z" fill="currentColor"/>
                        <path d="M15.245 10.67H13.715V12.19H15.245V10.67Z" fill="currentColor"/>
                        <path d="M15.245 6.10001H13.715V7.62001H15.245V6.10001Z" fill="currentColor"/>
                        <path d="M13.7151 7.62H12.1951V10.67H13.7151V7.62Z" fill="currentColor"/>
                        <path d="M7.62507 19.81H12.1951V22.86H13.7151V19.81H15.2451V18.29H10.6751V15.24H9.14507V18.29H4.57507V19.81H6.09507V22.86H7.62507V19.81Z" fill="currentColor"/>
                      </svg>
                    ) : (
                      <div className="p-2 bg-primary/10 rounded-xl">
                        <currentTool.icon className="w-5 h-5 text-primary" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <h1 className="text-xl font-serif text-foreground/90 leading-tight whitespace-nowrap">{currentTool.title}</h1>
                    <p className="text-muted-foreground text-xs whitespace-nowrap">
                      {currentTool.description}
                    </p>
                  </div>
                </div>
                
                <div className="bg-white/60 backdrop-blur-xl rounded-[1.75rem] border border-white/40 shadow-sm p-6 min-h-[300px]">
                  <div className="w-full">
                    {renderToolForm()}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </Card>
        </div>
      </main>

      {/* Ruler Carousel Navigation */}
      <motion.div 
        initial={{ y: 0 }}
        animate={{ y: isVisible ? 0 : "100%" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed bottom-0 inset-x-0 bg-white/10 backdrop-blur-md py-1.5 z-50 border-t border-white/10"
      >
        <RulerCarousel 
          originalItems={navItems}
          onItemSelect={(index) => {
            setSelectedTool(index);
          }}
        />
      </motion.div>
    </div>
  );
}
