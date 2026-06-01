import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Download, 
  Search, 
  Filter, 
  MoreHorizontal, 
  CreditCard,
  Building2,
  AlertTriangle,
  Mail,
  Receipt
} from 'lucide-react';

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

type SubStatus = 'active' | 'past_due' | 'canceled';
type SubInterval = 'monthly' | 'yearly';

interface Subscription {
  id: string;
  tenantName: string;
  plan: string;
  amount: number;
  interval: SubInterval;
  status: SubStatus;
  nextBilling: string;
}

const MOCK_SUBSCRIPTIONS: Subscription[] = [
  {
    id: 'sub_1', tenantName: 'Acme Corp', plan: 'Enterprise', 
    amount: 999, interval: 'monthly', status: 'active', nextBilling: '12 Juin 2026'
  },
  {
    id: 'sub_2', tenantName: 'Studio Design 360', plan: 'Pro', 
    amount: 1188, interval: 'yearly', status: 'active', nextBilling: '05 Mar 2027'
  },
  {
    id: 'sub_3', tenantName: 'Tech Innovators', plan: 'Enterprise', 
    amount: 999, interval: 'monthly', status: 'past_due', nextBilling: '01 Mai 2026'
  },
  {
    id: 'sub_4', tenantName: 'Global Logistics', plan: 'Pro', 
    amount: 99, interval: 'monthly', status: 'active', nextBilling: '22 Juin 2026'
  },
  {
    id: 'sub_5', tenantName: 'Local Store', plan: 'Starter', 
    amount: 29, interval: 'monthly', status: 'canceled', nextBilling: 'Annulé le 15 Mai'
  }
];

const STATUS_CONFIG = {
  active: { label: 'Actif', className: 'text-emerald-400 bg-emerald-500/10' },
  past_due: { label: 'Impayé', className: 'text-red-400 bg-red-500/10 animate-pulse' },
  canceled: { label: 'Annulé', className: 'text-neutral-500 bg-neutral-800' },
};

const INTERVAL_LABELS = {
  monthly: '/mois',
  yearly: '/an',
};

const TABS = [
  { id: 'all', label: 'Tous' },
  { id: 'active', label: 'Actifs' },
  { id: 'past_due', label: 'Impayés' },
  { id: 'canceled', label: 'Annulés' },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminSubscriptionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  // Filtrage
  const filteredSubs = MOCK_SUBSCRIPTIONS.filter(sub => {
    // 1. Tab filter
    if (activeTab !== 'all' && sub.status !== activeTab) return false;

    // 2. Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return sub.tenantName.toLowerCase().includes(term) || 
             sub.plan.toLowerCase().includes(term);
    }
    
    return true;
  });

  return (
    <div className="p-6 space-y-6">
      
      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Abonnements & Revenus</h1>
          <p className="text-sm text-neutral-400 mt-1">Gérez la facturation et les statuts de paiement des organisations.</p>
        </div>
        <button className="px-4 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-sm font-medium text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors flex items-center gap-2">
          <Download size={16} />
          Exporter CSV
        </button>
      </div>

      {/* ── METRICS (Mini-stats) ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl flex items-center gap-4 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full blur-xl pointer-events-none" />
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <CreditCard size={20} />
          </div>
          <div>
            <p className="text-sm text-neutral-400">ARR (Revenu Annuel)</p>
            <p className="text-xl font-bold text-white">1 494 000 €</p>
          </div>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl flex items-center gap-4 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-full blur-xl pointer-events-none" />
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
            <Building2 size={20} />
          </div>
          <div>
            <p className="text-sm text-neutral-400">Abonnements Actifs</p>
            <p className="text-xl font-bold text-white">1 284</p>
          </div>
        </div>
        <div className="bg-neutral-900 border border-red-900/30 p-4 rounded-xl flex items-center gap-4 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-bl-full blur-xl pointer-events-none" />
          <div className="w-10 h-10 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center">
            <AlertTriangle size={20} />
          </div>
          <div>
            <p className="text-sm text-neutral-400">Impayés (Past Due)</p>
            <p className="text-xl font-bold text-red-400">2 997 €</p>
          </div>
        </div>
      </div>

      {/* ── TABS & TOOLBAR ─────────────────────────────────────────────── */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl shadow-sm overflow-hidden">
        
        {/* Tabs */}
        <div className="flex overflow-x-auto border-b border-neutral-800 hide-scrollbar">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-6 py-3.5 text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id ? 'text-red-500' : 'text-neutral-500 hover:text-white'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="adminTab" 
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500" 
                />
              )}
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div className="p-4 flex flex-col sm:flex-row gap-4 justify-between bg-neutral-950/50">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input 
              type="text" 
              placeholder="Rechercher une organisation..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-neutral-700 bg-neutral-900 text-sm text-white focus:outline-none focus:ring-1 focus:ring-red-500 transition-all placeholder:text-neutral-600"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-sm font-medium text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors">
            <Filter size={16} />
            Filtres avancés
          </button>
        </div>

        {/* ── DATA TABLE ─────────────────────────────────────────────────── */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-neutral-800 bg-neutral-950/30 text-neutral-400">
                <th className="px-6 py-4 font-semibold">Organisation</th>
                <th className="px-6 py-4 font-semibold">Forfait</th>
                <th className="px-6 py-4 font-semibold">Montant</th>
                <th className="px-6 py-4 font-semibold">Statut</th>
                <th className="px-6 py-4 font-semibold">Prochaine facturation</th>
                <th className="px-6 py-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <motion.tbody variants={containerVariants} initial="hidden" animate="visible">
              {filteredSubs.map((sub) => {
                const statusConfig = STATUS_CONFIG[sub.status];
                
                return (
                  <motion.tr 
                    key={sub.id} 
                    variants={itemVariants}
                    className="border-b border-neutral-800/50 hover:bg-neutral-800/30 transition-colors group"
                  >
                    <td className="px-6 py-4 font-bold text-white">
                      {sub.tenantName}
                    </td>
                    <td className="px-6 py-4 font-medium text-neutral-300">
                      {sub.plan}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-white">{sub.amount} €</span>
                      <span className="text-xs text-neutral-500">{INTERVAL_LABELS[sub.interval]}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${statusConfig.className.split(' ')[0].replace('text', 'bg')}`} />
                        <span className={`text-xs font-semibold ${statusConfig.className.split(' ')[0]}`}>
                          {statusConfig.label}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-neutral-400">
                      {sub.nextBilling}
                    </td>
                    <td className="px-6 py-4 text-center relative">
                      <button 
                        onClick={() => setActiveMenu(activeMenu === sub.id ? null : sub.id)}
                        className="p-2 text-neutral-500 hover:bg-neutral-800 rounded-lg hover:text-white transition-colors"
                      >
                        <MoreHorizontal size={18} />
                      </button>

                      {/* Dropdown Menu Admin */}
                      {activeMenu === sub.id && (
                        <div className="absolute right-8 top-10 w-48 bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl z-10 py-1 text-left">
                          <div className="fixed inset-0 z-[-1]" onClick={() => setActiveMenu(null)} />
                          <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors">
                            <Receipt size={16} /> Historique factures
                          </button>
                          {sub.status === 'past_due' && (
                            <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors">
                              <Mail size={16} /> Relance paiement
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </motion.tr>
                );
              })}
              
              {filteredSubs.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-neutral-500">
                    Aucun abonnement trouvé.
                  </td>
                </tr>
              )}
            </motion.tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-6 py-4 border-t border-neutral-800 flex items-center justify-between text-sm text-neutral-500 bg-neutral-950/30">
          <span>Affichage de 1 à {filteredSubs.length} abonnements</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-neutral-700 rounded-md hover:bg-neutral-800 hover:text-white transition-colors disabled:opacity-50" disabled>Précédent</button>
            <button className="px-3 py-1 border border-neutral-700 rounded-md hover:bg-neutral-800 hover:text-white transition-colors disabled:opacity-50" disabled={filteredSubs.length < 10}>Suivant</button>
          </div>
        </div>
      </div>

    </div>
  );
}
