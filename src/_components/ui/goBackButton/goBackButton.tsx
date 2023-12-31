"use client";

import { useRouter } from "next/navigation";
import { Button, type ButtonProps } from "@/_components/ui/button";

const GoBackButton = ({ children, ...props }: ButtonProps) => {
  const router = useRouter();

  return (
    <Button
      type="button"
      onClick={() => router.back()}
      {...props}
      className="hover:shadow-none"
    >
      {children}
    </Button>
  );
};

export { GoBackButton };
