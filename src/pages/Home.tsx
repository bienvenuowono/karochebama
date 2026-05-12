import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  CheckCircle2, 
  Truck, 
  ShieldCheck, 
  Search, 
  ArrowRight, 
  ShoppingCart,
  MapPin,
  Users,
  Sprout,
  Globe,
  Leaf,
  Store,
  ChevronRight
} from 'lucide-react';
import SEO from '../components/SEO';

export default function Home() {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [sites, setSites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSite, setSelectedSite] = useState('');

  const stats = [
    { value: '10+', label: 'sites agricoles', img: 'https://images.unsplash.com/photo-1592982537447-6f2a6a0a3023?auto=format&fit=crop&w=100&q=80' },
    { value: '50 000+', label: 'variétés', img: 'https://images.unsplash.com/photo-1590682680695-43b964a3ae17?auto=format&fit=crop&w=100&q=80' },
    { value: '25+', label: 'sites couverts', img: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=100&q=80' },
    { value: '100%', label: 'commerce sécurisé', img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=100&q=80' },
  ];

  const categories = [
    { name: 'Produits Agricoles', img: '/agri-bg.png' },
    { name: 'Produits Piscicoles', img: '/fish-bg.png' },
  ];

  useEffect(() => {
    fetchProducts();
    fetchSites();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5001/api/v1/catalog/products');
      setFeaturedProducts(response.data.data.slice(0, 8));
    } catch (error) {
      console.error('Error fetching products:', error);
      setFeaturedProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSites = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/v1/production/sites');
      setSites(response.data.data);
    } catch (error) {
      console.error('Error fetching sites:', error);
    }
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.append('q', searchQuery);
    if (selectedSite) params.append('site', selectedSite);
    navigate(`/marketplace?${params.toString()}`);
  };

  const howItWorks = [
    { icon: Store, title: '1. Créez un compte', desc: 'Inscrivez-vous en tant qu\'agriculteur pour lister vos produits ou en tant qu\'acheteur pour vous approvisionner directement.' },
    { icon: Search, title: '2. Découvrez & Connectez', desc: 'Parcourez des milliers de produits agricoles, filtrez par lieu et contactez les fournisseurs.' },
    { icon: Truck, title: '3. Négociez & Échangez', desc: 'Discutez des quantités, négociez les prix et organisez la logistique en toute sécurité sur la plateforme.' },
  ];

  return (
    <div className="bg-white min-h-screen font-sans">
      <SEO 
        title="Accueil" 
        description="Karochebama : leader de l'agro-industrie et de la pisciculture durable au Cameroun. Explorez nos produits et projets agricoles."
      />
      
      {/* 1. Hero Section */}
      <div className="relative h-[650px] w-full overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="/hero-bg.jpg" 
            alt="Agricultural Fields" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-[1px]"></div>
        </div>
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center">
          <div className="inline-flex items-center gap-2 border border-emerald-400/30 bg-emerald-500/20 backdrop-blur-md text-emerald-100 text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6">
            <Leaf className="h-4 w-4" />
            LE PREMIER MARCHÉ AGRO-INDUSTRIEL
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6 max-w-4xl drop-shadow-lg">
            KAROCHEBAMA
          </h1>
          <div className="text-xl text-gray-200 mb-10 max-w-3xl space-y-4">
            <p>
              Entreprise camerounaise engagée dans le développement de l’agriculture moderne, de l’agro-industrie et de la pisciculture durable.
            </p>
            <p>
              Implantée au cœur des bassins de production du Cameroun, KAROCHEBAMA développe des projets intégrés et à forte valeur ajoutée dans des filières clés telles que le plantain, l’hévéa et le macabo, Aquacultutre/Pisciculture Continentale.
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="w-full max-w-3xl bg-white p-2 rounded-2xl shadow-2xl flex flex-col sm:flex-row gap-2 mb-8">
            <div className="flex-1 flex items-center px-4 bg-gray-50 rounded-xl border border-gray-100">
              <Search className="h-5 w-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Que recherchez-vous ? (ex: Maïs, Avocats)" 
                className="w-full bg-transparent border-none focus:ring-0 px-3 py-4 text-gray-700 placeholder-gray-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <div className="sm:w-48 flex items-center px-4 bg-gray-50 rounded-xl border border-gray-100">
              <MapPin className="h-5 w-5 text-gray-400" />
              <select 
                className="w-full bg-transparent border-none focus:ring-0 px-2 py-4 text-gray-700 text-sm"
                value={selectedSite}
                onChange={(e) => setSelectedSite(e.target.value)}
              >
                <option value="">Tous les sites</option>
                {sites.map(site => (
                  <option key={site.id} value={site.name}>{site.name}</option>
                ))}
              </select>
            </div>
            <button 
              onClick={handleSearch}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-4 rounded-xl transition-colors whitespace-nowrap"
            >
              Rechercher
            </button>
          </div>

          <div className="flex gap-4">
            <Link 
              to="/devenir-partenaire"
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-bold rounded-xl text-white bg-white/10 hover:bg-white/20 border border-white/30 backdrop-blur-md transition-all"
            >
              Devenir partenaire
            </Link>
            <Link 
              to="/marketplace"
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-bold rounded-xl text-gray-900 bg-white hover:bg-gray-100 transition-all"
            >
              Explorer les Produits
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Trust Section (Stats) */}
      <div className="border-b border-gray-100 bg-white py-12 relative -mt-8 z-10 max-w-6xl mx-auto rounded-3xl shadow-xl">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-gray-100">
            {stats.map((stat, i) => (
              <div key={i} className="flex flex-col items-center text-center px-4">
                <div className="mb-4 relative">
                  <div className="absolute inset-0 bg-emerald-100 rounded-full scale-110 opacity-50"></div>
                  <img 
                    src={stat.img} 
                    alt={stat.label} 
                    className="h-14 w-14 object-cover rounded-full border-2 border-white shadow-sm relative z-10"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="text-3xl font-extrabold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm font-medium text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Activités */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Activités</h2>
            <p className="text-gray-500">Découvrez notre large gamme de produits agricoles</p>
          </div>
          <Link to="/nos-activites" className="text-emerald-600 font-bold hover:text-emerald-700 flex items-center text-sm">
            Voir tout <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((cat, i) => (
            <Link to={`/marketplace?category=${cat.name}`} key={i} className="group relative h-64 rounded-2xl overflow-hidden block">
              <img src={cat.img} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6 w-full text-center">
                <h3 className="text-2xl font-bold text-white">{cat.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 4. Featured Products (Marketplace Preview) */}
      <div className="bg-gray-50 py-20 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Produits en vedette</h2>
              <p className="text-gray-500">Des produits de première qualité provenant de fournisseurs vérifiés</p>
            </div>
            <Link to="/marketplace" className="bg-white hover:bg-gray-100 text-gray-900 border border-gray-200 px-4 py-2 rounded-lg font-medium transition-colors flex items-center text-sm shadow-sm">
              Voir la boutique <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-10">Chargement des produits...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all group flex flex-col">
                  <div className="relative h-56 overflow-hidden bg-gray-100 p-0">
                    <div className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-md text-emerald-700 text-[11px] font-bold px-3 py-1.5 rounded-full shadow-sm">
                      {product.category?.name || 'Général'}
                    </div>
                    <img src={product.imageUrl ? (product.imageUrl.startsWith('http') ? product.imageUrl : `http://localhost:5001${product.imageUrl}`) : 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80'} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                  </div>
                  
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="font-extrabold text-gray-900 text-xl mb-2 line-clamp-1">{product.name}</h3>
                    
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2 min-h-[40px]">
                      {product.description || 'Produit de qualité supérieure cultivé avec soin dans nos plantations et fermes.'}
                    </p>
                    
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <MapPin className="h-4 w-4 mr-2 text-emerald-600" />
                      <span>{product.productionSite?.location || 'Cameroun'}</span>
                    </div>

                    <div className="text-[11px] font-bold uppercase tracking-wider mb-5 text-emerald-700">
                      Disponibilité: {product.status === 'active' ? 'En Stock' : (product.status === 'en_production' ? 'En Production' : 'Disponible')}
                    </div>
                    
                    <div className="bg-[#f8f9fa] border border-gray-100 rounded-2xl p-4 mb-4 mt-auto">
                      <div className="text-xl font-extrabold text-gray-900 text-center">
                        {product.price.toLocaleString('fr-FR')} CFA <span className="text-sm font-medium text-gray-400">/ {product.typeId === 1 ? 'Kg' : (product.typeId === 2 ? 'Litre' : 'Unité')}</span>
                      </div>
                    </div>
                    
                    <Link to={`/product/${product.id}`} className="w-full bg-[#388e3c] hover:bg-[#2e7d32] text-white font-bold py-3.5 rounded-xl flex items-center justify-center transition-colors shadow-sm">
                      En savoir plus <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 5. How the Platform Works */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Comment fonctionne Karochebama</h2>
        <p className="text-gray-500 max-w-2xl mx-auto mb-16">Un processus simple et transparent pour connecter les producteurs agricoles aux acheteurs du monde entier.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gray-100 -z-10"></div>
          
          {howItWorks.map((step, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-3xl bg-white border-4 border-gray-50 flex items-center justify-center shadow-lg mb-6 text-emerald-600 relative z-10">
                <step.icon className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed max-w-xs">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
