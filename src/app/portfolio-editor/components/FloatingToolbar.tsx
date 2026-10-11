'use client';

import React, { useRef, useState } from 'react';
import type { BlockElement } from './PortfolioEditorContent';

interface FloatingToolbarProps {
  el: BlockElement;
  onUpdate: (el: BlockElement) => void;
  onDelete?: () => void;
  onEdit?: () => void;
}

const FONTS = [
  'Plus Jakarta Sans', 'DM Sans', 'Manrope', 'Inter', 'Fraunces', 'JetBrains Mono', 'Georgia', 'Arial', 'Helvetica'
];
const SIZES = ['10', '12', '14', '16', '18', '20', '24', '28', '32', '36', '40', '48', '56', '64', '72', '96'];

export default function FloatingToolbar({ el, onUpdate, onDelete, onEdit }: FloatingToolbarProps) {
  const style = el.style || {};

  const update = (key: string, value: string) =>
    onUpdate({ ...el, style: { ...el.style, [key]: value } });

  const toggle = (key: string, a: string, b: string) =>
    update(key, style[key] === a ? b : a);

  const isBold      = style.fontWeight === 'bold' || style.fontWeight === '700';
  const isItalic    = style.fontStyle  === 'italic';
  const isUnderline = style.textDecoration === 'underline';
  const currentFont = style.fontFamily || 'Plus Jakarta Sans';
  const currentSize = style.fontSize ? parseInt(String(style.fontSize)) : 16;

  const btnBase = 'flex items-center justify-center w-7 h-7 rounded-md text-xs font-600 transition-all hover:bg-white/20';
  const btnActive = 'bg-white/30 text-white';
  const btnInactive = 'text-white/80';

  const isText = el.type === 'text';

  return (
    <div
      onMouseDown={(e) => e.stopPropagation()}
      style={{
        position: 'absolute',
        bottom: '100%',
        left: '50%',
        transform: 'translateX(-50%)',
        marginBottom: 8,
        background: 'rgba(17, 24, 39, 0.95)',
        backdropFilter: 'blur(12px)',
        borderRadius: 10,
        border: '1px solid rgba(255,255,255,0.12)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        padding: '4px 6px',
        zIndex: 200,
        whiteSpace: 'nowrap',
        userSelect: 'none',
      }}
    >
      {/* Font family */}
      {isText && (
        <select
          value={currentFont}
          onChange={(e) => update('fontFamily', e.target.value)}
          style={{
            background: 'transparent',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 6,
            padding: '2px 4px',
            fontSize: 11,
            cursor: 'pointer',
            maxWidth: 130,
          }}
        >
          {FONTS.map(f => <option key={f} value={f} style={{ background: '#111827' }}>{f}</option>)}
        </select>
      )}

      {isText && <Divider />}

      {/* Font size */}
      {isText && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <button
            className={btnBase}
            onClick={() => update('fontSize', `${Math.max(8, currentSize - 2)}px`)}
          ><span style={{ color: 'white', fontSize: 14 }}>−</span></button>
          <select
            value={String(currentSize)}
            onChange={(e) => update('fontSize', `${e.target.value}px`)}
            style={{
              background: 'transparent', color: 'white',
              border: '1px solid rgba(255,255,255,0.2)', borderRadius: 6,
              padding: '2px 2px', fontSize: 11, cursor: 'pointer', width: 42,
              textAlign: 'center',
            }}
          >
            {SIZES.map(s => <option key={s} value={s} style={{ background: '#111827' }}>{s}</option>)}
          </select>
          <button
            className={btnBase}
            onClick={() => update('fontSize', `${Math.min(200, currentSize + 2)}px`)}
          ><span style={{ color: 'white', fontSize: 14 }}>+</span></button>
        </div>
      )}

      {isText && <Divider />}

      {/* Bold / Italic / Underline */}
      {isText && (
        <>
          <button className={`${btnBase} ${isBold ? btnActive : btnInactive}`}
            onClick={() => toggle('fontWeight', 'bold', 'normal')}
          ><b>B</b></button>
          <button className={`${btnBase} ${isItalic ? btnActive : btnInactive}`}
            onClick={() => toggle('fontStyle', 'italic', 'normal')}
          ><i>I</i></button>
          <button className={`${btnBase} ${isUnderline ? btnActive : btnInactive}`}
            onClick={() => toggle('textDecoration', 'underline', 'none')}
          ><u>U</u></button>
          <Divider />
        </>
      )}

      {/* Text align (text only) */}
      {isText && (
        <>
          {(['left', 'center', 'right'] as const).map(a => (
            <button
              key={a}
              className={`${btnBase} ${style.textAlign === a ? btnActive : btnInactive}`}
              onClick={() => update('textAlign', a)}
            >
              {a === 'left'   && <AlignLeft />}
              {a === 'center' && <AlignCenter />}
              {a === 'right'  && <AlignRight />}
            </button>
          ))}
          <Divider />
        </>
      )}

      {/* Color */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', letterSpacing: 0.5 }}>
          {isText ? 'A' : '▣'}
        </span>
        <input
          type="color"
          value={isText ? (style.color || '#000000') : (style.backgroundColor || '#cccccc')}
          onChange={(e) => update(isText ? 'color' : 'backgroundColor', e.target.value)}
          style={{
            width: 22, height: 22, border: 'none', padding: 0, cursor: 'pointer',
            borderRadius: 4, background: 'none',
          }}
        />
      </div>

      {/* Z-Index buttons */}
      <Divider />
      <button
        className={`${btnBase} ${btnInactive}`}
        title="Passer en avant-plan"
        onClick={() => onUpdate({ ...el, zIndex: (el.zIndex || 1) + 1 })}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <rect x="4" y="4" width="8" height="8" rx="1" stroke="white" strokeWidth="1.3" fill="rgba(255,255,255,0.2)"/>
          <rect x="2" y="2" width="8" height="8" rx="1" stroke="rgba(255,255,255,0.4)" strokeWidth="1" strokeDasharray="2 2"/>
        </svg>
      </button>
      <button
        className={`${btnBase} ${btnInactive}`}
        title="Passer en arrière-plan"
        onClick={() => onUpdate({ ...el, zIndex: Math.max(0, (el.zIndex || 1) - 1) })}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <rect x="2" y="2" width="8" height="8" rx="1" stroke="white" strokeWidth="1.3" fill="rgba(255,255,255,0.2)"/>
          <rect x="4" y="4" width="8" height="8" rx="1" stroke="rgba(255,255,255,0.4)" strokeWidth="1" strokeDasharray="2 2"/>
        </svg>
      </button>

      {/* Edit button */}
      {isText && (
        <>
          <Divider />
          <button
            className={`${btnBase} px-2 w-auto gap-1 bg-primary text-primary-foreground hover:bg-primary/90`}
            title="Éditer le texte"
            onClick={() => onEdit?.()}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            Éditer
          </button>
        </>
      )}

      {/* Delete button */}
      <Divider />
      <button
        className={`${btnBase} text-red-400 hover:bg-red-500/20`}
        title="Supprimer"
        onClick={() => onDelete?.()}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        </svg>
      </button>
    </div>
  );
}

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const Divider = () => (
  <div style={{ width: 1, height: 18, background: 'rgba(255,255,255,0.15)', margin: '0 2px' }} />
);
const AlignLeft = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <rect x="1" y="2" width="10" height="1.5" rx="0.5" fill="currentColor"/>
    <rect x="1" y="5" width="7"  height="1.5" rx="0.5" fill="currentColor"/>
    <rect x="1" y="8" width="9"  height="1.5" rx="0.5" fill="currentColor"/>
  </svg>
);
const AlignCenter = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <rect x="1" y="2" width="10" height="1.5" rx="0.5" fill="currentColor"/>
    <rect x="2.5" y="5" width="7" height="1.5" rx="0.5" fill="currentColor"/>
    <rect x="1.5" y="8" width="9" height="1.5" rx="0.5" fill="currentColor"/>
  </svg>
);
const AlignRight = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <rect x="1" y="2" width="10" height="1.5" rx="0.5" fill="currentColor"/>
    <rect x="4" y="5" width="7"  height="1.5" rx="0.5" fill="currentColor"/>
    <rect x="2" y="8" width="9"  height="1.5" rx="0.5" fill="currentColor"/>
  </svg>
);
