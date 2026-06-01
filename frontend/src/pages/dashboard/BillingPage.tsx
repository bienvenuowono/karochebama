import { motion } from 'framer-motion';
import { 
  CreditCard, 
  CheckCircle2, 
  Download, 
  Zap, 
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

interface Invoice {
  id: string;
  ref: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  pdfUrl: string;
}

const INVOICES: Invoice[] = [
  { id: '1', ref: 'INV-2026-05', date: '01 Mai 2026', amount: 99.00, status: 'paid', pdfUrl: '#' },
  { id: '2', ref: 'INV-2026-04', date: '01 Avr 2026', amount: 99.00, status: 'paid', pdfUrl: '#' },
  { id: '3', ref: 'INV-2026-03', date: '01 Mar 2026', amount: 99.00, status: 'paid', pdfUrl: '#' },
  { id: '4', ref: 'INV-2026-02', date: '01 Fév 2026', amount: 99.00, status: 'paid', pdfUrl: '#' },
  { id: '5', ref: 'INV-2026-01', date: '01 Jan 2026', amount: 49.00, status: 'paid', pdfUrl: '#' }, // Ancien forfait
];

const STATUS_CONFIG = {
  paid: { label: 'Payé', className: 'text-emerald-700 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400' },
  pending: { label: 'En attente', className: 'text-amber-700 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400' },
  failed: { label: 'Échoué', className: 'text-red-700 bg-red-100 dark:bg-red-900/30 dark:text-red-400' },
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function BillingPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      
      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Facturation & Abonnement</h1>
        <p className="text-sm text-muted-foreground mt-1">Gérez votre forfait, vos moyens de paiement et téléchargez vos factures.</p>
      </div>

      <motion.div 
        variants={containerVariants} 
        initial="hidden" 
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* ── ABONNEMENT ACTUEL ────────────────────────────────────────── */}
        <motion.div variants={itemVariants} className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden relative">
          {/* Decorative background */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-bl-full blur-2xl pointer-events-none" />
          
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xs font-bold uppercase tracking-wider mb-3">
                  <Zap size={14} /> Forfait Actuel
                </div>
                <h2 className="text-3xl font-display font-bold text-foreground">Pro</h2>
                <p className="text-muted-foreground mt-1 text-sm">Pour les entreprises en croissance.</p>
              </div>
              <div className="text-right">
                <span className="text-3xl font-bold text-foreground">99 €</span>
                <span className="text-muted-foreground text-sm"> / mois</span>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-2 text-sm text-foreground">
                <CheckCircle2 size={18} className="text-primary-500" />
                Jusqu'à 10 000 produits
              </div>
              <div className="flex items-center gap-2 text-sm text-foreground">
                <CheckCircle2 size={18} className="text-primary-500" />
                Statistiques avancées
              </div>
              <div className="flex items-center gap-2 text-sm text-foreground">
                <CheckCircle2 size={18} className="text-primary-500" />
                Support prioritaire 24/7
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-muted/30 border-t border-border flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Prochain prélèvement le <span className="font-semibold text-foreground">01 Juin 2026</span>
            </p>
            <button className="btn-primary py-2 px-4 text-sm font-semibold shadow-glow">
              Modifier l'abonnement
            </button>
          </div>
        </motion.div>

        {/* ── MOYEN DE PAIEMENT ─────────────────────────────────────────── */}
        <motion.div variants={itemVariants} className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 flex-1">
            <div className="flex items-center gap-2 mb-6">
              <CreditCard size={20} className="text-foreground" />
              <h2 className="text-lg font-display font-bold text-foreground">Moyen de paiement</h2>
            </div>

            {/* Carte de crédit simulée */}
            <div className="relative p-5 rounded-xl bg-gradient-to-br from-neutral-800 to-neutral-950 text-white overflow-hidden shadow-xl max-w-sm">
              {/* Effet reflet carte */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
              
              <div className="flex justify-between items-start mb-8 relative z-10">
                <div className="w-12 h-8 bg-white/20 rounded-md backdrop-blur-sm" /> {/* Puce */}
                <span className="font-bold italic text-lg tracking-wider opacity-80">VISA</span>
              </div>
              
              <div className="space-y-4 relative z-10">
                <div className="flex gap-4 font-mono text-xl tracking-widest opacity-90">
                  <span>••••</span>
                  <span>••••</span>
                  <span>••••</span>
                  <span>4242</span>
                </div>
                <div className="flex justify-between items-end">
                  <div className="uppercase text-xs tracking-widest opacity-80">
                    <p className="text-[10px] opacity-60 mb-0.5">Titulaire</p>
                    JEAN DUPONT
                  </div>
                  <div className="uppercase text-xs tracking-widest opacity-80">
                    <p className="text-[10px] opacity-60 mb-0.5">Expire</p>
                    12/28
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-start gap-2 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-400 text-sm">
              <ShieldCheck size={18} className="shrink-0 mt-0.5" />
              <p>Vos informations de paiement sont sécurisées par Stripe via un cryptage AES-256.</p>
            </div>
          </div>

          <div className="p-6 bg-muted/30 border-t border-border flex items-center justify-end gap-3">
            <button className="px-4 py-2 bg-background border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors">
              Supprimer
            </button>
            <button className="px-4 py-2 bg-foreground text-background rounded-lg text-sm font-semibold hover:bg-foreground/90 transition-colors">
              Ajouter une carte
            </button>
          </div>
        </motion.div>
      </motion.div>

      {/* ── HISTORIQUE DE FACTURATION ─────────────────────────────────── */}
      <motion.div 
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden"
      >
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-lg font-display font-bold text-foreground">Historique des factures</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-muted-foreground">
                <th className="px-6 py-4 font-semibold">Facture</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Montant</th>
                <th className="px-6 py-4 font-semibold">Statut</th>
                <th className="px-6 py-4 font-semibold text-right">Reçu</th>
              </tr>
            </thead>
            <tbody>
              {INVOICES.map((invoice) => {
                const config = STATUS_CONFIG[invoice.status];
                return (
                  <tr key={invoice.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">
                      {invoice.ref}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {invoice.date}
                    </td>
                    <td className="px-6 py-4 font-medium text-foreground">
                      {invoice.amount.toFixed(2)} €
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${config.className}`}>
                        {config.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors">
                        <Download size={14} />
                        PDF
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

    </div>
  );
}
