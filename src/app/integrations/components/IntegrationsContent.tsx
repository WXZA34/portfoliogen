'use client';

import React, { useState, useRef } from 'react';
import Icon from '@/components/ui/AppIcon';
import { toast } from 'sonner';

interface ImportedItem {
  type: string;
  name: string;
  detail: string;
}

const githubRepos = [
  { name: 'portfolio-gen', stars: 234, lang: 'TypeScript', desc: 'AI-powered portfolio generator', updated: '2026-09-10' },
  { name: 'react-dashboard', stars: 89, lang: 'JavaScript', desc: 'Analytics dashboard template', updated: '2026-08-22' },
  { name: 'ml-pipeline', stars: 156, lang: 'Python', desc: 'ML training pipeline with MLflow', updated: '2026-09-01' },
  { name: 'api-gateway', stars: 45, lang: 'Go', desc: 'High-performance API gateway', updated: '2026-07-15' },
];

const certifications = [
  { platform: 'Coursera', name: 'Machine Learning Specialization', issuer: 'Stanford / DeepLearning.AI', date: '2026-03', badge: '🎓' },
  { platform: 'LinkedIn Learning', name: 'React Advanced Patterns', issuer: 'LinkedIn', date: '2026-01', badge: '💼' },
  { platform: 'Coursera', name: 'AWS Cloud Practitioner', issuer: 'Amazon Web Services', date: '2025-11', badge: '☁️' },
  { platform: 'LinkedIn Learning', name: 'TypeScript Essential Training', issuer: 'LinkedIn', date: '2025-09', badge: '💼' },
];

export default function IntegrationsContent() {
  const [activeTab, setActiveTab] = useState<'linkedin' | 'github' | 'certifications' | 'notion'>('linkedin');
  const [importedItems, setImportedItems] = useState<ImportedItem[]>([]);
  const [githubUsername, setGithubUsername] = useState('');
  const [selectedRepos, setSelectedRepos] = useState<string[]>([]);
  const [showRepos, setShowRepos] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLinkedInImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith('.csv')) {
      toast.error('Veuillez importer un fichier CSV LinkedIn');
      return;
    }
    setIsLoading(true);
    try {
      const { default: Papa } = await import('papaparse');
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          const items = (results.data as any[]).slice(0, 10).map((row) => ({
            type: 'linkedin',
            name: row['Company Name'] || row['Title'] || row['First Name'] + ' ' + row['Last Name'] || 'Entrée importée',
            detail: row['Position'] || row['Connected On'] || '',
          }));
          setImportedItems(items.filter(i => i.name));
          toast.success(`${items.length} entrées importées depuis LinkedIn !`);
          setIsLoading(false);
        },
        error: () => {
          toast.error('Erreur lors de la lecture du CSV');
          setIsLoading(false);
        }
      });
    } catch {
      toast.error('Erreur lors de l\'import');
      setIsLoading(false);
    }
  };

  const handleGithubSync = () => {
    if (!githubUsername.trim()) {
      toast.error('Entrez votre nom d\'utilisateur GitHub');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setShowRepos(true);
      setIsLoading(false);
      toast.success('Dépôts GitHub chargés !');
    }, 1200);
  };

  const toggleRepo = (name: string) => {
    setSelectedRepos(prev => prev.includes(name) ? prev.filter(r => r !== name) : [...prev, name]);
  };

  const importSelectedRepos = () => {
    if (selectedRepos.length === 0) {
      toast.error('Sélectionnez au moins un dépôt');
      return;
    }
    toast.success(`${selectedRepos.length} dépôt(s) importé(s) dans votre CVthèque !`);
    setSelectedRepos([]);
  };

  const importCertification = (cert: typeof certifications[0]) => {
    toast.success(`Certification "${cert.name}" ajoutée à votre CVthèque !`);
  };

  return (
    <div className="space-y-6">
      {/* Tab Nav */}
      <div className="flex gap-2 flex-wrap">
        {([
          { key: 'linkedin', label: '💼 LinkedIn CSV' },
          { key: 'github', label: '🐙 GitHub Sync' },
          { key: 'certifications', label: '🎓 Certifications' },
          { key: 'notion', label: '📝 Notion / Docs' },
        ] as const).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2.5 rounded-xl text-sm font-600 transition-all ${
              activeTab === tab.key ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* LinkedIn Import */}
      {activeTab === 'linkedin' && (
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-xl">💼</div>
            <div>
              <h3 className="font-700 text-foreground">Import LinkedIn CSV</h3>
              <p className="text-xs text-muted-foreground">Importez vos connexions, expériences et compétences depuis LinkedIn</p>
            </div>
          </div>

          <div className="bg-muted/50 rounded-xl p-4 mb-6 text-xs text-muted-foreground space-y-1">
            <p className="font-600 text-foreground mb-2">Comment exporter depuis LinkedIn :</p>
            <p>1. Allez dans Paramètres → Confidentialité des données</p>
            <p>2. Cliquez sur "Obtenir une copie de vos données"</p>
            <p>3. Sélectionnez "Connexions" ou "Profil complet"</p>
            <p>4. Téléchargez le fichier CSV et importez-le ici</p>
          </div>

          <input ref={fileInputRef} type="file" accept=".csv" onChange={handleLinkedInImport} className="hidden" />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="flex items-center gap-3 w-full p-6 border-2 border-dashed border-border rounded-xl hover:border-primary/40 hover:bg-primary/5 transition-all text-center justify-center"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            ) : (
              <Icon name="UploadIcon" size={20} className="text-muted-foreground" />
            )}
            <div className="text-left">
              <p className="text-sm font-600 text-foreground">Glissez votre fichier CSV LinkedIn</p>
              <p className="text-xs text-muted-foreground">ou cliquez pour sélectionner</p>
            </div>
          </button>

          {importedItems.length > 0 && (
            <div className="mt-6 space-y-2">
              <p className="text-sm font-700 text-foreground mb-3">{importedItems.length} entrées importées</p>
              {importedItems.map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-sm">💼</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-600 text-foreground truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{item.detail}</p>
                  </div>
                  <Icon name="CheckCircleIcon" size={16} className="text-emerald-500 flex-shrink-0" />
                </div>
              ))}
              <button
                onClick={() => { toast.success('Données ajoutées à votre CVthèque !'); setImportedItems([]); }}
                className="w-full py-3 bg-primary text-primary-foreground rounded-xl text-sm font-600 mt-3"
              >
                Ajouter à la CVthèque
              </button>
            </div>
          )}
        </div>
      )}

      {/* GitHub Sync */}
      {activeTab === 'github' && (
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gray-500/10 flex items-center justify-center text-xl">🐙</div>
            <div>
              <h3 className="font-700 text-foreground">GitHub Sync</h3>
              <p className="text-xs text-muted-foreground">Importez vos dépôts publics directement dans votre CVthèque</p>
            </div>
          </div>

          <div className="flex gap-3 mb-6">
            <input
              type="text"
              value={githubUsername}
              onChange={(e) => setGithubUsername(e.target.value)}
              placeholder="Votre nom d'utilisateur GitHub"
              className="flex-1 px-4 py-3 bg-muted border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <button
              onClick={handleGithubSync}
              disabled={isLoading}
              className="flex items-center gap-2 px-5 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-600 disabled:opacity-50"
            >
              {isLoading ? <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> : <Icon name="RefreshCwIcon" size={15} />}
              Synchroniser
            </button>
          </div>

          {showRepos && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-700 text-foreground">{githubRepos.length} dépôts publics trouvés</p>
                {selectedRepos.length > 0 && (
                  <button onClick={importSelectedRepos} className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-xs font-600">
                    Importer ({selectedRepos.length})
                  </button>
                )}
              </div>
              {githubRepos.map((repo) => (
                <div
                  key={repo.name}
                  onClick={() => toggleRepo(repo.name)}
                  className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedRepos.includes(repo.name) ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'
                  }`}
                >
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                    selectedRepos.includes(repo.name) ? 'border-primary bg-primary' : 'border-border'
                  }`}>
                    {selectedRepos.includes(repo.name) && <Icon name="CheckIcon" size={11} className="text-primary-foreground" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-700 text-foreground text-sm">{repo.name}</span>
                      <span className="px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded-lg font-600">{repo.lang}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{repo.desc}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Icon name="StarIcon" size={11} />{repo.stars}</span>
                      <span>Mis à jour : {repo.updated}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Certifications */}
      {activeTab === 'certifications' && (
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-xl">🎓</div>
            <div>
              <h3 className="font-700 text-foreground">Certifications & Badges</h3>
              <p className="text-xs text-muted-foreground">Importez vos certifications Coursera et LinkedIn Learning</p>
            </div>
          </div>

          <div className="space-y-3">
            {certifications.map((cert, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-muted/50 border border-border rounded-xl hover:border-primary/30 transition-all">
                <div className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center text-2xl flex-shrink-0">
                  {cert.badge}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-700 text-foreground text-sm truncate">{cert.name}</p>
                  <p className="text-xs text-muted-foreground">{cert.issuer} · {cert.date}</p>
                  <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-600 rounded-lg ${
                    cert.platform === 'Coursera' ? 'bg-blue-500/10 text-blue-600' : 'bg-indigo-500/10 text-indigo-600'
                  }`}>{cert.platform}</span>
                </div>
                <button
                  onClick={() => importCertification(cert)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-primary/10 text-primary rounded-xl text-xs font-600 hover:bg-primary hover:text-primary-foreground transition-all flex-shrink-0"
                >
                  <Icon name="PlusIcon" size={12} />
                  Importer
                </button>
              </div>
            ))}
          </div>

          <div className="mt-4 p-4 bg-muted/30 rounded-xl text-xs text-muted-foreground">
            <p className="font-600 text-foreground mb-1">Connecter votre compte Coursera</p>
            <p>Entrez votre email Coursera pour synchroniser automatiquement vos nouvelles certifications.</p>
            <div className="flex gap-2 mt-3">
              <input type="email" placeholder="email@coursera.org" className="flex-1 px-3 py-2 bg-card border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/30" />
              <button className="px-3 py-2 bg-primary text-primary-foreground rounded-xl text-xs font-600">Connecter</button>
            </div>
          </div>
        </div>
      )}

      {/* Notion / Google Docs */}
      {activeTab === 'notion' && (
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gray-500/10 flex items-center justify-center text-xl">📝</div>
            <div>
              <h3 className="font-700 text-foreground">Notion & Google Docs</h3>
              <p className="text-xs text-muted-foreground">Importez votre contenu depuis Notion ou Google Docs</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                name: 'Notion',
                icon: '📓',
                desc: 'Importez vos pages Notion (CV, projets, notes)',
                placeholder: 'https://notion.so/votre-page...',
                color: 'bg-gray-500/10',
              },
              {
                name: 'Google Docs',
                icon: '📄',
                desc: 'Importez vos documents Google Docs partagés',
                placeholder: 'https://docs.google.com/document/d/...',
                color: 'bg-blue-500/10',
              },
            ].map((integration, i) => (
              <div key={i} className="border border-border rounded-xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl ${integration.color} flex items-center justify-center text-xl`}>
                    {integration.icon}
                  </div>
                  <div>
                    <p className="font-700 text-foreground text-sm">{integration.name}</p>
                    <p className="text-xs text-muted-foreground">{integration.desc}</p>
                  </div>
                </div>
                <input
                  type="url"
                  placeholder={integration.placeholder}
                  className="w-full px-3 py-2.5 bg-muted border border-border rounded-xl text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 mb-3"
                />
                <button
                  onClick={() => toast.success(`Import ${integration.name} en cours...`)}
                  className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl text-xs font-600"
                >
                  Importer depuis {integration.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
