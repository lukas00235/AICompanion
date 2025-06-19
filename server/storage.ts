import { 
  users, 
  textProcessingJobs,
  extensionSettings,
  type User, 
  type InsertUser,
  type TextProcessingJob,
  type InsertTextProcessingJob,
  type ExtensionSettings,
  type InsertExtensionSettings,
  type SettingsUpdate
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createTextProcessingJob(job: InsertTextProcessingJob): Promise<TextProcessingJob>;
  getTextProcessingJob(id: number): Promise<TextProcessingJob | undefined>;
  updateTextProcessingJob(id: number, updates: Partial<TextProcessingJob>): Promise<TextProcessingJob>;
  
  getExtensionSettings(userId: number): Promise<ExtensionSettings | undefined>;
  updateExtensionSettings(userId: number, settings: SettingsUpdate): Promise<ExtensionSettings>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createTextProcessingJob(insertJob: InsertTextProcessingJob): Promise<TextProcessingJob> {
    const [job] = await db
      .insert(textProcessingJobs)
      .values({
        originalText: insertJob.originalText,
        typingSpeed: insertJob.typingSpeed || 100,
        aiModel: insertJob.aiModel || "gpt-4o",
      })
      .returning();
    return job;
  }

  async getTextProcessingJob(id: number): Promise<TextProcessingJob | undefined> {
    const [job] = await db.select().from(textProcessingJobs).where(eq(textProcessingJobs.id, id));
    return job || undefined;
  }

  async updateTextProcessingJob(id: number, updates: Partial<TextProcessingJob>): Promise<TextProcessingJob> {
    const [job] = await db
      .update(textProcessingJobs)
      .set(updates)
      .where(eq(textProcessingJobs.id, id))
      .returning();
    
    if (!job) {
      throw new Error(`Job with id ${id} not found`);
    }
    return job;
  }

  async getExtensionSettings(userId: number): Promise<ExtensionSettings | undefined> {
    const [settings] = await db.select().from(extensionSettings).where(eq(extensionSettings.userId, userId));
    return settings || undefined;
  }

  async updateExtensionSettings(userId: number, settingsUpdate: SettingsUpdate): Promise<ExtensionSettings> {
    const existingSettings = await this.getExtensionSettings(userId);
    
    if (existingSettings) {
      const [settings] = await db
        .update(extensionSettings)
        .set(settingsUpdate)
        .where(eq(extensionSettings.userId, userId))
        .returning();
      return settings;
    } else {
      const [settings] = await db
        .insert(extensionSettings)
        .values({
          userId,
          typingSpeed: settingsUpdate.typingSpeed || 100,
          aiModel: settingsUpdate.aiModel || "gpt-4o",
          autoStart: settingsUpdate.autoStart || false,
          apiKey: settingsUpdate.apiKey || null,
        })
        .returning();
      return settings;
    }
  }
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private textProcessingJobs: Map<number, TextProcessingJob>;
  private extensionSettings: Map<number, ExtensionSettings>;
  private currentUserId: number;
  private currentJobId: number;
  private currentSettingsId: number;

  constructor() {
    this.users = new Map();
    this.textProcessingJobs = new Map();
    this.extensionSettings = new Map();
    this.currentUserId = 1;
    this.currentJobId = 1;
    this.currentSettingsId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createTextProcessingJob(insertJob: InsertTextProcessingJob): Promise<TextProcessingJob> {
    const id = this.currentJobId++;
    const job: TextProcessingJob = {
      id,
      originalText: insertJob.originalText,
      processedText: null,
      status: "pending",
      typingSpeed: insertJob.typingSpeed || 100,
      aiModel: insertJob.aiModel || "gpt-4o",
      createdAt: new Date(),
      completedAt: null,
    };
    this.textProcessingJobs.set(id, job);
    return job;
  }

  async getTextProcessingJob(id: number): Promise<TextProcessingJob | undefined> {
    return this.textProcessingJobs.get(id);
  }

  async updateTextProcessingJob(id: number, updates: Partial<TextProcessingJob>): Promise<TextProcessingJob> {
    const existingJob = this.textProcessingJobs.get(id);
    if (!existingJob) {
      throw new Error(`Job with id ${id} not found`);
    }

    const updatedJob: TextProcessingJob = {
      ...existingJob,
      ...updates,
      completedAt: updates.status === "completed" ? new Date() : existingJob.completedAt,
    };

    this.textProcessingJobs.set(id, updatedJob);
    return updatedJob;
  }

  async getExtensionSettings(userId: number): Promise<ExtensionSettings | undefined> {
    return Array.from(this.extensionSettings.values()).find(
      (settings) => settings.userId === userId
    );
  }

  async updateExtensionSettings(userId: number, settingsUpdate: SettingsUpdate): Promise<ExtensionSettings> {
    const existingSettings = await this.getExtensionSettings(userId);
    
    let settings: ExtensionSettings;
    if (existingSettings) {
      settings = { ...existingSettings, ...settingsUpdate };
      this.extensionSettings.set(existingSettings.id, settings);
    } else {
      const id = this.currentSettingsId++;
      settings = {
        id,
        userId,
        typingSpeed: settingsUpdate.typingSpeed || 100,
        aiModel: settingsUpdate.aiModel || "gpt-4o",
        autoStart: settingsUpdate.autoStart || false,
        apiKey: settingsUpdate.apiKey || null,
      };
      this.extensionSettings.set(id, settings);
    }

    return settings;
  }
}

export const storage = new DatabaseStorage();
