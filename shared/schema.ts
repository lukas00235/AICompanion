import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const textProcessingJobs = pgTable("text_processing_jobs", {
  id: serial("id").primaryKey(),
  originalText: text("original_text").notNull(),
  processedText: text("processed_text"),
  status: text("status").notNull().default("pending"), // pending, processing, completed, failed
  typingSpeed: integer("typing_speed").notNull().default(100),
  aiModel: text("ai_model").notNull().default("gpt-4o"),
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const extensionSettings = pgTable("extension_settings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  typingSpeed: integer("typing_speed").notNull().default(100),
  aiModel: text("ai_model").notNull().default("gpt-4o"),
  autoStart: boolean("auto_start").notNull().default(false),
  apiKey: text("api_key"), // encrypted
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertTextProcessingJobSchema = createInsertSchema(textProcessingJobs).pick({
  originalText: true,
  typingSpeed: true,
  aiModel: true,
});

export const insertExtensionSettingsSchema = createInsertSchema(extensionSettings).pick({
  typingSpeed: true,
  aiModel: true,
  autoStart: true,
  apiKey: true,
});

export const textProcessingRequestSchema = z.object({
  text: z.string().min(1),
  typingSpeed: z.number().min(50).max(300).default(100),
  aiModel: z.string().default("gpt-4o"),
});

export const settingsUpdateSchema = z.object({
  typingSpeed: z.number().min(50).max(300).optional(),
  aiModel: z.string().optional(),
  autoStart: z.boolean().optional(),
  apiKey: z.string().optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type TextProcessingJob = typeof textProcessingJobs.$inferSelect;
export type InsertTextProcessingJob = z.infer<typeof insertTextProcessingJobSchema>;
export type ExtensionSettings = typeof extensionSettings.$inferSelect;
export type InsertExtensionSettings = z.infer<typeof insertExtensionSettingsSchema>;
export type TextProcessingRequest = z.infer<typeof textProcessingRequestSchema>;
export type SettingsUpdate = z.infer<typeof settingsUpdateSchema>;
