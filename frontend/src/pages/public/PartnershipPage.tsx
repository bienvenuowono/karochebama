import { useState } from 'react';
import { motion } from 'framer-motion';
import { Handshake, Megaphone, Terminal, UserPlus, ArrowRight, CheckCircle2, Building2 } from 'lucide-react';

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

const PARTNER_PROGRAMS = [
  {
    id: 'affiliate',
    title: 'Programme Affiliés',
    icon: <Megaphone size={28} />,
    color: 'from-amber-400 to-orange-500',
    bgColor: 'bg-amber-500/10 border-amber-500/20 text-amber-500',
    description: 'Recommandez Karochebama à votre audience et touchez des commissions récurrentes sur chaque abonnement.',
    benefits: ['Jusqu\'à 30% de commission à vie', 'Paiements mensuels garantis', 'Matériel promotionnel inclus']
  },
  {
    id: 'agency',
    title: 'Agences Certifiées',
    icon: <Building2 size={28} />,
    color: 'from-primary-400 to-primary-600',
    bgColor: 'bg-primary-500/10 border-primary-500/20 text-primary-500',
    description: 'Devenez expert certifié Karochebama et attirez de nouveaux clients cherchant de l\'aide pour configurer leur espace.',
    benefits: ['Mise en avant dans notre annuaire', 'Accès gratuit aux comptes clients', 'Support prioritaire dédié']
  },
  {
    id: 'tech',
    title: 'Partenaires Technologiques',
    icon: <Terminal size={28} />,
    color: 'from-emerald-400 to-teal-500',
    bgColor: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500',
    description: 'Intégrez votre solution SaaS ou votre application avec notre API pour créer de la valeur commune.',
    benefits: ['Accès développeur complet', 'Co-marketing de lancement', 'Partage de revenus sur les apps']
  }
];

export default function PartnershipPage() {
  const [formData, setFormData] = useState({ name: '', email: '', company: '', type: 'affiliate', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulation d'envoi
    setTimeout(() => setIsSubmitted(true), 1000);
  };

  return (
    <div className="min-h-screen bg-background pt-[72px]">
      
      {/* ─── HERO SECTION ─── */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-primary-950 dark:bg-background z-0" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay z-0" />
        <div className="absolute -top-64 -right-64 w-[500px] h-[500px] bg-primary-600/30 rounded-full blur-[100px] z-0" />
        <div className="absolute -bottom-64 -left-64 w-[500px] h-[500px] bg-amber-500/20 rounded-full blur-[100px] z-0" />

        <div className="page-container relative z-10 text-center max-w-4xl mx-auto">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
            <motion.div variants={fadeIn} className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white mb-8 shadow-glass">
              <Handshake size={32} />
            </motion.div>
            
            <motion.h1 variants={fadeIn} className="text-4xl md:text-6xl font-display font-bold text-white mb-6 leading-tight">
              Grandissons <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-primary-400">ensemble.</span>
            </motion.h1>
            
            <motion.p variants={fadeIn} className="text-lg md:text-xl text-primary-100/80 mb-10 max-w-2xl mx-auto">
              Rejoignez le programme partenaire de Karochebama et créez de nouvelles sources de revenus en aidant les entrepreneurs à réussir.
            </motion.p>
            
            <motion.div variants={fadeIn}>
              <a href="#apply-form" className="btn-primary py-4 px-8 text-base shadow-glow bg-white text-primary-950 hover:bg-primary-50 border-none">
                Devenir Partenaire
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── PARTNERSHIP PROGRAMS ─── */}
      <section className="py-24 bg-card border-b border-border">
        <div className="page-container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Choisissez votre programme</h2>
            <p className="text-muted-foreground">Que vous soyez créateur de contenu, agence web ou développeur, nous avons un modèle conçu pour votre succès.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {PARTNER_PROGRAMS.map((program) => (
              <motion.div 
                key={program.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-background rounded-3xl p-8 border border-border shadow-sm hover:shadow-card-hover transition-all duration-300 relative group overflow-hidden"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${program.color} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`} />
                
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border ${program.bgColor}`}>
                  {program.icon}
                </div>
                
                <h3 className="text-xl font-bold mb-3 text-foreground">{program.title}</h3>
                <p className="text-muted-foreground text-sm mb-6 min-h-[60px]">{program.description}</p>
                
                <ul className="space-y-3 mb-8">
                  {program.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm font-medium">
                      <CheckCircle2 size={16} className={`shrink-0 mt-0.5 ${program.bgColor.split(' ')[2]}`} />
                      {benefit}
                    </li>
                  ))}
                </ul>
                
                <a href="#apply-form" className={`mt-auto inline-flex items-center gap-2 text-sm font-bold ${program.bgColor.split(' ')[2]} hover:gap-3 transition-all`}>
                  Postuler <ArrowRight size={16} />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS (PROCESS) ─── */}
      <section className="py-24 bg-background overflow-hidden relative">
        <div className="page-container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Comment ça marche ?</h2>
            <p className="text-muted-foreground">Un processus simple et transparent pour démarrer rapidement.</p>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center max-w-4xl mx-auto relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-border z-0" />

            {[
              { step: 1, title: 'Postulez', desc: 'Remplissez le formulaire en moins de 2 minutes.' },
              { step: 2, title: 'Intégrez', desc: 'Recevez vos accès et vos liens uniques.' },
              { step: 3, title: 'Gagnez', desc: 'Générez des revenus à chaque conversion.' },
            ].map((item, idx) => (
              <div key={idx} className="relative z-10 flex flex-col items-center text-center w-full md:w-1/3 px-4 mb-8 md:mb-0">
                <div className="w-24 h-24 rounded-full bg-card border-4 border-background shadow-glass flex items-center justify-center text-2xl font-display font-bold text-primary-600 mb-6 relative">
                  <div className="absolute inset-0 rounded-full border border-border border-dashed animate-[spin_10s_linear_infinite]" />
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── APPLICATION FORM ─── */}
      <section id="apply-form" className="py-24 bg-primary-950 text-white relative">
        <div className="absolute inset-0 bg-mesh opacity-10" />
        <div className="page-container relative z-10">
          <div className="max-w-2xl mx-auto bg-card text-foreground rounded-3xl p-8 md:p-12 shadow-2xl">
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <UserPlus size={32} />
              </div>
              <h2 className="text-3xl font-display font-bold mb-2">Rejoignez le réseau</h2>
              <p className="text-muted-foreground">Notre équipe examinera votre candidature et vous répondra sous 48h.</p>
            </div>

            {isSubmitted ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={40} />
                </div>
                <h3 className="text-2xl font-bold mb-2">Candidature envoyée !</h3>
                <p className="text-muted-foreground">Merci pour votre intérêt. Nous vous contacterons très prochainement.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Nom complet</label>
                    <input required type="text" className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Jean Dupont" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Email professionnel</label>
                    <input required type="email" className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="jean@entreprise.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">Entreprise ou Site Web (Optionnel)</label>
                  <input type="text" className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="https://monsite.com" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">Type de partenariat souhaité</label>
                  <select className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                    <option value="affiliate">Programme Affiliés</option>
                    <option value="agency">Agence Certifiée</option>
                    <option value="tech">Partenaire Technologique</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">Comment comptez-vous promouvoir Karochebama ?</label>
                  <textarea required rows={4} className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" placeholder="Décrivez brièvement votre audience ou votre projet d'intégration..." value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} />
                </div>

                <button type="submit" className="btn-primary w-full py-4 text-base font-bold shadow-glow">
                  Envoyer ma candidature
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
