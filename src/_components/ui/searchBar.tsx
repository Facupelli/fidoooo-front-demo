import React from "react";
import { SearchIcon } from "@/icons";
import { Input } from "./input";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const SearchBar = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className="relative" ref={ref}>
        <Input
          {...props}
          type="search"
          placeholder="Buscar"
          className={cn(
            "h-[56px] rounded-[15px] border-primary-purple p-5 text-f-black",
            className,
          )}
        />
        <div className="absolute right-[20px] top-1/2 -translate-y-1/2">
          <SearchIcon />
        </div>
      </div>
    );
  },
);

SearchBar.displayName = "SearchBar";

export { SearchBar };
