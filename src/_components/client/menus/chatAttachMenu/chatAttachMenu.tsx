import { type SendTextMessageForm } from "@/_components/client/dashboard/interfaces";
import { Button } from "@/_components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/_components/ui/dropdown-menu";
import { AttachIcon, ImageIcon, LocationIcon, TextIcon } from "@/icons";
import { type Dispatch, type SetStateAction } from "react";
import { Controller, type Control } from "react-hook-form";

const ChatAttachMenu = ({
  isMenuDisabled,
  control,
  open,
  setOpen,
}: {
  isMenuDisabled: boolean;
  control: Control<SendTextMessageForm>;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="p-0 hover:bg-transparent"
          disabled={isMenuDisabled}
          type="button"
          onClick={() => {
            setOpen(true);
          }}
        >
          <AttachIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-42" align="start">
        <DropdownMenuGroup className="grid gap-[5px]">
          <DropdownMenuItem className="flex items-center gap-2 text-base leading-5 text-primary-purple focus:text-primary-purple">
            <ImageIcon />
            <label htmlFor="image" onClick={(e) => e.stopPropagation()}>
              Imagen
            </label>
            <Controller
              name="image"
              control={control}
              render={({ field: { onChange, ref } }) => (
                <input
                  id="image"
                  type="file"
                  onChange={(event) => {
                    onChange(event.target.files?.[0]);
                  }}
                  ref={ref}
                  onClick={(e) => e.stopPropagation()}
                  className="hidden"
                />
              )}
            />
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center gap-2 text-base leading-5 text-primary-purple focus:text-primary-purple">
            <TextIcon />
            <label htmlFor="document" onClick={(e) => e.stopPropagation()}>
              Archivo
            </label>
            <Controller
              name="document"
              control={control}
              render={({ field: { onChange, ref } }) => (
                <input
                  id="document"
                  type="file"
                  onChange={(event) => {
                    onChange(event.target.files?.[0]);
                  }}
                  ref={ref}
                  onClick={(e) => e.stopPropagation()}
                  className="hidden"
                />
              )}
            />
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center gap-2 text-base leading-5 text-primary-purple focus:text-primary-purple">
            <LocationIcon />
            <span>Ubicacion</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { ChatAttachMenu };
