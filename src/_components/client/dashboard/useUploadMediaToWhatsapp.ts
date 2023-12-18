import { useMutation } from "@tanstack/react-query";
import * as api from "@/server/root";

export const useUploadMediaToWhatsapp = () => {
  const uploadMedia = useMutation({
    mutationFn: api.whatsapp.uploadMedia,
  });

  const handleUploadMedia = async ({ file }: { file: File }) => {
    let id = "";

    await uploadMedia.mutateAsync(
      { file },
      {
        onSuccess(result) {
          id = result?.data[0]?.id ?? "";
        },
        onError(error) {
          console.log("uploadMediaToWhatsapp error:", error);
        },
      },
    );

    return id;
  };

  return {
    handleUploadMedia,
  };
};
