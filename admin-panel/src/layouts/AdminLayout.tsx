import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  Tags, 
  MapPin, 
  Layers,
  Sprout,
  ShoppingCart,
  Settings, 
  HelpCircle, 
  LogOut,
  Menu,
  X,
  ChevronRight,
  Bell
} from 'lucide-react';
import { authService } from '../services/authService';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const notifications = [
    { id: 1, title: 'Nouvelle commande', message: 'Une nouvelle commande de Maïs Bio a été reçue.', time: 'Il y a 5 min', type: 'order' },
    { id: 2, title: 'Alerte stock', message: 'Le stock de bananes plantains est presque épuisé.', time: 'Il y a 1h', type: 'alert' },
    { id: 3, title: 'Nouveau message', message: 'Vous avez un nouveau message d\'un fournisseur.', time: 'Il y a 2h', type: 'message' },
  ];

  const menuItems = [
    { text: 'E-commerce & ERP', isHeader: true },
    { text: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { text: 'Utilisateurs', icon: Users, path: '/users' },
    { text: 'Catalogue Produits', icon: Package, path: '/products' },
    { text: 'Catégories', icon: Tags, path: '/categories' },
    { text: 'Zones Géographiques', icon: Layers, path: '/zones' },
    { text: 'Sites de Culture', icon: MapPin, path: '/sites' },
    { text: 'Suivi des Récoltes', icon: Sprout, path: '/harvests' },
    { text: 'Gestion des Ventes', icon: ShoppingCart, path: '/orders' },
    { text: 'Contenu Site Vitrine', isHeader: true },
    { text: 'Activités', icon: Sprout, path: '/activities' },
    { text: 'Projets', icon: Layers, path: '/projects' },
    { text: 'Médias (Galerie)', icon: LayoutDashboard, path: '/media' },
    { text: 'Actualités', icon: Tags, path: '/news' },
    { text: 'Compte & Sécurité', isHeader: true },
    { text: 'Mon Profil', icon: Settings, path: '/profile' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          <div className="p-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-500/20">
              <span className="text-xl font-bold">K</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 leading-none">KAROCHE</h1>
              <p className="text-[10px] font-bold text-primary-600 tracking-widest uppercase mt-1">Admin Panel</p>
            </div>
          </div>

          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {menuItems.map((item, index) => {
              if (item.isHeader) {
                return (
                  <div key={`header-${index}`} className="px-4 pt-5 pb-2">
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">{item.text}</p>
                  </div>
                );
              }

              const isActive = location.pathname === item.path;
              const Icon = item.icon as any;
              return (
                <Link
                  key={item.text}
                  to={item.path as string}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group
                    ${isActive 
                      ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20' 
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}
                  `}
                >
                  <Icon size={20} className={`${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-900'}`} />
                  {item.text}
                  {isActive && <ChevronRight size={16} className="ml-auto opacity-70" />}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center font-bold">
                {user?.firstName?.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">{user?.firstName}</p>
                <button onClick={handleLogout} className="text-[10px] text-red-500 hover:underline flex items-center gap-1 mt-0.5">
                  <LogOut size={10} /> Déconnexion
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg lg:hidden">
              <Menu size={24} />
            </button>
            <h2 className="text-lg font-bold text-slate-800 font-outfit">
              {menuItems.find(i => i.path === location.pathname)?.text || 'Administration'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className={`p-2 rounded-lg transition-colors relative ${isNotificationsOpen ? 'bg-primary-50 text-primary-600' : 'text-slate-400 hover:text-primary-600 hover:bg-slate-50'}`}
              >
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>

              {/* Notifications Dropdown */}
              {isNotificationsOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsNotificationsOpen(false)}></div>
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                      <h3 className="font-bold text-slate-900 text-sm">Notifications</h3>
                      <button className="text-[10px] font-bold text-primary-600 hover:underline">Tout marquer comme lu</button>
                    </div>
                    <div className="max-h-[350px] overflow-y-auto">
                      {notifications.map((notif) => (
                        <div key={notif.id} className="p-4 hover:bg-slate-50 border-b border-slate-50 transition-colors cursor-pointer group">
                          <div className="flex gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                              notif.type === 'order' ? 'bg-emerald-100 text-emerald-600' :
                              notif.type === 'alert' ? 'bg-red-100 text-red-600' :
                              'bg-blue-100 text-blue-600'
                            }`}>
                              {notif.type === 'order' ? <ShoppingCart size={18} /> :
                               notif.type === 'alert' ? <HelpCircle size={18} /> :
                               <Users size={18} />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-slate-900 group-hover:text-primary-600 transition-colors">{notif.title}</p>
                              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{notif.message}</p>
                              <p className="text-[9px] font-bold text-slate-400 mt-2 uppercase tracking-wider">{notif.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 bg-slate-50/50 text-center border-t border-slate-100">
                      <button className="text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors">Voir toutes les notifications</button>
                    </div>
                  </div>
                </>
              )}
            </div>
            <Link to="/profile" className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden border border-slate-200 hover:ring-2 hover:ring-primary-500 transition-all">
               <img src={`https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=random`} alt="avatar" />
            </Link>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
