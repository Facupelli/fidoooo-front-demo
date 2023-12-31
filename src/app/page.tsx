import {
  Dashboard,
  LeftBarTopPanel,
} from "@/_components/client/dashboard/dashboard";
import { Button } from "@/_components/ui/button";
import { HeadingLarge } from "@/_components/ui/headings/headingLarge";
import { HeadingMedium } from "@/_components/ui/headings/headingMedium";
import { adminAuth } from "@/lib/firebase-admin-config";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import * as api from "@/server/root";
import { ChannelName } from "@/types/db";
import { type DecodedIdToken } from "firebase-admin/auth";

export default async function Home() {
  const token = cookies().get("token")?.value ?? "";

  if (!token) {
    redirect("/login");
  }

  let decodedToken: DecodedIdToken;

  try {
    decodedToken = await adminAuth.verifyIdToken(token);
  } catch (error) {
    redirect("/login");
  }

  const userData = api.user.getUserById({ userId: decodedToken.uid });
  const businessData = api.business.getBusinessByAdminId({
    adminId: decodedToken.uid,
  });

  const [user, business] = await Promise.all([userData, businessData]);

  const chats = await api.chat.getChatsByChannel({
    channelId: business.channels?.find(
      (channel) => channel.name === ChannelName.WHATSAPP,
    )?.id,
  });

  if (!user.business?.businessId) {
    return (
      <main className="bg-primary-foreground text-white">
        <div className="grid h-screen grid-cols-12">
          <section className="col-span-4 bg-[#FFFFFF] ">
            <LeftBarTopPanel userPicture={user.photoUrl} />
          </section>

          <section className="relative col-span-8 bg-pale-gray">
            <NoBusinessCollaborator />
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-primary-foreground text-white">
      <Dashboard
        serverBusiness={business}
        chats={chats}
        userPicture={user.photoUrl}
      />
    </main>
  );
}

const NoBusinessCollaborator = () => {
  return (
    <div className="grid h-full place-content-center justify-center gap-[76px]">
      <div className="grid gap-5">
        <HeadingLarge>
          No tienes chats porque no has sido invitado a ninguna empresa
        </HeadingLarge>
        <HeadingMedium>
          Pídele a tu empleador que te invite a colaborar en la empresa y
          regresa más tarde
        </HeadingMedium>
      </div>
      <div>
        <Button
        // onClick={() => router.push("/quiero-user-fido")}
        >
          Quiero usar Fido en mi negocio
        </Button>
      </div>
    </div>
  );
};
