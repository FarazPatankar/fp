import slugify from "@sindresorhus/slugify";
import { createImageUpload } from "novel";
import { toast } from "sonner";

const onUpload = async (file: File) => {
  const pathname = window.location.pathname;
  const slug = pathname.split("/").pop();

  const promise = fetch(`/p/${slug}/upload`, {
    method: "POST",
    headers: {
      "content-type": file.type,
      "x-file-name": slugify(file.name),
    },
    body: file,
  });

  return new Promise(resolve => {
    toast.promise(
      promise.then(async res => {
        // Successfully uploaded image
        if (res.status === 200) {
          const { url } = (await res.json()) as any;
          // preload the image
          let image = new Image();
          image.src = url;
          image.onload = () => {
            resolve(url);
          };
        } else {
          throw new Error(`Error uploading image. Please try again.`);
        }
      }),
      {
        loading: "Uploading image...",
        success: "Image uploaded successfully.",
        error: e => e.message,
      },
    );
  });
};

export const uploadFn = createImageUpload({
  onUpload,
  validateFn: file => {
    if (!file.type.includes("image/")) {
      toast.error("File type not supported.");
      return false;
    } else if (file.size / 1024 / 1024 > 20) {
      toast.error("File size too big (max 20MB).");
      return false;
    }
    return true;
  },
});
