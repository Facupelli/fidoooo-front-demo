import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

interface HeadingMediumProps {
  children: ReactNode;
  className?: string;
}

const HeadingMedium = ({ children, className }: HeadingMediumProps) => {
  return (
    <h1
      className={cn(
        "heig text-[20px] font-medium leading-7 text-f-black",
        className,
      )}
    >
      {children}
    </h1>
  );
};

export { HeadingMedium };
