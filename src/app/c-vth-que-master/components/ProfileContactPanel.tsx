'use client';

import React, { useState, useEffect, useRef } from 'react';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';
import { toast } from 'sonner';
import {
  type UserProfileInfo,
  fetchUserProfileInfo,
  saveUserProfileInfo,
  DEFAULT_USER_PROFILE,
} from '@/lib/services/cvthequeService';
import { saveStudioPortfolio } from '@/lib/services/portfolioStudioService';
import { uploadMediaFromPC, openDocumentSafe, downloadDocumentSafe } from '@/lib/utils/mediaUploadHelper';

export default function ProfileContactPanel() {
  const [profile, setProfile] = useState<UserProfileInfo>(DEFAULT_USER_PROFILE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingCv, setUploadingCv] = useState(false);
  const [newMethodology, setNewMethodology] = useState('');
  const [newHobby, setNewHobby] = useState('');

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const cvInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    const toastId = toast.loading(`Import de votre photo "${file.name}"...`);
    try {
      const result = await uploadMediaFromPC(file);
      const updated = { ...profile, avatarUrl: result.url };
      setProfile(updated);
      await saveUserProfileInfo(updated);

      if (typeof window !== 'undefined') {
        const activeRaw = localStorage.getItem('portfoliogen_current_active_portfolio');
        if (activeRaw) {
          try {
            const activePf = JSON.parse(activeRaw);
            activePf.authorAvatar = result.url;
            activePf.profileInfo = updated;
            saveStudioPortfolio(activePf, updated).catch(() => {});
          } catch {}
        }
      }

      toast.success('Photo de profil mise à jour et liée à vos portfolios !', { id: toastId });
    } catch (err: any) {
      toast.error(err?.message || 'Erreur lors de l\'import de la photo.', { id: toastId });
    } finally {
      setUploadingAvatar(false);
      if (avatarInputRef.current) avatarInputRef.current.value = '';
    }
  };

  const handleCvFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCv(true);
    const toastId = toast.loading(`Import du CV "${file.name}"...`);
    try {
      const result = await uploadMediaFromPC(file);
      const updated = {
        ...profile,
        cvPdfUrl: result.url,
        cvFileName: file.name,
        cvFileSize: result.fileSize,
      };
      setProfile(updated);
      await saveUserProfileInfo(updated);

      if (typeof window !== 'undefined') {
        const activeRaw = localStorage.getItem('portfoliogen_current_active_portfolio');
        if (activeRaw) {
          try {
            const activePf = JSON.parse(activeRaw);
            activePf.cvPdfUrl = result.url;
            activePf.cvFileName = file.name;
            activePf.cvFileSize = result.fileSize;
            activePf.profileInfo = updated;
            saveStudioPortfolio(activePf, updated).catch(() => {});
          } catch {}
        }
      }

      toast.success(`CV "${file.name}" importé et lié à vos portfolios !`, { id: toastId });
    } catch (err: any) {
      toast.error(err?.message || 'Erreur lors de l\'import du CV.', { id: toastId });
    } finally {
      setUploadingCv(false);
      if (cvInputRef.current) cvInputRef.current.value = '';
    }
  };

  useEffect(() => {
    let mounted = true;
    fetchUserProfileInfo().then((data) => {
      if (mounted) {
        setProfile(data);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await saveUserProfileInfo(profile);

      if (typeof window !== 'undefined') {
        const activeRaw = localStorage.getItem('portfoliogen_current_active_portfolio');
        if (activeRaw) {
          try {
            const activePf = JSON.parse(activeRaw);
            activePf.authorAvatar = updated.avatarUrl || activePf.authorAvatar;
            activePf.cvPdfUrl = updated.cvPdfUrl || activePf.cvPdfUrl;
            activePf.cvFileName = updated.cvFileName || activePf.cvFileName;
            activePf.cvFileSize = updated.cvFileSize || activePf.cvFileSize;
            activePf.authorName = updated.fullName || activePf.authorName;
            activePf.profileInfo = updated;
            await saveStudioPortfolio(activePf, updated);
          } catch {}
        }
      }

      toast.success('Profil et coordonnées enregistrés et synchronisés avec vos portfolios !');
    } catch {
      toast.error('Erreur lors de l\'enregistrement.');
    } finally {
      setSaving(false);
    }
  };

  const addMethodology = () => {
    if (!newMethodology.trim()) return;
    setProfile((prev) => ({
      ...prev,
      methodologies: [...(prev.methodologies || []), newMethodology.trim()],
    }));
    setNewMethodology('');
  };

  const removeMethodology = (index: number) => {
    setProfile((prev) => ({
      ...prev,
      methodologies: prev.methodologies.filter((_, i) => i !== index),
    }));
  };

  const addHobby = () => {
    if (!newHobby.trim()) return;
    setProfile((prev) => ({
      ...prev,
      hobbies: [...(prev.hobbies || []), newHobby.trim()],
    }));
    setNewHobby('');
  };

  const removeHobby = (index: number) => {
    setProfile((prev) => ({
      ...prev,
      hobbies: prev.hobbies.filter((_, i) => i !== index),
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-muted-foreground">
        <Icon name="Loader2Icon" size={24} className="animate-spin text-primary mr-2" />
        <span className="text-xs font-600">Chargement de votre profil...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Top Banner Notice */}
      <div className="p-4 rounded-xl bg-card border border-border shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-800 text-foreground">
            Rubrique Master : Profil, Bio & Coordonnées
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Ces informations sont centralisées et peuvent être injectées dans tous vos portfolios du Studio.
          </p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-700 hover:opacity-90 transition-all btn-press shadow-xs flex-shrink-0"
        >
          {saving ? (
            <Icon name="Loader2Icon" size={13} className="animate-spin" />
          ) : (
            <Icon name="CheckIcon" size={13} />
          )}
          Enregistrer le profil
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Identité, Titre & Textes */}
        <div className="space-y-5">
          <div className="bg-card border border-border rounded-xl p-5 shadow-2xs space-y-4">
            <h3 className="text-xs font-800 text-foreground uppercase tracking-wider flex items-center gap-2">
              <Icon name="UserIcon" size={15} className="text-primary" />
              Identité & Titre Professionnel
            </h3>

            {/* Photo de Profil / Avatar */}
            <div className="p-3.5 rounded-xl bg-muted/60 border border-border/80 flex flex-col sm:flex-row items-center gap-4">
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-3 border-primary/40 bg-card flex-shrink-0 shadow-md ring-4 ring-primary/10 flex items-center justify-center">
                {profile.avatarUrl ? (
                  <AppImage
                    src={profile.avatarUrl}
                    alt={profile.fullName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <span className="text-3xl sm:text-4xl font-black text-primary">
                    {profile.fullName.charAt(0)}
                  </span>
                )}
              </div>

              <div className="flex-1 space-y-1.5 text-center sm:text-left">
                <p className="text-xs font-bold text-foreground">
                  Photo de Profil (Avatar)
                </p>
                <p className="text-[11px] text-muted-foreground">
                  S&apos;affiche sur la page de garde, l&apos;en-tête du portfolio et auprès des recruteurs.
                </p>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarFileSelect}
                  />
                  <button
                    type="button"
                    disabled={uploadingAvatar}
                    onClick={() => avatarInputRef.current?.click()}
                    className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-bold hover:opacity-90 flex items-center gap-1.5 transition-all btn-press shadow-2xs"
                  >
                    {uploadingAvatar ? (
                      <Icon name="ArrowPathIcon" size={13} className="animate-spin" />
                    ) : (
                      <Icon name="ArrowUpTrayIcon" size={13} />
                    )}
                    <span>Importer depuis mon PC</span>
                  </button>

                  {profile.avatarUrl && (
                    <button
                      type="button"
                      onClick={() => setProfile((p) => ({ ...p, avatarUrl: '' }))}
                      className="px-2.5 py-1.5 bg-muted text-muted-foreground hover:text-red-500 rounded-lg text-xs font-semibold transition-colors"
                    >
                      Supprimer
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-700 text-muted-foreground mb-1">
                Nom complet / Signature
              </label>
              <input
                type="text"
                value={profile.fullName}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-xs font-700 text-foreground focus:outline-none focus:border-primary"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-700 text-muted-foreground mb-1">
                Titre principal / Spécialité
              </label>
              <input
                type="text"
                value={profile.headline}
                onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
                placeholder="Ex: Étudiant B.U.T. GEII - Génie Électrique & Informatique Industrielle"
                className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-700 text-muted-foreground mb-1">
                Slogan d&apos;accroche (Hero)
              </label>
              <input
                type="text"
                value={profile.slogan}
                onChange={(e) => setProfile({ ...profile, slogan: e.target.value })}
                placeholder="Ex: Concevoir la logique. Piloter le système."
                className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-xs text-foreground italic focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-700 text-muted-foreground mb-1">
                Disponibilité actuelle
              </label>
              <input
                type="text"
                value={profile.availability}
                onChange={(e) => setProfile({ ...profile, availability: e.target.value })}
                placeholder="Ex: En recherche d'alternance 2026–2028"
                className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-5 shadow-2xs space-y-4">
            <h3 className="text-xs font-800 text-foreground uppercase tracking-wider flex items-center gap-2">
              <Icon name="DocumentTextIcon" size={15} className="text-primary" />
              À propos & Projet Professionnel
            </h3>

            <div>
              <label className="block text-xs font-700 text-muted-foreground mb-1">
                Présentation détaillée / Bio (À propos)
              </label>
              <textarea
                rows={4}
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-700 text-muted-foreground mb-1">
                Projet professionnel & Objectif de stage / alternance
              </label>
              <textarea
                rows={3}
                value={profile.objective}
                onChange={(e) => setProfile({ ...profile, objective: e.target.value })}
                className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Coordonnées & Réseaux, Méthodologies */}
        <div className="space-y-5">
          <div className="bg-card border border-border rounded-xl p-5 shadow-2xs space-y-4">
            <h3 className="text-xs font-800 text-foreground uppercase tracking-wider flex items-center gap-2">
              <Icon name="EnvelopeIcon" size={15} className="text-primary" />
              Coordonnées de Contact & Réseaux
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-700 text-muted-foreground mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-700 text-muted-foreground mb-1">
                  Téléphone
                </label>
                <input
                  type="text"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-700 text-muted-foreground mb-1">
                Localisation (Ville / Région)
              </label>
              <input
                type="text"
                value={profile.location}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                placeholder="Ex: Île-de-France, France"
                className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-700 text-muted-foreground mb-1">
                  LinkedIn
                </label>
                <input
                  type="text"
                  value={profile.linkedin}
                  onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                  placeholder="https://linkedin.com/in/..."
                  className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-700 text-muted-foreground mb-1">
                  GitHub
                </label>
                <input
                  type="text"
                  value={profile.github}
                  onChange={(e) => setProfile({ ...profile, github: e.target.value })}
                  placeholder="https://github.com/..."
                  className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary font-mono"
                />
              </div>
            </div>

            {/* Document CV Professionnel */}
            <div className="p-3.5 rounded-xl bg-muted/60 border border-border/80 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Icon name="DocumentTextIcon" size={14} className="text-primary" />
                  Document CV Professionnel (PDF)
                </label>
                {profile.cvPdfUrl && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    CV Attaché
                  </span>
                )}
              </div>

              <input
                ref={cvInputRef}
                type="file"
                accept=".pdf,.doc,.docx,application/pdf"
                className="hidden"
                onChange={handleCvFileSelect}
              />

              {profile.cvPdfUrl ? (
                <div className="p-3 rounded-lg bg-card border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-red-500/10 text-red-600 flex items-center justify-center flex-shrink-0 font-bold text-xs">
                      PDF
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-foreground truncate">
                        {profile.cvFileName || 'Mon_Curriculum_Vitae.pdf'}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {profile.cvFileSize || 'Document PDF synchronisé'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto flex-wrap">
                    <button
                      type="button"
                      onClick={() => openDocumentSafe(profile.cvPdfUrl!, `CV_${(profile.fullName || 'Candidat').replace(/\s+/g, '_')}.pdf`)}
                      className="px-2.5 py-1.5 bg-muted hover:bg-muted/80 text-foreground rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                      title="Ouvrir le document CV sans blocage"
                    >
                      <Icon name="ArrowTopRightOnSquareIcon" size={13} />
                      Visualiser
                    </button>

                    <button
                      type="button"
                      onClick={() => downloadDocumentSafe(profile.cvPdfUrl!, `CV_${(profile.fullName || 'Candidat').replace(/\s+/g, '_')}.pdf`)}
                      className="px-2.5 py-1.5 bg-muted hover:bg-muted/80 text-foreground rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                      title="Télécharger le document CV sur votre ordinateur"
                    >
                      <Icon name="ArrowDownTrayIcon" size={13} />
                      Télécharger
                    </button>

                    <button
                      type="button"
                      disabled={uploadingCv}
                      onClick={() => cvInputRef.current?.click()}
                      className="px-2.5 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                      title="Remplacer le document par un nouveau fichier"
                    >
                      <Icon name="ArrowPathIcon" size={13} />
                      Remplacer
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setProfile((prev) => ({
                          ...prev,
                          cvPdfUrl: '',
                          cvFileName: '',
                          cvFileSize: '',
                        }))
                      }
                      className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Détacher ce CV"
                    >
                      <Icon name="TrashIcon" size={14} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <button
                    type="button"
                    disabled={uploadingCv}
                    onClick={() => cvInputRef.current?.click()}
                    className="w-full py-2.5 px-3 rounded-lg bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity btn-press shadow-2xs"
                  >
                    {uploadingCv ? (
                      <Icon name="ArrowPathIcon" size={14} className="animate-spin" />
                    ) : (
                      <Icon name="ArrowUpTrayIcon" size={14} />
                    )}
                    <span>Importer mon CV depuis mon PC (PDF)</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                      ou lien web :
                    </span>
                    <input
                      type="text"
                      value={profile.cvPdfUrl || ''}
                      onChange={(e) => setProfile({ ...profile, cvPdfUrl: e.target.value })}
                      placeholder="https://.../mon-cv.pdf"
                      className="flex-1 px-2.5 py-1 bg-background border border-border rounded text-xs text-foreground focus:outline-none focus:border-primary font-mono"
                    />
                  </div>
                </div>
              )}

              <p className="text-[10px] text-muted-foreground leading-relaxed">
                ℹ Ce CV sera automatiquement lié au bouton <strong>« Télécharger CV »</strong> de tous vos portfolios et téléchargeable par les recruteurs.
              </p>
            </div>
          </div>

          {/* Méthodologies de Travail */}
          <div className="bg-card border border-border rounded-xl p-5 shadow-2xs space-y-4">
            <h3 className="text-xs font-800 text-foreground uppercase tracking-wider flex items-center gap-2">
              <Icon name="WrenchScrewdriverIcon" size={15} className="text-primary" />
              Méthodologie de travail & Rigueur
            </h3>

            <div className="flex gap-2">
              <input
                type="text"
                value={newMethodology}
                onChange={(e) => setNewMethodology(e.target.value)}
                placeholder="Ajouter une méthode (ex: Normes NF C 15-100, Cycle en V...)"
                className="flex-1 px-3 py-2 bg-muted border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addMethodology();
                  }
                }}
              />
              <button
                type="button"
                onClick={addMethodology}
                className="px-3 py-2 bg-muted border border-border hover:bg-card text-foreground rounded-lg text-xs font-600 transition-colors"
              >
                Ajouter
              </button>
            </div>

            <div className="space-y-1.5 max-h-40 overflow-y-auto">
              {profile.methodologies?.map((m, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-lg bg-muted/40 border border-border text-xs"
                >
                  <span className="text-foreground">{m}</span>
                  <button
                    type="button"
                    onClick={() => removeMethodology(idx)}
                    className="text-muted-foreground hover:text-destructive p-1"
                  >
                    <Icon name="XMarkIcon" size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Centres d'intérêt / Hobbies */}
          <div className="bg-card border border-border rounded-xl p-5 shadow-2xs space-y-4">
            <h3 className="text-xs font-800 text-foreground uppercase tracking-wider flex items-center gap-2">
              <Icon name="SparklesIcon" size={15} className="text-primary" />
              Centres d&apos;intérêt & Engagements
            </h3>

            <div className="flex gap-2">
              <input
                type="text"
                value={newHobby}
                onChange={(e) => setNewHobby(e.target.value)}
                placeholder="Ajouter un centre d'intérêt (ex: Robotique autonome, Aéromodélisme...)"
                className="flex-1 px-3 py-2 bg-muted border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addHobby();
                  }
                }}
              />
              <button
                type="button"
                onClick={addHobby}
                className="px-3 py-2 bg-muted border border-border hover:bg-card text-foreground rounded-lg text-xs font-600 transition-colors"
              >
                Ajouter
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {profile.hobbies?.map((h, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted border border-border text-xs text-foreground"
                >
                  {h}
                  <button
                    type="button"
                    onClick={() => removeHobby(idx)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Icon name="XMarkIcon" size={11} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
