import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  Building2, 
  Activity, 
  ArrowUpRight, 
  ArrowDownRight,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';

// ─── Animation Variants ───────────────────────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
} as const;

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' as const },
  },
} as const;

// ─── Mock Data ────────────────────────────────────────────────────────────────

const KPIS = [
  {
    id: 'mrr',
    label: 'MRR (Revenu Mensuel)',
    value: '124 500 €',
    change: +14.2,
    icon: TrendingUp,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
  },
  {
    id: 'tenants',
    label: 'Organisations Actives',
    value: '1 284',
    change: +5.4,
    icon: Building2,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    id: 'users',
    label: 'Utilisateurs Totaux',
    value: '45 231',
    change: +12.1,
    icon: Users,
    color: 'text-violet-500',
    bgColor: 'bg-violet-500/10',
  },
  {
    id: 'churn',
    label: 'Taux de Churn',
    value: '2.1%',
    change: -0.4, // Baisse = positif pour le churn
    icon: Activity,
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
    inverseTrend: true, // Si vrai, une baisse affiche un style positif
  },
];

const RECENT_TENANTS = [
  { id: 't1', name: 'Acme Corp', plan: 'Enterprise', users: 145, date: 'Il y a 2 heures', status: 'active' },
  { id: 't2', name: 'Studio Design 360', plan: 'Pro', users: 12, date: 'Il y a 4 heures', status: 'active' },
  { id: 't3', name: 'StartUp Factory', plan: 'Starter', users: 3, date: 'Hier', status: 'trial' },
  { id: 't4', name: 'Global Logistics', plan: 'Enterprise', users: 890, date: 'Hier', status: 'active' },
  { id: 't5', name: 'Boulangerie Paul', plan: 'Starter', users: 1, date: 'Il y a 2 jours', status: 'suspended' },
];

const PLAN_COLORS: Record<string, string> = {
  'Enterprise': 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  'Pro': 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  'Starter': 'text-neutral-400 bg-neutral-800 border-neutral-700',
};

const STATUS_COLORS: Record<string, string> = {
  'active': 'text-emerald-500',
  'trial': 'text-amber-500',
  'suspended': 'text-red-500',
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminDashboardPage() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-6 space-y-6"
    >
      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <motion.div variants={cardVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Vue d'ensemble</h1>
          <p className="text-sm text-neutral-400 mt-1">
            Performances globales de la plateforme — Mai 2026
          </p>
        </div>
      </motion.div>

      {/* ── KPIs (Stat Cards) ───────────────────────────────────────────── */}
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
      >
        {KPIS.map((stat) => {
          const Icon = stat.icon;
          
          // Logique d'affichage tendance
          const isPositiveChange = stat.change >= 0;
          const isGoodPerformance = stat.inverseTrend ? !isPositiveChange : isPositiveChange;
          const TrendIcon = isPositiveChange ? ArrowUpRight : ArrowDownRight;

          return (
            <motion.div
              key={stat.id}
              variants={cardVariants}
              className="bg-neutral-900 border border-neutral-800 rounded-xl p-5"
            >
              <div className="flex items-start justify-between">
                <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <span
                  className={`inline-flex items-center gap-0.5 text-xs font-bold px-2 py-1 rounded-full ${
                    isGoodPerformance
                      ? 'text-emerald-400 bg-emerald-500/10'
                      : 'text-red-400 bg-red-500/10'
                  }`}
                >
                  <TrendIcon className="w-3 h-3" />
                  {Math.abs(stat.change)}%
                </span>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-display font-bold text-white">{stat.value}</p>
                <p className="text-sm text-neutral-400 mt-0.5">{stat.label}</p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* ── GRAPHIQUE & RÉCENTES INSCRIPTIONS ───────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Graphique MRR (Placeholder stylisé) */}
        <motion.div
          variants={cardVariants}
          className="xl:col-span-2 bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden flex flex-col"
        >
          <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
            <div>
              <h2 className="font-display font-semibold text-white">Évolution MRR</h2>
              <p className="text-xs text-neutral-400 mt-0.5">12 derniers mois</p>
            </div>
          </div>
          <div className="p-5 flex-1 flex items-end gap-2 h-64 relative">
            {/* Lignes de repère */}
            <div className="absolute inset-0 flex flex-col justify-between py-5 px-5 pointer-events-none">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="border-b border-neutral-800/50 w-full h-0" />
              ))}
            </div>
            
            {/* Barres du graphique */}
            {[40, 45, 42, 50, 55, 53, 60, 65, 75, 80, 85, 95].map((h, i) => (
              <div
                key={i}
                className="flex-1 bg-gradient-to-t from-red-600/20 to-red-500/60 rounded-t-sm relative group cursor-pointer hover:to-red-400 transition-all"
                style={{ height: `${h}%` }}
              >
                {/* Tooltip on hover */}
                <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-neutral-800 text-white text-xs py-1 px-2 rounded pointer-events-none whitespace-nowrap z-10 transition-opacity">
                  {h * 1200} €
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Dernières Organisations */}
        <motion.div
          variants={cardVariants}
          className="bg-neutral-900 border border-neutral-800 rounded-xl flex flex-col"
        >
          <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
            <div>
              <h2 className="font-display font-semibold text-white">Inscriptions récentes</h2>
            </div>
            <Link to="/admin/tenants" className="text-xs text-red-500 hover:text-red-400 font-medium">
              Tout voir
            </Link>
          </div>
          <div className="p-2 flex-1 overflow-y-auto">
            {RECENT_TENANTS.map((tenant) => (
              <div key={tenant.id} className="p-3 hover:bg-neutral-800/50 rounded-lg transition-colors flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-neutral-800 border border-neutral-700 flex items-center justify-center shrink-0">
                    <Building2 size={14} className="text-neutral-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-white">{tenant.name}</p>
                      <div className={`w-1.5 h-1.5 rounded-full ${STATUS_COLORS[tenant.status]}`} title={`Status: ${tenant.status}`} />
                    </div>
                    <p className="text-xs text-neutral-500">{tenant.users} utilisateur{tenant.users > 1 ? 's' : ''} • {tenant.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${PLAN_COLORS[tenant.plan]}`}>
                    {tenant.plan}
                  </span>
                  <button className="text-neutral-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <ExternalLink size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}
