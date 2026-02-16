import { pgTable, text, varchar, timestamp, jsonb, serial, integer } from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool } from "@neondatabase/serverless";
import { 
  type User, type InsertUser, 
  type PasswordResetToken, type InsertPasswordResetToken, 
  type Portfolio, type InsertPortfolio,
  conversations, messages,
  users, passwordResetTokens, portfolios
} from "@shared/schema";
import { randomUUID } from "crypto";
import { eq, desc } from "drizzle-orm";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getUserByEmail(email: string): Promise<User | undefined>;
  updateUserPassword(userId: string, newPassword: string): Promise<void>;
  createPasswordResetToken(tokenData: InsertPasswordResetToken): Promise<PasswordResetToken>;
  getPasswordResetToken(token: string): Promise<PasswordResetToken | undefined>;
  deletePasswordResetToken(token: string): Promise<void>;
  
  createPortfolio(portfolio: InsertPortfolio): Promise<Portfolio>;
  getPortfolio(id: string): Promise<Portfolio | undefined>;

  getConversation(id: number): Promise<typeof conversations.$inferSelect | undefined>;
  getAllConversations(): Promise<(typeof conversations.$inferSelect)[]>;
  createConversation(title: string): Promise<typeof conversations.$inferSelect>;
  deleteConversation(id: number): Promise<void>;
  getMessagesByConversation(conversationId: number): Promise<(typeof messages.$inferSelect)[]>;
  createMessage(conversationId: number, role: string, content: string): Promise<typeof messages.$inferSelect>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUserPassword(userId: string, newPassword: string): Promise<void> {
    await db.update(users).set({ password: newPassword }).where(eq(users.id, userId));
  }

  async createPasswordResetToken(tokenData: InsertPasswordResetToken): Promise<PasswordResetToken> {
    const [token] = await db.insert(passwordResetTokens).values(tokenData).returning();
    return token;
  }

  async getPasswordResetToken(token: string): Promise<PasswordResetToken | undefined> {
    const [resetToken] = await db.select().from(passwordResetTokens).where(eq(passwordResetTokens.token, token));
    return resetToken;
  }

  async deletePasswordResetToken(token: string): Promise<void> {
    await db.delete(passwordResetTokens).where(eq(passwordResetTokens.token, token));
  }

  async createPortfolio(insertPortfolio: InsertPortfolio): Promise<Portfolio> {
    const [portfolio] = await db.insert(portfolios).values(insertPortfolio).returning();
    return portfolio;
  }

  async getPortfolio(id: string): Promise<Portfolio | undefined> {
    const [portfolio] = await db.select().from(portfolios).where(eq(portfolios.id, id));
    return portfolio;
  }

  async getConversation(id: number) {
    const [conversation] = await db.select().from(conversations).where(eq(conversations.id, id));
    return conversation;
  }

  async getAllConversations() {
    return db.select().from(conversations).orderBy(desc(conversations.createdAt));
  }

  async createConversation(title: string) {
    const [conversation] = await db.insert(conversations).values({ title }).returning();
    return conversation;
  }

  async deleteConversation(id: number) {
    await db.delete(messages).where(eq(messages.conversationId, id));
    await db.delete(conversations).where(eq(conversations.id, id));
  }

  async getMessagesByConversation(conversationId: number) {
    return db.select().from(messages).where(eq(messages.conversationId, conversationId)).orderBy(messages.createdAt);
  }

  async createMessage(conversationId: number, role: string, content: string) {
    const [message] = await db.insert(messages).values({ conversationId, role, content }).returning();
    return message;
  }
}

export const storage = new DatabaseStorage();
