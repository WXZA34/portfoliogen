'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import { useChat } from '@/lib/hooks/useChat';
import toast from 'react-hot-toast';

interface Candidate {
  name: string;
  title: string;
  avatar: string;
  alt: string;
  score: number;
  skills: string[];
  job: string;
  linkedinRecs: number;
  credentials: number;
  coverNote: string;
}

interface AIRecommendationPanelProps {
  candidate: Candidate;
  onClose: () => void;
}

export default function AIRecommendationPanel({ candidate, onClose }: AIRecommendationPanelProps) {
  const [analysis, setAnalysis] = useState('');
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  const { response, isLoading, error, sendMessage } = useChat('GEMINI', 'gemini/gemini-3.7-flash', true);

  useEffect(() => {
    if (error) toast.error(error.message);
  }, [error]);

  useEffect(() => {
    if (response && !isLoading) {
      setAnalysis(response);
    } else if (isLoading) {
      setAnalysis(response);
    }
  }, [response, isLoading]);

  const analyzeCandidate = () => {
    setHasAnalyzed(true);
    setAnalysis('');
    sendMessage([
      {
        role: 'system',
        content: `Tu es un assistant RH expert en recrutement tech. Tu analyses des profils de candidats et fournis des recommandations concises et actionnables pour les recruteurs. Réponds toujours en français. Sois direct, précis et utile. Structure ta réponse avec des sections claires.`,
      },
      {
        role: 'user',
        content: `Analyse ce candidat pour le poste de "${candidate.job}" :

Nom: ${candidate.name}
Titre: ${candidate.title}
Score de matching portfolio: ${candidate.score}%
Compétences: ${candidate.skills.join(', ')}
Recommandations LinkedIn: ${candidate.linkedinRecs}
Certifications vérifiées: ${candidate.credentials}
Note de candidature: "${candidate.coverNote}"

Fournis:
1. **Évaluation globale** (2-3 phrases)
2. **Points forts** (3 points clés)
3. **Points d'attention** (1-2 risques ou manques)
4. **Questions recommandées pour l'entretien** (3 questions ciblées)
5. **Recommandation finale** : Présélectionner / Entretien / Rejeter avec justification courte`,
      },
    ], { temperature: 0.7, max_tokens: 800 });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-3xl w-full max-w-xl max-h-[85vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-violet-500/10 flex items-center justify-center">
              <Icon name="BrainCircuitIcon" size={18} className="text-violet-600" />
            </div>
            <div>
              <p className="font-700 text-sm text-foreground">Analyse IA — Gemini</p>
              <p className="text-xs text-muted-foreground">Recommandation pour {candidate.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-all">
            <Icon name="XIcon" size={16} />
          </button>
        </div>

        {/* Candidate summary */}
        <div className="px-6 py-4 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-3">
            <img src={candidate.avatar} alt={candidate.alt} className="w-12 h-12 rounded-xl object-cover border border-border flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-700 text-foreground">{candidate.name}</p>
              <p className="text-xs text-muted-foreground">{candidate.title} · {candidate.job}</p>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                {candidate.skills.slice(0, 3).map((s) => (
                  <span key={s} className="text-[10px] font-600 px-1.5 py-0.5 rounded-md bg-secondary text-secondary-foreground">{s}</span>
                ))}
                <span className="text-[10px] font-700 px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-600 border border-violet-500/20">
                  {candidate.score}% match
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* AI Analysis area */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {!hasAnalyzed && (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-2xl bg-violet-500/10 flex items-center justify-center mx-auto mb-4">
                <Icon name="SparklesIcon" size={28} className="text-violet-600" />
              </div>
              <p className="font-700 text-foreground mb-2">Analyse IA du profil</p>
              <p className="text-sm text-muted-foreground mb-6 max-w-xs mx-auto">
                Gemini va analyser le portfolio, les compétences et la note de candidature pour vous donner une recommandation personnalisée.
              </p>
              <button
                onClick={analyzeCandidate}
                className="px-6 py-3 rounded-xl bg-violet-600 text-white text-sm font-700 hover:bg-violet-700 transition-all flex items-center gap-2 mx-auto"
              >
                <Icon name="ZapIcon" size={15} />
                Lancer l'analyse
              </button>
            </div>
          )}

          {hasAnalyzed && (
            <div className="space-y-3">
              {isLoading && !analysis && (
                <div className="flex items-center gap-3 py-4">
                  <div className="w-8 h-8 rounded-xl bg-violet-500/10 flex items-center justify-center flex-shrink-0">
                    <Icon name="BrainCircuitIcon" size={16} className="text-violet-600 animate-pulse" />
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <div className="h-2.5 bg-muted rounded-full animate-pulse w-3/4" />
                    <div className="h-2.5 bg-muted rounded-full animate-pulse w-1/2" />
                  </div>
                </div>
              )}

              {analysis && (
                <div className="bg-muted/30 border border-border rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Icon name="SparklesIcon" size={14} className="text-violet-600" />
                    <span className="text-xs font-700 text-violet-600">Analyse Gemini</span>
                    {isLoading && <span className="w-1.5 h-1.5 rounded-full bg-violet-600 animate-pulse" />}
                  </div>
                  <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                    {analysis}
                  </div>
                </div>
              )}

              {!isLoading && analysis && (
                <button
                  onClick={analyzeCandidate}
                  className="w-full py-2.5 rounded-xl border border-border text-xs font-600 text-muted-foreground hover:bg-muted hover:text-foreground transition-all flex items-center justify-center gap-2"
                >
                  <Icon name="RefreshCwIcon" size={13} />
                  Relancer l'analyse
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-border flex-shrink-0 flex items-center gap-2">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-600 text-muted-foreground hover:bg-muted transition-all">
            Fermer
          </button>
          <button className="flex-1 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-700 hover:bg-violet-700 transition-all flex items-center justify-center gap-2">
            <Icon name="CalendarPlusIcon" size={14} />
            Planifier entretien
          </button>
        </div>
      </div>
    </div>
  );
}
