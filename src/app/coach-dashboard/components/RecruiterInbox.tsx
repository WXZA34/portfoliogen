'use client';

import React, { useState, useEffect, useRef } from 'react';
import Icon from '@/components/ui/AppIcon';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface RecruiterMessage {
  id: string;
  sender_name: string;
  sender_company?: string;
  content: string;
  is_read: boolean;
  reply_content?: string;
  replied_at?: string;
  created_at: string;
}

function formatTime(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'à l\'instant';
  if (diffMins < 60) return `il y a ${diffMins}min`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `il y a ${diffHours}h`;
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

export default function RecruiterInbox() {
  const { user } = useAuth();
  const supabase = createClient();
  const [messages, setMessages] = useState<RecruiterMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMsg, setSelectedMsg] = useState<RecruiterMessage | null>(null);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);
  const [realtimeConnected, setRealtimeConnected] = useState(false);
  const channelRef = useRef<any>(null);

  useEffect(() => {
    if (!user) return;
    loadMessages();
    subscribeRealtime();
    return () => {
      if (channelRef.current) supabase.removeChannel(channelRef.current);
    };
  }, [user]);

  async function loadMessages() {
    setLoading(true);
    try {
      const { data } = await supabase
        .from('recruiter_messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      setMessages((data as RecruiterMessage[]) || []);
    } catch {
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }

  function subscribeRealtime() {
    const channel = supabase
      .channel('recruiter_inbox_realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'recruiter_messages' },
        (payload) => {
          setMessages((prev) => [payload.new as RecruiterMessage, ...prev]);
        }
      )
      .subscribe((status) => {
        setRealtimeConnected(status === 'SUBSCRIBED');
      });
    channelRef.current = channel;
  }

  async function markRead(msgId: string) {
    await supabase.from('recruiter_messages').update({ is_read: true }).eq('id', msgId);
    setMessages((prev) => prev.map((m) => (m.id === msgId ? { ...m, is_read: true } : m)));
  }

  async function sendReply() {
    if (!selectedMsg || !replyText.trim()) return;
    setSending(true);
    try {
      const { error } = await supabase
        .from('recruiter_messages')
        .update({ reply_content: replyText.trim(), replied_at: new Date().toISOString() })
        .eq('id', selectedMsg.id);
      if (!error) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === selectedMsg.id
              ? { ...m, reply_content: replyText.trim(), replied_at: new Date().toISOString() }
              : m
          )
        );
        setSelectedMsg((prev) =>
          prev ? { ...prev, reply_content: replyText.trim(), replied_at: new Date().toISOString() } : prev
        );
        setReplyText('');
      }
    } finally {
      setSending(false);
    }
  }

  const unreadCount = messages.filter((m) => !m.is_read).length;

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <Icon name="InboxIcon" size={18} className="text-primary" />
          </div>
          <div>
            <h3 className="font-700 text-foreground text-sm">Messagerie Recruteurs</h3>
            <div className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${realtimeConnected ? 'bg-emerald-500 animate-pulse' : 'bg-muted-foreground'}`} />
              <span className="text-xs text-muted-foreground">{realtimeConnected ? 'Temps réel actif' : 'Connexion...'}</span>
            </div>
          </div>
        </div>
        {unreadCount > 0 && (
          <span className="px-2.5 py-1 bg-primary text-primary-foreground rounded-full text-xs font-700">
            {unreadCount} non lu{unreadCount > 1 ? 's' : ''}
          </span>
        )}
      </div>

      <div className="flex" style={{ minHeight: '360px', maxHeight: '480px' }}>
        {/* Message list */}
        <div className={`${selectedMsg ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-2/5 border-r border-border overflow-y-auto`}>
          {loading ? (
            <div className="flex flex-col gap-3 p-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-muted rounded-xl animate-pulse" />
              ))}
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                <Icon name="MailIcon" size={20} className="text-muted-foreground" />
              </div>
              <p className="text-sm font-600 text-foreground mb-1">Aucun message</p>
              <p className="text-xs text-muted-foreground">Les messages des recruteurs apparaîtront ici en temps réel</p>
            </div>
          ) : (
            messages.map((msg) => (
              <button
                key={msg.id}
                onClick={() => {
                  setSelectedMsg(msg);
                  if (!msg.is_read) markRead(msg.id);
                }}
                className={`flex items-start gap-3 px-4 py-3 text-left border-b border-border/50 hover:bg-muted/50 transition-colors ${
                  selectedMsg?.id === msg.id ? 'bg-secondary' : ''
                }`}
              >
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-700 text-sm flex-shrink-0">
                  {msg.sender_name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <p className={`text-sm truncate ${!msg.is_read ? 'font-700 text-foreground' : 'font-500 text-foreground'}`}>
                      {msg.sender_name}
                    </p>
                    <span className="text-xs text-muted-foreground flex-shrink-0">{formatTime(msg.created_at)}</span>
                  </div>
                  {msg.sender_company && (
                    <p className="text-xs text-muted-foreground truncate">{msg.sender_company}</p>
                  )}
                  <p className="text-xs text-muted-foreground truncate mt-0.5">{msg.content}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {!msg.is_read && (
                      <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                    )}
                    {msg.reply_content && (
                      <span className="text-xs text-emerald-600 font-600">✓ Répondu</span>
                    )}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Message detail + reply */}
        {selectedMsg ? (
          <div className="flex flex-col flex-1 min-w-0">
            {/* Detail header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
              <button
                onClick={() => setSelectedMsg(null)}
                className="md:hidden p-1 rounded-lg hover:bg-muted transition-colors"
              >
                <Icon name="ArrowLeftIcon" size={16} className="text-muted-foreground" />
              </button>
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-700 text-sm flex-shrink-0">
                {selectedMsg.sender_name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-700 text-foreground text-sm">{selectedMsg.sender_name}</p>
                {selectedMsg.sender_company && (
                  <p className="text-xs text-muted-foreground">{selectedMsg.sender_company}</p>
                )}
              </div>
              <span className="ml-auto text-xs text-muted-foreground">{formatTime(selectedMsg.created_at)}</span>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {/* Recruiter message */}
              <div className="flex justify-end">
                <div className="max-w-[85%] bg-muted rounded-2xl rounded-br-sm px-3 py-2">
                  <p className="text-xs font-700 text-muted-foreground mb-1">{selectedMsg.sender_name}</p>
                  <p className="text-sm text-foreground leading-relaxed">{selectedMsg.content}</p>
                  <p className="text-xs text-muted-foreground mt-1">{formatTime(selectedMsg.created_at)}</p>
                </div>
              </div>

              {/* Reply if exists */}
              {selectedMsg.reply_content && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] bg-primary text-primary-foreground rounded-2xl rounded-bl-sm px-3 py-2">
                    <p className="text-xs font-700 opacity-80 mb-1">Vous</p>
                    <p className="text-sm leading-relaxed">{selectedMsg.reply_content}</p>
                    <p className="text-xs opacity-60 mt-1">{selectedMsg.replied_at ? formatTime(selectedMsg.replied_at) : ''}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Reply input */}
            {!selectedMsg.reply_content && (
              <div className="p-3 border-t border-border">
                <div className="flex gap-2">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Répondre au recruteur..."
                    rows={2}
                    className="flex-1 px-3 py-2 bg-muted border border-border rounded-xl text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-all resize-none"
                  />
                  <button
                    onClick={sendReply}
                    disabled={sending || !replyText.trim()}
                    className="px-3 py-2 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex-shrink-0"
                  >
                    {sending ? (
                      <Icon name="Loader2Icon" size={16} className="animate-spin" />
                    ) : (
                      <Icon name="SendIcon" size={16} />
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="hidden md:flex flex-1 items-center justify-center text-center p-6">
            <div>
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                <Icon name="MessageSquareIcon" size={20} className="text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">Sélectionnez un message</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
