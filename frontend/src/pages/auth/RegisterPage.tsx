import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Building2, ArrowRight, Zap } from 'lucide-react';
import { ROUTES } from '@routes/index';
import { useAuthStore } from '@store/useAuthStore';
import { apiClient } from '@services/apiClient';

// ─── Animation Variants ───────────────────────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.05 },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
} as const;

// ─── Password Strength ────────────────────────────────────────────────────────

function getPasswordStrength(password: string): { level: number; label: string; color: string } {
  if (!password) return { level: 0, label: '', color: 'bg-border' };
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { level: 1, label: 'Faible', color: 'bg-red-500' };
  if (score <= 2) return { level: 2, label: 'Moyen', color: 'bg-amber-500' };
  if (score <= 3) return { level: 3, label: 'Bon', color: 'bg-emerald-500' };
  return { level: 4, label: 'Excellent', color: 'bg-emerald-600' };
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function RegisterPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    organization: '',
    password: '',
  });

  const strength = getPasswordStrength(form.password);

  const { setAuth } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await apiClient.post('/auth/register', {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        organizationName: form.organization,
        password: form.password,
      });
      const { user, accessToken } = response.data.data;
      setAuth(user, accessToken);
      navigate(ROUTES.APP.DASHBOARD, { replace: true });
    } catch (error) {
      console.error("Erreur d'inscription:", error);
      // TODO: Afficher un toast d'erreur
    } finally {
      setIsLoading(false);
    }
  };

  const update = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  return (
    <>
      {/* Logo mobile */}
      <div className="flex items-center gap-2 mb-8 lg:hidden">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
          <Zap className="w-4 h-4 text-white" />
        </div>
        <span className="font-display font-bold text-lg text-foreground">KAROCHEBAMA</span>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-5"
      >
        {/* En-tête */}
        <motion.div variants={itemVariants} className="space-y-1">
          <h1 className="text-2xl font-display font-bold text-foreground">
            Créer votre compte
          </h1>
          <p className="text-muted-foreground text-sm">
            Essai gratuit 14 jours — aucune carte requise.
          </p>
        </motion.div>

        {/* Formulaire */}
        <motion.form variants={itemVariants} onSubmit={handleSubmit} className="space-y-4">

          {/* Nom / Prénom */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="register-firstname" className="block text-sm font-semibold text-foreground">
                Prénom
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  id="register-firstname"
                  type="text"
                  autoComplete="given-name"
                  required
                  placeholder="Jean"
                  value={form.firstName}
                  onChange={update('firstName')}
                  className="w-full pl-10 pr-3 py-3 rounded-xl border border-border bg-background text-foreground
                             placeholder:text-muted-foreground/50 text-sm
                             focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="register-lastname" className="block text-sm font-semibold text-foreground">
                Nom
              </label>
              <input
                id="register-lastname"
                type="text"
                autoComplete="family-name"
                required
                placeholder="Dupont"
                value={form.lastName}
                onChange={update('lastName')}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground
                           placeholder:text-muted-foreground/50 text-sm
                           focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
              />
            </div>
          </div>

          {/* Organisation */}
          <div className="space-y-1.5">
            <label htmlFor="register-org" className="block text-sm font-semibold text-foreground">
              Nom de l'organisation
            </label>
            <div className="relative">
              <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                id="register-org"
                type="text"
                autoComplete="organization"
                required
                placeholder="Acme Corp"
                value={form.organization}
                onChange={update('organization')}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background text-foreground
                           placeholder:text-muted-foreground/50 text-sm
                           focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label htmlFor="register-email" className="block text-sm font-semibold text-foreground">
              Adresse e-mail professionnelle
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                id="register-email"
                type="email"
                autoComplete="email"
                required
                placeholder="jean@acme.com"
                value={form.email}
                onChange={update('email')}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background text-foreground
                           placeholder:text-muted-foreground/50 text-sm
                           focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
              />
            </div>
          </div>

          {/* Mot de passe + indicateur de force */}
          <div className="space-y-1.5">
            <label htmlFor="register-password" className="block text-sm font-semibold text-foreground">
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                id="register-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                minLength={8}
                placeholder="Min. 8 caractères"
                value={form.password}
                onChange={update('password')}
                className="w-full pl-10 pr-11 py-3 rounded-xl border border-border bg-background text-foreground
                           placeholder:text-muted-foreground/50 text-sm
                           focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showPassword ? 'Masquer' : 'Afficher'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Indicateur force mot de passe */}
            {form.password && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-1.5 pt-1"
              >
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                        i <= strength.level ? strength.color : 'bg-border'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Force : <span className="font-bold text-foreground">{strength.label}</span>
                </p>
              </motion.div>
            )}
          </div>

          {/* Submit */}
          <button
            id="register-submit"
            type="submit"
            disabled={isLoading}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl
                       bg-primary-600 hover:bg-primary-700 active:bg-primary-800
                       text-white font-bold text-sm
                       transition-all duration-200 shadow-glow
                       disabled:opacity-60 disabled:cursor-not-allowed
                       mt-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Création du compte…
              </>
            ) : (
              <>
                Commencer l'essai gratuit
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <p className="text-xs text-muted-foreground text-center mt-4">
            En créant un compte, vous acceptez nos{' '}
            <a href="#" className="underline underline-offset-2 hover:text-foreground transition-colors">
              Conditions d'utilisation
            </a>{' '}
            et notre{' '}
            <a href="#" className="underline underline-offset-2 hover:text-foreground transition-colors">
              Politique de confidentialité
            </a>.
          </p>
        </motion.form>

        {/* Lien connexion */}
        <motion.div variants={itemVariants} className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-background px-3 text-muted-foreground uppercase tracking-widest font-semibold">
              Déjà un compte ?
            </span>
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Link
            to={ROUTES.AUTH.LOGIN}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl
                       bg-card hover:bg-muted border border-border
                       text-foreground font-bold text-sm
                       transition-all duration-200"
          >
            Se connecter
          </Link>
        </motion.div>
      </motion.div>
    </>
  );
}
