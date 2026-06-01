import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Download, 
  Search, 
  Filter, 
  MoreHorizontal, 
  ShoppingBag, 
  ArrowUpDown,
  Eye,
  CheckCircle2,
  Clock,
  XCircle,
  Truck
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

type PaymentStatus = 'paid' | 'pending' | 'refunded';
type FulfillmentStatus = 'unfulfilled' | 'fulfilled' | 'cancelled';

interface Order {
  id: string;
  ref: string;
  date: string;
  client: { name: string; email: string };
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  total: number;
  items: number;
}

const MOCK_ORDERS: Order[] = [
  {
    id: '1', ref: '#CMD-2847', date: 'Aujourd\'hui, 14:32',
    client: { name: 'Marie Dubois', email: 'marie.d@example.com' },
    paymentStatus: 'paid', fulfillmentStatus: 'unfulfilled',
    total: 124.50, items: 2
  },
  {
    id: '2', ref: '#CMD-2846', date: 'Aujourd\'hui, 11:15',
    client: { name: 'Pierre Martin', email: 'pmartin@corp.fr' },
    paymentStatus: 'pending', fulfillmentStatus: 'unfulfilled',
    total: 87.00, items: 1
  },
  {
    id: '3', ref: '#CMD-2845', date: 'Hier, 16:45',
    client: { name: 'Sophie Bernard', email: 'sophie@studio.com' },
    paymentStatus: 'paid', fulfillmentStatus: 'fulfilled',
    total: 342.80, items: 4
  },
  {
    id: '4', ref: '#CMD-2844', date: 'Hier, 09:20',
    client: { name: 'Lucas Petit', email: 'lucas.petit@mail.com' },
    paymentStatus: 'refunded', fulfillmentStatus: 'cancelled',
    total: 19.90, items: 1
  },
  {
    id: '5', ref: '#CMD-2843', date: '22 Mai 2026',
    client: { name: 'Emma Leroy', email: 'emma.l@agency.co' },
    paymentStatus: 'paid', fulfillmentStatus: 'fulfilled',
    total: 256.00, items: 3
  },
  {
    id: '6', ref: '#CMD-2842', date: '22 Mai 2026',
    client: { name: 'Thomas Roux', email: 'troux@domain.fr' },
    paymentStatus: 'paid', fulfillmentStatus: 'unfulfilled',
    total: 89.99, items: 1
  }
];

const PAYMENT_CONFIG = {
  paid: { label: 'Payée', icon: CheckCircle2, className: 'text-emerald-700 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400' },
  pending: { label: 'En attente', icon: Clock, className: 'text-amber-700 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400' },
  refunded: { label: 'Remboursée', icon: XCircle, className: 'text-neutral-700 bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-400' },
};

const FULFILLMENT_CONFIG = {
  fulfilled: { label: 'Expédiée', icon: Truck, className: 'text-emerald-700 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400' },
  unfulfilled: { label: 'Non traitée', icon: Clock, className: 'text-amber-700 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400' },
  cancelled: { label: 'Annulée', icon: XCircle, className: 'text-red-700 bg-red-100 dark:bg-red-900/30 dark:text-red-400' },
};

const TABS = [
  { id: 'all', label: 'Toutes' },
  { id: 'unfulfilled', label: 'Non traitées' },
  { id: 'unpaid', label: 'Non payées' },
  { id: 'fulfilled', label: 'Expédiées' },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  // Filtrage
  const filteredOrders = MOCK_ORDERS.filter(order => {
    // 1. Tab filter
    if (activeTab === 'unfulfilled' && order.fulfillmentStatus !== 'unfulfilled') return false;
    if (activeTab === 'unpaid' && order.paymentStatus !== 'pending') return false;
    if (activeTab === 'fulfilled' && order.fulfillmentStatus !== 'fulfilled') return false;

    // 2. Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return order.ref.toLowerCase().includes(term) || 
             order.client.name.toLowerCase().includes(term) ||
             order.client.email.toLowerCase().includes(term);
    }
    
    return true;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Commandes</h1>
          <p className="text-sm text-muted-foreground mt-1">Gérez vos ventes et suivez les expéditions.</p>
        </div>
        <button className="px-4 py-2 bg-background border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors flex items-center gap-2">
          <Download size={16} />
          Exporter CSV
        </button>
      </div>

      {/* ── METRICS (Mini-stats) ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border p-4 rounded-xl flex items-center gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-600 flex items-center justify-center">
            <ShoppingBag size={20} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Commandes aujourd'hui</p>
            <p className="text-xl font-bold text-foreground">12</p>
          </div>
        </div>
        <div className="bg-card border border-border p-4 rounded-xl flex items-center gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-600 flex items-center justify-center">
            <Clock size={20} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">À préparer</p>
            <p className="text-xl font-bold text-foreground">3</p>
          </div>
        </div>
        <div className="bg-card border border-border p-4 rounded-xl flex items-center gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Revenus du jour</p>
            <p className="text-xl font-bold text-foreground">1 450,50 €</p>
          </div>
        </div>
      </div>

      {/* ── TABS & TOOLBAR ─────────────────────────────────────────────── */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        
        {/* Tabs */}
        <div className="flex overflow-x-auto border-b border-border hide-scrollbar">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-6 py-3.5 text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id ? 'text-primary-600 dark:text-primary-400' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="activeTab" 
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 dark:bg-primary-400" 
                />
              )}
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div className="p-4 flex flex-col sm:flex-row gap-4 justify-between bg-muted/20">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Rechercher une commande, un client..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-background border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors">
            <Filter size={16} />
            Filtres avancés
          </button>
        </div>

        {/* ── DATA TABLE ─────────────────────────────────────────────────── */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-muted-foreground">
                <th className="px-6 py-4 font-semibold">Commande</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Client</th>
                <th className="px-6 py-4 font-semibold">Paiement</th>
                <th className="px-6 py-4 font-semibold">Préparation</th>
                <th className="px-6 py-4 font-semibold text-right">
                  <div className="flex items-center justify-end gap-1 cursor-pointer hover:text-foreground">
                    Total <ArrowUpDown size={14} />
                  </div>
                </th>
                <th className="px-6 py-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <motion.tbody variants={containerVariants} initial="hidden" animate="visible">
              {filteredOrders.map((order) => {
                const payConfig = PAYMENT_CONFIG[order.paymentStatus];
                const fullConfig = FULFILLMENT_CONFIG[order.fulfillmentStatus];
                
                return (
                  <motion.tr 
                    key={order.id} 
                    variants={itemVariants}
                    className="border-b border-border/50 hover:bg-muted/30 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <Link to={ROUTES.APP.ORDERS_DETAIL.replace(':id', order.id)} className="font-mono font-bold text-foreground hover:text-primary-600 transition-colors">
                        {order.ref}
                      </Link>
                      <p className="text-xs text-muted-foreground mt-0.5">{order.items} article{order.items > 1 ? 's' : ''}</p>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {order.date}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-foreground">{order.client.name}</p>
                      <p className="text-xs text-muted-foreground">{order.client.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${payConfig.className}`}>
                        <payConfig.icon size={12} />
                        {payConfig.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${fullConfig.className}`}>
                        <fullConfig.icon size={12} />
                        {fullConfig.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-foreground">
                      {order.total.toFixed(2)} €
                    </td>
                    <td className="px-6 py-4 text-center relative">
                      <button 
                        onClick={() => setActiveMenu(activeMenu === order.id ? null : order.id)}
                        className="p-2 text-muted-foreground hover:bg-background rounded-lg hover:text-foreground transition-colors"
                      >
                        <MoreHorizontal size={18} />
                      </button>

                      {/* Dropdown Menu */}
                      {activeMenu === order.id && (
                        <div className="absolute right-8 top-10 w-48 bg-card border border-border rounded-xl shadow-lg z-10 py-1 text-left">
                          <div className="fixed inset-0 z-[-1]" onClick={() => setActiveMenu(null)} />
                          <Link to={ROUTES.APP.ORDERS_DETAIL.replace(':id', order.id)} className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted">
                            <Eye size={16} /> Voir les détails
                          </Link>
                          {order.fulfillmentStatus === 'unfulfilled' && (
                            <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted text-left">
                              <Truck size={16} /> Marquer expédié
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </motion.tr>
                );
              })}
              
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                    Aucune commande trouvée.
                  </td>
                </tr>
              )}
            </motion.tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-6 py-4 border-t border-border flex items-center justify-between text-sm text-muted-foreground">
          <span>Affichage de 1 à {filteredOrders.length} commandes</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-border rounded-md hover:bg-muted disabled:opacity-50" disabled>Précédent</button>
            <button className="px-3 py-1 border border-border rounded-md hover:bg-muted disabled:opacity-50" disabled={filteredOrders.length < 10}>Suivant</button>
          </div>
        </div>
      </div>

    </div>
  );
}
