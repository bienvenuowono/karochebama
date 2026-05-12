import { useState, useEffect, useMemo } from 'react';
import { Search, ChevronRight, ShoppingCart, MapPin, Loader2 } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import SEO from '../components/SEO';

export default function Marketplace() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [activeType, setActiveType] = useState(searchParams.get('category') || 'Tous les types');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedSite, setSelectedSite] = useState(searchParams.get('site') || '');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [sites, setSites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  // Update URL when filters change (optional but recommended)
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.append('q', searchQuery);
    if (activeType !== 'Tous les types') params.append('category', activeType);
    if (selectedSite) params.append('site', selectedSite);
    setSearchParams(params, { replace: true });
  }, [searchQuery, activeType, selectedSite]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes, siteRes] = await Promise.all([
        axios.get('http://localhost:5001/api/v1/catalog/products'),
        axios.get('http://localhost:5001/api/v1/catalog/categories'),
        axios.get('http://localhost:5001/api/v1/production/sites')
      ]);
      setProducts(prodRes.data.data);
      setCategories(catRes.data.data);
      setSites(siteRes.data.data);
    } catch (error) {
      console.error('Error fetching marketplace data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesType = activeType === 'Tous les types' || p.category?.name === activeType;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            (p.description || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSite = !selectedSite || p.productionSite?.name === selectedSite || p.productionSite?.location === selectedSite;
      const matchesMinPrice = priceRange.min === '' || p.price >= Number(priceRange.min);
      const matchesMaxPrice = priceRange.max === '' || p.price <= Number(priceRange.max);
      
      return matchesType && matchesSearch && matchesSite && matchesMinPrice && matchesMaxPrice;
    });
  }, [products, activeType, searchQuery, selectedSite, priceRange]);

  return (
    <div className="bg-[#f8f9fa] min-h-screen font-sans pb-20">
      <SEO 
        title="Boutique" 
        description="Achetez des produits agricoles et piscicoles de qualité supérieure directement auprès de Karochebama."
        keywords="marché agricole, vente poisson, achat plantain, produits camerounais"
      />
      
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200 py-16 px-4 sm:px-6 lg:px-8 mb-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6 border border-emerald-100">
            <ShoppingCart className="h-4 w-4" />
            Boutique
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            Découvrez nos produits agricoles et piscicoles
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-8">
            Approvisionnez-vous en produits de haute qualité, directement auprès de nos sites de production.
          </p>
          
          <div className="max-w-2xl mx-auto relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-base shadow-sm transition-shadow"
              placeholder="Rechercher un produit..."
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <div className="w-full md:w-72 flex-shrink-0">
            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-6 sticky top-24 space-y-8">
              
              {/* Types de produit (Catégories de la base) */}
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4">Catégories</h2>
                <ul className="space-y-2">
                  <li>
                    <button
                      onClick={() => setActiveType('Tous les types')}
                      className={`w-full text-left px-4 py-2.5 rounded-xl font-medium transition-colors flex justify-between items-center text-sm ${
                        activeType === 'Tous les types' 
                          ? 'bg-emerald-50 text-emerald-700 font-bold' 
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      Toutes les catégories
                      {activeType === 'Tous les types' && (
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-600"></div>
                      )}
                    </button>
                  </li>
                  {categories.map((cat) => (
                    <li key={cat.id}>
                      <button
                        onClick={() => setActiveType(cat.name)}
                        className={`w-full text-left px-4 py-2.5 rounded-xl font-medium transition-colors flex justify-between items-center text-sm ${
                          activeType === cat.name 
                            ? 'bg-emerald-50 text-emerald-700 font-bold' 
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {cat.name}
                        {activeType === cat.name && (
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-600"></div>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <hr className="border-gray-100" />

              {/* Sites de production */}
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4">Sites de Production</h2>
                <select 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20"
                  value={selectedSite}
                  onChange={(e) => setSelectedSite(e.target.value)}
                >
                  <option value="">Tous les sites</option>
                  {sites.map(site => (
                    <option key={site.id} value={site.name}>{site.name}</option>
                  ))}
                </select>
              </div>

              <hr className="border-gray-100" />

              {/* Price Range */}
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4">Prix (CFA)</h2>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    placeholder="Min" 
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none" 
                  />
                  <span className="text-gray-400">-</span>
                  <input 
                    type="number" 
                    placeholder="Max" 
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none" 
                  />
                </div>
              </div>

            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <div 
                    key={product.id} 
                    className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col group transition-all hover:shadow-xl"
                  >
                    {/* Image Area */}
                    <div className="relative h-56 bg-gray-100 p-0 overflow-hidden">
                      <div className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-md text-emerald-700 text-[11px] font-bold px-3 py-1.5 rounded-full shadow-sm">
                        {product.category?.name || 'Général'}
                      </div>
                      <img 
                        src={product.imageUrl ? (product.imageUrl.startsWith('http') ? product.imageUrl : `http://localhost:5001${product.imageUrl}`) : 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80'} 
                        alt={product.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                        referrerPolicy="no-referrer" 
                      />
                    </div>
                    
                    {/* Content Area */}
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="text-xl font-extrabold text-gray-900 mb-2 line-clamp-1">
                        {product.name}
                      </h3>
                      
                      <p className="text-sm text-gray-500 mb-4 line-clamp-2 min-h-[40px]">
                        {product.description || 'Produit de qualité supérieure cultivé avec soin dans nos plantations et fermes.'}
                      </p>
                      
                      <div className="flex items-center text-sm text-gray-500 mb-4">
                        <MapPin className="w-4 h-4 mr-2 text-emerald-600" />
                        <span>{product.productionSite?.name || 'Cameroun'}</span>
                      </div>
                      
                      <div className="text-[11px] font-bold uppercase tracking-wider mb-5 text-emerald-700">
                        Disponibilité: {product.status === 'active' ? 'En Stock' : (product.status === 'en_production' ? 'En Production' : 'Disponible')}
                      </div>
                      
                      {/* Price Box */}
                      <div className="bg-[#f8f9fa] border border-gray-100 rounded-2xl p-4 mb-4 mt-auto">
                        <div className="text-xl font-extrabold text-gray-900 text-center">
                          {product.price.toLocaleString('fr-FR')} CFA <span className="text-sm font-medium text-gray-400">/ {product.typeId === 1 ? 'Kg' : (product.typeId === 2 ? 'Litre' : 'Unité')}</span>
                        </div>
                      </div>
                      
                      {/* Action Button */}
                      <Link 
                        to={`/product/${product.id}`}
                        className="w-full bg-[#388e3c] hover:bg-[#2e7d32] text-white font-bold py-3.5 rounded-xl flex items-center justify-center transition-colors shadow-sm"
                      >
                        En savoir plus <ChevronRight className="w-4 h-4 ml-1" />
                      </Link>
                    </div>
                  </div>
                ))}
                
                {filteredProducts.length === 0 && (
                  <div className="col-span-full text-center py-12 bg-white rounded-[2rem] border border-gray-100">
                    <p className="text-gray-500 text-lg">Aucun produit ne correspond à vos critères.</p>
                    <button 
                      onClick={() => {
                        setActiveType('Tous les types');
                        setSearchQuery('');
                        setSelectedSite('');
                        setPriceRange({ min: '', max: '' });
                      }}
                      className="mt-4 text-emerald-600 font-bold hover:text-emerald-700"
                    >
                      Réinitialiser les filtres
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}
