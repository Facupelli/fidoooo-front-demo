"use client";

import { MessageStatusType } from "@/types/messages";
import { MessageBody } from "./messageBody";
import React from "react";
import { type Business } from "@/types/db";
import { MessageTickIcon, UserIcon } from "@/icons";
import Image from "next/image";
import {
  type ChatMessage,
  getUserImage,
  isMessageFromBusiness,
  timestampToHoursString,
} from "./utils";

interface MessageProps extends React.InputHTMLAttributes<HTMLDivElement> {
  message: ChatMessage;
  business: Business;
}

const MessageComponent = React.forwardRef<HTMLDivElement, MessageProps>(
  ({ message, business, ...props }, ref) => {
    const image = getUserImage(business, message);

    if (isMessageFromBusiness(business, message)) {
      return (
        <div className="flex justify-end gap-2 text-f-black">
          {message.showAvatar && (
            <div className="relative h-12 w-12 rounded-full bg-light-gray">
              {image ? (
                <Image
                  fill
                  alt="user profile image"
                  src={image}
                  className="rounded-full bg-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full">
                  <UserIcon size={48} />
                </div>
              )}
            </div>
          )}
          <div
            key={message.id}
            className="rounded-bl-[25px] rounded-br-[25px] rounded-tl-[25px] bg-light-gray px-4 py-3"
            ref={ref}
            {...props}
          >
            <MessageBody message={message} />
            <div className="flex items-baseline justify-end gap-1.5 text-sm text-dark-gray">
              {timestampToHoursString(message.timestamp)}
              <MessageTickIcon
                stroke={
                  message.status.value === MessageStatusType.READ
                    ? "#5882F4"
                    : "#5F5F5F"
                }
              />
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex gap-2 text-f-black">
        <div
          key={message.id}
          className="rounded-bl-[25px] rounded-br-[25px] rounded-tr-[25px] bg-[#D3EED4] px-4 py-3"
          ref={ref}
          {...props}
        >
          <MessageBody message={message} />
          <div className="flex items-baseline justify-end gap-1.5 text-sm text-dark-gray">
            {timestampToHoursString(message.timestamp)}
          </div>
        </div>
      </div>
    );
  },
);

MessageComponent.displayName = "MessageComponent";

export { MessageComponent };
