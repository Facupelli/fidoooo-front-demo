import * as api from "@/server/root";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminAuth } from "@/lib/firebase-admin-config";
import { HeadingMedium } from "@/_components/ui/headings/headingMedium";
import Script from "next/script";
import { ConnectWithFacebookButton } from "@/_components/client/connectWithFacebookButton/connectWithFacebookButton";

export default function BusinessProfileSettingsPage() {
  const token = cookies().get("token")?.value ?? "";

  if (!token) {
    redirect("/login");
  }

  return (
    <>
      <Script async defer src="https://connect.facebook.net/en_US/sdk.js" />

      <div className="flex min-h-[calc(100vh-60px)] flex-col p-28">
        <section className="grid grid-cols-3 gap-10">
          <div className="grid gap-6">
            <HeadingMedium>Perfil de la empresa</HeadingMedium>

            <div>
              <ConnectWithFacebookButton />
            </div>
          </div>

          <div>
            <HeadingMedium>Identidad de la empresa</HeadingMedium>
          </div>

          <div>
            <HeadingMedium>Información de empresa</HeadingMedium>
          </div>
        </section>
      </div>
    </>
  );
}
