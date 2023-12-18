"use client";

import { Button } from "@/_components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/_components/ui/dropdown-menu";
import { type BusinessChannel } from "@/types/db";
import { type Dispatch, type SetStateAction } from "react";
import { getChannelIcon } from "./utils";
import { useBoundStore } from "@/zustand/store";

const SelectChannelMenu = ({
  channels,
  setSelectedChannel,
  selectedChannel,
}: {
  channels: BusinessChannel[] | undefined;
  setSelectedChannel: Dispatch<SetStateAction<BusinessChannel | null>>;
  selectedChannel: BusinessChannel | null;
}) => {
  const setSelectedChat = useBoundStore((state) => state.setSelectedChat);

  const channelsWithIcons = channels?.map((channel) => ({
    ...channel,
    icon: getChannelIcon(channel),
  }));

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="secondary"
            className="h-[56px] w-[56px] p-0"
            aria-label="select business channel"
          >
            {getChannelIcon(selectedChannel)}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-fit" align="center">
          <DropdownMenuGroup className="grid gap-[5px]">
            {channelsWithIcons?.map((channel) => (
              <DropdownMenuItem
                onClick={() => {
                  setSelectedChat(null);
                  setSelectedChannel(channel);
                }}
                key={channel.id}
                className="w-fit text-primary-purple focus:text-primary-purple"
              >
                {channel.icon}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export { SelectChannelMenu };
