'use client';

import React, { useState, useRef } from 'react';
import Icon from '@/components/ui/AppIcon';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'sonner';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://portfoliog1369.builtwithrocket.new';

const portfolios = [
  { id: '1', name: 'Dev Full-Stack', slug: 'dev-fullstack', views: 342 },
  { id: '2', name: 'Ingénieur IA', slug: 'ingenieur-ia', views: 189 },
  { id: '3', name: 'CTO Startup', slug: 'cto-startup', views: 97 },
];

const atsCV = `JEAN DUPONT
Lead Developer Full-Stack
jean.dupont@email.com | +33 6 12 34 56 78 | LinkedIn: linkedin.com/in/jeandupont

RÉSUMÉ PROFESSIONNEL
Développeur Full-Stack avec 8 ans d'expérience en React, Node.js et architecture cloud. 
Spécialisé dans les applications à fort trafic et les équipes agiles.

COMPÉTENCES TECHNIQUES
Langages: JavaScript, TypeScript, Python, Go
Frontend: React, Next.js, Vue.js, Tailwind CSS
Backend: Node.js, Express, FastAPI, GraphQL
Cloud: AWS, GCP, Docker, Kubernetes
Bases de données: PostgreSQL, MongoDB, Redis

EXPÉRIENCE PROFESSIONNELLE

Lead Developer | TechCorp Paris | Jan 2022 - Présent
- Dirigé une équipe de 6 développeurs sur une plateforme SaaS B2B (50k utilisateurs)
- Réduit le temps de chargement de 40% via optimisation React et CDN
- Mis en place CI/CD avec GitHub Actions, réduisant les déploiements de 2h à 15min

Senior Developer | StartupAI | Mar 2019 - Dec 2021
- Développé le MVP de 0 à 10k utilisateurs en 6 mois
- Intégré des modèles ML (TensorFlow) dans l'interface utilisateur
- Architecture microservices sur AWS ECS

FORMATION
Master Informatique | École Polytechnique | 2018
Licence Mathématiques-Informatique | Université Paris VI | 2016

CERTIFICATIONS
AWS Solutions Architect Associate | 2023
Google Cloud Professional Developer | 2022`;

export default function ExportToolsContent() {
  const [selectedPortfolio, setSelectedPortfolio] = useState(portfolios[0]);
  const [activeTab, setActiveTab] = useState<'pdf' | 'ats' | 'qr' | 'minisite'>('pdf');
  const [qrColor, setQrColor] = useState('#000000');
  const [qrBg, setQrBg] = useState('#ffffff');
  const cvRef = useRef<HTMLDivElement>(null);

  const portfolioUrl = `${SITE_URL}/p/${selectedPortfolio.slug}`;

  const handleDownloadATS = () => {
    const blob = new Blob([atsCV], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CV_ATS_${selectedPortfolio.name.replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('CV ATS téléchargé !');
  };

  const handleDownloadQR = () => {
    const svg = document.querySelector('#qr-code svg') as SVGElement;
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `QR_${selectedPortfolio.slug}.svg`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('QR Code téléchargé !');
  };

  const handlePDFExport = async () => {
    toast.loading('Génération du PDF...', { id: 'pdf' });
    try {
      const { default: jsPDF } = await import('jspdf');
      const { default: html2canvas } = await import('html2canvas');
      const element = cvRef.current;
      if (!element) return;
      const canvas = await html2canvas(element, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Portfolio_${selectedPortfolio.name.replace(/\s+/g, '_')}.pdf`);
      toast.success('PDF exporté !', { id: 'pdf' });
    } catch {
      toast.error('Erreur lors de la génération du PDF', { id: 'pdf' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Portfolio Selector */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <p className="text-xs font-600 text-muted-foreground mb-3">Portfolio à exporter</p>
        <div className="flex flex-wrap gap-2">
          {portfolios.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedPortfolio(p)}
              className={`px-4 py-2 rounded-xl text-sm font-600 transition-all ${
                selectedPortfolio.id === p.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Nav */}
      <div className="flex gap-2 flex-wrap">
        {([
          { key: 'pdf', label: '📄 PDF Premium' },
          { key: 'ats', label: '🤖 CV ATS' },
          { key: 'qr', label: '📱 QR Code' },
          { key: 'minisite', label: '🌐 Mini-site' },
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

      {/* PDF Export */}
      {activeTab === 'pdf' && (
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-700 text-foreground">Export PDF Premium</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Version imprimable haute qualité de votre portfolio</p>
            </div>
            <button
              onClick={handlePDFExport}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-600 hover:opacity-90 transition-all"
            >
              <Icon name="DownloadIcon" size={15} />
              Exporter en PDF
            </button>
          </div>

          {/* Preview */}
          <div ref={cvRef} className="bg-white rounded-xl border border-border overflow-hidden p-8 text-gray-900">
            <div className="border-b-2 border-gray-900 pb-4 mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Jean Dupont</h1>
              <p className="text-gray-600 font-medium">{selectedPortfolio.name}</p>
              <div className="flex gap-4 mt-2 text-sm text-gray-500">
                <span>jean.dupont@email.com</span>
                <span>+33 6 12 34 56 78</span>
                <span>{portfolioUrl}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-3">Projets phares</h2>
                {['Plateforme SaaS B2B (50k users)', 'API ML temps réel', 'Dashboard Analytics'].map((p, i) => (
                  <div key={i} className="mb-3">
                    <p className="font-semibold text-sm text-gray-800">{p}</p>
                    <p className="text-xs text-gray-500">React · Node.js · AWS</p>
                  </div>
                ))}
              </div>
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-3">Compétences</h2>
                <div className="flex flex-wrap gap-1.5">
                  {['React', 'TypeScript', 'Node.js', 'AWS', 'Docker', 'PostgreSQL', 'GraphQL'].map((s, i) => (
                    <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded font-medium">{s}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ATS CV */}
      {activeTab === 'ats' && (
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-700 text-foreground">CV Compatible ATS</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Format texte lisible par les systèmes de suivi des candidatures</p>
            </div>
            <button
              onClick={handleDownloadATS}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-600 hover:opacity-90 transition-all"
            >
              <Icon name="DownloadIcon" size={15} />
              Télécharger .txt
            </button>
          </div>
          <div className="bg-muted/50 rounded-xl p-5 font-mono text-xs text-foreground leading-relaxed whitespace-pre-wrap overflow-auto max-h-96">
            {atsCV}
          </div>
          <div className="mt-4 flex items-start gap-2 text-xs text-muted-foreground bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
            <Icon name="InfoIcon" size={13} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <span>Le format ATS utilise du texte brut sans mise en forme pour garantir la lisibilité par tous les logiciels de recrutement (Workday, Greenhouse, Lever, etc.)</span>
          </div>
        </div>
      )}

      {/* QR Code */}
      {activeTab === 'qr' && (
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-700 text-foreground">QR Code du portfolio</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Partagez votre portfolio en un scan</p>
            </div>
            <button
              onClick={handleDownloadQR}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-600 hover:opacity-90 transition-all"
            >
              <Icon name="DownloadIcon" size={15} />
              Télécharger SVG
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div id="qr-code" className="flex-shrink-0 p-6 bg-white rounded-2xl border border-border shadow-sm">
              <QRCodeSVG
                value={portfolioUrl}
                size={200}
                fgColor={qrColor}
                bgColor={qrBg}
                level="H"
                includeMargin={false}
              />
              <p className="text-center text-xs text-gray-500 mt-3 font-medium">{selectedPortfolio.name}</p>
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <p className="text-xs font-600 text-muted-foreground mb-2">URL du portfolio</p>
                <div className="flex items-center gap-2 px-3 py-2.5 bg-muted rounded-xl">
                  <span className="text-xs text-foreground font-mono flex-1 truncate">{portfolioUrl}</span>
                  <button
                    onClick={() => { navigator.clipboard.writeText(portfolioUrl); toast.success('URL copiée !'); }}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Icon name="CopyIcon" size={13} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs font-600 text-muted-foreground mb-2">Couleur QR</p>
                  <div className="flex items-center gap-2">
                    <input type="color" value={qrColor} onChange={(e) => setQrColor(e.target.value)} className="w-10 h-10 rounded-lg border border-border cursor-pointer" />
                    <span className="text-xs font-mono text-muted-foreground">{qrColor}</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-600 text-muted-foreground mb-2">Fond</p>
                  <div className="flex items-center gap-2">
                    <input type="color" value={qrBg} onChange={(e) => setQrBg(e.target.value)} className="w-10 h-10 rounded-lg border border-border cursor-pointer" />
                    <span className="text-xs font-mono text-muted-foreground">{qrBg}</span>
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 rounded-xl p-4 space-y-2 text-xs text-muted-foreground">
                <p className="font-600 text-foreground">Utilisations recommandées :</p>
                <p>• Carte de visite numérique</p>
                <p>• Signature email</p>
                <p>• Présentation PowerPoint</p>
                <p>• CV imprimé</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mini-site */}
      {activeTab === 'minisite' && (
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-700 text-foreground">Mini-site sous-domaine</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Votre portfolio sur votre propre URL personnalisée</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-muted/50 rounded-xl p-5">
              <p className="text-xs font-600 text-muted-foreground mb-3">URL actuelle de votre portfolio</p>
              <div className="flex items-center gap-3 p-3 bg-card border border-border rounded-xl">
                <Icon name="GlobeIcon" size={16} className="text-primary" />
                <span className="text-sm font-mono text-foreground flex-1">{portfolioUrl}</span>
                <button
                  onClick={() => { navigator.clipboard.writeText(portfolioUrl); toast.success('Copié !'); }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Icon name="CopyIcon" size={14} />
                </button>
              </div>
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Icon name="StarIcon" size={16} className="text-primary" />
                <p className="text-sm font-700 text-primary">Domaine personnalisé (Pro)</p>
              </div>
              <p className="text-xs text-muted-foreground mb-4">Connectez votre propre domaine pour une présence professionnelle maximale.</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="jean-dupont.dev"
                  className="flex-1 px-3 py-2.5 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <button className="px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-600">
                  Connecter
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { icon: 'ZapIcon', title: 'Déploiement instantané', desc: 'Votre portfolio est en ligne en moins de 30 secondes' },
                { icon: 'ShieldCheckIcon', title: 'HTTPS automatique', desc: 'Certificat SSL inclus et renouvelé automatiquement' },
                { icon: 'BarChart2Icon', title: 'Analytics intégrés', desc: 'Suivez les visites directement depuis votre dashboard' },
              ].map((feature, i) => (
                <div key={i} className="bg-muted/50 rounded-xl p-4">
                  <Icon name={feature.icon as any} size={18} className="text-primary mb-2" />
                  <p className="text-sm font-700 text-foreground mb-1">{feature.title}</p>
                  <p className="text-xs text-muted-foreground">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
