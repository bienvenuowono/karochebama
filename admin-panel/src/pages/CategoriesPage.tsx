import React, { useState, useEffect } from 'react';
import { PlusCircle, Search, Tags, ChevronRight, ListPlus, Trash2 } from 'lucide-react';
import axios from 'axios';
import { authService } from '../services/authService';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCatDialogOpen, setIsCatDialogOpen] = useState(false);
  const [isVarDialogOpen, setIsVarDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  
  const [newCatName, setNewCatName] = useState('');
  const [newVarName, setNewVarName] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = authService.getToken();
      const config = { headers: { Authorization: `Bearer ${token}` } };
<<<<<<< HEAD
      const res = await axios.get('http://localhost:5001/api/v1/catalog/categories', config);
=======
      const res = await axios.get('http://localhost:5000/api/v1/catalog/categories', config);
>>>>>>> a9f1ddf04f884b977c71915d684ba0681cbb35f1
      setCategories(res.data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = authService.getToken();
<<<<<<< HEAD
      await axios.post('http://localhost:5001/api/v1/catalog/categories', { name: newCatName }, {
=======
      await axios.post('http://localhost:5000/api/v1/catalog/categories', { name: newCatName }, {
>>>>>>> a9f1ddf04f884b977c71915d684ba0681cbb35f1
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewCatName('');
      setIsCatDialogOpen(false);
      fetchData();
<<<<<<< HEAD
    } catch (error: any) {
      console.error('Error creating category:', error);
      alert(error.response?.data?.message || "Erreur lors de la création de la catégorie");
=======
    } catch (error) {
      console.error('Error creating category:', error);
>>>>>>> a9f1ddf04f884b977c71915d684ba0681cbb35f1
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette catégorie ?")) return;
    try {
      const token = authService.getToken();
<<<<<<< HEAD
      await axios.delete(`http://localhost:5001/api/v1/catalog/categories/${id}`, {
=======
      await axios.delete(`http://localhost:5000/api/v1/catalog/categories/${id}`, {
>>>>>>> a9f1ddf04f884b977c71915d684ba0681cbb35f1
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.message || "Erreur lors de la suppression");
    }
  };

  const handleDeleteVariety = async (id: number) => {
    if (!window.confirm("Supprimer cette variété ?")) return;
    try {
      const token = authService.getToken();
<<<<<<< HEAD
      await axios.delete(`http://localhost:5001/api/v1/catalog/categories/varieties/${id}`, {
=======
      await axios.delete(`http://localhost:5000/api/v1/catalog/categories/varieties/${id}`, {
>>>>>>> a9f1ddf04f884b977c71915d684ba0681cbb35f1
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
      setIsVarDialogOpen(false);
    } catch (error: any) {
      alert(error.response?.data?.message || "Erreur lors de la suppression");
    }
  };

  const handleCreateVariety = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = authService.getToken();
<<<<<<< HEAD
      await axios.post('http://localhost:5001/api/v1/catalog/categories/varieties', { 
=======
      await axios.post('http://localhost:5000/api/v1/catalog/categories/varieties', { 
>>>>>>> a9f1ddf04f884b977c71915d684ba0681cbb35f1
        name: newVarName, 
        categoryId: selectedCategory.id 
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewVarName('');
      setIsVarDialogOpen(false);
      fetchData();
<<<<<<< HEAD
    } catch (error: any) {
      console.error('Error creating variety:', error);
      alert(error.response?.data?.message || "Erreur lors de la création de la variété");
=======
    } catch (error) {
      console.error('Error creating variety:', error);
>>>>>>> a9f1ddf04f884b977c71915d684ba0681cbb35f1
    }
  };

  const columns = [
    { 
      id: 'name', 
      label: 'Catégorie',
      format: (val: string) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
            <Tags size={20} />
          </div>
          <span className="font-bold text-slate-900">{val}</span>
        </div>
      )
    },
    { 
      id: 'varieties', 
      label: 'Variétés enregistrées',
      format: (val: any[]) => (
        <div className="flex flex-wrap gap-1">
          {val.length > 0 ? val.map((v: any) => (
            <span key={v.id} className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold rounded flex items-center gap-1">
              {v.name}
            </span>
          )) : <span className="text-[10px] text-slate-400 italic">Aucune variété</span>}
        </div>
      )
    },
    {
      id: 'actions',
      label: 'Gérer',
      format: (_: any, row: any) => (
        <div className="flex items-center gap-2">
          <button 
            onClick={() => { setSelectedCategory(row); setIsVarDialogOpen(true); }}
            className="p-2 hover:bg-primary-50 text-primary-600 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-bold"
          >
            <ListPlus size={16} /> Gérer Variétés
          </button>
          <button 
            onClick={() => handleDeleteCategory(row.id)}
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
          <h1 className="text-2xl font-extrabold text-slate-900 font-outfit tracking-tight">Catégories & Variétés</h1>
          <p className="text-sm text-slate-500 mt-1">Gérez vos familles de produits et leurs déclinaisons.</p>
        </div>
        <button onClick={() => setIsCatDialogOpen(true)} className="px-4 py-2 bg-primary-500 text-white rounded-xl text-sm font-bold hover:bg-primary-600 flex items-center gap-2 shadow-lg shadow-primary-500/20">
          <PlusCircle size={18} /> Nouvelle Catégorie
        </button>
      </div>

      <DataTable columns={columns} data={categories} loading={loading} />

      {/* Modal Nouvelle Catégorie */}
      <Modal isOpen={isCatDialogOpen} onClose={() => setIsCatDialogOpen(false)} title="Nouvelle Famille de Produit">
        <form onSubmit={handleCreateCategory} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Nom de la Catégorie</label>
            <input 
              type="text" 
              required 
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-primary-500/20"
              placeholder="Ex: Plantain, Maïs, Cacao..."
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
            />
          </div>
          <button type="submit" className="w-full py-3 bg-primary-500 text-white rounded-2xl font-bold text-sm hover:bg-primary-600 shadow-lg shadow-primary-500/20">
            Enregistrer la Catégorie
          </button>
        </form>
      </Modal>

      {/* Modal Gérer Variétés */}
      <Modal isOpen={isVarDialogOpen} onClose={() => setIsVarDialogOpen(false)} title={`Variétés pour : ${selectedCategory?.name}`}>
        <div className="space-y-6">
          <div className="p-4 bg-primary-50 rounded-2xl border border-primary-100">
            <p className="text-xs text-primary-700 font-medium">Liste des variétés rattachées à <span className="font-bold">{selectedCategory?.name}</span>.</p>
          </div>

          <div className="space-y-2">
            {selectedCategory?.varieties.map((v: any) => (
              <div key={v.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-sm font-bold text-slate-700">{v.name}</span>
                <button onClick={() => handleDeleteVariety(v.id)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          <form onSubmit={handleCreateVariety} className="pt-4 border-t border-slate-100 space-y-4">
            <label className="block text-xs font-bold text-slate-500 uppercase ml-1">Ajouter une nouvelle variété</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                required 
                className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500/20"
                placeholder="Ex: Mbouroukou..."
                value={newVarName}
                onChange={(e) => setNewVarName(e.target.value)}
              />
              <button type="submit" className="px-4 py-2 bg-primary-500 text-white rounded-xl font-bold text-xs hover:bg-primary-600">
                Ajouter
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default CategoriesPage;
<<<<<<< HEAD

=======
>>>>>>> a9f1ddf04f884b977c71915d684ba0681cbb35f1
