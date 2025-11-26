export const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
  });
};

export const compressAndResizeImage = (
  file: File,
  maxWidth: number = 800,
  maxHeight: number = 800,
  quality: number = 0.7
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      try {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions maintaining aspect ratio
          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);

          // Convert to WebP for better compression, fallback to JPEG
          let base64: string;
          try {
            base64 = canvas.toDataURL('image/webp', quality);
          } catch {
            base64 = canvas.toDataURL('image/jpeg', quality);
          }

          // If still too large, try lower quality
          if (base64.length > 5 * 1024 * 1024) {
            // 5MB limit
            try {
              base64 = canvas.toDataURL('image/webp', quality * 0.6);
            } catch {
              base64 = canvas.toDataURL('image/jpeg', quality * 0.6);
            }
          }

          resolve(base64);
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target?.result as string;
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
  });
};

export const uploadImage = async (
  file: File,
  options?: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    maxSizeMB?: number;
  }
): Promise<string> => {
  const {
    maxWidth = 800,
    maxHeight = 800,
    quality = 0.7,
    maxSizeMB = 5,
  } = options || {};

  // Check file size first
  const fileSizeMB = file.size / (1024 * 1024);
  if (fileSizeMB > maxSizeMB) {
    // Compress and resize
    return compressAndResizeImage(file, maxWidth, maxHeight, quality);
  }

  // Check if it's an image file
  if (!file.type.startsWith('image/')) {
    throw new Error('File must be an image');
  }

  // For small files, just convert to base64
  return convertToBase64(file);
};

export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/bmp', 'image/tiff'];
  
  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: `ফাইল ফরম্যাট সমর্থিত নয়। অনুমোদিত ফরম্যাট: JPG, PNG, GIF, WebP, BMP, TIFF`,
    };
  }

  const maxSizeMB = 20;
  const fileSizeMB = file.size / (1024 * 1024);
  if (fileSizeMB > maxSizeMB) {
    return {
      valid: false,
      error: `ফাইল আকার ${maxSizeMB}MB এর চেয়ে বেশি হতে পারে না`,
    };
  }

  return { valid: true };
};
