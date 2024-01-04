export interface WhatsAppMessageTemplate {
  name: string;
  components: TemplateComponent[];
  language: string;
  status: string;
  category: string;
  id: string;
}

export interface WhatsAppInteractiveFlow {
  body: {
    text: string;
  };
  header: {
    text?: string;
  };
  footer: {
    text: string;
  };
}

export enum ComponentFormat {
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
  DOCUMENT = "DOCUMENT",
  TEXT = "TEXT",
}

export interface TemplateComponent {
  type: ComponentType;
  format?: ComponentFormat;
  text?: string;
  example?: Example;
  buttons?: Button[];
  url?: string;
}

export enum ComponentType {
  HEADER = "HEADER",
  BODY = "BODY",
  FOOTER = "FOOTER",
  BUTTONS = "BUTTONS",
}

interface Example {
  body_text: string[][];
}

interface Button {
  type: ButtonToSendSubType;
  text: string;
  url?: string;
}

//
export interface WhatsAppTemplateMessageToSend {
  messaging_product: string;
  recipient_type: string;
  to: string;
  type: string;
  template: WhatsAppTemplateToSend;
}

export interface WhatsAppTemplateToSend {
  name: string;
  language: Language;
  components: ComponentToSend[];
}

interface Language {
  code: string;
}

export interface ComponentToSend {
  type: string;
  sub_type?: ButtonToSendSubType;
  index?: number;
  parameters: ParameterToSend[];
}

export interface ParameterToSend {
  type: string;
  text?: string;
  currency?: Currency;
  date_time?: DateTime;
  location?: Location;
  payload?: string;
  url?: string;
  image?: {
    link: string;
  };
  video?: {
    link: string;
  };
  document?: {
    link: string;
  };
}

interface Currency {
  fallback_value: string;
  code: string;
  amount_1000: number;
}

interface DateTime {
  fallback_value: string;
}

interface Location {
  longitude: number;
  latitude: number;
}

export enum ButtonToSendSubType {
  QUICK_REPLY = "QUICK_REPLY",
  CALL_TO_ACTION = "CALL_TO_ACTION",
  URL = "URL",
}
