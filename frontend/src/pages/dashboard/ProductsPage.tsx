import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Package, 
  ArrowUpDown,
  Edit2,
  Trash2,
  Eye
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@routes/index';

// ─── Animation Variants ───────────────────────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
} as const;

// ─── Mock Data ────────────────────────────────────────────────────────────────

type ProductStatus = 'active' | 'draft' | 'out_of_stock';

interface Product {
  id: string;
  name: string;
  category: string;
  sku: string;
  price: number;
  stock: number;
  status: ProductStatus;
  imageUrl: string;
}

const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Montre Connectée Pro Max',
    category: 'Électronique',
    sku: 'WTCH-001',
    price: 299.99,
    stock: 45,
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: '2',
    name: 'Casque Audio Sans Fil',
    category: 'Audio',
    sku: 'AUD-042',
    price: 149.50,
    stock: 12,
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: '3',
    name: 'Abonnement Logiciel SaaS (Annuel)',
    category: 'Logiciel',
    sku: 'SAAS-Y-01',
    price: 990.00,
    stock: 999,
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1661956602116-aa6865609028?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: '4',
    name: 'Clavier Mécanique RGB',
    category: 'Accessoires',
    sku: 'KEY-089',
    price: 89.99,
    stock: 0,
    status: 'out_of_stock',
    imageUrl: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: '5',
    name: 'Webcam 4K Streaming',
    category: 'Électronique',
    sku: 'CAM-4K-02',
    price: 129.00,
    stock: 5,
    status: 'draft',
    imageUrl: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?auto=format&fit=crop&q=80&w=200'
  }
];

const STATUS_CONFIG = {
  active: { label: 'Actif', className: 'text-emerald-700 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' },
  draft: { label: 'Brouillon', className: 'text-neutral-700 bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700' },
  out_of_stock: { label: 'Rupture', className: 'text-red-700 bg-red-100 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800' },
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  // Filtre de base pour l'exemple
  const filteredProducts = MOCK_PRODUCTS.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Produits</h1>
          <p className="text-sm text-muted-foreground mt-1">Gérez votre catalogue, vos prix et vos stocks.</p>
        </div>
        <Link 
          to={ROUTES.APP.PRODUCTS_NEW} 
          className="btn-primary py-2.5 px-4 text-sm font-semibold shadow-glow flex items-center gap-2"
        >
          <Plus size={18} />
          Nouveau produit
        </Link>
      </div>

      {/* ── METRICS (Mini-stats) ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border p-4 rounded-xl flex items-center gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-600 flex items-center justify-center">
            <Package size={20} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total produits</p>
            <p className="text-xl font-bold text-foreground">124</p>
          </div>
        </div>
        <div className="bg-card border border-border p-4 rounded-xl flex items-center gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center">
            <Eye size={20} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Actifs sur la boutique</p>
            <p className="text-xl font-bold text-foreground">118</p>
          </div>
        </div>
        <div className="bg-card border border-border p-4 rounded-xl flex items-center gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 flex items-center justify-center">
            <Package size={20} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">En rupture de stock</p>
            <p className="text-xl font-bold text-foreground">6</p>
          </div>
        </div>
      </div>

      {/* ── TOOLBAR (Search & Filters) ─────────────────────────────────── */}
      <div className="bg-card border border-border rounded-xl shadow-sm p-4 flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Rechercher par nom ou SKU..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
          />
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-background border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors">
          <Filter size={16} />
          Filtres
        </button>
      </div>

      {/* ── DATA TABLE ─────────────────────────────────────────────────── */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-muted-foreground">
                <th className="px-6 py-4 font-semibold">Produit</th>
                <th className="px-6 py-4 font-semibold hidden sm:table-cell">Catégorie</th>
                <th className="px-6 py-4 font-semibold">Statut</th>
                <th className="px-6 py-4 font-semibold">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-foreground">
                    Stock <ArrowUpDown size={14} />
                  </div>
                </th>
                <th className="px-6 py-4 font-semibold text-right">Prix</th>
                <th className="px-6 py-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <motion.tbody variants={containerVariants} initial="hidden" animate="visible">
              {filteredProducts.map((product) => {
                const config = STATUS_CONFIG[product.status];
                return (
                  <motion.tr 
                    key={product.id} 
                    variants={itemVariants}
                    className="border-b border-border/50 hover:bg-muted/30 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg border border-border overflow-hidden bg-background shrink-0">
                          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-bold text-foreground">{product.name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">SKU: {product.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell text-muted-foreground">
                      {product.category}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${config.className}`}>
                        {config.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-medium ${product.stock === 0 ? 'text-red-500' : 'text-foreground'}`}>
                        {product.stock > 0 ? `${product.stock} en stock` : 'Épuisé'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-foreground">
                      {product.price.toFixed(2)} €
                    </td>
                    <td className="px-6 py-4 text-center relative">
                      <button 
                        onClick={() => setActiveMenu(activeMenu === product.id ? null : product.id)}
                        className="p-2 text-muted-foreground hover:bg-background rounded-lg hover:text-foreground transition-colors"
                      >
                        <MoreHorizontal size={18} />
                      </button>

                      {/* Dropdown Menu (Simplifié pour l'exemple) */}
                      {activeMenu === product.id && (
                        <div className="absolute right-8 top-10 w-48 bg-card border border-border rounded-xl shadow-lg z-10 py-1 text-left">
                          <div className="fixed inset-0 z-[-1]" onClick={() => setActiveMenu(null)} />
                          <Link to={ROUTES.APP.PRODUCTS_EDIT.replace(':id', product.id)} className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted">
                            <Edit2 size={16} /> Modifier
                          </Link>
                          <Link to={ROUTES.APP.PRODUCTS_DETAIL.replace(':id', product.id)} className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted">
                            <Eye size={16} /> Aperçu
                          </Link>
                          <div className="h-px bg-border my-1" />
                          <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 text-left">
                            <Trash2 size={16} /> Supprimer
                          </button>
                        </div>
                      )}
                    </td>
                  </motion.tr>
                );
              })}
              
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    Aucun produit trouvé pour "{searchTerm}".
                  </td>
                </tr>
              )}
            </motion.tbody>
          </table>
        </div>
        
        {/* Pagination (statique pour l'instant) */}
        <div className="px-6 py-4 border-t border-border flex items-center justify-between text-sm text-muted-foreground">
          <span>Affichage de 1 à {filteredProducts.length} sur 124 produits</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-border rounded-md hover:bg-muted disabled:opacity-50" disabled>Précédent</button>
            <button className="px-3 py-1 border border-border rounded-md hover:bg-muted">Suivant</button>
          </div>
        </div>
      </div>

    </div>
  );
}
