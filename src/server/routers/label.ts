"use server";

import { type LabelRGBAColor, type ApiResponse, type Label } from "@/types/db";
import { getAuthToken, productionUrl } from "../utils";
import { revalidateTag } from "next/cache";

export const createLabel = async ({
  name,
  color,
}: {
  name: string;
  color: LabelRGBAColor;
}) => {
  const token = await getAuthToken();

  const body = JSON.stringify({ name, color });

  const labelRawResponse = await fetch(
    process.env.NODE_ENV === "production"
      ? `${productionUrl}/api/v1/business/label`
      : "http://localhost:3000/api/v1/business/label",
    {
      method: "POST",
      body,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );
  const labelResponse: ApiResponse<Label> = await labelRawResponse.json();
  const label = labelResponse.data;

  revalidateTag("business-by-id");
  return label;
};

export const updateLabel = async ({
  id,
  color,
  name,
}: {
  id: string;
  name: string;
  color: LabelRGBAColor;
}) => {
  const token = await getAuthToken();

  const body = JSON.stringify({ id, name, color });

  const labelRawResponse = await fetch(
    process.env.NODE_ENV === "production"
      ? `${productionUrl}/api/v1/business/label`
      : "http://localhost:3000/api/v1/business/label",
    {
      method: "PATCH",
      body,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );
  const labelResponse: ApiResponse<Label> = await labelRawResponse.json();
  const label = labelResponse.data;

  revalidateTag("business-by-id");
  return label;
};

export const deleteLabel = async ({
  id,
  name,
  color,
}: {
  id: string;
  name: string;
  color: LabelRGBAColor;
}) => {
  const token = await getAuthToken();

  const body = JSON.stringify({ id, name, color });

  const labelRawResponse = await fetch(
    process.env.NODE_ENV === "production"
      ? `${productionUrl}/api/v1/business/label`
      : "http://localhost:3000/api/v1/business/label",
    {
      method: "DELETE",
      body,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );
  const labelResponse: ApiResponse<Label> = await labelRawResponse.json();
  const label = labelResponse.data;

  revalidateTag("business-by-id");
  return label;
};
