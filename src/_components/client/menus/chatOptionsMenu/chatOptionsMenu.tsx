"use client";

import { Controller, useForm } from "react-hook-form";
import { type Dispatch, type SetStateAction, useState } from "react";
import { Button } from "@/_components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/_components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/_components/ui/alert-dialog";
import { HeadingLarge } from "@/_components/ui/headings/headingLarge";
import { Dialog, DialogContent, DialogFooter } from "@/_components/ui/dialog";
import { OptionsIcon } from "@/icons";
import {
  type ChatCurrentUser,
  type BusinessEmployee,
  type Label as LabelType,
  type Chat,
  type Session,
} from "@/types/db";
import { Input } from "@/_components/ui/input";
import { Label } from "@/_components/ui/label";
import { useInvalidateSelectedChat } from "@/hooks/useInvalidateSelectedChat";
import { useMutation } from "@tanstack/react-query";
import * as api from "@/server/root";
import {
  type AssignLabelToChatForm,
  type AssignUserToChatForm,
} from "./interfaces";
import { LabelCheckbox } from "@/_components/ui/labelCheckbox/labelCheckbox";

const ChatOptionsMenu = ({
  labels,
  employees,
  chat,
  chatCurrentUser,
  session,
}: {
  chat: Chat;
  labels: LabelType[] | undefined;
  employees: BusinessEmployee[] | undefined;
  chatCurrentUser: ChatCurrentUser | undefined;
  session: Session | null | undefined;
}) => {
  const [openAssignDialog, setOpenAssignDialog] = useState(false);
  const [openAssignLabelDialog, setOpenAssignLabelDialog] = useState(false);
  const [openResetAlertDialog, setOpenResetAlertDialog] = useState(false);

  const sendBotFirstNode = useMutation({
    mutationFn: api.chat.sendBotFirstNode,
  });

  const handleSendBotFirstNode = () => {
    if (!session) {
      return;
    }

    sendBotFirstNode.mutate({
      chatId: chat.id,
      to: chat.to,
      sessionId: session.id,
      botId: session.botId,
    });
  };

  const assignableEmployees = employees?.filter(
    (employee) => employee.userId !== chatCurrentUser?.employeeId,
  );

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="p-0 hover:bg-transparent"
            aria-label="show admin options"
          >
            <OptionsIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-36">
          <DropdownMenuGroup className="grid gap-[5px]">
            <DropdownMenuItem
              className="text-base leading-5 text-primary-purple focus:text-primary-purple"
              onSelect={() => setOpenAssignDialog(true)}
            >
              <span>Reasignar</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-base leading-5 text-primary-purple focus:text-primary-purple"
              onSelect={() => setOpenAssignLabelDialog(true)}
            >
              <span>Reetiquetar</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-base leading-5 text-primary-purple focus:text-primary-purple"
              onSelect={() => setOpenResetAlertDialog(true)}
            >
              <span>Reiniciar chat</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <AssignChat
        open={openAssignDialog}
        setOpen={setOpenAssignDialog}
        employees={assignableEmployees}
        chatId={chat.id}
      />
      <AssignLabel
        open={openAssignLabelDialog}
        setOpen={setOpenAssignLabelDialog}
        labels={labels}
        chatId={chat.id}
      />
      <ResetChatAlertDialog
        open={openResetAlertDialog}
        setOpen={setOpenResetAlertDialog}
        handleSendBotFirstNode={handleSendBotFirstNode}
      />
    </>
  );
};

const AssignChat = ({
  employees,
  open,
  setOpen,
  chatId,
}: {
  employees: BusinessEmployee[] | undefined;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  chatId: string;
}) => {
  const { register, handleSubmit } = useForm<AssignUserToChatForm>();

  const assignChatToUser = useMutation({
    mutationFn: api.chat.assignUserToChat,
  });

  const { invalidateChat } = useInvalidateSelectedChat(chatId);

  const handleAssignUserToChat = (data: AssignUserToChatForm) => {
    assignChatToUser.mutate(
      {
        conversationId: chatId,
        userId: data.userId,
      },
      {
        async onSuccess() {
          await invalidateChat();
          setOpen(false);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px] md:min-w-[510px]">
        <form onSubmit={handleSubmit(handleAssignUserToChat)}>
          <div className="grid gap-8">
            <div className="grid gap-4">
              <HeadingLarge>¿A quién reasignarás este chat?</HeadingLarge>
              <div className="grid justify-center gap-[15px]">
                {employees ? (
                  employees.length > 0 &&
                  employees.map((employee) => (
                    <div
                      key={employee.userId}
                      className="flex items-center gap-2"
                    >
                      <Input
                        id={employee.userId}
                        type="radio"
                        className="h-[20px] w-[20px]"
                        value={employee.userId}
                        {...register("userId")}
                      />
                      <Label
                        htmlFor={employee.userId}
                        className="text-base font-normal leading-5"
                      >
                        {employee.userName}
                      </Label>
                    </div>
                  ))
                ) : (
                  <div>No tienes colaboradores. Agrega uno en ajustes!</div>
                )}
              </div>
            </div>
          </div>
          <DialogFooter className="pt-[30px]">
            <div className="flex w-full justify-between gap-8">
              <Button
                type="button"
                variant="outline"
                className="grow"
                onClick={() => setOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" className="grow">
                Reasignar
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const AssignLabel = ({
  open,
  setOpen,
  labels,
  chatId,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  labels: LabelType[] | undefined;
  chatId: string;
}) => {
  const { control, handleSubmit } = useForm<AssignLabelToChatForm>();

  const updateChatLabel = useMutation({
    mutationFn: api.chat.updateChatLabel,
  });
  const { invalidateChat } = useInvalidateSelectedChat(chatId);

  const handleAssignLabelToChat = (data: AssignLabelToChatForm) => {
    const selectedLabel = labels?.find((label) => label.id === data.labelId);

    if (!selectedLabel) {
      return;
    }

    updateChatLabel.mutate(
      {
        labelId: data.labelId,
        conversationId: chatId,
        color: selectedLabel.color,
      },
      {
        async onSuccess() {
          await invalidateChat();
          setOpen(false);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px] md:min-w-[520px]">
        <form onSubmit={handleSubmit(handleAssignLabelToChat)}>
          <div className="grid gap-8">
            <div className="grid gap-4">
              <HeadingLarge>Elige una nueva etiqueta</HeadingLarge>

              <div className="flex flex-wrap gap-2">
                {labels ? (
                  labels.length > 0 &&
                  labels.map((label) => (
                    <Controller
                      key={label.id}
                      name="labelId"
                      control={control}
                      render={({ field }) => (
                        <LabelCheckbox
                          key={label.id}
                          label={label}
                          checked={field.value?.includes(label.id)}
                          onCheckedChange={(checked) => {
                            return checked
                              ? field.onChange(label.id)
                              : field.onChange("");
                          }}
                        />
                      )}
                    />
                  ))
                ) : (
                  <div>No tienes colaboradores. Agrega uno en ajustes!</div>
                )}
              </div>
            </div>
          </div>
          <DialogFooter className="pt-[30px]">
            <div className="flex w-full justify-between gap-8">
              <Button type="button" variant="outline" className="grow">
                Cancelar
              </Button>
              <Button type="submit" className="grow">
                Guardar
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const ResetChatAlertDialog = ({
  open,
  setOpen,
  handleSendBotFirstNode,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  handleSendBotFirstNode: () => void;
}) => {
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="gap-7">
        <AlertDialogHeader>
          <HeadingLarge className="text-center">
            ¿Estas seguro que desea reiniciar el chat?
          </HeadingLarge>
          <AlertDialogDescription className="mt-[15px] text-center">
            Al reiniciarlo, el cliente podrá ver nuevamente el menú inicial de
            opciones. No se borrará ningún mensajes existente del chat.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex gap-8">
          <AlertDialogCancel className="grow">Cancelar</AlertDialogCancel>
          <AlertDialogAction className="grow" onClick={handleSendBotFirstNode}>
            Reiniciar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export { ChatOptionsMenu };
