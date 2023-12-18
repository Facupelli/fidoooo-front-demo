import { type StateCreator } from "zustand";
import { type Chat } from "@/types/db";
import { type UserSlice } from "./user.slice";

export interface ChatSlice {
  // chats: Chat[] | null;
  // setChats: (chats: Chat[]) => void;
  selectedChat: Chat | null;
  setSelectedChat: (chat: Chat | null) => void;
}

export const createChatSlice: StateCreator<
  UserSlice & ChatSlice,
  [],
  [],
  ChatSlice
> = (set) => ({
  // chats: null,
  // setChats: (chats: Chat[]) => set(() => ({ chats })),
  selectedChat: null,
  setSelectedChat: (chat: Chat | null) => set(() => ({ selectedChat: chat })),
});
