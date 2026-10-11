'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import type { BlockElement } from './PortfolioEditorContent';
import FloatingToolbar from './FloatingToolbar';

interface CanvasElementProps {
  el: BlockElement;
  isSelected: boolean;
  canvasWidth: number;
  onSelect: (id: string) => void;
  onUpdate: (el: BlockElement) => void;
  onDelete?: () => void;
  scale?: number;
  children: React.ReactNode;
}

const HANDLE_SIZE = 12;

export default function CanvasElement({
  el, isSelected, canvasWidth, onSelect, onUpdate, onDelete, scale = 1, children
}: CanvasElementProps) {

  const [isEditing, setIsEditing] = useState(false);
  const editRef = useRef<HTMLDivElement>(null);

  const parseDim = (val: any, base: number, def: number) => {
    if (val === undefined || val === null) return def;
    if (typeof val === 'number') return val;
    if (typeof val === 'string') {
      if (val.includes('%')) return (parseFloat(val) / 100) * base;
      const parsed = parseFloat(val);
      return isNaN(parsed) ? def : parsed;
    }
    return def;
  };

  const x        = parseDim(el.x, canvasWidth, 0);
  const y        = parseDim(el.y, canvasWidth, 0);
  const w        = Math.max(1, parseDim(el.width, canvasWidth, 200));
  const h        = Math.max(1, parseDim(el.height, canvasWidth, 100));
  const rotation = (el.style as any)?.rotation || 0;

  const containerRef = useRef<HTMLDivElement>(null);
  const dragging     = useRef(false);
  const resizing     = useRef<string | null>(null);
  const rotating     = useRef(false);
  const startInfo    = useRef({ mouseX: 0, mouseY: 0, elX: 0, elY: 0, elW: 0, elH: 0 });
  const didMove      = useRef(false); // track if we actually dragged vs just clicked
  const lastTap      = useRef(0);

  // ─── Deselect on outside click ────────────────────────────────────────────
  useEffect(() => {
    if (!isSelected) { setIsEditing(false); return; }
  }, [isSelected]);

  // Focus inline editor when entering edit mode
  useEffect(() => {
    if (isEditing && editRef.current) {
      editRef.current.focus();
      // Move cursor to end
      const range = document.createRange();
      range.selectNodeContents(editRef.current);
      range.collapse(false);
      window.getSelection()?.removeAllRanges();
      window.getSelection()?.addRange(range);
    }
  }, [isEditing]);

  // ─── Global Keyboard Delete ─────────────────────────────────────────────
  useEffect(() => {
    if (!isSelected || isEditing) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        onDelete?.();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSelected, isEditing, onDelete]);

  // ─── DRAG ─────────────────────────────────────────────────────────────────
  const handlePointerDownDrag = useCallback((e: React.PointerEvent) => {
    if ((e.target as HTMLElement).dataset.handle) return;
    if (isEditing) return; // don't drag while editing text
    e.preventDefault();
    e.stopPropagation();
    onSelect(el.id);

    if (e.pointerType === 'touch') {
      const now = Date.now();
      if (now - lastTap.current < 400) {
        // Double tap! Allow drag
      } else {
        lastTap.current = now;
        return; // Prevent dragging on first tap
      }
    }

    if (e.pointerType === 'touch') {
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    }

    dragging.current = true;
    didMove.current = false;
    startInfo.current = { mouseX: e.clientX, mouseY: e.clientY, elX: x, elY: y, elW: w, elH: h };

    const onMove = (me: PointerEvent) => {
      if (!dragging.current) return;
      const dx = (me.clientX - startInfo.current.mouseX) / scale;
      const dy = (me.clientY - startInfo.current.mouseY) / scale;
      if (Math.abs(dx) > 2 || Math.abs(dy) > 2) didMove.current = true;
      onUpdate({ ...el, x: Math.round(startInfo.current.elX + dx), y: Math.round(startInfo.current.elY + dy) });
    };
    const onUp = (me: PointerEvent) => {
      dragging.current = false;
      try { (me.target as HTMLElement).releasePointerCapture(me.pointerId); } catch(err){}
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
  }, [el, x, y, w, h, isEditing, onSelect, onUpdate]);

  // ─── DOUBLE CLICK → inline edit ──────────────────────────────────────────
  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (el.type === 'text') {
      setIsEditing(true);
    }
  }, [el.type]);

  // ─── RESIZE ───────────────────────────────────────────────────────────────
  const handlePointerDownResize = useCallback((e: React.PointerEvent, corner: string) => {
    e.stopPropagation();
    resizing.current = corner;
    if (e.pointerType === 'touch') {
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    }
    startInfo.current = { mouseX: e.clientX, mouseY: e.clientY, elX: x, elY: y, elW: w, elH: h };

    const onMove = (me: PointerEvent) => {
      if (!resizing.current) return;
      const dx = (me.clientX - startInfo.current.mouseX) / scale;
      const dy = (me.clientY - startInfo.current.mouseY) / scale;
      let newX = startInfo.current.elX;
      let newY = startInfo.current.elY;
      let newW = startInfo.current.elW;
      let newH = startInfo.current.elH;

      if (resizing.current.includes('e')) newW = Math.max(40, newW + dx);
      if (resizing.current.includes('s')) newH = Math.max(20, newH + dy);
      if (resizing.current.includes('w')) { newW = Math.max(40, newW - dx); newX = startInfo.current.elX + dx; }
      if (resizing.current.includes('n')) { newH = Math.max(20, newH - dy); newY = startInfo.current.elY + dy; }

      onUpdate({ ...el, x: Math.round(newX), y: Math.round(newY), width: Math.round(newW), height: Math.round(newH) });
    };
    const onUp = (me: PointerEvent) => {
      resizing.current = null;
      try { (me.target as HTMLElement).releasePointerCapture(me.pointerId); } catch(err){}
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
  }, [el, x, y, w, h, onUpdate]);

  // ─── ROTATE ───────────────────────────────────────────────────────────────
  const handlePointerDownRotate = useCallback((e: React.PointerEvent) => {
    e.stopPropagation();
    rotating.current = true;
    if (e.pointerType === 'touch') {
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    }
    const rect = containerRef.current!.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const onMove = (me: PointerEvent) => {
      if (!rotating.current) return;
      const angle = Math.round(Math.atan2(me.clientY - cy, me.clientX - cx) * (180 / Math.PI) + 90);
      onUpdate({ ...el, style: { ...el.style, rotation: angle } });
    };
    const onUp = (me: PointerEvent) => {
      rotating.current = false;
      try { (me.target as HTMLElement).releasePointerCapture(me.pointerId); } catch(err){}
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
  }, [el, onUpdate]);

  // ─── Resize handles ───────────────────────────────────────────────────────
  const handles = isSelected ? [
    { id: 'n',  top: -HANDLE_SIZE/2,   left: '50%',            transform: 'translateX(-50%)', cursor: 'n-resize'  },
    { id: 's',  top: h-HANDLE_SIZE/2,  left: '50%',            transform: 'translateX(-50%)', cursor: 's-resize'  },
    { id: 'e',  top: '50%',            left: w-HANDLE_SIZE/2,  transform: 'translateY(-50%)', cursor: 'e-resize'  },
    { id: 'w',  top: '50%',            left: -HANDLE_SIZE/2,   transform: 'translateY(-50%)', cursor: 'w-resize'  },
    { id: 'nw', top: -HANDLE_SIZE/2,   left: -HANDLE_SIZE/2,   transform: '',                 cursor: 'nw-resize' },
    { id: 'ne', top: -HANDLE_SIZE/2,   left: w-HANDLE_SIZE/2,  transform: '',                 cursor: 'ne-resize' },
    { id: 'sw', top: h-HANDLE_SIZE/2,  left: -HANDLE_SIZE/2,   transform: '',                 cursor: 'sw-resize' },
    { id: 'se', top: h-HANDLE_SIZE/2,  left: w-HANDLE_SIZE/2,  transform: '',                 cursor: 'se-resize' },
  ] : [];

  const elStyle = el.style || {};

  return (
    <div
      ref={containerRef}
      data-element-id={el.id}
      onPointerDown={handlePointerDownDrag}
      onDoubleClick={handleDoubleClick}
      onClick={(e) => e.stopPropagation()}
      draggable={true}
      onDragStart={(e) => { e.preventDefault(); e.stopPropagation(); }}
      style={{
        position: 'absolute',
        touchAction: 'none',
        left: x,
        top: y,
        width: w,
        height: el.type === 'text' ? 'auto' : h,
        transform: `rotate(${rotation}deg)`,
        transformOrigin: 'center center',
        zIndex: el.zIndex || 1,
        cursor: isEditing ? 'text' : 'move',
        userSelect: isEditing ? 'text' : 'none',
        boxSizing: 'border-box',
        outline: isSelected
          ? (isEditing ? '2px solid #10b981' : '2px solid #3b82f6')
          : '2px solid transparent',
        outlineOffset: '1px',
      }}
    >
      {/* Floating toolbar (shows when selected & not editing) */}
      {isSelected && !isEditing && (
        <FloatingToolbar el={el} onUpdate={onUpdate} onDelete={onDelete} onEdit={() => setIsEditing(true)} />
      )}

      {/* Inline text editor (contenteditable on double-click) */}
      {isEditing && el.type === 'text' ? (
        <div
          ref={editRef}
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => {
            const newText = e.currentTarget.innerText;
            onUpdate({ ...el, content: newText });
            setIsEditing(false);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setIsEditing(false);
            }
          }}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: '100%',
            height: '100%',
            outline: 'none',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            color: isEditing && elStyle.color === 'transparent' ? '#000000' : (elStyle.color || 'inherit'),
            fontSize: elStyle.fontSize || '16px',
            fontFamily: elStyle.fontFamily || 'inherit',
            fontWeight: elStyle.fontWeight || 'normal',
            fontStyle: elStyle.fontStyle || 'normal',
            textDecoration: elStyle.textDecoration || 'none',
            textAlign: (elStyle.textAlign as any) || 'left',
            lineHeight: 1.5,
            cursor: 'text',
            padding: 0,
            backgroundColor: elStyle.backgroundColor || 'transparent',
          }}
        >
          {el.content}
        </div>
      ) : (
        /* Normal render */
        <div style={{
          width: '100%', height: '100%',
          overflow: 'hidden', display: 'flex', alignItems: 'flex-start',
          pointerEvents: isEditing ? 'none' : 'auto',
        }}>
          {children}
        </div>
      )}

      {/* Rotation handle */}
      {isSelected && !isEditing && (
        <div
          data-handle="rotate"
          onPointerDown={handlePointerDownRotate}
          style={{
            touchAction: 'none',
            position: 'absolute',
            top: -28,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 16,
            height: 16,
            borderRadius: '50%',
            backgroundColor: '#3b82f6',
            border: '2px solid white',
            cursor: 'grab',
            zIndex: 202,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M5 1.5A3.5 3.5 0 1 1 1.5 5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M1.5 3V5H3.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      )}

      {/* Resize handles */}
      {!isEditing && handles.map(handle => (
        <div
          key={handle.id}
          data-handle={handle.id}
          onPointerDown={(e) => handlePointerDownResize(e, handle.id)}
          style={{
            touchAction: 'none',
            position: 'absolute',
            top: handle.top,
            left: handle.left,
            transform: handle.transform,
            width: HANDLE_SIZE,
            height: HANDLE_SIZE,
            backgroundColor: 'white',
            border: '2px solid #3b82f6',
            borderRadius: '2px',
            cursor: handle.cursor,
            zIndex: 201,
          }}
        />
      ))}
    </div>
  );
}
