import { apiFetch } from "./api";

interface UploadedFile {
  fileName: string;
  url: string;
  key: string;
}

interface UploadResponse {
  status: string;
  message: string;
  data: UploadedFile[];
}

const UPLOAD_ENDPOINT ="/users/upload-files-user";

export async function uploadImageAndGetKey(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("files", file);

  const response = await apiFetch<UploadResponse>(UPLOAD_ENDPOINT, {
    method: "POST",
    body: formData,
    unwrapData: false,
  });

  const key = response.data?.[0]?.key;
  if (!key) {
    throw new Error("Image upload failed: file key was not returned");
  }

  return key;
}
