<<<<<<< HEAD
import { useState, useEffect } from 'react';
import { PlusCircle, Package, Trash2, Edit } from 'lucide-react';
=======
import React, { useState, useEffect } from 'react';
import { PlusCircle, Package, Search, Trash2, Edit } from 'lucide-react';
>>>>>>> a9f1ddf04f884b977c71915d684ba0681cbb35f1
import axios from 'axios';
import { authService } from '../services/authService';
import DataTable from '../components/DataTable';
import ProductDialog from '../components/ProductDialog';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [types, setTypes] = useState([]);
  const [sites, setSites] = useState([]);
  const [categories, setCategories] = useState([]);
  const [varieties, setVarieties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = authService.getToken();
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const responses = await Promise.allSettled([
<<<<<<< HEAD
        axios.get('http://localhost:5001/api/v1/catalog/products', config),
        axios.get('http://localhost:5001/api/v1/production/regions', config),
        axios.get('http://localhost:5001/api/v1/production/sites', config),
        axios.get('http://localhost:5001/api/v1/catalog/categories', config),
        axios.get('http://localhost:5001/api/v1/catalog/categories/varieties', config)
      ]);

      const [pRes, , sRes, cRes, vRes] = responses.map(r => r.status === 'fulfilled' ? (r as any).value : { data: { data: [] } });
=======
        axios.get('http://localhost:5000/api/v1/catalog/products', config),
        axios.get('http://localhost:5000/api/v1/production/regions', config),
        axios.get('http://localhost:5000/api/v1/production/sites', config),
        axios.get('http://localhost:5000/api/v1/catalog/categories', config),
        axios.get('http://localhost:5000/api/v1/catalog/categories/varieties', config)
      ]);

      const [pRes, tRes, sRes, cRes, vRes] = responses.map(r => r.status === 'fulfilled' ? (r as any).value : { data: { data: [] } });
>>>>>>> a9f1ddf04f884b977c71915d684ba0681cbb35f1

      const demoTypes = [
        { id: 1, name: 'Agricole' },
        { id: 2, name: 'Agro-industriel' },
        { id: 3, name: 'Piscicole' }
      ];

      setProducts(pRes.data?.data?.items || pRes.data?.data || []); // Supporte les deux formats de retour
      setTypes(demoTypes);
      setSites(sRes.data?.data || []);
      setCategories(cRes.data?.data || []);
      setVarieties(vRes.data?.data || []);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData: any) => {
    try {
      const token = authService.getToken();
<<<<<<< HEAD
      const config = { 
        headers: { 
          Authorization: `Bearer ${token}`
        } 
      };
      
      if (selectedProduct) {
        await axios.patch(`http://localhost:5001/api/v1/catalog/products/${(selectedProduct as any).id}`, formData, config);
      } else {
        await axios.post('http://localhost:5001/api/v1/catalog/products', formData, config);
=======
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      if (selectedProduct) {
        await axios.patch(`http://localhost:5000/api/v1/catalog/products/${(selectedProduct as any).id}`, formData, config);
      } else {
        await axios.post('http://localhost:5000/api/v1/catalog/products', formData, config);
>>>>>>> a9f1ddf04f884b977c71915d684ba0681cbb35f1
      }
      
      setIsDialogOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error saving product:', error);
<<<<<<< HEAD
      throw error; // Propagation au formulaire pour afficher l'alerte
=======
>>>>>>> a9f1ddf04f884b977c71915d684ba0681cbb35f1
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce produit ? Cela supprimera également l'historique des récoltes liées.")) return;
    try {
      const token = authService.getToken();
<<<<<<< HEAD
      await axios.delete(`http://localhost:5001/api/v1/catalog/products/${id}`, {
=======
      await axios.delete(`http://localhost:5000/api/v1/catalog/products/${id}`, {
>>>>>>> a9f1ddf04f884b977c71915d684ba0681cbb35f1
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.message || "Erreur lors de la suppression");
    }
  };

  const columns = [
    { 
      id: 'name', 
      label: 'Produit',
      format: (val: string, row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center font-bold">
             <Package size={20} />
          </div>
          <div>
            <p className="font-bold text-slate-900">{val}</p>
            <p className="text-[10px] text-primary-600 font-bold uppercase">{row.type?.name}</p>
          </div>
        </div>
      )
    },
    { 
      id: 'category', 
      label: 'Catégorie',
      format: (val: any) => val?.name || 'N/A'
    },
    { 
      id: 'stock', 
      label: 'Stock',
      format: (val: number) => <span className="font-medium text-slate-600">{val} KG</span>
    },
    { 
      id: 'priceKg', 
      label: 'Prix KG',
      align: 'right' as const,
      format: (val: number) => <span className="font-bold text-slate-900">{Number(val).toLocaleString()} <span className="text-[10px]">FCFA</span></span>
    },
    {
      id: 'actions',
      label: 'Actions',
      format: (_: any, row: any) => (
        <div className="flex items-center gap-2">
          <button 
            onClick={() => { setSelectedProduct(row); setIsDialogOpen(true); }}
            className="p-2 hover:bg-primary-50 text-primary-600 rounded-lg transition-colors"
          >
            <Edit size={16} />
          </button>
          <button 
            onClick={() => handleDeleteProduct(row.id)}
            className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-outfit tracking-tight">Catalogue Produits</h1>
          <p className="text-sm text-slate-500 mt-1">Gestion complète de vos produits.</p>
        </div>
        <button onClick={() => { setSelectedProduct(null); setIsDialogOpen(true); }} className="px-4 py-2 bg-primary-500 text-white rounded-xl text-sm font-bold hover:bg-primary-600 flex items-center gap-2 shadow-lg shadow-primary-500/20">
          <PlusCircle size={18} /> Nouveau Produit
        </button>
      </div>

      <DataTable 
        columns={columns} 
        data={products} 
        loading={loading}
      />

      {isDialogOpen && (
        <ProductDialog 
          open={isDialogOpen} 
          onClose={() => setIsDialogOpen(false)} 
          onSave={handleSave}
          product={selectedProduct}
          types={types}
          sites={sites}
          categories={categories}
          varieties={varieties}
        />
      )}
    </div>
  );
};

export default ProductsPage;
<<<<<<< HEAD

=======
>>>>>>> a9f1ddf04f884b977c71915d684ba0681cbb35f1
