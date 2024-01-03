import { ref, uploadBytes } from "firebase/storage";
import { useUploadMediaToWhatsapp } from "./useUploadMediaToWhatsapp";
import { generateUniqueId } from "./utils";
import { storage } from "@/lib/firebase-config";
import { MessageType } from "@/types/messages";
import * as api from "@/server/root";

const uploadMediaToStorage = async ({
  path,
  file,
}: {
  path: string;
  file: File;
}) => {
  try {
    const uniqueId = generateUniqueId();
    const filePath = `${path}/${uniqueId}`;

    const storageRef = ref(storage, filePath);
    await uploadBytes(storageRef, file);

    return filePath;
  } catch (error) {
    console.log(error);
  }
};

export const useSendMediaMessage = (
  selectedChatId: string | undefined,
  to: string | undefined,
) => {
  const sendMessage = api.whatsapp.sendMessage;

  const { handleUploadMedia } = useUploadMediaToWhatsapp();

  const handleSendImageMessage = async (image: File) => {
    const id = await handleUploadMedia({ file: image });
    const storageUrl = await uploadMediaToStorage({
      path: `chats/media/${selectedChatId}`,
      file: image,
    });

    if (!id) {
      return;
    }

    await sendMessage({
      message: {
        type: MessageType.IMAGE,
        image: {
          id,
          storageUrl,
        },
      },
      to: to ?? "",
    });
  };

  const handleSendDocumentMessage = async (document: File) => {
    const id = await handleUploadMedia({ file: document });
    const storageUrl = await uploadMediaToStorage({
      path: `chats/media/${selectedChatId}`,
      file: document,
    });

    if (!id) {
      return;
    }

    await sendMessage({
      message: {
        type: MessageType.DOCUMENT,
        document: {
          id,
          storageUrl,
          filename: document.name,
        },
      },
      to: to ?? "",
    });
  };

  return { handleSendImageMessage, handleSendDocumentMessage };
};
