import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { randomBytes } from "crypto";
import { z } from "zod";
import multer from "multer";
import { createRequire } from "module";
import { getAiCompletion } from "./ai";

const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");

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

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/convert-resume", upload.single("resume"), async (req: MulterRequest, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No resume file uploaded" });
      }

      let text = "";
      if (req.file.mimetype === "application/pdf") {
        try {
          const data = await pdf(req.file.buffer);
          text = data.text;
          
          // Validate that we actually got meaningful text
          if (!text || text.trim().length < 50) {
            throw new Error("Could not extract sufficient text from PDF. It might be an image-only PDF or protected.");
          }
        } catch (pdfError: any) {
          console.error("PDF Parsing Error:", pdfError);
          // If it's a validation error we threw, use that message
          const errorMessage = pdfError.message?.includes("sufficient text") 
            ? "We couldn't read your resume text. Please ensure it's not a scanned image and try a different PDF or a TXT file."
            : `Technical error parsing PDF: ${pdfError.message || 'Unknown error'}. Please try a different file.`;
          
          return res.status(400).json({ message: errorMessage });
        }
      } else {
        text = req.file.buffer.toString("utf-8");
        if (!text || text.trim().length < 50) {
          return res.status(400).json({ message: "The uploaded file appears to be empty or too short." });
        }
      }

      const prompt = `Based on the following resume text, generate a professional portfolio website content in a clear, structured text format. Include sections like About Me, Experience, Skills, and Projects. Focus on making it ready to be displayed as a portfolio.
      
      Resume Text:
      ${text}`;

      const content = await getAiCompletion(prompt);
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
