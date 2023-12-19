import "@/styles/globals.css";

import { Roboto } from "next/font/google";
import { Toaster } from "@/_components/ui/toaster";
import { TanstackProvider } from "@/providers/tanstackProvider";

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700", "900"],
  subsets: ["latin"],
});

export const metadata = {
  title: "Fidooo Bot",
  description: "Created by Fidooo Engineering",
  icons: [{ rel: "icon", url: "/fidooo-logo.svg" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`font-sans ${roboto.className}`}>
        <div className="bg-primary-purple-variant text-f-black">
          <div className="mx-auto max-w-screen-2xl">
            <TanstackProvider>{children}</TanstackProvider>
          </div>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
