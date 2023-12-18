import * as React from "react";
import { Label } from "./label";
import { Input } from "./input";
import { cn } from "@/lib/utils";

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  ({ id, label, error, className, ...props }, ref) => {
    return (
      <div>
        <div className={cn("relative", className)}>
          <Input id={id} ref={ref} {...props} className="fido_input" />
          <Label htmlFor={id} className="fido_label">
            {label}
          </Label>
        </div>
        {error && (
          <p className="pt-1 text-xs font-normal leading-4 text-error">
            {error}
          </p>
        )}
      </div>
    );
  },
);

TextField.displayName = "TextField";

export { TextField };
