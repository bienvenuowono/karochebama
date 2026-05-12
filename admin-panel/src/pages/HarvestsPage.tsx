import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sprout, 
  Calendar, 
  MapPin, 
  TrendingUp, 
  PlusCircle, 
  CheckCircle2, 
  AlertCircle,
  ChevronRight,
  Package,
  History,
  Activity,
  ArrowRight,
  Clock,
  Waves,
  Search,
  Filter
} from 'lucide-react';
import axios from 'axios';
import { authService } from '../services/authService';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';

const HarvestsPage = () => {
  const [activeCultures, setActiveCultures] = useState([]);
  const [history, setHistory] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    productId: '',
    siteId: '',
    quantity: '',
    harvestDate: new Date().toISOString().split('T')[0],
    notes: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = authService.getToken();
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const [fRes, hRes, pRes] = await Promise.all([
        axios.get('http://localhost:5001/api/v1/production/harvests/forecasts', config),
        axios.get('http://localhost:5001/api/v1/production/harvests/history', config),
        axios.get('http://localhost:5001/api/v1/catalog/products', config)
      ]);

      setActiveCultures(fRes.data.data);
      setHistory(hRes.data.data);
      setProducts(pRes.data.data?.items || pRes.data.data || []);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCultures = useMemo(() => {
    return activeCultures.filter((item: any) => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.variety?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [activeCultures, searchTerm]);

  const handleHarvestClick = (product: any) => {
    setFormData({
      ...formData,
      productId: product.id.toString(),
      siteId: product.sites?.[0]?.siteId?.toString() || ''
    });
    setIsDialogOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = authService.getToken();
      await axios.post('http://localhost:5001/api/v1/production/harvests', 
        formData, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setIsDialogOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error saving harvest:', error);
    }
  };

  const columns = [
    { 
      id: 'harvestDate', 
      label: 'Date Récolte',
      format: (val: string) => (
        <span className="flex items-center gap-2 text-xs font-bold text-slate-500">
          <Calendar size={14} className="text-primary-500" />
          {new Date(val).toLocaleDateString()}
        </span>
      )
    },
    { 
      id: 'product', 
      label: 'Produit',
      format: (val: any) => (
        <div>
          <p className="text-sm font-black text-slate-900">{val?.name}</p>
          <p className="text-[10px] text-primary-600 font-bold uppercase">{val?.variety?.name}</p>
        </div>
      )
    },
    { 
      id: 'quantity', 
      label: 'Quantité',
      format: (val: number) => (
        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg font-black text-xs">
          {val.toLocaleString()} KG
        </span>
      )
    },
    { 
      id: 'product', 
      label: 'Performance',
      format: (prod: any, row: any) => {
        const estimated = prod?.quantityKg || 0;
        const actual = row.quantity;
        const diff = estimated > 0 ? ((actual - estimated) / estimated) * 100 : 0;
        return (
          <div className={`text-[10px] font-black flex items-center gap-1 ${diff >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
            {diff >= 0 ? '+' : ''}{diff.toFixed(1)}% {diff >= 0 ? <TrendingUp size={10}/> : <AlertCircle size={10}/>}
          </div>
        );
      }
    }
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* Header (Sans bouton Nouvelle Récolte) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 font-outfit tracking-tight">Suivi des Récoltes</h1>
          <p className="text-sm text-slate-500 mt-1">Tour de contrôle de la maturité et des rendements.</p>
        </div>
        
        {/* Barre de Recherche */}
        <div className="w-full md:w-96 flex items-center gap-3 bg-white px-4 py-3 rounded-2xl border border-slate-200 shadow-sm focus-within:ring-2 focus-within:ring-primary-500/20 transition-all">
          <Search size={18} className="text-slate-400" />
          <input 
            type="text" 
            placeholder="Rechercher un produit, une variété..." 
            className="flex-1 bg-transparent outline-none text-sm font-medium text-slate-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* MONITORING DES CULTURES */}
      <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-primary-50 text-primary-500 rounded-xl flex items-center justify-center">
            <Waves size={24} className="animate-pulse" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 font-outfit">Monitoring de Production</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCultures.length > 0 ? filteredCultures.map((item: any) => {
            const today = new Date();
            const maturity = new Date(item.maturityDate);
            const sowing = item.sowingDate ? new Date(item.sowingDate) : null;
            const daysLeft = Math.ceil((maturity.getTime() - today.getTime()) / (1000 * 3600 * 24));
            
            return (
              <div key={item.id} className="bg-slate-50/50 rounded-3xl border border-slate-100 p-6 group hover:border-emerald-200 hover:bg-white transition-all duration-300">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex flex-col gap-1">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase ${item.status === 'en_production' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'}`}>
                      <Clock size={12} />
                      {item.status === 'en_production' ? 'En cours' : 'Récolté'}
                    </div>
                    {daysLeft <= 3 && daysLeft > 0 && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase bg-red-100 text-red-600 mt-1">
                        <AlertCircle size={12} />
                        Bientôt prêt
                      </div>
                    )}
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-emerald-600 border border-slate-100 group-hover:scale-110 transition-transform">
                    <Sprout size={24} />
                  </div>
                </div>

                <h4 className="font-extrabold text-slate-900 text-lg mb-2">{item.name}</h4>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-xs border-b border-slate-100 pb-2">
                    <span className="text-slate-400 font-bold uppercase tracking-wider">Date de semis</span>
                    <span className="text-slate-900 font-black">{sowing ? sowing.toLocaleDateString('fr-FR') : 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs border-b border-slate-100 pb-2">
                    <span className="text-slate-400 font-bold uppercase tracking-wider">Quantité attendue</span>
                    <span className="text-emerald-600 font-black">{item.quantityKg?.toLocaleString()} KG</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-bold uppercase tracking-wider">Maturité prévue</span>
                    <span className="text-slate-900 font-black">{maturity.toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => handleHarvestClick(item)}
                    className="flex-1 py-3.5 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 size={16} />
                    Marquer comme Récolté
                  </button>
                </div>
              </div>
            );
          }) : (
            <div className="col-span-4 py-10 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-100">
               <Package size={40} className="mx-auto text-slate-200 mb-2" />
               <p className="text-xs text-slate-400 font-medium italic">Aucun résultat pour votre recherche.</p>
            </div>
          )}
        </div>
      </div>

      {/* HISTORIQUE */}
      <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <History size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 font-outfit">Récoltes Complétées</h3>
        </div>
        <DataTable columns={columns} data={history} loading={loading} />
      </div>

      {/* MODAL RÉCOLTE */}
      <Modal isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} title="Confirmation de Récolte">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-center">
            <p className="text-xs text-emerald-700 font-bold uppercase tracking-widest">Action Commerciale</p>
            <p className="text-[11px] text-emerald-600 mt-1">Le produit sera mis en vente avec la quantité saisie.</p>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Quantité Réelle (KG)</label>
                <input type="number" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none" 
                  value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: e.target.value})} />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Date effective</label>
                <input type="date" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none" 
                  value={formData.harvestDate} onChange={(e) => setFormData({...formData, harvestDate: e.target.value})} />
              </div>
            </div>
            <textarea className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none min-h-[100px]" 
              placeholder="Notes sur la qualité du lot..."
              value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})}
            ></textarea>
          </div>

          <button type="submit" className="w-full py-4 bg-primary-500 text-white rounded-2xl font-black text-sm hover:bg-primary-600 shadow-xl shadow-primary-500/25">
            Valider & Mettre en Vente
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default HarvestsPage;

