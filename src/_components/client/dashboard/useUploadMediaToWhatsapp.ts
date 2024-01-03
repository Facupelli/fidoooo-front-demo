import * as api from "@/server/root";

export const useUploadMediaToWhatsapp = () => {
  const uploadMedia = api.whatsapp.uploadMedia;

  const handleUploadMedia = async ({ file }: { file: File }) => {
    let id = "";

    const uploadedMedia = await uploadMedia({ file });

    if (uploadedMedia?.success) {
      id = uploadedMedia?.data[0]?.id ?? "";
    } else {
      console.log("uploadMediaToWhatsapp error:", uploadedMedia?.message);
    }

    return id;
  };

  return {
    handleUploadMedia,
  };
};
