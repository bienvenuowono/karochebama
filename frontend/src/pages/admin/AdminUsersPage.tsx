import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  UserPlus, 
  ShieldAlert, 
  Ban,
  Mail,
  Key
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

type UserRole = 'super_admin' | 'tenant_admin' | 'user';
type UserStatus = 'active' | 'banned' | 'pending';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organization: string | null; // null si super_admin
  status: UserStatus;
  lastLogin: string;
  avatar: string;
}

const MOCK_USERS: AdminUser[] = [
  {
    id: 'usr_1', name: 'Alice Dubois', email: 'alice.admin@karochebama.com',
    role: 'super_admin', organization: null, status: 'active', lastLogin: 'Il y a 5 min',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Alice'
  },
  {
    id: 'usr_2', name: 'Jean Martin', email: 'jean@acmecorp.com',
    role: 'tenant_admin', organization: 'Acme Corp', status: 'active', lastLogin: 'Il y a 2 heures',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Jean'
  },
  {
    id: 'usr_3', name: 'Sophie Bernard', email: 'sophie@studio360.fr',
    role: 'user', organization: 'Studio Design 360', status: 'active', lastLogin: 'Hier',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Sophie'
  },
  {
    id: 'usr_4', name: 'Marc Dupont', email: 'marc.spammer@gmail.com',
    role: 'user', organization: 'Fake Store', status: 'banned', lastLogin: 'Il y a 1 mois',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Marc'
  },
  {
    id: 'usr_5', name: 'Emma Leroy', email: 'emma@startuphub.co',
    role: 'tenant_admin', organization: 'StartUp Factory', status: 'pending', lastLogin: 'Jamais',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Emma'
  }
];

const ROLE_CONFIG = {
  super_admin: { label: 'Super Admin', className: 'text-red-400 bg-red-500/10 border-red-500/20' },
  tenant_admin: { label: 'Admin Client', className: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
  user: { label: 'Employé', className: 'text-neutral-400 bg-neutral-800 border-neutral-700' },
};

const STATUS_CONFIG = {
  active: { label: 'Actif', className: 'text-emerald-400 bg-emerald-500/10' },
  banned: { label: 'Banni', className: 'text-red-400 bg-red-500/10' },
  pending: { label: 'En attente', className: 'text-amber-400 bg-amber-500/10' },
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  // Filtrage simple
  const filteredUsers = MOCK_USERS.filter(user => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return user.name.toLowerCase().includes(term) || 
             user.email.toLowerCase().includes(term) ||
             user.organization?.toLowerCase().includes(term);
    }
    return true;
  });

  return (
    <div className="p-6 space-y-6">
      
      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Utilisateurs (Global)</h1>
          <p className="text-sm text-neutral-400 mt-1">Gérez tous les comptes inscrits sur la plateforme.</p>
        </div>
        <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center gap-2 shadow-sm">
          <UserPlus size={16} />
          Nouveau Super-Admin
        </button>
      </div>

      {/* ── TOOLBAR ──────────────────────────────────────────────────────── */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl shadow-sm p-4 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input 
            type="text" 
            placeholder="Rechercher par nom, email ou organisation..." 
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
                <th className="px-6 py-4 font-semibold">Utilisateur</th>
                <th className="px-6 py-4 font-semibold">Rôle Global</th>
                <th className="px-6 py-4 font-semibold">Organisation</th>
                <th className="px-6 py-4 font-semibold">Statut</th>
                <th className="px-6 py-4 font-semibold">Dernière connexion</th>
                <th className="px-6 py-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <motion.tbody variants={containerVariants} initial="hidden" animate="visible">
              {filteredUsers.map((user) => {
                const roleConfig = ROLE_CONFIG[user.role];
                const statusConfig = STATUS_CONFIG[user.status];
                
                return (
                  <motion.tr 
                    key={user.id} 
                    variants={itemVariants}
                    className="border-b border-neutral-800/50 hover:bg-neutral-800/30 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-neutral-800 border border-neutral-700 overflow-hidden shrink-0">
                          <img src={user.avatar} alt={user.name} className="w-full h-full object-cover opacity-90" />
                        </div>
                        <div>
                          <p className="font-bold text-white">{user.name}</p>
                          <p className="text-xs text-neutral-500 flex items-center gap-1">
                            <Mail size={10} /> {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${roleConfig.className}`}>
                        {user.role === 'super_admin' && <ShieldAlert size={10} className="mr-1" />}
                        {roleConfig.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {user.organization ? (
                        <span className="font-medium text-neutral-300">{user.organization}</span>
                      ) : (
                        <span className="text-xs italic text-neutral-600">— Interne —</span>
                      )}
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
                      {user.lastLogin}
                    </td>
                    <td className="px-6 py-4 text-center relative">
                      <button 
                        onClick={() => setActiveMenu(activeMenu === user.id ? null : user.id)}
                        className="p-2 text-neutral-500 hover:bg-neutral-800 rounded-lg hover:text-white transition-colors"
                      >
                        <MoreHorizontal size={18} />
                      </button>

                      {/* Dropdown Menu Admin */}
                      {activeMenu === user.id && (
                        <div className="absolute right-8 top-10 w-48 bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl z-10 py-1 text-left">
                          <div className="fixed inset-0 z-[-1]" onClick={() => setActiveMenu(null)} />
                          <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors">
                            <Key size={16} /> Reset mot de passe
                          </button>
                          <div className="my-1 border-t border-neutral-800" />
                          <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors">
                            <Ban size={16} /> Bannir l'utilisateur
                          </button>
                        </div>
                      )}
                    </td>
                  </motion.tr>
                );
              })}
              
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-neutral-500">
                    Aucun utilisateur trouvé.
                  </td>
                </tr>
              )}
            </motion.tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-6 py-4 border-t border-neutral-800 flex items-center justify-between text-sm text-neutral-500 bg-neutral-950/30">
          <span>Affichage de 1 à {filteredUsers.length} sur {MOCK_USERS.length}</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-neutral-700 rounded-md hover:bg-neutral-800 hover:text-white transition-colors disabled:opacity-50" disabled>Précédent</button>
            <button className="px-3 py-1 border border-neutral-700 rounded-md hover:bg-neutral-800 hover:text-white transition-colors disabled:opacity-50" disabled={filteredUsers.length < 10}>Suivant</button>
          </div>
        </div>
      </div>

    </div>
  );
}
