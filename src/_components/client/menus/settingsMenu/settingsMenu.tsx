"use client";

import { type RgbaColor, RgbaColorPicker } from "react-colorful";
import React, { type Dispatch, type SetStateAction, useState } from "react";
import { Button } from "@/_components/ui/button";
import { Dialog, DialogContent, DialogFooter } from "@/_components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/_components/ui/dropdown-menu";
import { HeadingLarge } from "@/_components/ui/headings/headingLarge";
import { SettingsIcon, AddIcon, DeleteIcon } from "@/icons";
import { generateLabelColor } from "@/lib/utils";
import { type Label } from "@/types/db";
import { useForm } from "react-hook-form";
import { EditIcon } from "lucide-react";
import { Input } from "@/_components/ui/input";
import Link from "next/link";
import * as api from "@/server/root";
import { type CreateLabelForm } from "./interface";
import { isColorEdited } from "./utils";

const SettingsMenu = ({ labels }: { labels: Label[] | undefined }) => {
  const [openEditLabelsDialog, setOpenEditLabelsDialog] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="text-f-black"
            aria-label="create new chat"
          >
            <SettingsIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-42">
          <DropdownMenuGroup className="grid gap-[5px]">
            <DropdownMenuItem
              className="text-base leading-5 text-primary-purple focus:text-primary-purple"
              onSelect={() => setOpenEditLabelsDialog(true)}
            >
              <span>Etiquetas</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-base leading-5 text-primary-purple focus:text-primary-purple">
              <span>Saludo</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-base leading-5 text-primary-purple focus:text-primary-purple">
              <Link href="/settings/team">Ajustes</Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditLabels
        open={openEditLabelsDialog}
        setOpen={setOpenEditLabelsDialog}
        labels={labels}
      />
    </>
  );
};

const EditLabels = ({
  open,
  setOpen,
  labels = [],
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  labels?: Label[] | undefined;
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px] md:min-w-[510px]">
        <div className="grid gap-8 py-4">
          <div className="grid gap-4">
            <HeadingLarge>Editar etiquetas</HeadingLarge>
          </div>
        </div>

        <div>
          <div className="grid gap-3">
            {labels?.map((label, index) => (
              <React.Fragment key={label.id}>
                <Label label={label} />
                {labels.length - 1 !== index && (
                  <div className="h-[1px] bg-light-gray"></div>
                )}
              </React.Fragment>
            ))}

            <AddLabel />
          </div>

          <DialogFooter className="pt-3">
            <div className="grid w-full gap-[10px]">
              <Button type="submit" className="grow">
                Guardar cambios
              </Button>
              <Button type="button" variant="outline" className="grow">
                Cancelar
              </Button>
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Label = ({ label }: { label: Label }) => {
  const { register, watch } = useForm<CreateLabelForm>();
  const [editMode, setEditMode] = useState(false);
  const [color, setColor] = useState<RgbaColor | undefined>(label.color);

  const labelName = watch("name", label.name);

  const handleEditLabel = async (label: Label) => {
    if (!editMode) {
      return setEditMode(true);
    }

    if (label.name === labelName || !isColorEdited(label.color, color!)) {
      return setEditMode(false);
    }

    if (!color) {
      return;
    }

    await api.label.updateLabel({
      id: label.id,
      name: labelName,
      color: color,
    });
    setEditMode(false);

    return;
  };

  const handleDeleteLabel = async (label: Label) => {
    await api.label.deleteLabel({
      id: label.id,
      name: label.name,
      color: label.color,
    });
  };

  return (
    <form key={label.id} className="flex items-center gap-2">
      {editMode ? (
        <ColorPickerMenu color={color} setColor={setColor} />
      ) : (
        <div
          style={{
            backgroundColor: generateLabelColor(label.color),
          }}
          className="h-6 w-6 shrink-0 rounded-sm"
        />
      )}

      {editMode ? (
        <Input
          placeholder="nueva etiqueta"
          {...register("name")}
          defaultValue={label.name}
          className="border-none bg-secondary-purple"
        />
      ) : (
        <p className="leading-5">{label.name}</p>
      )}

      <div className="ml-auto flex items-center gap-1">
        <Button
          className="p-2 hover:bg-transparent"
          variant="ghost"
          type="button"
          onClick={() => handleEditLabel(label)}
        >
          <EditIcon />
        </Button>
        <Button
          className="p-2 hover:bg-transparent"
          variant="ghost"
          type="button"
          onClick={() => handleDeleteLabel(label)}
        >
          <DeleteIcon />
        </Button>
      </div>
    </form>
  );
};

const AddLabel = () => {
  const { register, handleSubmit, reset } = useForm<CreateLabelForm>();
  const [color, setColor] = useState<RgbaColor>();

  const handleCreateLabel = async (data: CreateLabelForm) => {
    if (!color) {
      return;
    }

    await api.label.createLabel({
      color,
      name: data.name,
    });
    reset();
  };

  return (
    <form
      className="flex items-center gap-2 pt-3"
      onSubmit={handleSubmit(handleCreateLabel)}
    >
      <ColorPickerMenu color={color} setColor={setColor} />

      <Input
        placeholder="nueva etiqueta"
        {...register("name")}
        className=" border-none bg-secondary-purple"
      />

      <Button
        className="ml-auto p-0 hover:bg-transparent"
        variant="ghost"
        type="submit"
      >
        <AddIcon />
      </Button>
    </form>
  );
};

const ColorPickerMenu = ({
  color,
  setColor,
}: {
  color: RgbaColor | undefined;
  setColor: Dispatch<SetStateAction<RgbaColor | undefined>>;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="p-0 text-f-black hover:bg-transparent"
          aria-label="create new chat"
          type="button"
        >
          <div
            style={{
              backgroundColor: color ? generateLabelColor(color) : "white",
            }}
            className={`h-6 w-6 rounded-sm border-mid-gray ${
              color ? "border-none" : "border"
            }`}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="overflow-visible p-0">
        <RgbaColorPicker color={color} onChange={setColor} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { SettingsMenu };
