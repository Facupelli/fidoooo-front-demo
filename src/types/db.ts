import { type MessageType } from "./messages";

export interface ApiResponse<T> {
  statusCode: number;
  correlationId: string;
  success: boolean;
  message: string;
  data: T;
}

export interface User {
  business?: {
    businessId?: string;
    channels?: string[];
    roles: string[];
    labels?: string[];
  };
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  birthday: string;
  city: string;
  country: string;
  cuil: string;
  photoUrl: string;
  id: string;
}

export enum ConversationStatus {
  COMPLETED = "completed",
  IN_PROGRESS = "inProgress",
  EXPIRED = "expired",
}

export interface ChatCurrentUser {
  employeeId: string;
  name: string;
}

export interface Chat {
  sessions?: Session;
  category?: string;
  channelId: string;
  currentUser?: ChatCurrentUser;
  customer: {
    customerId: string;
    nickname: string;
  };
  lastCustomerMessage?: {
    text?: {
      body: string;
    };
    document?: {
      filename: string;
    };
    interactive: ListReply | ButtonReply;
    type: MessageType;
  };
  lastMessageAt?: FirestoreTimestamp;
  unreadCount?: number;
  participants: { roles: string[]; userId: string }[];
  pendingResolution: boolean;
  startedAt: string;
  status: ConversationStatus;
  to: string;
  unread: boolean;
  updatedAt: FirestoreTimestamp;
  id: string;
  label?: Label;
}

export interface ButtonReply {
  button_reply: {
    id: string;
    title: string;
  };
  type: "button_reply";
}

export interface ListReply {
  list_reply: {
    id: string;
    title: string;
  };
  type: "list_reply";
}

export interface FirestoreTimestamp {
  _nanoseconds?: number;
  _seconds?: number;
  nanoseconds?: number;
  seconds?: number;
}

export interface Session {
  active: boolean;
  botId: string;
  currentNodeId: string;
  currentNodeType: string;
  currentState: string;
  failedAttemps: number;
  isBotActive: boolean;
  lastMessageAt: string;
  messagesCount: number;
  vaariables: unknown;
  id: string;
}

export interface Business {
  admin: {
    userId: string;
    photoUrl: string;
  };
  channels?: BusinessChannel[];
  employees?: BusinessEmployee[];
  bots?: string[];
  labels?: Label[];
  name: string;
  settings: unknown;
  id: string;
}

export interface BusinessChannel {
  id: string;
  name: ChannelName;
}

export enum ChannelName {
  WHATSAPP = "whatsapp",
  INSTAGRAM = "instagram",
  FACEBOOK = "facebook",
  TELEGRAM = "TELEGRAM",
}

export interface BusinessEmployee {
  roles: string[];
  userId: string;
  userName: string;
  photoUrl?: string;
}

export interface Label {
  color: LabelRGBAColor;
  id: string;
  name: string;
}

export interface LabelRGBAColor {
  r: number;
  g: number;
  b: number;
  a: number;
}
