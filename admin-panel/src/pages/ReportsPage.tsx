import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart as PieChartIcon, 
  Download, 
  Calendar, 
  Filter,
  ArrowUpRight,
  Target,
  Award,
  ChevronDown,
  Activity
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import axios from 'axios';
import { authService } from '../services/authService';

const ReportsPage = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = authService.getToken();
      const res = await axios.get('http://localhost:5001/api/v1/production/reporting/financial-summary', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(res.data.data);
    } catch (error) {
      console.error('Error fetching reporting data:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444'];

  if (loading) return <div className="flex items-center justify-center h-full"><Activity className="animate-spin text-primary-500" size={40} /></div>;

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 font-outfit tracking-tight">Analytique & Rapports</h1>
          <p className="text-sm text-slate-500 mt-1">Analyse approfondie des performances financières et productives.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 flex items-center gap-2 shadow-sm">
            <Download size={16} /> Exporter PDF
          </button>
          <button className="px-4 py-2 bg-primary-500 text-white rounded-xl text-xs font-bold hover:bg-primary-600 flex items-center gap-2 shadow-lg shadow-primary-500/25">
            <Calendar size={16} /> Ce Mois-ci <ChevronDown size={14} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* CHART 1 : CROISSANCE DU CA */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-bold text-slate-900 font-outfit">Croissance du Chiffre d'Affaires</h3>
              <p className="text-xs text-slate-400 mt-1">Évolution mensuelle des ventes payées (6 derniers mois).</p>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl"><TrendingUp size={24} /></div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.monthlySales}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                <Area type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 2 : TOP PRODUITS */}
        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-slate-900 font-outfit">Top Variétés</h3>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><Target size={24} /></div>
          </div>
          <div className="space-y-6">
            {data?.topProducts.map((p: any, idx: number) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-xs font-black text-slate-400">
                  #{idx + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-900">{p.name || 'Produit'}</p>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2">
                    <div 
                      className="h-full bg-blue-500 rounded-full" 
                      style={{ width: `${(p.quantity / data.topProducts[0].quantity) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black text-slate-900">{p.quantity}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Vendus</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-10 py-3 bg-slate-50 text-slate-600 rounded-2xl text-xs font-bold hover:bg-slate-100 transition-all">
            Voir tout le classement
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Panier Moyen" value="45,000 FCFA" trend="+5%" icon={BarChart3} />
        <MetricCard title="Rendement Moyen" value="88%" trend="+2.4%" icon={Activity} />
        <MetricCard title="Fidélité Client" value="64%" trend="+12%" icon={Award} />
        <MetricCard title="CA Prévisionnel" value="1.2M FCFA" trend="Stable" icon={PieChartIcon} />
      </div>
    </div>
  );
};

const MetricCard = ({ title, value, trend, icon: Icon }: any) => (
  <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-all">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-slate-50 text-slate-400 rounded-xl group-hover:text-primary-500 transition-colors">
        <Icon size={20} />
      </div>
      <div className="flex items-center gap-1 text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">
        <ArrowUpRight size={12} /> {trend}
      </div>
    </div>
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{title}</p>
    <h3 className="text-xl font-black text-slate-900 mt-1 font-outfit">{value}</h3>
  </div>
);

export default ReportsPage;

