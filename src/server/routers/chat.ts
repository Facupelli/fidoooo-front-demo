"use server";

import {
  type LabelRGBAColor,
  type ApiResponse,
  type Chat,
  type Session,
} from "@/types/db";
import { getAuthToken } from "../utils";
import { revalidateTag } from "next/cache";

export const getChatsByChannel = async ({
  channelId,
}: {
  channelId: string | undefined;
}) => {
  const token = await getAuthToken();

  const chatRawResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/conversation?channelId=${channelId}`,
    {
      // cache: "no-store",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const chatResponse: ApiResponse<Chat[]> = await chatRawResponse.json();
  const chats = chatResponse.data;
  return chats;
};

export const getChatById = async ({
  conversationId,
}: {
  conversationId: string | undefined;
}) => {
  const token = await getAuthToken();

  const chatRawResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/conversation/by-id?conversationId=${conversationId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      next: {
        tags: ["get-chat-by-id"],
      },
    },
  );

  const chatResponse: ApiResponse<Chat> = await chatRawResponse.json();
  const chat = chatResponse.data;
  return chat;
};

export const getChatSession = async ({
  conversationId,
}: {
  conversationId: string | undefined;
}) => {
  const token = await getAuthToken();

  if (!conversationId) {
    return null;
  }

  const sessionRawResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/conversation/session/${conversationId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const sessionResponse: ApiResponse<Session | null> =
    await sessionRawResponse.json();
  const session = sessionResponse.data;
  return session;
};

export const updateChatStatus = async ({
  chatStatus,
  conversationId,
}: {
  chatStatus: string;
  conversationId: string;
}) => {
  const token = await getAuthToken();

  const body = JSON.stringify({ status: chatStatus, conversationId });

  const chatRawResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/conversation/status`,
    {
      method: "PATCH",
      body,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );

  const chatResponse: ApiResponse<unknown> = await chatRawResponse.json();
  return chatResponse;
};

export const updateChatLabel = async ({
  labelId,
  color,
  conversationId,
}: {
  labelId: string;
  conversationId: string;
  color: LabelRGBAColor;
}) => {
  const token = await getAuthToken();

  const body = JSON.stringify({ labelId, conversationId, color });

  const rawResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/business/label/assign-to-chat`,
    {
      method: "PATCH",
      body,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );

  const response: ApiResponse<unknown> = await rawResponse.json();
  return response;
};

export const setBotIsActive = async ({
  isActive,
  conversationId,
  sessionId,
}: {
  isActive: boolean;
  conversationId: string;
  sessionId: string;
}) => {
  const token = await getAuthToken();

  const body = JSON.stringify({ isActive, conversationId, sessionId });

  const chatRawResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/conversation/is-bot-active`,
    {
      method: "POST",
      body,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );

  const chatResponse: ApiResponse<unknown> = await chatRawResponse.json();

  return chatResponse;
};

export const setChatReaded = async ({ chatId }: { chatId: string }) => {
  const token = await getAuthToken();

  const body = JSON.stringify({
    conversationId: chatId,
    unreadCount: 0,
  });

  const chatRawResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/conversation`,
    {
      method: "PATCH",
      body,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );

  const chatResponse: ApiResponse<unknown> = await chatRawResponse.json();
  return chatResponse;
};

export const sendBotFirstNode = async ({
  chatId,
  sessionId,
  botId,
  to,
}: {
  chatId: string;
  sessionId: string;
  botId: string;
  to: string;
}) => {
  const token = await getAuthToken();

  const body = JSON.stringify({
    conversationId: chatId,
    sessionId,
    botId,
    to,
  });

  const chatRawResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/bot/restart-bot`,
    {
      method: "POST",
      body,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );

  const chatResponse: ApiResponse<unknown> = await chatRawResponse.json();
  return chatResponse;
};

export const assignUserToChat = async ({
  conversationId,
  userId,
}: {
  conversationId: string;
  userId: string;
}) => {
  const token = await getAuthToken();

  const body = JSON.stringify({ employeeId: userId, conversationId });

  const rawResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/conversation/current-user`,
    {
      method: "PATCH",
      body,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );

  const response: ApiResponse<unknown> = await rawResponse.json();

  return response;
};
