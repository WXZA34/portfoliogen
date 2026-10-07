'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

export default function SiteSettings() {
  const [siteName, setSiteName] = useState('TalentHub');
  const [siteDesc, setSiteDesc] = useState('La plateforme de portfolios professionnels pour les talents et recruteurs');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [registrationOpen, setRegistrationOpen] = useState(true);
  const [emailVerification, setEmailVerification] = useState(true);
  const [autoApprovePortfolios, setAutoApprovePortfolios] = useState(false);
  const [autoApproveJobs, setAutoApproveJobs] = useState(false);
  const [maxPortfoliosPerUser, setMaxPortfoliosPerUser] = useState('5');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const Toggle = ({ value, onChange, label, description }: { value: boolean; onChange: (v: boolean) => void; label: string; description: string }) => (
    <div className="flex items-center justify-between py-4 border-b border-border last:border-0">
      <div>
        <p className="text-sm font-600 text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`relative w-11 h-6 rounded-full transition-all duration-200 flex-shrink-0 ${value ? 'bg-rose-500' : 'bg-muted'}`}
      >
        <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${value ? 'left-6' : 'left-1'}`} />
      </button>
    </div>
  );

  return (
    <div className="space-y-5 max-w-3xl">
      {/* General settings */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-5">
          <Icon name="GlobeIcon" size={16} className="text-rose-500" />
          <h3 className="font-700 text-foreground text-sm">Informations générales</h3>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-600 text-muted-foreground uppercase tracking-wide mb-1.5 block">Nom du site</label>
            <input
              type="text"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            />
          </div>
          <div>
            <label className="text-xs font-600 text-muted-foreground uppercase tracking-wide mb-1.5 block">Description</label>
            <textarea
              value={siteDesc}
              onChange={(e) => setSiteDesc(e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-rose-500/20 resize-none"
            />
          </div>
          <div>
            <label className="text-xs font-600 text-muted-foreground uppercase tracking-wide mb-1.5 block">Portfolios max par utilisateur</label>
            <input
              type="number"
              value={maxPortfoliosPerUser}
              onChange={(e) => setMaxPortfoliosPerUser(e.target.value)}
              className="w-32 px-4 py-2.5 bg-muted border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            />
          </div>
        </div>
      </div>

      {/* Platform toggles */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Icon name="ToggleRightIcon" size={16} className="text-rose-500" />
          <h3 className="font-700 text-foreground text-sm">Paramètres de la plateforme</h3>
        </div>
        <Toggle
          value={maintenanceMode}
          onChange={setMaintenanceMode}
          label="Mode maintenance"
          description="Désactive l'accès public à la plateforme"
        />
        <Toggle
          value={registrationOpen}
          onChange={setRegistrationOpen}
          label="Inscriptions ouvertes"
          description="Autoriser les nouveaux utilisateurs à s'inscrire"
        />
        <Toggle
          value={emailVerification}
          onChange={setEmailVerification}
          label="Vérification email obligatoire"
          description="Les utilisateurs doivent vérifier leur email avant d'accéder"
        />
        <Toggle
          value={autoApprovePortfolios}
          onChange={setAutoApprovePortfolios}
          label="Auto-approbation des portfolios"
          description="Approuver automatiquement les nouveaux portfolios sans modération"
        />
        <Toggle
          value={autoApproveJobs}
          onChange={setAutoApproveJobs}
          label="Auto-approbation des offres d'emploi"
          description="Approuver automatiquement les nouvelles offres sans modération"
        />
      </div>

      {/* Danger zone */}
      <div className="bg-card border border-rose-500/20 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Icon name="AlertTriangleIcon" size={16} className="text-rose-500" />
          <h3 className="font-700 text-rose-600 text-sm">Zone dangereuse</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-xl bg-rose-500/5 border border-rose-500/20">
            <div>
              <p className="text-sm font-600 text-foreground">Vider le cache de la plateforme</p>
              <p className="text-xs text-muted-foreground">Efface tous les caches CDN et serveur</p>
            </div>
            <button className="px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-600 text-xs font-600 hover:bg-rose-500/20 transition-all">
              Vider le cache
            </button>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-rose-500/5 border border-rose-500/20">
            <div>
              <p className="text-sm font-600 text-foreground">Exporter les données utilisateurs</p>
              <p className="text-xs text-muted-foreground">Télécharger un export CSV de tous les utilisateurs</p>
            </div>
            <button className="px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-600 text-xs font-600 hover:bg-rose-500/20 transition-all">
              Exporter CSV
            </button>
          </div>
        </div>
      </div>

      {/* Save button */}
      <div className="flex items-center justify-end gap-3">
        {saved && (
          <div className="flex items-center gap-2 text-emerald-600 text-sm font-600">
            <Icon name="CheckCircleIcon" size={16} />
            Paramètres sauvegardés
          </div>
        )}
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 text-white text-sm font-600 hover:bg-rose-700 transition-all"
        >
          <Icon name="SaveIcon" size={15} />
          Sauvegarder les paramètres
        </button>
      </div>
    </div>
  );
}
