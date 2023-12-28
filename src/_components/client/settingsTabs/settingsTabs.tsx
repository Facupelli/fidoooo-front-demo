"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const settingsTabs = [
  {
    name: "Perfil de empresa",
    path: "/settings/business-profile",
  },
  {
    name: "Equipo",
    path: "/settings/team",
  },
  {
    name: "Personaliza FidoBot",
    path: "/settings/fidobot",
  },
  {
    name: "Canales",
    path: "/settings/channels",
  },
];

const SettingsTabs = () => {
  const pathname = usePathname();

  return (
    <ul className="flex items-center gap-[10px]">
      {settingsTabs.map((tab) => (
        <li
          key={tab.name}
          className={`w-[215px] py-3 font-semibold leading-5  ${
            pathname?.includes(tab.path ?? "")
              ? "border-b-[5px] border-primary-purple text-primary-purple"
              : "border-none text-mid-gray"
          }`}
        >
          <Link href={tab.path}>{tab.name}</Link>
        </li>
      ))}
    </ul>
  );
};

export { SettingsTabs };
