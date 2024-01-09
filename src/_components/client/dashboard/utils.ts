import dayjs from "dayjs";
import * as firestore from "firebase/firestore";
import { type FirestoreTimestamp, type Chat } from "@/types/db";
import { type Message, MessageFromType, MessageType } from "@/types/messages";
import { push, ref } from "firebase/database";
import { database } from "@/lib/firebase-config";
import { type ChatFilters } from "./interfaces";

export const generateTextFromLastMessage = (chat: Chat) => {
  const messageMaxLength = 40;
  const fileMessageMaxLength = 25;
  let message: string | undefined;

  switch (chat.lastCustomerMessage?.type) {
    case MessageType.TEXT: {
      message = chat.lastCustomerMessage.text?.body;
      break;
    }
    case MessageType.LOCATION:
      message = "📍 Ubicacion";
      break;
    case MessageType.IMAGE:
      message = "📷 Foto";
      break;
    case MessageType.DOCUMENT: {
      message = `📄 ${chat.lastCustomerMessage.document?.filename}`;

      if (message && message.length > fileMessageMaxLength) {
        return message.substring(0, fileMessageMaxLength) + "...";
      }
      return message;
      break;
    }
    case MessageType.AUDIO:
      message = "🎧 Audio";
      break;

    case MessageType.INTERACTIVE: {
      switch (chat.lastCustomerMessage.interactive.type) {
        case "button_reply":
          message = chat.lastCustomerMessage.interactive.button_reply.title;
          break;
        case "list_reply":
          message = chat.lastCustomerMessage.interactive.list_reply.title;
          break;
      }
      break;
    }

    default:
      message = "Este mensaje no es soportado";
  }

  if (message && message.length > messageMaxLength) {
    return message.substring(0, messageMaxLength) + "...";
  }
  return message;
};

export const firestoreTimestampToDateString = (date: FirestoreTimestamp) => {
  const seconds = date.seconds ?? date._seconds;
  const nanoseconds = date.nanoseconds ?? date._nanoseconds;

  if (!seconds || !nanoseconds) {
    return;
  }

  const convertedDate = new firestore.Timestamp(seconds, nanoseconds)
    .toDate()
    .toISOString();

  if (dayjs().isSame(dayjs(convertedDate), "day")) {
    return dayjs(convertedDate).format("HH:mm");
  }
  return dayjs(convertedDate).format("YYYY/MM/DD");
};

export const generateUniqueId = () => {
  return push(ref(database)).key;
};

export const formatChatPhoneNumber = (number: string) => {
  const countryCode = number.slice(0, 3);
  const provinceCode = number.slice(3, 6);
  const phoneNumber = number.slice(6);

  return `${countryCode} ${provinceCode} ${phoneNumber}`;
};

export const hasAnyFilterActive = (filters: ChatFilters) => {
  for (const key in filters) {
    const value = filters[key as keyof ChatFilters];
    if (typeof value === "string" && value) {
      return true;
    } else if (Array.isArray(value) && value.length > 0) {
      return true;
    }
  }
  return false;
};

export const has24HoursPassedSinceLastCustomerMessage = (
  messages: Message[],
) => {
  const lastCustomerMessage = messages
    .filter((message) => message.from.userId === MessageFromType.CUSTOMER)
    .at(-1);

  if (!lastCustomerMessage) {
    return false;
  }

  const lastMessageTimestamp = Number(lastCustomerMessage.timestamp);
  const currentTimestamp = new Date().getTime();

  return currentTimestamp - lastMessageTimestamp > 24 * 60 * 60 * 1000;
};
