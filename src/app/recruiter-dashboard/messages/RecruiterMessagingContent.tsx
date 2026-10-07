'use client';

import React, { useState, useRef, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import Link from 'next/link';

interface Message {
  id: string;
  content: string;
  sender: 'recruiter' | 'talent';
  time: string;
  read: boolean;
}

interface Conversation {
  id: string;
  talentName: string;
  talentTitle: string;
  talentAvatar: string;
  talentAvatarAlt: string;
  jobTitle: string;
  stage: string;
  stageStyle: string;
  lastMessage: string;
  lastMessageAt: string;
  unread: number;
  online: boolean;
  messages: Message[];
}

const CONVERSATIONS: Conversation[] = [
  {
    id: '1',
    talentName: 'Karim Benali',
    talentTitle: 'AI/ML Engineer',
    talentAvatar: 'https://img.rocket.new/generatedImages/rocket_gen_img_13722b405-1786134143015.png',
    talentAvatarAlt: 'Karim Benali, AI/ML Engineer',
    jobTitle: 'Lead AI/ML Engineer',
    stage: 'Entretien',
    stageStyle: 'bg-amber-500/10 text-amber-600',
    lastMessage: 'Merci pour votre retour, je suis disponible cette semaine.',
    lastMessageAt: '10:24',
    unread: 2,
    online: true,
    messages: [
      { id: 'm1', content: 'Bonjour Karim, j\'ai consulté votre portfolio et je suis très impressionné par votre travail sur le fine-tuning LLaMA-3. Votre profil correspond exactement à ce que nous recherchons.', sender: 'recruiter', time: '09:15', read: true },
      { id: 'm2', content: 'Bonjour ! Merci beaucoup pour votre message. Je suis effectivement très intéressé par le poste de Lead AI/ML Engineer. Pourriez-vous me donner plus de détails sur les projets en cours ?', sender: 'talent', time: '09:42', read: true },
      { id: 'm3', content: 'Bien sûr ! Nous travaillons actuellement sur un LLM spécialisé pour le secteur légal et un système de RAG pour l\'analyse de contrats. Votre expérience en MLOps serait un vrai atout. Seriez-vous disponible pour un entretien cette semaine ?', sender: 'recruiter', time: '10:05', read: true },
      { id: 'm4', content: 'Merci pour votre retour, je suis disponible cette semaine.', sender: 'talent', time: '10:24', read: false },
    ],
  },
  {
    id: '2',
    talentName: 'Alexandre Martin',
    talentTitle: 'Senior Full-Stack Engineer',
    talentAvatar: 'https://img.rocket.new/generatedImages/rocket_gen_img_108ec1117-1763301720568.png',
    talentAvatarAlt: 'Alexandre Martin, Senior Full-Stack Engineer',
    jobTitle: 'Senior Full-Stack Engineer',
    stage: 'Présélectionné',
    stageStyle: 'bg-violet-500/10 text-violet-600',
    lastMessage: 'J\'ai quelques questions sur la stack technique.',
    lastMessageAt: 'Hier',
    unread: 0,
    online: false,
    messages: [
      { id: 'm5', content: 'Bonjour Alexandre, votre portfolio est remarquable. La plateforme de streaming temps réel que vous avez construite est exactement le type de projet sur lequel vous travailleriez chez nous.', sender: 'recruiter', time: 'Hier 14:30', read: true },
      { id: 'm6', content: 'Merci ! Je suis très intéressé. J\'ai quelques questions sur la stack technique.', sender: 'talent', time: 'Hier 15:12', read: true },
    ],
  },
  {
    id: '3',
    talentName: 'Léa Fontaine',
    talentTitle: 'Product Designer & UX Lead',
    talentAvatar: 'https://img.rocket.new/generatedImages/rocket_gen_img_1915c3ab2-1772072801426.png',
    talentAvatarAlt: 'Léa Fontaine, Product Designer',
    jobTitle: 'Product Designer UX',
    stage: 'En cours',
    stageStyle: 'bg-sky-500/10 text-sky-600',
    lastMessage: 'Bonjour Léa, votre design system est impressionnant...',
    lastMessageAt: 'Lun',
    unread: 0,
    online: false,
    messages: [
      { id: 'm7', content: 'Bonjour Léa, votre design system est impressionnant. Nous cherchons quelqu\'un avec exactement votre profil pour notre équipe produit à Lyon.', sender: 'recruiter', time: 'Lun 11:00', read: true },
    ],
  },
];

const QUICK_REPLIES = [
  'Merci pour votre réponse !',
  'Seriez-vous disponible pour un entretien ?',
  'Pouvez-vous me donner vos disponibilités ?',
  'J\'ai bien reçu votre portfolio.',
];

export default function RecruiterMessagingContent() {
  const [conversations, setConversations] = useState<Conversation[]>(CONVERSATIONS);
  const [activeConv, setActiveConv] = useState<Conversation>(CONVERSATIONS[0]);
  const [newMessage, setNewMessage] = useState('');
  const [search, setSearch] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConv.messages]);

  const totalUnread = conversations.reduce((sum, c) => sum + c.unread, 0);

  const filteredConvs = conversations.filter((c) =>
    !search || c.talentName.toLowerCase().includes(search.toLowerCase()) ||
    c.jobTitle.toLowerCase().includes(search.toLowerCase())
  );

  const sendMessage = (content?: string) => {
    const text = content || newMessage.trim();
    if (!text) return;
    const msg: Message = {
      id: String(Date.now()),
      content: text,
      sender: 'recruiter',
      time: 'À l\'instant',
      read: true,
    };
    const updated = conversations.map((c) =>
      c.id === activeConv.id
        ? { ...c, messages: [...c.messages, msg], lastMessage: text, lastMessageAt: 'À l\'instant', unread: 0 }
        : c
    );
    setConversations(updated);
    setActiveConv(updated.find((c) => c.id === activeConv.id)!);
    setNewMessage('');
  };

  const selectConv = (conv: Conversation) => {
    const updated = conversations.map((c) => c.id === conv.id ? { ...c, unread: 0 } : c);
    setConversations(updated);
    setActiveConv({ ...conv, unread: 0 });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-800 text-foreground">Messagerie</h1>
          <p className="text-sm text-muted-foreground">
            {totalUnread > 0 ? (
              <span className="text-violet-600 font-600">{totalUnread} message{totalUnread > 1 ? 's' : ''} non lu{totalUnread > 1 ? 's' : ''}</span>
            ) : (
              'Toutes les conversations à jour'
            )}
          </p>
        </div>
      </div>

      {/* Messaging interface */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden flex" style={{ height: '70vh' }}>
        {/* Conversation list */}
        <div className="w-72 flex-shrink-0 border-r border-border flex flex-col">
          <div className="p-3 border-b border-border">
            <div className="relative">
              <Icon name="SearchIcon" size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un talent…"
                className="w-full pl-7 pr-3 py-2 rounded-xl border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-violet-500/30 transition-all"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-border/50">
            {filteredConvs.map((conv) => (
              <button
                key={conv.id}
                onClick={() => selectConv(conv)}
                className={`w-full flex items-start gap-2.5 p-3 text-left transition-all ${
                  activeConv.id === conv.id
                    ? 'bg-violet-500/5 border-l-2 border-l-violet-600'
                    : 'hover:bg-muted/50 border-l-2 border-l-transparent'
                }`}
              >
                <div className="relative flex-shrink-0">
                  <img src={conv.talentAvatar} alt={conv.talentAvatarAlt} className="w-10 h-10 rounded-xl object-cover" />
                  {conv.online && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-card" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className={`text-xs truncate ${conv.unread > 0 ? 'font-800 text-foreground' : 'font-600 text-foreground'}`}>
                      {conv.talentName}
                    </p>
                    <span className="text-[10px] text-muted-foreground flex-shrink-0 ml-1">{conv.lastMessageAt}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground truncate mb-1">{conv.talentTitle}</p>
                  <div className="flex items-center justify-between">
                    <p className={`text-[10px] truncate flex-1 ${conv.unread > 0 ? 'text-foreground font-600' : 'text-muted-foreground'}`}>
                      {conv.lastMessage}
                    </p>
                    {conv.unread > 0 && (
                      <span className="ml-1 flex-shrink-0 w-4 h-4 rounded-full bg-violet-600 text-white text-[9px] font-800 flex items-center justify-center">
                        {conv.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Chat header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card flex-shrink-0">
            <div className="relative">
              <img src={activeConv.talentAvatar} alt={activeConv.talentAvatarAlt} className="w-10 h-10 rounded-xl object-cover" />
              {activeConv.online && (
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-card" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-700 text-foreground">{activeConv.talentName}</p>
                <span className={`text-[10px] font-600 px-1.5 py-0.5 rounded-md ${activeConv.stageStyle}`}>
                  {activeConv.stage}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{activeConv.talentTitle} · {activeConv.jobTitle}</p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/public-portfolio-view"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-border text-xs font-600 text-foreground hover:bg-muted transition-all"
              >
                <Icon name="FolderOpenIcon" size={12} />
                Portfolio
              </Link>
              <Link
                href="/recruiter-dashboard/interviews"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-violet-500/10 border border-violet-500/20 text-xs font-600 text-violet-600 hover:bg-violet-500/20 transition-all"
              >
                <Icon name="CalendarPlusIcon" size={12} />
                Planifier
              </Link>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {activeConv.messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'recruiter' ? 'justify-end' : 'justify-start'}`}>
                {msg.sender === 'talent' && (
                  <img
                    src={activeConv.talentAvatar}
                    alt={activeConv.talentAvatarAlt}
                    className="w-7 h-7 rounded-lg object-cover mr-2 flex-shrink-0 self-end"
                  />
                )}
                <div
                  className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.sender === 'recruiter' ?'bg-violet-600 text-white rounded-br-sm' :'bg-muted text-foreground rounded-bl-sm border border-border'
                  }`}
                >
                  <p>{msg.content}</p>
                  <p className={`text-[10px] mt-1 ${msg.sender === 'recruiter' ? 'text-white/60 text-right' : 'text-muted-foreground'}`}>
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick replies */}
          <div className="px-4 py-2 border-t border-border flex gap-2 overflow-x-auto">
            {QUICK_REPLIES.map((reply) => (
              <button
                key={reply}
                onClick={() => sendMessage(reply)}
                className="flex-shrink-0 text-[10px] font-600 px-2.5 py-1.5 rounded-xl border border-border text-muted-foreground hover:border-violet-500/40 hover:text-violet-600 hover:bg-violet-500/5 transition-all"
              >
                {reply}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-border flex-shrink-0">
            <div className="flex items-end gap-2">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Écrire un message… (Entrée pour envoyer)"
                rows={2}
                className="flex-1 px-3 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500/50 transition-all resize-none"
              />
              <button
                onClick={() => sendMessage()}
                disabled={!newMessage.trim()}
                className="p-2.5 rounded-xl bg-violet-600 text-white hover:bg-violet-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
              >
                <Icon name="SendIcon" size={16} />
              </button>
            </div>
            <p className="text-[10px] text-muted-foreground mt-1.5 flex items-center gap-1">
              <Icon name="ShieldCheckIcon" size={10} />
              Messagerie sécurisée — tout se passe dans la plateforme
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
