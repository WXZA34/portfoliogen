'use client';

import React, { useState, useEffect, useRef } from 'react';
import Icon from '@/components/ui/AppIcon';
import { createClient } from '@/lib/supabase/client';

interface RecruiterChatboxProps {
  open: boolean;
  onToggle: () => void;
  portfolioOwnerId?: string;
}

interface ChatMessage {
  id: string;
  sender_name: string;
  sender_company?: string;
  content: string;
  is_read: boolean;
  reply_content?: string;
  replied_at?: string;
  created_at: string;
  is_recruiter: boolean;
}

export default function RecruiterChatbox({ open, onToggle, portfolioOwnerId }: RecruiterChatboxProps) {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sessionKey, setSessionKey] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  // Scroll to bottom on new messages
  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  // Load existing conversation if session key exists
  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('recruiter_session_key') : null;
    if (stored) {
      setSessionKey(stored);
      loadConversation(stored);
    }
  }, []);

  // Subscribe to real-time replies when session is active
  useEffect(() => {
    if (!sessionKey) return;

    const channel = supabase
      .channel(`recruiter_chat_${sessionKey}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'recruiter_messages',
          filter: `id=eq.${sessionKey}`,
        },
        (payload) => {
          const updated = payload.new as any;
          if (updated.reply_content) {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === updated.id
                  ? { ...m, reply_content: updated.reply_content, replied_at: updated.replied_at }
                  : m
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionKey]);

  async function loadConversation(msgId: string) {
    setLoadingHistory(true);
    try {
      const { data } = await supabase
        .from('recruiter_messages')
        .select('*')
        .eq('id', msgId)
        .single();

      if (data) {
        const msgs: ChatMessage[] = [
          {
            id: data.id,
            sender_name: data.sender_name,
            sender_company: data.sender_company,
            content: data.content,
            is_read: data.is_read,
            reply_content: data.reply_content,
            replied_at: data.replied_at,
            created_at: data.created_at,
            is_recruiter: true,
          },
        ];
        if (data.reply_content) {
          msgs.push({
            id: `reply-${data.id}`,
            sender_name: 'Alexandre Martin',
            content: data.reply_content,
            is_read: true,
            created_at: data.replied_at || data.created_at,
            is_recruiter: false,
          });
        }
        setMessages(msgs);
        setName(data.sender_name || '');
        setCompany(data.sender_company || '');
      }
    } catch {
      // ignore
    } finally {
      setLoadingHistory(false);
    }
  }

  const handleSend = async () => {
    if (!name.trim() || !message.trim()) return;
    setSending(true);
    try {
      const { data, error } = await supabase
        .from('recruiter_messages')
        .insert({
          sender_name: name.trim(),
          sender_company: company.trim() || null,
          content: message.trim(),
          is_read: false,
          portfolio_owner_id: portfolioOwnerId || null,
        })
        .select()
        .single();

      if (!error && data) {
        const msgId = data.id;
        if (typeof window !== 'undefined') {
          localStorage.setItem('recruiter_session_key', msgId);
        }
        setSessionKey(msgId);
        setMessages([
          {
            id: msgId,
            sender_name: name,
            sender_company: company || undefined,
            content: message,
            is_read: false,
            created_at: data.created_at,
            is_recruiter: true,
          },
        ]);
        setMessage('');
      }
    } catch {
      // ignore
    } finally {
      setSending(false);
    }
  };

  const hasSentMessage = messages.length > 0;
  const hasReply = messages.some((m) => !m.is_recruiter);

  function formatTime(iso: string) {
    const d = new Date(iso);
    return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={onToggle}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-amber-900 text-amber-50 rounded-full shadow-card-lg flex items-center justify-center hover:bg-amber-800 transition-all btn-press"
        aria-label="Open recruiter chat"
      >
        <Icon name={open ? 'XIcon' : 'MessageCircleIcon'} size={22} />
        {hasSentMessage && !hasReply && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white" />
        )}
        {hasReply && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white animate-pulse" />
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-40 w-80 bg-white rounded-2xl shadow-modal border border-amber-200 animate-slide-up flex flex-col" style={{ maxHeight: '480px' }}>
          {/* Header */}
          <div className="flex items-center gap-3 p-4 border-b border-amber-100 bg-amber-900 rounded-t-2xl flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-amber-700 flex items-center justify-center text-amber-100 font-bold text-sm">
              AM
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-amber-50">Alexandre Martin</p>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <p className="text-xs text-amber-300">Chat en direct · Supabase Realtime</p>
              </div>
            </div>
          </div>

          {/* Messages area */}
          {hasSentMessage && (
            <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0">
              {loadingHistory ? (
                <div className="flex justify-center py-4">
                  <Icon name="Loader2Icon" size={18} className="animate-spin text-amber-400" />
                </div>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.is_recruiter ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                        msg.is_recruiter
                          ? 'bg-amber-900 text-amber-50 rounded-br-sm' :'bg-amber-100 text-amber-900 rounded-bl-sm'
                      }`}
                    >
                      {!msg.is_recruiter && (
                        <p className="text-xs font-bold text-amber-700 mb-0.5">{msg.sender_name}</p>
                      )}
                      <p className="leading-relaxed">{msg.content}</p>
                      <p className={`text-xs mt-1 ${msg.is_recruiter ? 'text-amber-400' : 'text-amber-500'}`}>
                        {formatTime(msg.created_at)}
                        {msg.is_recruiter && (
                          <span className="ml-1">{msg.is_read ? '✓✓' : '✓'}</span>
                        )}
                      </p>
                    </div>
                  </div>
                ))
              )}
              {!hasReply && hasSentMessage && (
                <div className="flex justify-start">
                  <div className="bg-amber-50 border border-amber-100 rounded-2xl rounded-bl-sm px-3 py-2">
                    <div className="flex gap-1 items-center">
                      <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Input area */}
          {!hasSentMessage ? (
            <div className="p-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-amber-800 mb-1">Votre nom *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Sarah Chen"
                  className="w-full px-3 py-2 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-900 placeholder-amber-400 focus:outline-none focus:border-amber-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-amber-800 mb-1">Entreprise</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="TechCorp Paris"
                  className="w-full px-3 py-2 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-900 placeholder-amber-400 focus:outline-none focus:border-amber-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-amber-800 mb-1">Message *</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Bonjour Alexandre, j'ai découvert votre portfolio et je suis impressionné par votre travail..."
                  rows={3}
                  className="w-full px-3 py-2 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-900 placeholder-amber-400 focus:outline-none focus:border-amber-500 transition-all resize-none"
                />
              </div>
              <button
                onClick={handleSend}
                disabled={sending || !name.trim() || !message.trim()}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-amber-900 text-amber-50 rounded-xl text-sm font-bold hover:bg-amber-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all btn-press"
              >
                {sending ? (
                  <Icon name="Loader2Icon" size={14} className="animate-spin" />
                ) : (
                  <Icon name="SendIcon" size={14} />
                )}
                {sending ? 'Envoi...' : 'Envoyer le message'}
              </button>
              <p className="text-xs text-amber-500 text-center">Votre message sera lu uniquement par Alexandre</p>
            </div>
          ) : (
            <div className="p-3 border-t border-amber-100 flex-shrink-0">
              <p className="text-xs text-amber-500 text-center flex items-center justify-center gap-1">
                <Icon name="ZapIcon" size={11} className="text-emerald-500" />
                Notifications en temps réel via Supabase
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
}