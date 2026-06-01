import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, ChevronRight } from 'lucide-react';

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
const MOCK_CATEGORIES = ['Tous', 'Actualités', 'Tutoriels', 'Études de cas', 'Conseils Pro'];

const FEATURED_ARTICLE = {
  id: 'f1',
  title: 'Comment maximiser vos ventes sur la Marketplace Karochebama en 2024',
  excerpt: 'Découvrez les stratégies inédites et les nouvelles fonctionnalités qui vous permettront de doubler votre chiffre d\'affaires cette année.',
  category: 'Conseils Pro',
  date: '24 Mai 2026',
  author: 'Sarah M.',
  image: 'bg-[url("https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2000")] bg-cover bg-center',
};

const MOCK_ARTICLES = [
  {
    id: 1,
    title: 'Les 10 meilleurs plugins pour optimiser votre workflow',
    excerpt: 'Gagnez un temps précieux avec cette sélection d\'outils incontournables testés par notre équipe.',
    category: 'Tutoriels',
    date: '20 Mai 2026',
    author: 'Alex T.',
    image: 'bg-gradient-to-br from-indigo-500 to-purple-600',
  },
  {
    id: 2,
    title: 'Mise à jour v1.2 : Découvrez la nouvelle Médiathèque',
    excerpt: 'Une interface repensée et des milliers de nouvelles ressources ajoutées ce mois-ci.',
    category: 'Actualités',
    date: '15 Mai 2026',
    author: 'L\'équipe Karochebama',
    image: 'bg-gradient-to-br from-blue-400 to-cyan-500',
  },
  {
    id: 3,
    title: 'De 0 à 10k€/mois : L\'histoire de réussite de DesignMaster',
    excerpt: 'Comment un créateur indépendant a bâti un empire sur notre marketplace en moins de 6 mois.',
    category: 'Études de cas',
    date: '10 Mai 2026',
    author: 'Sophie L.',
    image: 'bg-gradient-to-br from-emerald-400 to-teal-500',
  },
  {
    id: 4,
    title: 'Sécuriser ses transactions en ligne : Le guide définitif',
    excerpt: 'Comprenez les mécanismes de sécurité de notre plateforme pour vendre et acheter sereinement.',
    category: 'Tutoriels',
    date: '05 Mai 2026',
    author: 'Marc D.',
    image: 'bg-gradient-to-br from-slate-600 to-slate-800',
  },
  {
    id: 5,
    title: 'Pourquoi l\'espace Commercial va révolutionner votre B2B',
    excerpt: 'Gestion des leads, devis automatiques et contrats intelligents : plongez dans le futur du commerce.',
    category: 'Actualités',
    date: '02 Mai 2026',
    author: 'Sarah M.',
    image: 'bg-gradient-to-br from-orange-400 to-rose-500',
  },
  {
    id: 6,
    title: 'Construire une marque personnelle forte en 5 étapes',
    excerpt: 'Les acheteurs font confiance aux marques. Voici comment bâtir la vôtre facilement.',
    category: 'Conseils Pro',
    date: '28 Avril 2026',
    author: 'Alex T.',
    image: 'bg-gradient-to-br from-fuchsia-500 to-pink-600',
  },
];

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('Tous');

  const filteredArticles = MOCK_ARTICLES.filter(
    article => activeCategory === 'Tous' || article.category === activeCategory
  );

  return (
    <div className="flex flex-col min-h-screen bg-background">
      
      {/* ─── FEATURED ARTICLE (HERO) ─── */}
      <section className="relative pt-24 pb-12 lg:pt-32 lg:pb-16 px-4 sm:px-6 lg:px-8 max-w-screen-2xl mx-auto w-full">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={`relative w-full h-[60vh] min-h-[400px] rounded-[2rem] overflow-hidden ${FEATURED_ARTICLE.image} shadow-glass-lg group cursor-pointer flex items-end`}
        >
          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-0" />
          <div className="absolute inset-0 bg-primary-900/20 mix-blend-multiply z-0 group-hover:bg-transparent transition-colors duration-500" />
          
          <div className="relative z-10 p-8 md:p-12 max-w-4xl">
            <span className="inline-block px-3 py-1 mb-4 text-xs font-bold uppercase tracking-wider text-white bg-primary-600 rounded-full">
              {FEATURED_ARTICLE.category}
            </span>
            <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-4 leading-tight group-hover:text-primary-300 transition-colors">
              {FEATURED_ARTICLE.title}
            </h1>
            <p className="text-lg text-white/80 mb-6 max-w-2xl hidden md:block">
              {FEATURED_ARTICLE.excerpt}
            </p>
            <div className="flex items-center gap-6 text-sm text-white/60">
              <span className="flex items-center gap-2"><Calendar size={16} /> {FEATURED_ARTICLE.date}</span>
              <span className="flex items-center gap-2"><User size={16} /> {FEATURED_ARTICLE.author}</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ─── CATEGORY FILTER ─── */}
      <section className="sticky top-[72px] z-40 bg-background/80 backdrop-blur-md border-b border-border py-4">
        <div className="page-container">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
            {MOCK_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20'
                    : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ARTICLE GRID ─── */}
      <section className="py-16 flex-1">
        <div className="page-container">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            key={activeCategory} // Force re-render animation on category change
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredArticles.map((article) => (
              <motion.article 
                key={article.id} 
                variants={fadeIn} 
                className="glass-card rounded-2xl overflow-hidden flex flex-col group hover:-translate-y-1 hover:shadow-card-hover transition-all duration-300 cursor-pointer"
              >
                {/* Thumbnail */}
                <div className={`w-full aspect-[16/9] ${article.image} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300" />
                </div>
                
                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 px-2 py-1 rounded-md">
                      {article.category}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar size={12} />
                      {article.date}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-foreground mb-3 leading-snug group-hover:text-primary-600 transition-colors">
                    {article.title}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm mb-6 flex-1">
                    {article.excerpt}
                  </p>
                  
                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-border">
                    <span className="text-sm font-medium flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs">
                        {article.author.charAt(0)}
                      </div>
                      {article.author}
                    </span>
                    <span className="text-primary-600 dark:text-primary-400 text-sm font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Lire <ChevronRight size={16} />
                    </span>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
          
          {filteredArticles.length === 0 && (
            <div className="text-center py-20">
              <h3 className="text-xl font-bold mb-2">Aucun article trouvé</h3>
              <p className="text-muted-foreground">Aucun article ne correspond à cette catégorie pour le moment.</p>
            </div>
          )}
          
          {filteredArticles.length > 0 && (
            <div className="mt-16 text-center">
              <button className="btn-secondary px-8 py-3">
                Charger d'anciens articles
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ─── NEWSLETTER SECTION ─── */}
      <section className="py-20 bg-primary-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-mesh opacity-20" />
        <div className="page-container relative z-10 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Ne manquez aucune astuce</h2>
          <p className="text-primary-100/80 mb-8 text-lg">
            Abonnez-vous à notre newsletter pour recevoir nos meilleurs articles, nos études de cas et nos annonces en avant-première.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Votre adresse email" 
              className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button className="px-6 py-3 rounded-xl bg-white text-primary-950 font-bold hover:bg-primary-50 transition-colors">
              S'abonner
            </button>
          </form>
        </div>
      </section>

    </div>
  );
}
