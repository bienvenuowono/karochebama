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
  Briefcase,
  Edit,
  Trash2,
  X,
  Check,
  Camera
} from 'lucide-react';
import axios from 'axios';
import { authService } from '../services/authService';
import { uploadService } from '../services/uploadService';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    whatsapp: '',
    role: 'USER',
    country: 'Cameroun',
    address: '',
    photoUrl: '',
    password: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = authService.getToken();
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get('http://localhost:5001/api/v1/users', config);
      setUsers(res.data.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u: any) => 
      ((u.firstName || '') + ' ' + (u.lastName || '')).toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

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

  const handleOpenForm = (user: any = null) => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        whatsapp: user.whatsapp || '',
        role: user.role || 'USER',
        country: user.country || 'Cameroun',
        address: user.address || '',
        photoUrl: user.photoUrl || '',
        password: ''
      });
      setSelectedUser(user);
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        whatsapp: '',
        role: 'USER',
        country: 'Cameroun',
        address: '',
        photoUrl: '',
        password: ''
      });
      setSelectedUser(null);
    }
    setImageFile(null);
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = authService.getToken();
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      let finalPhotoUrl = formData.photoUrl;
      if (imageFile) {
        finalPhotoUrl = await uploadService.uploadImage(imageFile);
      }

      const payload = { ...formData, photoUrl: finalPhotoUrl };
      if (!payload.password && selectedUser) delete (payload as any).password;
      
      if (selectedUser) {
        // Modification
        await axios.patch(`http://localhost:5001/api/v1/users/${selectedUser.id}`, payload, config);
      } else {
        // Création
        await axios.post('http://localhost:5001/api/v1/users', payload, config);
      }
      
      setIsFormOpen(false);
      fetchData();
    } catch (error: any) {
      console.error('Error saving user:', error);
      const message = error.response?.data?.message || error.message || 'Erreur inconnue';
      alert(`Erreur lors de l'enregistrement : ${message}`);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Supprimer cet utilisateur ?")) return;
    try {
      const token = authService.getToken();
      await axios.delete(`http://localhost:5001/api/v1/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (error) {
      alert("Erreur lors de la suppression");
    }
  };

  const columns = [
    { 
      id: 'name', 
      label: 'Utilisateur',
      format: (_: any, row: any) => {
        const photoUrl = row.photoUrl ? (row.photoUrl.startsWith('http') ? row.photoUrl : `http://localhost:5001${row.photoUrl}`) : null;
        return (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center font-bold overflow-hidden">
              {photoUrl ? (
                <img src={photoUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span>{row.firstName?.charAt(0)}{row.lastName?.charAt(0)}</span>
              )}
            </div>
            <div>
              <p className="font-bold text-slate-900">{row.firstName} {row.lastName}</p>
              <p className="text-[10px] text-slate-500 font-medium uppercase tracking-tighter">{row.email}</p>
            </div>
          </div>
        );
      }
    },
    { 
      id: 'role', 
      label: 'Rôle',
      format: (val: string) => (
        <span className={`px-2 py-1 text-[10px] font-black rounded-lg uppercase border
          ${val === 'ADMIN' ? 'bg-purple-50 text-purple-600 border-purple-100' : 
            val === 'MANAGER' ? 'bg-orange-50 text-orange-600 border-orange-100' : 
            'bg-blue-50 text-blue-600 border-blue-100'}
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
      label: 'Actions',
      format: (_: any, row: any) => (
        <div className="flex items-center gap-2">
          <button 
            onClick={() => { setSelectedUser(row); setIsProfileOpen(true); }}
            className="p-2 hover:bg-primary-50 text-primary-600 rounded-lg transition-all"
            title="Voir Profil"
          >
            <ChevronRight size={18} />
          </button>
          <button 
            onClick={() => handleOpenForm(row)}
            className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-all"
            title="Modifier"
          >
            <Edit size={18} />
          </button>
          <button 
            onClick={() => handleDelete(row.id)}
            className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-all"
            title="Supprimer"
          >
            <Trash2 size={18} />
          </button>
        </div>
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
        <button 
          onClick={() => handleOpenForm()}
          className="px-6 py-3 bg-primary-500 text-white rounded-2xl font-bold text-sm hover:bg-primary-600 shadow-lg shadow-primary-500/20 flex items-center gap-2 transition-all active:scale-95"
        >
          <PlusCircle size={20} /> Nouvel Utilisateur
        </button>
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
              <div className="w-20 h-20 bg-primary-500 rounded-[32px] flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-primary-500/30 overflow-hidden">
                {selectedUser.photoUrl ? (
                  <img 
                    src={selectedUser.photoUrl.startsWith('http') ? selectedUser.photoUrl : `http://localhost:5001${selectedUser.photoUrl}`} 
                    alt="Avatar" 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <span>{selectedUser.firstName?.charAt(0)}{selectedUser.lastName?.charAt(0)}</span>
                )}
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
                 {customerStats.recentOrders?.map((o: any) => (
                   <div key={o.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div>
                        <p className="text-xs font-bold text-slate-900">Commande #{o.id}</p>
                        <p className="text-[10px] text-slate-400">{new Date(o.createdAt).toLocaleDateString()}</p>
                      </div>
                      <p className="text-xs font-black text-primary-600">{Number(o.totalAmount).toLocaleString()} FCFA</p>
                   </div>
                 ))}
                 {(!customerStats.recentOrders || customerStats.recentOrders.length === 0) && <p className="text-xs text-slate-400 italic text-center py-4">Aucune commande passée.</p>}
               </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex gap-4 pt-4">
              <button 
                onClick={() => { setIsProfileOpen(false); handleOpenForm(selectedUser); }}
                className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-2xl font-bold text-sm hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
              >
                <Edit size={18} /> Modifier Profil
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

      {/* MODAL FORMULAIRE UTILISATEUR */}
      <Modal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        title={selectedUser ? "Modifier l'utilisateur" : "Nouvel Utilisateur"}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Prénom</label>
              <input 
                type="text" required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500/20 outline-none"
                value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Nom</label>
              <input 
                type="text" required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500/20 outline-none"
                value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Email</label>
            <input 
              type="email" required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500/20 outline-none"
              value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Téléphone</label>
              <input 
                type="text"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500/20 outline-none"
                value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Rôle</label>
              <select 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none"
                value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}
              >
                <option value="USER">Client (USER)</option>
                <option value="MANAGER">Gestionnaire (MANAGER)</option>
                <option value="ADMIN">Administrateur (ADMIN)</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Mot de passe {selectedUser && "(Laisser vide pour ne pas changer)"}</label>
            <input 
              type="password" required={!selectedUser}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500/20 outline-none"
              value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Photo de Profil</label>
            <input 
              type="file" accept="image/*"
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setImageFile(e.target.files[0]);
                }
              }}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Adresse</label>
            <textarea 
              rows={2}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500/20 outline-none"
              value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})}
            ></textarea>
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-primary-500 text-white rounded-2xl font-bold text-sm hover:bg-primary-600 shadow-lg shadow-primary-500/25 transition-all"
          >
            {selectedUser ? "Mettre à jour" : "Créer l'utilisateur"}
          </button>
        </form>
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
