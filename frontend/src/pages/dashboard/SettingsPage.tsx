import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Lock, 
  Bell, 
  Palette, 
  Building2, 
  Mail, 
  Camera,
  AlertTriangle
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

// ─── Constants ────────────────────────────────────────────────────────────────

const SETTINGS_TABS = [
  { id: 'profile', label: 'Profil public', icon: User },
  { id: 'security', label: 'Sécurité & Mot de passe', icon: Lock },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'appearance', label: 'Apparence', icon: Palette },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  
  // State for form demo
  const [form, setForm] = useState({
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@entreprise.com',
    company: 'Acme Corp',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      
      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Paramètres du compte</h1>
        <p className="text-sm text-muted-foreground mt-1">Gérez vos informations personnelles et vos préférences.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* ── SIDEBAR MENU ───────────────────────────────────────────────── */}
        <div className="w-full lg:w-64 shrink-0 bg-card border border-border rounded-xl shadow-sm p-2 flex flex-col gap-1 sticky top-[104px]">
          {SETTINGS_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' 
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ── MAIN CONTENT AREA ──────────────────────────────────────────── */}
        <motion.div 
          key={activeTab} // Force re-render animation on tab change
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex-1 w-full space-y-6"
        >
          {activeTab === 'profile' && (
            <>
              {/* Profile Card */}
              <motion.div variants={itemVariants} className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-border">
                  <h2 className="text-lg font-display font-bold text-foreground">Profil</h2>
                  <p className="text-sm text-muted-foreground">Mettez à jour votre photo et vos informations personnelles.</p>
                </div>

                <div className="p-6 space-y-8">
                  {/* Avatar Upload */}
                  <div className="flex items-center gap-6">
                    <div className="relative group">
                      <div className="w-24 h-24 rounded-full border-4 border-background shadow-md overflow-hidden bg-muted">
                        <img 
                          src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=f8fafc" 
                          alt="Avatar" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button className="absolute inset-0 bg-black/50 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                        <Camera size={20} />
                        <span className="text-[10px] font-medium mt-1">Modifier</span>
                      </button>
                    </div>
                    <div className="space-y-1">
                      <button className="px-4 py-2 bg-background border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors">
                        Changer la photo
                      </button>
                      <p className="text-xs text-muted-foreground">JPG, GIF ou PNG. 2MB max.</p>
                    </div>
                  </div>

                  {/* Form */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="block text-sm font-semibold text-foreground">Prénom</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input 
                          type="text" 
                          name="firstName"
                          value={form.firstName}
                          onChange={handleChange}
                          className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="block text-sm font-semibold text-foreground">Nom</label>
                      <input 
                        type="text" 
                        name="lastName"
                        value={form.lastName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-sm font-semibold text-foreground">Adresse e-mail</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input 
                          type="email" 
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-sm font-semibold text-foreground">Organisation</label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input 
                          type="text" 
                          name="company"
                          value={form.company}
                          onChange={handleChange}
                          className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-muted/30 border-t border-border flex justify-end">
                  <button className="btn-primary py-2 px-6 text-sm font-semibold shadow-glow">
                    Enregistrer les modifications
                  </button>
                </div>
              </motion.div>

              {/* Danger Zone */}
              <motion.div variants={itemVariants} className="bg-card border border-red-200 dark:border-red-900/30 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-red-200 dark:border-red-900/30 bg-red-50/50 dark:bg-red-900/10 flex items-center gap-2">
                  <AlertTriangle size={18} className="text-red-600 dark:text-red-400" />
                  <h2 className="text-lg font-display font-bold text-red-600 dark:text-red-400">Zone de danger</h2>
                </div>
                <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-foreground">Supprimer le compte</h3>
                    <p className="text-sm text-muted-foreground mt-1">Cette action est irréversible. Toutes vos données seront effacées de nos serveurs.</p>
                  </div>
                  <button className="shrink-0 px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg text-sm font-medium transition-colors shadow-sm">
                    Supprimer mon compte
                  </button>
                </div>
              </motion.div>
            </>
          )}

          {activeTab !== 'profile' && (
            <motion.div variants={itemVariants} className="bg-card border border-border rounded-2xl p-12 text-center shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-muted mx-auto flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-display font-bold text-foreground">Section en construction</h2>
              <p className="text-muted-foreground mt-2">Cette page de paramètres sera développée très prochainement.</p>
            </motion.div>
          )}

        </motion.div>
      </div>

    </div>
  );
}
