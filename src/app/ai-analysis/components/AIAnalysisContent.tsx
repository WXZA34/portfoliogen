'use client';

import React, { useState, useEffect } from 'react';
import { useChat } from '@/lib/hooks/useChat';
import Icon from '@/components/ui/AppIcon';
import { toast } from 'sonner';

interface AnalysisResult {
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
  suggestions: string[];
  hookText: string;
  cvSummary: string;
  projectDescriptions: string[];
}

export default function AIAnalysisContent() {
  const [inputMode, setInputMode] = useState<'url' | 'text'>('text');
  const [jobInput, setJobInput] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<'score' | 'writing' | 'suggestions'>('score');

  const { response, isLoading, error, sendMessage } = useChat('GEMINI', 'gemini/gemini-3.6-flash', false);

  useEffect(() => {
    if (error) toast.error(error.message);
  }, [error]);

  useEffect(() => {
    if (response && !isLoading) {
      try {
        const cleaned = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const parsed = JSON.parse(cleaned);
        setAnalysisResult(parsed);
      } catch {
        // fallback: show raw
      }
    }
  }, [response, isLoading]);

  const handleAnalyze = () => {
    if (!jobInput.trim()) {
      toast.error('Collez une fiche de poste ou une URL');
      return;
    }
    setAnalysisResult(null);

    const systemPrompt = `Tu es un expert en recrutement et en optimisation de portfolios. Analyse la fiche de poste fournie et retourne UNIQUEMENT un JSON valide (sans markdown) avec cette structure exacte:
{
  "score": <number 0-100>,
  "matchedSkills": [<string>, ...],
  "missingSkills": [<string>, ...],
  "suggestions": [<string>, ...],
  "hookText": "<string: accroche percutante 2-3 phrases>",
  "cvSummary": "<string: résumé CV contextuel 3-4 phrases>",
  "projectDescriptions": ["<string>", "<string>", "<string>"]
}`;

    sendMessage([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Fiche de poste à analyser:\n\n${jobInput}` }
    ], { temperature: 0.3, max_tokens: 2000 });
  };

  const scoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500';
    if (score >= 60) return 'text-amber-500';
    return 'text-red-500';
  };

  const scoreBg = (score: number) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 60) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Icon name="BrainCircuitIcon" size={20} className="text-primary" />
          </div>
          <div>
            <h2 className="font-700 text-foreground">Analyse de fiche de poste</h2>
            <p className="text-xs text-muted-foreground">Collez le texte de l'offre d'emploi pour obtenir votre score de compatibilité</p>
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="flex gap-2 mb-4">
          {(['text', 'url'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setInputMode(mode)}
              className={`px-4 py-2 rounded-lg text-xs font-600 transition-all ${
                inputMode === mode ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {mode === 'text' ? '📝 Texte' : '🔗 URL'}
            </button>
          ))}
        </div>

        {inputMode === 'url' ? (
          <input
            type="url"
            value={jobInput}
            onChange={(e) => setJobInput(e.target.value)}
            placeholder="https://www.linkedin.com/jobs/view/..."
            className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 mb-4"
          />
        ) : (
          <textarea
            value={jobInput}
            onChange={(e) => setJobInput(e.target.value)}
            placeholder="Collez ici le texte complet de la fiche de poste..."
            rows={6}
            className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none mb-4"
          />
        )}

        <button
          onClick={handleAnalyze}
          disabled={isLoading || !jobInput.trim()}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-600 text-sm hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Analyse en cours...
            </>
          ) : (
            <>
              <Icon name="SparklesIcon" size={16} />
              Analyser avec Gemini
            </>
          )}
        </button>
      </div>

      {/* Results */}
      {analysisResult && (
        <div className="space-y-4">
          {/* Score Hero */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-700 text-foreground text-lg">Résultats de l'analyse</h3>
              <div className="flex gap-2">
                {(['score', 'writing', 'suggestions'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-600 transition-all ${
                      activeTab === tab ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {tab === 'score' ? '📊 Score' : tab === 'writing' ? '✍️ Rédaction' : '💡 Suggestions'}
                  </button>
                ))}
              </div>
            </div>

            {activeTab === 'score' && (
              <div className="space-y-6">
                {/* Score Ring */}
                <div className="flex items-center gap-8">
                  <div className="relative w-32 h-32 flex-shrink-0">
                    <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="50" fill="none" stroke="currentColor" strokeWidth="10" className="text-muted" />
                      <circle
                        cx="60" cy="60" r="50" fill="none" strokeWidth="10"
                        strokeDasharray={`${(analysisResult.score / 100) * 314} 314`}
                        strokeLinecap="round"
                        className={analysisResult.score >= 80 ? 'text-emerald-500' : analysisResult.score >= 60 ? 'text-amber-500' : 'text-red-500'}
                        stroke="currentColor"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className={`text-3xl font-800 ${scoreColor(analysisResult.score)}`}>{analysisResult.score}</span>
                      <span className="text-xs text-muted-foreground font-600">/ 100</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className={`text-xl font-700 mb-1 ${scoreColor(analysisResult.score)}`}>
                      {analysisResult.score >= 80 ? '🎯 Excellent match !' : analysisResult.score >= 60 ? '⚡ Bon potentiel' : '🔧 À améliorer'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {analysisResult.score >= 80
                        ? 'Votre profil correspond très bien à cette offre. Postulez avec confiance.'
                        : analysisResult.score >= 60
                        ? 'Votre profil est compatible. Quelques ajustements peuvent maximiser vos chances.' :'Des lacunes importantes ont été détectées. Consultez les suggestions.'}
                    </p>
                  </div>
                </div>

                {/* Skills Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4">
                    <h4 className="text-sm font-700 text-emerald-600 mb-3 flex items-center gap-2">
                      <Icon name="CheckCircleIcon" size={14} /> Compétences matchées ({analysisResult.matchedSkills.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {analysisResult.matchedSkills.map((skill, i) => (
                        <span key={i} className="px-2 py-1 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-600 rounded-lg">{skill}</span>
                      ))}
                    </div>
                  </div>
                  <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
                    <h4 className="text-sm font-700 text-red-600 mb-3 flex items-center gap-2">
                      <Icon name="XCircleIcon" size={14} /> Compétences manquantes ({analysisResult.missingSkills.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {analysisResult.missingSkills.map((skill, i) => (
                        <span key={i} className="px-2 py-1 bg-red-500/10 text-red-700 dark:text-red-400 text-xs font-600 rounded-lg">{skill}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'writing' && (
              <div className="space-y-4">
                <div className="bg-muted/50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-700 text-foreground flex items-center gap-2">
                      <span>🎯</span> Accroche personnalisée
                    </h4>
                    <button
                      onClick={() => { navigator.clipboard.writeText(analysisResult.hookText); toast.success('Copié !'); }}
                      className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                    >
                      <Icon name="CopyIcon" size={12} /> Copier
                    </button>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">{analysisResult.hookText}</p>
                </div>

                <div className="bg-muted/50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-700 text-foreground flex items-center gap-2">
                      <span>📄</span> Résumé CV contextuel
                    </h4>
                    <button
                      onClick={() => { navigator.clipboard.writeText(analysisResult.cvSummary); toast.success('Copié !'); }}
                      className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                    >
                      <Icon name="CopyIcon" size={12} /> Copier
                    </button>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">{analysisResult.cvSummary}</p>
                </div>

                <div className="bg-muted/50 rounded-xl p-4">
                  <h4 className="text-sm font-700 text-foreground mb-3 flex items-center gap-2">
                    <span>🚀</span> Descriptions de projets optimisées
                  </h4>
                  <div className="space-y-3">
                    {analysisResult.projectDescriptions.map((desc, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 bg-card border border-border rounded-lg">
                        <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-700 flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                        <p className="text-sm text-foreground leading-relaxed flex-1">{desc}</p>
                        <button
                          onClick={() => { navigator.clipboard.writeText(desc); toast.success('Copié !'); }}
                          className="text-muted-foreground hover:text-foreground flex-shrink-0"
                        >
                          <Icon name="CopyIcon" size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'suggestions' && (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground mb-4">Actions proactives recommandées par Gemini pour maximiser vos chances :</p>
                {analysisResult.suggestions.map((suggestion, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 bg-muted/50 border border-border rounded-xl">
                    <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-700 text-primary">{i + 1}</span>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">{suggestion}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!analysisResult && !isLoading && (
        <div className="bg-card border border-border border-dashed rounded-2xl p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Icon name="ScanSearchIcon" size={28} className="text-primary" />
          </div>
          <h3 className="font-700 text-foreground mb-2">Prêt à analyser</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            Collez une fiche de poste ci-dessus et Gemini calculera votre score de compatibilité, rédigera votre accroche et vos descriptions de projets.
          </p>
        </div>
      )}
    </div>
  );
}
