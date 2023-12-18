import { type ApiResponse, type User } from "@/types/db";
import { getAuthToken } from "../utils";
import { productionUrl } from "@/lib/utils";

export const sendMessage = async ({
  to,
  message,
}: {
  // eslint-disable-next-line
  message: any;
  to: string;
}) => {
  const token = await getAuthToken();

  const body = JSON.stringify({
    to,
    ...message,
  });

  const rawResponse = await fetch(
    process.env.NODE_ENV === "production"
      ? `${productionUrl}/api/v1/business/w/messenger`
      : "http://localhost:3000/api/v1/business/w/messenger",
    {
      method: "POST",
      body,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "channel-id": "108632911866758",
      },
    },
  );

  const response: ApiResponse<User> = await rawResponse.json();
  return response;
};

export const uploadMedia = async ({ file }: { file: File }) => {
  try {
    const token = await getAuthToken();

    const formData = new FormData();
    formData.append("files", file);

    const rawResponse = await fetch(
      process.env.NODE_ENV === "production"
        ? `${productionUrl}/api/v1/business/w/messenger/media`
        : "http://localhost:3000/api/v1/business/w/messenger/media",
      {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const response: ApiResponse<{ id: string; type: string; url: string }[]> =
      await rawResponse.json();

    if (!rawResponse.ok) {
      throw new Error(response.message);
    }

    return response;
  } catch (error) {
    console.log(error);
  }
};

export const sendTemplateMessage = async ({
  template,
  to,
}: {
  // eslint-disable-next-line
  template: any;
  to: string;
}) => {
  const token = await getAuthToken();

  const body = JSON.stringify({
    to,
    type: "template",
    template,
  });

  const rawResponse = await fetch(
    process.env.NODE_ENV === "production"
      ? `${productionUrl}/api/v1/business/w/messenger`
      : "http://localhost:3000/api/v1/business/w/messenger",
    {
      method: "POST",
      body,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "channel-id": "108632911866758",
      },
    },
  );

  const response: ApiResponse<User> = await rawResponse.json();
  return response;
};
