import { type ConversationStatus } from "@/types/db";

export interface ChatFilters {
  employees: string[];
  labels: string[];
  status: ConversationStatus[];
  search: string;
}

export interface SendTextMessageForm {
  text?: string;
  image?: File;
  document?: File;
}
