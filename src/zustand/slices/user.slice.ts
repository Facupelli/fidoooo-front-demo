import { type StateCreator } from "zustand";
import { type User } from "@/types/db";
import { type ChatSlice } from "./chat.slice";

export interface UserSlice {
  user: User | null;
  setUser: (user: User) => void;
}

export const createUserSlice: StateCreator<
  UserSlice & ChatSlice,
  [],
  [],
  UserSlice
> = (set) => ({
  user: null,
  setUser: (user: User) => set(() => ({ user })),
});
