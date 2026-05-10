import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, ShieldCheck, Truck, ShoppingCart, ChevronRight, CheckCircle2, Globe, Loader2, ArrowLeft, Calendar, Clock, Leaf } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

export default function ProductDetail() {
  const { id } = useParams();
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [mainImage, setMainImage] = useState<string>('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/v1/catalog/products/${id}`);
        const p = response.data.data;
        setProduct(p);
        
        // Setup initial image
        if (p.imageUrl) {
          setMainImage(p.imageUrl.startsWith('http') ? p.imageUrl : `http://localhost:5000${p.imageUrl}`);
        } else {
          setMainImage('https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=1200&q=80');
        }
      } catch (err) {
        console.error("Erreur de chargement du produit", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const orderData = {
      customerName: `${formData.get('nom')} ${formData.get('prenom')}`,
      customerEmail: formData.get('email'),
      customerPhone: formData.get('phone'),
      shippingAddress: formData.get('address'),
      notes: formData.get('notes'),
      items: [
        {
          productId: parseInt(id as string),
          quantity: orderQuantity
        }
      ]
    };

    try {
      await axios.post('http://localhost:5000/api/v1/catalog/orders', orderData);
      alert('Votre commande a été enregistrée avec succès ! Notre équipe vous contactera sous peu.');
      setShowOrderForm(false);
      // Recharger le produit pour avoir le nouveau stock
      const response = await axios.get(`http://localhost:5000/api/v1/catalog/products/${id}`);
      setProduct(response.data.data);
    } catch (err: any) {
      alert(`Erreur lors de la commande: ${err.response?.data?.message || err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Chargement des détails du produit...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Produit introuvable</h2>
        <p className="text-gray-500 mb-6">Le produit que vous cherchez n'existe pas ou a été retiré.</p>
        <Link to="/marketplace" className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold flex items-center gap-2">
          <ArrowLeft size={18} /> Retour à la boutique
        </Link>
      </div>
    );
  }

  // Construction de la galerie d'images
  const gallery = [];
  if (product.imageUrl) gallery.push(product.imageUrl.startsWith('http') ? product.imageUrl : `http://localhost:5000${product.imageUrl}`);
  if (product.gallery && Array.isArray(product.gallery)) {
    product.gallery.forEach((url: string) => {
      gallery.push(url.startsWith('http') ? url : `http://localhost:5000${url}`);
    });
  }
  if (gallery.length === 0) gallery.push('https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=1200&q=80');

  const unitLabel = product.typeId === 1 ? 'Kg' : (product.typeId === 2 ? 'Litre' : 'Unité');

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center text-sm text-gray-500 mb-8 font-medium">
          <Link to="/" className="hover:text-emerald-600">Accueil</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <Link to="/marketplace" className="hover:text-emerald-600">Boutique</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-gray-900 line-clamp-1">{product.name}</span>
        </nav>

        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            
            {/* Product Images */}
            <div className="p-8 lg:border-r border-gray-100">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="aspect-w-4 aspect-h-3 rounded-2xl overflow-hidden bg-gray-100 mb-4 relative"
              >
                <img src={mainImage} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                <div className="absolute top-4 left-4 bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md uppercase">
                  {product.status === 'active' ? 'En Stock' : (product.status === 'en_production' ? 'En Production' : 'Disponible')}
                </div>
              </motion.div>
              
              {gallery.length > 1 && (
                <div className="grid grid-cols-5 gap-3">
                  {gallery.map((img, i) => (
                    <div 
                      key={i} 
                      onClick={() => setMainImage(img)}
                      className={`aspect-square rounded-xl overflow-hidden bg-gray-100 border-2 cursor-pointer transition-colors ${mainImage === img ? 'border-emerald-500' : 'border-transparent hover:border-gray-300'}`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                  ))}
                </div>
              )}
              
              {/* Order Box moved here */}
              <div className="mt-8 pt-8 border-t border-gray-100">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center border border-gray-300 rounded-xl bg-white h-14">
                    <button 
                      type="button"
                      onClick={() => setOrderQuantity(Math.max(1, orderQuantity - 1))}
                      className="px-5 h-full text-gray-500 hover:text-gray-900 font-bold hover:bg-gray-50 rounded-l-xl transition-colors"
                    >
                      -
                    </button>
                    <span className="px-4 font-bold text-gray-900 min-w-[4rem] text-center">{orderQuantity} {unitLabel}</span>
                    <button 
                      type="button"
                      onClick={() => setOrderQuantity(orderQuantity + 1)}
                      className="px-5 h-full text-gray-500 hover:text-gray-900 font-bold hover:bg-gray-50 rounded-r-xl transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <button 
                    onClick={() => setShowOrderForm(true)}
                    className="flex-1 h-14 bg-[#388e3c] text-white rounded-xl font-bold text-lg hover:bg-[#2e7d32] transition-colors shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="h-6 w-6" /> Commander
                  </button>
                </div>
                
                <div className="flex items-center justify-center gap-8 text-sm text-gray-500 font-medium">
                  <span className="flex items-center gap-2"><Truck className="h-5 w-5 text-emerald-600" /> Livraison disponible</span>
                  <span className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-emerald-600" /> Qualité garantie</span>
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="p-8 lg:p-12 flex flex-col">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">
                    {product.category?.name || 'Général'}
                  </span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">{product.name}</h1>
                <p className="text-lg text-gray-600 leading-relaxed font-light">{product.description || 'Aucune description disponible pour ce produit.'}</p>
              </div>

              <div className="flex items-end gap-4 mb-8">
                <span className="text-5xl font-extrabold text-gray-900">{product.price.toLocaleString('fr-FR')} CFA</span>
                <span className="text-xl text-gray-500 font-medium mb-1">/{unitLabel}</span>
              </div>

              <div className="space-y-3 mb-8">
                {product.sowingDate && (
                  <div className="flex items-center text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <Calendar className="h-5 w-5 mr-3 text-emerald-600" /> 
                    <span className="font-medium">Date de semis : <span className="text-gray-900">{new Date(product.sowingDate).toLocaleDateString('fr-FR')}</span></span>
                  </div>
                )}
                {product.maturityDate && (
                  <div className="flex items-center text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <Clock className="h-5 w-5 mr-3 text-emerald-600" /> 
                    <span className="font-medium">Maturité prévue : <span className="text-gray-900">{new Date(product.maturityDate).toLocaleDateString('fr-FR')}</span></span>
                  </div>
                )}
                {product.sites && product.sites.length > 0 && (
                  <div className="flex items-start text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <MapPin className="h-5 w-5 mr-3 text-emerald-600 mt-0.5" /> 
                    <div className="flex flex-col">
                      <span className="font-medium">Zones Géographiques : <span className="text-gray-900">
                        {Array.from(new Set(product.sites.map((s: any) => s.site?.geographicZone?.name).filter(Boolean))).join(', ') || 'N/A'}
                      </span></span>
                      <span className="font-medium mt-1">Sites de culture : <span className="text-gray-900">
                        {product.sites.map((s: any) => s.site?.name).join(', ')}
                      </span></span>
                    </div>
                  </div>
                )}
                {product.variety && (
                  <div className="flex items-center text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <CheckCircle2 className="h-5 w-5 mr-3 text-emerald-600" /> 
                    <span className="font-medium">Variété : <span className="text-gray-900">{product.variety.name}</span></span>
                  </div>
                )}
                <div className="flex items-center text-gray-600 bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                  <Leaf className="h-5 w-5 mr-3 text-emerald-600" /> 
                  <span className="font-medium text-emerald-900">Stock / Estimation Récolte : <span className="font-extrabold text-emerald-700">{product.stock} {unitLabel}</span></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal d'enregistrement de commande */}
      {showOrderForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl relative">
            <button 
              onClick={() => setShowOrderForm(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition-colors"
            >
              ✕
            </button>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Finaliser votre commande</h2>
            <p className="text-gray-500 text-sm mb-6">Veuillez remplir vos informations pour commander <span className="font-bold text-gray-900">{orderQuantity} {unitLabel}</span> de <span className="font-bold text-gray-900">{product.name}</span>.</p>
            
            <form onSubmit={handleOrderSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Nom</label>
                  <input type="text" name="nom" required className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none text-sm bg-gray-50 focus:bg-white transition-colors" placeholder="Votre nom" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Prénom</label>
                  <input type="text" name="prenom" required className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none text-sm bg-gray-50 focus:bg-white transition-colors" placeholder="Votre prénom" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Téléphone</label>
                  <input type="tel" name="phone" required className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none text-sm bg-gray-50 focus:bg-white transition-colors" placeholder="+237..." />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Email</label>
                  <input type="email" name="email" required className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none text-sm bg-gray-50 focus:bg-white transition-colors" placeholder="votre@email.com" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Adresse de livraison</label>
                <input type="text" name="address" required className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none text-sm bg-gray-50 focus:bg-white transition-colors" placeholder="Ville, Quartier..." />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Instructions supplémentaires (Optionnel)</label>
                <textarea name="notes" className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none text-sm bg-gray-50 focus:bg-white transition-colors min-h-[80px]" placeholder="Précisions sur la commande..."></textarea>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl flex justify-between items-center border border-gray-100">
                <span className="text-gray-600 font-medium">Total estimé :</span>
                <span className="text-2xl font-extrabold text-gray-900">{(product.price * orderQuantity).toLocaleString('fr-FR')} CFA</span>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowOrderForm(false)} className="flex-1 py-4 border border-gray-200 rounded-xl text-gray-600 font-bold hover:bg-gray-50 transition-colors">Annuler</button>
                <button type="submit" className="flex-1 py-4 bg-[#388e3c] text-white rounded-xl font-bold hover:bg-[#2e7d32] shadow-lg shadow-emerald-600/20 transition-colors">Confirmer la Commande</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
