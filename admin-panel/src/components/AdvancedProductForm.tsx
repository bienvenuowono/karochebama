import React, { useState, useEffect, useCallback } from 'react';
import { 
  Package, 
  Sprout, 
  DollarSign, 
  Upload, 
  X,
  Loader2,
  CheckCircle2,
  MapPin,
  ImageIcon,
  Plus
} from 'lucide-react';
import axios from 'axios';
import { authService } from '../services/authService';

<<<<<<< HEAD
const AdvancedProductForm = ({ onSubmit, onCancel, initialData }: any) => {
=======
const AdvancedProductForm = ({ onSubmit, onCancel }: any) => {
>>>>>>> a9f1ddf04f884b977c71915d684ba0681cbb35f1
  const [categories, setCategories] = useState([]);
  const [varieties, setVarieties] = useState([]);
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [mainPreview, setMainPreview] = useState<string>('');
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

  const [formData, setFormData] = useState<any>({
    typeId: '1',
    name: '',
    categoryId: '',
    varietyId: '',
    siteIds: [],
    sowingDate: '',
    maturityDate: '',
    quantityKg: '',
    price: '',
    priceKg: '',
    description: '',
  });

  useEffect(() => {
    fetchMetadata();
  }, []);

  const fetchMetadata = async () => {
    try {
      const token = authService.getToken();
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const [catRes, siteRes] = await Promise.all([
<<<<<<< HEAD
        axios.get('http://localhost:5001/api/v1/catalog/categories', config),
        axios.get('http://localhost:5001/api/v1/production/sites', config)
=======
        axios.get('http://localhost:5000/api/v1/catalog/categories', config),
        axios.get('http://localhost:5000/api/v1/production/sites', config)
>>>>>>> a9f1ddf04f884b977c71915d684ba0681cbb35f1
      ]);
      setCategories(catRes.data.data || []);
      setSites(siteRes.data.data || []);
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  useEffect(() => {
    if (initialData && categories.length > 0) {
      setFormData({
        typeId: initialData.typeId?.toString() || '1',
        name: initialData.name || '',
        categoryId: initialData.categoryId?.toString() || '',
        varietyId: initialData.varietyId?.toString() || '',
        siteIds: initialData.sites ? initialData.sites.map((s: any) => s.siteId) : [],
        sowingDate: initialData.sowingDate ? new Date(initialData.sowingDate).toISOString().split('T')[0] : '',
        maturityDate: initialData.maturityDate ? new Date(initialData.maturityDate).toISOString().split('T')[0] : '',
        quantityKg: initialData.quantityKg?.toString() || '',
        price: initialData.price?.toString() || '',
        priceKg: initialData.priceKg?.toString() || '',
        description: initialData.description || '',
      });

      if (initialData.imageUrl) {
        setMainPreview(initialData.imageUrl.startsWith('http') ? initialData.imageUrl : `http://localhost:5001${initialData.imageUrl}`);
      }

      if (initialData.gallery && Array.isArray(initialData.gallery)) {
        setGalleryPreviews(initialData.gallery.map((url: string) => url.startsWith('http') ? url : `http://localhost:5001${url}`));
      }
      
      const cat: any = categories.find((c: any) => c.id === parseInt(initialData.categoryId));
      if (cat) setVarieties(cat.varieties || []);
    }
  }, [initialData, categories]);

=======
>>>>>>> a9f1ddf04f884b977c71915d684ba0681cbb35f1
  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMainImage(file);
      setMainPreview(URL.createObjectURL(file));
    }
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setGalleryFiles(prev => [...prev, ...files].slice(0, 5));
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setGalleryPreviews(prev => [...prev, ...newPreviews].slice(0, 5));
  };

  const removeGalleryImage = (index: number) => {
    setGalleryFiles(prev => prev.filter((_, i) => i !== index));
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const toggleSite = (siteId: number) => {
    const current = [...formData.siteIds];
    const index = current.indexOf(siteId);
    if (index > -1) current.splice(index, 1);
    else current.push(siteId);
    setFormData({ ...formData, siteIds: current });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'siteIds') data.append(key, JSON.stringify(formData[key]));
      else data.append(key, formData[key]);
    });

    if (mainImage) data.append('image', mainImage);
    galleryFiles.forEach(file => data.append('gallery', file));

    try {
<<<<<<< HEAD
      await onSubmit(data); // On délègue l'appel API au parent
    } catch (err: any) {
      console.error('Submit error:', err);
      alert(err.response?.data?.message || err.message || 'Erreur lors de la sauvegarde du produit');
=======
      const token = authService.getToken();
      await axios.post('http://localhost:5000/api/v1/catalog/products', data, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      onSubmit();
    } catch (err) {
      console.error('Submit error:', err);
      alert('Erreur lors de la création du produit');
>>>>>>> a9f1ddf04f884b977c71915d684ba0681cbb35f1
    } finally {
      setSubmitting(false);
    }
  };

  const isAgri = formData.typeId === '1' || formData.typeId === '2';
  const labelClass = "block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1";
  const inputClass = "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-primary-500/20 font-medium";

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-primary-500" /></div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-20 max-w-sm mx-auto">
      
      {/* SECTION 1: GÉNÉRAL (VERTICAL STACK) */}
      <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-50 text-primary-600 rounded-lg"><Package size={20}/></div>
          <h3 className="text-xl font-bold text-slate-900 font-outfit">Informations de base</h3>
        </div>

        <div className="space-y-6">
          <div>
            <label className={labelClass}>Type de Produit</label>
            <div className="flex bg-slate-100 p-1 rounded-2xl w-full">
              {['Agricole', 'Agro-indus', 'Piscicole'].map((t, i) => (
                <button 
                  key={t} type="button" 
                  onClick={() => setFormData({...formData, typeId: (i+1).toString()})} 
                  className={`flex-1 py-2 rounded-xl text-[10px] font-bold transition-all ${formData.typeId === (i+1).toString() ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={labelClass}>Nom du Produit</label>
            <input required type="text" className={inputClass} placeholder="Entrez le nom..." value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
          </div>

          <div>
            <label className={labelClass}>Catégorie</label>
            <select required className={inputClass} value={formData.categoryId} onChange={(e) => {
               setFormData({...formData, categoryId: e.target.value, varietyId: ''});
               const cat: any = categories.find((c: any) => c.id === parseInt(e.target.value));
               setVarieties(cat?.varieties || []);
            }}>
              <option value="">Sélectionner une catégorie...</option>
              {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div>
            <label className={labelClass}>Variété</label>
<<<<<<< HEAD
            <select className={inputClass} value={formData.varietyId} onChange={(e) => setFormData({...formData, varietyId: e.target.value})}>
              <option value="">Sélectionner une variété (Optionnel)...</option>
=======
            <select required className={inputClass} value={formData.varietyId} onChange={(e) => setFormData({...formData, varietyId: e.target.value})}>
              <option value="">Sélectionner une variété...</option>
>>>>>>> a9f1ddf04f884b977c71915d684ba0681cbb35f1
              {varieties.map((v: any) => <option key={v.id} value={v.id}>{v.name}</option>)}
            </select>
          </div>

          <div>
            <label className={labelClass}>Sites de Culture</label>
            <div className="flex flex-wrap gap-2">
              {sites.map((s: any) => (
                <button key={s.id} type="button" onClick={() => toggleSite(s.id)} 
                  className={`px-4 py-2 rounded-xl border text-[10px] font-bold transition-all flex items-center gap-2 ${formData.siteIds.includes(s.id) ? 'bg-primary-500 text-white border-primary-500 shadow-lg shadow-primary-500/20' : 'bg-white text-slate-500 border-slate-200 hover:border-primary-100'}`}>
                  <MapPin size={12} /> {s.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: PRODUCTION (VERTICAL) */}
      {isAgri && (
        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
          <h3 className="text-xl font-bold text-slate-900 font-outfit flex items-center gap-2">
            <Sprout className="text-emerald-500" /> Cycle de Production
          </h3>
          <div className="space-y-6">
             <div><label className={labelClass}>Estimation Récolte (KG)</label><input type="number" className={inputClass} placeholder="ex: 1000" value={formData.quantityKg} onChange={(e) => setFormData({...formData, quantityKg: e.target.value})} /></div>
             <div><label className={labelClass}>Date de Semis</label><input type="date" className={inputClass} value={formData.sowingDate} onChange={(e) => setFormData({...formData, sowingDate: e.target.value})} /></div>
             <div><label className={labelClass}>Maturité prévue</label><input type="date" className={inputClass} value={formData.maturityDate} onChange={(e) => setFormData({...formData, maturityDate: e.target.value})} /></div>
          </div>
        </div>
      )}

      {/* SECTION 3: TARIFICATION (VERTICAL) */}
      <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
        <h3 className="text-xl font-bold text-slate-900 font-outfit flex items-center gap-2">
          <DollarSign className="text-orange-500" /> Tarification
        </h3>
        <div className="space-y-6">
          <div><label className={labelClass}>Prix de vente Public (FCFA)</label><input required type="number" className={inputClass} placeholder="ex: 5000" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} /></div>
          {isAgri && <div><label className={labelClass}>Prix au KG (FCFA)</label><input type="number" className={inputClass} placeholder="ex: 500" value={formData.priceKg} onChange={(e) => setFormData({...formData, priceKg: e.target.value})} /></div>}
        </div>
      </div>

      {/* SECTION 4: MÉDIAS (VERTICAL) */}
      <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-8">
        <h3 className="text-xl font-bold text-slate-900 font-outfit flex items-center gap-2">
          <ImageIcon className="text-blue-500" /> Médias & Galerie
        </h3>

        <div className="space-y-8">
          {/* Image Principale */}
          <div>
            <label className={labelClass}>Image Principale</label>
            <div className="relative group w-full aspect-video rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center overflow-hidden hover:border-primary-400 transition-all">
              {mainPreview ? (
                <>
                  <img src={mainPreview} className="w-full h-full object-cover" alt="preview" />
                  <button onClick={() => {setMainImage(null); setMainPreview('');}} className="absolute top-4 right-4 p-2 bg-white/90 text-red-500 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    <X size={20} />
                  </button>
                </>
              ) : (
                <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer p-6">
                  <div className="p-4 bg-white rounded-2xl shadow-sm mb-4 text-primary-500"><Upload size={24} /></div>
                  <p className="text-xs font-bold text-slate-900 text-center">Cliquez ou glissez l'image principale ici</p>
                  <input type="file" className="hidden" accept="image/*" onChange={handleMainImageChange} />
                </label>
              )}
            </div>
          </div>

          {/* Galerie */}
          <div>
            <label className={labelClass}>Galerie (Photos secondaires)</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
               {galleryPreviews.map((url, idx) => (
                 <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden group">
                   <img src={url} className="w-full h-full object-cover" alt="gallery" />
                   <button onClick={() => removeGalleryImage(idx)} className="absolute top-2 right-2 p-1.5 bg-white/90 text-red-500 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                     <X size={14} />
                   </button>
                 </div>
               ))}
               {galleryPreviews.length < 5 && (
                 <label className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center cursor-pointer hover:border-primary-400 transition-all">
                    <Plus size={24} className="text-slate-300" />
                    <input type="file" className="hidden" multiple accept="image/*" onChange={handleGalleryChange} />
                 </label>
               )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
        <label className={labelClass}>Description détaillée</label>
        <textarea className={`${inputClass} min-h-[120px]`} placeholder="Ajoutez des détails sur ce produit..." value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
      </div>

      <div className="flex flex-col gap-4">
        <button type="submit" disabled={submitting} className="w-full py-5 bg-primary-500 text-white rounded-[24px] font-black text-sm hover:bg-primary-600 shadow-xl shadow-primary-500/25 flex items-center justify-center gap-3 disabled:opacity-50">
          {submitting ? <Loader2 className="animate-spin" /> : <CheckCircle2 />}
          {submitting ? 'Enregistrement en cours...' : 'Valider et Publier le Produit'}
        </button>
        <button type="button" onClick={onCancel} className="w-full py-4 text-slate-500 font-bold text-sm hover:bg-slate-100 rounded-2xl transition-all">
           Annuler et Fermer
        </button>
      </div>
    </form>
  );
};

export default AdvancedProductForm;
<<<<<<< HEAD

=======
>>>>>>> a9f1ddf04f884b977c71915d684ba0681cbb35f1
