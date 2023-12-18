import { Checkbox } from "@/_components/ui/checkbox";
import { type Label as LabelType } from "@/types/db";
import {
  cn,
  generateLabelBackgroundColor,
  generateLabelColor,
} from "@/lib/utils";
import { Label } from "@/_components/ui/label";
import React from "react";
import type * as CheckboxPrimitive from "@radix-ui/react-checkbox";

const LabelCheckbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & {
    label: LabelType;
  }
>(({ className, label, ...props }, ref) => {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-[8px] border p-2",
        className,
      )}
      style={{
        backgroundColor: generateLabelBackgroundColor(label.id, label.color),
        borderColor: generateLabelColor(label.color),
        color: generateLabelColor(label.color),
      }}
    >
      <Checkbox
        style={{
          borderColor: generateLabelColor(label.color),
        }}
        ref={ref}
        id={label.id}
        {...props}
      />
      <Label htmlFor={label.id}>{label.name}</Label>
    </div>
  );
});

LabelCheckbox.displayName = "LabelCheckbox";

export { LabelCheckbox };
