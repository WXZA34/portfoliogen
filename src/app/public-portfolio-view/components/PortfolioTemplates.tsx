'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

// ─── Shared mock data for all templates ───────────────────────────────────────

const owner = {
  name: 'Alexandre Martin',
  title: 'Senior Full-Stack Engineer',
  tagline: 'Building scalable systems and developer tools that power the next generation of software.',
  location: 'Paris, France',
  email: 'alex.martin@dev.io',
  avatar: 'AM',
  openToWork: true
};

const projects = [
{ id: 'p1', title: 'NeuralCommerce', desc: 'AI-powered e-commerce engine · 2M+ daily requests · 94% accuracy', tags: ['React', 'Python', 'AWS'], kpi1: '2.1M req/day', kpi2: '94.2%', image: "https://img.rocket.new/generatedImages/rocket_gen_img_143ade8fa-1772811838490.png", imageAlt: 'Neural network visualization' },
{ id: 'p2', title: 'DistributedDB', desc: 'Kubernetes-native DB orchestration · 99.99% uptime · 240 nodes', tags: ['Go', 'K8s', 'gRPC'], kpi1: '99.99%', kpi2: '240 nodes', image: "https://img.rocket.new/generatedImages/rocket_gen_img_1ad34d826-1774989176390.png", imageAlt: 'Server infrastructure' },
{ id: 'p3', title: 'CLI Forge', desc: 'Open source CLI framework · 3.4K GitHub stars · 28K weekly downloads', tags: ['TypeScript', 'Node.js'], kpi1: '3.4K ⭐', kpi2: '28K/wk', image: "https://img.rocket.new/generatedImages/rocket_gen_img_13136b2f1-1772127930330.png", imageAlt: 'Terminal CLI interface' }];


const skills = [
{ name: 'TypeScript / JavaScript', level: 95 },
{ name: 'React / Next.js', level: 93 },
{ name: 'Node.js / Express', level: 88 },
{ name: 'System Design', level: 90 },
{ name: 'Go (Golang)', level: 74 },
{ name: 'Docker / Kubernetes', level: 80 }];


const experiences = [
{ title: 'Senior Full-Stack Engineer', org: 'Mistral AI', period: 'Jan 2025 — Present', current: true },
{ title: 'Software Engineer II', org: 'Datadog', period: 'Mar 2023 — Dec 2024', current: false },
{ title: 'Full-Stack Developer', org: 'Qonto', period: 'Jul 2021 — Feb 2023', current: false }];


const credentials = [
{ id: 'c1', title: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services', type: 'certification', verified: true, score: 90 },
{ id: 'c2', title: 'Google Professional Cloud Developer', issuer: 'Google Cloud', type: 'certification', verified: true, score: 85 },
{ id: 'c3', title: 'Open Source Contributor', issuer: 'GitHub', type: 'badge', verified: true, score: 75 }];


const recommendations = [
{ id: 'r1', name: 'Sarah Chen', title: 'Engineering Manager · Mistral AI', content: 'Alexandre is one of the most talented engineers I have had the pleasure of working with. His ability to architect complex distributed systems is exceptional.', verified: true },
{ id: 'r2', name: 'Marcus Webb', title: 'CTO · Datadog', content: 'Working with Alexandre was a highlight of my career. He brought technical depth and pragmatism that elevated the entire team.', verified: true }];


// ─── Template 1: ClassicCream ─────────────────────────────────────────────────

export function ClassicCreamTemplate() {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Nav */}
      <nav className="sticky top-0 z-30 bg-amber-50/90 backdrop-blur-sm border-b border-amber-200">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="font-bold text-amber-900 text-lg">{owner?.name}</span>
          <div className="flex items-center gap-5 text-sm">
            {['Projects', 'Skills', 'Experience', 'Credentials', 'Recommandations', 'Contact']?.map((item) =>
            <a key={item} href={`#cc-${item?.toLowerCase()}`} className="text-amber-700 hover:text-amber-900 font-medium transition-colors hidden md:block">{item}</a>
            )}
            <button className="flex items-center gap-1.5 px-4 py-2 bg-amber-900 text-amber-50 rounded-lg text-sm font-semibold hover:bg-amber-800 transition-colors">
              <Icon name="DownloadIcon" size={13} />CV
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="flex items-start gap-8">
          <div className="w-20 h-20 rounded-2xl bg-amber-200 flex items-center justify-center text-amber-900 text-2xl font-bold flex-shrink-0">{owner?.avatar}</div>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold text-amber-900">{owner?.name}</h1>
              {owner?.openToWork && <span className="px-3 py-1 bg-amber-200 text-amber-800 rounded-full text-xs font-semibold">Open to work</span>}
            </div>
            <p className="text-xl text-amber-700 font-medium mb-3">{owner?.title}</p>
            <p className="text-amber-600 max-w-xl leading-relaxed mb-5">{owner?.tagline}</p>
            <div className="flex items-center gap-4 text-sm text-amber-600">
              <span className="flex items-center gap-1"><Icon name="MapPinIcon" size={13} />{owner?.location}</span>
              <span className="flex items-center gap-1"><Icon name="MailIcon" size={13} />{owner?.email}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Projects */}
      <section id="cc-projects" className="max-w-4xl mx-auto px-6 py-10 border-t border-amber-200">
        <h2 className="text-2xl font-bold text-amber-900 mb-6">Selected Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {projects?.map((p) =>
          <div key={p?.id} className="bg-white rounded-2xl border border-amber-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="relative h-36 overflow-hidden">
                <AppImage src={p?.image} alt={p?.imageAlt} fill className="object-cover" sizes="300px" />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-amber-900 text-sm mb-1">{p?.title}</h3>
                <p className="text-xs text-amber-600 leading-relaxed mb-3 line-clamp-2">{p?.desc}</p>
                <div className="flex gap-1 flex-wrap mb-3">
                  {p?.tags?.map((t) => <span key={t} className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs">{t}</span>)}
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 text-center bg-amber-50 rounded-lg py-1.5"><p className="text-xs font-bold text-amber-900">{p?.kpi1}</p></div>
                  <div className="flex-1 text-center bg-amber-50 rounded-lg py-1.5"><p className="text-xs font-bold text-amber-900">{p?.kpi2}</p></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Skills */}
      <section id="cc-skills" className="max-w-4xl mx-auto px-6 py-10 border-t border-amber-200">
        <h2 className="text-2xl font-bold text-amber-900 mb-6">Technical Skills</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {skills?.map((s) =>
          <div key={s?.name} className="flex items-center gap-4">
              <span className="text-sm font-medium text-amber-800 w-44 flex-shrink-0">{s?.name}</span>
              <div className="flex-1 h-2 bg-amber-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-600 rounded-full" style={{ width: `${s?.level}%` }} />
              </div>
              <span className="text-xs font-bold text-amber-700 w-8 text-right">{s?.level}%</span>
            </div>
          )}
        </div>
      </section>

      {/* Experience */}
      <section id="cc-experience" className="max-w-4xl mx-auto px-6 py-10 border-t border-amber-200">
        <h2 className="text-2xl font-bold text-amber-900 mb-6">Experience</h2>
        <div className="space-y-3">
          {experiences?.map((e) =>
          <div key={e?.title} className="flex items-start gap-4 p-4 bg-white rounded-xl border border-amber-100">
              <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                <Icon name="BriefcaseIcon" size={15} className="text-amber-700" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-amber-900 text-sm">{e?.title}</p>
                  {e?.current && <span className="px-2 py-0.5 bg-amber-200 text-amber-800 rounded-full text-xs font-semibold">Current</span>}
                </div>
                <p className="text-xs text-amber-700 font-medium">{e?.org}</p>
                <p className="text-xs text-amber-500 mt-0.5">{e?.period}</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Credentials */}
      <section id="cc-credentials" className="max-w-4xl mx-auto px-6 py-10 border-t border-amber-200">
        <h2 className="text-2xl font-bold text-amber-900 mb-6">Badges & Certifications</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {credentials?.map((c) =>
          <div key={c?.id} className="bg-white rounded-2xl border border-amber-100 p-4 shadow-sm">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <Icon name="AwardIcon" size={16} className="text-amber-700" />
                </div>
                {c?.verified &&
              <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-50 border border-emerald-200 rounded-full text-xs text-emerald-700 font-semibold">
                    <Icon name="CheckCircleIcon" size={10} />Vérifié
                  </span>
              }
              </div>
              <p className="font-bold text-amber-900 text-sm mb-1">{c?.title}</p>
              <p className="text-xs text-amber-600">{c?.issuer}</p>
              {c?.verified &&
            <div className="mt-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-emerald-700 font-semibold">Confiance</span>
                    <span className="text-xs font-bold text-emerald-700">{c?.score}%</span>
                  </div>
                  <div className="h-1.5 bg-emerald-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${c?.score}%` }} />
                  </div>
                </div>
            }
            </div>
          )}
        </div>
      </section>

      {/* Recommendations */}
      <section id="cc-recommandations" className="max-w-4xl mx-auto px-6 py-10 border-t border-amber-200">
        <div className="flex items-center gap-2 mb-6">
          <h2 className="text-2xl font-bold text-amber-900">Recommandations</h2>
          <div className="flex items-center gap-1 px-2 py-0.5 bg-blue-600 rounded-full">
            <Icon name="LinkedinIcon" size={11} className="text-white" />
            <span className="text-white text-xs font-bold">LinkedIn</span>
          </div>
        </div>
        <div className="space-y-4">
          {recommendations?.map((r) =>
          <div key={r?.id} className="bg-white rounded-2xl border border-amber-100 p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm">{r?.name?.charAt(0)}</div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-amber-900 text-sm">{r?.name}</p>
                    {r?.verified && <span className="flex items-center gap-1 px-2 py-0.5 bg-blue-50 border border-blue-200 rounded-full text-xs text-blue-700 font-semibold"><Icon name="CheckCircleIcon" size={9} />Vérifié</span>}
                  </div>
                  <p className="text-xs text-amber-600">{r?.title}</p>
                </div>
              </div>
              <div className="pl-4 border-l-2 border-amber-200">
                <p className="text-sm text-amber-800 italic leading-relaxed">&ldquo;{r?.content}&rdquo;</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Contact */}
      <section id="cc-contact" className="max-w-4xl mx-auto px-6 py-10 border-t border-amber-200 mb-16">
        <h2 className="text-2xl font-bold text-amber-900 mb-3">Get in Touch</h2>
        <p className="text-amber-700 mb-5">Interested in working together? Send me a message directly.</p>
        <button onClick={() => setChatOpen(!chatOpen)} className="flex items-center gap-2 px-6 py-3 bg-amber-900 text-amber-50 rounded-xl font-semibold hover:bg-amber-800 transition-colors">
          <Icon name="MessageCircleIcon" size={16} />Send a Message
        </button>
      </section>
    </div>);

}

// ─── Template 2: BentoMinimal ─────────────────────────────────────────────────

export function BentoMinimalTemplate() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Nav */}
      <nav className="sticky top-0 z-30 bg-white/90 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="font-bold text-slate-900">{owner?.name}</span>
          <div className="flex items-center gap-4 text-sm">
            {['Projects', 'Skills', 'Credentials', 'Recommandations']?.map((item) =>
            <a key={item} href={`#bm-${item?.toLowerCase()}`} className="text-slate-500 hover:text-slate-900 transition-colors hidden md:block">{item}</a>
            )}
            <button className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-700 transition-colors">Contact</button>
          </div>
        </div>
      </nav>

      {/* Bento Hero Grid */}
      <section className="max-w-5xl mx-auto px-6 py-10">
        <div className="grid grid-cols-3 grid-rows-2 gap-4" style={{ minHeight: '320px' }}>
          {/* Main hero */}
          <div className="col-span-2 row-span-2 bg-white rounded-3xl border border-slate-200 p-8 flex flex-col justify-between shadow-sm">
            <div>
              {owner?.openToWork && <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold mb-4"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />Open to work</span>}
              <h1 className="text-4xl font-black text-slate-900 mb-2">{owner?.name}</h1>
              <p className="text-lg text-slate-600 font-medium mb-4">{owner?.title}</p>
              <p className="text-slate-500 leading-relaxed max-w-md">{owner?.tagline}</p>
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-1.5"><Icon name="MapPinIcon" size={13} />{owner?.location}</span>
              <span className="flex items-center gap-1.5"><Icon name="MailIcon" size={13} />{owner?.email}</span>
            </div>
          </div>
          {/* Stats bento */}
          <div className="bg-slate-900 rounded-3xl p-5 flex flex-col justify-between shadow-sm">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wide">Top Project</p>
            <div>
              <p className="text-3xl font-black text-white">2.1M</p>
              <p className="text-slate-400 text-sm">req/day · NeuralCommerce</p>
            </div>
          </div>
          <div className="bg-violet-600 rounded-3xl p-5 flex flex-col justify-between shadow-sm">
            <p className="text-violet-200 text-xs font-semibold uppercase tracking-wide">GitHub Stars</p>
            <div>
              <p className="text-3xl font-black text-white">3.4K</p>
              <p className="text-violet-200 text-sm">CLI Forge · Trending</p>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Bento */}
      <section id="bm-projects" className="max-w-5xl mx-auto px-6 py-6">
        <h2 className="text-xl font-black text-slate-900 mb-4">Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {projects?.map((p, i) =>
          <div key={p?.id} className={`rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-shadow ${i === 0 ? 'md:col-span-2' : ''}`}>
              <div className="relative h-40 overflow-hidden">
                <AppImage src={p?.image} alt={p?.imageAlt} fill className="object-cover" sizes="400px" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="font-bold text-white text-sm">{p?.title}</p>
                  <div className="flex gap-1 mt-1 flex-wrap">
                    {p?.tags?.map((t) => <span key={t} className="px-2 py-0.5 bg-white/20 backdrop-blur-sm text-white rounded-full text-xs">{t}</span>)}
                  </div>
                </div>
              </div>
              <div className="p-3 bg-white">
                <p className="text-xs text-slate-500 line-clamp-2">{p?.desc}</p>
                <div className="flex gap-2 mt-2">
                  <span className="flex-1 text-center bg-slate-50 rounded-lg py-1 text-xs font-bold text-slate-700">{p?.kpi1}</span>
                  <span className="flex-1 text-center bg-slate-50 rounded-lg py-1 text-xs font-bold text-slate-700">{p?.kpi2}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Skills */}
      <section id="bm-skills" className="max-w-5xl mx-auto px-6 py-6">
        <h2 className="text-xl font-black text-slate-900 mb-4">Skills</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {skills?.map((s) =>
          <div key={s?.name} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-slate-700">{s?.name}</p>
                <span className="text-xs font-bold text-slate-500">{s?.level}%</span>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-slate-800 rounded-full" style={{ width: `${s?.level}%` }} />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Credentials */}
      <section id="bm-credentials" className="max-w-5xl mx-auto px-6 py-6">
        <h2 className="text-xl font-black text-slate-900 mb-4">Credentials</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {credentials?.map((c) =>
          <div key={c?.id} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
                  <Icon name="AwardIcon" size={16} className="text-slate-600" />
                </div>
                {c?.verified && <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-50 border border-emerald-200 rounded-full text-xs text-emerald-700 font-semibold"><Icon name="CheckCircleIcon" size={9} />Vérifié</span>}
              </div>
              <p className="font-bold text-slate-900 text-sm mb-1">{c?.title}</p>
              <p className="text-xs text-slate-500 mb-3">{c?.issuer}</p>
              {c?.verified &&
            <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-emerald-700 font-semibold">Confiance {c?.score}%</span>
                  </div>
                  <div className="h-1.5 bg-emerald-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${c?.score}%` }} />
                  </div>
                </div>
            }
            </div>
          )}
        </div>
      </section>

      {/* Recommendations */}
      <section id="bm-recommandations" className="max-w-5xl mx-auto px-6 py-6 mb-16">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-xl font-black text-slate-900">Recommandations</h2>
          <div className="flex items-center gap-1 px-2 py-0.5 bg-blue-600 rounded-full">
            <Icon name="LinkedinIcon" size={11} className="text-white" />
            <span className="text-white text-xs font-bold">LinkedIn</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations?.map((r) =>
          <div key={r?.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm">{r?.name?.charAt(0)}</div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-slate-900 text-sm">{r?.name}</p>
                    {r?.verified && <span className="flex items-center gap-1 px-1.5 py-0.5 bg-blue-50 border border-blue-200 rounded-full text-xs text-blue-700"><Icon name="CheckCircleIcon" size={9} />Vérifié</span>}
                  </div>
                  <p className="text-xs text-slate-500">{r?.title}</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 italic leading-relaxed">&ldquo;{r?.content}&rdquo;</p>
            </div>
          )}
        </div>
      </section>
    </div>);

}

// ─── Template 3: Dark Tech ────────────────────────────────────────────────────

export function DarkTechTemplate() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Nav */}
      <nav className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-sm border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="font-bold text-emerald-400 font-mono">&gt; {owner?.name}</span>
          <div className="flex items-center gap-5 text-sm">
            {['Projects', 'Skills', 'Credentials', 'Recs']?.map((item) =>
            <a key={item} href={`#dt-${item?.toLowerCase()}`} className="text-slate-400 hover:text-emerald-400 font-mono transition-colors hidden md:block">{item}</a>
            )}
            <button className="px-4 py-2 border border-emerald-500 text-emerald-400 rounded-lg text-sm font-mono hover:bg-emerald-500/10 transition-colors">./contact</button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="mb-4">
          <span className="text-emerald-500 font-mono text-sm">// Senior Full-Stack Engineer</span>
        </div>
        <h1 className="text-5xl font-black text-white mb-4 leading-tight">
          {owner?.name}<br />
          <span className="text-emerald-400">builds at scale.</span>
        </h1>
        <p className="text-slate-400 max-w-xl leading-relaxed mb-8">{owner?.tagline}</p>
        <div className="flex items-center gap-4">
          {owner?.openToWork &&
          <span className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 text-sm font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              available_for_hire: true
            </span>
          }
          <span className="text-slate-500 font-mono text-sm">{owner?.location}</span>
        </div>
      </section>

      {/* Projects */}
      <section id="dt-projects" className="max-w-5xl mx-auto px-6 py-10 border-t border-slate-800">
        <h2 className="text-lg font-mono text-emerald-400 mb-6">&gt; projects/</h2>
        <div className="space-y-4">
          {projects?.map((p, i) =>
          <div key={p?.id} className="group flex gap-6 p-5 bg-slate-900 rounded-2xl border border-slate-800 hover:border-emerald-500/30 transition-all">
              <div className="relative w-32 h-24 rounded-xl overflow-hidden flex-shrink-0">
                <AppImage src={p?.image} alt={p?.imageAlt} fill className="object-cover opacity-70 group-hover:opacity-100 transition-opacity" sizes="128px" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-slate-600 font-mono text-sm">0{i + 1}.</span>
                  <h3 className="font-bold text-white">{p?.title}</h3>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed mb-3">{p?.desc}</p>
                <div className="flex items-center gap-3 flex-wrap">
                  {p?.tags?.map((t) => <span key={t} className="px-2 py-0.5 bg-slate-800 text-emerald-400 rounded font-mono text-xs">{t}</span>)}
                  <span className="ml-auto text-emerald-400 font-mono text-xs">{p?.kpi1} · {p?.kpi2}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Skills */}
      <section id="dt-skills" className="max-w-5xl mx-auto px-6 py-10 border-t border-slate-800">
        <h2 className="text-lg font-mono text-emerald-400 mb-6">&gt; skills/</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {skills?.map((s) =>
          <div key={s?.name} className="flex items-center gap-4 p-3 bg-slate-900 rounded-xl border border-slate-800">
              <span className="text-sm font-mono text-slate-300 w-44 flex-shrink-0">{s?.name}</span>
              <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${s?.level}%` }} />
              </div>
              <span className="text-xs font-mono text-emerald-400 w-8 text-right">{s?.level}</span>
            </div>
          )}
        </div>
      </section>

      {/* Credentials */}
      <section id="dt-credentials" className="max-w-5xl mx-auto px-6 py-10 border-t border-slate-800">
        <h2 className="text-lg font-mono text-emerald-400 mb-6">&gt; credentials/</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {credentials?.map((c) =>
          <div key={c?.id} className="p-4 bg-slate-900 rounded-2xl border border-slate-800 hover:border-emerald-500/30 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <Icon name="AwardIcon" size={16} className="text-emerald-400" />
                </div>
                {c?.verified &&
              <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-xs text-emerald-400 font-mono">
                    <Icon name="CheckCircleIcon" size={9} />verified
                  </span>
              }
              </div>
              <p className="font-bold text-white text-sm mb-1">{c?.title}</p>
              <p className="text-xs text-slate-500 mb-3">{c?.issuer}</p>
              {c?.verified &&
            <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-mono text-emerald-500">trust_score</span>
                    <span className="text-xs font-mono text-emerald-400">{c?.score}%</span>
                  </div>
                  <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${c?.score}%` }} />
                  </div>
                </div>
            }
            </div>
          )}
        </div>
      </section>

      {/* Recommendations */}
      <section id="dt-recs" className="max-w-5xl mx-auto px-6 py-10 border-t border-slate-800 mb-16">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-lg font-mono text-emerald-400">&gt; recommendations/</h2>
          <div className="flex items-center gap-1 px-2 py-0.5 bg-blue-600/20 border border-blue-500/30 rounded-full">
            <Icon name="LinkedinIcon" size={11} className="text-blue-400" />
            <span className="text-blue-400 text-xs font-mono">linkedin</span>
          </div>
        </div>
        <div className="space-y-4">
          {recommendations?.map((r) =>
          <div key={r?.id} className="p-5 bg-slate-900 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">{r?.name?.charAt(0)}</div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-white text-sm">{r?.name}</p>
                    {r?.verified && <span className="text-xs text-blue-400 font-mono">✓ verified</span>}
                  </div>
                  <p className="text-xs text-slate-500">{r?.title}</p>
                </div>
              </div>
              <div className="pl-4 border-l border-emerald-500/30">
                <p className="text-sm text-slate-400 italic leading-relaxed">&ldquo;{r?.content}&rdquo;</p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>);

}

// ─── Template 4: Éditorial Bold ───────────────────────────────────────────────

export function EditorialBoldTemplate() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-30 bg-white border-b-4 border-slate-900">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="font-black text-slate-900 text-xl uppercase tracking-tight">{owner?.name}</span>
          <div className="flex items-center gap-5 text-sm">
            {['Work', 'Skills', 'Credentials', 'Recs']?.map((item) =>
            <a key={item} href={`#eb-${item?.toLowerCase()}`} className="text-slate-500 hover:text-slate-900 font-bold uppercase tracking-wide transition-colors hidden md:block text-xs">{item}</a>
            )}
            <button className="px-4 py-2 bg-slate-900 text-white text-xs font-black uppercase tracking-wide hover:bg-slate-700 transition-colors">Contact</button>
          </div>
        </div>
      </nav>

      {/* Hero — editorial layout */}
      <section className="max-w-5xl mx-auto px-6 py-16 border-b-4 border-slate-900">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-rose-600 mb-3">Senior Full-Stack Engineer</p>
            <h1 className="text-6xl font-black text-slate-900 leading-none mb-6 uppercase">
              Build.<br />Ship.<br />
              <span className="text-rose-600">Scale.</span>
            </h1>
            <p className="text-slate-600 leading-relaxed mb-6">{owner?.tagline}</p>
            {owner?.openToWork &&
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 text-white text-sm font-black uppercase tracking-wide">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />Open to Work
              </span>
            }
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900 p-6 text-white">
              <p className="text-4xl font-black text-rose-400">2.1M</p>
              <p className="text-xs text-slate-400 uppercase tracking-wide mt-1">Daily requests</p>
            </div>
            <div className="bg-rose-600 p-6 text-white">
              <p className="text-4xl font-black">3.4K</p>
              <p className="text-xs text-rose-200 uppercase tracking-wide mt-1">GitHub stars</p>
            </div>
            <div className="border-4 border-slate-900 p-6">
              <p className="text-4xl font-black text-slate-900">99.9%</p>
              <p className="text-xs text-slate-500 uppercase tracking-wide mt-1">Uptime</p>
            </div>
            <div className="bg-slate-100 p-6">
              <p className="text-4xl font-black text-slate-900">5+</p>
              <p className="text-xs text-slate-500 uppercase tracking-wide mt-1">Years exp.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Projects */}
      <section id="eb-work" className="max-w-5xl mx-auto px-6 py-12 border-b-4 border-slate-900">
        <p className="text-xs font-black uppercase tracking-widest text-rose-600 mb-2">Selected Work</p>
        <h2 className="text-3xl font-black text-slate-900 uppercase mb-8">Projects</h2>
        <div className="space-y-6">
          {projects?.map((p, i) =>
          <div key={p?.id} className="grid grid-cols-1 md:grid-cols-3 gap-0 border-2 border-slate-900 overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative h-48 md:h-auto overflow-hidden">
                <AppImage src={p?.image} alt={p?.imageAlt} fill className="object-cover" sizes="300px" />
              </div>
              <div className="md:col-span-2 p-6 bg-white">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="text-xs font-black text-rose-600 uppercase tracking-wide">0{i + 1}</span>
                    <h3 className="text-xl font-black text-slate-900 uppercase">{p?.title}</h3>
                  </div>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-slate-900 text-white text-xs font-black uppercase">{p?.kpi1}</span>
                    <span className="px-3 py-1 bg-rose-600 text-white text-xs font-black uppercase">{p?.kpi2}</span>
                  </div>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">{p?.desc}</p>
                <div className="flex gap-2 flex-wrap">
                  {p?.tags?.map((t) => <span key={t} className="px-2 py-1 border-2 border-slate-900 text-slate-900 text-xs font-black uppercase">{t}</span>)}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Skills */}
      <section id="eb-skills" className="max-w-5xl mx-auto px-6 py-12 border-b-4 border-slate-900">
        <p className="text-xs font-black uppercase tracking-widest text-rose-600 mb-2">Expertise</p>
        <h2 className="text-3xl font-black text-slate-900 uppercase mb-8">Skills</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {skills?.map((s) =>
          <div key={s?.name} className="flex items-center gap-4 p-4 border-2 border-slate-900">
              <span className="text-sm font-black text-slate-900 uppercase w-44 flex-shrink-0">{s?.name}</span>
              <div className="flex-1 h-3 bg-slate-100 border border-slate-900 overflow-hidden">
                <div className="h-full bg-rose-600" style={{ width: `${s?.level}%` }} />
              </div>
              <span className="text-sm font-black text-slate-900 w-10 text-right">{s?.level}%</span>
            </div>
          )}
        </div>
      </section>

      {/* Credentials */}
      <section id="eb-credentials" className="max-w-5xl mx-auto px-6 py-12 border-b-4 border-slate-900">
        <p className="text-xs font-black uppercase tracking-widest text-rose-600 mb-2">Verified</p>
        <h2 className="text-3xl font-black text-slate-900 uppercase mb-8">Credentials</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {credentials?.map((c) =>
          <div key={c?.id} className="border-2 border-slate-900 p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 bg-slate-900 flex items-center justify-center">
                  <Icon name="AwardIcon" size={18} className="text-rose-400" />
                </div>
                {c?.verified &&
              <span className="flex items-center gap-1 px-2 py-1 bg-emerald-600 text-white text-xs font-black uppercase">
                    <Icon name="CheckCircleIcon" size={10} />Verified
                  </span>
              }
              </div>
              <p className="font-black text-slate-900 text-sm uppercase mb-1">{c?.title}</p>
              <p className="text-xs text-slate-500 mb-4">{c?.issuer}</p>
              {c?.verified &&
            <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-black text-slate-900 uppercase">Trust</span>
                    <span className="text-xs font-black text-rose-600">{c?.score}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 border border-slate-900 overflow-hidden">
                    <div className="h-full bg-rose-600" style={{ width: `${c?.score}%` }} />
                  </div>
                </div>
            }
            </div>
          )}
        </div>
      </section>

      {/* Recommendations */}
      <section id="eb-recs" className="max-w-5xl mx-auto px-6 py-12 mb-16">
        <div className="flex items-center gap-3 mb-2">
          <p className="text-xs font-black uppercase tracking-widest text-rose-600">Social Proof</p>
          <div className="flex items-center gap-1 px-2 py-0.5 bg-blue-600">
            <Icon name="LinkedinIcon" size={11} className="text-white" />
            <span className="text-white text-xs font-black uppercase">LinkedIn</span>
          </div>
        </div>
        <h2 className="text-3xl font-black text-slate-900 uppercase mb-8">Recommendations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recommendations?.map((r) =>
          <div key={r?.id} className="border-2 border-slate-900 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-600 flex items-center justify-center text-white font-black text-lg">{r?.name?.charAt(0)}</div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-black text-slate-900 uppercase text-sm">{r?.name}</p>
                    {r?.verified && <span className="px-2 py-0.5 bg-blue-600 text-white text-xs font-black uppercase">✓ Verified</span>}
                  </div>
                  <p className="text-xs text-slate-500">{r?.title}</p>
                </div>
              </div>
              <div className="border-l-4 border-rose-600 pl-4">
                <p className="text-sm text-slate-700 leading-relaxed italic">&ldquo;{r?.content}&rdquo;</p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>);

}