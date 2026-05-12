import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, 
  Search, 
  Calendar, 
  TrendingUp, 
  ShoppingBag, 
  Clock, 
  Globe, 
  Phone,
  Activity,
  ArrowRight,
  ChevronRight,
  Package,
  History
} from 'lucide-react';
import axios from 'axios';
import { authService } from '../services/authService';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';

const CustomerAuditPage = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = authService.getToken();
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get('http://localhost:5001/api/v1/catalog/orders', config);
      setOrders(response.data?.data || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  // Grouper les commandes par client (en utilisant le téléphone comme identifiant unique)
  const customers = useMemo(() => {
    const customerMap = new Map();

    orders.forEach((order) => {
      const phone = order.customerPhone || order.user?.phone || 'ANONYME';
      const name = order.customerName || (order.user ? `${order.user.firstName} ${order.user.lastName}` : 'Client Inconnu');
      const email = order.customerEmail || order.user?.email || 'N/A';
      const country = order.customerCountry || 'N/A';
      const whatsapp = order.customerWhatsapp || 'N/A';

      if (!customerMap.has(phone)) {
        customerMap.set(phone, {
          phone,
          name,
          email,
          country,
          whatsapp,
          orders: [],
          totalSpent: 0,
          totalKg: 0,
        });
      }

      const clientData = customerMap.get(phone);
      clientData.orders.push(order);
      clientData.totalSpent += Number(order.totalAmount || 0);
      
      // Calculer le volume en KG
      if (order.items) {
        order.items.forEach((item: any) => {
          clientData.totalKg += Number(item.quantity || 0);
        });
      }
    });

    return Array.from(customerMap.values()).map(client => {
      // Trier les commandes par date pour les intervalles
      const sortedOrders = [...client.orders].sort((a, b) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

      // Calculer les intervalles moyens (en jours)
      let avgInterval = 0;
      if (sortedOrders.length > 1) {
        const totalInterval = sortedOrders.reduce((acc, curr, idx) => {
          if (idx === 0) return 0;
          const prev = sortedOrders[idx - 1];
          const diff = new Date(curr.createdAt).getTime() - new Date(prev.createdAt).getTime();
          return acc + diff;
        }, 0);
        avgInterval = totalInterval / (sortedOrders.length - 1) / (1000 * 3600 * 24);
      }

      return {
        ...client,
        orderCount: client.orders.length,
        avgInterval: avgInterval.toFixed(1),
        lastOrder: sortedOrders[sortedOrders.length - 1]?.createdAt,
        firstOrder: sortedOrders[0]?.createdAt
      };
    });
  }, [orders]);

  const filteredCustomers = useMemo(() => {
    return customers.filter(c => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [customers, searchTerm]);

  const columns = [
    { 
      id: 'name', 
      label: 'Client',
      format: (val: string, row: any) => (
        <button 
          onClick={() => { setSelectedCustomer(row); setIsDetailsOpen(true); }}
          className="flex items-center gap-3 text-left hover:text-primary-600 transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold">
            {val.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-black text-slate-900">{val}</p>
            <p className="text-[10px] text-slate-400">{row.email}</p>
          </div>
        </button>
      )
    },
    { 
      id: 'country', 
      label: 'Pays',
      format: (val: string) => (
        <span className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
          <Globe size={14} className="text-blue-500" />
          {val}
        </span>
      )
    },
    { 
      id: 'orderCount', 
      label: 'Fréquence',
      format: (val: number) => (
        <div className="flex flex-col">
          <span className="text-xs font-black text-slate-900">{val} commandes</span>
          <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Fidélité active</span>
        </div>
      )
    },
    { 
      id: 'totalSpent', 
      label: 'Volume Achat',
      format: (val: number) => (
        <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg font-black text-xs">
          {val.toLocaleString()} FCFA
        </span>
      )
    },
    { 
      id: 'actions', 
      label: 'Audit',
      format: (_: any, row: any) => (
        <button 
          onClick={() => { setSelectedCustomer(row); setIsDetailsOpen(true); }}
          className="p-2 bg-primary-50 text-primary-600 rounded-xl hover:bg-primary-600 hover:text-white transition-all"
        >
          <ArrowRight size={16} />
        </button>
      )
    }
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 font-outfit tracking-tight">Audit Clients</h1>
          <p className="text-sm text-slate-500 mt-1">Analyse approfondie du comportement et de la fidélité client.</p>
        </div>
        
        <div className="w-full md:w-96 flex items-center gap-3 bg-white px-4 py-3 rounded-2xl border border-slate-200 shadow-sm focus-within:ring-2 focus-within:ring-primary-500/20 transition-all">
          <Search size={18} className="text-slate-400" />
          <input 
            type="text" 
            placeholder="Rechercher un client (nom, tél, email)..." 
            className="flex-1 bg-transparent outline-none text-sm font-medium text-slate-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
            <Users size={24} />
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Base Clients Active</p>
          <h3 className="text-2xl font-black text-slate-900 mt-1 font-outfit">{customers.length} Clients</h3>
        </div>
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-4">
            <Activity size={24} />
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Fréquence Moyenne</p>
          <h3 className="text-2xl font-black text-slate-900 mt-1 font-outfit">
            {(customers.reduce((acc, curr) => acc + curr.orderCount, 0) / (customers.length || 1)).toFixed(1)} cmd / client
          </h3>
        </div>
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-4">
            <Package size={24} />
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Volume Total Expédié</p>
          <h3 className="text-2xl font-black text-slate-900 mt-1 font-outfit">
            {customers.reduce((acc, curr) => acc + curr.totalKg, 0).toLocaleString()} KG
          </h3>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
        <DataTable columns={columns} data={filteredCustomers} loading={loading} />
      </div>

      {/* Modal Détails Audit */}
      <Modal 
        isOpen={isDetailsOpen} 
        onClose={() => setIsDetailsOpen(false)} 
        title={`Audit Détaillé : ${selectedCustomer?.name}`}
        size="4xl"
      >
        {selectedCustomer && (
          <div className="space-y-8">
            {/* Header Info */}
            <div className="flex items-center gap-6 p-6 bg-slate-50 rounded-[32px] border border-slate-100">
              <div className="w-20 h-20 rounded-[24px] bg-white flex items-center justify-center text-primary-600 font-black text-3xl shadow-sm">
                {selectedCustomer.name.charAt(0)}
              </div>
              <div>
                <h4 className="text-xl font-black text-slate-900">{selectedCustomer.name}</h4>
                <div className="flex flex-wrap gap-3 mt-2">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200">
                    <Phone size={12} className="text-emerald-500" /> {selectedCustomer.phone}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200">
                    <Globe size={12} className="text-blue-500" /> {selectedCustomer.country}
                  </span>
                  {selectedCustomer.whatsapp !== 'N/A' && (
                    <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                      <Activity size={12} /> WhatsApp: {selectedCustomer.whatsapp}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Grid for Stats and Timeline */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column: Stats */}
              <div className="space-y-6">
                <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                  <Activity size={14} /> Indicateurs de performance
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-5 bg-white border border-slate-100 rounded-3xl shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                        <TrendingUp size={16} />
                      </div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fréquence</span>
                    </div>
                    <p className="text-2xl font-black text-slate-900">{selectedCustomer.orderCount} Commandes</p>
                    <p className="text-xs text-slate-500 mt-1 font-medium">Intervalle moyen : {selectedCustomer.avgInterval} jours</p>
                  </div>

                  <div className="p-5 bg-white border border-slate-100 rounded-3xl shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
                        <ShoppingBag size={16} />
                      </div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Volume Achat</span>
                    </div>
                    <p className="text-2xl font-black text-slate-900">{selectedCustomer.totalSpent.toLocaleString()} FCFA</p>
                    <p className="text-xs text-slate-500 mt-1 font-medium">Volume total : {selectedCustomer.totalKg.toLocaleString()} KG</p>
                  </div>
                </div>

                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                  <h6 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Notes d'Audit</h6>
                  <p className="text-xs text-slate-600 leading-relaxed italic">
                    Ce client présente une {selectedCustomer.avgInterval < 15 ? 'forte' : 'moyenne'} récurrence d'achat. 
                    {selectedCustomer.totalKg > 100 ? ' C\'est un client à fort volume logistique.' : ' Ses commandes sont régulières et stables.'}
                  </p>
                </div>
              </div>

              {/* Right Column: Timeline */}
              <div className="space-y-4">
                <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                  <History size={14} /> Historique des commandes
                </h5>
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {selectedCustomer.orders.map((order: any, idx: number) => (
                    <div key={idx} className="p-4 bg-white rounded-2xl border border-slate-100 flex justify-between items-center group hover:border-primary-100 transition-all shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-primary-600 transition-colors">
                          <Package size={20} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">Commande #{order.id}</p>
                          <p className="text-[10px] text-slate-500 font-medium">{new Date(order.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-slate-900">{Number(order.totalAmount).toLocaleString()} FCFA</p>
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                          order.status === 'PAID' ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'
                        }`}>
                          {order.status === 'PAID' ? 'Payée' : 'En attente'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button 
              onClick={() => setIsDetailsOpen(false)}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20"
            >
              Fermer l'audit
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CustomerAuditPage;
