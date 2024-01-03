"use server";

import { type User, type ApiResponse } from "@/types/db";
import { getAuthToken } from "../utils";
import { revalidateTag } from "next/cache";

export const getUserById = async ({ userId }: { userId: string }) => {
  const token = await getAuthToken();

  const userRawResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      next: {
        tags: ["user-by-id"],
      },
    },
  );

  const userResponse: ApiResponse<User> = await userRawResponse.json();
  const user = userResponse.data;

  return user;
};

export const updateUser = async ({
  userId,
  user,
  business,
}: {
  userId: string;
  user: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
  };
  business?: {
    labels?: string[];
    businessId?: string;
    channels?: string[];
    roles?: string[];
  };
}) => {
  const token = await getAuthToken();

  const body = JSON.stringify(business ? { ...user, business } : { ...user });

  const userRawResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/user-auth/${userId}`,
    {
      method: "PUT",
      body,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );
  const userResponse: ApiResponse<User> = await userRawResponse.json();

  revalidateTag("business-by-admin-id");
  revalidateTag("user-by-id");

  return userResponse;
};
