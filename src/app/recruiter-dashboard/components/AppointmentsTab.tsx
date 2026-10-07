'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface Appointment {
  id: string;
  candidateName: string;
  candidateTitle: string;
  candidateAvatar: string;
  candidateAvatarAlt: string;
  jobTitle: string;
  appointmentType: 'video' | 'phone' | 'in_person' | 'technical';
  scheduledAt: string;
  scheduledDate: string;
  scheduledTime: string;
  durationMinutes: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled';
  notes: string;
}

const MOCK_APPOINTMENTS: Appointment[] = [
{
  id: '1',
  candidateName: 'Karim Benali',
  candidateTitle: 'AI/ML Engineer',
  candidateAvatar: "https://img.rocket.new/generatedImages/rocket_gen_img_13722b405-1786134143015.png",
  candidateAvatarAlt: 'Karim Benali, AI/ML Engineer',
  jobTitle: 'Lead AI/ML Engineer',
  appointmentType: 'video',
  scheduledAt: '2026-10-08T14:00:00',
  scheduledDate: 'Jeu 8 oct. 2026',
  scheduledTime: '14:00',
  durationMinutes: 60,
  status: 'confirmed',
  notes: 'Entretien technique — préparer des questions sur MLOps et fine-tuning LLMs'
},
{
  id: '2',
  candidateName: 'Alexandre Martin',
  candidateTitle: 'Senior Full-Stack Engineer',
  candidateAvatar: "https://img.rocket.new/generatedImages/rocket_gen_img_108ec1117-1763301720568.png",
  candidateAvatarAlt: 'Alexandre Martin, Senior Full-Stack Engineer',
  jobTitle: 'Senior Full-Stack Engineer',
  appointmentType: 'video',
  scheduledAt: '2026-10-09T10:30:00',
  scheduledDate: 'Ven 9 oct. 2026',
  scheduledTime: '10:30',
  durationMinutes: 45,
  status: 'pending',
  notes: 'Premier entretien — présentation mutuelle et discussion sur les projets'
},
{
  id: '3',
  candidateName: 'Léa Fontaine',
  candidateTitle: 'Product Designer & UX Lead',
  candidateAvatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1915c3ab2-1772072801426.png",
  candidateAvatarAlt: 'Léa Fontaine, Product Designer',
  jobTitle: 'Product Designer UX',
  appointmentType: 'technical',
  scheduledAt: '2026-10-14T15:00:00',
  scheduledDate: 'Mer 14 oct. 2026',
  scheduledTime: '15:00',
  durationMinutes: 90,
  status: 'pending',
  notes: 'Test design — présentation d\'un cas pratique sur Figma'
}];


const TYPE_CONFIG: Record<string, {label: string;icon: string;color: string;bg: string;}> = {
  video: { label: 'Visio', icon: 'VideoIcon', color: 'text-primary', bg: 'bg-primary/10' },
  phone: { label: 'Téléphone', icon: 'PhoneIcon', color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
  in_person: { label: 'Présentiel', icon: 'MapPinIcon', color: 'text-amber-600', bg: 'bg-amber-500/10' },
  technical: { label: 'Test technique', icon: 'CodeIcon', color: 'text-sky-600', bg: 'bg-sky-500/10' }
};

const STATUS_CONFIG: Record<string, {label: string;style: string;}> = {
  pending: { label: 'En attente', style: 'bg-amber-500/10 text-amber-600 border-amber-500/20' },
  confirmed: { label: 'Confirmé', style: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' },
  completed: { label: 'Terminé', style: 'bg-muted text-muted-foreground border-border' },
  cancelled: { label: 'Annulé', style: 'bg-negative/10 text-negative border-negative/20' },
  rescheduled: { label: 'Reporté', style: 'bg-sky-500/10 text-sky-600 border-sky-500/20' }
};

interface ScheduleFormData {
  candidateName: string;
  jobTitle: string;
  appointmentType: string;
  date: string;
  time: string;
  duration: string;
  notes: string;
}

const EMPTY_FORM: ScheduleFormData = {
  candidateName: '',
  jobTitle: '',
  appointmentType: 'video',
  date: '',
  time: '',
  duration: '45',
  notes: ''
};

export default function AppointmentsTab() {
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<ScheduleFormData>(EMPTY_FORM);
  const [filterStatus, setFilterStatus] = useState('all');

  const filtered = filterStatus === 'all' ? appointments : appointments.filter((a) => a.status === filterStatus);

  const updateStatus = (id: string, status: Appointment['status']) => {
    setAppointments((prev) => prev.map((a) => a.id === id ? { ...a, status } : a));
  };

  const handleSchedule = () => {
    const newAppt: Appointment = {
      id: String(Date.now()),
      candidateName: form.candidateName,
      candidateTitle: 'Candidat',
      candidateAvatar: 'https://img.rocket.new/generatedImages/rocket_gen_img_1a41cb16e-1763291705997.png',
      candidateAvatarAlt: `${form.candidateName}, candidat`,
      jobTitle: form.jobTitle,
      appointmentType: form.appointmentType as any,
      scheduledAt: `${form.date}T${form.time}:00`,
      scheduledDate: form.date,
      scheduledTime: form.time,
      durationMinutes: Number(form.duration),
      status: 'pending',
      notes: form.notes
    };
    setAppointments((prev) => [newAppt, ...prev]);
    setShowModal(false);
    setForm(EMPTY_FORM);
  };

  const upcomingCount = appointments.filter((a) => a.status === 'confirmed' || a.status === 'pending').length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-600 text-foreground">{upcomingCount} rendez-vous à venir</p>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
            <Icon name="ShieldCheckIcon" size={11} />
            Planification 100% dans la plateforme — aucun outil externe
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-600 hover:bg-primary/90 transition-all">
          
          <Icon name="CalendarPlusIcon" size={15} />
          Planifier
        </button>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2">
        {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((s) =>
        <button
          key={s}
          onClick={() => setFilterStatus(s)}
          className={`text-xs font-600 px-3 py-1.5 rounded-xl border transition-all ${
          filterStatus === s ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-border text-muted-foreground hover:border-primary/40'}`
          }>
          
            {s === 'all' ? 'Tous' : STATUS_CONFIG[s]?.label}
          </button>
        )}
      </div>

      {/* Appointments */}
      <div className="space-y-3">
        {filtered.map((appt) => {
          const typeConf = TYPE_CONFIG[appt.appointmentType];
          return (
            <div key={appt.id} className="border border-border rounded-2xl p-4 hover:border-primary/20 transition-all">
              <div className="flex items-start gap-3">
                {/* Date block */}
                <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-primary/10 flex flex-col items-center justify-center border border-primary/20">
                  <p className="text-xs font-600 text-primary leading-none">{appt.scheduledDate.split(' ')[0]}</p>
                  <p className="text-lg font-800 text-primary leading-none">{appt.scheduledDate.split(' ')[1]}</p>
                  <p className="text-[10px] text-primary/70 leading-none">{appt.scheduledDate.split(' ')[2]}</p>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <img src={appt.candidateAvatar} alt={appt.candidateAvatarAlt} className="w-6 h-6 rounded-lg object-cover" />
                    <h3 className="font-700 text-sm text-foreground">{appt.candidateName}</h3>
                    <span className={`text-[10px] font-700 px-2 py-0.5 rounded-full border ${STATUS_CONFIG[appt.status].style}`}>
                      {STATUS_CONFIG[appt.status].label}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">{appt.candidateTitle} · {appt.jobTitle}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <div className={`w-4 h-4 rounded-md ${typeConf.bg} flex items-center justify-center`}>
                        <Icon name={typeConf.icon as any} size={9} className={typeConf.color} />
                      </div>
                      {typeConf.label}
                    </span>
                    <span className="flex items-center gap-1"><Icon name="ClockIcon" size={11} />{appt.scheduledTime} · {appt.durationMinutes} min</span>
                  </div>
                  {appt.notes &&
                  <p className="text-xs text-muted-foreground mt-1.5 italic line-clamp-1">📝 {appt.notes}</p>
                  }
                </div>

                <div className="flex flex-col gap-1.5 flex-shrink-0">
                  {appt.status === 'pending' &&
                  <button
                    onClick={() => updateStatus(appt.id, 'confirmed')}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 text-xs font-600 hover:bg-emerald-500/20 transition-all border border-emerald-500/20">
                    
                      <Icon name="CheckIcon" size={11} />
                      Confirmer
                    </button>
                  }
                  {appt.status === 'confirmed' &&
                  <button
                    onClick={() => updateStatus(appt.id, 'completed')}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-muted text-muted-foreground text-xs font-600 hover:bg-muted/80 transition-all border border-border">
                    
                      <Icon name="CheckCircleIcon" size={11} />
                      Terminé
                    </button>
                  }
                  <button
                    onClick={() => updateStatus(appt.id, 'cancelled')}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-muted-foreground text-xs font-600 hover:bg-negative/10 hover:text-negative transition-all border border-border">
                    
                    <Icon name="XIcon" size={11} />
                    Annuler
                  </button>
                </div>
              </div>
            </div>);

        })}

        {filtered.length === 0 &&
        <div className="text-center py-12 border border-border rounded-2xl">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
              <Icon name="CalendarIcon" size={20} className="text-muted-foreground" />
            </div>
            <p className="font-600 text-foreground text-sm mb-1">Aucun rendez-vous</p>
            <p className="text-xs text-muted-foreground">Planifiez un entretien depuis la messagerie ou le bouton ci-dessus</p>
          </div>
        }
      </div>

      {/* Schedule modal */}
      {showModal &&
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl w-full max-w-lg shadow-modal">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="font-700 text-foreground">Planifier un entretien</h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted transition-all">
                <Icon name="XIcon" size={16} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-600 text-muted-foreground mb-1.5 block">Nom du candidat</label>
                  <input
                  value={form.candidateName}
                  onChange={(e) => setForm({ ...form, candidateName: e.target.value })}
                  placeholder="Alexandre Martin"
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />
                
                </div>
                <div>
                  <label className="text-xs font-600 text-muted-foreground mb-1.5 block">Poste concerné</label>
                  <input
                  value={form.jobTitle}
                  onChange={(e) => setForm({ ...form, jobTitle: e.target.value })}
                  placeholder="Senior Full-Stack Engineer"
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />
                
                </div>
              </div>
              <div>
                <label className="text-xs font-600 text-muted-foreground mb-1.5 block">Type d'entretien</label>
                <div className="grid grid-cols-4 gap-2">
                  {Object.entries(TYPE_CONFIG).map(([key, conf]) =>
                <button
                  key={key}
                  onClick={() => setForm({ ...form, appointmentType: key })}
                  className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border text-xs font-600 transition-all ${
                  form.appointmentType === key ?
                  'border-primary bg-primary/5 text-primary' : 'border-border text-muted-foreground hover:border-primary/40'}`
                  }>
                  
                      <Icon name={conf.icon as any} size={16} />
                      {conf.label}
                    </button>
                )}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="text-xs font-600 text-muted-foreground mb-1.5 block">Date</label>
                  <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />
                
                </div>
                <div>
                  <label className="text-xs font-600 text-muted-foreground mb-1.5 block">Heure</label>
                  <input
                  type="time"
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />
                
                </div>
                <div>
                  <label className="text-xs font-600 text-muted-foreground mb-1.5 block">Durée (min)</label>
                  <select
                  value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all">
                  
                    <option value="30">30 min</option>
                    <option value="45">45 min</option>
                    <option value="60">1h</option>
                    <option value="90">1h30</option>
                    <option value="120">2h</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-600 text-muted-foreground mb-1.5 block">Notes internes</label>
                <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={2}
                placeholder="Points à aborder, questions techniques..."
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none" />
              
              </div>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-primary/5 border border-primary/20">
                <Icon name="ShieldCheckIcon" size={14} className="text-primary flex-shrink-0" />
                <p className="text-xs text-primary">Le candidat sera notifié via la messagerie de la plateforme. Aucun outil externe requis.</p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-5 border-t border-border">
              <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 rounded-xl border border-border text-sm font-600 text-foreground hover:bg-muted transition-all">
              
                Annuler
              </button>
              <button
              onClick={handleSchedule}
              disabled={!form.candidateName || !form.date || !form.time}
              className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-600 hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              
                Planifier l'entretien
              </button>
            </div>
          </div>
        </div>
      }
    </div>);

}