'use client';

import React, { useState, useRef } from 'react';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';
import { toast } from 'sonner';
import type { VideoMediaItem } from '@/lib/services/cvthequeService';
import {
  MAX_PROJECT_IMAGES,
  MAX_PROJECT_VIDEOS,
  MAX_VIDEO_DURATION_SECONDS,
} from '@/lib/services/cvthequeService';
import { uploadMediaFromPC, getVideoDuration } from '@/lib/utils/mediaUploadHelper';

interface MediaUploadManagerProps {
  images: string[];
  onChangeImages: (images: string[]) => void;
  videos: VideoMediaItem[];
  onChangeVideos: (videos: VideoMediaItem[]) => void;
  maxImages?: number;
  maxVideos?: number;
  maxDurationSeconds?: number;
}

export default function MediaUploadManager({
  images,
  onChangeImages,
  videos,
  onChangeVideos,
  maxImages = MAX_PROJECT_IMAGES, // 6
  maxVideos = MAX_PROJECT_VIDEOS, // 2
  maxDurationSeconds = MAX_VIDEO_DURATION_SECONDS, // 120s = 2 min
}: MediaUploadManagerProps) {
  // Image addition state
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const imageFileInputRef = useRef<HTMLInputElement>(null);

  // Video addition state
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [newVideoDuration, setNewVideoDuration] = useState('90');
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const videoFileInputRef = useRef<HTMLInputElement>(null);

  // Handle direct PC Image Upload
  const handleImageFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = maxImages - images.length;
    if (remainingSlots <= 0) {
      toast.error(`Limite de ${maxImages} images déjà atteinte.`);
      if (imageFileInputRef.current) imageFileInputRef.current.value = '';
      return;
    }

    const filesToUpload = Array.from(files).slice(0, remainingSlots);
    setIsUploadingImage(true);
    const toastId = toast.loading(`Importation de ${filesToUpload.length} image(s) depuis votre PC...`);

    try {
      const uploadedUrls: string[] = [];
      for (const file of filesToUpload) {
        const result = await uploadMediaFromPC(file);
        if (result.url && !images.includes(result.url) && !uploadedUrls.includes(result.url)) {
          uploadedUrls.push(result.url);
        }
      }

      if (uploadedUrls.length > 0) {
        onChangeImages([...images, ...uploadedUrls]);
        toast.success(`${uploadedUrls.length} image(s) importée(s) avec succès !`, { id: toastId });
      } else {
        toast.info('Aucune nouvelle image importée.', { id: toastId });
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Erreur lors de l'import de l'image.", { id: toastId });
    } finally {
      setIsUploadingImage(false);
      if (imageFileInputRef.current) imageFileInputRef.current.value = '';
    }
  };

  // Handle adding an image by URL
  const handleAddImageUrl = () => {
    const url = newImageUrl.trim();
    if (!url) return;

    if (images.length >= maxImages) {
      toast.error(`Limite atteinte : ${maxImages} images maximum autorisées.`);
      return;
    }

    if (images.includes(url)) {
      toast.info('Cette image est déjà dans la liste.');
      return;
    }

    onChangeImages([...images, url]);
    setNewImageUrl('');
    toast.success(`Image ajoutée (${images.length + 1}/${maxImages}) !`);
  };

  const handleRemoveImage = (indexToRemove: number) => {
    onChangeImages(images.filter((_, idx) => idx !== indexToRemove));
  };

  // Handle direct PC Video Upload
  const handleVideoFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (videos.length >= maxVideos) {
      toast.error(`Limite atteinte : ${maxVideos} vidéos maximum autorisées.`);
      if (videoFileInputRef.current) videoFileInputRef.current.value = '';
      return;
    }

    setIsUploadingVideo(true);
    const toastId = toast.loading(`Import de la vidéo "${file.name}" depuis votre PC...`);

    try {
      // 1. Detect duration automatically from file metadata
      let durationSec = await getVideoDuration(file);
      if (durationSec <= 0) durationSec = 60;

      if (durationSec > maxDurationSeconds) {
        toast.warning(
          `Attention : la vidéo (${durationSec}s) dépasse la recommandation de 2 minutes (120s).`,
          { duration: 5000 }
        );
      }

      // 2. Upload file
      const result = await uploadMediaFromPC(file);

      const newVideo: VideoMediaItem = {
        id: `vid-${Date.now()}`,
        url: result.url,
        title: file.name.replace(/\.[^/.]+$/, ''),
        durationSeconds: Math.min(durationSec, 300),
      };

      onChangeVideos([...videos, newVideo]);
      toast.success(`Vidéo "${file.name}" importée avec succès !`, { id: toastId });
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Erreur lors de l'import de la vidéo.", { id: toastId });
    } finally {
      setIsUploadingVideo(false);
      if (videoFileInputRef.current) videoFileInputRef.current.value = '';
    }
  };

  // Helper to parse duration string (e.g. "90", "1:30", "2:00")
  const parseDuration = (input: string): number => {
    const trimmed = input.trim();
    if (trimmed.includes(':')) {
      const parts = trimmed.split(':');
      const m = parseInt(parts[0], 10) || 0;
      const s = parseInt(parts[1], 10) || 0;
      return m * 60 + s;
    }
    return parseInt(trimmed, 10) || 0;
  };

  // Handle adding a video by URL (YouTube, Vimeo, etc.)
  const handleAddVideoUrl = () => {
    const url = newVideoUrl.trim();
    if (!url) {
      toast.error("Veuillez renseigner l'URL de la vidéo (YouTube, Vimeo, MP4...).");
      return;
    }

    if (videos.length >= maxVideos) {
      toast.error(`Limite atteinte : ${maxVideos} vidéos maximum autorisées.`);
      return;
    }

    const durationSeconds = parseDuration(newVideoDuration);
    if (durationSeconds <= 0) {
      toast.error('Veuillez renseigner une durée valide (ex: 60s ou 1:30).');
      return;
    }

    if (durationSeconds > maxDurationSeconds) {
      toast.error(
        `Durée non autorisée : ${durationSeconds}s dépasse la limite stricte de 2 minutes (120 secondes maximum) !`
      );
      return;
    }

    const newVideo: VideoMediaItem = {
      id: `vid-${Date.now()}`,
      url,
      title: newVideoTitle.trim() || `Démonstration #${videos.length + 1}`,
      durationSeconds,
    };

    onChangeVideos([...videos, newVideo]);
    setNewVideoUrl('');
    setNewVideoTitle('');
    setNewVideoDuration('90');
    toast.success(`Vidéo ajoutée (${videos.length + 1}/${maxVideos}) !`);
  };

  const handleRemoveVideo = (indexToRemove: number) => {
    onChangeVideos(videos.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className="space-y-4">
      {/* =================================================================== */}
      {/* 1. SECTION IMAGES DU PROJET (Max 6) */}
      {/* =================================================================== */}
      <div className="p-3.5 rounded-xl border border-border bg-card space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-foreground flex items-center gap-1.5 uppercase tracking-wider">
            <Icon name="PhotoIcon" size={14} className="text-primary" />
            Photos & Captures d&apos;écran ({images.length}/{maxImages} max)
          </label>
          <span className="text-[10px] text-muted-foreground font-semibold">
            Formats : JPG, PNG, WebP, GIF
          </span>
        </div>

        {/* Input & Direct PC Upload */}
        {images.length < maxImages ? (
          <div className="space-y-2">
            {/* Direct Upload from PC */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <input
                ref={imageFileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
                multiple
                className="hidden"
                onChange={handleImageFileSelect}
              />

              <button
                type="button"
                disabled={isUploadingImage}
                onClick={() => imageFileInputRef.current?.click()}
                className="px-3.5 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 text-xs font-bold flex items-center justify-center gap-2 transition-all btn-press shadow-2xs"
              >
                {isUploadingImage ? (
                  <Icon name="ArrowPathIcon" size={14} className="animate-spin" />
                ) : (
                  <Icon name="ArrowUpTrayIcon" size={14} />
                )}
                <span>Importer photo(s) depuis mon PC</span>
              </button>

              <span className="text-[11px] text-muted-foreground text-center sm:text-left font-medium">
                ou par URL directe :
              </span>
            </div>

            {/* URL input fallback */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/... ou URL image"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddImageUrl();
                  }
                }}
                className="flex-1 px-3 py-1.5 bg-muted border border-border rounded-lg text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary font-mono"
              />
              <button
                type="button"
                onClick={handleAddImageUrl}
                className="px-3 py-1.5 bg-muted border border-border hover:bg-muted/80 text-foreground rounded-lg text-xs font-bold flex items-center gap-1 transition-all btn-press flex-shrink-0"
              >
                <Icon name="PlusIcon" size={13} />
                Ajouter
              </button>
            </div>
          </div>
        ) : (
          <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-[11px] font-semibold text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
            <Icon name="CheckCircleIcon" size={14} />
            Limite de {maxImages} images atteinte. Supprimez-en une pour en ajouter une autre.
          </div>
        )}

        {/* Image Thumbnails Grid */}
        {images.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-1">
            {images.map((imgUrl, idx) => (
              <div
                key={idx}
                className="relative aspect-square rounded-lg overflow-hidden border border-border bg-muted group"
              >
                <AppImage src={imgUrl} alt={`Image ${idx + 1}`} fill className="object-cover" />
                <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-bold text-white z-10">
                  #{idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute inset-0 bg-red-600/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white z-20"
                  title="Supprimer cette image"
                >
                  <Icon name="TrashIcon" size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* =================================================================== */}
      {/* 2. SECTION VIDÉOS (Max 2, durée max 2 min) */}
      {/* =================================================================== */}
      <div className="p-3.5 rounded-xl border border-border bg-card space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-foreground flex items-center gap-1.5 uppercase tracking-wider">
            <Icon name="VideoCameraIcon" size={14} className="text-primary" />
            Vidéos de Démonstration ({videos.length}/{maxVideos} max)
          </label>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
            ⏱ Max 2 min (120s)
          </span>
        </div>

        {/* Input to add video (PC File or URL) */}
        {videos.length < maxVideos ? (
          <div className="space-y-3 p-3 rounded-lg bg-muted/60 border border-border/80">
            {/* Direct Upload Video from PC */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <input
                ref={videoFileInputRef}
                type="file"
                accept="video/mp4,video/webm,video/quicktime,video/ogg"
                className="hidden"
                onChange={handleVideoFileSelect}
              />

              <button
                type="button"
                disabled={isUploadingVideo}
                onClick={() => videoFileInputRef.current?.click()}
                className="px-3.5 py-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center justify-center gap-2 transition-all btn-press shadow-2xs"
              >
                {isUploadingVideo ? (
                  <Icon name="ArrowPathIcon" size={14} className="animate-spin" />
                ) : (
                  <Icon name="ArrowUpTrayIcon" size={14} />
                )}
                <span>Importer vidéo depuis mon PC (MP4, WebM, MOV)</span>
              </button>

              <span className="text-[11px] text-muted-foreground text-center sm:text-left font-medium">
                ou lien vidéo externe :
              </span>
            </div>

            {/* External URL inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-border/60">
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground mb-1">
                  URL Vidéo (YouTube, Vimeo, MP4 direct)
                </label>
                <input
                  type="text"
                  value={newVideoUrl}
                  onChange={(e) => setNewVideoUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full px-2.5 py-1.5 bg-background border border-border rounded text-xs text-foreground focus:outline-none focus:border-primary font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground mb-1">
                  Titre du média / Démonstration
                </label>
                <input
                  type="text"
                  value={newVideoTitle}
                  onChange={(e) => setNewVideoTitle(e.target.value)}
                  placeholder="ex: Démo IHM Automate WAGO"
                  className="w-full px-2.5 py-1.5 bg-background border border-border rounded text-xs text-foreground focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 pt-1">
              <div className="flex items-center gap-2">
                <label className="text-[10px] font-bold text-muted-foreground whitespace-nowrap">
                  Durée (max 120s) :
                </label>
                <input
                  type="text"
                  value={newVideoDuration}
                  onChange={(e) => setNewVideoDuration(e.target.value)}
                  placeholder="90s ou 1:30"
                  className="w-20 px-2 py-1 bg-background border border-border rounded text-xs font-mono text-foreground focus:outline-none focus:border-primary text-center"
                />
                <span className="text-[10px] text-muted-foreground">secondes (≤ 120s)</span>
              </div>

              <button
                type="button"
                onClick={handleAddVideoUrl}
                className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-bold hover:opacity-90 flex items-center gap-1 transition-all btn-press flex-shrink-0"
              >
                <Icon name="PlusIcon" size={13} />
                Ajouter URL
              </button>
            </div>
          </div>
        ) : (
          <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-[11px] font-semibold text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
            <Icon name="CheckCircleIcon" size={14} />
            Limite de {maxVideos} vidéos atteinte (durée ≤ 2 min chacune).
          </div>
        )}

        {/* Existing Videos List */}
        {videos.length > 0 && (
          <div className="space-y-2 pt-1">
            {videos.map((vid, idx) => {
              const durSec = vid.durationSeconds || 120;
              const m = Math.floor(durSec / 60);
              const s = durSec % 60;
              const formatted = `${m}:${s < 10 ? '0' : ''}${s}`;

              return (
                <div
                  key={vid.id || idx}
                  className="p-2.5 rounded-lg border border-border bg-background flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                      <Icon name="PlayIcon" size={12} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-foreground truncate">
                        {vid.title || `Vidéo ${idx + 1}`}
                      </p>
                      <p className="text-[10px] text-muted-foreground truncate font-mono">
                        {vid.url}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 font-mono">
                      ⏱ {formatted} (≤2m)
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveVideo(idx)}
                      className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors"
                      title="Supprimer cette vidéo"
                    >
                      <Icon name="TrashIcon" size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
