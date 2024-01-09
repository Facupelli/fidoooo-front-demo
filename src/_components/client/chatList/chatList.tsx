"use client";

import type { Chat } from "@/types/db";
import { type ChatFilters } from "../dashboard/interfaces";
import * as api from "@/server/root";
import { useBoundStore } from "@/zustand/store";
import {
  firestoreTimestampToDateString,
  formatChatPhoneNumber,
  generateTextFromLastMessage,
  hasAnyFilterActive,
} from "../dashboard/utils";
import { ChatsIcon } from "@/icons";
import { ChatTitle } from "../chat/chatTitle";

const ChatList = ({
  chats,
  filters,
}: {
  chats: Chat[];
  filters: ChatFilters;
}) => {
  const setChatReaded = api.chat.setChatReaded;
  const setSelectedChat = useBoundStore((state) => state.setSelectedChat);

  const handleSelectChat = async (chat: Chat) => {
    setSelectedChat(chat);
    if (chat.unreadCount && chat.unreadCount > 0) {
      await setChatReaded({ chatId: chat.id });
    }
  };

  if (!chats || chats.length <= 0) {
    if (hasAnyFilterActive(filters)) {
      return (
        <div className="mt-10 items-center text-center text-f-black">
          <p>No tienes ningun chat que coincida con estos filtros.</p>
          <p className="gap-2">Prueba modificando algunos valores!</p>
        </div>
      );
    }

    return (
      <div className="mt-10 items-center text-center text-f-black">
        <p>No tienes ningun chat en este canal!</p>
        <p className="gap-2">Comienza una conversación haciendo click en</p>
        <div className="flex justify-center pt-1">
          <ChatsIcon size={24} />
        </div>
      </div>
    );
  }

  return (
    <>
      {chats.map((chat) => (
        <div
          key={chat.id}
          className="flex items-center gap-2 py-3 text-f-black"
          onClick={() => handleSelectChat(chat)}
        >
          <div className="h-12 w-12 rounded-full bg-blue-200"></div>
          <div className="flex grow items-center   justify-between">
            <div className="grow">
              <ChatTitle label={chat.label}>
                {chat.customer.nickname
                  ? chat.customer.nickname
                  : formatChatPhoneNumber(chat.to)}
              </ChatTitle>
              <p className="font-normal leading-5">
                {generateTextFromLastMessage(chat)}
              </p>
            </div>
            <div className="grid justify-items-center">
              {chat.lastMessageAt && (
                <p className="text-sm">
                  {firestoreTimestampToDateString(chat.lastMessageAt)}
                </p>
              )}
              {!!chat.unreadCount && chat.unreadCount > 0 && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-f-black text-sm text-white">
                  {chat.unreadCount}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export { ChatList };
