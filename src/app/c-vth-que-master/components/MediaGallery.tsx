'use client';

import React, { useState, useEffect, useRef } from 'react';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';
import {
  MediaFileItem,
  fetchUserMediaFiles,
  saveMediaFile,
  deleteMediaFile,
} from '@/lib/services/cvthequeService';
import { toast } from 'sonner';

interface MediaGalleryProps {
  onCountChange?: (count: number) => void;
}

export default function MediaGallery({ onCountChange }: MediaGalleryProps) {
  const [mediaItems, setMediaItems] = useState<MediaFileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'image' | 'document'>('all');
  const [selectedMedia, setSelectedMedia] = useState<MediaFileItem | null>(null);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadMedia = async () => {
    try {
      setLoading(true);
      const data = await fetchUserMediaFiles();
      setMediaItems(data);
      if (onCountChange) onCountChange(data.length);
    } catch (err) {
      console.error(err);
      toast.error('Impossible de charger vos médias.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const toastId = toast.loading(`Import de "${file.name}"...`);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Erreur lors du téléversement');
      }

      const sizeStr = `${(file.size / 1024 / 1024).toFixed(1)} Mo`;
      const isImg = file.type.startsWith('image/');

      const newMedia = await saveMediaFile({
        fileName: file.name.replace(/\.[^/.]+$/, ''),
        fileUrl: data.url,
        mediaType: isImg ? 'image' : 'document',
        fileSize: sizeStr,
        altText: file.name,
        project: 'CVthèque',
      });

      const updated = [newMedia, ...mediaItems];
      setMediaItems(updated);
      if (onCountChange) onCountChange(updated.length);

      toast.success('Média importé avec succès !', { id: toastId });
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Erreur lors de l\'import du fichier', { id: toastId });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (item: MediaFileItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!confirm(`Supprimer définitivement "${item.fileName}" de votre galerie ?`)) {
      return;
    }

    try {
      setDeletingId(item.id);
      await deleteMediaFile(item.id);
      const updated = mediaItems.filter((m) => m.id !== item.id);
      setMediaItems(updated);
      if (onCountChange) onCountChange(updated.length);
      if (selectedMedia?.id === item.id) setSelectedMedia(null);
      toast.success(`"${item.fileName}" supprimé.`);
    } catch (err) {
      console.error(err);
      toast.error('Erreur lors de la suppression.');
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = filter === 'all' ? mediaItems : mediaItems.filter((m) => m.mediaType === filter);
  const imagesCount = mediaItems.filter((m) => m.mediaType === 'image').length;
  const docsCount = mediaItems.filter((m) => m.mediaType === 'document').length;

  return (
    <div>
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-1 bg-muted p-1 rounded-xl border border-border w-fit">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-600 transition-all ${
              filter === 'all'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Tous ({mediaItems.length})
          </button>
          <button
            onClick={() => setFilter('image')}
            className={`px-3 py-1.5 rounded-lg text-xs font-600 transition-all ${
              filter === 'image'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Images ({imagesCount})
          </button>
          <button
            onClick={() => setFilter('document')}
            className={`px-3 py-1.5 rounded-lg text-xs font-600 transition-all ${
              filter === 'document'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Documents ({docsCount})
          </button>
        </div>

        {/* Upload Button */}
        <div>
          <button
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-600 hover:opacity-90 transition-all duration-150 btn-press shadow-sm"
          >
            {uploading ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                Téléversement...
              </>
            ) : (
              <>
                <Icon name="ArrowUpTrayIcon" size={16} />
                Importer un média
              </>
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={`skel-m-${i}`} className="bg-card border border-border rounded-xl h-44 animate-pulse p-3 flex flex-col justify-between">
              <div className="h-28 bg-muted rounded-lg" />
              <div className="h-3 bg-muted rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center p-12 text-center bg-card border border-dashed border-border rounded-2xl">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
            <Icon name="PhotoIcon" size={28} />
          </div>
          <h3 className="text-base font-700 text-foreground mb-1">
            Aucun média dans cette catégorie
          </h3>
          <p className="text-xs text-muted-foreground max-w-md mb-6 leading-relaxed">
            Importez des captures d&apos;écran, schémas d&apos;architecture, photos de conférences ou justificatifs pour vos portfolios.
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-xs font-600 hover:opacity-90"
          >
            <Icon name="ArrowUpTrayIcon" size={14} />
            Importer mon premier média
          </button>
        </div>
      ) : (
        /* Grid */
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-card border border-border rounded-xl overflow-hidden shadow-card card-hover cursor-pointer group flex flex-col justify-between"
              onClick={() => setSelectedMedia(item)}
            >
              <div className="relative h-32 bg-muted overflow-hidden">
                {item.mediaType === 'image' && item.fileUrl && item.fileUrl !== '#' ? (
                  <AppImage
                    src={item.fileUrl}
                    alt={item.altText || item.fileName}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                ) : (
                  <div className="h-full bg-muted flex items-center justify-center text-muted-foreground">
                    <Icon name="DocumentTextIcon" size={36} />
                  </div>
                )}

                {/* Hover overlay with delete */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => handleDelete(item, e)}
                    disabled={deletingId === item.id}
                    className="p-1.5 rounded-lg bg-black/60 text-white hover:bg-red-600 transition-colors"
                    title="Supprimer ce média"
                  >
                    {deletingId === item.id ? (
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Icon name="TrashIcon" size={13} />
                    )}
                  </button>
                </div>
              </div>

              <div className="p-3">
                <p className="text-xs font-700 text-foreground leading-tight truncate group-hover:text-primary transition-colors">
                  {item.fileName}
                </p>
                <p className="text-[11px] text-muted-foreground mt-1 flex items-center justify-between">
                  <span className="truncate">{item.project || 'Général'}</span>
                  {item.fileSize && <span className="tabular-nums flex-shrink-0">{item.fileSize}</span>}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox / Preview Modal */}
      {selectedMedia && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/60 backdrop-blur-sm"
          onClick={() => setSelectedMedia(null)}
        >
          <div
            className="bg-card rounded-2xl shadow-modal border border-border p-5 max-w-2xl w-full mx-4 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-700 text-foreground text-sm">{selectedMedia.fileName}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Projet : {selectedMedia.project || 'Général'} · Taille : {selectedMedia.fileSize || 'N/A'}
                </p>
              </div>
              <button
                onClick={() => setSelectedMedia(null)}
                className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground"
              >
                <Icon name="XMarkIcon" size={18} />
              </button>
            </div>

            <div className="rounded-xl overflow-hidden bg-muted mb-4 max-h-[60vh] flex items-center justify-center border border-border">
              {selectedMedia.mediaType === 'image' && selectedMedia.fileUrl && selectedMedia.fileUrl !== '#' ? (
                <img
                  src={selectedMedia.fileUrl}
                  alt={selectedMedia.altText || selectedMedia.fileName}
                  className="w-full h-auto max-h-[60vh] object-contain"
                />
              ) : (
                <div className="p-12 text-center text-muted-foreground">
                  <Icon name="DocumentTextIcon" size={48} className="mx-auto mb-2 text-primary" />
                  <p className="text-xs font-600">Document PDF ou fichier attaché</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border">
              <button
                onClick={(e) => handleDelete(selectedMedia, e)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-600 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                <Icon name="TrashIcon" size={13} />
                Supprimer
              </button>

              <div className="flex items-center gap-2">
                {selectedMedia.fileUrl && selectedMedia.fileUrl !== '#' && (
                  <>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(selectedMedia.fileUrl);
                        toast.success('Lien du média copié dans le presse-papier !');
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-muted text-foreground hover:bg-muted/80 rounded-lg text-xs font-600 transition-colors"
                    >
                      <Icon name="LinkIcon" size={13} />
                      Copier le lien
                    </button>
                    <a
                      href={selectedMedia.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground hover:opacity-90 rounded-lg text-xs font-600 transition-all"
                    >
                      <Icon name="ArrowTopRightOnSquareIcon" size={13} />
                      Ouvrir plein écran
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}