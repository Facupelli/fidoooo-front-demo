import { Button } from "@/_components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/_components/ui/dropdown-menu";
import { CircleCheckIcon, SettingsIcon } from "@/icons";
import { ConversationStatus } from "@/types/db";
import { getChatStatusText } from "./utils";

const ChatStatusMenu = ({
  handleUpdateChatStatus,
  chatStatus,
}: {
  chatStatus: ConversationStatus;
  handleUpdateChatStatus: (chatStatus: string) => void;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-[5px]">
          <p>{getChatStatusText(chatStatus)}</p>

          <Button className="px-3">
            <ChatStatusIcon chatStatus={chatStatus} />
          </Button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-36">
        <DropdownMenuGroup className="grid gap-[5px] ">
          <DropdownMenuItem className="p-0 text-base leading-5 text-primary-purple focus:text-primary-purple">
            <Button
              variant="ghost"
              className="flex w-full items-center justify-start gap-2 px-[16px] py-[10px]"
              onClick={() =>
                handleUpdateChatStatus(ConversationStatus.COMPLETED)
              }
            >
              <CircleCheckIcon />
              <span>Finalizado</span>
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem className="p-0 text-base leading-5 text-primary-purple focus:text-primary-purple">
            <Button
              variant="ghost"
              className="flex w-full items-center justify-start gap-2 px-[16px] py-[10px]"
              onClick={() =>
                handleUpdateChatStatus(ConversationStatus.IN_PROGRESS)
              }
            >
              <SettingsIcon />
              <span>En curso</span>
            </Button>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const ChatStatusIcon = ({ chatStatus }: { chatStatus: ConversationStatus }) => {
  switch (chatStatus) {
    case ConversationStatus.COMPLETED:
      return <CircleCheckIcon />;
    case ConversationStatus.IN_PROGRESS:
      return <SettingsIcon />;
    default:
      return <div />;
  }
};

export { ChatStatusMenu };
