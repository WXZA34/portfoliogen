import React from 'react';
import type { Block } from './PortfolioEditorContent';
import Icon from '@/components/ui/AppIcon';

interface PageStripProps {
  blocks: Block[];
  selectedBlockId: string | null;
  onSelectBlock: (id: string) => void;
  onAddBlock: () => void;
}

export default function PageStrip({ blocks, selectedBlockId, onSelectBlock, onAddBlock }: PageStripProps) {
  return (
    <div className="h-28 bg-gray-100 border-t border-gray-300 flex items-center px-4 overflow-x-auto gap-3 shrink-0">
      {blocks.map((block, index) => (
        <div key={block.id} className="flex items-center gap-2 group">
          <button
            onClick={() => onSelectBlock(block.id)}
            className={`relative flex-shrink-0 w-32 h-20 rounded-md border-2 overflow-hidden transition-all bg-white flex flex-col items-center justify-center ${
              selectedBlockId === block.id ? 'border-primary ring-2 ring-primary/30 ring-offset-1' : 'border-gray-200 hover:border-gray-400'
            }`}
          >
            {/* Very basic thumbnail content */}
            <span className="text-xs font-semibold text-gray-400">
              {block.content?.title as string || `Slide ${index + 1}`}
            </span>
            <div className="absolute bottom-1 left-1 bg-black/50 text-white text-[10px] px-1.5 rounded-sm font-mono">
              {index + 1}
            </div>
          </button>
          
          {/* Connector if not last */}
          {index < blocks.length - 1 && (
            <div className="w-4 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Icon name="ArrowRightIcon" size={12} className="text-gray-400" />
            </div>
          )}
        </div>
      ))}

      <button
        onClick={onAddBlock}
        className="flex-shrink-0 w-16 h-20 rounded-md border-2 border-dashed border-gray-300 hover:border-primary hover:bg-primary/5 flex items-center justify-center transition-all ml-2"
        title="Ajouter une slide"
      >
        <Icon name="PlusIcon" size={20} className="text-gray-500" />
      </button>
    </div>
  );
}
