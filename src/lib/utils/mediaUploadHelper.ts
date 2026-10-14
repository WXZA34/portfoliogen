/**
 * Media upload helper utility
 * Supports direct upload from PC for Images, Videos (with duration checking), and Documents (CV PDF)
 * Gracefully uploads directly to Supabase Storage from browser (bypassing Vercel's 4.5MB serverless limit),
 * with fallback to /api/upload-image (guarded against 413) and automatic Base64 client fallback.
 * Includes client-side Canvas compression to prevent HTTP 413 and protect localStorage quotas,
 * as well as safe document opening to bypass Chrome's about:blank#blocked restriction on data URLs.
 */

import { createClient } from '@/lib/supabase/client';

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
 * Compress an image file using browser Canvas before upload.
 * Reduces 10MB camera/phone photos to ~150-250KB in milliseconds,
 * permanently preventing HTTP 413 (Payload Too Large) and localStorage quota crashes.
 */
export async function compressImageFile(
  file: File,
  maxDimension = 1200,
  quality = 0.82
): Promise<File> {
  const isImageByName = /\.(jpe?g|png|webp|avif|heic|heif|bmp|tiff)$/i.test(file.name);
  const isImage = (file.type && file.type.startsWith('image/')) || isImageByName;
  const isSvgOrGif = (file.type && (file.type.includes('svg') || file.type.includes('gif'))) || /\.(svg|gif)$/i.test(file.name);

  // Never compress SVG or GIF (maintain vectors and animation)
  if (!isImage || isSvgOrGif) {
    return file;
  }

  // Already small enough (< 250 KB)
  if (file.size < 250 * 1024) {
    return file;
  }

  return new Promise((resolve) => {
    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          let { width, height } = img;
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(file);
            return;
          }

          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob && blob.size < file.size) {
                const baseName = file.name.replace(/\.[^.]+$/, '');
                const compressedFile = new File([blob], `${baseName}.jpg`, {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                });
                resolve(compressedFile);
              } else {
                resolve(file);
              }
            },
            'image/jpeg',
            quality
          );
        };
        img.onerror = () => resolve(file);
        img.src = event.target?.result as string;
      };
      reader.onerror = () => resolve(file);
      reader.readAsDataURL(file);
    } catch {
      resolve(file);
    }
  });
}

/**
 * Convert base64 Data URL to a native binary Blob
 */
export function dataUrlToBlob(dataUrl: string): Blob {
  try {
    const parts = dataUrl.split(',');
    const mimeMatch = parts[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'application/pdf';
    const byteString = atob(parts[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }

    return new Blob([uint8Array], { type: mime });
  } catch (err) {
    console.error('Error converting Data URL to Blob:', err);
    return new Blob([], { type: 'application/pdf' });
  }
}

/**
 * Safely open a document (PDF, etc.) in a new tab.
 * Modern browsers (especially Google Chrome) strictly BLOCK top-level navigation to `data:` URLs (about:blank#blocked).
 * Converting to an ephemeral Blob Object URL (blob:http...) completely resolves this and lets Chrome's native PDF reader display the document.
 */
export function openDocumentSafe(url: string, fileName = 'CV_Document.pdf'): void {
  if (!url) return;

  try {
    if (url.startsWith('data:')) {
      const blob = dataUrlToBlob(url);
      const blobUrl = URL.createObjectURL(blob);
      const win = window.open(blobUrl, '_blank');
      if (!win) {
        // If popup was blocked by browser, trigger download
        downloadDocumentSafe(url, fileName);
      }
      setTimeout(() => URL.revokeObjectURL(blobUrl), 120000);
      return;
    }

    // Standard HTTP or relative URL
    window.open(url, '_blank', 'noopener,noreferrer');
  } catch (err) {
    console.error('Error opening document safely:', err);
    downloadDocumentSafe(url, fileName);
  }
}

/**
 * Safely trigger download of a document or media file.
 * Handles both Data URLs and remote URLs without triggering browser security blocks.
 */
export function downloadDocumentSafe(url: string, fileName = 'CV_Document.pdf'): void {
  if (!url) return;

  try {
    let downloadUrl = url;
    let isCreatedBlob = false;

    if (url.startsWith('data:')) {
      const blob = dataUrlToBlob(url);
      downloadUrl = URL.createObjectURL(blob);
      isCreatedBlob = true;
    }

    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = fileName;
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    if (isCreatedBlob) {
      setTimeout(() => URL.revokeObjectURL(downloadUrl), 60000);
    }
  } catch (err) {
    console.error('Error downloading document:', err);
    window.open(url, '_blank');
  }
}

/**
 * Upload a media file from PC (Image, Video, or Document/PDF)
 * 1. Automatically compresses large images on client canvas.
 * 2. Tries direct client-to-Supabase Storage upload first (bypassing Vercel's 4.5MB limit entirely).
 * 3. Only attempts /api/upload-image if file size is safely < 3.8MB (guaranteeing NO HTTP 413).
 * 4. Gracefully falls back to local Data URL if offline.
 */
export async function uploadMediaFromPC(file: File): Promise<UploadedMediaResult> {
  const isImageByName = /\.(jpe?g|png|webp|avif|heic|heif|bmp|tiff)$/i.test(file.name);
  const isImage = (file.type && file.type.startsWith('image/')) || isImageByName;
  const isVideo = (file.type && file.type.startsWith('video/')) || /\.(mp4|webm|mov|mkv)$/i.test(file.name);
  const isDoc = (file.type && (file.type.includes('pdf') || file.type.includes('document'))) || /\.(pdf|docx?|pptx?)$/i.test(file.name);
  const mediaType: 'image' | 'video' | 'document' = isVideo ? 'video' : isDoc ? 'document' : 'image';

  // Client-side compression for images to prevent HTTP 413 and localStorage overflow
  let processedFile = file;
  if (isImage) {
    try {
      processedFile = await compressImageFile(file);
    } catch {
      processedFile = file;
    }
  }

  let durationSeconds: number | undefined;
  if (isVideo) {
    try {
      durationSeconds = await getVideoDuration(file);
    } catch {
      durationSeconds = 60;
    }
  }

  const fileSize = formatFileSize(processedFile.size);

  // 1. Direct browser-to-Supabase Storage upload (bypasses Vercel Serverless Function 4.5MB body limit!)
  if (typeof window !== 'undefined') {
    try {
      const supabase = createClient();
      const folder = isVideo ? 'videos' : isDoc ? 'documents' : 'images';
      const ext = processedFile.name.split('.').pop() || (isImage ? 'jpg' : isDoc ? 'pdf' : 'bin');
      const filename = `editor/${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      let uploadResult = await supabase.storage
        .from('portfolio-media')
        .upload(filename, processedFile, {
          contentType: processedFile.type || (isImage ? 'image/jpeg' : isDoc ? 'application/pdf' : 'application/octet-stream'),
          upsert: false,
        });

      if (uploadResult.error) {
        uploadResult = await supabase.storage
          .from('media')
          .upload(filename, processedFile, {
            contentType: processedFile.type || (isImage ? 'image/jpeg' : isDoc ? 'application/pdf' : 'application/octet-stream'),
            upsert: false,
          });
      }

      if (!uploadResult.error) {
        const bucket = uploadResult.data?.fullPath?.startsWith('media/') ? 'media' : 'portfolio-media';
        const { data: urlData } = supabase.storage
          .from(bucket)
          .getPublicUrl(filename);

        if (urlData?.publicUrl) {
          return {
            url: urlData.publicUrl,
            fileName: processedFile.name,
            fileSize,
            mediaType,
            durationSeconds,
          };
        }
      }
    } catch (clientStorageErr) {
      console.warn('Direct client Supabase upload skipped:', clientStorageErr);
    }
  }

  // 2. Only attempt server endpoint /api/upload-image if safely under Vercel's 4.5MB payload limit (< 3.8MB)
  if (processedFile.size < 3.8 * 1024 * 1024) {
    try {
      const formData = new FormData();
      formData.append('file', processedFile);

      const res = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          return {
            url: data.url,
            fileName: processedFile.name,
            fileSize,
            mediaType,
            durationSeconds,
          };
        }
      }
    } catch (err) {
      console.warn('Server upload failed, using local base64 fallback:', err);
    }
  }

  // 3. Fallback to local Data URL (offline or large files without storage)
  const dataUrl = await fileToDataUrl(processedFile);
  return {
    url: dataUrl,
    fileName: processedFile.name,
    fileSize,
    mediaType,
    durationSeconds,
  };
}
