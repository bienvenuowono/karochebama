import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  Tags, 
  MapPin, 
  Users, 
  MessageSquare,
  Calendar,
  Activity,
  ArrowRight,
  Mail,
  Phone,
  User,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Package,
  FileText,
  CheckCircle,
  Clock
} from 'lucide-react';
import axios from 'axios';
import { authService } from '../services/authService';
import Modal from '../components/Modal';
import InvoiceModal from '../components/InvoiceModal';

const Dashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reportType, setReportType] = useState<string | null>(null);
  const [orderTab, setOrderTab] = useState<'untreated' | 'treated'>('untreated');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = authService.getToken();
      const res = await axios.get('http://localhost:5001/api/v1/production/analytics/dashboard-stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(res.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessOrder = async (id: number) => {
    try {
      const token = authService.getToken();
      await axios.patch(`http://localhost:5001/api/v1/catalog/orders/${id}/status`, { isProcessed: true }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchStats();
    } catch (error) {
      console.error('Error processing order:', error);
    }
  };

  const handleSetPaid = async (id: number) => {
    try {
      const token = authService.getToken();
      await axios.patch(`http://localhost:5001/api/v1/catalog/orders/${id}/status`, { status: 'PAID', isProcessed: true }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchStats();
    } catch (error) {
      console.error('Error setting paid:', error);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-full"><Activity className="animate-spin text-primary-500" size={40} /></div>;

  const untreatedOrders = stats?.orders.list.filter((o: any) => !o.isProcessed) || [];
  const treatedOrders = stats?.orders.list.filter((o: any) => o.isProcessed) || [];

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 font-outfit tracking-tight">Vue d'ensemble</h1>
          <p className="text-slate-500 mt-1">Gérez votre exploitation et vos ventes en temps réel.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard title="Total Commandes" value={stats?.orders.total} icon={ShoppingCart} color="bg-blue-500" onClick={() => setReportType('orders')} />
        <StatCard title="Catégories" value={stats?.categories.total} icon={Tags} color="bg-orange-500" onClick={() => setReportType('categories')} />
        <StatCard title="Sites Actifs" value={stats?.sites.total} icon={MapPin} color="bg-emerald-500" onClick={() => setReportType('sites')} />
        <StatCard title="Total Clients" value={stats?.clients.total} icon={Users} color="bg-purple-500" onClick={() => setReportType('clients')} />
        <StatCard title="Messages" value={stats?.messages.total} icon={MessageSquare} color="bg-red-500" onClick={() => setReportType('messages')} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Activité Récente (Gauche) */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-slate-900 font-outfit">Activité Récente</h3>
            <div className="p-2 bg-slate-50 rounded-lg text-slate-400"><Activity size={20} /></div>
          </div>
          <div className="h-64 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 italic text-sm border-2 border-dashed border-slate-100">
             Graphique d'activité des récoltes...
          </div>
        </div>

        {/* COMMANDES RÉCENTES (Droite) */}
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900 font-outfit">Commandes</h3>
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button 
                onClick={() => setOrderTab('untreated')}
                className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all ${orderTab === 'untreated' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500'}`}
              >
                À traiter ({untreatedOrders.length})
              </button>
              <button 
                onClick={() => setOrderTab('treated')}
                className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all ${orderTab === 'treated' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500'}`}
              >
                Traitées
              </button>
            </div>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto no-scrollbar max-h-[400px]">
            {(orderTab === 'untreated' ? untreatedOrders : treatedOrders).map((order: any) => (
              <div key={order.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-primary-200 transition-all">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-400 font-bold text-[10px]">
                      {order.user?.firstName?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">{order.user?.firstName} {order.user?.lastName}</p>
                      <p className="text-[10px] text-slate-400 font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${order.status === 'PAID' ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'}`}>
                    {order.status}
                  </span>
                </div>
                
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-200/50">
                  <p className="text-xs font-black text-slate-900">{Number(order.totalAmount).toLocaleString()} FCFA</p>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => { setSelectedOrder(order); setIsInvoiceOpen(true); }}
                      className="p-1.5 bg-white text-slate-400 hover:text-primary-600 rounded-lg border border-slate-100 shadow-sm"
                      title="Voir Facture"
                    >
                      <FileText size={14} />
                    </button>
                    {!order.isProcessed && (
                      <button 
                        onClick={() => handleProcessOrder(order.id)}
                        className="p-1.5 bg-white text-slate-400 hover:text-blue-600 rounded-lg border border-slate-100 shadow-sm"
                        title="Marquer comme contacté"
                      >
                        <Clock size={14} />
                      </button>
                    )}
                    {order.status !== 'PAID' && (
                      <button 
                        onClick={() => handleSetPaid(order.id)}
                        className="p-1.5 bg-white text-slate-400 hover:text-emerald-600 rounded-lg border border-slate-100 shadow-sm"
                        title="Valider le paiement"
                      >
                        <CheckCircle size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {(orderTab === 'untreated' ? untreatedOrders : treatedOrders).length === 0 && (
              <div className="text-center py-10">
                <Package size={32} className="mx-auto text-slate-100 mb-2" />
                <p className="text-[10px] text-slate-400 italic font-medium">Aucune commande dans cette liste.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL DE RAPPORTS */}
      <Modal isOpen={!!reportType} onClose={() => setReportType(null)} title="Détails du Rapport">
        <div className="p-4 text-center italic text-slate-400">Chargement des données détaillées...</div>
      </Modal>

      <InvoiceModal isOpen={isInvoiceOpen} onClose={() => setIsInvoiceOpen(false)} order={selectedOrder} />
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color, onClick }: any) => (
  <button onClick={onClick} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group text-left w-full">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-2xl ${color} text-white shadow-lg`}><Icon size={24} /></div>
      <div className="p-1.5 bg-slate-50 text-slate-400 rounded-lg group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors"><ArrowRight size={16} /></div>
    </div>
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{title}</p>
    <h3 className="text-3xl font-black text-slate-900 mt-1 font-outfit">{value}</h3>
  </button>
);

export default Dashboard;
