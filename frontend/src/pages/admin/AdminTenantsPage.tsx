import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Building2, 
  Plus, 
  Ban,
  Activity,
  ExternalLink,
  ShieldCheck
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

type TenantStatus = 'active' | 'suspended' | 'trial';
type TenantPlan = 'Enterprise' | 'Pro' | 'Starter';

interface Tenant {
  id: string;
  name: string;
  domain: string;
  plan: TenantPlan;
  usersCount: number;
  status: TenantStatus;
  createdAt: string;
}

const MOCK_TENANTS: Tenant[] = [
  {
    id: 't_1', name: 'Acme Corp', domain: 'acme.karochebama.com',
    plan: 'Enterprise', usersCount: 145, status: 'active', createdAt: '12 Jan 2024'
  },
  {
    id: 't_2', name: 'Studio Design 360', domain: 'studio360.karochebama.com',
    plan: 'Pro', usersCount: 12, status: 'active', createdAt: '05 Mar 2025'
  },
  {
    id: 't_3', name: 'StartUp Factory', domain: 'startup.karochebama.com',
    plan: 'Starter', usersCount: 3, status: 'trial', createdAt: 'Hier'
  },
  {
    id: 't_4', name: 'Global Logistics', domain: 'logistics.karochebama.com',
    plan: 'Enterprise', usersCount: 890, status: 'active', createdAt: '22 Nov 2023'
  },
  {
    id: 't_5', name: 'Fake Store LLC', domain: 'fakestore.karochebama.com',
    plan: 'Starter', usersCount: 1, status: 'suspended', createdAt: '01 Mai 2026'
  }
];

const PLAN_COLORS: Record<TenantPlan, string> = {
  'Enterprise': 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  'Pro': 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  'Starter': 'text-neutral-400 bg-neutral-800 border-neutral-700',
};

const STATUS_CONFIG = {
  active: { label: 'Actif', className: 'text-emerald-400 bg-emerald-500/10' },
  trial: { label: 'En essai', className: 'text-amber-400 bg-amber-500/10' },
  suspended: { label: 'Suspendu', className: 'text-red-400 bg-red-500/10' },
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminTenantsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  // Filtrage simple
  const filteredTenants = MOCK_TENANTS.filter(tenant => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return tenant.name.toLowerCase().includes(term) || 
             tenant.domain.toLowerCase().includes(term);
    }
    return true;
  });

  return (
    <div className="p-6 space-y-6">
      
      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Organisations</h1>
          <p className="text-sm text-neutral-400 mt-1">Gérez les entreprises clientes ("Tenants") de votre plateforme.</p>
        </div>
        <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center gap-2 shadow-sm">
          <Plus size={16} />
          Nouvelle Organisation
        </button>
      </div>

      {/* ── TOOLBAR ──────────────────────────────────────────────────────── */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl shadow-sm p-4 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input 
            type="text" 
            placeholder="Rechercher par nom ou domaine..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-neutral-700 bg-neutral-950 text-sm text-white focus:outline-none focus:ring-1 focus:ring-red-500 transition-all placeholder:text-neutral-600"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-neutral-950 border border-neutral-700 rounded-lg text-sm font-medium text-neutral-300 hover:text-white transition-colors">
            <Filter size={16} />
            Filtres
          </button>
        </div>
      </div>

      {/* ── DATA TABLE ─────────────────────────────────────────────────── */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-neutral-800 bg-neutral-950/50 text-neutral-400">
                <th className="px-6 py-4 font-semibold">Organisation</th>
                <th className="px-6 py-4 font-semibold">Forfait</th>
                <th className="px-6 py-4 font-semibold">Utilisateurs</th>
                <th className="px-6 py-4 font-semibold">Statut</th>
                <th className="px-6 py-4 font-semibold">Date d'inscription</th>
                <th className="px-6 py-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <motion.tbody variants={containerVariants} initial="hidden" animate="visible">
              {filteredTenants.map((tenant) => {
                const planColor = PLAN_COLORS[tenant.plan];
                const statusConfig = STATUS_CONFIG[tenant.status];
                
                return (
                  <motion.tr 
                    key={tenant.id} 
                    variants={itemVariants}
                    className="border-b border-neutral-800/50 hover:bg-neutral-800/30 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-neutral-800 border border-neutral-700 flex items-center justify-center shrink-0">
                          <Building2 size={18} className="text-neutral-400" />
                        </div>
                        <div>
                          <p className="font-bold text-white flex items-center gap-2">
                            {tenant.name}
                            {tenant.plan === 'Enterprise' && <ShieldCheck size={14} className="text-purple-400" />}
                          </p>
                          <p className="text-xs text-neutral-500 mt-0.5">{tenant.domain}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${planColor}`}>
                        {tenant.plan}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-neutral-300">
                      {tenant.usersCount} <span className="text-neutral-500 font-normal">sièges</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${statusConfig.className.split(' ')[0].replace('text', 'bg')}`} />
                        <span className={`text-xs font-semibold ${statusConfig.className.split(' ')[0]}`}>
                          {statusConfig.label}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-neutral-500 text-xs">
                      {tenant.createdAt}
                    </td>
                    <td className="px-6 py-4 text-center relative">
                      <button 
                        onClick={() => setActiveMenu(activeMenu === tenant.id ? null : tenant.id)}
                        className="p-2 text-neutral-500 hover:bg-neutral-800 rounded-lg hover:text-white transition-colors"
                      >
                        <MoreHorizontal size={18} />
                      </button>

                      {/* Dropdown Menu Admin */}
                      {activeMenu === tenant.id && (
                        <div className="absolute right-8 top-10 w-48 bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl z-10 py-1 text-left">
                          <div className="fixed inset-0 z-[-1]" onClick={() => setActiveMenu(null)} />
                          <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors">
                            <Activity size={16} /> Voir l'activité
                          </button>
                          <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors">
                            <ExternalLink size={16} /> Ouvrir le domaine
                          </button>
                          <div className="my-1 border-t border-neutral-800" />
                          <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors">
                            <Ban size={16} /> Suspendre
                          </button>
                        </div>
                      )}
                    </td>
                  </motion.tr>
                );
              })}
              
              {filteredTenants.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-neutral-500">
                    Aucune organisation trouvée.
                  </td>
                </tr>
              )}
            </motion.tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-6 py-4 border-t border-neutral-800 flex items-center justify-between text-sm text-neutral-500 bg-neutral-950/30">
          <span>Affichage de 1 à {filteredTenants.length} sur {MOCK_TENANTS.length}</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-neutral-700 rounded-md hover:bg-neutral-800 hover:text-white transition-colors disabled:opacity-50" disabled>Précédent</button>
            <button className="px-3 py-1 border border-neutral-700 rounded-md hover:bg-neutral-800 hover:text-white transition-colors disabled:opacity-50" disabled={filteredTenants.length < 10}>Suivant</button>
          </div>
        </div>
      </div>

    </div>
  );
}
