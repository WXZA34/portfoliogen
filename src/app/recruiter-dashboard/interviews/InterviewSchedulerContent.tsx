'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface Interview {
  id: string;
  candidateName: string;
  candidateTitle: string;
  candidateAvatar: string;
  candidateAvatarAlt: string;
  jobTitle: string;
  type: 'video' | 'phone' | 'onsite' | 'technical';
  date: string;
  dateLabel: string;
  time: string;
  duration: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes: string;
  meetingLink?: string;
}

const INTERVIEWS: Interview[] = [
  {
    id: '1',
    candidateName: 'Karim Benali',
    candidateTitle: 'AI/ML Engineer',
    candidateAvatar: 'https://img.rocket.new/generatedImages/rocket_gen_img_13722b405-1786134143015.png',
    candidateAvatarAlt: 'Karim Benali, AI/ML Engineer',
    jobTitle: 'Lead AI/ML Engineer',
    type: 'video',
    date: '2026-10-08',
    dateLabel: 'Jeu 8 oct.',
    time: '14:00',
    duration: 60,
    status: 'confirmed',
    notes: 'Entretien technique — préparer des questions sur MLOps et fine-tuning LLMs',
    meetingLink: 'https://meet.example.com/karim-benali',
  },
  {
    id: '2',
    candidateName: 'Alexandre Martin',
    candidateTitle: 'Senior Full-Stack Engineer',
    candidateAvatar: 'https://img.rocket.new/generatedImages/rocket_gen_img_108ec1117-1763301720568.png',
    candidateAvatarAlt: 'Alexandre Martin, Senior Full-Stack Engineer',
    jobTitle: 'Senior Full-Stack Engineer',
    type: 'video',
    date: '2026-10-09',
    dateLabel: 'Ven 9 oct.',
    time: '10:30',
    duration: 45,
    status: 'pending',
    notes: 'Premier entretien — présentation mutuelle et discussion sur les projets',
  },
  {
    id: '3',
    candidateName: 'Léa Fontaine',
    candidateTitle: 'Product Designer & UX Lead',
    candidateAvatar: 'https://img.rocket.new/generatedImages/rocket_gen_img_1915c3ab2-1772072801426.png',
    candidateAvatarAlt: 'Léa Fontaine, Product Designer',
    jobTitle: 'Product Designer UX',
    type: 'technical',
    date: '2026-10-14',
    dateLabel: 'Mer 14 oct.',
    time: '15:00',
    duration: 90,
    status: 'pending',
    notes: 'Test design — présentation d\'un cas pratique sur Figma',
  },
];

const TYPE_CONFIG = {
  video: { label: 'Visio', icon: 'VideoIcon', color: 'text-violet-600', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
  phone: { label: 'Téléphone', icon: 'PhoneIcon', color: 'text-emerald-600', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  onsite: { label: 'Présentiel', icon: 'MapPinIcon', color: 'text-amber-600', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  technical: { label: 'Test technique', icon: 'CodeIcon', color: 'text-sky-600', bg: 'bg-sky-500/10', border: 'border-sky-500/20' },
};

const STATUS_CONFIG = {
  pending: { label: 'En attente', style: 'bg-amber-500/10 text-amber-600 border-amber-500/20' },
  confirmed: { label: 'Confirmé', style: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' },
  completed: { label: 'Terminé', style: 'bg-muted text-muted-foreground border-border' },
  cancelled: { label: 'Annulé', style: 'bg-red-500/10 text-red-500 border-red-500/20' },
};

interface ScheduleForm {
  candidateName: string;
  jobTitle: string;
  type: string;
  date: string;
  time: string;
  duration: string;
  notes: string;
  meetingLink: string;
}

const EMPTY_FORM: ScheduleForm = {
  candidateName: '', jobTitle: '', type: 'video',
  date: '', time: '', duration: '45', notes: '', meetingLink: '',
};

export default function InterviewSchedulerContent() {
  const [interviews, setInterviews] = useState<Interview[]>(INTERVIEWS);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<ScheduleForm>(EMPTY_FORM);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);

  const filtered = filterStatus === 'all' ? interviews : interviews.filter((i) => i.status === filterStatus);

  const upcomingCount = interviews.filter((i) => i.status === 'confirmed' || i.status === 'pending').length;
  const confirmedCount = interviews.filter((i) => i.status === 'confirmed').length;

  const handleSchedule = () => {
    const newInterview: Interview = {
      id: String(Date.now()),
      candidateName: form.candidateName,
      candidateTitle: 'Candidat',
      candidateAvatar: 'https://img.rocket.new/generatedImages/rocket_gen_img_1a41cb16e-1763291705997.png',
      candidateAvatarAlt: `${form.candidateName}, candidat`,
      jobTitle: form.jobTitle,
      type: form.type as any,
      date: form.date,
      dateLabel: form.date,
      time: form.time,
      duration: Number(form.duration),
      status: 'pending',
      notes: form.notes,
      meetingLink: form.meetingLink || undefined,
    };
    setInterviews((prev) => [newInterview, ...prev]);
    setShowModal(false);
    setForm(EMPTY_FORM);
  };

  const updateStatus = (id: string, status: Interview['status']) => {
    setInterviews((prev) => prev.map((i) => i.id === id ? { ...i, status } : i));
    if (selectedInterview?.id === id) setSelectedInterview((prev) => prev ? { ...prev, status } : null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-800 text-foreground">Planification d'entretiens</h1>
          <p className="text-sm text-muted-foreground">
            <span className="font-600 text-foreground">{upcomingCount}</span> entretiens à venir ·{' '}
            <span className="font-600 text-emerald-600">{confirmedCount}</span> confirmés
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-600 hover:bg-violet-700 transition-all"
        >
          <Icon name="CalendarPlusIcon" size={15} />
          Planifier un entretien
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'À venir', value: upcomingCount, icon: 'CalendarIcon', color: 'text-violet-600', bg: 'bg-violet-500/10' },
          { label: 'Confirmés', value: confirmedCount, icon: 'CheckCircleIcon', color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
          { label: 'Terminés', value: interviews.filter((i) => i.status === 'completed').length, icon: 'CheckIcon', color: 'text-muted-foreground', bg: 'bg-muted' },
          { label: 'Annulés', value: interviews.filter((i) => i.status === 'cancelled').length, icon: 'XCircleIcon', color: 'text-red-500', bg: 'bg-red-500/10' },
        ].map((stat) => (
          <div key={stat.label} className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center flex-shrink-0`}>
              <Icon name={stat.icon as any} size={16} className={stat.color} />
            </div>
            <div>
              <p className="text-xl font-800 text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`text-xs font-600 px-3 py-1.5 rounded-xl border transition-all ${
              filterStatus === s
                ? 'bg-violet-600 text-white border-violet-600'
                : 'bg-background border-border text-muted-foreground hover:border-violet-500/40'
            }`}
          >
            {s === 'all' ? 'Tous' : STATUS_CONFIG[s as keyof typeof STATUS_CONFIG]?.label}
          </button>
        ))}
      </div>

      {/* Interview cards */}
      <div className="space-y-3">
        {filtered.map((interview) => {
          const typeConf = TYPE_CONFIG[interview.type];
          return (
            <div
              key={interview.id}
              className="bg-card border border-border rounded-2xl p-5 hover:border-violet-500/20 transition-all cursor-pointer"
              onClick={() => setSelectedInterview(interview)}
            >
              <div className="flex items-start gap-4">
                {/* Date block */}
                <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex flex-col items-center justify-center">
                  <p className="text-[10px] font-600 text-violet-600 leading-none">{interview.dateLabel.split(' ')[0]}</p>
                  <p className="text-2xl font-800 text-violet-600 leading-none">{interview.dateLabel.split(' ')[1]}</p>
                  <p className="text-[10px] text-violet-500/70 leading-none">{interview.dateLabel.split(' ').slice(2).join(' ')}</p>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <img src={interview.candidateAvatar} alt={interview.candidateAvatarAlt} className="w-7 h-7 rounded-lg object-cover" />
                    <h3 className="font-700 text-foreground">{interview.candidateName}</h3>
                    <span className={`text-[10px] font-700 px-2 py-0.5 rounded-full border ${STATUS_CONFIG[interview.status].style}`}>
                      {STATUS_CONFIG[interview.status].label}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{interview.candidateTitle} · {interview.jobTitle}</p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                    <span className={`flex items-center gap-1.5 px-2 py-1 rounded-lg ${typeConf.bg} ${typeConf.color} border ${typeConf.border}`}>
                      <Icon name={typeConf.icon as any} size={11} />
                      {typeConf.label}
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon name="ClockIcon" size={11} />
                      {interview.time} · {interview.duration} min
                    </span>
                    {interview.meetingLink && (
                      <a
                        href={interview.meetingLink}
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1 text-violet-600 hover:underline"
                      >
                        <Icon name="LinkIcon" size={11} />
                        Lien de réunion
                      </a>
                    )}
                  </div>

                  {interview.notes && (
                    <p className="text-xs text-muted-foreground mt-2 italic line-clamp-1">
                      📝 {interview.notes}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                  {interview.status === 'pending' && (
                    <button
                      onClick={() => updateStatus(interview.id, 'confirmed')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 text-xs font-600 hover:bg-emerald-500/20 transition-all border border-emerald-500/20"
                    >
                      <Icon name="CheckIcon" size={11} />
                      Confirmer
                    </button>
                  )}
                  {interview.status === 'confirmed' && (
                    <button
                      onClick={() => updateStatus(interview.id, 'completed')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-muted text-muted-foreground text-xs font-600 hover:bg-muted/80 transition-all border border-border"
                    >
                      <Icon name="CheckCircleIcon" size={11} />
                      Terminé
                    </button>
                  )}
                  {(interview.status === 'pending' || interview.status === 'confirmed') && (
                    <button
                      onClick={() => updateStatus(interview.id, 'cancelled')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-muted-foreground text-xs font-600 hover:bg-red-500/10 hover:text-red-500 transition-all border border-border"
                    >
                      <Icon name="XIcon" size={11} />
                      Annuler
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-16 border border-border rounded-2xl bg-card">
            <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
              <Icon name="CalendarIcon" size={24} className="text-muted-foreground" />
            </div>
            <p className="font-700 text-foreground mb-1">Aucun entretien</p>
            <p className="text-sm text-muted-foreground mb-4">Planifiez votre premier entretien</p>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 text-white text-sm font-600 hover:bg-violet-700 transition-all"
            >
              <Icon name="CalendarPlusIcon" size={14} />
              Planifier un entretien
            </button>
          </div>
        )}
      </div>

      {/* Schedule Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-modal">
            <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-card z-10">
              <h2 className="font-700 text-foreground">Planifier un entretien</h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted transition-all">
                <Icon name="XIcon" size={16} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-xs font-600 text-muted-foreground mb-1.5 block">Nom du candidat *</label>
                  <input
                    value={form.candidateName}
                    onChange={(e) => setForm({ ...form, candidateName: e.target.value })}
                    placeholder="ex: Karim Benali"
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/30 transition-all"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-600 text-muted-foreground mb-1.5 block">Poste concerné</label>
                  <input
                    value={form.jobTitle}
                    onChange={(e) => setForm({ ...form, jobTitle: e.target.value })}
                    placeholder="ex: Lead AI/ML Engineer"
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/30 transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-600 text-muted-foreground mb-1.5 block">Type d'entretien</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/30 transition-all"
                  >
                    <option value="video">Visio</option>
                    <option value="phone">Téléphone</option>
                    <option value="onsite">Présentiel</option>
                    <option value="technical">Test technique</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-600 text-muted-foreground mb-1.5 block">Durée (minutes)</label>
                  <select
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/30 transition-all"
                  >
                    <option value="30">30 min</option>
                    <option value="45">45 min</option>
                    <option value="60">60 min</option>
                    <option value="90">90 min</option>
                    <option value="120">2h</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-600 text-muted-foreground mb-1.5 block">Date *</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/30 transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-600 text-muted-foreground mb-1.5 block">Heure *</label>
                  <input
                    type="time"
                    value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/30 transition-all"
                  />
                </div>
                {form.type === 'video' && (
                  <div className="col-span-2">
                    <label className="text-xs font-600 text-muted-foreground mb-1.5 block">Lien de réunion (optionnel)</label>
                    <input
                      value={form.meetingLink}
                      onChange={(e) => setForm({ ...form, meetingLink: e.target.value })}
                      placeholder="https://meet.google.com/..."
                      className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/30 transition-all"
                    />
                  </div>
                )}
                <div className="col-span-2">
                  <label className="text-xs font-600 text-muted-foreground mb-1.5 block">Notes de préparation</label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    placeholder="Questions à poser, points à aborder…"
                    rows={3}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/30 transition-all resize-none"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 rounded-xl border border-border text-sm font-600 text-muted-foreground hover:bg-muted transition-all"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSchedule}
                  disabled={!form.candidateName || !form.date || !form.time}
                  className="flex-1 py-3 rounded-xl bg-violet-600 text-white text-sm font-600 hover:bg-violet-700 transition-all disabled:opacity-50"
                >
                  Planifier l'entretien
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interview detail modal */}
      {selectedInterview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl w-full max-w-md shadow-modal">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="font-700 text-foreground">Détails de l'entretien</h2>
              <button onClick={() => setSelectedInterview(null)} className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted transition-all">
                <Icon name="XIcon" size={16} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3">
                <img src={selectedInterview.candidateAvatar} alt={selectedInterview.candidateAvatarAlt} className="w-12 h-12 rounded-xl object-cover" />
                <div>
                  <h3 className="font-700 text-foreground">{selectedInterview.candidateName}</h3>
                  <p className="text-sm text-muted-foreground">{selectedInterview.candidateTitle}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted/50 rounded-xl p-3 border border-border">
                  <p className="text-[10px] text-muted-foreground mb-1">Date & heure</p>
                  <p className="text-sm font-700 text-foreground">{selectedInterview.dateLabel}</p>
                  <p className="text-xs text-muted-foreground">{selectedInterview.time} · {selectedInterview.duration} min</p>
                </div>
                <div className="bg-muted/50 rounded-xl p-3 border border-border">
                  <p className="text-[10px] text-muted-foreground mb-1">Type</p>
                  <p className="text-sm font-700 text-foreground">{TYPE_CONFIG[selectedInterview.type].label}</p>
                  <p className="text-xs text-muted-foreground">{selectedInterview.jobTitle}</p>
                </div>
              </div>

              {selectedInterview.notes && (
                <div className="bg-muted/50 rounded-xl p-3 border border-border">
                  <p className="text-[10px] text-muted-foreground mb-1">Notes</p>
                  <p className="text-sm text-foreground">{selectedInterview.notes}</p>
                </div>
              )}

              {selectedInterview.meetingLink && (
                <a
                  href={selectedInterview.meetingLink}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-600 text-sm font-600 hover:bg-violet-500/20 transition-all"
                >
                  <Icon name="VideoIcon" size={14} />
                  Rejoindre la réunion
                  <Icon name="ArrowUpRightIcon" size={12} className="ml-auto" />
                </a>
              )}

              <div className="flex gap-2">
                {selectedInterview.status === 'pending' && (
                  <button
                    onClick={() => { updateStatus(selectedInterview.id, 'confirmed'); setSelectedInterview(null); }}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 text-sm font-600 hover:bg-emerald-500/20 transition-all border border-emerald-500/20"
                  >
                    Confirmer
                  </button>
                )}
                {selectedInterview.status === 'confirmed' && (
                  <button
                    onClick={() => { updateStatus(selectedInterview.id, 'completed'); setSelectedInterview(null); }}
                    className="flex-1 py-2.5 rounded-xl bg-muted text-muted-foreground text-sm font-600 hover:bg-muted/80 transition-all border border-border"
                  >
                    Marquer terminé
                  </button>
                )}
                <button
                  onClick={() => setSelectedInterview(null)}
                  className="flex-1 py-2.5 rounded-xl border border-border text-sm font-600 text-muted-foreground hover:bg-muted transition-all"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
