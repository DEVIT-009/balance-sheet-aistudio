const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string;

/**
 * Upload a file to Cloudinary using an unsigned upload preset.
 * No API key or secret is sent from the client.
 *
 * @returns The `secure_url` of the uploaded image.
 */
export async function uploadToCloudinary(file: File): Promise<string> {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error(
      'Cloudinary env vars (VITE_CLOUDINARY_CLOUD_NAME / VITE_CLOUDINARY_UPLOAD_PRESET) are not set.'
    );
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message ?? `Cloudinary upload failed (${res.status})`);
  }

  const data = await res.json();
  return data.secure_url as string;
}
