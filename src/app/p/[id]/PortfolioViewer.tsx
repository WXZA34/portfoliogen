'use client';

import React from 'react';
import CanvasEditor from '@/app/portfolio-editor/components/CanvasEditor';
import { PortfolioDesign } from '@/app/portfolio-editor/components/PortfolioEditorContent';

export default function PortfolioViewer({ design }: { design: PortfolioDesign }) {
  // En mode aperçu, on met showPreview à true et on donne des fonctions vides
  return (
    <div className="flex justify-center w-full min-h-screen bg-background">
      <CanvasEditor
        design={design}
        selectedBlockId={null}
        previewMode="desktop"
        showPreview={true}
        dragOverIndex={null}
        onSelectBlock={() => {}}
        onUpdateBlock={() => {}}
        onDeleteBlock={() => {}}
        onMoveBlock={() => {}}
        onDragStart={() => {}}
        onDrop={() => {}}
        onDragOver={() => {}}
        onOpenCustomize={() => {}}
      />
    </div>
  );
}
