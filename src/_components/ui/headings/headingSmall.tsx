import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

interface HeadingMediumProps {
  children: ReactNode;
  className?: string;
}

const HeadingSmall = ({ children, className }: HeadingMediumProps) => {
  return (
    <h1
      className={cn(
        "heig text-[16px] font-semibold leading-5 text-f-black",
        className,
      )}
    >
      {children}
    </h1>
  );
};

export { HeadingSmall };
