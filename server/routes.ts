import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { randomBytes } from "crypto";
import { z } from "zod";
import multer from "multer";
import pdf from "pdf-extraction";
import { getAiCompletion } from "./ai";
import { registerChatRoutes } from "./replit_integrations/chat";
import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI(process.env.AI_INTEGRATIONS_GEMINI_API_KEY || "no-key-required");
const requestOptions = process.env.AI_INTEGRATIONS_GEMINI_BASE_URL ? {
  baseUrl: process.env.AI_INTEGRATIONS_GEMINI_BASE_URL,
  apiVersion: "",
} : undefined;

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

const upload = multer({ storage: multer.memoryStorage() });

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

const resetPasswordSchema = z.object({
  token: z.string(),
  newPassword: z.string().min(6),
});

import { spawn } from "child_process";

export async function registerRoutes(app: Express): Promise<Server> {
  registerChatRoutes(app);

  app.post("/api/ai/job-clarification", async (req, res) => {
    try {
      const { prompt, history } = req.body;
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const systemPrompt = `You are an AI job search assistant. Your goal is to help users refine their job search query so we can find the best matches.
      If the user's query is vague (e.g., "design jobs"), ask 1-2 clarifying questions about location, experience level, industry, or company size.
      If the query is clear and specific, respond with "READY" followed by a optimized, concise search string that can be used for JobSpy scraper.
      
      Examples:
      User: "software engineer"
      Assistant: "That's a broad field! Are you looking for frontend, backend, or full-stack roles? And do you have a preferred location or remote preference?"
      
      User: "Senior Product Designer roles at Series B startups, remote in US"
      Assistant: "READY: Senior Product Designer Series B startup remote US"
      
      Current user prompt: "${prompt}"`;

      const result = await model.generateContent({
        contents: [
          { role: "user", parts: [{ text: systemPrompt }] },
          ...(history || []).map((h: any) => ({
            role: h.role === "assistant" ? "model" : "user",
            parts: [{ text: h.content }]
          }))
        ]
      }, requestOptions);

      const responseText = result.response.text();
      res.json({ response: responseText });
    } catch (error) {
      console.error("AI clarification error:", error);
      res.status(500).json({ message: "AI clarification failed" });
    }
  });

  app.get("/api/jobs/search", async (req, res) => {
    const query = req.query.q as string;
    if (!query) {
      return res.status(400).json({ message: "Query parameter 'q' is required" });
    }

    try {
      const platform = (req.query.platform as string) || "linkedin";
      const pythonProcess = spawn("python3", ["server/job_scraper.py", query, platform]);
      let dataString = "";
      let errorString = "";

      pythonProcess.stdout.on("data", (data) => {
        dataString += data.toString();
        console.log(`Scraper stdout: ${data.toString()}`);
      });

      pythonProcess.stderr.on("data", (data) => {
        errorString += data.toString();
        console.log(`Scraper stderr: ${data.toString()}`);
      });

      pythonProcess.on("close", (code) => {
        if (code !== 0) {
          console.error(`Python script error: ${errorString}`);
          return res.status(500).json({ message: "Failed to scrape jobs" });
        }
        try {
          const jobs = JSON.parse(dataString);
          res.json(jobs);
        } catch (parseError) {
          console.error("Failed to parse scraper output:", dataString);
          res.status(500).json({ message: "Invalid response from scraper" });
        }
      });
    } catch (error) {
      console.error("Scraper execution error:", error);
      res.status(500).json({ message: "Failed to initiate scraper" });
    }
  });

  app.post("/api/convert-resume", upload.single("resume"), async (req: MulterRequest, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No resume file uploaded" });
      }

      let text = "";
      if (req.file.mimetype === "application/pdf") {
        try {
          // Add a small delay or check if buffer is valid
          if (!req.file.buffer || req.file.buffer.length === 0) {
            throw new Error("Empty file buffer");
          }
          const data = await pdf(req.file.buffer);
          text = data.text;
        } catch (pdfError: any) {
          console.error("PDF parsing error:", pdfError);
          // If it's a "bad XRef entry" or similar, it might be a corrupted PDF or a version mismatch
          // We can try to extract text as a fallback if it's a text-based PDF that just has a bad header
          try {
            text = req.file.buffer.toString("utf-8").replace(/[^\x20-\x7E\n\r\t]/g, " ");
            if (text.trim().length < 100) {
              throw new Error("Fallback text extraction failed");
            }
          } catch (fallbackError) {
            return res.status(400).json({ 
              message: "This PDF file appears to be corrupted or in an unsupported format (Technical error: " + (pdfError.message || "bad XRef entry") + "). Please try saving it again as a PDF or use a .txt/.docx file." 
            });
          }
        }
      } else {
        text = req.file.buffer.toString("utf-8");
      }

      if (!text || text.trim().length < 50) {
        return res.status(400).json({ message: "The uploaded file appears to be empty or too short." });
      }

      const prompt = `Based on the following resume text, extract and generate professional portfolio content. You MUST return the data in the following JSON format: { "user": { "name": "Hey, I'm [First Name]!", "role": "A single, powerful, and slightly edgy one-liner (max 25 words) that captures the person's professional essence with confidence and 'swag'. It should sound like a bold personal brand statement, avoiding corporate cliches. Use a mix of technical authority and human personality. NO exclamation marks.", "aboutMe": "A friendly, humane 2-3 sentence introduction about the person's interests and professional philosophy.", "categories": ["Skill Category 1", "Skill Category 2", "Skill Category 3", "Skill Category 4", "Skill Category 5", "Skill Category 6"], "skills": [ {"name": "Skill Name", "level": 0-100} ], "contact": { "email": "Email address", "phone": "Phone number or null", "location": "City, Country or null" } }, "workExperiences": [ { "role": "Job Title", "company": "Company Name", "period": "Years (e.g. 2020 - 2023)", "description": "Short achievement" } ], "caseStudies": [ { "title": "Project Title", "description": "Project overview", "category": "Project Category" } ] } CRITICAL: 1. For the "name" field, you MUST format it exactly as: "Hey, I'm [First Name]!". 2. For the "categories" array, you MUST provide at least 6 professional skills. 3. The "aboutMe" section should be written in first person and sound natural. 4. For the footer, extract contact details. If not found, use realistic placeholders. Resume Text: ${text};`;

      const aiResponse = await getAiCompletion(prompt);
      
      if (!aiResponse) {
        throw new Error("AI failed to generate response");
      }

      // Try to parse the AI response as JSON
      let content;
      try {
        // Find JSON block if AI wrapped it in markdown
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        content = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(aiResponse);
      } catch (e) {
        // Fallback if not valid JSON
        content = { raw: aiResponse };
      }

      res.json({ content });
    } catch (error) {
      console.error("Conversion error:", error);
      res.status(500).json({ message: "Failed to convert resume" });
    }
  });
  app.post("/api/forgot-password", async (req, res) => {
    try {
      const { email } = forgotPasswordSchema.parse(req.body);
      
      const user = await storage.getUserByEmail(email);
      
      if (!user) {
        return res.json({ success: true, message: "If an account with that email exists, a password reset link has been sent." });
      }

      const token = randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

      await storage.createPasswordResetToken({
        userId: user.id,
        token,
        expiresAt,
      });

      console.log(`Password reset token for ${email}: ${token}`);
      console.log(`Reset link: http://localhost:5000/reset-password?token=${token}`);

      res.json({ success: true, message: "If an account with that email exists, a password reset link has been sent." });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ success: false, message: "Invalid email address" });
      }
      res.status(500).json({ success: false, message: "An error occurred" });
    }
  });

  app.post("/api/reset-password", async (req, res) => {
    try {
      const { token, newPassword } = resetPasswordSchema.parse(req.body);

      const resetToken = await storage.getPasswordResetToken(token);

      if (!resetToken) {
        return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
      }

      if (new Date() > resetToken.expiresAt) {
        await storage.deletePasswordResetToken(token);
        return res.status(400).json({ success: false, message: "Reset token has expired" });
      }

      await storage.updateUserPassword(resetToken.userId, newPassword);
      await storage.deletePasswordResetToken(token);

      res.json({ success: true, message: "Password has been reset successfully" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ success: false, message: "Invalid request data" });
      }
      res.status(500).json({ success: false, message: "An error occurred" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
