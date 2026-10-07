'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import AppLogo from '@/components/ui/AppLogo';
import Icon from '@/components/ui/AppIcon';

type Role = 'job_seeker' | 'recruiter';

export default function RegisterPage() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [step, setStep] = useState<'role' | 'form'>('role');
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setStep('form');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    if (!selectedRole) return;
    setLoading(true);
    try {
      await signUp(email, password, { fullName, role: selectedRole });
      if (selectedRole === 'recruiter') {
        router.push('/recruiter-dashboard');
      } else {
        router.push('/');
      }
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la création du compte.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <AppLogo size={40} />
          <span className="font-bold text-2xl text-foreground tracking-tight">TalentHub</span>
        </div>

        {step === 'role' ? (
          <div className="bg-card border border-border rounded-2xl p-8 shadow-card">
            <h1 className="text-xl font-700 text-foreground mb-1 text-center">Créer un compte</h1>
            <p className="text-sm text-muted-foreground mb-8 text-center">
              Choisissez votre profil pour accéder à l'espace qui vous correspond
            </p>

            <div className="grid grid-cols-1 gap-4">
              {/* Job Seeker */}
              <button
                onClick={() => handleRoleSelect('job_seeker')}
                className="group flex items-start gap-4 p-5 bg-background border-2 border-border rounded-2xl hover:border-primary hover:bg-primary/5 transition-all text-left"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500/20 transition-colors">
                  <Icon name="UserIcon" size={22} className="text-blue-500" />
                </div>
                <div className="flex-1">
                  <p className="font-700 text-foreground text-base mb-1">Chercheur d'emploi</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Créez votre portfolio professionnel, gérez votre CVthèque et postulez aux offres via votre profil.
                  </p>
                </div>
                <Icon name="ChevronRightIcon" size={18} className="text-muted-foreground group-hover:text-primary mt-1 flex-shrink-0 transition-colors" />
              </button>

              {/* Recruiter */}
              <button
                onClick={() => handleRoleSelect('recruiter')}
                className="group flex items-start gap-4 p-5 bg-background border-2 border-border rounded-2xl hover:border-primary hover:bg-primary/5 transition-all text-left"
              >
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-500/20 transition-colors">
                  <Icon name="BuildingIcon" size={22} className="text-purple-500" />
                </div>
                <div className="flex-1">
                  <p className="font-700 text-foreground text-base mb-1">Recruteur</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Publiez des offres, explorez les portfolios des talents et gérez vos recrutements en un seul endroit.
                  </p>
                </div>
                <Icon name="ChevronRightIcon" size={18} className="text-muted-foreground group-hover:text-primary mt-1 flex-shrink-0 transition-colors" />
              </button>
            </div>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Déjà un compte ?{' '}
              <Link href="/login" className="text-primary font-600 hover:underline">
                Se connecter
              </Link>
            </p>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-2xl p-8 shadow-card">
            {/* Role badge */}
            <div className="flex items-center gap-2 mb-5">
              <button
                onClick={() => setStep('role')}
                className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
              >
                <Icon name="ArrowLeftIcon" size={16} />
              </button>
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-600 ${
                selectedRole === 'recruiter' ?'bg-purple-500/10 text-purple-500' :'bg-blue-500/10 text-blue-500'
              }`}>
                <Icon name={selectedRole === 'recruiter' ? 'BuildingIcon' : 'UserIcon'} size={12} />
                {selectedRole === 'recruiter' ? 'Recruteur' : 'Chercheur d\'emploi'}
              </div>
            </div>

            <h1 className="text-xl font-700 text-foreground mb-1">Créer votre compte</h1>
            <p className="text-sm text-muted-foreground mb-6">
              {selectedRole === 'recruiter' ?'Accédez à votre espace recruteur' :'Commencez à construire votre portfolio'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-600 text-foreground mb-1.5">Nom complet</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={selectedRole === 'recruiter' ? 'Marie Dupont' : 'Alexandre Martin'}
                  required
                  className="w-full px-3 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-600 text-foreground mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vous@exemple.com"
                  required
                  className="w-full px-3 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-600 text-foreground mb-1.5">Mot de passe</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 caractères"
                    required
                    minLength={6}
                    className="w-full px-3 py-2.5 pr-10 bg-background border border-border rounded-xl text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <Icon name={showPassword ? 'EyeOffIcon' : 'EyeIcon'} size={15} />
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 px-3 py-2.5 bg-negative/10 border border-negative/20 rounded-xl text-sm text-negative">
                  <Icon name="AlertCircleIcon" size={14} />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-600 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all btn-press"
              >
                {loading ? (
                  <Icon name="Loader2Icon" size={15} className="animate-spin" />
                ) : (
                  <Icon name="UserPlusIcon" size={15} />
                )}
                {loading ? 'Création...' : 'Créer mon compte'}
              </button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Déjà un compte ?{' '}
              <Link href="/login" className="text-primary font-600 hover:underline">
                Se connecter
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
