import { motion } from 'framer-motion';
import {
  TrendingUp,
  ShoppingBag,
  Users,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

// ─── Animation Variants ───────────────────────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.05 },
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

// ─── Types ────────────────────────────────────────────────────────────────────

interface StatCard {
  id: string;
  label: string;
  value: string;
  change: number;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}

interface RecentOrder {
  id: string;
  ref: string;
  client: string;
  amount: string;
  status: 'completed' | 'pending' | 'cancelled';
  date: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const STATS: StatCard[] = [
  {
    id: 'revenue',
    label: 'Chiffre d\'affaires',
    value: '48 320 €',
    change: +12.4,
    icon: TrendingUp,
    color: 'text-primary-600 dark:text-primary-400',
    bgColor: 'bg-primary-100 dark:bg-primary-900/30',
  },
  {
    id: 'orders',
    label: 'Commandes',
    value: '1 284',
    change: +8.7,
    icon: ShoppingBag,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
  },
  {
    id: 'clients',
    label: 'Clients actifs',
    value: '342',
    change: +3.2,
    icon: Users,
    color: 'text-violet-600 dark:text-violet-400',
    bgColor: 'bg-violet-100 dark:bg-violet-900/30',
  },
  {
    id: 'aov',
    label: 'Panier moyen',
    value: '37,60 €',
    change: -1.8,
    icon: CreditCard,
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-100 dark:bg-amber-900/30',
  },
];

const RECENT_ORDERS: RecentOrder[] = [
  { id: '1', ref: '#CMD-2847', client: 'Marie Dubois', amount: '124,50 €', status: 'completed', date: 'Il y a 12 min' },
  { id: '2', ref: '#CMD-2846', client: 'Pierre Martin', amount: '87,00 €', status: 'pending', date: 'Il y a 28 min' },
  { id: '3', ref: '#CMD-2845', client: 'Sophie Bernard', amount: '342,80 €', status: 'completed', date: 'Il y a 1h' },
  { id: '4', ref: '#CMD-2844', client: 'Lucas Petit', amount: '19,90 €', status: 'cancelled', date: 'Il y a 2h' },
  { id: '5', ref: '#CMD-2843', client: 'Emma Leroy', amount: '256,00 €', status: 'completed', date: 'Il y a 3h' },
];

const STATUS_CONFIG = {
  completed: { label: 'Payée', icon: CheckCircle2, className: 'text-primary-600 bg-primary-100 dark:bg-primary-900/30 dark:text-primary-400' },
  pending: { label: 'En attente', icon: Clock, className: 'text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400' },
  cancelled: { label: 'Annulée', icon: AlertCircle, className: 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400' },
};

// ─── Skeleton Loader ──────────────────────────────────────────────────────────

function ChartSkeleton() {
  return (
    <div className="h-48 flex items-end gap-2 px-2 pb-2">
      {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 95, 78].map((h, i) => (
        <div
          key={i}
          className="flex-1 rounded-t-sm skeleton"
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 p-6"
    >
      {/* ── En-tête ──────────────────────────────────────────────────────── */}
      <motion.div variants={cardVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            Tableau de bord
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Vue d'ensemble de votre activité — Mai 2026
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-lg border border-border">
            <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
            Données en temps réel
          </span>
        </div>
      </motion.div>

      {/* ── Stat Cards ───────────────────────────────────────────────────── */}
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
      >
        {STATS.map((stat) => {
          const Icon = stat.icon;
          const isPositive = stat.change >= 0;
          const TrendIcon = isPositive ? ArrowUpRight : ArrowDownRight;

          return (
            <motion.div
              key={stat.id}
              variants={cardVariants}
              className="bg-card border border-border rounded-xl p-5 shadow-card hover:shadow-card-hover transition-shadow duration-200"
            >
              <div className="flex items-start justify-between">
                <div className={`w-10 h-10 rounded-xl ${stat.bgColor} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <span
                  className={`inline-flex items-center gap-0.5 text-xs font-medium px-2 py-1 rounded-full ${
                    isPositive
                      ? 'text-primary-700 bg-primary-100 dark:text-primary-400 dark:bg-primary-900/30'
                      : 'text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/30'
                  }`}
                >
                  <TrendIcon className="w-3 h-3" />
                  {Math.abs(stat.change)}%
                </span>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-display font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-0.5">{stat.label}</p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* ── Graphique + Commandes Récentes ───────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

        {/* Graphique CA */}
        <motion.div
          variants={cardVariants}
          className="xl:col-span-2 bg-card border border-border rounded-xl shadow-card overflow-hidden"
        >
          <div className="p-5 border-b border-border flex items-center justify-between">
            <div>
              <h2 className="font-display font-semibold text-foreground">Évolution du CA</h2>
              <p className="text-xs text-muted-foreground mt-0.5">12 derniers mois</p>
            </div>
            <div className="inline-flex items-center gap-1 text-xs font-medium text-primary-600 dark:text-primary-400">
              <TrendingUp className="w-3.5 h-3.5" />
              +12.4% vs N-1
            </div>
          </div>

          {/* Chart placeholder animé — remplacé par Recharts dans la feature */}
          <div className="p-5">
            <ChartSkeleton />
            <div className="flex items-center justify-center mt-3">
              <div className="inline-flex items-center gap-2 text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-lg border border-border">
                <Package className="w-3.5 h-3.5" />
                Graphique disponible dans le module Analytics
              </div>
            </div>
          </div>
        </motion.div>

        {/* Performance rapide */}
        <motion.div
          variants={cardVariants}
          className="bg-card border border-border rounded-xl shadow-card"
        >
          <div className="p-5 border-b border-border">
            <h2 className="font-display font-semibold text-foreground">Performance</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Ce mois</p>
          </div>
          <div className="p-5 space-y-4">
            {[
              { label: 'Taux de conversion', value: 3.8, unit: '%', color: 'bg-primary-500' },
              { label: 'Taux de fidélisation', value: 72, unit: '%', color: 'bg-blue-500' },
              { label: 'NPS Score', value: 84, unit: '/100', color: 'bg-violet-500' },
              { label: 'Taux de retour', value: 4.2, unit: '%', color: 'bg-amber-500' },
            ].map((metric) => (
              <div key={metric.label} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{metric.label}</span>
                  <span className="font-semibold text-foreground">{metric.value}{metric.unit}</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${metric.value > 10 ? metric.value : metric.value * 10}%` }}
                    transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
                    className={`h-full ${metric.color} rounded-full`}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Commandes Récentes ────────────────────────────────────────────── */}
      <motion.div
        variants={cardVariants}
        className="bg-card border border-border rounded-xl shadow-card overflow-hidden"
      >
        <div className="p-5 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="font-display font-semibold text-foreground">Commandes récentes</h2>
            <p className="text-xs text-muted-foreground mt-0.5">5 dernières transactions</p>
          </div>
          <button className="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium transition-colors">
            Voir tout →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Référence</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Client</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Date</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Montant</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Statut</th>
              </tr>
            </thead>
            <tbody>
              {RECENT_ORDERS.map((order, i) => {
                const config = STATUS_CONFIG[order.status];
                const StatusIcon = config.icon;
                return (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.06 }}
                    className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <span className="font-mono text-xs font-medium text-foreground">{order.ref}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="font-medium text-foreground">{order.client}</span>
                    </td>
                    <td className="px-5 py-3.5 hidden sm:table-cell">
                      <span className="text-muted-foreground text-xs">{order.date}</span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <span className="font-semibold text-foreground">{order.amount}</span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
                        <StatusIcon className="w-3 h-3" />
                        {config.label}
                      </span>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
