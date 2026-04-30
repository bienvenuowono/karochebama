import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, ShieldCheck, Star, Truck, Calendar, Info, ShoppingCart, ChevronRight, CheckCircle2, Globe, Clock, Leaf } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProductDetail() {
  const { id } = useParams();
  const [showPreorderForm, setShowPreorderForm] = useState(false);
  const [showReserveForm, setShowReserveForm] = useState(false);

  // Mock data for demonstration
  const product = {
    id: id,
    name: 'Cacao Excellence',
    price: 250000,
    unit: 'Tonne',
    category: 'Cacao',
    description: 'Fèves de cacao séchées de qualité supérieure. Actuellement en phase de culture, réservez ou précommandez dès maintenant pour garantir votre approvisionnement.',
    stock: 0,
    status: 'En culture',
    expectedHarvestDate: '2026-10-15',
    rating: 4.8,
    reviews: 124,
    images: [
      'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1500937386664-56d1dfefcb0c?auto=format&fit=crop&w=800&q=80'
    ],
    traceability: {
      farm: 'Plantation de Penja',
      location: 'Penja, Cameroun',
      coordinates: '4.6333° N, 9.6833° E',
      harvestDate: 'Prévue pour Octobre 2026',
      method: 'Agriculture biologique, ombragée',
      certifications: ['Certifié Biologique', 'Commerce Équitable']
    },
    supplier: {
      name: 'Coopérative de Penja',
      verified: true,
      rating: 4.9,
      memberSince: '2018'
    }
  };

  const handlePreorderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Précommande envoyée avec succès !');
    setShowPreorderForm(false);
  };

  const handleReserveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Réservation envoyée avec succès !');
    setShowReserveForm(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <nav className="flex text-sm text-gray-500 mb-8 font-medium">
          <Link to="/" className="hover:text-emerald-600">Accueil</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <Link to="/marketplace" className="hover:text-emerald-600">Boutique</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            
            {/* Product Images */}
            <div className="p-8 lg:border-r border-gray-100">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="aspect-w-4 aspect-h-3 rounded-2xl overflow-hidden bg-gray-100 mb-4 relative"
              >
                <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                {product.status === 'En culture' && (
                  <div className="absolute top-4 left-4 bg-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center shadow-md">
                    <Leaf size={14} className="mr-1.5" /> En culture
                  </div>
                )}
              </motion.div>
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img, i) => (
                  <div key={i} className="aspect-w-1 aspect-h-1 rounded-xl overflow-hidden bg-gray-100 border-2 border-transparent hover:border-emerald-500 cursor-pointer transition-colors">
                    <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="p-8 lg:p-12 flex flex-col">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">{product.category}</span>
                  <div className="flex items-center gap-1 text-sm font-bold text-gray-900">
                    <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                    {product.rating} <span className="text-gray-400 font-normal">({product.reviews} avis)</span>
                  </div>
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">{product.name}</h1>
                <p className="text-lg text-gray-600 leading-relaxed font-light">{product.description}</p>
              </div>

              <div className="flex items-end gap-4 mb-8">
                <span className="text-5xl font-extrabold text-gray-900">{product.price.toLocaleString('fr-FR')} CFA</span>
                <span className="text-xl text-gray-500 font-medium mb-1">/{product.unit}</span>
              </div>

              {product.status === 'En culture' && (
                <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100 mb-8">
                  <div className="flex items-center gap-3 mb-2">
                    <Clock className="h-5 w-5 text-amber-600" />
                    <h3 className="font-bold text-amber-900">Récolte prévue : {new Date(product.expectedHarvestDate).toLocaleDateString()}</h3>
                  </div>
                  <p className="text-sm text-amber-800 mb-4">Ce produit n'est pas encore disponible en stock. Vous pouvez le précommander ou réserver une partie de la récolte.</p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button 
                      onClick={() => setShowPreorderForm(true)}
                      className="flex-1 bg-amber-500 text-white py-3 px-4 rounded-xl font-bold hover:bg-amber-600 transition-colors shadow-md flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="h-5 w-5" /> Précommander ce produit
                    </button>
                    <button 
                      onClick={() => setShowReserveForm(true)}
                      className="flex-1 bg-white text-amber-600 border-2 border-amber-500 py-3 px-4 rounded-xl font-bold hover:bg-amber-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <Leaf className="h-5 w-5" /> Réserver cette récolte
                    </button>
                  </div>
                </div>
              )}

              {product.status !== 'En culture' && (
                <div className="flex items-center gap-4 mt-auto">
                  <div className="flex items-center border border-gray-300 rounded-xl bg-white">
                    <button className="px-4 py-3 text-gray-500 hover:text-gray-900 font-medium">-</button>
                    <span className="px-4 py-3 font-bold text-gray-900 border-x border-gray-300">1</span>
                    <button className="px-4 py-3 text-gray-500 hover:text-gray-900 font-medium">+</button>
                  </div>
                  <button className="flex-1 bg-gray-900 text-white py-4 px-8 rounded-xl font-bold text-lg hover:bg-emerald-600 transition-colors shadow-xl flex items-center justify-center gap-2">
                    <ShoppingCart className="h-5 w-5" /> Ajouter au panier
                  </button>
                </div>
              )}
              
              <div className="mt-6 flex items-center justify-center gap-6 text-sm text-gray-500 font-medium">
                <span className="flex items-center gap-1.5"><Truck className="h-4 w-4" /> Livraison rapide</span>
                <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4" /> Qualité garantie</span>
              </div>
            </div>
          </div>
        </div>

        {/* Farm Traceability System */}
        <div className="mt-12">
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-6 flex items-center gap-2">
            <Globe className="h-6 w-6 text-blue-500" /> Traçabilité de la ferme
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Détails de l'origine</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="font-semibold text-gray-900">{product.traceability.farm}</p>
                        <p className="text-sm text-gray-500">{product.traceability.location}</p>
                        <p className="text-xs text-gray-400 mt-1 font-mono">{product.traceability.coordinates}</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="font-semibold text-gray-900">Date de récolte</p>
                        <p className="text-sm text-gray-500">{product.traceability.harvestDate}</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="font-semibold text-gray-900">Méthode de production</p>
                        <p className="text-sm text-gray-500">{product.traceability.method}</p>
                      </div>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Certifications</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.traceability.certifications.map((cert, i) => (
                      <span key={i} className="inline-flex items-center px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200 text-sm font-medium text-gray-700">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 mr-2" />
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Map Placeholder */}
            <div className="bg-gray-200 rounded-3xl overflow-hidden relative min-h-[300px] border border-gray-300">
              <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80" alt="Map" className="w-full h-full object-cover opacity-60" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white p-4 rounded-2xl shadow-xl text-center max-w-[200px]">
                  <MapPin className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                  <p className="font-bold text-gray-900 text-sm">{product.traceability.farm}</p>
                  <p className="text-xs text-gray-500 mt-1">Emplacement vérifié</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Modals */}
      {showPreorderForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Précommander</h2>
            <form onSubmit={handlePreorderSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                <input type="text" required className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none" placeholder="Votre nom" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                <input type="tel" required className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none" placeholder="+237..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" required className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none" placeholder="votre@email.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantité demandée ({product.unit})</label>
                <input type="number" min="1" required className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none" placeholder="Ex: 10" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message (Optionnel)</label>
                <textarea className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none" rows={3} placeholder="Précisions..."></textarea>
              </div>
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setShowPreorderForm(false)} className="flex-1 py-3 px-4 border border-gray-300 rounded-xl text-gray-700 font-bold hover:bg-gray-50">Annuler</button>
                <button type="submit" className="flex-1 py-3 px-4 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600">Valider</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showReserveForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Réserver la récolte</h2>
            <form onSubmit={handleReserveSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom / Entreprise</label>
                <input type="text" required className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none" placeholder="Votre nom" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                <input type="tel" required className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none" placeholder="+237..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" required className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none" placeholder="votre@email.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantité à réserver ({product.unit})</label>
                <input type="number" min="1" required className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none" placeholder="Ex: 50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date souhaitée</label>
                <input type="date" required className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none" />
              </div>
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setShowReserveForm(false)} className="flex-1 py-3 px-4 border border-gray-300 rounded-xl text-gray-700 font-bold hover:bg-gray-50">Annuler</button>
                <button type="submit" className="flex-1 py-3 px-4 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600">Valider</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
