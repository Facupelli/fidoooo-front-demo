import { generateLabelColor } from "@/lib/utils";
import { type Label } from "@/types/db";
import { type ReactNode } from "react";

const ChatTitle = ({
  label,
  children,
}: {
  label: Label | undefined;
  children: ReactNode;
}) => {
  return (
    <div className="flex items-center gap-3">
      <p className="font-semibold leading-5">{children}</p>
      {label && (
        <div
          className="h-3 w-3 rounded-full"
          style={{
            backgroundColor: generateLabelColor(label.color),
          }}
        />
      )}
    </div>
  );
};

export { ChatTitle };
