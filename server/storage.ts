import { type User, type InsertUser, type PasswordResetToken, type InsertPasswordResetToken } from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getUserByEmail(email: string): Promise<User | undefined>;
  updateUserPassword(userId: string, newPassword: string): Promise<void>;
  createPasswordResetToken(tokenData: InsertPasswordResetToken): Promise<PasswordResetToken>;
  getPasswordResetToken(token: string): Promise<PasswordResetToken | undefined>;
  deletePasswordResetToken(token: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private passwordResetTokens: Map<string, PasswordResetToken>;

  constructor() {
    this.users = new Map();
    this.passwordResetTokens = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async updateUserPassword(userId: string, newPassword: string): Promise<void> {
    const user = this.users.get(userId);
    if (user) {
      this.users.set(userId, { ...user, password: newPassword });
    }
  }

  async createPasswordResetToken(tokenData: InsertPasswordResetToken): Promise<PasswordResetToken> {
    const id = randomUUID();
    const resetToken: PasswordResetToken = {
      id,
      userId: tokenData.userId,
      token: tokenData.token,
      expiresAt: tokenData.expiresAt,
    };
    this.passwordResetTokens.set(resetToken.token, resetToken);
    return resetToken;
  }

  async getPasswordResetToken(token: string): Promise<PasswordResetToken | undefined> {
    return this.passwordResetTokens.get(token);
  }

  async deletePasswordResetToken(token: string): Promise<void> {
    this.passwordResetTokens.delete(token);
  }
}

export const storage = new MemStorage();
