import type { Metadata } from "next";
import "../../styles/globals.css";
import { HeadingMedium } from "@/_components/ui/headings/headingMedium";
import { SettingsTabs } from "@/_components/client/settingsTabs/settingsTabs";
import { ArrowLeftIcon } from "@/icons";
import { GoBackButton } from "@/_components/ui/goBackButton/goBackButton";

export const metadata: Metadata = {
  title: "Fidooo Bot",
  description: "Created by Fidooo Engineering",
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-pale-gray">
      <main className="mx-auto max-w-screen-2xl">
        <nav className="flex items-end gap-24">
          <div className="flex h-[60px] w-[210px] items-center gap-2 bg-primary-purple">
            <GoBackButton className="bg-transparent text-white">
              <ArrowLeftIcon />
            </GoBackButton>
            <HeadingMedium className="text-white">Ajustes</HeadingMedium>
          </div>

          <SettingsTabs />
        </nav>

        <div className="flex min-h-[calc(100vh-60px)] flex-col justify-center px-28">
          {children}
        </div>
      </main>
    </div>
  );
}
