import { type WhatsAppMessageTemplate } from "./whatsapp";

export enum MessageType {
  AUDIO = "audio",
  DOCUMENT = "document",
  CONTACTS = "contacts",
  TEXT = "text",
  IMAGE = "image",
  INTERACTIVE = "interactive",
  LOCATION = "location",
  REACTION = "reaction",
  STICKER = "sticker",
  TEMPLATE = "template",
  VIDEO = "video",
  BUTTON = "button",
}

export type Message =
  | TextMessage
  | LocationMessage
  | ImageMessage
  | InteractiveMessage
  | DocumentMessage
  | TemplateMessage;

export enum MessageStatusType {
  SENT = "sent",
  DELIVERED = "delivered",
  READ = "read",
  FAILED = "failed",
  DELETED = "deleted",
}

export interface MessageModel {
  id: string;
  deleted: boolean;
  from: {
    name?: string;
    userId: string;
  };
  messageId: string;
  timestamp: string;
  type: MessageType;
  updatedAt: string;
  status: {
    timestamp: number;
    value: MessageStatusType;
  };
}

interface TextMessage extends MessageModel {
  type: MessageType.TEXT;
  text: {
    body: string;
    preview_url?: string;
  };
}
interface LocationMessage extends MessageModel {
  type: MessageType.LOCATION;
  location: {
    longitude: string;
    latitude: string;
    name: string;
    address: string;
  };
}
interface ImageMessage extends MessageModel {
  type: MessageType.IMAGE;
  image: {
    id: string;
    link?: string;
    caption?: string;
    storageUrl?: string;
  };
}
interface TemplateMessage extends MessageModel {
  type: MessageType.TEMPLATE;
  template: WhatsAppMessageTemplate;
}
interface InteractiveMessage extends MessageModel {
  type: MessageType.INTERACTIVE;
  interactive: {
    body: {
      text: string;
    };
    type: InteractiveMessageType;
    action: ButtonAction | ListAction;
  };
}

export enum InteractiveMessageType {
  BUTTON = "button",
  LIST = "list",
  BUTTON_REPLY = "button_reply",
  LIST_REPLY = "list_reply",
  FLOW = "flow",
  NFM_REPLY = "nfm_reply",
}

interface ButtonAction {
  button_reply: {
    id: string;
    title: string;
  };
}

interface ListAction {
  button: string;
  sections: {
    title: string;
    rows: { description: string; id: string; title: string }[];
  }[];
}

interface DocumentMessage extends MessageModel {
  type: MessageType.DOCUMENT;
  document: {
    id?: string;
    link?: string;
    caption?: boolean;
    filename: string;
    mimetype?: string;
    storageUrl?: string;
  };
}
