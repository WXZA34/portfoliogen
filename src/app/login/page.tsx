'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import AppLogo from '@/components/ui/AppLogo';
import Icon from '@/components/ui/AppIcon';

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
      router.push('/');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Identifiants incorrects. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setEmail('demo@portfoliogen.io');
    setPassword('demo1234');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <AppLogo size={40} />
          <span className="font-bold text-2xl text-foreground tracking-tight">PortfolioGen</span>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 shadow-card">
          <h1 className="text-xl font-700 text-foreground mb-1">Connexion</h1>
          <p className="text-sm text-muted-foreground mb-6">Accédez à votre espace portfolio</p>

          {/* Demo credentials */}
          <button
            type="button"
            onClick={fillDemo}
            className="w-full flex items-center gap-2 px-4 py-3 bg-secondary border border-border rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-all mb-6"
          >
            <Icon name="ZapIcon" size={14} className="text-primary" />
            <span>Compte démo : <span className="font-mono-data text-foreground">demo@portfoliogen.io</span> / <span className="font-mono-data text-foreground">demo1234</span></span>
          </button>

          <form onSubmit={handleSubmit} className="space-y-4">
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
                  placeholder="••••••••"
                  required
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
                <Icon name="LogInIcon" size={15} />
              )}
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Pas encore de compte ?{' '}
            <Link href="/register" className="text-primary font-600 hover:underline">
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
