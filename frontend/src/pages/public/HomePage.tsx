import { motion } from 'framer-motion';
import { ArrowRight, ShoppingBag, BookOpen, Shield, Zap, Target } from 'lucide-react';
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
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* ─── HERO SECTION ─── */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-mesh">
        <div className="absolute inset-0 bg-background/50 backdrop-blur-[2px] z-0" />
        
        <div className="page-container relative z-10 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-4xl mx-auto flex flex-col items-center"
          >
            <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-300 text-sm font-medium mb-8 border border-primary-100 dark:border-primary-800/50">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
              </span>
              Plateforme v1.0 disponible
            </motion.div>
            
            <motion.h1 variants={fadeIn} className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-6 leading-tight">
              L'écosystème <span className="gradient-text">ultime</span> pour votre réussite.
            </motion.h1>
            
            <motion.p variants={fadeIn} className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed">
              Karochebama réunit Marketplace, Médiathèque, et Outils Commerciaux dans une interface premium. Développez votre activité sans limites.
            </motion.p>
            
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
              <Link to={ROUTES.AUTH.REGISTER} className="btn-primary w-full sm:w-auto text-base px-8 py-4">
                Commencer gratuitement
                <ArrowRight size={20} />
              </Link>
              <Link to="/marketplace" className="btn-secondary w-full sm:w-auto text-base px-8 py-4">
                Explorer la Marketplace
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating decorative elements */}
        <div className="absolute top-1/4 left-10 w-24 h-24 bg-primary-400/20 rounded-full blur-3xl animate-pulse-glow z-0" />
        <div className="absolute bottom-1/4 right-10 w-32 h-32 bg-amber-400/20 rounded-full blur-3xl animate-pulse-glow z-0" style={{ animationDelay: '1s' }} />
      </section>

      {/* ─── FEATURES SECTION ─── */}
      <section className="py-24 bg-card relative">
        <div className="page-container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="section-title text-3xl md:text-4xl mb-4">
              Tout ce dont vous avez besoin
            </h2>
            <p className="text-muted-foreground text-lg">
              Une suite d'outils interconnectés conçue pour maximiser votre productivité et vos ventes.
            </p>
          </div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {/* Feature 1 */}
            <motion.div variants={fadeIn} className="glass-card rounded-2xl p-8 hover:shadow-glow transition-all duration-300 group">
              <div className="w-14 h-14 rounded-xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShoppingBag size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Marketplace B2B & B2C</h3>
              <p className="text-muted-foreground">
                Vendez vos produits ou achetez auprès des meilleurs fournisseurs sur une place de marché sécurisée et dynamique.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div variants={fadeIn} className="glass-card rounded-2xl p-8 hover:shadow-glow transition-all duration-300 group">
              <div className="w-14 h-14 rounded-xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BookOpen size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Médiathèque Enrichie</h3>
              <p className="text-muted-foreground">
                Accédez à des milliers de ressources numériques, formations et documents exclusifs pour booster vos compétences.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div variants={fadeIn} className="glass-card rounded-2xl p-8 hover:shadow-glow transition-all duration-300 group">
              <div className="w-14 h-14 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Outils Commerciaux</h3>
              <p className="text-muted-foreground">
                Gérez vos leads, automatisez vos factures et suivez vos performances commerciales en temps réel.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── HIGHLIGHT SECTION ─── */}
      <section className="py-24 bg-background overflow-hidden relative">
        <div className="page-container relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 text-amber-500 font-semibold tracking-wider uppercase text-sm mb-4">
                  <Shield size={18} />
                  Sécurité & Fiabilité
                </div>
                <h2 className="text-3xl md:text-5xl font-display font-bold mb-6 leading-tight">
                  Un environnement de confiance pour vos affaires.
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Nous mettons en œuvre les technologies de pointe pour garantir la sécurité de vos transactions et la confidentialité de vos données. Concentrez-vous sur l'essentiel : votre croissance.
                </p>
                <ul className="space-y-4 mb-8">
                  {['Transactions chiffrées de bout en bout', 'Vérification stricte des vendeurs', 'Support client dédié 24/7'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-primary-600">
                        <Target size={14} />
                      </div>
                      <span className="text-foreground font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
            <div className="lg:w-1/2 w-full">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                {/* Mockup Dashboard abstrait */}
                <div className="gradient-border rounded-2xl aspect-video bg-card shadow-glass-lg p-2">
                  <div className="w-full h-full bg-background rounded-xl overflow-hidden flex flex-col">
                    <div className="h-10 border-b border-border flex items-center px-4 gap-2 bg-muted/30">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <div className="w-3 h-3 rounded-full bg-amber-400" />
                      <div className="w-3 h-3 rounded-full bg-green-400" />
                    </div>
                    <div className="flex-1 p-6 grid grid-cols-3 gap-4">
                      <div className="col-span-2 space-y-4">
                        <div className="h-24 rounded-xl bg-primary-100/50 dark:bg-primary-900/20 border border-primary-200/50 flex items-center p-4">
                          <div className="w-12 h-12 rounded-full bg-primary-200/50 dark:bg-primary-800/50 mr-4 animate-pulse" />
                          <div className="space-y-2 flex-1">
                            <div className="h-4 w-1/3 bg-muted rounded" />
                            <div className="h-3 w-1/4 bg-muted/60 rounded" />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="h-32 rounded-xl bg-muted/30 border border-border" />
                          <div className="h-32 rounded-xl bg-muted/30 border border-border" />
                        </div>
                      </div>
                      <div className="col-span-1">
                        <div className="h-full rounded-xl bg-muted/30 border border-border p-4 flex flex-col gap-3">
                           <div className="h-3 w-full bg-muted rounded" />
                           <div className="h-3 w-4/5 bg-muted rounded" />
                           <div className="h-3 w-5/6 bg-muted rounded" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA SECTION ─── */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950 z-0" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay z-0" />
        
        <div className="page-container relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
              Prêt à transformer votre vision en réalité ?
            </h2>
            <p className="text-primary-100 text-lg mb-10">
              Rejoignez des milliers de professionnels qui font confiance à Karochebama pour propulser leur activité au niveau supérieur.
            </p>
            <Link to={ROUTES.AUTH.REGISTER} className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white text-primary-900 font-bold text-lg hover:bg-primary-50 transition-colors shadow-xl hover:shadow-2xl hover:-translate-y-1 transform duration-200">
              Créer mon compte gratuit
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
