import { Link, Outlet, useLocation } from 'react-router-dom';
import { Menu, X, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ROUTES } from '@routes/index';

export function PublicLayout() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Accueil', path: ROUTES.ROOT },
    { label: 'Marketplace', path: '/marketplace' },
    { label: 'Médiathèque', path: '/mediatheque' },
    { label: 'Blog', path: '/blog' },
    { label: 'Commercial', path: '/commercial' },
    { label: 'Partenariat', path: '/partnership' },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans selection:bg-primary-500/30">
      {/* Header Premium */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-background/80 backdrop-blur-md border-b border-border shadow-sm py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link to={ROUTES.ROOT} className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 to-primary-400 flex items-center justify-center text-white font-display font-bold text-xl shadow-glow transition-transform group-hover:scale-105">
              K
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-foreground">
              KAROCHE<span className="text-primary-600">BAMA</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-primary-600 ${
                  location.pathname === link.path
                    ? 'text-primary-600'
                    : 'text-muted-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link to={ROUTES.AUTH.LOGIN} className="btn-ghost">
              Connexion
            </Link>
            <Link to={ROUTES.AUTH.REGISTER} className="btn-primary">
              Créer un compte
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-border shadow-glass-lg p-4 flex flex-col gap-4 animate-slide-down">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="px-4 py-3 rounded-lg hover:bg-muted text-foreground font-medium transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="divider my-2" />
            <div className="flex flex-col gap-2">
              <Link
                to={ROUTES.AUTH.LOGIN}
                className="btn-secondary w-full justify-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Connexion
              </Link>
              <Link
                to={ROUTES.AUTH.REGISTER}
                className="btn-primary w-full justify-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Créer un compte
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full pt-[72px]">
        <Outlet />
      </main>

      {/* Footer Premium */}
      <footer className="border-t border-border bg-card mt-24">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
            <div className="col-span-1 md:col-span-1">
              <Link to={ROUTES.ROOT} className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary-600 to-primary-400 flex items-center justify-center text-white font-display font-bold text-lg">
                  K
                </div>
                <span className="font-display font-bold text-lg text-foreground">
                  KAROCHEBAMA
                </span>
              </Link>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                La plateforme ultime pour développer votre activité, connecter avec des partenaires et découvrir les meilleurs produits.
              </p>
              <div className="flex items-center gap-4">
                {/* Social placeholders */}
                {['Twitter', 'LinkedIn', 'Instagram'].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary-100 hover:text-primary-600 transition-colors"
                  >
                    <span className="sr-only">{social}</span>
                    <div className="w-4 h-4 bg-current" style={{ mask: 'url(#)' }} />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-display font-bold mb-4">Plateforme</h4>
              <ul className="flex flex-col gap-3">
                <li><Link to="/marketplace" className="text-muted-foreground hover:text-primary-600 text-sm transition-colors">Marketplace</Link></li>
                <li><Link to="/mediatheque" className="text-muted-foreground hover:text-primary-600 text-sm transition-colors">Médiathèque</Link></li>
                <li><Link to="/blog" className="text-muted-foreground hover:text-primary-600 text-sm transition-colors">Blog</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-display font-bold mb-4">Solutions</h4>
              <ul className="flex flex-col gap-3">
                <li><Link to="/commercial" className="text-muted-foreground hover:text-primary-600 text-sm transition-colors">Espace Commercial</Link></li>
                <li><Link to="/partnership" className="text-muted-foreground hover:text-primary-600 text-sm transition-colors">Partenariat</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-display font-bold mb-4">Newsletter</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Restez informé de nos dernières actualités et offres.
              </p>
              <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Votre email"
                  className="input-base flex-1"
                />
                <button type="submit" className="btn-primary px-3">
                  <ChevronRight size={18} />
                </button>
              </form>
            </div>
          </div>
          
          <div className="divider my-8" />
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Karochebama. Tous droits réservés.
            </p>
            <div className="flex items-center gap-6">
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground">Confidentialité</Link>
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground">CGU</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
