import { type User, type ApiResponse } from "@/types/db";
import { getAuthToken, productionUrl } from "../utils";

export const getUserById = async ({ userId }: { userId: string }) => {
  const token = await getAuthToken();

  const userRawResponse = await fetch(
    process.env.NODE_ENV === "production"
      ? `${productionUrl}/api/v1/user/${userId}`
      : `http://localhost:3000/api/v1/user/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
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
    process.env.NODE_ENV === "production"
      ? `${productionUrl}/api/v1/user-auth/${userId}`
      : `http://localhost:3000/api/v1/user-auth/${userId}`,
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
  const updatedUser = userResponse.data;

  return updatedUser;
};
