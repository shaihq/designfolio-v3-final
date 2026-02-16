import { storage } from "../../storage.js";
import { conversations, messages } from "@shared/schema";

export interface IChatStorage {
  getConversation(id: number): Promise<typeof conversations.$inferSelect | undefined>;
  getAllConversations(): Promise<(typeof conversations.$inferSelect)[]>;
  createConversation(title: string): Promise<typeof conversations.$inferSelect>;
  deleteConversation(id: number): Promise<void>;
  getMessagesByConversation(conversationId: number): Promise<(typeof messages.$inferSelect)[]>;
  createMessage(conversationId: number, role: string, content: string): Promise<typeof messages.$inferSelect>;
}

export const chatStorage: IChatStorage = {
  async getConversation(id: number) {
    return storage.getConversation(id);
  },

  async getAllConversations() {
    return storage.getAllConversations();
  },

  async createConversation(title: string) {
    return storage.createConversation(title);
  },

  async deleteConversation(id: number) {
    return storage.deleteConversation(id);
  },

  async getMessagesByConversation(conversationId: number) {
    return storage.getMessagesByConversation(conversationId);
  },

  async createMessage(conversationId: number, role: string, content: string) {
    return storage.createMessage(conversationId, role, content);
  },
};

