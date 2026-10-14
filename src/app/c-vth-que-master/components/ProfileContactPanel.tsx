'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import { toast } from 'sonner';
import {
  type UserProfileInfo,
  fetchUserProfileInfo,
  saveUserProfileInfo,
  DEFAULT_USER_PROFILE,
} from '@/lib/services/cvthequeService';

export default function ProfileContactPanel() {
  const [profile, setProfile] = useState<UserProfileInfo>(DEFAULT_USER_PROFILE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newMethodology, setNewMethodology] = useState('');
  const [newHobby, setNewHobby] = useState('');

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
      await saveUserProfileInfo(profile);
      toast.success('Profil et coordonnées enregistrés dans la CVthèque Master !');
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

            <div>
              <label className="block text-xs font-700 text-muted-foreground mb-1">
                Lien de téléchargement CV PDF
              </label>
              <input
                type="text"
                value={profile.cvPdfUrl || ''}
                onChange={(e) => setProfile({ ...profile, cvPdfUrl: e.target.value })}
                placeholder="Ex: /uploads/cv-kokou-dussey.pdf"
                className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary font-mono"
              />
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
