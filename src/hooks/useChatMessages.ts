"use client";

import { useEffect, useState } from "react";
import {
  ref,
  query,
  orderByKey,
  endAt,
  get,
  limitToLast,
  onValue,
  off,
  type DataSnapshot,
} from "firebase/database";
import { database } from "@/lib/firebase-config";
import { type Message } from "@/types/messages";

export const useChatMessages = ({
  conversationId,
  limit = 15,
}: {
  conversationId: string | undefined;
  limit?: number;
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [lastKey, setLastKey] = useState<string | undefined>(undefined);
  const [pages, setPages] = useState(0);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    setLastKey("");
  }, [conversationId]);

  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      return;
    }

    // TODO: si es la misma conversacion no debo limpiar el array
    setMessages([]);
    const messagesRef = ref(database, `conversations/${conversationId}`);
    const messagesQuery = query(
      messagesRef,
      orderByKey(),
      limitToLast(limit + 1),
    );

    const handleNewMessages = (snapshot: DataSnapshot) => {
      const newMessages: Message[] = [];
      // eslint-disable-next-line
      snapshot.forEach((childSnapshot: any) => {
        // eslint-disable-next-line
        newMessages.push({
          // eslint-disable-next-line
          id: childSnapshot.key,
          // eslint-disable-next-line
          ...childSnapshot.val(),
        });
      });

      setMessages(newMessages);
      setPages(1);
      if (snapshot.size > limit) {
        const previousItem = newMessages.shift();
        setLastKey(previousItem?.id);
      }
    };

    onValue(messagesQuery, handleNewMessages);

    return () => {
      off(messagesQuery, "value", handleNewMessages);
    };
  }, [conversationId, limit]);

  const fetchPreviousPage = async () => {
    if (isFetching) {
      return;
    }
    setIsFetching(true);

    const messagesRef = ref(database, `conversations/${conversationId}`);

    if (!lastKey) {
      setIsFetching(false);
      return;
    }

    const messageQuery = query(
      messagesRef,
      orderByKey(),
      endAt(lastKey),
      limitToLast(limit + 1),
    );
    const snapshot = await get(messageQuery);
    const messagesObject = snapshot.val() as Record<string, Message>;
    const messages = Object.entries(messagesObject).map(([id, message]) => ({
      ...message,
      id,
    }));

    if (snapshot.size < limit + 1) {
      setLastKey(undefined);
    } else {
      const previousItem = messages.shift();
      setLastKey(previousItem?.id);
      setPages((prev) => prev + 1);
    }

    setMessages((prevMessages) => [...messages, ...prevMessages]);
    setIsFetching(false);
  };

  return {
    messages,
    fetchPreviousPage,
    pages,
  };
};
