import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  textProcessingRequestSchema, 
  settingsUpdateSchema,
  type TextProcessingRequest,
  type SettingsUpdate 
} from "@shared/schema";
import { processTextForTypingExercise, enhanceTextForCzechTyping } from "./services/openai";

export async function registerRoutes(app: Express): Promise<Server> {
  // Text processing endpoint
  app.post("/api/process-text", async (req, res) => {
    try {
      const validatedData = textProcessingRequestSchema.parse(req.body);
      
      // Create processing job
      const job = await storage.createTextProcessingJob({
        originalText: validatedData.text,
        typingSpeed: validatedData.typingSpeed,
        aiModel: validatedData.aiModel,
      });

      // Process text with AI
      const result = await processTextForTypingExercise(
        validatedData.text,
        validatedData.aiModel
      );

      // Update job with results
      const completedJob = await storage.updateTextProcessingJob(job.id, {
        processedText: result.processedText,
        status: "completed",
      });

      res.json({
        jobId: completedJob.id,
        originalText: validatedData.text,
        processedText: result.processedText,
        confidence: result.confidence,
        suggestions: result.suggestions,
        status: "completed",
      });
    } catch (error) {
      console.error("Text processing error:", error);
      res.status(500).json({ 
        error: "Failed to process text",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Enhanced text processing with difficulty levels
  app.post("/api/enhance-text", async (req, res) => {
    try {
      const { text, difficulty = "medium", aiModel = "gpt-4o" } = req.body;
      
      if (!text) {
        return res.status(400).json({ error: "Text is required" });
      }

      const result = await enhanceTextForCzechTyping(text, difficulty, aiModel);

      res.json({
        originalText: text,
        processedText: result.processedText,
        confidence: result.confidence,
        suggestions: result.suggestions,
        difficulty,
      });
    } catch (error) {
      console.error("Text enhancement error:", error);
      res.status(500).json({ 
        error: "Failed to enhance text",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Get processing job status
  app.get("/api/jobs/:id", async (req, res) => {
    try {
      const jobId = parseInt(req.params.id);
      if (isNaN(jobId)) {
        return res.status(400).json({ error: "Invalid job ID" });
      }

      const job = await storage.getTextProcessingJob(jobId);
      if (!job) {
        return res.status(404).json({ error: "Job not found" });
      }

      res.json(job);
    } catch (error) {
      console.error("Job retrieval error:", error);
      res.status(500).json({ error: "Failed to retrieve job" });
    }
  });

  // Extension settings endpoints
  app.get("/api/settings", async (req, res) => {
    try {
      // For now, return default settings (in real app, would be user-specific)
      const settings = await storage.getExtensionSettings(1) || {
        typingSpeed: 100,
        aiModel: "gpt-4o",
        autoStart: false,
        apiKey: null,
      };
      
      res.json(settings);
    } catch (error) {
      console.error("Settings retrieval error:", error);
      res.status(500).json({ error: "Failed to retrieve settings" });
    }
  });

  app.post("/api/settings", async (req, res) => {
    try {
      const validatedData = settingsUpdateSchema.parse(req.body);
      
      const settings = await storage.updateExtensionSettings(1, validatedData);
      
      res.json(settings);
    } catch (error) {
      console.error("Settings update error:", error);
      res.status(500).json({ 
        error: "Failed to update settings",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Website detection endpoint (for extension to check if on zav.cz)
  app.post("/api/detect-website", async (req, res) => {
    try {
      const { url, pageContent } = req.body;
      
      const isZavCz = url.includes('zav.cz');
      const hasTypingExercise = pageContent && (
        pageContent.includes('psací cvičení') ||
        pageContent.includes('typing') ||
        pageContent.includes('text-input') ||
        pageContent.includes('textarea')
      );

      res.json({
        isSupported: isZavCz,
        hasTypingExercise,
        website: isZavCz ? 'zav.cz' : 'unknown',
        detectedElements: hasTypingExercise ? ['typing-field'] : [],
      });
    } catch (error) {
      console.error("Website detection error:", error);
      res.status(500).json({ error: "Failed to detect website" });
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      timestamp: new Date().toISOString(),
      service: "AI Text Assistant API"
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
