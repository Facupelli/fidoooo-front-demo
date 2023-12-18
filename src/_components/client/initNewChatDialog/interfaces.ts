export interface NewChatForm {
  to: string;
  templateCategory: string;
  templateId: string;
  variables: {
    header: string[];
    body: string[];
  };
}
