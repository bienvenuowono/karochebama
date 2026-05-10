import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Shield, 
  Lock,
  Save,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import axios from 'axios';
import { authService } from '../services/authService';

const ProfilePage = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    whatsapp: '',
    country: '',
    address: '',
    password: ''
  });

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setFormData({
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        whatsapp: currentUser.whatsapp || '',
        country: currentUser.country || 'Cameroun',
        address: currentUser.address || '',
        password: ''
      });
    }
    setLoading(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    
    try {
      const token = authService.getToken();
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const updateData = { ...formData };
      if (!updateData.password) delete (updateData as any).password;
      
      const response = await axios.patch(`http://localhost:5001/api/v1/users/${user.id}`, updateData, config);
      
      if (response.data.success) {
        // Mettre à jour le localStorage
        const updatedUser = { ...user, ...updateData };
        delete (updatedUser as any).password;
        localStorage.setItem('admin_user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Erreur lors de la mise à jour du profil');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-primary-500" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 font-outfit tracking-tight">Mon Profil</h1>
        <p className="text-sm text-slate-500 mt-1">Gérez vos informations personnelles et votre sécurité.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Avatar & Summary */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm text-center">
            <div className="w-24 h-24 bg-primary-500 rounded-[32px] flex items-center justify-center text-white text-4xl font-black mx-auto shadow-lg shadow-primary-500/30 mb-4">
              {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
            </div>
            <h3 className="text-xl font-bold text-slate-900">{user?.firstName} {user?.lastName}</h3>
            <p className="text-sm text-slate-400 mt-1">{user?.email}</p>
            <div className="mt-4 flex justify-center">
              <span className="px-3 py-1 bg-primary-50 text-primary-600 text-[10px] font-black rounded-full uppercase tracking-widest border border-primary-100">
                {user?.role}
              </span>
            </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-[32px] text-white overflow-hidden relative">
            <Shield className="absolute -right-4 -bottom-4 w-32 h-32 text-white/5" />
            <h4 className="text-sm font-bold mb-2">Sécurité du compte</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Votre compte est protégé par un cryptage de niveau industriel. Pensez à changer votre mot de passe régulièrement.
            </p>
          </div>
        </div>

        {/* Right Column: Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Prénom</label>
                <input 
                  type="text" required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                  value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Nom</label>
                <input 
                  type="text" required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                  value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Email (Identifiant)</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  type="email" required
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none cursor-not-allowed opacity-70"
                  value={formData.email} readOnly
                />
              </div>
              <p className="text-[10px] text-slate-400 italic">L'adresse email ne peut pas être modifiée pour des raisons de sécurité.</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Téléphone</label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input 
                    type="text"
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                    value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">WhatsApp</label>
                <input 
                  type="text"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                  value={formData.whatsapp} onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Adresse Complète</label>
              <div className="relative group">
                <MapPin className="absolute left-4 top-4 text-slate-300" size={18} />
                <textarea 
                  rows={3}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                  value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})}
                ></textarea>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Lock size={16} className="text-primary-500" /> Sécurité
              </h4>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Nouveau mot de passe</label>
                <input 
                  type="password"
                  placeholder="Laisser vide pour ne pas changer"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                  value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            <div className="pt-6 flex items-center justify-between">
              {success ? (
                <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                  <CheckCircle2 size={20} /> Profil mis à jour !
                </div>
              ) : (
                <div></div>
              )}
              
              <button 
                type="submit"
                disabled={saving}
                className={`
                  px-8 py-4 rounded-2xl font-bold text-sm transition-all flex items-center gap-2
                  ${saving ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-primary-500 text-white hover:bg-primary-600 shadow-lg shadow-primary-500/20 active:scale-95'}
                `}
              >
                {saving ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <Save size={20} />
                )}
                Enregistrer les modifications
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
