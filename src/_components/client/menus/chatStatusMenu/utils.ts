import { ConversationStatus } from "@/types/db";

export const getChatStatusText = (chatStatus: ConversationStatus) => {
  switch (chatStatus) {
    case ConversationStatus.COMPLETED:
      return "Finalizado";
    case ConversationStatus.IN_PROGRESS:
      return "En curso";
    case ConversationStatus.EXPIRED:
      return "Expirado";
    default:
      return "";
  }
};
