"use client";

import { type Dispatch, type SetStateAction } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from "@/_components/ui/dialog";
import { Button } from "@/_components/ui/button";

const SendWaMessageDialog = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px] md:min-w-fit">
        <DialogHeader className="font-semibold text-red-600">
          Error: no se puede enviar un mensaje
        </DialogHeader>

        <div className="grid gap-1">
          <p>Pasaron más de 24 horas desde el último mensaje del cliente.</p>
          <p>
            Para iniciar la conversación nuevamente envia un Template Message
          </p>
        </div>

        <DialogFooter>
          <Button onClick={() => setOpen(false)}>Enviar un template</Button>
          <Button onClick={() => setOpen(false)}>Aceptar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export { SendWaMessageDialog };
