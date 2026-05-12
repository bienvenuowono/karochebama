import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShoppingCart, 
  DollarSign, 
  User, 
  Package, 
  Calendar, 
  FileText, 
  CheckCircle, 
  Clock,
  Filter,
  Search,
  ArrowUpRight,
  AlertTriangle,
  ChevronRight,
  TrendingUp,
  XCircle,
  Activity,
  Globe,
  Phone
} from 'lucide-react';
import axios from 'axios';
import { authService } from '../services/authService';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import InvoiceModal from '../components/InvoiceModal';

const OrdersPage = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = authService.getToken();
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      // Utilisation de allSettled pour ne pas tout bloquer si une API échoue
      const responses = await Promise.allSettled([
        axios.get('http://localhost:5001/api/v1/catalog/orders', config),
        axios.get('http://localhost:5001/api/v1/catalog/products', config),
        axios.get('http://localhost:5001/api/v1/users', config)
      ]);

      const [oRes, pRes, uRes] = responses.map(r => r.status === 'fulfilled' ? (r as any).value : { data: { data: [] } });

      setOrders(Array.isArray(oRes.data?.data) ? oRes.data.data : []);
      setProducts(pRes.data?.data?.items || (Array.isArray(pRes.data?.data) ? pRes.data.data : []));
      setUsers(Array.isArray(uRes.data?.data) ? uRes.data.data : []);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: number, updates: any) => {
    try {
      const token = authService.getToken();
      await axios.patch(`http://localhost:5001/api/v1/catalog/orders/${id}/status`, updates, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  // CALCULS COMMERCIAUX SÉCURISÉS
  const stats = useMemo(() => {
    if (!Array.isArray(orders)) return { totalRevenue: 0, totalSold: 0, remainingStock: 0, orderCount: 0 };
    
    const paidOrders = orders.filter((o: any) => o?.status === 'PAID');
    const totalRevenue = paidOrders.reduce((acc, curr: any) => acc + Number(curr?.totalAmount || 0), 0);
    
    const totalSold = paidOrders.reduce((acc, curr: any) => {
      const items = Array.isArray(curr?.items) ? curr.items : [];
      return acc + items.reduce((sum: number, item: any) => sum + (item?.quantity || 0), 0);
    }, 0);
    
    const remainingStock = Array.isArray(products) ? products.reduce((acc, curr: any) => acc + (curr?.stock || 0), 0) : 0;
    
    return { totalRevenue, totalSold, remainingStock, orderCount: orders.length };
  }, [orders, products]);

  const filteredOrders = useMemo(() => {
    if (!Array.isArray(orders)) return [];
    return orders.filter((o: any) => {
      const matchesStatus = filterStatus === 'ALL' || o?.status === filterStatus;
      const fullName = (o?.customerName || `${o?.user?.firstName || ''} ${o?.user?.lastName || ''}`).toLowerCase();
      const matchesSearch = fullName.includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [orders, filterStatus, searchTerm]);

  const columns = [
    { 
      id: 'createdAt', 
      label: 'Date & Facture',
      format: (val: string) => (
        <div className="flex flex-col">
          <span className="text-xs font-bold text-slate-900">{val ? new Date(val).toLocaleDateString() : 'N/A'}</span>
          <span className="text-[10px] text-primary-600 font-medium">#FAC-{val ? new Date(val).getTime() : '---'}</span>
        </div>
      )
    },
    { 
      id: 'customerName', 
      label: 'Client',
      format: (_: any, row: any) => {
        const name = row.customerName || (row.user ? `${row.user.firstName} ${row.user.lastName}` : 'Client Anonyme');
        const phone = row.customerPhone || row.user?.phone || 'N/A';
        const whatsapp = row.customerWhatsapp || 'N/A';
        const country = row.customerCountry || 'Cameroun';
        const email = row.customerEmail || row.user?.email || 'N/A';
        
        return (
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-[10px]">
                {name.charAt(0)}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">{name}</p>
                <p className="text-[10px] text-slate-400">{email}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-1">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md text-[9px] font-bold">
                <Globe size={10} /> {country}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-md text-[9px] font-bold">
                <Phone size={10} /> {phone}
              </span>
              {whatsapp !== 'N/A' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-600 rounded-md text-[9px] font-bold">
                  <Activity size={10} /> WhatsApp: {whatsapp}
                </span>
              )}
            </div>
          </div>
        );
      }
    },
    { 
      id: 'items', 
      label: 'Articles',
      format: (items: any[]) => (
        <div className="flex flex-col gap-1">
          {Array.isArray(items) && items.length > 0 ? items.map((item: any, idx: number) => (
            <div key={idx} className="text-[10px] font-medium text-slate-500">
              {item?.quantity}x {item?.product?.name || 'Produit inconnu'}
            </div>
          )) : <span className="text-[10px] text-slate-300 italic">Aucun article</span>}
        </div>
      )
    },
    { 
      id: 'totalAmount', 
      label: 'Montant',
      align: 'right' as const,
      format: (val: number) => <span className="font-black text-slate-900">{Number(val || 0).toLocaleString()} <span className="text-[10px]">FCFA</span></span>
    },
    { 
      id: 'status', 
      label: 'État',
      format: (val: string, row: any) => (
        <select 
          value={val} 
          onChange={(e) => handleUpdateStatus(row.id, { status: e.target.value })}
          className={`px-3 py-1 text-[10px] font-bold rounded-lg border outline-none
            ${val === 'PAID' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
              val === 'PENDING' ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-red-50 text-red-500 border-red-100'}
          `}
        >
          <option value="PAID">Payée</option>
          <option value="PENDING">En attente</option>
          <option value="CANCELLED">Annulée</option>
        </select>
      )
    },
    {
      id: 'actions',
      label: 'Traitement',
      format: (_: any, row: any) => (
        <div className="flex items-center gap-2">
          <button 
            onClick={() => handleUpdateStatus(row.id, { isProcessed: !row.isProcessed })}
            className={`p-2 rounded-xl transition-all flex items-center gap-2 text-[10px] font-bold
              ${row?.isProcessed ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-400'}
            `}
          >
            {row?.isProcessed ? <CheckCircle size={14} /> : <Clock size={14} />}
            {row?.isProcessed ? 'Traité' : 'À traiter'}
          </button>
          <button 
            onClick={() => { setSelectedOrder(row); setIsInvoiceOpen(true); }}
            className="p-2 bg-slate-100 text-slate-400 hover:bg-primary-50 rounded-xl"
          >
            <FileText size={16} />
          </button>
        </div>
      )
    }
  ];

  if (loading) return <div className="flex items-center justify-center h-64"><Activity className="animate-spin text-primary-500" /></div>;

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:hidden">
        <div>
          <h1 className="text-3xl font-black text-slate-900 font-outfit tracking-tight">Gestion des Ventes</h1>
          <p className="text-sm text-slate-500 mt-1">Pilotage commercial et suivi des stocks.</p>
        </div>
        <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
           {['ALL', 'PENDING', 'PAID'].map((s) => (
             <button 
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filterStatus === s ? 'bg-primary-500 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
             >
               {s === 'ALL' ? 'Toutes' : s === 'PENDING' ? 'En attente' : 'Payées'}
             </button>
           ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 print:hidden">
        <StatCard title="Chiffre d'Affaires" value={`${stats.totalRevenue.toLocaleString()} FCFA`} icon={TrendingUp} color="bg-emerald-500" sub="Ventes payées" />
        <StatCard title="Produits Vendus" value={stats.totalSold} icon={ShoppingCart} color="bg-blue-500" sub="Total articles" />
        <StatCard title="Commandes" value={stats.orderCount} icon={Package} color="bg-orange-500" sub="Toutes périodes" />
        <StatCard title="Stock Disponible" value={`${stats.remainingStock} KG`} icon={Activity} color="bg-purple-500" sub="Inventaire actuel" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 print:hidden">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <Search className="text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Rechercher un client..." 
              className="flex-1 text-sm outline-none font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <DataTable columns={columns} data={filteredOrders} loading={loading} />
        </div>

        {/* Stock Panel */}
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm h-fit">
          <h3 className="text-xl font-bold text-slate-900 font-outfit mb-8">État des Stocks</h3>
          <div className="space-y-6">
            {Array.isArray(products) && products.length > 0 ? products.map((p: any) => (
              <div key={p?.id} className="group">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-slate-700">{p?.name || 'Inconnu'}</span>
                  <span className={`text-xs font-black ${(p?.stock || 0) < 50 ? 'text-red-500' : 'text-slate-400'}`}>
                    {p?.stock || 0} KG
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${(p?.stock || 0) < 50 ? 'bg-red-500' : 'bg-emerald-500'}`}
                    style={{ width: `${Math.min(((p?.stock || 0) / 500) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            )) : <p className="text-xs text-slate-400 italic">Aucun produit en stock.</p>}
          </div>
        </div>
      </div>

      <InvoiceModal isOpen={isInvoiceOpen} onClose={() => setIsInvoiceOpen(false)} order={selectedOrder} />
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color, sub }: any) => (
  <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
    <div className={`w-10 h-10 rounded-xl ${color} text-white flex items-center justify-center mb-4`}>
      <Icon size={20} />
    </div>
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{title}</p>
    <h3 className="text-xl font-black text-slate-900 mt-1 font-outfit">{value}</h3>
    <p className="text-[10px] text-slate-400 font-medium mt-1">{sub}</p>
  </div>
);

export default OrdersPage;

