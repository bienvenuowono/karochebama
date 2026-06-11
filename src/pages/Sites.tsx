import { useState, useEffect } from 'react';
import { MapPin, ArrowRight, Sprout, Building, Fish, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE } from '../api';

export default function Sites() {
  const [sites, setSites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSites = async () => {
      try {
        const response = await axios.get(`${API_BASE}/production/sites`);
        if (response.data?.success && Array.isArray(response.data?.data)) {
          const mapped = response.data.data.map((site: any) => {
            const nameLower = site.name.toLowerCase();
            let details = {
              description: 'Site de production moderne de Karochebama.',
              img: 'https://images.unsplash.com/photo-1592982537447-6f2a6a0c6c13?auto=format&fit=crop&w=1200&q=80',
              icon: Sprout,
              color: 'text-emerald-600',
              bgColor: 'bg-emerald-50',
            };

            if (nameLower.includes('ambam')) {
              details = {
                description: 'Notre plus grand site de production agricole, spécialisé dans les cultures vivrières et de rente avec des techniques agro-écologiques modernes.',
                img: 'https://images.unsplash.com/photo-1592982537447-6f2a6a0c6c13?auto=format&fit=crop&w=1200&q=80',
                icon: Sprout,
                color: 'text-emerald-600',
                bgColor: 'bg-emerald-50',
              };
            } else if (nameLower.includes('niété') || nameLower.includes('niete')) {
              details = {
                description: 'Complexe agro-industriel intégré comprenant des plantations d\'hévéa et une unité de première transformation.',
                img: 'https://images.unsplash.com/photo-1500937386664-56d1dfefcb0c?auto=format&fit=crop&w=1200&q=80',
                icon: Building,
                color: 'text-amber-600',
                bgColor: 'bg-amber-50',
              };
            } else if (nameLower.includes('kribi')) {
              details = {
                description: 'Bassins modernes d\'élevage de poissons d\'eau douce, garantissant une production saine et respectueuse de l\'environnement.',
                img: 'https://images.unsplash.com/photo-1511688878353-3a2f5be94cd7?auto=format&fit=crop&w=1200&q=80',
                icon: Fish,
                color: 'text-blue-600',
                bgColor: 'bg-blue-50',
              };
            }

            let products = site.products?.map((p: any) => p.product?.name) || [];
            if (products.length === 0) {
              if (nameLower.includes('ambam')) products = ['Banane Plantain', 'Macabo', 'Manioc'];
              else if (nameLower.includes('niété') || nameLower.includes('niete')) products = ['Hévéa', 'Cacao'];
              else if (nameLower.includes('kribi')) products = ['Tilapia', 'Silure'];
              else products = ['Agriculture', 'Élevage'];
            }

            return {
              id: site.id,
              name: site.name,
              description: details.description,
              location: site.geographicZone?.name || 'Cameroun',
              img: details.img,
              icon: details.icon,
              color: details.color,
              bgColor: details.bgColor,
              products
            };
          });
          setSites(mapped);
        }
      } catch (error) {
        console.error('Error fetching sites:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSites();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#f8f9fa] gap-3">
        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
        <p className="text-gray-500 font-medium">Chargement des sites de production...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#f8f9fa] min-h-screen font-sans pb-20">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200 py-20 px-4 sm:px-6 lg:px-8 mb-12">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6 border border-emerald-100">
            <MapPin className="h-4 w-4" />
            Nos Infrastructures
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
            Sites de production
          </h1>
          <p className="text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed">
            Découvrez nos différents sites de production répartis sur le territoire. Chaque site est optimisé pour des cultures ou des élevages spécifiques, garantissant la meilleure qualité possible.
          </p>
        </div>
      </div>

      {/* Sites Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {sites.map((site) => (
            <div 
              key={site.id} 
              className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col group hover:shadow-xl transition-all duration-300"
            >
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={site.img} 
                  alt={site.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  referrerPolicy="no-referrer" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent"></div>
                <div className={`absolute top-4 right-4 ${site.bgColor} ${site.color} p-3 rounded-2xl shadow-sm backdrop-blur-md bg-white/90`}>
                  <site.icon className="h-6 w-6" />
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center text-white/90 text-sm font-medium mb-2">
                    <MapPin className="h-4 w-4 mr-1.5" />
                    {site.location}
                  </div>
                  <h3 className="text-2xl font-bold text-white leading-tight">
                    {site.name}
                  </h3>
                </div>
              </div>
              
              <div className="p-8 flex flex-col flex-1">
                <p className="text-gray-600 mb-6 leading-relaxed flex-1">
                  {site.description}
                </p>
                
                <div className="mb-6">
                  <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">Produits associés</h4>
                  <div className="flex flex-wrap gap-2">
                    {site.products.map((product, idx) => (
                      <span key={idx} className="bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-lg">
                        {product}
                      </span>
                    ))}
                  </div>
                </div>
                
                <Link 
                  to={`/contact?site=${site.id}`}
                  className="inline-flex items-center justify-center w-full px-6 py-4 text-sm font-bold rounded-xl text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors group-hover:bg-emerald-600 group-hover:text-white"
                >
                  Nous contacter pour ce site
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
