/**
 * Media upload helper utility
 * Supports direct upload from PC for Images, Videos (with duration checking), and Documents (CV PDF)
 * Gracefully uploads via /api/upload-image (Supabase storage) with automatic Base64 client fallback
 */

export interface UploadedMediaResult {
  url: string;
  fileName: string;
  fileSize: string;
  mediaType: 'image' | 'video' | 'document';
  durationSeconds?: number;
}

/**
 * Format raw bytes into human-readable size string (e.g. 1.4 Mo)
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

/**
 * Read the duration of a video file using browser HTML5 video element
 */
export function getVideoDuration(file: File): Promise<number> {
  return new Promise((resolve) => {
    try {
      const video = document.createElement('video');
      video.preload = 'metadata';
      const objUrl = URL.createObjectURL(file);
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(objUrl);
        const duration = Math.round(video.duration);
        resolve(isNaN(duration) ? 0 : duration);
      };
      video.onerror = () => {
        window.URL.revokeObjectURL(objUrl);
        resolve(0);
      };
      video.src = objUrl;
    } catch {
      resolve(0);
    }
  });
}

/**
 * Convert a File object to a base64 Data URL
 */
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Erreur de lecture du fichier'));
    reader.readAsDataURL(file);
  });
}

/**
 * Upload a media file from PC (Image, Video, or Document/PDF)
 * Tries server endpoint first; falls back to client Data URL if offline or storage issue
 */
export async function uploadMediaFromPC(file: File): Promise<UploadedMediaResult> {
  const isImage = file.type.startsWith('image/');
  const isVideo = file.type.startsWith('video/');
  const isDoc = file.type.includes('pdf') || file.type.includes('document') || file.name.match(/\.(pdf|docx?)$/i);
  const mediaType: 'image' | 'video' | 'document' = isVideo ? 'video' : isDoc ? 'document' : 'image';

  let durationSeconds: number | undefined;
  if (isVideo) {
    try {
      durationSeconds = await getVideoDuration(file);
    } catch {
      durationSeconds = 60;
    }
  }

  const fileSize = formatFileSize(file.size);

  try {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload-image', {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      if (data.url) {
        return {
          url: data.url,
          fileName: file.name,
          fileSize,
          mediaType,
          durationSeconds,
        };
      }
    }
  } catch (err) {
    console.warn('Server upload failed, using local base64 fallback:', err);
  }

  // Fallback to local Data URL
  const dataUrl = await fileToDataUrl(file);
  return {
    url: dataUrl,
    fileName: file.name,
    fileSize,
    mediaType,
    durationSeconds,
  };
}
