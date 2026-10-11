'use client';

import React, { useState, useRef, useCallback } from 'react';
import Icon from '@/components/ui/AppIcon';
import { createClient } from '@/lib/supabase/client';

interface MediaPanelProps {
  onInsertImage: (url: string) => void;
}

export default function MediaPanel({ onInsertImage }: MediaPanelProps) {
  const [uploading, setUploading] = useState(false);
  const [gallery, setGallery] = useState<{ name: string; url: string }[]>([]);
  const [galleryLoaded, setGalleryLoaded] = useState(false);
  const [draggingOver, setDraggingOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload-image', { method: 'POST', body: formData });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erreur upload');
    return data.url as string;
  };

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const url = await uploadFile(file);
        onInsertImage(url);
        setGallery(prev => [{ name: file.name, url }, ...prev]);
      }
    } catch (err: any) {
      alert('Erreur : ' + err.message);
    } finally {
      setUploading(false);
    }
  }, [onInsertImage]);

  const loadGallery = async () => {
    if (galleryLoaded) return;
    setGalleryLoaded(true);
    try {
      const supabase = createClient();
      const { data } = await supabase.storage.from('portfolio-media').list('editor', {
        limit: 50, sortBy: { column: 'created_at', order: 'desc' }
      });
      if (data) {
        const supabase2 = createClient();
        const items = data.map(f => {
          const { data: u } = supabase2.storage.from('portfolio-media').getPublicUrl(`editor/${f.name}`);
          return { name: f.name, url: u.publicUrl };
        });
        setGallery(items);
      }
    } catch (e) { /* silent */ }
  };

  // Load gallery on mount
  React.useEffect(() => { loadGallery(); }, []);

  return (
    <div className="flex flex-col h-full">
      {/* Upload zone */}
      <div className="p-3 border-b border-border flex-shrink-0">
        <p className="text-xs font-700 text-muted-foreground uppercase tracking-wider mb-2">
          Importer une image
        </p>

        {/* Drag & drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDraggingOver(true); }}
          onDragLeave={() => setDraggingOver(false)}
          onDrop={(e) => { e.preventDefault(); setDraggingOver(false); handleFiles(e.dataTransfer.files); }}
          onClick={() => inputRef.current?.click()}
          className={`relative flex flex-col items-center justify-center gap-2 p-5 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
            draggingOver
              ? 'border-primary bg-primary/10 scale-[1.02]'
              : 'border-border hover:border-primary/50 hover:bg-primary/5'
          }`}
        >
          {uploading ? (
            <>
              <Icon name="ArrowPathIcon" size={22} className="text-primary animate-spin" />
              <p className="text-xs font-600 text-primary">Upload en cours...</p>
            </>
          ) : (
            <>
              <Icon name="PhotoIcon" size={22} className="text-muted-foreground" />
              <p className="text-xs font-600 text-foreground text-center">
                Glissez une image ici<br />
                <span className="text-muted-foreground font-400">ou cliquez pour choisir</span>
              </p>
              <p className="text-[10px] text-muted-foreground">JPG, PNG, WebP, GIF</p>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>
      </div>

      {/* Gallery */}
      <div className="flex-1 overflow-y-auto p-3">
        <p className="text-xs font-700 text-muted-foreground uppercase tracking-wider mb-2">
          Mes images ({gallery.length})
        </p>

        {gallery.length === 0 && !uploading && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Icon name="PhotoIcon" size={28} className="text-muted-foreground mb-2" />
            <p className="text-xs text-muted-foreground">Vos images importées apparaîtront ici</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-1.5">
          {gallery.map((item) => (
            <div
              key={item.url}
              className="group relative aspect-square rounded-lg overflow-hidden cursor-pointer border border-border hover:border-primary/50 transition-all"
              onClick={() => onInsertImage(item.url)}
              title={item.name}
            >
              <img
                src={item.url}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-primary/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Icon name="PlusCircleIcon" size={20} className="text-white" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
