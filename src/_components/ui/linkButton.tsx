import Link from "next/link";
import { type ReactNode } from "react";

const LinkButton = ({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) => {
  return (
    <Link
      href={href}
      className="inline-flex h-10 items-center justify-center rounded-[15px] bg-primary-purple px-4 py-2 text-base font-normal leading-5 text-secondary-purple hover:shadow-button"
    >
      {children}
    </Link>
  );
};

export { LinkButton };
