import { motion } from 'framer-motion';
import { ArrowRight, BarChart3, Users, Zap, CheckCircle2, Building2, ShieldCheck, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@routes/index';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

export default function CommercialPage() {
  return (
    <div className="min-h-screen bg-background pt-[72px]">
      
      {/* ─── HERO SECTION ─── */}
      <section className="relative py-20 lg:py-32 overflow-hidden bg-mesh">
        <div className="absolute inset-0 bg-background/60 backdrop-blur-sm z-0" />
        <div className="page-container relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <motion.div 
              initial="hidden" animate="visible" variants={staggerContainer}
              className="flex-1 text-center lg:text-left"
            >
              <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-semibold mb-6">
                <Zap size={16} className="text-amber-500" />
                L'outil de croissance B2B
              </motion.div>
              <motion.h1 variants={fadeIn} className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight mb-6 text-foreground">
                Gérez vos ventes avec une <span className="gradient-text">précision chirurgicale.</span>
              </motion.h1>
              <motion.p variants={fadeIn} className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0">
                Karochebama Business centralise votre CRM, vos devis et votre facturation. Automatisez vos tâches répétitives et concentrez-vous sur la clôture de vos contrats.
              </motion.p>
              <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <Link to={ROUTES.AUTH.REGISTER} className="btn-primary py-4 px-8 text-base shadow-glow w-full sm:w-auto">
                  Démarrer l'essai gratuit
                  <ArrowRight size={20} />
                </Link>
                <Link to="/contact" className="btn-secondary py-4 px-8 text-base w-full sm:w-auto">
                  Contacter les ventes
                </Link>
              </motion.div>
              <motion.p variants={fadeIn} className="text-sm text-muted-foreground mt-4">
                Aucune carte de crédit requise. Essai de 14 jours.
              </motion.p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
              className="flex-1 w-full max-w-2xl"
            >
              <div className="relative rounded-2xl border border-border bg-card shadow-glass-lg p-2 overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl" />
                
                <div className="relative bg-background rounded-xl border border-border p-6 flex flex-col gap-6">
                  {/* Mockup Dashboard */}
                  <div className="flex items-center justify-between border-b border-border pb-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Revenu Mensuel</span>
                      <span className="text-2xl font-bold font-display">24 500 €</span>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 text-sm font-bold flex items-center gap-1">
                      +14.5%
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                     <div className="h-32 bg-muted/50 rounded-xl flex items-end p-4 border border-border">
                        <div className="w-full h-1/2 bg-primary-500/20 rounded-t-lg relative">
                           <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-primary-500/40 to-transparent rounded-t-lg" />
                        </div>
                     </div>
                     <div className="h-32 bg-muted/50 rounded-xl flex flex-col gap-3 p-4 border border-border">
                        <div className="w-full h-3 bg-muted rounded-full" />
                        <div className="w-3/4 h-3 bg-muted rounded-full" />
                        <div className="w-1/2 h-3 bg-muted rounded-full mt-auto" />
                     </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── SOCIAL PROOF ─── */}
      <section className="py-10 border-y border-border bg-card">
        <div className="page-container">
          <p className="text-center text-sm font-bold text-muted-foreground uppercase tracking-widest mb-6">
            Ils propulsent leur croissance avec nous
          </p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Logos factices textuels */}
            <h4 className="font-display font-bold text-xl flex items-center gap-2"><Building2 /> AcmeCorp</h4>
            <h4 className="font-display font-bold text-xl flex items-center gap-2"><Zap /> FlashLogis</h4>
            <h4 className="font-display font-bold text-xl flex items-center gap-2"><ShieldCheck /> SecureNet</h4>
            <h4 className="font-display font-bold text-xl flex items-center gap-2"><Mail /> InboxPro</h4>
          </div>
        </div>
      </section>

      {/* ─── BENTO GRID FEATURES ─── */}
      <section className="py-24 bg-background">
        <div className="page-container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">Tout votre business, <br/> dans une seule interface.</h2>
            <p className="text-lg text-muted-foreground">Fini les allers-retours entre 5 logiciels différents. Karochebama unifie l'ensemble de votre processus de vente.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Bento Box 1 - Large */}
            <div className="md:col-span-2 glass-card rounded-3xl p-8 flex flex-col overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl group-hover:bg-primary-500/20 transition-colors duration-500" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 flex items-center justify-center mb-6">
                  <Users size={24} />
                </div>
                <h3 className="text-2xl font-bold mb-3">CRM Intelligent</h3>
                <p className="text-muted-foreground mb-6 max-w-md">Suivez chaque interaction avec vos clients. Notre CRM trie automatiquement vos leads par niveau d'engagement pour vous aider à prioriser.</p>
                <Link to={ROUTES.AUTH.REGISTER} className="inline-flex items-center gap-2 text-primary-600 font-medium hover:text-primary-700">Découvrir le CRM <ArrowRight size={16}/></Link>
              </div>
            </div>

            {/* Bento Box 2 - Small */}
            <div className="md:col-span-1 glass-card rounded-3xl p-8 flex flex-col relative group">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 flex items-center justify-center mb-6">
                <BarChart3 size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Analytiques</h3>
              <p className="text-muted-foreground mb-6 text-sm">Visualisez vos performances en temps réel avec des graphiques clairs et exportables.</p>
            </div>

            {/* Bento Box 3 - Small */}
            <div className="md:col-span-1 glass-card rounded-3xl p-8 flex flex-col relative group">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center mb-6">
                <Mail size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Facturation Auto</h3>
              <p className="text-muted-foreground mb-6 text-sm">Générez devis et factures en 1 clic. Relances automatiques intégrées.</p>
            </div>

            {/* Bento Box 4 - Large */}
            <div className="md:col-span-2 glass-card rounded-3xl p-8 flex flex-col relative group overflow-hidden bg-gradient-to-br from-card to-muted">
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center mb-6">
                    <ShieldCheck size={24} />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Contrats Sécurisés</h3>
                  <p className="text-muted-foreground">Signatures électroniques certifiées et archivage légal de tous vos documents commerciaux.</p>
                </div>
                <div className="flex-1 w-full bg-background border border-border rounded-xl p-4 shadow-sm">
                  <div className="flex items-center gap-3 mb-3 pb-3 border-b border-border">
                    <CheckCircle2 className="text-emerald-500" size={20} />
                    <span className="font-medium text-sm">Contrat de prestation signé</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Client: AcmeCorp</span>
                    <span>Aujourd'hui, 14:30</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PRICING ─── */}
      <section className="py-24 bg-card relative border-t border-border">
        <div className="page-container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">Des tarifs clairs, <br/> sans mauvaises surprises.</h2>
            <p className="text-lg text-muted-foreground">Choisissez le plan adapté à la taille de votre entreprise.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
            
            {/* Starter */}
            <div className="bg-background rounded-3xl p-8 border border-border shadow-sm">
              <h3 className="text-xl font-bold mb-2">Starter</h3>
              <p className="text-sm text-muted-foreground mb-6">Pour les indépendants qui se lancent.</p>
              <div className="mb-8">
                <span className="text-4xl font-display font-bold">29€</span>
                <span className="text-muted-foreground">/mois</span>
              </div>
              <ul className="space-y-4 mb-8">
                {['Jusqu\'à 100 clients', 'Facturation basique', 'Support par email', '1 Utilisateur'].map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <CheckCircle2 size={16} className="text-primary-500 shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <button className="btn-secondary w-full">Essai 14 jours</button>
            </div>

            {/* Pro - Highlighted */}
            <div className="bg-primary-950 dark:bg-primary-900 rounded-3xl p-8 border border-primary-800 shadow-glow relative transform md:-translate-y-4">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">
                Le plus populaire
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Pro</h3>
              <p className="text-sm text-primary-200 mb-6">L'arsenal complet pour les PME.</p>
              <div className="mb-8 text-white">
                <span className="text-5xl font-display font-bold">79€</span>
                <span className="text-primary-200">/mois</span>
              </div>
              <ul className="space-y-4 mb-8 text-primary-100">
                {['Clients illimités', 'CRM Avancé + Automatisations', 'Signatures électroniques', 'Support prioritaire 24/7', 'Jusqu\'à 5 Utilisateurs'].map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <CheckCircle2 size={16} className="text-amber-400 shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <button className="w-full py-3 rounded-lg bg-white text-primary-950 font-bold hover:bg-primary-50 transition-colors shadow-lg">
                Démarrer l'essai
              </button>
            </div>

            {/* Enterprise */}
            <div className="bg-background rounded-3xl p-8 border border-border shadow-sm">
              <h3 className="text-xl font-bold mb-2">Entreprise</h3>
              <p className="text-sm text-muted-foreground mb-6">Sur mesure pour les grands comptes.</p>
              <div className="mb-8">
                <span className="text-4xl font-display font-bold">Sur devis</span>
              </div>
              <ul className="space-y-4 mb-8">
                {['Tout du forfait Pro', 'Développements sur mesure', 'Manager de compte dédié', 'API Complète', 'Utilisateurs illimités'].map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <CheckCircle2 size={16} className="text-primary-500 shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <button className="btn-secondary w-full">Contacter les ventes</button>
            </div>

          </div>
        </div>
      </section>
      
    </div>
  );
}
