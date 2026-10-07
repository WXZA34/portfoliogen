'use client';

import React, { useState, useRef, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface Message {
  id: string;
  content: string;
  senderRole: 'recruiter' | 'candidate';
  createdAt: string;
  isRead: boolean;
}

interface Conversation {
  id: string;
  candidateName: string;
  candidateTitle: string;
  candidateAvatar: string;
  candidateAvatarAlt: string;
  jobTitle: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
  messages: Message[];
}

const MOCK_CONVERSATIONS: Conversation[] = [
{
  id: '1',
  candidateName: 'Karim Benali',
  candidateTitle: 'AI/ML Engineer',
  candidateAvatar: "https://img.rocket.new/generatedImages/rocket_gen_img_13722b405-1786134143015.png",
  candidateAvatarAlt: 'Karim Benali, AI/ML Engineer',
  jobTitle: 'Lead AI/ML Engineer',
  lastMessage: 'Merci pour votre retour, je suis disponible cette semaine.',
  lastMessageAt: '10:24',
  unreadCount: 2,
  messages: [
  { id: 'm1', content: 'Bonjour Karim, j\'ai consulté votre portfolio et je suis très impressionné par votre travail sur le fine-tuning LLaMA-3. Votre profil correspond exactement à ce que nous recherchons.', senderRole: 'recruiter', createdAt: '09:15', isRead: true },
  { id: 'm2', content: 'Bonjour ! Merci beaucoup pour votre message. Je suis effectivement très intéressé par le poste de Lead AI/ML Engineer chez DataVision. Pourriez-vous me donner plus de détails sur les projets en cours ?', senderRole: 'candidate', createdAt: '09:42', isRead: true },
  { id: 'm3', content: 'Bien sûr ! Nous travaillons actuellement sur un LLM spécialisé pour le secteur légal et un système de RAG pour l\'analyse de contrats. Votre expérience en MLOps serait un vrai atout. Seriez-vous disponible pour un entretien cette semaine ?', senderRole: 'recruiter', createdAt: '10:05', isRead: true },
  { id: 'm4', content: 'Merci pour votre retour, je suis disponible cette semaine.', senderRole: 'candidate', createdAt: '10:24', isRead: false }]

},
{
  id: '2',
  candidateName: 'Alexandre Martin',
  candidateTitle: 'Senior Full-Stack Engineer',
  candidateAvatar: "https://img.rocket.new/generatedImages/rocket_gen_img_108ec1117-1763301720568.png",
  candidateAvatarAlt: 'Alexandre Martin, Senior Full-Stack Engineer',
  jobTitle: 'Senior Full-Stack Engineer',
  lastMessage: 'J\'ai quelques questions sur la stack technique.',
  lastMessageAt: 'Hier',
  unreadCount: 0,
  messages: [
  { id: 'm5', content: 'Bonjour Alexandre, votre portfolio est remarquable. La plateforme de streaming temps réel que vous avez construite est exactement le type de projet sur lequel vous travailleriez chez nous.', senderRole: 'recruiter', createdAt: 'Hier 14:30', isRead: true },
  { id: 'm6', content: 'Merci ! Je suis très intéressé. J\'ai quelques questions sur la stack technique.', senderRole: 'candidate', createdAt: 'Hier 15:12', isRead: true }]

},
{
  id: '3',
  candidateName: 'Léa Fontaine',
  candidateTitle: 'Product Designer & UX Lead',
  candidateAvatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1915c3ab2-1772072801426.png",
  candidateAvatarAlt: 'Léa Fontaine, Product Designer',
  jobTitle: 'Product Designer UX',
  lastMessage: 'Bonjour Léa, votre design system est impressionnant...',
  lastMessageAt: 'Lun',
  unreadCount: 0,
  messages: [
  { id: 'm7', content: 'Bonjour Léa, votre design system est impressionnant. Nous cherchons quelqu\'un avec exactement votre profil pour notre équipe produit à Lyon.', senderRole: 'recruiter', createdAt: 'Lun 11:00', isRead: true }]

}];


export default function RecruiterMessagingTab() {
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [activeConv, setActiveConv] = useState<Conversation>(MOCK_CONVERSATIONS[0]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConv.messages]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    const msg: Message = {
      id: String(Date.now()),
      content: newMessage.trim(),
      senderRole: 'recruiter',
      createdAt: 'À l\'instant',
      isRead: true
    };
    const updated = conversations.map((c) =>
    c.id === activeConv.id ?
    { ...c, messages: [...c.messages, msg], lastMessage: msg.content, lastMessageAt: 'À l\'instant', unreadCount: 0 } :
    c
    );
    setConversations(updated);
    const updatedActive = updated.find((c) => c.id === activeConv.id)!;
    setActiveConv(updatedActive);
    setNewMessage('');
  };

  const selectConversation = (conv: Conversation) => {
    const updated = conversations.map((c) =>
    c.id === conv.id ? { ...c, unreadCount: 0 } : c
    );
    setConversations(updated);
    setActiveConv({ ...conv, unreadCount: 0 });
  };

  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  return (
    <div className="flex gap-0 h-[520px] border border-border rounded-2xl overflow-hidden -m-1">
      {/* Conversation list */}
      <div className="w-72 flex-shrink-0 border-r border-border flex flex-col">
        <div className="p-3 border-b border-border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-700 text-foreground">Conversations</p>
            {totalUnread > 0 &&
            <span className="text-[10px] font-700 px-1.5 py-0.5 rounded-full bg-negative text-white">{totalUnread}</span>
            }
          </div>
          <div className="relative">
            <Icon name="SearchIcon" size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Rechercher..."
              className="w-full pl-7 pr-3 py-1.5 rounded-lg border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all" />
            
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conv) =>
          <button
            key={conv.id}
            onClick={() => selectConversation(conv)}
            className={`w-full flex items-start gap-2.5 p-3 text-left transition-all border-b border-border/50 last:border-0 ${
            activeConv.id === conv.id ? 'bg-primary/5 border-l-2 border-l-primary' : 'hover:bg-muted/50'}`
            }>
            
              <div className="relative flex-shrink-0">
                <img src={conv.candidateAvatar} alt={conv.candidateAvatarAlt} className="w-9 h-9 rounded-xl object-cover" />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-card" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <p className="text-xs font-700 text-foreground truncate">{conv.candidateName}</p>
                  <span className="text-[10px] text-muted-foreground flex-shrink-0 ml-1">{conv.lastMessageAt}</span>
                </div>
                <p className="text-[11px] text-muted-foreground truncate">{conv.lastMessage}</p>
                {conv.unreadCount > 0 &&
              <span className="mt-1 inline-block text-[10px] font-700 px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground">{conv.unreadCount} nouveau{conv.unreadCount > 1 ? 'x' : ''}</span>
              }
              </div>
            </button>
          )}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat header */}
        <div className="flex items-center gap-3 p-3 border-b border-border bg-card">
          <img src={activeConv.candidateAvatar} alt={activeConv.candidateAvatarAlt} className="w-9 h-9 rounded-xl object-cover" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-700 text-foreground">{activeConv.candidateName}</p>
            <p className="text-xs text-muted-foreground">{activeConv.candidateTitle} · {activeConv.jobTitle}</p>
          </div>
          <div className="flex items-center gap-1.5">
            <a
              href="/public-portfolio-view"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border text-xs font-600 text-foreground hover:bg-muted transition-all">
              
              <Icon name="FolderOpenIcon" size={12} />
              Portfolio
            </a>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {activeConv.messages.map((msg) =>
          <div
            key={msg.id}
            className={`flex ${msg.senderRole === 'recruiter' ? 'justify-end' : 'justify-start'}`}>
            
              <div
              className={`max-w-[75%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
              msg.senderRole === 'recruiter' ? 'bg-primary text-primary-foreground rounded-br-sm' : 'bg-muted text-foreground rounded-bl-sm border border-border'}`
              }>
              
                <p>{msg.content}</p>
                <p className={`text-[10px] mt-1 ${msg.senderRole === 'recruiter' ? 'text-primary-foreground/70 text-right' : 'text-muted-foreground'}`}>
                  {msg.createdAt}
                </p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 border-t border-border">
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
              placeholder="Écrire un message... (Entrée pour envoyer)"
              rows={2}
              className="flex-1 px-3 py-2 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none" />
            
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              className="p-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0">
              
              <Icon name="SendIcon" size={16} />
            </button>
          </div>
          <p className="text-[10px] text-muted-foreground mt-1.5 flex items-center gap-1">
            <Icon name="ShieldCheckIcon" size={10} />
            Messagerie sécurisée — tout se passe dans la plateforme
          </p>
        </div>
      </div>
    </div>);

}