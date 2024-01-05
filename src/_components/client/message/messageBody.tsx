"use client";

import { TextIcon } from "@/icons";
import { InteractiveMessageType, MessageType } from "@/types/messages";
import Image from "next/image";
import { useEffect, useState } from "react";
import { storage } from "@/lib/firebase-config";
import { getDownloadURL, ref } from "firebase/storage";
import { FirebaseError } from "firebase/app";
import {
  type WhatsAppMessageTemplate,
  ComponentFormat,
  ButtonToSendSubType,
  ComponentType,
  type WhatsAppInteractiveFlow,
} from "@/types/whatsapp";
import { cn } from "@/lib/utils";

const formatText = (text: string) => {
  return text
    .replace(/_(.*?)_/g, "<i>$1</i>")
    .replace(/\*(.*?)\*/g, "<strong>$1</strong>")
    .replace(/~(.*?)~/g, "<del>$1</del>");
};

const FormattedText = ({ text }: { text: string }) => {
  return <p dangerouslySetInnerHTML={{ __html: formatText(text) }} />;
};

/* eslint-disable */
const MessageBody = ({
  message,
  messages,
}: {
  message: any;
  messages?: any;
}) => {
  switch (message.type) {
    case MessageType.TEXT:
      return <FormattedText text={message.text.body} />;

    case MessageType.INTERACTIVE:
      if (message.interactive.type === InteractiveMessageType.LIST_REPLY) {
        return <p>{message.interactive.list_reply.title}</p>;
      }

      if (message.interactive.type === InteractiveMessageType.BUTTON_REPLY) {
        return <p>{message.interactive.button_reply.title}</p>;
      }

      if (message.interactive.type === InteractiveMessageType.BUTTON) {
        const buttonMessage = message.interactive;
        const buttons = buttonMessage.action.buttons;
        return (
          <div>
            <p>{buttonMessage.body.text}</p>
            <div className="pt-2">
              {buttons.map((button: any) => (
                <p key={button.reply.id}>{button.reply.title}</p>
              ))}
            </div>
          </div>
        );
      }

      if (message.interactive.type === InteractiveMessageType.LIST) {
        const listMessage = message.interactive;
        const sections = listMessage.action.sections;
        return (
          <div>
            <p>{listMessage.body.text}</p>
            <div className="pt-2">
              {sections.map((section: any) => (
                <div key={section.title} className="pt-1">
                  {section.rows.map((row: any) => (
                    <p key={row.id}>{row.title}</p>
                  ))}
                </div>
              ))}
            </div>
          </div>
        );
      }

      if (message.interactive.type === InteractiveMessageType.FLOW) {
        const flowMessage = message.interactive;

        return (
          <div>
            <FlowMessageBody flowMessage={flowMessage} />
            <div className="mt-3   h-[1px] w-full bg-neutral-400" />
            <button className="w-full cursor-default pt-3 text-center font-semibold text-blue-400">
              abrir flujo
            </button>
          </div>
        );
      }

      if (message.interactive.type === InteractiveMessageType.NFM_REPLY) {
        const flowMessage = message.interactive;

        if (message.context) {
          const messageQuoted = messages?.find(
            (singleMessage: any) =>
              singleMessage.messageId === message.context.id,
          );

          if (messageQuoted) {
            return (
              <div className="grid gap-1">
                <div className="rounded bg-[#bddcbe] px-2 py-1">
                  <FlowMessageBody flowMessage={messageQuoted.interactive} />
                </div>
                <p>{flowMessage.nfm_reply.body}</p>
                {/* <p>{flowMessage.nfm_reply.response_json}</p> */}
              </div>
            );
          }
        }

        return (
          <div className="grid gap-1">
            <p>
              FLOW {flowMessage.nfm_reply.body} ${message.context.id}
            </p>
            <p className="max-w-[500px]">
              {flowMessage.nfm_reply.response_json}
            </p>
          </div>
        );
      }

      return <p>interactive message not supported</p>;

    case MessageType.DOCUMENT: {
      return (
        <div className="flex items-start gap-2 text-f-black">
          <TextIcon size={24} />
          <p>{message.document.filename}</p>
        </div>
      );
    }

    case MessageType.IMAGE:
      return <ImageMessageBody imagePath={message.image.storageUrl} />;

    case MessageType.TEMPLATE:
      return <TemplateMessageBody template={message.template} />;

    default:
      return <p>este mensaje no es soportado</p>;
  }
};

/* eslint-enable */
const ImageMessageBody = ({ imagePath }: { imagePath: string | undefined }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!imagePath) {
      return;
    }

    const imageRef = ref(storage, imagePath);

    getDownloadURL(imageRef)
      .then((res) => setImageUrl(res))
      .catch((error: unknown) => {
        if (error instanceof FirebaseError) {
          setError(error.message);
        }
      });
  }, [imagePath]);

  if (error) {
    return <div className="text-sm">{error}</div>;
  }

  if (!imageUrl) {
    return (
      <div className="h-[200px] w-[200px] animate-pulse bg-light-gray ease-in-out"></div>
    );
  }

  return (
    <div className="relative h-[200px] w-[200px]">
      <Image
        src={imageUrl}
        alt="Imagen del chat"
        fill
        className="rounded-lg object-cover"
      />
    </div>
  );
};

const FlowMessageBody = ({
  flowMessage,
  className,
}: {
  flowMessage: WhatsAppInteractiveFlow;
  className?: string;
}) => {
  return (
    <div className={cn("grid gap-1", className)}>
      <p>{flowMessage.header.text}</p>
      <p>{flowMessage.body.text}</p>
      <p>{flowMessage.footer.text}</p>
    </div>
  );
};

const TemplateMessageBody = ({
  template,
}: {
  template: WhatsAppMessageTemplate;
}) => {
  const components = template.components || [];

  const getComponent = (type: ComponentType) =>
    components.find((component) => component.type === type);

  const header = getComponent(ComponentType.HEADER);
  const body = getComponent(ComponentType.BODY);
  const footer = getComponent(ComponentType.FOOTER);
  const buttons = getComponent(ComponentType.BUTTONS);

  return (
    <div className="max-w-[280px]">
      {header && header.format === ComponentFormat.IMAGE && header.url && (
        <div className="relative h-[280px] w-[280px]">
          <Image
            src={header.url}
            alt="Imagen del chat"
            fill
            className="rounded-lg object-cover"
          />
        </div>
      )}

      {header && header.format === ComponentFormat.TEXT && header.text && (
        <FormattedText text={header.text ?? ""} />
      )}

      <div className="grid gap-2 pt-2">
        {body && <FormattedText text={body.text ?? ""} />}

        {footer && <div className="text-sm text-dark-gray">{footer.text}</div>}

        {buttons && (
          <div className="flex pt-2">
            {buttons.buttons?.map((button) => {
              if (button.type === ButtonToSendSubType.URL) {
                return (
                  <a
                    className="grow text-center text-[#238dbb]"
                    key={button.text}
                    href={button.url}
                    target="_blank"
                  >
                    {button.text}
                  </a>
                );
              }

              return (
                <button
                  className="grow text-center text-[#238dbb]"
                  key={button.text}
                >
                  {button.text}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export { MessageBody };
