import React, { useState, useEffect } from 'react';
import { PlusCircle, Newspaper, Trash2, Edit } from 'lucide-react';
import axios from 'axios';
import { authService } from '../services/authService';
import { uploadService } from '../services/uploadService';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';

const NewsPage = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    imageUrl: '',
    status: 'PUBLISHED'
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get('https://karochebama.com/api/v1/news');
      setNews(res.data);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (article: any) => {
    setFormData({
      title: article.title,
      content: article.content,
      imageUrl: article.imageUrl || '',
      status: article.status
    });
    setEditingId(article.id);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      let finalImageUrl = formData.imageUrl;
      if (imageFile) {
        finalImageUrl = await uploadService.uploadImage(imageFile);
      }
      
      const payload = { ...formData, imageUrl: finalImageUrl };
      const token = authService.getToken();

      if (editingId) {
        await axios.put(`https://karochebama.com/api/v1/news/${editingId}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert("Article mis à jour !");
      } else {
        await axios.post('https://karochebama.com/api/v1/news', payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert("Article publié avec succès !");
      }

      closeDialog();
      fetchData();
    } catch (error: any) {
      console.error('Error saving news article:', error);
      alert("Erreur : " + (error.response?.data?.error || error.message));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) return;
    try {
      const token = authService.getToken();
      await axios.delete(`https://karochebama.com/api/v1/news/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.message || "Erreur lors de la suppression");
    }
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingId(null);
    setFormData({ title: '', content: '', imageUrl: '', status: 'PUBLISHED' });
    setImageFile(null);
  };

  const columns = [
    { 
      id: 'title', 
      label: 'Titre',
      format: (val: string, row: any) => (
        <div className="flex items-center gap-3">
          {row.imageUrl ? (
            <img src={row.imageUrl.startsWith('http') ? row.imageUrl : `https://karochebama.com/api/v1${row.imageUrl}`} alt={val} className="w-10 h-10 rounded-xl object-cover" />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Newspaper size={20} />
            </div>
          )}
          <span className="font-bold text-slate-900">{val}</span>
        </div>
      )
    },
    { 
      id: 'content', 
      label: 'Extrait',
      format: (val: string) => <span className="text-sm text-slate-500 line-clamp-1">{val.substring(0, 50)}...</span>
    },
    { 
      id: 'status', 
      label: 'Statut',
      format: (val: string) => (
        <span className={`px-2 py-1 rounded-md text-xs font-bold ${val === 'PUBLISHED' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}`}>
          {val}
        </span>
      )
    },
    {
      id: 'actions',
      label: 'Actions',
      format: (_: any, row: any) => (
        <div className="flex items-center gap-2">
          <button 
            onClick={() => handleEdit(row)}
            className="p-2 hover:bg-primary-50 text-primary-500 rounded-lg transition-colors"
          >
            <Edit size={16} />
          </button>
          <button 
            onClick={() => handleDelete(row.id)}
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
          <h1 className="text-2xl font-extrabold text-slate-900 font-outfit tracking-tight">Actualités</h1>
          <p className="text-sm text-slate-500 mt-1">Gérez le blog et les dernières nouvelles.</p>
        </div>
        <button onClick={() => setIsDialogOpen(true)} className="px-4 py-2 bg-primary-500 text-white rounded-xl text-sm font-bold hover:bg-primary-600 flex items-center gap-2 shadow-lg shadow-primary-500/20">
          <PlusCircle size={18} /> Rédiger un Article
        </button>
      </div>

      <DataTable columns={columns} data={news} loading={loading} />

      <Modal isOpen={isDialogOpen} onClose={closeDialog} title={editingId ? "Modifier l'Article" : "Nouvel Article"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Titre</label>
            <input 
              type="text" required 
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-primary-500/20"
              value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Contenu</label>
            <textarea 
              required rows={6}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-primary-500/20"
              value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})}
            ></textarea>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Image de couverture</label>
            <input 
              type="file" 
              accept="image/*"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-primary-500/20"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setImageFile(e.target.files[0]);
                }
              }}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Statut</label>
            <select 
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none"
              value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}
            >
              <option value="PUBLISHED">Publié</option>
              <option value="DRAFT">Brouillon</option>
            </select>
          </div>
          <button 
            type="submit" 
            disabled={saving}
            className={`w-full py-3 bg-primary-500 text-white rounded-2xl font-bold text-sm hover:bg-primary-600 shadow-lg shadow-primary-500/20 ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {saving ? 'Publication en cours...' : 'Publier'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default NewsPage;

