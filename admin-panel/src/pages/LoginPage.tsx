import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { authService } from '../services/authService';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Tentative de connexion pour:', email);
      const success = await authService.login(email, password);
      if (success) {
        console.log('Connexion réussie !');
        navigate('/dashboard');
      } else {
        setError('Identifiants incorrects. Veuillez réessayer.');
      }
    } catch (err: any) {
      console.error('Erreur de connexion détaillée:', err);
      const message = err.response?.data?.error || 'Une erreur est survenue lors de la connexion.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-inter">
      {/* Background Decorative Elements */}
      <div className="fixed top-0 left-0 w-full h-1 bg-primary-500"></div>
      <div className="absolute top-20 left-10 w-64 h-64 bg-primary-100 rounded-full blur-3xl opacity-30 -z-10 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-200 rounded-full blur-3xl opacity-20 -z-10"></div>

      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500 rounded-2xl text-white shadow-xl shadow-primary-500/20 mb-6 rotate-3">
            <span className="text-3xl font-extrabold">K</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 font-outfit tracking-tight">KAROCHEBAMA</h1>
          <p className="text-slate-500 mt-2 font-medium">Panneau d'administration agricole</p>
        </div>

        {/* Login Card */}
        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 text-red-700 rounded-2xl text-sm animate-shake">
                <AlertCircle size={20} className="flex-shrink-0" />
                <p className="font-medium">{error}</p>
              </div>
            )}

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                  Adresse Email
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-500 transition-colors" size={20} />
                  <input
                    type="email"
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all"
                    placeholder="admin@karochebama.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                  Mot de passe
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-500 transition-colors" size={20} />
                  <input
                    type="password"
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-primary-500 focus:ring-primary-500" />
                <span className="text-xs text-slate-500 group-hover:text-slate-700 font-medium transition-colors">Se souvenir de moi</span>
              </label>
              <button type="button" className="text-xs font-bold text-primary-600 hover:text-primary-700 hover:underline">
                Mot de passe oublié ?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`
                w-full py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2
                ${loading 
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                  : 'bg-primary-500 text-white hover:bg-primary-600 shadow-lg shadow-primary-500/25 active:scale-[0.98]'}
              `}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Connexion en cours...
                </>
              ) : (
                <>
                  Se connecter
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-400 text-xs mt-8">
          &copy; {new Date().getFullYear()} Karochebama. Tous droits réservés.
          <br />
          <span className="mt-2 inline-block font-medium hover:text-slate-600 cursor-pointer transition-colors">Politique de confidentialité</span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

