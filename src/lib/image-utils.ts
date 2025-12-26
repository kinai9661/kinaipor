// Image Upload and Processing Utilities

export interface UploadedImage {
  url: string;
  file: File;
  preview: string;
}

/**
 * Convert File to base64 data URL
 */
export const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Upload image to a temporary hosting service
 * For now, we'll use data URLs directly with Pollinations
 */
export const uploadImageToHost = async (file: File): Promise<string> => {
  // Convert to data URL for direct use
  const dataUrl = await fileToDataUrl(file);
  return dataUrl;
};

/**
 * Validate image file
 */
export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  // Check file type
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: '僅支持 JPG, PNG, WebP, GIF 格式'
    };
  }

  // Check file size (max 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return {
      valid: false,
      error: '圖片大小不能超過 10MB'
    };
  }

  return { valid: true };
};

/**
 * Resize image if needed
 */
export const resizeImage = (file: File, maxWidth: number = 2048, maxHeight: number = 2048): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    img.onload = () => {
      let width = img.width;
      let height = img.height;

      // Calculate new dimensions
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;
      }

      canvas.width = width;
      canvas.height = height;

      ctx?.drawImage(img, 0, 0, width, height);

      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to resize image'));
        }
      }, file.type);
    };

    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Process uploaded image
 */
export const processUploadedImage = async (file: File): Promise<UploadedImage> => {
  // Validate
  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  // Create preview
  const preview = URL.createObjectURL(file);

  // Resize if too large
  let processedFile = file;
  if (file.size > 5 * 1024 * 1024) { // > 5MB
    const resizedBlob = await resizeImage(file);
    processedFile = new File([resizedBlob], file.name, { type: file.type });
  }

  // Get URL for API
  const url = await uploadImageToHost(processedFile);

  return {
    url,
    file: processedFile,
    preview
  };
};
