'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

const mediaItems = [
{ id: 'media-001', type: 'image', title: 'NeuralCommerce Dashboard Screenshot', url: "https://images.unsplash.com/photo-1573311525852-81c1a0b8d03c", alt: 'Dashboard with analytics charts and blue color scheme', project: 'NeuralCommerce', size: '1.2 MB' },
{ id: 'media-002', type: 'image', title: 'API Architecture Diagram', url: "https://img.rocket.new/generatedImages/rocket_gen_img_1841773bc-1772134831273.png", alt: 'Server infrastructure diagram with network nodes', project: 'DistributedDB', size: '0.8 MB' },
{ id: 'media-003', type: 'image', title: 'Team Photo — Mistral AI Offsite', url: "https://images.unsplash.com/photo-1637979911089-bf0d73f0b9c5", alt: 'Team members gathered around a conference table with laptops', project: 'General', size: '2.4 MB' },
{ id: 'media-004', type: 'image', title: 'CLI Framework Demo Recording', url: "https://img.rocket.new/generatedImages/rocket_gen_img_1cdbf6271-1772634211849.png", alt: 'Terminal screen showing CLI commands with colorful output', project: 'CLI Forge', size: '3.1 MB' },
{ id: 'media-005', type: 'image', title: 'Conference Talk — Paris.js 2025', url: "https://images.unsplash.com/photo-1590674680695-8b9efe9b764d", alt: 'Speaker presenting on stage with large projection screen', project: 'General', size: '1.8 MB' },
{ id: 'media-006', type: 'image', title: 'Monitoring Dashboard — Datadog', url: "https://img.rocket.new/generatedImages/rocket_gen_img_1ce24c857-1770111338132.png", alt: 'Multiple monitoring graphs and metrics on computer screen', project: 'Datadog', size: '0.9 MB' },
{ id: 'media-007', type: 'document', title: 'Technical Architecture — Whitepaper', url: '#', alt: '', project: 'NeuralCommerce', size: '0.4 MB' },
{ id: 'media-008', type: 'document', title: 'Research Paper — Graph Neural Networks', url: '#', alt: '', project: 'INRIA', size: '1.1 MB' }];

type MediaItem = (typeof mediaItems)[number];

export default function MediaGallery() {
  const [filter, setFilter] = useState('all');
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);

  const filtered = filter === 'all' ? mediaItems : mediaItems?.filter((m) => m?.type === filter);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          {['all', 'image', 'document']?.map((f) =>
          <button
            key={`media-filter-${f}`}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-600 transition-all duration-150 ${
            filter === f ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`
            }>
            
              {f?.charAt(0)?.toUpperCase() + f?.slice(1)}
            </button>
          )}
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-600 hover:opacity-90 transition-all duration-150 btn-press">
          <Icon name="UploadIcon" size={15} />
          Upload Media
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
        {filtered?.map((item) =>
        <div
          key={item?.id}
          className="bg-card border border-border rounded-xl overflow-hidden shadow-card card-hover cursor-pointer group"
          onClick={() => item?.type === 'image' && setSelectedMedia(item)}>
          
            {item?.type === 'image' ?
          <div className="relative h-32">
                <AppImage src={item?.url} alt={item?.alt} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 768px) 50vw, 25vw" />
              </div> :

          <div className="h-32 bg-muted flex items-center justify-center">
                <Icon name="FileTextIcon" size={32} className="text-muted-foreground" />
              </div>
          }
            <div className="p-3">
              <p className="text-xs font-600 text-foreground leading-tight truncate">{item?.title}</p>
              <p className="text-xs text-muted-foreground mt-1">{item?.project} · {item?.size}</p>
            </div>
          </div>
        )}
      </div>

      {selectedMedia &&
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm" onClick={() => setSelectedMedia(null)}>
          <div className="bg-card rounded-2xl shadow-modal border border-border p-4 max-w-2xl w-full mx-4 animate-scale-in" onClick={(e) => e?.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <p className="font-700 text-foreground">{selectedMedia?.title}</p>
              <button onClick={() => setSelectedMedia(null)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground">
                <Icon name="XIcon" size={16} />
              </button>
            </div>
            <AppImage src={selectedMedia?.url} alt={selectedMedia?.alt} width={800} height={500} className="w-full rounded-xl object-cover" />
          </div>
        </div>
      }
    </div>);

}