import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FooterBottom from "@/components/FooterBottom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Resume() {
  const { scrollY } = useScroll();
  
  // Create different parallax speeds for different clouds
  // Use different ranges to create "alternating" movement feel
  const cloud1Y = useTransform(scrollY, [0, 500], [0, 120]);
  const cloud2Y = useTransform(scrollY, [0, 500], [0, -40]);
  const cloud3Y = useTransform(scrollY, [0, 500], [0, 160]);
  const cloud4Y = useTransform(scrollY, [0, 500], [0, 60]);

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-x-hidden">
      <Navbar />
      <main className="flex-1 flex flex-col items-center px-6 pt-32 sm:pt-40 pb-16 relative">
        {/* Blue Sky Hero Section with contained gradient and clouds */}
        <div className="absolute top-0 left-0 right-0 h-[600px] sm:h-[700px] pointer-events-none">
          {/* Blue Sky Gradient Background */}
          <div 
            className="absolute inset-0 z-0"
            style={{
              background: 'linear-gradient(180deg, #7DD3FC 0%, #BAE6FD 20%, #E0F2FE 45%, #F0F9FF 70%, hsl(var(--background)) 100%)'
            }}
          />
          
          {/* Cloud decorations - masked within the sky section */}
          <motion.img 
            src="/cloud.avif" 
            alt="" 
            className="absolute left-0 top-20 w-48 sm:w-64 opacity-90 z-[1]"
            style={{ transform: 'scaleX(-1)', y: cloud1Y }}
          />
          <motion.img 
            src="/cloud.avif" 
            alt="" 
            className="absolute right-0 top-28 w-56 sm:w-72 opacity-90 z-[1]"
            style={{ y: cloud2Y }}
          />
          <motion.img 
            src="/cloud.avif" 
            alt="" 
            className="absolute left-[10%] bottom-0 w-40 sm:w-52 opacity-80 z-[1]"
            style={{ y: cloud3Y }}
          />
          <motion.img 
            src="/cloud.avif" 
            alt="" 
            className="absolute right-[15%] bottom-10 w-36 sm:w-48 opacity-70 z-[1]"
            style={{ transform: 'scaleX(-1)', y: cloud4Y }}
          />
        </div>

        <div className="max-w-5xl mx-auto w-full relative z-10 text-center">
          <motion.h1 
            className="font-heading font-semibold text-3xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-6xl leading-tight mb-4 sm:mb-6 text-foreground max-w-3xl mx-auto" 
            data-testid="text-resume-headline"
            initial={{ opacity: 0, filter: "blur(4px)", y: 8 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={{ 
              duration: 0.6, 
              delay: 0.1,
              ease: [0.22, 1, 0.36, 1]
            }}
          >Turn your resume into a personal website</motion.h1>
          
          <motion.p 
            className="text-sm sm:text-base md:text-lg lg:text-xl text-foreground/70 leading-relaxed max-w-3xl mx-auto mb-6 sm:mb-8" 
            data-testid="text-resume-description"
            initial={{ opacity: 0, filter: "blur(4px)", y: 8 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={{ 
              duration: 0.6, 
              delay: 0.2,
              ease: [0.22, 1, 0.36, 1]
            }}
          >
            Skip the busywork with Designfolio — publish in hours, not weeks.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, filter: "blur(4px)", y: 8 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <div 
              className="max-w-xl mx-auto rounded-[1.25rem] sm:rounded-[1.5rem] p-[1px] relative z-10 bg-gradient-to-b from-border/60 via-border/30 to-border/60 shadow-lg group"
              data-testid="card-resume-upload"
            >
              <div className="bg-white dark:bg-[#1a1a1a] rounded-[1.125rem] sm:rounded-[1.375rem] overflow-hidden">
                {/* Mac Chrome Frame Header */}
                <div className="bg-[#f6f6f6] dark:bg-[#252525] border-b border-border/50 px-4 py-2.5 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] border border-[#e0443e]"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] border border-[#dea123]"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f] border border-[#1aab29]"></div>
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="bg-white dark:bg-[#2a2a2a] rounded-md px-3 py-1 text-[10px] text-foreground/40 border border-border/40 min-w-[140px] text-center truncate">
                      yourname.designfolio.me
                    </div>
                  </div>
                  <div className="w-10"></div>
                </div>

                {/* Upload Content */}
                <div className="p-8 sm:p-10 flex flex-col items-center gap-5">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                    <Upload className="w-7 h-7 text-primary" />
                  </div>
                  
                  <div className="space-y-1.5 text-center">
                    <p className="text-lg sm:text-xl font-semibold text-foreground">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-muted-foreground text-sm">
                      PDF, DOCX, or TXT (max. 10MB)
                    </p>
                  </div>

                  <div className="w-full max-w-xs mx-auto pt-2">
                    <Input 
                      type="file" 
                      className="hidden" 
                      id="resume-upload"
                      accept=".pdf,.docx,.txt"
                      data-testid="input-resume-file"
                    />
                    <Button 
                      asChild
                      className="w-full rounded-full h-12 text-base font-semibold bg-[#FF553E] hover:bg-[#E64935] text-white border-none transition-transform active:scale-[0.98]"
                    >
                      <label htmlFor="resume-upload" className="cursor-pointer">
                        Select Resume
                      </label>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.p 
            className="text-muted-foreground text-base mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            By uploading, you agree to our <a href="/terms-conditions" className="underline hover:text-foreground transition-colors">Terms of Service</a>
          </motion.p>
        </div>
      </main>
      <Footer />
      <FooterBottom />
    </div>
  );
}
