import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Fish, Truck, Factory, Beef, Store, ArrowRight, Mail, Loader2 } from 'lucide-react';
import axios from 'axios';

export default function Activities() {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5001/api/v1/activities');
      setActivities(response.data);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  // Map des icônes par défaut si besoin
  const getIcon = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes('agricole')) return Sprout;
    if (t.includes('pisciculture') || t.includes('poisson')) return Fish;
    if (t.includes('industrie') || t.includes('transformation')) return Factory;
    if (t.includes('distribution') || t.includes('logistique')) return Truck;
    if (t.includes('élevage') || t.includes('animal')) return Beef;
    if (t.includes('marketplace') || t.includes('boutique')) return Store;
    return Sprout;
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen font-sans pb-20">
      
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200 py-20 px-4 sm:px-6 lg:px-8 mb-12">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6 border border-emerald-100">
            <Sprout className="h-4 w-4" />
            Notre Expertise
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
            Activités
          </h1>
          <p className="text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed">
            Découvrez nos grands pôles d’expertise au service d’une agriculture durable, innovante et performante. Chez Karochebama, nous couvrons l'ensemble de la chaîne de valeur agro-pastorale.
          </p>
        </div>
      </div>

      {/* Activities List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mb-4" />
            <p className="text-gray-500 font-medium">Chargement des activités...</p>
          </div>
        ) : activities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {activities.map((activity) => (
              <Link 
                key={activity.id} 
                to={`/nos-activites/${activity.id}`}
                className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col sm:flex-row group hover:shadow-xl hover:-translate-y-1 transition-all duration-500"
              >
                {/* Image Area - Left side on Desktop */}
                <div className="relative w-full sm:w-48 md:w-56 h-48 sm:h-auto overflow-hidden bg-gray-100 shrink-0">
                  <img 
                    src={activity.imageUrl ? (activity.imageUrl.startsWith('http') ? activity.imageUrl : `http://localhost:5001${activity.imageUrl}`) : 'https://images.unsplash.com/photo-1592982537447-6f2a6a0c6c13?auto=format&fit=crop&w=800&q=80'} 
                    alt={activity.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    referrerPolicy="no-referrer" 
                  />
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors"></div>
                </div>
                
                {/* Content Area - Right side on Desktop */}
                <div className="p-6 md:p-8 flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-4 bg-emerald-500 rounded-full"></div>
                      <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">Division Karochebama</span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-extrabold text-gray-900 mb-4 leading-tight group-hover:text-emerald-600 transition-colors">
                      {activity.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-2">
                      {activity.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <Sprout size={12} />
                      </div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Expertise</span>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      Lire la suite <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <p className="text-gray-500 text-lg">Aucune activité répertoriée pour le moment.</p>
          </div>
        )}
      </div>

      {/* Call to Action Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#1a2b3c] rounded-[2.5rem] overflow-hidden shadow-2xl relative">
          <div className="absolute inset-0 opacity-10">
            <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M0 40L40 0H20L0 20M40 40V20L20 40" stroke="currentColor" strokeWidth="2" fill="none"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid-pattern)"/>
            </svg>
          </div>
          
          <div className="relative p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="max-w-2xl text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
                Prêt à collaborer avec nous ?
              </h2>
              <p className="text-lg text-gray-400">
                Que vous souhaitiez explorer notre marketplace, devenir partenaire ou simplement nous contacter pour un projet, notre équipe est à votre disposition.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto shrink-0">
              <Link 
                to="/marketplace"
                className="inline-flex items-center justify-center px-6 py-4 text-sm font-bold rounded-xl text-gray-900 bg-white hover:bg-gray-100 shadow-lg transition-all hover:-translate-y-0.5"
              >
                <Store className="mr-2 h-5 w-5" />
                Marketplace
              </Link>
              <Link 
                to="/contact"
                className="inline-flex items-center justify-center px-6 py-4 text-sm font-bold rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg transition-all hover:-translate-y-0.5"
              >
                <Mail className="mr-2 h-5 w-5" />
                Nous contacter
              </Link>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
