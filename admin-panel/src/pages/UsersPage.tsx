import React, { useState, useEffect, useMemo } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Shield, 
  ShoppingCart, 
  DollarSign, 
  ChevronRight, 
  Activity,
  PlusCircle,
  Search,
  ExternalLink,
  MapPin,
  MessageCircle,
  Clock,
  Briefcase
} from 'lucide-react';
import axios from 'axios';
import { authService } from '../services/authService';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = authService.getToken();
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get('http://localhost:5000/api/v1/users', config);
      setUsers(res.data.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u: any) => 
      (u.firstName + ' ' + u.lastName).toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  // CALCULS DU PROFIL CLIENT
  const customerStats = useMemo(() => {
    if (!selectedUser) return { ltv: 0, orderCount: 0, recentOrders: [] };
    const paidOrders = selectedUser.orders?.filter((o: any) => o.status === 'PAID') || [];
    const ltv = paidOrders.reduce((acc: number, curr: any) => acc + Number(curr.totalAmount), 0);
    return { 
      ltv, 
      orderCount: selectedUser.orders?.length || 0,
      recentOrders: selectedUser.orders?.slice(0, 5) || []
    };
  }, [selectedUser]);

  const columns = [
    { 
      id: 'name', 
      label: 'Utilisateur',
      format: (_: any, row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center font-bold">
            {row.firstName?.charAt(0)}{row.lastName?.charAt(0)}
          </div>
          <div>
            <p className="font-bold text-slate-900">{row.firstName} {row.lastName}</p>
            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-tighter">{row.email}</p>
          </div>
        </div>
      )
    },
    { 
      id: 'role', 
      label: 'Rôle',
      format: (val: string) => (
        <span className={`px-2 py-1 text-[10px] font-black rounded-lg uppercase border
          ${val === 'ADMIN' ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-blue-50 text-blue-600 border-blue-100'}
        `}>
          {val}
        </span>
      )
    },
    { 
      id: 'phone', 
      label: 'Contact',
      format: (val: string, row: any) => (
        <div className="flex flex-col">
          <span className="text-xs font-bold text-slate-700">{val || 'Non renseigné'}</span>
          <span className="text-[10px] text-emerald-600 font-medium">{row.whatsapp ? 'WhatsApp Actif' : ''}</span>
        </div>
      )
    },
    { 
      id: 'orders', 
      label: 'Commandes',
      format: (val: any[]) => (
        <span className="px-2 py-1 bg-slate-100 text-slate-500 text-xs font-bold rounded-lg">
          {val?.length || 0}
        </span>
      )
    },
    {
      id: 'actions',
      label: 'Gérer',
      format: (_: any, row: any) => (
        <button 
          onClick={() => { setSelectedUser(row); setIsProfileOpen(true); }}
          className="p-2 hover:bg-primary-50 text-primary-600 rounded-xl transition-all flex items-center gap-2 text-xs font-bold"
        >
          Voir Profil <ChevronRight size={14} />
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 font-outfit tracking-tight">Utilisateurs & CRM</h1>
          <p className="text-sm text-slate-500 mt-1">Gérez votre communauté et vos clients fidèles.</p>
        </div>
      </div>

      {/* Barre de Recherche */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
        <Search className="text-slate-400" size={20} />
        <input 
          type="text" 
          placeholder="Rechercher par nom ou email..." 
          className="flex-1 text-sm outline-none font-medium"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <DataTable columns={columns} data={filteredUsers} loading={loading} />

      {/* MODAL PROFIL CLIENT */}
      <Modal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} title="Fiche Client détaillée">
        {selectedUser && (
          <div className="space-y-8">
            {/* Header Profil */}
            <div className="flex items-center gap-6 pb-6 border-b border-slate-100">
              <div className="w-20 h-20 bg-primary-500 rounded-[32px] flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-primary-500/30">
                {selectedUser.firstName?.charAt(0)}{selectedUser.lastName?.charAt(0)}
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900">{selectedUser.firstName} {selectedUser.lastName}</h3>
                <div className="flex items-center gap-4 mt-1">
                   <p className="text-sm text-slate-400 flex items-center gap-1"><Mail size={14}/> {selectedUser.email}</p>
                   <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold rounded uppercase">{selectedUser.role}</span>
                </div>
              </div>
            </div>

            {/* Statistiques Client */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                <p className="text-[10px] font-bold text-emerald-600 uppercase mb-1">Dépense Totale (LTV)</p>
                <p className="text-xl font-black text-emerald-700">{customerStats.ltv.toLocaleString()} FCFA</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                <p className="text-[10px] font-bold text-blue-600 uppercase mb-1">Nombre de Commandes</p>
                <p className="text-xl font-black text-blue-700">{customerStats.orderCount}</p>
              </div>
            </div>

            {/* Détails Contacts */}
            <div className="space-y-4">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                 <Activity size={16} className="text-primary-500" /> Informations de contact
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ContactInfo icon={Phone} label="Téléphone" value={selectedUser.phone || 'Non renseigné'} />
                <ContactInfo icon={MapPin} label="Pays" value={selectedUser.country || 'Cameroun'} />
                <div className="md:col-span-2">
                  <ContactInfo icon={MapPin} label="Adresse de livraison" value={selectedUser.address || 'Aucune adresse enregistrée'} />
                </div>
              </div>
            </div>

            {/* Historique des commandes */}
            <div className="space-y-4">
               <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                  <Clock size={16} className="text-orange-500" /> Historique récent
               </h4>
               <div className="space-y-2">
                 {customerStats.recentOrders.map((o: any) => (
                   <div key={o.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div>
                        <p className="text-xs font-bold text-slate-900">Commande #{o.id}</p>
                        <p className="text-[10px] text-slate-400">{new Date(o.createdAt).toLocaleDateString()}</p>
                      </div>
                      <p className="text-xs font-black text-primary-600">{Number(o.totalAmount).toLocaleString()} FCFA</p>
                   </div>
                 ))}
                 {customerStats.recentOrders.length === 0 && <p className="text-xs text-slate-400 italic text-center py-4">Aucune commande passée.</p>}
               </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex gap-4 pt-4">
              <button className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-2xl font-bold text-sm hover:bg-slate-200 transition-all flex items-center justify-center gap-2">
                <Briefcase size={18} /> Modifier le rôle
              </button>
              <a 
                href={`https://wa.me/${selectedUser.whatsapp || selectedUser.phone}`} 
                target="_blank" 
                rel="noreferrer"
                className="flex-[2] py-3 bg-emerald-500 text-white rounded-2xl font-bold text-sm hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
              >
                <MessageCircle size={18} /> Contacter sur WhatsApp
              </a>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

const ContactInfo = ({ icon: Icon, label, value }: any) => (
  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
    <div className="p-2 bg-white rounded-lg text-slate-400 shadow-sm"><Icon size={14}/></div>
    <div>
      <p className="text-[8px] font-bold text-slate-400 uppercase leading-none mb-1">{label}</p>
      <p className="text-xs font-bold text-slate-900">{value}</p>
    </div>
  </div>
);

export default UsersPage;
