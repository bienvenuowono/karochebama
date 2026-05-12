import React, { useState, useEffect } from 'react';
import { PlusCircle, Layers, Trash2, Edit } from 'lucide-react';
import axios from 'axios';
import { authService } from '../services/authService';
import { uploadService } from '../services/uploadService';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    status: 'ONGOING'
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
      const res = await axios.get('http://localhost:5001/api/v1/projects');
      setProjects(res.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (project: any) => {
    setFormData({
      title: project.title,
      description: project.description,
      imageUrl: project.imageUrl || '',
      status: project.status
    });
    setEditingId(project.id);
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
        await axios.put(`http://localhost:5001/api/v1/projects/${editingId}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert("Projet mis à jour !");
      } else {
        await axios.post('http://localhost:5001/api/v1/projects', payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert("Projet enregistré !");
      }

      closeDialog();
      fetchData();
    } catch (error: any) {
      console.error('Error saving project:', error);
      alert("Erreur : " + (error.response?.data?.error || error.message));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) return;
    try {
      const token = authService.getToken();
      await axios.delete(`http://localhost:5001/api/v1/projects/${id}`, {
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
    setFormData({ title: '', description: '', imageUrl: '', status: 'ONGOING' });
    setImageFile(null);
  };

  const columns = [
    { 
      id: 'title', 
      label: 'Titre',
      format: (val: string, row: any) => (
        <div className="flex items-center gap-3">
          {row.imageUrl ? (
            <img src={row.imageUrl.startsWith('http') ? row.imageUrl : `http://localhost:5001${row.imageUrl}`} alt={val} className="w-10 h-10 rounded-xl object-cover" />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Layers size={20} />
            </div>
          )}
          <span className="font-bold text-slate-900">{val}</span>
        </div>
      )
    },
    { 
      id: 'description', 
      label: 'Description',
      format: (val: string) => <span className="text-sm text-slate-500 line-clamp-1">{val}</span>
    },
    { 
      id: 'status', 
      label: 'Statut',
      format: (val: string) => (
        <span className={`px-2 py-1 rounded-md text-xs font-bold ${val === 'COMPLETED' ? 'bg-green-100 text-green-700' : val === 'ONGOING' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
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
          <h1 className="text-2xl font-extrabold text-slate-900 font-outfit tracking-tight">Projets</h1>
          <p className="text-sm text-slate-500 mt-1">Gérez les projets affichés sur le site vitrine.</p>
        </div>
        <button onClick={() => setIsDialogOpen(true)} className="px-4 py-2 bg-primary-500 text-white rounded-xl text-sm font-bold hover:bg-primary-600 flex items-center gap-2 shadow-lg shadow-primary-500/20">
          <PlusCircle size={18} /> Nouveau Projet
        </button>
      </div>

      <DataTable columns={columns} data={projects} loading={loading} />

      <Modal isOpen={isDialogOpen} onClose={closeDialog} title={editingId ? "Modifier le Projet" : "Nouveau Projet"}>
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
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Description</label>
            <textarea 
              required rows={3}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-primary-500/20"
              value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
            ></textarea>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Image (Optionnel)</label>
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
              <option value="PLANNED">Planifié</option>
              <option value="ONGOING">En cours</option>
              <option value="COMPLETED">Terminé</option>
            </select>
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

export default ProjectsPage;

