'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';
import { toast } from 'sonner';
import type { VideoMediaItem } from '@/lib/services/cvthequeService';
import {
  MAX_PROJECT_IMAGES,
  MAX_PROJECT_VIDEOS,
  MAX_VIDEO_DURATION_SECONDS,
} from '@/lib/services/cvthequeService';

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

  // Video addition state
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [newVideoDuration, setNewVideoDuration] = useState('90'); // default 90 seconds (1m 30s)

  // Handle adding an image (limit: 6)
  const handleAddImage = () => {
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

  // Handle adding a video (limit: 2, max 120 seconds)
  const handleAddVideo = () => {
    const url = newVideoUrl.trim();
    if (!url) {
      toast.error('Veuillez renseigner l\'URL de la vidéo (YouTube, Vimeo, MP4...).');
      return;
    }

    if (videos.length >= maxVideos) {
      toast.error(`Limite atteinte : ${maxVideos} vidéos maximum autorisées.`);
      return;
    }

    const durationSeconds = parseDuration(newVideoDuration);

    // Strict validation: Max 2 minutes (120 seconds)
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

    const newVideoItem: VideoMediaItem = {
      id: `vid-${Date.now()}`,
      url,
      title: newVideoTitle.trim() || `Démonstration #${videos.length + 1}`,
      durationSeconds,
    };

    onChangeVideos([...videos, newVideoItem]);
    setNewVideoUrl('');
    setNewVideoTitle('');
    setNewVideoDuration('90');
    toast.success(`Vidéo ajoutée (${videos.length + 1}/${maxVideos}) !`);
  };

  const handleRemoveVideo = (indexToRemove: number) => {
    onChangeVideos(videos.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className="space-y-4 pt-1">
      {/* =================================================================== */}
      {/* 1. SECTION IMAGES (Max 6) */}
      {/* =================================================================== */}
      <div className="p-3.5 rounded-xl border border-border bg-card space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-foreground flex items-center gap-1.5 uppercase tracking-wider">
            <Icon name="PhotoIcon" size={14} className="text-primary" />
            Galerie d&apos;Images ({images.length}/{maxImages} max)
          </label>
          <span className="text-[10px] font-semibold text-muted-foreground">
            Max {maxImages} images
          </span>
        </div>

        {/* Input to add image */}
        {images.length < maxImages ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              placeholder="Collez une URL d'image (https://...)"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddImage();
                }
              }}
              className="flex-1 px-3 py-1.5 bg-muted border border-border rounded-lg text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary font-mono"
            />
            <button
              type="button"
              onClick={handleAddImage}
              className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-bold hover:opacity-90 flex items-center gap-1 transition-all btn-press flex-shrink-0"
            >
              <Icon name="PlusIcon" size={13} />
              Ajouter
            </button>
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

        {/* Input to add video */}
        {videos.length < maxVideos ? (
          <div className="space-y-2 p-2.5 rounded-lg bg-muted/60 border border-border/80">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground mb-1">
                  URL Vidéo (YouTube, Vimeo, MP4, Loom)
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
                  Durée (max 120s / 2m) :
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
                onClick={handleAddVideo}
                className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-bold hover:opacity-90 flex items-center gap-1 transition-all btn-press flex-shrink-0"
              >
                <Icon name="PlusIcon" size={13} />
                Ajouter la vidéo
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
