'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';
import type { Talent } from './TalentCard';

interface ContactModalProps {
  talent: Talent | null;
  onClose: () => void;
}

export default function ContactModal({ talent, onClose }: ContactModalProps) {
  const [form, setForm] = useState({ name: '', company: '', email: '', role: '', message: '' });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  if (!talent) return null;

  const handleSend = async () => {
    if (!form.name || !form.email || !form.message) return;
    setSending(true);
    await new Promise((r) => setTimeout(r, 900));
    setSending(false);
    setSent(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-2xl shadow-modal w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 p-5 border-b border-border">
          <AppImage src={talent.avatar} alt={talent.avatarAlt} className="w-10 h-10 rounded-xl object-cover" />
          <div className="flex-1 min-w-0">
            <h3 className="font-700 text-foreground">Contacter {talent.name}</h3>
            <p className="text-xs text-muted-foreground">{talent.title}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition-all text-muted-foreground">
            <Icon name="XIcon" size={16} />
          </button>
        </div>

        {sent ? (
          <div className="p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
              <Icon name="CheckCircleIcon" size={28} className="text-emerald-500" />
            </div>
            <h3 className="font-700 text-foreground mb-2">Message envoyé !</h3>
            <p className="text-sm text-muted-foreground mb-5">
              {talent.name} recevra votre message directement dans son dashboard. Vous serez notifié de sa réponse.
            </p>
            <button onClick={onClose} className="px-5 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-600 hover:bg-primary/90 transition-all">
              Fermer
            </button>
          </div>
        ) : (
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-600 text-muted-foreground mb-1.5">Votre nom *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Sarah Chen"
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-600 text-muted-foreground mb-1.5">Entreprise</label>
                <input
                  type="text"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  placeholder="TechCorp"
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-600 text-muted-foreground mb-1.5">Email *</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="sarah@techcorp.com"
                className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-600 text-muted-foreground mb-1.5">Poste proposé</label>
              <input
                type="text"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                placeholder="Senior Full-Stack Engineer"
                className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-600 text-muted-foreground mb-1.5">Message *</label>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={4}
                placeholder={`Bonjour ${talent.name}, j'ai consulté votre portfolio et je suis très intéressé(e) par votre profil...`}
                className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none"
              />
            </div>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-primary/5 border border-primary/20 text-xs text-muted-foreground">
              <Icon name="InfoIcon" size={13} className="text-primary flex-shrink-0" />
              Le message sera envoyé directement dans le dashboard de {talent.name} avec notification temps réel.
            </div>
            <button
              onClick={handleSend}
              disabled={!form.name || !form.email || !form.message || sending}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-600 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {sending ? (
                <>
                  <Icon name="LoaderIcon" size={15} className="animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Icon name="SendIcon" size={15} />
                  Envoyer le message
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
