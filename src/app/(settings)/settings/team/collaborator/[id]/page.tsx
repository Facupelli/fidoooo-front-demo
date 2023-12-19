import { EditCollaboratorForm } from "@/_components/client/editCollaboratorForm/editCollaboratorForm";
import { HeadingMedium } from "@/_components/ui/headings/headingMedium";
import { HeadingSmall } from "@/_components/ui/headings/headingSmall";
import { adminAuth } from "@/lib/firebase-admin-config";
import * as api from "@/server/root";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function EditCollaboratorPage({
  params,
}: {
  params: { id: string };
}) {
  const token = cookies().get("token")?.value ?? "";

  if (!token) {
    redirect("/login");
  }

  const { uid } = await adminAuth.verifyIdToken(token);

  const collaboratorData = await api.user.getUserById({ userId: params.id });
  const businessData = api.business.getBusinessByAdminId({
    adminId: uid,
  });

  const [collaborator, business] = await Promise.all([
    collaboratorData,
    businessData,
  ]);

  return (
    <div className="grid">
      <HeadingMedium className="pb-12 text-primary-purple">
        Editando a {collaborator.firstName} {collaborator.lastName}
      </HeadingMedium>

      <div className="grid grid-cols-3 pb-6">
        <HeadingSmall className="pr-8 text-primary-purple">
          Datos del colaborador
        </HeadingSmall>
        <HeadingSmall className="px-8 text-primary-purple">
          Permisos generales
        </HeadingSmall>

        {/* TODO: Que hacer con los permisos se definira mas adelante */}
        {/* <HeadingSmall className="pl-5 text-primary-purple">
          Permisos de etiquetas
        </HeadingSmall> */}
      </div>

      <EditCollaboratorForm
        businessLabels={business?.labels}
        collaborator={collaborator}
      />
    </div>
  );
}
