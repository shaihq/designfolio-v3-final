import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, TrendingUp, BookOpen, UserCircle2, Cpu } from "lucide-react";

interface SkillItem {
  name: string;
  resumeCoverage: number;
  jdCoverage: number;
  resumeFreq: number;
  jdFreq: number;
  status: 'matched' | 'missing' | 'partial';
}

const ResumeAnalysisReport = () => {
  const strengths = [
    { title: "Product Design", desc: "Extensive experience in designing SaaS platforms, particularly CRMs, with a focus on user experience and data-driven design." },
    { title: "AI & Data", desc: "Experience in designing AI-powered features and data visualizations, demonstrating an understanding of emerging technologies." }
  ];

  const gaps = [
    { title: "Specific Technologies", desc: "The resume lacks specific mentions of commonly used product design technologies outside of general tools like Figma and Miro." },
    { title: "Industry Specific Experience", desc: "While CRM experience is highlighted, lacking a target industry in the resume could pose a gap for some positions." }
  ];

  const skills: SkillItem[] = [
    { name: "Product Design", resumeCoverage: 90, jdCoverage: 85, resumeFreq: 4, jdFreq: 3, status: 'matched' },
    { name: "UX", resumeCoverage: 75, jdCoverage: 80, resumeFreq: 1, jdFreq: 2, status: 'matched' },
    { name: "CRM", resumeCoverage: 80, jdCoverage: 70, resumeFreq: 4, jdFreq: 2, status: 'matched' },
    { name: "AI", resumeCoverage: 60, jdCoverage: 90, resumeFreq: 2, jdFreq: 5, status: 'partial' },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Score section */}
      <Card className="border-none bg-zinc-900/50 backdrop-blur-xl overflow-hidden ring-1 ring-white/10">
        <CardContent className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold tracking-tight text-white">Overall Match Score</h2>
              <p className="text-zinc-400 text-sm max-w-2xl">
                The resume demonstrates strong experience in product design, particularly in CRM and SaaS platforms, aligning well with roles requiring user-centric design and leadership.
              </p>
            </div>
            <div className="relative flex items-center justify-center">
              <svg className="w-24 h-24 transform -rotate-90">
                <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-zinc-800" />
                <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" 
                  strokeDasharray={251.2} strokeDashoffset={251.2 * (1 - 0.65)}
                  className="text-orange-500 transition-all duration-1000 ease-out" 
                />
              </svg>
              <span className="absolute text-2xl font-bold text-white">65%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Strengths */}
        <Card className="border-none bg-zinc-900/50 backdrop-blur-xl ring-1 ring-emerald-500/20">
          <CardHeader className="flex flex-row items-center space-x-2 pb-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <CardTitle className="text-emerald-500 text-lg">Strengths</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {strengths.map((s, i) => (
              <div key={i} className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                <h4 className="font-medium text-emerald-400 mb-1">{s.title}</h4>
                <p className="text-zinc-400 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Gaps */}
        <Card className="border-none bg-zinc-900/50 backdrop-blur-xl ring-1 ring-rose-500/20">
          <CardHeader className="flex flex-row items-center space-x-2 pb-2">
            <AlertCircle className="w-5 h-5 text-rose-500" />
            <CardTitle className="text-rose-500 text-lg">Gaps</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {gaps.map((g, i) => (
              <div key={i} className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/10">
                <h4 className="font-medium text-rose-400 mb-1">{g.title}</h4>
                <p className="text-zinc-400 text-sm leading-relaxed">{g.desc}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Skills Analysis */}
      <Card className="border-none bg-zinc-900/50 backdrop-blur-xl ring-1 ring-white/10">
        <CardHeader>
          <CardTitle className="text-lg text-white">Skills Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-zinc-500 border-b border-white/5">
                  <th className="pb-4 font-medium">Skill/Keyword</th>
                  <th className="pb-4 font-medium">Resume Coverage</th>
                  <th className="pb-4 font-medium">JD Coverage</th>
                  <th className="pb-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {skills.map((skill, i) => (
                  <tr key={i} className="group">
                    <td className="py-4 font-medium text-zinc-300">{skill.name}</td>
                    <td className="py-4 pr-8">
                      <div className="flex items-center gap-3">
                        <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-orange-500 transition-all duration-500" 
                            style={{ width: `${skill.resumeCoverage}%` }}
                          />
                        </div>
                        <span className="text-zinc-500 tabular-nums w-8">{skill.resumeCoverage}%</span>
                      </div>
                    </td>
                    <td className="py-4 pr-8">
                      <div className="flex items-center gap-3">
                        <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 transition-all duration-500" 
                            style={{ width: `${skill.jdCoverage}%` }}
                          />
                        </div>
                        <span className="text-zinc-500 tabular-nums w-8">{skill.jdCoverage}%</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <Badge variant="outline" className={
                        skill.status === 'matched' ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-500" :
                        "border-orange-500/20 bg-orange-500/5 text-orange-500"
                      }>
                        {skill.status === 'matched' ? 'Matched' : 'Partial'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Section Match Cards */}
      <div className="space-y-4">
        {[
          { icon: <TrendingUp className="w-5 h-5 text-orange-500" />, title: "Experience Match", score: 75, desc: "The experience section is strong, showcasing relevant roles in product design and leadership. The descriptions effectively highlight accomplishments.", suggestions: ["Tailor the experience descriptions to highlight specific achievements and skills that align with the target job description for each application."] },
          { icon: <BookOpen className="w-5 h-5 text-blue-500" />, title: "Education and Certifications", score: 80, desc: "The education section includes a relevant B.Tech in Computer Science and an Executive Program in Product Management.", suggestions: ["Consider adding relevant coursework from your B.Tech or ISB program if it directly relates to product design or user experience."] },
          { icon: <Cpu className="w-5 h-5 text-purple-500" />, title: "Technical Skills", score: 65, desc: "The technical skills section lists relevant tools and skills, but could benefit from more specificity and breadth.", suggestions: ["Expand the list of technical skills to include specific technologies used in past projects, such as specific programming languages for prototyping."] }
        ].map((section, i) => (
          <Card key={i} className="border-none bg-zinc-900/50 backdrop-blur-xl ring-1 ring-white/10">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-zinc-800/50 ring-1 ring-white/5">
                    {section.icon}
                  </div>
                  <h3 className="text-lg font-medium text-white">{section.title}</h3>
                </div>
                <Badge variant="secondary" className="bg-zinc-800 text-zinc-300 border-white/5">{section.score}%</Badge>
              </div>
              <p className="text-zinc-400 text-sm mb-4 leading-relaxed">{section.desc}</p>
              <div className="pt-4 border-t border-white/5">
                <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Suggestions</h4>
                <ul className="space-y-2">
                  {section.suggestions.map((s, si) => (
                    <li key={si} className="text-sm text-zinc-300 flex items-start gap-2">
                      <span className="mt-1.5 w-1 h-1 rounded-full bg-orange-500 shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Priority Recommendations */}
      <Card className="border-none bg-zinc-900/50 backdrop-blur-xl ring-1 ring-orange-500/20">
        <CardHeader className="flex flex-row items-center space-x-2 pb-2">
          <UserCircle2 className="w-5 h-5 text-orange-500" />
          <CardTitle className="text-orange-500 text-lg">Priority Recommendations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { level: "High", text: "Tailor the resume to match the target job description by highlighting relevant skills and experiences." },
            { level: "Medium", text: "Expand the technical skills section to include specific technologies and tools used in past projects." },
            { level: "Low", text: "Include a section or sub-section for soft skills, explicitly listing key attributes relevant to product design roles." }
          ].map((rec, i) => (
            <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
              <Badge className={
                rec.level === "High" ? "bg-rose-500/10 text-rose-500 border-rose-500/20" :
                rec.level === "Medium" ? "bg-orange-500/10 text-orange-500 border-orange-500/20" :
                "bg-blue-500/10 text-blue-500 border-blue-500/20"
              } variant="outline">{rec.level}</Badge>
              <p className="text-sm text-zinc-300 leading-relaxed">{rec.text}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResumeAnalysisReport;
