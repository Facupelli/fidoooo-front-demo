import { type Chat } from "@/types/db";
import { useMemo } from "react";
import { type ChatFilters } from "./interfaces";

export const useFilteredChats = (chats: Chat[], filters: ChatFilters) => {
  const { employees, labels, status, search } = filters;

  return useMemo(() => {
    let filteredChats = chats;

    if (search) {
      filteredChats = filteredChats.filter((chat) =>
        chat.customer.nickname.toLowerCase().includes(search.toLowerCase()),
      );
    }

    const filterByArray = (
      array: string[],
      filterFunc: (chat: Chat) => boolean,
    ) => {
      if (array.length > 0) {
        filteredChats = filteredChats.filter(filterFunc);
      }
    };

    // TODO: participantes y current user, filtrar por cual?
    filterByArray(
      employees,
      (chat) =>
        chat.participants
          ?.map((user) => user.userId)
          .some((id) => employees.includes(id)),
    );

    filterByArray(labels, (chat) => labels.includes(chat.label?.id ?? ""));

    filterByArray(status, (chat) => status.includes(chat.status));

    return filteredChats;
  }, [chats, employees, labels, status, search]);
};
