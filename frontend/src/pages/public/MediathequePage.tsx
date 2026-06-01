import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, FileText, Image as ImageIcon, Headphones, Search, Download, Clock, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

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

// ─── MOCK DATA ─────────────────────────────────────────────────────────────
const MEDIA_TYPES = [
  { id: 'all', label: 'Toutes les ressources', icon: null },
  { id: 'video', label: 'Vidéos & Formations', icon: <Play size={18} /> },
  { id: 'document', label: 'Documents & E-books', icon: <FileText size={18} /> },
  { id: 'audio', label: 'Podcasts & Audios', icon: <Headphones size={18} /> },
  { id: 'image', label: 'Ressources Graphiques', icon: <ImageIcon size={18} /> },
];

const MOCK_MEDIA = [
  { id: 1, title: 'Masterclass: Vente B2B', type: 'video', duration: '1h 45m', views: '1.2k', image: 'bg-gradient-to-br from-indigo-500 to-purple-600', isTrending: true },
  { id: 2, title: 'Guide Ultime du SEO 2026', type: 'document', size: '12 MB', downloads: '850', image: 'bg-gradient-to-br from-emerald-500 to-teal-600', isTrending: true },
  { id: 3, title: 'Interview: Croissance Rapide', type: 'audio', duration: '45m', views: '3.4k', image: 'bg-gradient-to-br from-amber-500 to-orange-600', isTrending: false },
  { id: 4, title: 'Pack Mockups Premium', type: 'image', size: '240 MB', downloads: '4k', image: 'bg-gradient-to-br from-pink-500 to-rose-600', isTrending: true },
  { id: 5, title: 'Template Contrat Prestataire', type: 'document', size: '2 MB', downloads: '1.2k', image: 'bg-gradient-to-br from-slate-600 to-slate-800', isTrending: false },
  { id: 6, title: 'Tutoriel: Configurer sa boutique', type: 'video', duration: '22m', views: '900', image: 'bg-gradient-to-br from-cyan-500 to-blue-600', isTrending: false },
];

export default function MediathequePage() {
  const [activeType, setActiveType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const trendingMedia = MOCK_MEDIA.filter(m => m.isTrending);
  
  const filteredMedia = MOCK_MEDIA.filter((media) => {
    const matchType = activeType === 'all' || media.type === activeType;
    const matchSearch = media.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchType && matchSearch;
  });

  const getIconForType = (type: string) => {
    switch(type) {
      case 'video': return <Play size={16} className="fill-current" />;
      case 'document': return <FileText size={16} />;
      case 'audio': return <Headphones size={16} />;
      case 'image': return <ImageIcon size={16} />;
      default: return null;
    }
  };

  const getColorForType = (type: string) => {
    switch(type) {
      case 'video': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
      case 'document': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'audio': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'image': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      default: return 'text-primary-500 bg-primary-500/10 border-primary-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-background pt-[72px] flex flex-col md:flex-row">
      
      {/* ─── SIDEBAR NAVIGATION ─── */}
      <aside className="w-full md:w-64 lg:w-72 shrink-0 border-b md:border-b-0 md:border-r border-border bg-card/50 backdrop-blur-md z-30">
        <div className="sticky top-[72px] p-6 space-y-8 max-h-[calc(100vh-72px)] overflow-y-auto no-scrollbar">
          
          <div>
            <h2 className="font-display font-bold text-2xl mb-6 gradient-text">Médiathèque</h2>
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input 
                type="text"
                placeholder="Rechercher..."
                className="w-full bg-muted border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <nav className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 px-3">Catégories</p>
              {MEDIA_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setActiveType(type.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-medium text-sm ${
                    activeType === type.id
                      ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {type.icon}
                  {type.label}
                </button>
              ))}
            </nav>
          </div>
          
          <div className="p-4 rounded-2xl bg-gradient-to-br from-primary-900 to-primary-950 border border-primary-800">
            <h3 className="font-bold text-white mb-2">Accès Premium</h3>
            <p className="text-primary-200 text-xs mb-4">Débloquez l'accès illimité à toutes nos masterclasses et ressources.</p>
            <button className="w-full py-2 bg-white text-primary-950 rounded-lg text-xs font-bold hover:bg-primary-50 transition-colors">
              Devenir Premium
            </button>
          </div>
        </div>
      </aside>

      {/* ─── MAIN CONTENT ─── */}
      <main className="flex-1 overflow-hidden">
        <div className="page-container py-8 md:py-12">
          
          {/* TRENDING SLIDER */}
          {activeType === 'all' && searchQuery === '' && (
            <section className="mb-16">
              <h3 className="font-display font-bold text-2xl mb-6">En Tendances 🔥</h3>
              <div className="flex gap-6 overflow-x-auto no-scrollbar pb-6 snap-x">
                {trendingMedia.map((media) => (
                  <motion.div 
                    key={media.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="shrink-0 w-[300px] md:w-[400px] aspect-video rounded-3xl overflow-hidden relative group cursor-pointer snap-start"
                  >
                    <div className={`absolute inset-0 ${media.image} opacity-90`} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    {/* Hover Play button for video/audio */}
                    {(media.type === 'video' || media.type === 'audio') && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
                        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white">
                          <Play size={24} className="fill-current ml-1" />
                        </div>
                      </div>
                    )}

                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full border backdrop-blur-md ${getColorForType(media.type)}`}>
                          {getIconForType(media.type)}
                        </span>
                        <span className="text-white/80 text-xs font-medium">
                          {media.duration || media.size}
                        </span>
                      </div>
                      <h4 className="text-xl font-bold text-white group-hover:text-primary-300 transition-colors">{media.title}</h4>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* MEDIA GRID */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display font-bold text-2xl">
                {activeType === 'all' ? 'Toutes les ressources' : MEDIA_TYPES.find(t => t.id === activeType)?.label}
              </h3>
              <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">{filteredMedia.length} éléments</span>
            </div>

            {filteredMedia.length > 0 ? (
              <motion.div 
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                key={activeType + searchQuery} // Force re-render
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {filteredMedia.map((media) => (
                  <motion.div 
                    key={media.id} 
                    variants={fadeIn}
                    className="card p-4 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col"
                  >
                    <div className={`w-full aspect-[4/3] rounded-xl mb-4 relative overflow-hidden ${media.image}`}>
                      <div className="absolute top-3 right-3">
                        <button className="w-8 h-8 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-red-500 transition-colors border border-white/10">
                          <Heart size={14} />
                        </button>
                      </div>
                      
                      {/* Central Icon on Hover */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-primary-600 flex items-center justify-center text-white transform scale-50 group-hover:scale-100 transition-transform duration-300">
                          {media.type === 'video' || media.type === 'audio' ? <Play className="fill-current ml-1" /> : <Download />}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-1 flex flex-col">
                      <div className="flex items-center gap-2 mb-2">
                         <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getColorForType(media.type)}`}>
                            {media.type}
                         </span>
                      </div>
                      <h4 className="font-bold text-foreground mb-3 leading-snug group-hover:text-primary-600 transition-colors line-clamp-2">
                        {media.title}
                      </h4>
                      
                      <div className="mt-auto flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border">
                        <span className="flex items-center gap-1">
                          <Clock size={12} /> {media.duration || media.size}
                        </span>
                        <span className="flex items-center gap-1">
                          {media.views ? `${media.views} vues` : `${media.downloads} dl`}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-24 bg-card rounded-3xl border border-border border-dashed">
                <Search size={48} className="text-muted-foreground/30 mx-auto mb-4" />
                <h4 className="text-xl font-bold mb-2">Aucune ressource trouvée</h4>
                <p className="text-muted-foreground">Modifiez vos filtres ou votre recherche.</p>
              </div>
            )}
          </section>

        </div>
      </main>

    </div>
  );
}
