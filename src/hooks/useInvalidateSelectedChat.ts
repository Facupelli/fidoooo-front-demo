import { useBoundStore } from "@/zustand/store";
import * as api from "@/server/root";

export const useInvalidateSelectedChat = (
  selectedChatId: string | undefined,
) => {
  const setSelectedChat = useBoundStore((state) => state.setSelectedChat);

  const invalidateChat = async () => {
    const updatedChat = await api.chat.getChatById({
      conversationId: selectedChatId,
    });

    if (updatedChat) {
      setSelectedChat(updatedChat);
    }
  };

  return { invalidateChat };
};
