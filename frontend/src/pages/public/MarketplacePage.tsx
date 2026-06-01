import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Star, ShoppingCart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

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
const MOCK_CATEGORIES = ['Tous', 'Logiciels', 'Design', 'Marketing', 'Formations', 'E-commerce'];

const MOCK_PRODUCTS = [
  { id: 1, title: 'Suite CRM Premium', vendor: 'TechSolutions', price: '299€', rating: 4.8, category: 'Logiciels', image: 'bg-gradient-to-br from-blue-500 to-indigo-600' },
  { id: 2, title: 'Kit UI/UX Complet 2024', vendor: 'DesignMaster', price: '49€', rating: 4.9, category: 'Design', image: 'bg-gradient-to-br from-pink-500 to-rose-600' },
  { id: 3, title: 'Formation Ads Avancée', vendor: 'GrowthAcademy', price: '149€', rating: 4.7, category: 'Formations', image: 'bg-gradient-to-br from-amber-400 to-orange-500' },
  { id: 4, title: 'Template E-commerce Pro', vendor: 'WebCraft', price: '89€', rating: 4.6, category: 'E-commerce', image: 'bg-gradient-to-br from-emerald-400 to-teal-500' },
  { id: 5, title: 'Pack SEO Boost', vendor: 'RankHigh', price: '199€', rating: 4.5, category: 'Marketing', image: 'bg-gradient-to-br from-violet-500 to-purple-600' },
  { id: 6, title: 'Outil Facturation Automatique', vendor: 'FinSoft', price: '129€', rating: 4.8, category: 'Logiciels', image: 'bg-gradient-to-br from-cyan-400 to-blue-500' },
];

export default function MarketplacePage() {
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = MOCK_PRODUCTS.filter((product) => {
    const matchCategory = activeCategory === 'Tous' || product.category === activeCategory;
    const matchSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        product.vendor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="flex flex-col min-h-screen">
      {/* ─── HERO MARKETPLACE ─── */}
      <section className="relative pt-32 pb-16 overflow-hidden bg-mesh">
        <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-0" />
        <div className="page-container relative z-10 text-center">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-3xl mx-auto">
            <motion.h1 variants={fadeIn} className="text-4xl md:text-6xl font-display font-bold tracking-tight mb-6">
              Découvrez la <span className="gradient-text">Marketplace</span>
            </motion.h1>
            <motion.p variants={fadeIn} className="text-lg text-muted-foreground mb-10">
              Des milliers d'outils, ressources et services pour accélérer votre croissance.
            </motion.p>
            
            {/* SEARCH BAR */}
            <motion.div variants={fadeIn} className="relative group max-w-2xl mx-auto">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-amber-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative flex items-center bg-card border border-border rounded-xl p-2 shadow-glass">
                <Search className="text-muted-foreground ml-3 mr-2" size={24} />
                <input 
                  type="text" 
                  placeholder="Rechercher un produit, un vendeur, une catégorie..." 
                  className="flex-1 bg-transparent border-none focus:outline-none text-foreground py-3 px-2"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="btn-primary rounded-lg py-3 px-6 hidden sm:block">
                  Rechercher
                </button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── MAIN CONTENT ─── */}
      <section className="py-12 bg-background flex-1 relative z-10">
        <div className="page-container">
          <div className="flex flex-col md:flex-row gap-8">
            
            {/* SIDEBAR FILTERS (Desktop) */}
            <aside className="w-full md:w-64 shrink-0">
              <div className="sticky top-24 space-y-8">
                <div>
                  <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
                    <Filter size={18} /> Filtres
                  </h3>
                  <div className="space-y-2">
                    {MOCK_CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`w-full text-left px-4 py-2.5 rounded-lg transition-colors text-sm font-medium ${
                          activeCategory === cat 
                            ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' 
                            : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* PRODUCT GRID */}
            <div className="flex-1">
              <div className="mb-6 flex items-center justify-between">
                <p className="text-muted-foreground font-medium">
                  <span className="text-foreground">{filteredProducts.length}</span> résultats trouvés
                </p>
                {/* Mobile Filter Button */}
                <button className="md:hidden btn-secondary py-2 px-3">
                  <Filter size={18} />
                </button>
              </div>

              {filteredProducts.length > 0 ? (
                <motion.div 
                  initial="hidden"
                  animate="visible"
                  variants={staggerContainer}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {filteredProducts.map((product) => (
                    <Link key={product.id} to={`/product/${product.id}`} className="block h-full">
                      <motion.div variants={fadeIn} className="glass-card rounded-2xl overflow-hidden hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 flex flex-col cursor-pointer group h-full">
                      {/* Product Image Mock */}
                      <div className={`h-48 w-full ${product.image} relative overflow-hidden`}>
                         {/* Overlay on hover */}
                         <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <span className="bg-white/90 text-black px-4 py-2 rounded-full font-medium text-sm transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                              Aperçu rapide
                            </span>
                         </div>
                      </div>
                      
                      {/* Product Info */}
                      <div className="p-5 flex-1 flex flex-col">
                        <div className="flex items-start justify-between mb-2">
                          <span className="text-xs font-semibold text-primary-600 bg-primary-50 dark:bg-primary-900/30 px-2.5 py-1 rounded-full">
                            {product.category}
                          </span>
                          <div className="flex items-center gap-1 text-amber-500">
                            <Star size={14} className="fill-current" />
                            <span className="text-sm font-medium">{product.rating}</span>
                          </div>
                        </div>
                        
                        <h3 className="font-bold text-lg mb-1 group-hover:text-primary-600 transition-colors line-clamp-2">
                          {product.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Par {product.vendor}
                        </p>
                        
                        <div className="mt-auto flex items-center justify-between pt-4 border-t border-border">
                          <span className="font-display font-bold text-xl text-foreground">
                            {product.price}
                          </span>
                          <button className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-foreground hover:bg-primary-600 hover:text-white transition-colors">
                            <ShoppingCart size={18} />
                          </button>
                        </div>
                      </div>
                      </motion.div>
                    </Link>
                  ))}
                </motion.div>
              ) : (
                <div className="py-20 text-center">
                  <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4 text-muted-foreground">
                    <Search size={32} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Aucun résultat</h3>
                  <p className="text-muted-foreground">Nous n'avons trouvé aucun produit correspondant à votre recherche.</p>
                </div>
              )}

              {/* PAGINATION / LOAD MORE */}
              {filteredProducts.length > 0 && (
                <div className="mt-12 flex justify-center">
                  <button className="btn-ghost gap-2">
                    Charger plus de produits
                    <ArrowRight size={18} />
                  </button>
                </div>
              )}
            </div>
            
          </div>
        </div>
      </section>
    </div>
  );
}
