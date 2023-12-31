import * as React from "react";

import { cn } from "@/lib/utils";

// eslint-disable-next-line
export interface ToggleProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Toggle = React.forwardRef<HTMLInputElement, ToggleProps>(
  ({ className, ...props }, ref) => {
    return (
      <label className="relative grid cursor-pointer">
        <input
          className={cn("peer absolute left-0 top-0 z-10 opacity-0", className)}
          ref={ref}
          {...props}
          type="checkbox"
        />
        <span className="relative inline-block h-[34px] w-[60px] rounded-3xl bg-secondary-purple p-[2px] before:absolute before:left-[3px] before:top-[3px] before:h-[28px] before:w-[28px] before:rounded-full before:bg-[#FFFFFF] before:transition-all before:duration-200 before:ease-in-out before:content-[''] peer-checked:bg-primary-purple peer-checked:before:left-[28px]"></span>
      </label>
    );
  },
);

Toggle.displayName = "Toggle";

export { Toggle };
