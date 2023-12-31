"use client";

import { useForm } from "react-hook-form";
import { Virtuoso, type VirtuosoHandle } from "react-virtuoso";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  useRef,
  type ChangeEvent,
  type Ref,
  useCallback,
  useState,
  useMemo,
  type Dispatch,
  type SetStateAction,
} from "react";
import { useBoundStore } from "@/zustand/store";
import {
  ConversationStatus,
  type Chat,
  type Session,
  type Business,
  type BusinessChannel,
} from "@/types/db";
import { MessageType, type Message } from "@/types/messages";
import { ChatTitle } from "../chat/chatTitle";
import { SearchBar } from "@/_components/ui/searchBar";
import { Button } from "@/_components/ui/button";
import { Input } from "@/_components/ui/input";
import { ChatStatusMenu } from "@/_components/client/menus/chatStatusMenu/chatStatusMenu";
import { Toggle } from "@/_components/ui/toggle";
import { ChatOptionsMenu } from "@/_components/client/menus/chatOptionsMenu/chatOptionsMenu";
import { ProfileMenu } from "@/_components/client/menus/profileMenu/profileMenu";
import { SettingsMenu } from "@/_components/client/menus/settingsMenu/settingsMenu";
import { SelectChannelMenu } from "@/_components/client/menus/selectChannelMenu/selectChannelMenu";
import { MessageComponent } from "../message/message";
import { FilterChatMenu } from "@/_components/client/menus/filterChatMenu/filterChatMenu";
import { ChatAttachMenu } from "@/_components/client/menus/chatAttachMenu/chatAttachMenu";
import { InitNewChatDialog } from "@/_components/client/initNewChatDialog/initNewChatDialog";
import { ChatsIcon, EmojiIcon, SendIcon } from "@/icons";
import * as api from "@/server/root";
import { useChatMessages } from "@/hooks/useChatMessages";
import { useChats } from "@/hooks/useChats";
import useDebounce from "@/hooks/useDebounce";
import usePrevious from "@/hooks/usePrevious";
import { useInvalidateSelectedChat } from "@/hooks/useInvalidateSelectedChat";
import { useFilteredChats } from "./useFilteredChats";
import { useSendMediaMessage } from "./useSendMediaMessage";
import {
  firestoreTimestampToDateString,
  formatChatPhoneNumber,
  generateTextFromLastMessage,
  hasAnyFilterActive,
} from "./utils";
import { type SendTextMessageForm, type ChatFilters } from "./interfaces";

const START_INDEX = 500;

const Dashboard = ({
  serverBusiness,
  chats,
  userPicture,
}: {
  serverBusiness: Business;
  chats: Chat[];
  userPicture: string;
}) => {
  const [selectedChannel, setSelectedChannel] =
    useState<BusinessChannel | null>(serverBusiness?.channels?.[0] ?? null);

  if (!serverBusiness) {
    return null;
  }

  return (
    <div className="grid h-screen grid-cols-12">
      <section className="col-span-4 bg-[#FFFFFF] ">
        <LeftBar
          business={serverBusiness}
          serverChats={chats}
          userPicture={userPicture}
          selectedChannel={selectedChannel}
          setSelectedChannel={setSelectedChannel}
        />
      </section>

      <section className="relative col-span-8 bg-pale-gray">
        <RightBar business={serverBusiness} />
      </section>
    </div>
  );
};

const LeftBar = ({
  userPicture,
  business,
  serverChats,
  selectedChannel,
  setSelectedChannel,
}: {
  userPicture: string;
  business: Business;
  serverChats: Chat[];
  selectedChannel: BusinessChannel | null;
  setSelectedChannel: Dispatch<SetStateAction<BusinessChannel | null>>;
}) => {
  const { register, watch, control } = useForm<ChatFilters>({
    defaultValues: {
      search: "",
      employees: [],
      labels: [],
      status: [],
    },
  });

  const { chats } = useChats({
    channelId: selectedChannel?.id,
    serverChats,
  });

  const filters = watch();
  const search = useDebounce(watch("search", ""), 500);
  filters.search = search;

  const filteredChats = useFilteredChats(chats, filters);

  return (
    <>
      <LeftBarTopPanel business={business} userPicture={userPicture} />

      <div className="flex items-center gap-[14px] px-5 py-4">
        <div className="grow">
          <SearchBar {...register("search")} />
        </div>

        <SelectChannelMenu
          channels={business.channels}
          setSelectedChannel={setSelectedChannel}
          selectedChannel={selectedChannel}
        />

        <FilterChatMenu business={business} control={control} />
      </div>

      <div className="px-5">
        <ChatList chats={filteredChats} filters={filters} />
      </div>
    </>
  );
};

const LeftBarTopPanel = ({
  business,
  userPicture,
}: {
  business?: Business;
  userPicture: string;
}) => {
  return (
    <div className="flex h-[60px] items-center justify-between bg-secondary-purple px-5">
      <ProfileMenu userPicture={userPicture} />
      <div>
        {business && <InitNewChatDialog />}
        <SettingsMenu labels={business?.labels} />
      </div>
    </div>
  );
};

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

const RightBar = ({ business }: { business: Business }) => {
  const selectedChat = useBoundStore((state) => state.selectedChat);

  const { messages, fetchPreviousPage } = useChatMessages({
    conversationId: selectedChat?.id,
    limit: 15,
  });
  const { data: session } = useQuery({
    queryKey: ["get-chat-session", selectedChat?.id],
    queryFn: () =>
      api.chat.getChatSession({ conversationId: selectedChat?.id }),
  });

  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const prevChatId = usePrevious(selectedChat?.id);

  const startReached = useCallback(() => {
    void fetchPreviousPage();
  }, [fetchPreviousPage]);

  const messagesWithAvatar = messages?.map((message, index) => {
    const nextMessage = messages[index + 1];
    if (!nextMessage || nextMessage.from.userId !== message.from.userId) {
      return { ...message, showAvatar: true };
    } else {
      return { ...message, showAvatar: false };
    }
  });

  return (
    <>
      <ChatTopBar
        selectedChat={selectedChat}
        session={session}
        business={business}
      />

      {prevChatId !== selectedChat?.id ? null : (
        <MessageList
          messages={messagesWithAvatar}
          business={business}
          virtuosoRef={virtuosoRef}
          startReached={startReached}
        />
      )}

      <ChatSendMessage session={session} selectedChat={selectedChat} />
    </>
  );
};

const ChatTopBar = ({
  selectedChat,
  session,
  business,
}: {
  selectedChat: Chat | null;
  session: Session | null | undefined;
  business: Business;
}) => {
  const queryClient = useQueryClient();
  const { invalidateChat } = useInvalidateSelectedChat(selectedChat?.id);

  const handleUpdateChatStatus = async (chatStatus: string) => {
    if (!selectedChat) {
      return;
    }

    const mutation = await api.chat.updateChatStatus({
      conversationId: selectedChat.id,
      chatStatus,
    });

    if (mutation.success) {
      await invalidateChat();
    }
  };

  const handleSetBotIsActive = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!selectedChat || !session) {
      console.error("No chat selected or no session");
      return;
    }

    const mutation = await api.chat.setBotIsActive({
      isActive: e.target.checked,
      conversationId: selectedChat.id,
      sessionId: session.id,
    });

    if (mutation.success) {
      await queryClient.invalidateQueries({
        queryKey: ["get-chat-session", selectedChat.id],
      });
    }
  };

  return (
    <div className="flex h-[60px] items-center bg-[#FFFFFF] px-6 text-f-black">
      {selectedChat && (
        <>
          <div className="flex items-center gap-4">
            <div className="relative h-10 w-10 rounded-full bg-blue-300">
              {/* <Image
                src={user.photoUrl}
                alt="profile picture"
                fill
                className="rounded-full"
              /> */}
            </div>

            <div>
              <ChatTitle label={selectedChat.label}>
                {selectedChat.customer.nickname
                  ? selectedChat.customer.nickname
                  : formatChatPhoneNumber(selectedChat.to)}
              </ChatTitle>

              <p className="leading-5">
                {selectedChat.currentUser
                  ? `Asignado a ${selectedChat.currentUser.name}`
                  : "Sin asignar"}
              </p>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <div className="flex items-center gap-1">
              <ChatStatusMenu
                chatStatus={selectedChat.status}
                handleUpdateChatStatus={handleUpdateChatStatus}
              />
            </div>
            <div className="flex items-center gap-1">
              <p>Bot</p>
              <Toggle
                checked={session?.isBotActive ?? false}
                onChange={(e) => handleSetBotIsActive(e)}
              />
            </div>
            <ChatOptionsMenu
              labels={business.labels}
              employees={business.employees}
              chat={selectedChat}
              chatCurrentUser={selectedChat.currentUser}
              session={session}
            />
          </div>
        </>
      )}
    </div>
  );
};

const MessageList = ({
  messages,
  business,
  virtuosoRef,
  startReached,
}: {
  messages: Message[] | undefined;
  business: Business;
  virtuosoRef: Ref<VirtuosoHandle>;
  startReached: () => void;
}) => {
  const [firstItemIndex, setFirstItemIndex] = useState(
    START_INDEX - (messages ? messages.length : 15),
  );

  const internalMessages = useMemo(() => {
    const nextFirstItemIndex = START_INDEX - (messages ? messages.length : 15);
    setFirstItemIndex(nextFirstItemIndex);
    return messages;
  }, [messages]);

  const itemContent = useCallback(
    (index: number, rowData: Message) => {
      return (
        <div className="px-4 py-1">
          <MessageComponent message={rowData} business={business} />
        </div>
      );
    },
    [business],
  );

  const followOutput = useCallback((isAtBottom: boolean) => {
    return isAtBottom ? "smooth" : false;
  }, []);

  return (
    internalMessages && (
      <div className="flex h-[calc(100vh_-_140px)] flex-col gap-2 bg-wp-chat-wallpaper">
        <Virtuoso
          ref={virtuosoRef}
          initialTopMostItemIndex={internalMessages?.length - 1}
          firstItemIndex={firstItemIndex}
          itemContent={itemContent}
          data={internalMessages}
          startReached={startReached}
          followOutput={followOutput}
          className="scrollbar flex flex-col gap-2 "
        />
      </div>
    )
  );
};

const ChatSendMessage = ({
  selectedChat,
  session,
}: {
  session: Session | null | undefined;
  selectedChat: Chat | null;
}) => {
  const [openMenu, setOpenMenu] = useState(false);
  const { register, handleSubmit, control, reset } =
    useForm<SendTextMessageForm>({
      shouldUnregister: false,
    });

  const sendMessage = useMutation({
    mutationFn: api.whatsapp.sendMessage,
  });
  const { handleSendDocumentMessage, handleSendImageMessage } =
    useSendMediaMessage(selectedChat?.id, selectedChat?.to);

  const handleSendWhatsapppTextMessage = async (data: SendTextMessageForm) => {
    if (!selectedChat) {
      return;
    }

    if (data.image) {
      await handleSendImageMessage(data.image);
    } else if (data.document) {
      await handleSendDocumentMessage(data.document);
    } else {
      sendMessage.mutate({
        message: { type: MessageType.TEXT, text: { body: data.text } },
        to: selectedChat.to,
      });
    }

    if (!sendMessage.error) {
      reset();
    }
  };

  const isButtonDisabled = () => {
    return (
      // eslint-disable-next-line
      session?.isBotActive ||
      selectedChat?.status === ConversationStatus.COMPLETED ||
      !selectedChat
    );
  };

  return (
    <form
      onSubmit={handleSubmit(handleSendWhatsapppTextMessage)}
      className="absolute bottom-0 right-0 z-10 flex h-[80px] w-full items-center gap-4 bg-pale-gray px-8"
    >
      <Button
        variant="ghost"
        className="p-0 hover:bg-transparent"
        disabled={isButtonDisabled()}
        type="button"
        aria-label="Select emoji button"
      >
        <EmojiIcon />
      </Button>

      <ChatAttachMenu
        isMenuDisabled={isButtonDisabled()}
        control={control}
        open={openMenu}
        setOpen={setOpenMenu}
      />

      <Input
        type="text"
        placeholder="Escribe tu mensaje aquí"
        disabled={isButtonDisabled()}
        {...register("text")}
      />
      <Button
        variant="ghost"
        className="p-0 hover:bg-transparent"
        disabled={isButtonDisabled()}
        type="submit"
        aria-label="Send message button"
      >
        <SendIcon />
      </Button>
    </form>
  );
};

export { Dashboard, LeftBarTopPanel, LeftBar, RightBar };
