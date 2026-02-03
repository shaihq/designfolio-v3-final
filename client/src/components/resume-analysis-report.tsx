import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, TrendingUp, BookOpen, UserCircle2, Cpu, ChevronRight } from "lucide-react";

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
    <div className="w-full max-w-5xl mx-auto space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Score section */}
      <Card className="border-border/40 bg-white shadow-sm overflow-hidden rounded-[2rem]">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="space-y-3 text-center md:text-left">
              <h2 className="text-2xl font-serif font-semibold tracking-tight text-foreground">Overall Match Score</h2>
              <p className="text-muted-foreground text-sm max-w-xl leading-relaxed">
                The resume demonstrates strong experience in product design, particularly in CRM and SaaS platforms, aligning well with roles requiring user-centric design and leadership.
              </p>
            </div>
            <div className="relative flex items-center justify-center shrink-0">
              <svg className="w-28 h-28 transform -rotate-90">
                <circle cx="56" cy="56" r="48" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100" />
                <circle cx="56" cy="56" r="48" stroke="currentColor" strokeWidth="8" fill="transparent" 
                  strokeDasharray={301.6} strokeDashoffset={301.6 * (1 - 0.65)}
                  className="text-[#FF553E] transition-all duration-1000 ease-out" 
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute text-3xl font-bold text-foreground font-serif">65%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Strengths */}
        <Card className="border-emerald-100 bg-emerald-50/30 shadow-sm rounded-[2rem]">
          <CardHeader className="flex flex-row items-center space-x-2 pb-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <CardTitle className="text-emerald-700 text-lg font-serif">Strengths</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {strengths.map((s, i) => (
              <div key={i} className="p-4 rounded-2xl bg-white/80 border border-emerald-100 shadow-sm">
                <h4 className="font-semibold text-emerald-800 mb-1 text-sm">{s.title}</h4>
                <p className="text-muted-foreground text-xs leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Gaps */}
        <Card className="border-rose-100 bg-rose-50/30 shadow-sm rounded-[2rem]">
          <CardHeader className="flex flex-row items-center space-x-2 pb-2">
            <AlertCircle className="w-5 h-5 text-rose-600" />
            <CardTitle className="text-rose-700 text-lg font-serif">Gaps</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {gaps.map((g, i) => (
              <div key={i} className="p-4 rounded-2xl bg-white/80 border border-rose-100 shadow-sm">
                <h4 className="font-semibold text-rose-800 mb-1 text-sm">{g.title}</h4>
                <p className="text-muted-foreground text-xs leading-relaxed">{g.desc}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Skills Analysis */}
      <Card className="border-border/40 bg-white shadow-sm rounded-[2rem]">
        <CardHeader>
          <CardTitle className="text-xl text-foreground font-serif">Skills Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-muted-foreground border-b border-border/40">
                  <th className="pb-4 font-medium pl-2">Skill/Keyword</th>
                  <th className="pb-4 font-medium">Resume Coverage</th>
                  <th className="pb-4 font-medium">JD Coverage</th>
                  <th className="pb-4 font-medium pr-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {skills.map((skill, i) => (
                  <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="py-5 font-semibold text-foreground pl-2">{skill.name}</td>
                    <td className="py-5 pr-8">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-32 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-[#FF553E] transition-all duration-500" 
                            style={{ width: `${skill.resumeCoverage}%` }}
                          />
                        </div>
                        <span className="text-muted-foreground tabular-nums w-8 text-xs font-medium">{skill.resumeCoverage}%</span>
                      </div>
                    </td>
                    <td className="py-5 pr-8">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-32 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 transition-all duration-500" 
                            style={{ width: `${skill.jdCoverage}%` }}
                          />
                        </div>
                        <span className="text-muted-foreground tabular-nums w-8 text-xs font-medium">{skill.jdCoverage}%</span>
                      </div>
                    </td>
                    <td className="py-5 pr-2">
                      <Badge variant="outline" className={
                        skill.status === 'matched' 
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700 font-medium" 
                          : "border-orange-200 bg-orange-50 text-orange-700 font-medium"
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
      <div className="grid gap-4">
        {[
          { icon: <TrendingUp className="w-5 h-5 text-orange-600" />, title: "Experience Match", score: 75, desc: "The experience section is strong, showcasing relevant roles in product design and leadership. The descriptions effectively highlight accomplishments.", suggestions: ["Tailor the experience descriptions to highlight specific achievements."] },
          { icon: <BookOpen className="w-5 h-5 text-blue-600" />, title: "Education and Certifications", score: 80, desc: "The education section includes a relevant B.Tech in Computer Science and an Executive Program in Product Management.", suggestions: ["Consider adding relevant coursework from your B.Tech program."] },
          { icon: <Cpu className="w-5 h-5 text-purple-600" />, title: "Technical Skills", score: 65, desc: "The technical skills section lists relevant tools and skills, but could benefit from more specificity and breadth.", suggestions: ["Expand the list of technical skills to include specific technologies."] }
        ].map((section, i) => (
          <Card key={i} className="border-border/40 bg-white shadow-sm rounded-[2rem] hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm">
                    {section.icon}
                  </div>
                  <h3 className="text-lg font-serif font-semibold text-foreground">{section.title}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">{section.score}%</span>
                  <div className="h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#FF553E]" style={{ width: `${section.score}%` }} />
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground text-sm mb-5 leading-relaxed">{section.desc}</p>
              <div className="pt-5 border-t border-slate-100">
                <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-3">Suggestions</h4>
                <div className="space-y-2">
                  {section.suggestions.map((s, si) => (
                    <div key={si} className="text-sm text-foreground flex items-center gap-3 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                      <ChevronRight className="w-4 h-4 text-[#FF553E]" />
                      {s}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Priority Recommendations */}
      <Card className="border-orange-100 bg-[#FFFAF5] shadow-sm rounded-[2rem]">
        <CardHeader className="flex flex-row items-center space-x-2 pb-2">
          <UserCircle2 className="w-5 h-5 text-[#FF553E]" />
          <CardTitle className="text-foreground text-xl font-serif">Priority Recommendations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { level: "High", text: "Tailor the resume to match the target job description by highlighting relevant skills and experiences." },
            { level: "Medium", text: "Expand the technical skills section to include specific technologies and tools used in past projects." },
            { level: "Low", text: "Include a section or sub-section for soft skills, explicitly listing key attributes relevant to product design roles." }
          ].map((rec, i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-orange-100 shadow-sm transition-transform hover:scale-[1.01]">
              <Badge className={
                rec.level === "High" ? "bg-rose-50 text-rose-700 border-rose-100" :
                rec.level === "Medium" ? "bg-orange-50 text-orange-700 border-orange-100" :
                "bg-blue-50 text-blue-700 border-blue-100"
              } variant="outline">{rec.level}</Badge>
              <p className="text-sm text-foreground font-medium">{rec.text}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResumeAnalysisReport;
