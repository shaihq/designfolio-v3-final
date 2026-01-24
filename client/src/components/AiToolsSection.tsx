import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Users, Landmark, Mail, ArrowUpRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const aiTools = [
  {
    title: "Fix your Resume",
    description: "See how your resume stacks up against the Job Description.",
    icon: FileText,
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
    buttonText: "Analyze my Resume",
    testId: "fix-resume"
  },
  {
    title: "AI Mock Interview",
    description: "Land Your Dream Job with 100% Confidence",
    icon: Users,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    buttonText: "Begin Mock Interview",
    testId: "mock-interview"
  },
  {
    title: "Salary Negotiation Assistant",
    description: "Learn how to negotiate and get the salary you deserve.",
    icon: Landmark,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    buttonText: "Plan My Negotiation",
    testId: "salary-negotiation"
  },
  {
    title: "AI Email Generator for Job Seekers",
    description: "Get personalized emails for any situation—ready to send or tweak.",
    icon: Mail,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    buttonText: "Try now",
    testId: "email-generator"
  }
];

export default function AiToolsSection() {
  return (
    <section className="py-16 px-6 bg-[#FCFAFA]">
      <div className="max-w-5xl mx-auto text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 flex items-center justify-center gap-2">
          ...and so much more <Sparkles className="h-6 w-6 text-yellow-400 fill-yellow-400" />
        </h2>
        <p className="text-muted-foreground text-lg">
          Use these AI tools and save all your time — thank us later!
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {aiTools.map((tool, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6 h-full flex flex-col items-start gap-4 bg-white/50 backdrop-blur-sm border-border/40 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-3 mb-1">
                <div className={`${tool.iconBg} p-2.5 rounded-2xl`}>
                  <tool.icon className={`h-5 w-5 ${tool.iconColor}`} />
                </div>
                <h3 className="text-lg font-bold text-foreground">
                  {tool.title}
                </h3>
              </div>
              
              <p className="text-sm text-muted-foreground/80 mb-4 text-left leading-relaxed">
                {tool.description}
              </p>

              <Button 
                variant="outline" 
                className="w-full justify-center gap-2 rounded-full h-11 px-6 text-sm font-semibold border-border/60 hover:bg-accent/5 no-default-hover-elevate no-default-active-elevate transition-colors"
                data-testid={`button-${tool.testId}`}
              >
                <ArrowUpRight className="h-4 w-4" />
                {tool.buttonText}
              </Button>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
