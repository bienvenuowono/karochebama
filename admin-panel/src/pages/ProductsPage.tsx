import { useState, useEffect } from 'react';
import { PlusCircle, Package, Trash2, Edit } from 'lucide-react';
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
        axios.get('https://karochebama.com/api/v1/catalog/products', config),
        axios.get('https://karochebama.com/api/v1/production/regions', config),
        axios.get('https://karochebama.com/api/v1/production/sites', config),
        axios.get('https://karochebama.com/api/v1/catalog/categories', config),
        axios.get('https://karochebama.com/api/v1/catalog/categories/varieties', config)
      ]);

      const [pRes, , sRes, cRes, vRes] = responses.map(r => r.status === 'fulfilled' ? (r as any).value : { data: { data: [] } });

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
      const config = { 
        headers: { 
          Authorization: `Bearer ${token}`
        } 
      };
      
      if (selectedProduct) {
        await axios.patch(`https://karochebama.com/api/v1/catalog/products/${(selectedProduct as any).id}`, formData, config);
      } else {
        await axios.post('https://karochebama.com/api/v1/catalog/products', formData, config);
      }
      
      setIsDialogOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error saving product:', error);
      throw error; // Propagation au formulaire pour afficher l'alerte
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce produit ? Cela supprimera également l'historique des récoltes liées.")) return;
    try {
      const token = authService.getToken();
      await axios.delete(`https://karochebama.com/api/v1/catalog/products/${id}`, {
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
      id: 'quantityKg', 
      label: 'Estimation Récolte',
      format: (val: number) => <span className="font-medium text-slate-600">{val || 0} KG</span>
    },
    { 
      id: 'stock', 
      label: 'Quantité restante',
      format: (val: number) => <span className={`font-bold ${val < 10 ? 'text-red-500' : 'text-emerald-600'}`}>{val} KG</span>
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

