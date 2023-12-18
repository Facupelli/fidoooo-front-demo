"use server";

import { redirect } from "next/navigation";
import { type ApiResponse, type User } from "@/types/db";
import { getAuthToken } from "@/server/utils";
import { revalidateTag } from "next/cache";
import { developUrl, productionUrl } from "@/lib/utils";

export const createCollaboratorUser = async (newUser: FormData) => {
  const token = await getAuthToken();

  const res = await fetch(
    process.env.NODE_ENV === "production"
      ? `${productionUrl}/api/v1/business/collaborator`
      : `${developUrl}/api/v1/business/collaborator`,
    {
      method: "POST",
      body: newUser,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const resData: ApiResponse<User> = await res.json();

  if (!resData.success) {
    throw new Error();
  }

  revalidateTag("business-by-id");
  redirect("/settings/team");
};

export const registerAsCollaborator = async (newUser: FormData) => {
  const res = await fetch(
    process.env.NODE_ENV === "production"
      ? `${productionUrl}/api/v1/user-auth/collaborator`
      : `${developUrl}/api/v1/user-auth/collaborator`,
    {
      method: "POST",
      body: newUser,
    },
  );

  const resData: ApiResponse<User> = await res.json();

  if (!resData.success) {
    throw new Error();
  }

  redirect("/login");
};
