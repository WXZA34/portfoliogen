'use client';

import React from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

const PORTFOLIO_EXAMPLES = [
{
  id: 'ex-1',
  name: 'Alexandre Martin',
  title: 'Senior Full-Stack Engineer',
  company: 'Mistral AI',
  template: 'ClassicCream',
  views: '2.4K',
  image: 'https://img.rocket.new/generatedImages/rocket_gen_img_19f8fe7fc-1772547120162.png',
  imageAlt: 'Abstract neural network visualization with glowing blue nodes',
  tags: ['React', 'Go', 'AWS'],
  color: 'from-amber-100 to-amber-50',
  accent: 'text-amber-700'
},
{
  id: 'ex-2',
  name: 'Léa Fontaine',
  title: 'Product Designer',
  company: 'Figma',
  template: 'BentoMinimal',
  views: '1.8K',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_1a65592e4-1772952558235.png",
  imageAlt: 'Modern design workspace with colorful UI components',
  tags: ['Figma', 'UX', 'Design System'],
  color: 'from-slate-100 to-white',
  accent: 'text-slate-700'
},
{
  id: 'ex-3',
  name: 'Karim Benali',
  title: 'AI/ML Engineer',
  company: 'Hugging Face',
  template: 'Dark Tech',
  views: '3.1K',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_1e676ade0-1772686866255.png",
  imageAlt: 'Dark terminal interface with AI model training visualization',
  tags: ['Python', 'PyTorch', 'LLMs'],
  color: 'from-slate-900 to-slate-800',
  accent: 'text-emerald-400'
}];


const FEATURES = [
{
  icon: 'ZapIcon',
  title: 'Portfolio en 5 minutes',
  desc: 'Importez votre CV, choisissez un template, publiez. Votre portfolio professionnel est prêt.',
  color: 'bg-amber-100 text-amber-700'
},
{
  icon: 'ShieldCheckIcon',
  title: 'Credentials vérifiés',
  desc: 'Affichez vos certifications, badges et diplômes avec indicateurs de confiance et liens de vérification.',
  color: 'bg-emerald-100 text-emerald-700'
},
{
  icon: 'MessageCircleIcon',
  title: 'Chat recruteur live',
  desc: 'Les recruteurs vous contactent directement depuis votre portfolio. Répondez en temps réel depuis votre dashboard.',
  color: 'bg-blue-100 text-blue-700'
},
{
  icon: 'BarChart2Icon',
  title: 'Analytics recruteur',
  desc: 'Qui a vu votre portfolio, combien de temps, depuis quelle source. Données en temps réel.',
  color: 'bg-violet-100 text-violet-700'
},
{
  icon: 'LinkedinIcon',
  title: 'Recommandations LinkedIn',
  desc: 'Importez et affichez vos recommandations LinkedIn avec badge de vérification intégré.',
  color: 'bg-sky-100 text-sky-700'
},
{
  icon: 'BrainCircuitIcon',
  title: 'Analyse IA',
  desc: 'Notre IA analyse votre portfolio et vous donne des recommandations personnalisées pour maximiser vos chances.',
  color: 'bg-rose-100 text-rose-700'
}];


const STATS = [
{ value: '12K+', label: 'Portfolios créés' },
{ value: '94%', label: 'Taux de réponse recruteur' },
{ value: '3.2×', label: 'Plus de vues vs CV classique' },
{ value: '48h', label: 'Délai moyen de contact' }];


const TEMPLATES = [
{ name: 'ClassicCream', desc: 'Élégant, chaleureux, professionnel', color: 'bg-amber-100 border-amber-300' },
{ name: 'BentoMinimal', desc: 'Moderne, épuré, bento grid', color: 'bg-slate-100 border-slate-300' },
{ name: 'Dark Tech', desc: 'Sombre, tech, impactant', color: 'bg-slate-900 border-slate-700' },
{ name: 'Éditorial Bold', desc: 'Audacieux, typographique, créatif', color: 'bg-rose-50 border-rose-200' }];


export default function TalentHubLanding() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-30 bg-white/90 backdrop-blur-sm border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
              <Icon name="ZapIcon" size={16} className="text-white" />
            </div>
            <span className="font-bold text-lg text-slate-900">TalentHub</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {['Fonctionnalités', 'Templates', 'Exemples', 'Tarifs'].map((item) =>
            <a key={item} href={`#${item.toLowerCase()}`} className="text-sm text-slate-600 hover:text-slate-900 transition-colors font-medium">
                {item}
              </a>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/recruiter-dashboard"
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-sm text-violet-700 hover:text-violet-900 font-semibold border border-violet-200 rounded-xl hover:bg-violet-50 transition-colors">
              <Icon name="BriefcaseIcon" size={14} />
              Espace Recruteur
            </Link>
            <Link href="/login" className="text-sm text-slate-600 hover:text-slate-900 font-medium transition-colors">
              Connexion
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl text-sm font-bold hover:opacity-90 transition-opacity">
              
              Commencer gratuitement
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-50 border border-violet-200 rounded-full text-sm text-violet-700 font-semibold mb-6">
          <Icon name="SparklesIcon" size={14} />
          La plateforme portfolio pour les talents tech
        </div>
        <h1 className="text-5xl md:text-6xl font-black text-slate-900 leading-tight mb-6">
          Votre portfolio qui<br />
          <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            décroche les entretiens
          </span>
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          Créez un portfolio professionnel en 5 minutes. Credentials vérifiés, chat recruteur en temps réel, analytics avancés. Tout ce qu&apos;il faut pour se démarquer.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/register"
            className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-2xl text-base font-bold hover:opacity-90 transition-opacity shadow-lg shadow-violet-200">
            
            <Icon name="RocketIcon" size={18} />
            Créer mon portfolio gratuit
          </Link>
          <Link
            href="/public-portfolio-view"
            className="flex items-center gap-2 px-8 py-4 bg-slate-100 text-slate-700 rounded-2xl text-base font-bold hover:bg-slate-200 transition-colors">
            
            <Icon name="EyeIcon" size={18} />
            Voir un exemple
          </Link>
        </div>
        <p className="text-sm text-slate-400 mt-4">Gratuit · Aucune carte bancaire requise · Publié en 5 min</p>

        {/* Recruiter CTA Banner */}
        <div className="mt-10 inline-flex items-center gap-3 px-6 py-3 bg-slate-900 rounded-2xl text-sm text-slate-300 shadow-lg">
          <Icon name="BriefcaseIcon" size={16} className="text-violet-400 shrink-0" />
          <span>Vous êtes recruteur ?</span>
          <Link
            href="/recruiter-dashboard"
            className="flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-violet-500 to-indigo-500 text-white rounded-xl font-bold text-sm hover:opacity-90 transition-opacity">
            Accéder à l&apos;Espace Recruteur
            <Icon name="ArrowRightIcon" size={14} />
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gradient-to-r from-violet-600 to-indigo-600 py-12">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((stat) =>
          <div key={stat.label} className="text-center">
              <p className="text-3xl font-black text-white mb-1">{stat.value}</p>
              <p className="text-sm text-violet-200 font-medium">{stat.label}</p>
            </div>
          )}
        </div>
      </section>

      {/* Portfolio examples */}
      <section id="exemples" className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-slate-900 mb-3">Portfolios qui convertissent</h2>
          <p className="text-slate-600 max-w-xl mx-auto">Des portfolios créés par de vrais talents, vus par de vrais recruteurs.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PORTFOLIO_EXAMPLES.map((ex) =>
          <div key={ex.id} className="group rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="relative h-44 overflow-hidden">
                <AppImage
                src={ex.image}
                alt={ex.imageAlt}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 33vw" />
              
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-lg text-white text-xs font-semibold">
                    {ex.template}
                  </span>
                </div>
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-white/20 backdrop-blur-sm rounded-lg">
                  <Icon name="EyeIcon" size={11} className="text-white" />
                  <span className="text-white text-xs font-semibold">{ex.views}</span>
                </div>
              </div>
              <div className="p-4 bg-white">
                <p className="font-bold text-slate-900">{ex.name}</p>
                <p className="text-sm text-slate-600">{ex.title} · {ex.company}</p>
                <div className="flex gap-1 mt-3 flex-wrap">
                  {ex.tags.map((tag) =>
                <span key={tag} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">
                      {tag}
                    </span>
                )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section id="fonctionnalités" className="bg-slate-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-slate-900 mb-3">Tout ce dont vous avez besoin</h2>
            <p className="text-slate-600 max-w-xl mx-auto">Une plateforme complète pour gérer votre présence professionnelle en ligne.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feat) =>
            <div key={feat.title} className="bg-white rounded-2xl p-6 border border-slate-100 hover:shadow-md transition-shadow">
                <div className={`w-10 h-10 rounded-xl ${feat.color} flex items-center justify-center mb-4`}>
                  <Icon name={feat.icon as any} size={20} />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{feat.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{feat.desc}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Templates */}
      <section id="templates" className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-slate-900 mb-3">4 templates professionnels</h2>
          <p className="text-slate-600 max-w-xl mx-auto">Choisissez le style qui vous correspond. Tous les templates incluent toutes les fonctionnalités.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {TEMPLATES.map((tpl) =>
          <div key={tpl.name} className={`rounded-2xl border-2 ${tpl.color} p-5 text-center hover:scale-105 transition-transform cursor-pointer`}>
              <div className={`w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center ${tpl.name === 'Dark Tech' ? 'bg-slate-700' : 'bg-white/60'}`}>
                <Icon name="LayoutTemplateIcon" size={18} className={tpl.name === 'Dark Tech' ? 'text-emerald-400' : 'text-slate-600'} />
              </div>
              <p className={`font-bold text-sm mb-1 ${tpl.name === 'Dark Tech' ? 'text-white' : 'text-slate-900'}`}>{tpl.name}</p>
              <p className={`text-xs ${tpl.name === 'Dark Tech' ? 'text-slate-400' : 'text-slate-500'}`}>{tpl.desc}</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-600 py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-black text-white mb-4">Prêt à décrocher votre prochain poste ?</h2>
          <p className="text-violet-200 text-lg mb-8 leading-relaxed">
            Rejoignez 12 000+ talents qui utilisent TalentHub pour se démarquer auprès des recruteurs.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-10 py-4 bg-white text-violet-700 rounded-2xl text-base font-black hover:bg-violet-50 transition-colors shadow-xl">
            
            <Icon name="RocketIcon" size={20} />
            Créer mon portfolio maintenant
          </Link>
          <p className="text-violet-300 text-sm mt-4">Gratuit pour toujours · Upgrade quand vous voulez</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
              <Icon name="ZapIcon" size={13} className="text-white" />
            </div>
            <span className="font-bold text-white">TalentHub</span>
          </div>
          <p className="text-slate-500 text-sm">© 2026 TalentHub · La plateforme portfolio pour les talents tech</p>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-slate-400 hover:text-white text-sm transition-colors">Connexion</Link>
            <Link href="/register" className="text-slate-400 hover:text-white text-sm transition-colors">S&apos;inscrire</Link>
          </div>
        </div>
      </footer>
    </div>);

}