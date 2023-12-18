"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const getAuthToken = async () => {
  const token = cookies().get("token")?.value ?? "";

  if (!token) {
    redirect("/login");
  }

  return token as unknown as Promise<string>;
};
