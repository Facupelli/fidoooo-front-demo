import { WhatsappIcon, InstagramIcon } from "@/icons";
import { type BusinessChannel, ChannelName } from "@/types/db";

export const getChannelIcon = (channel: BusinessChannel | null) => {
  switch (channel?.name) {
    case ChannelName.WHATSAPP:
      return <WhatsappIcon />;
    case ChannelName.INSTAGRAM:
      return <InstagramIcon />;
    // TODO: agrega iconos correspondientes
    case ChannelName.FACEBOOK:
      return <WhatsappIcon />;
    case ChannelName.TELEGRAM:
      return <WhatsappIcon />;
    default:
      return null;
  }
};
