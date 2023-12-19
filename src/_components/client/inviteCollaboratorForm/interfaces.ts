export interface EditCollaboratorForm {
  user: {
    name: string;
    email: string;
    lastName?: string;
    firstName?: string;
    phoneNumber?: string;
  };
  business?: { labels: string[] };
  // permissions?: {
  //   "invite-collaborators-to-team": "on" | "off";
  //   "create-label": "on" | "off";
  //   "label-chats": "on" | "off";
  //   "edit-default-answer": "on" | "off";
  //   "access-business-settings": "on" | "off";
  //   "assign-chats": "on" | "off";
  //   "send-default-messages": "on" | "off";
  // };
}
