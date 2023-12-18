import { type BusinessEmployee, type Business } from "@/types/db";
import { type Message } from "@/types/messages";
import dayjs from "dayjs";

export type ChatMessage = Message & {
  showAvatar?: boolean;
};

export const isMessageFromBusiness = (
  business: Business,
  message: ChatMessage,
) => {
  return (
    // eslint-disable-next-line
    business.bots?.includes(message.from.userId) ||
    business.employees
      ?.map((employee) => employee.userId)
      // eslint-disable-next-line
      .includes(message.from.userId) ||
    message.from.userId === business.admin.userId
  );
};

export const getUserImage = (business: Business, message: ChatMessage) => {
  if (!business.employees) {
    return;
  }

  const employees = business.employees
    ? [business.admin as BusinessEmployee, ...business.employees]
    : [business.admin as BusinessEmployee];

  const image = employees.find(
    (employee) => employee.userId === message.from.userId,
  )?.photoUrl;

  return image;
};

export const timestampToHoursString = (timestamp: string) => {
  const date = new Date(Number(timestamp));

  return dayjs(date).format("HH:mm");
};
