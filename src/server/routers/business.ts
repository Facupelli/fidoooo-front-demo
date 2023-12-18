"use server";

import { type ApiResponse, type Business } from "@/types/db";
import { type WhatsAppMessageTemplate } from "@/types/whatsapp";
import { getAuthToken, productionUrl } from "../utils";
import { revalidateTag } from "next/cache";

export const getBusinessById = async ({
  businessId,
}: {
  businessId: string | undefined;
}) => {
  const token = await getAuthToken();

  const rawResponse = await fetch(
    process.env.NODE_ENV === "production"
      ? `${productionUrl}/api/v1/business/by-id/${businessId}`
      : `http://localhost:3000/api/v1/business/by-id/${businessId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      next: {
        tags: ["business-by-id"],
      },
    },
  );

  const response: ApiResponse<Business> = await rawResponse.json();
  const business = response.data;

  return business;
};

export const getMessageTemplates = async ({
  templateCategory,
}: {
  templateCategory: string;
}) => {
  const token = await getAuthToken();

  const rawResponse = await fetch(
    process.env.NODE_ENV === "production"
      ? `${productionUrl}/api/v1/w/messenger/templates?category=${templateCategory}`
      : `http://localhost:3000/api/v1/business/w/messenger/templates?category=${templateCategory}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const response: ApiResponse<WhatsAppMessageTemplate[]> =
    await rawResponse.json();
  const messageTempaltes = response.data;

  return messageTempaltes;
};

export const sendCollaboratorInvitation = async ({
  senderId,
  receiverEmail,
  labels,
}: {
  senderId: string;
  receiverEmail: string;
  labels: string[];
}) => {
  const token = await getAuthToken();

  const body = JSON.stringify({ senderId, receiverEmail, labels });

  const rawResponse = await fetch(
    process.env.NODE_ENV === "production"
      ? `${productionUrl}/api/v1/business/invitation`
      : `http://localhost:3000/api/v1/business/invitation`,
    {
      method: "POST",
      body,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );

  const response: ApiResponse<{
    receiverId: string;
    senderId: string;
    labels: string[];
  }> = await rawResponse.json();

  return response;
};

export const assignUserToBusiness = async ({
  businessId,
  receiverEmail,
  labels,
}: {
  businessId: string;
  receiverEmail: string;
  labels: string[];
}) => {
  const token = await getAuthToken();

  const body = JSON.stringify({ businessId, receiverEmail, labels });

  const rawResponse = await fetch(
    process.env.NODE_ENV === "production"
      ? `${productionUrl}/api/v1/business/assing-user-to-business`
      : `http://localhost:3000/api/v1/business/assing-user-to-business`,
    {
      method: "POST",
      body,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );

  const response: ApiResponse<{
    receiverId: string;
    senderId: string;
    labels: string[];
  }> = await rawResponse.json();

  revalidateTag("business-by-id");
  return response;
};
