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
<<<<<<< HEAD
        axios.get('http://localhost:5001/api/v1/production/harvests/forecasts', config),
        axios.get('http://localhost:5001/api/v1/production/harvests/history', config),
        axios.get('http://localhost:5001/api/v1/catalog/products', config)
=======
        axios.get('http://localhost:5000/api/v1/production/harvests/forecasts', config),
        axios.get('http://localhost:5000/api/v1/production/harvests/history', config),
        axios.get('http://localhost:5000/api/v1/catalog/products', config)
>>>>>>> a9f1ddf04f884b977c71915d684ba0681cbb35f1
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
<<<<<<< HEAD
      await axios.post('http://localhost:5001/api/v1/production/harvests', 
=======
      await axios.post('http://localhost:5000/api/v1/production/harvests', 
>>>>>>> a9f1ddf04f884b977c71915d684ba0681cbb35f1
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredCultures.length > 0 ? filteredCultures.map((item: any) => {
            const today = new Date();
            const maturity = new Date(item.maturityDate);
            const daysLeft = Math.ceil((maturity.getTime() - today.getTime()) / (1000 * 3600 * 24));
            
            return (
              <div key={item.id} className="p-5 rounded-3xl border border-slate-100 bg-slate-50/50 group hover:border-primary-200 transition-all">
                <div className="flex justify-between items-start mb-3">
                  <div className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase ${daysLeft <= 3 ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                    {daysLeft <= 0 ? 'PRÊT À RÉCOLTER' : `J-${daysLeft}`}
                  </div>
                  <Sprout size={16} className="text-slate-300 group-hover:text-primary-500 transition-colors" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm truncate">{item.name}</h4>
                <div className="flex items-center gap-1 mt-1">
                   <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></div>
                   <p className="text-[10px] text-slate-400 font-bold uppercase">{item.sites?.[0]?.site?.name || 'Multi-sites'}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200/50 flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-primary-600 uppercase">Est. {item.quantityKg} KG</span>
                    <span className="text-[8px] text-slate-400 font-bold uppercase">Prévu: {maturity.toLocaleDateString()}</span>
                  </div>
                  <button 
                    onClick={() => handleHarvestClick(item)}
                    className="p-2 bg-white text-primary-600 rounded-lg shadow-sm border border-slate-100 hover:bg-primary-600 hover:text-white transition-all"
                    title="Lancer la récolte"
                  >
                    <ArrowRight size={14} />
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
<<<<<<< HEAD

=======
>>>>>>> a9f1ddf04f884b977c71915d684ba0681cbb35f1
