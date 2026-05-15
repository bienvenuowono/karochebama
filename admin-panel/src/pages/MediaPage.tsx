import React, { useState, useEffect } from 'react';
import { PlusCircle, Video, Trash2, Edit } from 'lucide-react';
import axios from 'axios';
import { authService } from '../services/authService';
import { uploadService } from '../services/uploadService';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';

const MediaPage = () => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    url: '',
    type: 'IMAGE'
  });
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get('https://karochebama.com/api/v1/media');
      setMedia(res.data);
    } catch (error) {
      console.error('Error fetching media:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: any) => {
    setFormData({
      title: item.title || '',
      description: item.description || '',
      url: item.url,
      type: item.type
    });
    setEditingId(item.id);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      let finalUrl = formData.url;
      if (mediaFile) {
        finalUrl = await uploadService.uploadImage(mediaFile);
      }
      
      const payload = { ...formData, url: finalUrl };
      const token = authService.getToken();

      if (editingId) {
        await axios.put(`https://karochebama.com/api/v1/media/${editingId}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert("Média mis à jour !");
      } else {
        await axios.post('https://karochebama.com/api/v1/media', payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert("Média ajouté !");
      }

      closeDialog();
      fetchData();
    } catch (error: any) {
      console.error('Error saving media:', error);
      alert("Erreur : " + (error.response?.data?.error || error.message));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce média ?")) return;
    try {
      const token = authService.getToken();
      await axios.delete(`https://karochebama.com/api/v1/media/${id}`, {
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
    setFormData({ title: '', description: '', url: '', type: 'IMAGE' });
    setMediaFile(null);
  };

  const columns = [
    { 
      id: 'url', 
      label: 'Aperçu',
      format: (val: string, row: any) => (
        <div className="flex items-center gap-3">
          {row.type === 'IMAGE' ? (
             <img src={val ? (val.startsWith('http') ? val : `https://karochebama.com/api/v1${val}`) : ''} alt="media" className="w-12 h-12 rounded-lg object-cover bg-slate-100" />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-red-50 text-red-500 flex items-center justify-center">
              <Video size={20} />
            </div>
          )}
          <div>
             <span className="font-bold text-slate-900 block">{row.title || 'Sans titre'}</span>
             <span className="text-xs text-slate-500">{row.type}</span>
          </div>
        </div>
      )
    },
    { 
      id: 'description', 
      label: 'Description',
      format: (val: string) => <span className="text-sm text-slate-500 line-clamp-1">{val || '-'}</span>
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
          <h1 className="text-2xl font-extrabold text-slate-900 font-outfit tracking-tight">Galerie Médias</h1>
          <p className="text-sm text-slate-500 mt-1">Gérez les images et vidéos du site.</p>
        </div>
        <button onClick={() => setIsDialogOpen(true)} className="px-4 py-2 bg-primary-500 text-white rounded-xl text-sm font-bold hover:bg-primary-600 flex items-center gap-2 shadow-lg shadow-primary-500/20">
          <PlusCircle size={18} /> Ajouter Média
        </button>
      </div>

      <DataTable columns={columns} data={media} loading={loading} />

      <Modal isOpen={isDialogOpen} onClose={closeDialog} title={editingId ? "Modifier Média" : "Ajouter Média"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Type de Média</label>
            <select 
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none"
              value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}
            >
              <option value="IMAGE">Image</option>
              <option value="VIDEO">Vidéo</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Fichier Média (Optionnel si URL fournie)</label>
            <input 
              type="file" 
              accept={formData.type === 'IMAGE' ? "image/*" : "video/*"}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-primary-500/20"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setMediaFile(e.target.files[0]);
                }
              }}
            />
            <p className="text-xs text-slate-400 mt-2 ml-1">Ou entrez une URL externe ci-dessous</p>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">URL du fichier</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-primary-500/20"
              value={formData.url} onChange={(e) => setFormData({...formData, url: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Titre (Optionnel)</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-primary-500/20"
              value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Description (Optionnel)</label>
            <textarea 
              rows={2}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-primary-500/20"
              value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
            ></textarea>
          </div>
          <button 
            type="submit" 
            disabled={saving}
            className={`w-full py-3 bg-primary-500 text-white rounded-2xl font-bold text-sm hover:bg-primary-600 shadow-lg shadow-primary-500/20 ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default MediaPage;

