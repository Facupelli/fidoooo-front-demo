import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

interface HeadingLargeProps {
  children: ReactNode;
  className?: string;
}

const HeadingLarge = ({ children, className }: HeadingLargeProps) => {
  return (
    <h1
      className={cn(
        "heig text-[24px] font-semibold leading-8 text-f-black",
        className,
      )}
    >
      {children}
    </h1>
  );
};

export { HeadingLarge };
