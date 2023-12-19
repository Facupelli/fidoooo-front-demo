import type { Metadata } from "next";
import "../../styles/globals.css";

export const metadata: Metadata = {
  title: "Fidooo Bot",
  description: "Created by Fidooo Engineering",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-primary-purple-variant">
      <div className="mx-auto max-w-screen-xl">{children}</div>
    </div>
  );
}
