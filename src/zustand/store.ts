import { create } from "zustand";
import { type UserSlice, createUserSlice } from "./slices/user.slice";

import { type ChatSlice, createChatSlice } from "./slices/chat.slice";

export const useBoundStore = create<UserSlice & ChatSlice>()((...a) => ({
  ...createUserSlice(...a),
  ...createChatSlice(...a),
}));
