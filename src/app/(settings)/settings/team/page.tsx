import * as api from "@/server/root";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Checkbox } from "@/_components/ui/checkbox";
import { Label } from "@/_components/ui/label";
import { EmployeesTable } from "@/_components/client/employeesTable/employeesTable";
import { adminAuth } from "@/lib/firebase-admin-config";
import { LinkButton } from "@/_components/ui/linkButton";

export default async function TeamSettingsPage() {
  const token = cookies().get("token")?.value ?? "";

  if (!token) {
    redirect("/login");
  }
  const { uid } = await adminAuth.verifyIdToken(token);

  const business = await api.business.getBusinessByAdminId({
    adminId: uid,
  });

  return (
    <div className="flex min-h-[calc(100vh-60px)] flex-col justify-center px-28">
      <section className="grid gap-6">
        <EmployeesTable business={business} />

        <div className="flex items-center justify-between">
          <div className="flex gap-8">
            <LinkButton href="team/invite-collaborator">
              Invitar a un nuevo colaborador al equipo
            </LinkButton>

            <LinkButton
              href={`/register?businessId=${business.id}&businessAdminId=${business.admin.userId}`}
            >
              Crear cuenta a colaborador
            </LinkButton>
          </div>

          <div className="flex items-center gap-4">
            {business.employees !== undefined && (
              <>
                <Label htmlFor="" className="grow text-base">
                  Los colaboradores tienen acceso a todos los chats
                </Label>
                <Checkbox id="" />
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
