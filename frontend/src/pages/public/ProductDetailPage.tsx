import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, ShoppingCart, ShieldCheck, Zap, DownloadCloud, Clock, Check } from 'lucide-react';
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

// ─── MOCK DATA ─────────────────────────────────────────────────────────────
const PRODUCT_MOCK = {
  id: '1',
  title: 'Suite CRM Premium',
  vendor: 'TechSolutions',
  price: '299€',
  rating: 4.8,
  reviewsCount: 124,
  category: 'Logiciels',
  image: 'bg-gradient-to-br from-blue-500 to-indigo-600',
  shortDescription: 'Une solution complète pour gérer vos clients, automatiser vos ventes et analyser vos performances en temps réel.',
  description: `La Suite CRM Premium est l'outil ultime pour les entreprises cherchant à optimiser leur relation client. 
  
Avec une interface intuitive et des fonctionnalités avancées propulsées par l'IA, vous pourrez suivre chaque prospect, automatiser vos relances et générer des rapports détaillés en un clic.
  
Que vous soyez une petite agence ou une grande entreprise, cette suite s'adapte à vos besoins grâce à ses modules personnalisables.`,
  features: [
    'Tableau de bord personnalisé',
    'Automatisation des emails',
    'Gestion des pipelines de vente',
    'Intégration API avec plus de 50 outils',
    'Support prioritaire 24/7'
  ],
  vendorInfo: {
    name: 'TechSolutions',
    rating: 4.9,
    sales: '10k+',
    joinedAt: '2022',
  }
};

export default function ProductDetailPage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('description');
  const [quantity, setQuantity] = useState(1);

  // Dans un cas réel, on utiliserait le ID pour fetcher les infos du produit.
  const product = PRODUCT_MOCK; 

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="page-container">
        
        {/* BREADCRUMB / BACK LINK */}
        <div className="mb-8">
          <Link to={ROUTES.MARKETPLACE} className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary-600 transition-colors font-medium">
            <ArrowLeft size={18} />
            Retour à la Marketplace
          </Link>
        </div>

        {/* ─── HERO PRODUCT (2 Columns) ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          
          {/* LEFT: Image Gallery */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-4"
          >
            <div className={`w-full aspect-[4/3] rounded-3xl ${product.image} shadow-glass-lg relative overflow-hidden group`}>
               {/* Decorative elements for the mock image */}
               <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
               <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white/50 font-display text-4xl font-bold tracking-widest uppercase -rotate-12 group-hover:scale-110 transition-transform duration-500">
                    Aperçu
                  </span>
               </div>
            </div>
            
            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((item) => (
                <button key={item} className={`aspect-square rounded-xl ${product.image} opacity-60 hover:opacity-100 border-2 border-transparent focus:border-primary-500 transition-all cursor-pointer`} />
              ))}
            </div>
          </motion.div>

          {/* RIGHT: Product Info */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.5 }}
            className="flex flex-col"
          >
            <div className="mb-4">
              <span className="inline-block px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-semibold mb-3">
                {product.category}
              </span>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4 leading-tight">
                {product.title}
              </h1>
              
              <div className="flex items-center gap-4 text-sm mb-6">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className={i < Math.floor(product.rating) ? "fill-current" : "opacity-30"} />
                  ))}
                  <span className="text-foreground font-medium ml-2">{product.rating}</span>
                  <span className="text-muted-foreground ml-1">({product.reviewsCount} avis)</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-border" />
                <span className="text-muted-foreground">Par <span className="text-foreground font-medium">{product.vendor}</span></span>
              </div>
            </div>

            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              {product.shortDescription}
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-8 text-sm">
              <div className="flex items-center gap-1.5 text-muted-foreground bg-muted px-3 py-1.5 rounded-lg">
                <ShieldCheck size={16} className="text-success" /> Achat sécurisé
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground bg-muted px-3 py-1.5 rounded-lg">
                <Zap size={16} className="text-amber-500" /> Livraison instantanée
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground bg-muted px-3 py-1.5 rounded-lg">
                <DownloadCloud size={16} className="text-blue-500" /> Fichiers inclus
              </div>
            </div>

            <div className="divider mb-8" />

            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Prix total</p>
                <span className="text-5xl font-display font-bold text-foreground tracking-tight">
                  {product.price}
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                <p className="text-sm font-medium mr-2">Qté:</p>
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors">-</button>
                <span className="w-8 text-center font-medium">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors">+</button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-auto">
              <button className="btn-primary flex-1 py-4 text-base font-bold shadow-lg shadow-primary-500/25">
                <ShoppingCart size={20} />
                Ajouter au panier
              </button>
              <button className="btn-secondary flex-1 py-4 text-base font-bold bg-card">
                Acheter maintenant
              </button>
            </div>
          </motion.div>
        </div>

        {/* ─── TABS SECTION ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-2">
            <div className="glass-card rounded-2xl p-2 mb-8 flex space-x-2 border-b border-border">
              {['description', 'caracteristiques', 'avis'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold capitalize transition-all ${
                    activeTab === tab 
                      ? 'bg-background shadow-sm text-foreground' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  {tab === 'caracteristiques' ? 'Caractéristiques' : tab}
                </button>
              ))}
            </div>

            <div className="min-h-[300px]">
              {activeTab === 'description' && (
                <motion.div initial="hidden" animate="visible" variants={fadeIn} className="prose prose-neutral dark:prose-invert max-w-none text-muted-foreground">
                  {product.description.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4">{paragraph}</p>
                  ))}
                </motion.div>
              )}

              {activeTab === 'caracteristiques' && (
                <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-4">
                  {product.features.map((feature, idx) => (
                    <motion.div key={idx} variants={fadeIn} className="flex items-center gap-3 bg-card border border-border p-4 rounded-xl">
                      <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 flex items-center justify-center shrink-0">
                        <Check size={16} />
                      </div>
                      <span className="font-medium text-foreground">{feature}</span>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {activeTab === 'avis' && (
                <motion.div initial="hidden" animate="visible" variants={fadeIn} className="text-center py-12 border border-dashed border-border rounded-2xl bg-muted/30">
                  <Star size={40} className="text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="text-lg font-bold mb-2">Avis clients</h3>
                  <p className="text-muted-foreground">La section des avis sera bientôt disponible.</p>
                </motion.div>
              )}
            </div>
          </div>

          {/* VENDOR CARD */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <h3 className="font-display font-bold text-xl mb-4">À propos du vendeur</h3>
              <div className="card p-6 border-t-4 border-t-primary-500">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-primary-600 to-amber-500 flex items-center justify-center text-white font-display font-bold text-2xl">
                    {product.vendorInfo.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">{product.vendorInfo.name}</h4>
                    <p className="text-sm text-muted-foreground">Membre depuis {product.vendorInfo.joinedAt}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-muted p-3 rounded-xl text-center">
                    <span className="block text-2xl font-display font-bold text-foreground">{product.vendorInfo.rating}</span>
                    <span className="text-xs text-muted-foreground">Note moyenne</span>
                  </div>
                  <div className="bg-muted p-3 rounded-xl text-center">
                    <span className="block text-2xl font-display font-bold text-foreground">{product.vendorInfo.sales}</span>
                    <span className="text-xs text-muted-foreground">Ventes</span>
                  </div>
                </div>
                
                <button className="btn-secondary w-full">
                  Voir le profil du vendeur
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
