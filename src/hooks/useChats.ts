"use client";
import {
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { firestore } from "@/lib/firebase-config";
import { type Chat } from "@/types/db";
import * as api from "@/server/root";

export const useChats = ({
  channelId,
  serverChats,
}: {
  channelId: string | undefined;
  serverChats: Chat[];
}) => {
  const [chats, setChats] = useState<Chat[]>(serverChats);
  const isFirstRender = useRef(true);
  const chatId = useRef<string | undefined>();

  useEffect(() => {
    const getChatById = async (conversationId: string) => {
      const chat = await api.chat.getChatById({
        conversationId,
      });

      return chat;
    };

    const conversationsCollection = collection(firestore, "conversations");
    const q = query(
      conversationsCollection,
      where("channelId", "==", channelId),
      orderBy("lastMessageAt", "desc"),
    );

    if (isFirstRender.current) {
      isFirstRender.current = false;
    } else {
      getDocs(q)
        .then((snapshot) => {
          const initialChats: Chat[] = [];
          snapshot.forEach((doc) => {
            initialChats.push({ ...doc.data(), id: doc.id } as Chat);
          });
          setChats(initialChats);
        })
        .catch((error) => console.log(error));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          chatId.current = change.doc.id;
          getChatById(chatId.current)
            .then((chat) => {
              if (!chat) {
                return;
              }

              setChats((prevChats) => {
                const alreadyChat = prevChats.find(
                  (chat) => chat.id === change.doc.id,
                );
                if (alreadyChat) {
                  return prevChats;
                }

                return [chat, ...prevChats];
              });
            })
            .catch((error) => console.log("error fetchi chat by id", error));
        }

        if (change.type === "modified") {
          setChats((prevChats) => {
            const updatedChats = prevChats.map((chat) =>
              chat.id === change.doc.id
                ? ({ ...change.doc.data(), id: change.doc.id } as Chat)
                : chat,
            );
            return updatedChats;
          });
        }
      });
    });

    return () => unsubscribe();
  }, [channelId, setChats]);

  return { chats, setChats };
};
