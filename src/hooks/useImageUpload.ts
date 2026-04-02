import { useState, useCallback } from 'react';
import { uploadToCloudinary } from '../services/cloudinaryService';

export interface ImageUploadState {
  /** Local object-URL for preview before/after upload */
  previewUrl: string;
  /** The Cloudinary secure_url after successful upload, empty string otherwise */
  secureUrl: string;
  /** True while the upload is in-flight */
  isUploading: boolean;
  /** Error message, empty string when no error */
  uploadError: string;
}

export interface UseImageUploadReturn extends ImageUploadState {
  /** Call this with a File to start the upload */
  handleFileChange: (file: File | null) => void;
  /** Reset all state (call when form resets) */
  resetImage: () => void;
  /** Seed the hook with an existing URL (for edit mode) */
  setExistingImage: (url: string) => void;
}

const INITIAL: ImageUploadState = {
  previewUrl: '',
  secureUrl: '',
  isUploading: false,
  uploadError: '',
};

export function useImageUpload(): UseImageUploadReturn {
  const [state, setState] = useState<ImageUploadState>(INITIAL);

  const handleFileChange = useCallback(async (file: File | null) => {
    if (!file) return;

    // Immediate local preview
    const localPreview = URL.createObjectURL(file);
    setState({ previewUrl: localPreview, secureUrl: '', isUploading: true, uploadError: '' });

    try {
      const secureUrl = await uploadToCloudinary(file);
      setState(prev => ({ ...prev, secureUrl, isUploading: false }));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Image upload failed';
      setState(prev => ({ ...prev, isUploading: false, uploadError: msg }));
    }
  }, []);

  const resetImage = useCallback(() => {
    setState(INITIAL);
  }, []);

  const setExistingImage = useCallback((url: string) => {
    setState({ previewUrl: url, secureUrl: url, isUploading: false, uploadError: '' });
  }, []);

  return { ...state, handleFileChange, resetImage, setExistingImage };
}
